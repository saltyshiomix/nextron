const { withTypeScript } = require('nextron')
module.exports = withTypeScript()

exports.webpack = config => Object.assign(config, {
  target: 'electron-renderer'
})

exports.exportPathMap = () => ({
  '/home': { page: '/home' }
})
