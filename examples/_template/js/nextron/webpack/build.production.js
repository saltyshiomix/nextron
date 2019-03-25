#!/usr/bin/env node

const webpack = require('webpack');
const config = require('./webpack.main.config');

const compiler = webpack(config('production'));

compiler.run((err, stats) => {
  if (err) {
    console.error(err);
    return;
  }
});
