var path = require('path')
var webpack = require('webpack')
var ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: {
    app: './src/index.js'
  },

  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: './dist/',
    filename: '[name].bundle.js'
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
              name: 'img/[name]-[hash:5].[ext]',
              publicPath: '',
              outputPath: 'dist/',
              // 生成相对url
              useRelativePath: true
            }
          }
        ]
      },
    ]
  },

  plugins: [
    new ExtractTextWebpackPlugin({
      filename: '[name].min.css',
    }),

    new webpack.optimize.UglifyJsPlugin()
  ]
}
