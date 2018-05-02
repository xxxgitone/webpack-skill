# webpack技能

### 编译es6/es7+

```bash
npm install "babel-loader@^8.0.0-beta" @babel/core @babel/preset-env webpack
```
配置

```javascript
rules: [
  {
    // 注意别写成字符串形式，test: '/\.js$/'，尴尬
    test: /\.js$/,
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
    exclude: /node_modules/
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
      },
      "debug": true
    }]
  ],

  "plugins": [
    "@babel/plugin-transform-runtime"
  ]
}
```

### 编译`typescript`

安装

```bash
npm i typescript ts-loader -S
```

> 如果使用的是webpack3，ts-loader记得指定低版本的比如`ts-loader@3.5.0`，要不然会报错

配置`webpack.config.js`

```js
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
````


根目录新建`tsconfig.json`文件

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "es5",
    "allowJs": true
  },
  "include": [
    "./src/*"
  ],
  "exclude": [
    "./node_modules"
  ]
}
```

在`typescript`中使用第三方库的时候，如果需要类型判断，则需要安装第三方的类型库

比如`npm i @types/lodash -D`安装完成后，当使用`lodash`方法的时候就会有对应的类型判断功能。

### 提取公用代码`CommonsChunkPlugin`

当多个js文件引用同一个代码块，将相同的代码提取出来，这样相同的代码页面只要加载一次就可以

`CommonsChunkPlugin`是`webpack`内置的一个插件，所以使用的时候要安装`webapck`进依赖,即`npm i webapck -D`

默认情况下，需要配置多个入口`entry`才能提取出公共模块，很多时候也需要将第三方库也打包成公共模块

配置入口项

```js
entry: {
  // 两个页面，它们使用了相同的模块
  pageA: './src/pageA.js',
  pageB: './src/pageB.js',
  // 这是第三方模块，单独一个入口
  vendor: ['lodash', 'axios']
}

output: {
  path: path.resolve(__dirname, './dist'),
  filename: '[name].bundle.js',
  chunkFilename: '[name].chunk.js'
},

/* 省略...*/

// 配置插件
plugins: [
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
```

当我们如果想要将业务代码和三方库代码打包到一个文件下，我们只要使用一次`CommonsChunkPlugin`即可

```js
new webpack.optimize.CommonsChunkPlugin({
  name: 'vendor',
  minChunks: Infinity
})
```

这样业务代码和三方库代码都会打包进入`vendor.bundle.js`中

另外，也可以提取的页面

```js
plugins: [
  new webpack.optimize.CommonsChunkPlugin({
    name: 'common',
    // 重复两次就提取出来
    minChunks: 2,
    chunks: ['pageA', 'pageB']
  }),
]
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

