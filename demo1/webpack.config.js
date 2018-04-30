const webpack = require('webpack')
const path = require('path')

module.exports = {
  entry: {
    pageA: './src/pageA.js',
    pageB: './src/pageB.js',
    vendor: ['lodash']
  },

  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
        },
        exclude: /node_modules/,      
      },
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader'
        }
      }
    ]
  },

  plugins: [
    // 提取指定文件的公共部分
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'common',
    // 重复两次
    //   minChunks: 2,
    //   chunks: ['pageA', 'pageB']
    // }),

    // 打包第三方的库
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity
    }),

    // 项目的业务代码
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    })

    // 简写
    // new webpack.optimize.CommonsChunkPlugin({
    //   names: ['vendor', 'manifest'],
    //   minChunks: Infinity
    // })
  ]
}