import npx from 'node-npx'

export default async function packageElectron(args: string[]): Promise<void> {
  npx('electron-builder', args, {
    cwd: process.cwd(),
    stdio: 'inherit'
  })
}
