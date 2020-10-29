import webpack from 'webpack';
import { getWebpackConfig } from './helpers';

const compiler = webpack(getWebpackConfig('production'));

compiler.run((err: Error | undefined, stats: webpack.Stats | undefined) => {
  if (err) {
    console.error(err.stack || err);
  }
  if (stats && stats.hasErrors()) {
    console.error(stats.toString());
  }
});
