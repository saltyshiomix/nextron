#!/usr/bin/env node

const webpack = require('webpack');
const { getwebpackConfig } = require('./helpers');

const compiler = webpack(getwebpackConfig('production'));

compiler.run((err, stats) => {
  if (err) {
    console.error(err);
    return;
  }
});
