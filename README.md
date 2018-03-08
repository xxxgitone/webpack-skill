# webpack技能

### webpack打包速度优化

#### 速度影响因素: 文件多,依赖多,页面多!

#### 第三方代码和业务代码分离(vendor和app)

在我们项目中经常会用到许多的三方库,比如vue,elementui,axios等,我们修改自己的业务代码,进行打包,发现每次这些第三方库也会一起再打包一次.其实三方库我们基本不会去变动它,除非进行升级之类的操作,每次都打包它们,显然有些浪费时间.

使用Dll插件可以解决这个问题,Dll是webpack的内置插件,其原理借鉴了windows系统的dll,一个单纯的依赖包,供你开发引用.

使用dll打包,先需要编写单独的配置文件,专门用来打包这些三方库,三方库打包出来以后会有其索引,并放在`manifest.js`文件中,然后在打包业务代码的时候,只需要引用对应的`manifest.json`文件就可以了.

对应的`webpack.dll.config.js`文件配置信息

```javascript
const path = require('path')
const webpack = require('webpack')

const vendors = [
  'vue',
  'vue-router',
  'vuex',
  'axios',
  'element-ui'
]

module.exports = {
  entry: {
    vendor: vendors
  }
  output: {
    path: path.join(__dirname, '../src/dll/'),
    filename: '[name].dll.js',
    library: '[name]'
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, '../src/dll/', '[name]-manifest.json'),
      name: '[name]' // name是dll暴露的对象名,跟output.library保持一致
    }),
    new webpack.optimize.UglifyJsPlugin()
  ]
}
```

然后在业务代码打包的配置文件中配置引用

```javascript
new webpack.DllReferencePlugin({
  manifest: require('../src/dll/ui-manifest.json')
})
```


#### 优化UglifyJsPlugin

parallel: 让loader变成并行处理
cache

#### sourcemap

#### cache-loader
