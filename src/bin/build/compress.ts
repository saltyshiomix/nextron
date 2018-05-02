import * as fs from 'fs-extra'
import { join, basename } from 'path'
import * as archiver from 'archiver'
import * as spinner from '../../spinner'

const compress = (outputDir: string, target: string, config: any) => new Promise<void>(async resolve => {
  if (process.platform !== 'darwin') {
    resolve()
    return
  }

  spinner.create('Wrapping bundle into a ZIP archive')

  const { slug, version } = config

  const name = `${slug}-${version}-mac.zip`
  const path = join(outputDir, name)
  const output = fs.createWriteStream(path)

  const archive = archiver('zip', {
    zlib: {
      level: 9
    }
  })

  output.on('close', resolve)

  archive.pipe(output)
  archive.directory(target, basename(target))
  archive.finalize()
})

export default compress
