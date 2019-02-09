import { watchFile } from 'fs'
import { join } from 'path'
import { app } from 'electron'

export default function enableHotReload() {
  watchFile(join(process.cwd(), 'app/background.js'), () => {
    app.exit(0)
  })
}
