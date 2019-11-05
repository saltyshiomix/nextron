import webpack from 'webpack';
import { getWebpackConfig } from './helpers';

const compiler = webpack(getWebpackConfig('production'));

compiler.run((err: Error, stats: webpack.Stats) => {
  err && console.error(err.stack || err);
  stats.hasErrors() && console.error(stats.toString());
});
