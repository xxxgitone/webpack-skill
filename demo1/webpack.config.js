module.exports = {
  entry: {
    app: './index.js' // 相对路径
  },

  output: {
    filename: '[name].[hash:8].js'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
        },
        exclude: /node_modules/,      
      }
    ]
  }
}