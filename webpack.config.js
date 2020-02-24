const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    app: path.resolve(__dirname, './index.js')
  },
  devtool: 'inline-source-map',
  devServer: {
    index: 'index.html',
    watchContentBase: true,
    open: 'http://localhost:8080',
    stats: 'errors-only',
    watchOptions: {
      poll: true
    }
  },
  output: {
    filename: '[name].js',
    publicPath: '/'
  },
  plugins: [
    new UglifyJsPlugin({
      uglifyOptions: {
        warnings: false,
        ecma: 5
      },
      sourceMap: true
    }),
    new HtmlWebpackPlugin()
  ]
}
