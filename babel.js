const { join } = require('path');
const cwd = process.cwd();
const { devDependencies = {} } = require(join(cwd, 'package.json'));

const isTSEnabled = Object.keys(devDependencies).includes('typescript');

module.exports = (_context, opts = {}) => {
  // TODO: maybe read from package.json
  const { electron: electronVersion = '3.1.9' } = opts;

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            browsers: `electron>=${electronVersion}`,
          },
        },
      ],
      '@babel/preset-react',
      isTSEnabled && '@babel/typescript',
    ].filter(Boolean),
  };
};
