module.exports = {
  root: true,
  extends: 'standard',
  plugins: [
    // 在html文件中写js会有检测
    'html'
  ],
  env: {
    browser: true,
    node: true
  },
  rules: {
  }
}
