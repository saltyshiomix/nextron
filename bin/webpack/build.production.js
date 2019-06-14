#!/usr/bin/env node

const webpack = require('webpack');
const { getWebpackConfig } = require('./helpers');

const compiler = webpack(getWebpackConfig('production'));

compiler.run((err, stats) => {
  if (err) {
    console.error(err);
    return;
  }
});
