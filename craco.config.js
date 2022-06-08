const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const path = require('path')

module.exports = {
  module: {
    rules: [{
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    }, {
      test: /\.ttf$/,
      use: ['file-loader']
    }]
  },
  webpack: {
    plugins: [
      new NodePolyfillPlugin()
    ]
  },
}
