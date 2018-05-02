import * as cluster from 'cluster'
import runMain from '../dev/main'
import prepareRenderer from '../dev/renderer'

export default function dev(): void {
  const children = [
    'next',
    'electron'
  ]

  if (cluster.isMaster) {
    cluster.on('listening', () => cluster.fork())
    cluster.fork()
    return
  }

  const { id } = cluster.worker
  const type = children[id - 1]

  if (type === 'next') {
    prepareRenderer()
  } else if (type === 'electron') {
    runMain()
  }
}
