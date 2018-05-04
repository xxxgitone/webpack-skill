var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: {
    app: './src/index.js'
  },

  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/',
    filename: 'js/[name]-[hash:7].js'
  },

  module: {
    rules: [
      {
        test: /.scss$/,
        use: ExtractTextWebpackPlugin.extract({
          fallback: {
            loader: 'style-loader'
          },
          use: [
            {
              loader: 'css-loader',
            },
            {
              loader: 'sass-loader'
            }
          ]
        })
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'img/[name]-[hash:7].[ext]',
              outputPath: 'assets/imgs/',
            }
          }
        ]
      },
    ]
  },

  plugins: [
    new ExtractTextWebpackPlugin({
      filename: 'css/[name]-[hash:7].css',
    }),
    new HtmlWebpackPlugin({
      // 默认就是
      filename: 'index.html',
      template: './index.html',
      // 是否自动插入生成的css和js文件,默认true
      // inject: false,
      // 指定需要载入的chunks，默认载入enry所有的
      // chunks: ['app']
      // 压缩
      // minify: {
      //   collapseWhitespace: true
      // }
    }),
    new webpack.optimize.UglifyJsPlugin()
  ]
}
