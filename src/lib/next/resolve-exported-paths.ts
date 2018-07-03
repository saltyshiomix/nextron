export default function resolveExportedPaths(content: string) : string {
  return content.replace(/\/_next\//g, '../_next/').replace(/\/_error\//g, '../_error/')
}
