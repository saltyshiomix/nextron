import fs from 'fs'
import path from 'path'

export const getNextronConfig = () => {
  const nextronConfigPath = path.join(process.cwd(), 'nextron.config.js')
  if (fs.existsSync(nextronConfigPath)) {
    return require(nextronConfigPath)
  } else {
    return {}
  }
}
