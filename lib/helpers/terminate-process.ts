import { spawnSync } from 'child_process'
import type { ChildProcess } from 'child_process'

export function terminateProcess(child: ChildProcess | undefined) {
  if (!child?.pid || child.exitCode !== null || child.signalCode !== null) {
    return
  }

  if (process.platform === 'win32') {
    // The command may be a .cmd wrapper around Node and Electron. Killing
    // only that wrapper leaves the application and its children running.
    // Keep handles to its current tree, including its creation times, and
    // wait until those processes exit and release their debugger ports.
    const script = `
$ErrorActionPreference = 'Stop'
$deadline = [DateTime]::UtcNow.AddSeconds(10)
$all = @(Get-CimInstance Win32_Process)
$byId = @{}
foreach ($entry in $all) { $byId[$entry.ProcessId] = $entry }
if (-not $byId.ContainsKey([uint32]${child.pid})) {
  $root = Get-Process -Id ${child.pid} -ErrorAction SilentlyContinue
  if ($null -eq $root) { return }
  try {
    if ($root.HasExited) { return }
  } finally { $root.Dispose() }
  throw "Process ${child.pid} is no longer present"
}
$owned = [System.Collections.Generic.HashSet[uint32]]::new()
[void]$owned.Add(${child.pid})
$ordered = @($byId[[uint32]${child.pid}])
do {
  $changed = $false
  foreach ($entry in $all) {
    $parent = $byId[$entry.ParentProcessId]
    if ($null -ne $parent -and $owned.Contains($entry.ParentProcessId) -and
        $entry.CreationDate -ge $parent.CreationDate -and $owned.Add($entry.ProcessId)) {
      $ordered += $entry
      $changed = $true
    }
  }
} while ($changed)
$handles = @()
try {
  foreach ($entry in $ordered) {
    $target = Get-Process -Id $entry.ProcessId -ErrorAction SilentlyContinue
    if ($null -eq $target) { continue }
    try {
      if ($target.StartTime.ToUniversalTime().ToString('yyyyMMddHHmmssffffff') -ne
          $entry.CreationDate.ToUniversalTime().ToString('yyyyMMddHHmmssffffff')) {
        $target.Dispose()
        continue
      }
      [void]$target.Handle
      $handles += $target
    } catch {
      $target.Dispose()
      if (Get-Process -Id $entry.ProcessId -ErrorAction SilentlyContinue) { throw }
    }
  }
  foreach ($target in $handles) {
    try {
      if (-not $target.HasExited) { $target.Kill() }
    } catch {
      if (-not $target.HasExited) { throw }
    }
  }
  foreach ($target in $handles) {
    $remaining = [Math]::Max(0, [int]($deadline - [DateTime]::UtcNow).TotalMilliseconds)
    if (-not $target.WaitForExit($remaining)) {
      throw "Process $($target.Id) did not exit"
    }
  }
} finally {
  foreach ($target in $handles) { $target.Dispose() }
}
`
    const result = spawnSync(
      'powershell.exe',
      ['-NoProfile', '-NonInteractive', '-Command', script],
      { windowsHide: true, encoding: 'utf8', timeout: 15000 }
    )
    if (result.error) {
      throw result.error
    }
    if (result.status !== 0) {
      throw new Error(
        `Cannot terminate process tree for PID ${child.pid}: ${result.stderr}`
      )
    }
    return
  }

  // Retain Execa's signal forwarding and force-kill timeout on other platforms.
  child.kill()
}
