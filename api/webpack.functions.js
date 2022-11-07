// eslint-disable-next-line no-unused-vars
const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

const config = {
  entry: './server.js',
  output: {
    // eslint-disable-next-line no-undef
    path: path.resolve(__dirname, './functions/'),
    filename: 'server.js',
    publicPath: './functions/'
  },
  module: {
    rules: [
      {
        test: /\.?(js|jsx|ts)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env'],
              ['@babel/preset-typescript']
            ]
          }
        }
      },
      {
        test: /\.txt$/, use: 'raw-loader',
      },
      {
        test: /\.node$/,
        loader: 'node-loader'
      },
      {
        test: /\.sh$/,
        use: 'shell-loader'
      }
    ]
  },
  externals: [nodeExternals()]

};
console.log("config");
module.exports = config;