module.exports = {
  entry: {
    app: './src/index.ts'
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
      },
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader'
        }
      }
    ]
  }
}