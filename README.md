# webpack技能

### 编译es6/es7+

```bash
npm install "babel-loader@^8.0.0-beta" @babel/core @babel/preset-env webpack
```
配置

```javascript
rules: [
  {
    
    test: '/\.js$/',
    // use: 'babel-loader'
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env', {
          targets: {
            browsers: ['> 1%', 'last 2 versions', 'not ie <= 8']
          }
        }]
      }
    },
    exclude: '/node_modules/'
  }
]
```

`targets.browsers`表示支持的浏览器，[详细列表](https://github.com/browserslist/browserslist)

##### `babel`插件

使用`babel-loader`编译，默认只会编译语法，比如箭头函数等。但是很多api并不会进行编译，比如`Generator`, `Set`, `Map`, `Array`的`includes`方法等。需要使用插件

* `babel-polyfill`: 全局编译，直接全局引用即可，适用于开发应用

安装

```bash
npm i babel-polyfill -S
```

使用

```js
import 'babel-polyfill'
```

* `babel-runtime-transform`: 局部编译，不会污染全局，适用于开发框架

安装

```bash
npm i @babel/plugin-transform-runtime -D

npm i @babel/runtime -S
```

使用,配置根目录下的`.babelrc`

```json
{
  "presets": [
    ["@babel/preset-env", {
      "targets": {
        "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
      }
    }]
  ],

  "plugins": [
    "@babel/transform-runtime"
  ]
}
```

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

webpack打包默认为链式,使用`parallel`可以让打包并行,多个loader共同工作,节约时间
```javascript
new UglifyJsPlugin({
  parallel: true,
  cache: true // 开启缓存
})
```

#### sourcemap

也可以将sourcemap关掉,缺点就是当线上代码有问题的时候,不好调试

### 长缓存优化

#### 什么是长缓存

