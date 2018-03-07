# webpack技能

### webpack打包速度优化

#### 速度影响因素: 文件多,依赖多,页面多!

#### 第三方代码和业务代码分离(vendor和app)

第三方代码修改不多,比如vue,elementui,axios等,就没有必要每一次都进行打包

#### 优化UglifyJsPlugin

parallel: 让loader变成并行处理
cache

#### sourcemap

#### cache-loader
