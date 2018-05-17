var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
var CleanWebpackPlugin = require('clean-webpack-plugin')

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
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          },
          {
            loader: 'eslint-loader',
            options: {
              formatter: require('eslint-friendly-formatter')
            }
          }
        ]
      },
      {
        test: /.scss$/,
        use: ExtractTextWebpackPlugin.extract({
          fallback: {
            loader: 'style-loader'
          },
          use: [
            {
              loader: 'css-loader'
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

  devtool: 'cheap-module-eval-source-map',

  devServer: {
    port: 9999,
    // 默认为true，推荐使用默认值
    // inline: false,
    // 开发的单页面的时候用，当访问到不存在的页面时会出现404
    // 设置后会统一跳转到index.html
    historyApiFallback: true,
    // 代理远程接口，使用的是`http-proxy-middleware` https://github.com/chimurai/http-proxy-middleware
    proxy: {
      // 代理地址
      '/api': {
        // 目标地址
        target: 'https://www.example.com',
        //// 跨域
        changeOrigin: true
        // 代理请求头
        // headers:
        // log日志
        // logLevel
      },
    },
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
    // new webpack.optimize.UglifyJsPlugin(),
    new CleanWebpackPlugin(['dist'])
  ]
}
