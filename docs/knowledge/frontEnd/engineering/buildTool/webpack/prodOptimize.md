---
title: webpack 生产环境优化
star: true
order: 5
---

> 开发环境注重开发效率，生产环境注重运行效率

- 开发环境所使用的 soucre map 和 HMR 等 webpack 特性会生成或向打包文件中添加一些生产环境用不到的内容
- 针对这个问题，webpack4 推出了模式(mode)，它提供了不同模式下的预设配置
  - 其中 production 模式内部开启了很多通用的优化功能
- 同时，webpack 也建议开发者为不同的工作环境创建不同的配置，以便于打包结果适用于不同的环境

## 不同环境下的配置

### 1. 配置文件根据环境不同，导出不同的配置（中小型项目）

- webpack 配置文件可以导出一个返回配置对象的函数
- 函数接收两个参数：
  1. env 接收 cli 命令中的环境名（--env）参数
  2. argv 是 cli 命令中的所有参数
- 这样就可以在函数中根据 env 判断，对配置做调整，也可以通过环境变量来判断

```js
// webpack.config.js
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = (env, argv) => {
  const config = {
    mode: 'development',
    entry: './src/main.js',
    output: {
      filename: 'js/bundle.js'
    },
    devtool: 'cheap-eval-module-source-map',
    devServer: {
      hot: true,
      contentBase: 'public'
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader'
          ]
        },
        {
          test: /\.(png|jpe?g|gif)$/,
          use: {
            loader: 'file-loader',
            options: {
              outputPath: 'img',
              name: '[name].[ext]'
            }
          }
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Webpack Tutorial',
        template: './src/index.html'
      }),
      new webpack.HotModuleReplacementPlugin()
    ]
  }

  if (env === 'production') {
    config.mode = 'production'
    config.devtool = false
    config.plugins = [
      ...config.plugins,
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin(['public'])
    ]
  }

  return config
}
```

- 通过判断环境名参数去返回不同的配置对象，这种方式只适合中小型项目
  - 因为随着项目变得复杂，不同环境的配置也变得复杂起来，不方便在一个配置文件中去维护
- 对于大型项目还是建议使用，一个环境对应一个配置文件的方式去维护

### 2. 一个环境对应一个配置文件（大型项目）

- 一般这种项目中会配置至少3个 webpack 配置文件
  - 其中两个用来适配不同的环境(dev/development、prod/production)，另一个存放公共的配置(common/base)

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Engineering/Webpack/28.png)

- 在 dev 和 prod 配置文件中，导入公共配置对象 common 并将其复制到当前导出的对象中，最后用当前环境的配置对象覆盖
  - 由于 Object.assign 是浅拷贝，使用它来覆盖公共配置是不合适的
  - 可以使用 webpack-merge 模块完成合并 webpack 配置的需求，它内部自动处理合并的逻辑 

```js
const merge = require('webpack-merge')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const common = require('./webpack.common')

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin(['public'])
  ]
})
```

- 由于现在没有默认的配置文件（webpack.config.js），所以需要使用`--config`参数指定使用的配置文件
  - 例如：`yarn webpack --config webpack.prod.js`
  - 可以将命令配置到 package.json 的 scripts 中

```json
{
  "scripts": {
    "build": "webpack --config webpack.prod.js"
  },
}
```

## webpack 主要优化配置

- webpack4 的 production 模式下，内部就自动开启很多通用的优化功能
- 开箱即用非常方便，但是也导致忽略掉很多需要了解的东西，以至于出现问题后无从下手
- 先看下 webpack 主要优化配置以及 webpack 是如何去优化打包结果的

### 1. DefinePlugin 插件注入全局成员

> DefinePlugin 插件用于为代码注入全局成员

- production 模式下，默认会启用这个插件，并且向代码中注入了一个 process.env.NODE_ENV 的全局常量
  - 很多第三方的模块都是通过这个成员判断当前的运行环境，从而决定是否执行一些操作，例如：打印日志
- DefinePlugin 插件接收一个对象，对象中的的 key-value 都会被注入到代码当中

```js
const webpack = require('webpack')
module.exports = {
	plugins: [
		new webpack.DefinePlugin({
			// 全局注入一个 API 地址
			API_BASE_URL: 'https://api.example.com',
      // value 应是一个符合 JS 语法的代码片段
			// API_BASE_URL: '"https://api.example.com"'
			// API_BASE_URL: JSON.stringify('https://api.example.com')
		})
	]
}
```

- 打包时，就会将 API_BASE_URL 的值，直接替换代码中的 API_BASE_URL
  - 开发时：console.log(API_BASE_URL)
  - 打包后：console.log(https://api.example.com)
- 由此可知，DefinePlugin 定义的成员的值，实际上是一个符合 JS 语法的代码片段
  - 它会在打包时直接替换代码中的 key
  - 所以 API_BASE_URL 配置的值可以改为 '"https://api.example.com"'

> [!tips]
小技巧：如果 value 为一个值，可以通过 JSON.stringify 将其转换成一个表示这个值的代码片段

- DefinePlugin 插件可以用于针对不同的环境注入对应的全局成员

### 2. Tree-shaking

> 字面意思就是伴随着摇树的动作，树上的枯树枝和树叶就会掉落下来

- web 开发术语 Tree-shaking 也是相同的道理，它表示「摇掉」代码中未引用的部分（未引用代码dead-code）

> [!info]
> MDN：Tree-shaking 通常用于描述移除 JavaScript 上下文中的未引用代码(dead-code)的行为
> 它依赖于 ES6 中的 import 和 export 语句，用来检测代码模块是否被导出、导入，且被 JavaScript 文件使用

- webpack 生产模式优化中，就有 Tree-shaking 的功能，可以自动检测出代码中未引用的代码，然后移除掉它们
- 示例

```js
// /src/component.js
export const Button = () => {
  return document.createElement('button')

  console.log('dead-code')
}

export const Link = () => {
  return document.createElement('a')
}

export const Heading = level => {
  return document.createElement('h' + level)
}
```

```js
// /src/index.js
// 只导入一个成员
import { Button } from './component'

document.body.append(Button())
```

- 使用生产模式打包后，Tree-shaking 的效果就是，只将 Button 打包进输出文件，其他两个成员由于未使用，而没有打包到输出文件

```js
// /dist/main.js
!(function (e) {
  /*...*/
})([
  function (e, t, n) {
    'use strict'
    n.r(t)
    // 只有Button
    document.body.append(document.createElement('button'))
  },
])
```

- webpack 生产模式中，自动开启了 Tree-shaking 这个功能
- 在 webpack 中就是将多个 JS 文件打包为单个文件时，自动删除未引用的代码，以使最终文件具有简洁的结构和最小化大小

#### 2.1 手动开启 Tree-shaking

- Tree-shaking 并不是 webpack 的某个配置选项，它是一组功能搭配使用后的优化效果
- 这组功能会在生产模式 production 下自动使用

> webpack 官方文档对 Tree-shaking 介绍有些混乱，这里学习如何手动开启它，学习它的工作过程和优化功能

- 上例代码，使用 none 模式打包，查看打包文件，components.js 模块依然保留了 Link 和 Heading

```js
(function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
  
// 导出了3个成员
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Button", function() { return Button; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Link", function() { return Link; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Heading", function() { return Heading; });

// components.js的内容全部打包进来了
const Button = () => {
  return document.createElement('button')

  console.log('dead-code')
}

const Link = () => {
  return document.createElement('a')
}

const Heading = level => {
  return document.createElement('h' + level)
}

})
```

> [!info]
> webpack 配置文件中的 optimization 属性，用于集中去配置 webapck 内部的一些优化功能

- 通过配置 optimization 中的 usedExports 和 minimize 优化功能实现 Tree-shaking

##### 2.1.1 usedExports

- usedExports: true 表示在输出结果中，模块只导出外部使用了的成员
- 打包查看输出文件，components 模块所对应的函数中，就不再去导出 Link 和 Heading 这两个函数

```js
(function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// 只导出了Button
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Button; });
  
// Link和Heading被标记未使用
/* unused harmony export Link */
/* unused harmony export Heading */

// components.js的内容全部打包进来了
const Button = () => {
  return document.createElement('button')

  console.log('dead-code')
}

/** 没有用到的代码 start **/
const Link = () => {
  return document.createElement('a')
}

const Heading = level => {
  return document.createElement('h' + level)
}
/** 没有用到的代码 end **/
})
```

- 此时就可以通过压缩优化，删除掉「没有用到的代码」

##### 2.1.2 minimize

- minimize: true 开启代码压缩优化
- 删除注释、删除没有用到的代码、删除空白、替换变量名为简短的名称等
  - 它使用的是 TerserPlugin 或 optimization .minimizer 中指定的插件
- 再次打包后代码

```js
function (e, t, n) {
  'use strict'

  /*
  压缩前：
  __webpack_require__.d(__webpack_exports__, "a", function() { return Button; });
  */
  n.d(t, 'a', function () { return r })


  /*
  压缩前：
  const Button = () => {
    return document.createElement('button')
  
    console.log('dead-code')
  }
  */
  const r = () => document.createElement('button')
}
```

> [!important]
> webpack 打包后，将每个模块放到一个函数中，其中包含对成员的定义和对成员的导出
> - usedExports 可以标记模块导出的成员是否被外部使用，从而在打包结果中，不导出未使用的成员
>   - 标记打包后表现为：包裹模块的函数中保留定义这些成员的代码，但是移除导出它们的代码，并添加注释/* unused harmony export */
> - 而函数中没有了导出它们的代码，也就表示这些成员未使用，那定义它们的代码也没有了意义，minimize 就会将这些未使用的定义成员的垃圾代码一并删除
> 总的来说就是，usedExports 负责标记「枯树叶、枯树枝」，minimize 负责「摇掉」它们

##### 2.1.3 concatenateModules 合并模块

- 普通的打包结果，是将每个模块单独放在一个函数中，如果模块很多，打包结果中就会有很多这样存放模块的函数
- 开启 concatenateModules: true 打包后，打包后的文件中，就不是一个模块对应一个函数，而是将所有模块都放在一个函数中
  - concatenateModules 的作用就是尽可能的将所有模块合并输出到一个函数中
  - 既提升了运行效率，又减少了代码的体积
  - 这个特性又被称为「Scope Hoisting」，也就是作用域提升
  - 它是 webpack3 增加的特性

### 3. Tree Shaking & Babel

- 由于 webpack 早期发展非常快，变化比较多，当找资料时，找到的结果，并不一定适用于当前所使用的版本
  - 比如 Tree-shaking，很多资料中都表示如果使用了 babel-loader，就会导致 Tree-shaking 失效
- 首先要了解，Tree-shaking 实现的前提，是基于「必须用 ES Modules 组织代码」
  - 即交给 webpack 处理的代码，必须使用 ESM 方式实现模块化

> [!info]
> MDN：Tree-shaking 依赖于 ES6 中的 import 和 export 语句，用来检测代码模块是否被导出、导入，且被 JavaScript 文件使用

- webpack 优化的过程是先将代码交给 loader 去处理，然后再将处理结果优化输出
- 而为了转换代码中的 ECMAScript 新特性，一般会选择 babel-loader 去处理 JS
- 而在 babel-loader 处理代码时，就有可能将代码中的 ESM 转换为 CommonJS

> [!warning]
> 实际上这取决于是否使用了转换 ESM 的 babel 插件，而常用的插件集合 @babel/preset-env 就包含转换 ESM 的插件

- 所以当 @babel/preset-env 工作时，代码中的 ESM 就应该被转换为 CommonJS 
- 所以 webpack 在打包时，拿到的就是 CommonJS 组织的代码，从而 Tree-shaking 也就不能生效

#### 3.1 案例

- 在项目中使用 babel-loader，并仅开启 usedExports，查看打包结果

```js
module.exports = {
  mode: 'none',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  optimization: {
    usedExports: true,
  },
}
```

```js
(function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Button; });
  
// usedExports 生效了，也就是Tree Shaking 生效了
  
/* unused harmony export Link */
/* unused harmony export Heading */
  
var Button = function Button() {
  return document.createElement('button');
  console.log('dead-code');
};
var Link = function Link() {
  return document.createElement('a');
};
var Heading = function Heading(level) {
  return document.createElement('h' + level);
};

})
```

- 发现 usedExports 生效了，也就表示 Tree-shaking 并没有失效
- 这是因为在最新版本的 babel-loader 中自动关闭了转换 ESM 的插件
  - 可以查看 node_modules/babel-loader 模块的源代码(/lib/injectCaller.js)
  - 其中已经通过 supportsStaticESM supportsDynamicImport 标识了支持 ESM 和动态 import 方法（Webpack >= 2 supports ESM and dynamic import.）

```js
"use strict";

const babel = require("@babel/core");

module.exports = function injectCaller(opts, target) {
  if (!supportsCallerOption()) return opts;
  return Object.assign({}, opts, {
    caller: Object.assign({
      name: "babel-loader",
      // Provide plugins with insight into webpack target.
      // https://github.com/babel/babel-loader/issues/787
      target,
      // Webpack >= 2 supports ESM and dynamic import.
      supportsStaticESM: true,
      supportsDynamicImport: true,
      // Webpack 5 supports TLA behind a flag. We enable it by default
      // for Babel, and then webpack will throw an error if the experimental
      // flag isn't enabled.
      supportsTopLevelAwait: true
    }, opts.caller)
  });
};
// ...
```

- 再去查看插件集合源代码（node_module/@babel/preset-env/lib/index.js）
- 翻到下面的代码

```js
const modulesPluginNames = getModulesPluginNames({
    modules,
    transformations: _moduleTransformations.default,
    shouldTransformESM: modules !== "auto" || !(api.caller == null ? void 0 : api.caller(supportsStaticESM)),
    shouldTransformDynamicImport: modules !== "auto" || !(api.caller == null ? void 0 : api.caller(supportsDynamicImport)),
    shouldParseTopLevelAwait: !api.caller || api.caller(supportsTopLevelAwait)
  });
```

- 看到 preset-env 根据 babel-loader 的标识，自动禁用了 ESM 和动态 import 的转换
- 所以 webpack 通过 babel-loader 转换后，打包时还是 ESM 组织的代码，Tree-shaking 也就能正常工作
- 可以通过修改插件集合的配置，开启 ESM 转换

```js
module: {
  rules: [
    {
      test: /\.js$/,
      use: {
        loader: 'babel-loader',
        options: {
          // 注意：仅使用时，是将插件集合名称放到一个数组中
          // presets: ['@babel/preset-env'],

          // 当对插件集合编写配置时，就需要再套一个数组
          // 数组的第一个元素是插件集合的名称
          // 第二个元素是它的配置对象
          presets: [
            [
              '@babel/preset-env',
              {
                // modules 默认是 auto，即根据环境去判断是否开启转换 ESM 插件
                // 这里设置为强制转换为 commonjs
                modules: 'commonjs',
              },
            ],
          ],
        },
      },
    },
  ],
},
```

- 再次打包查看

```js
(function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Heading = exports.Link = exports.Button = void 0;

var Button = function Button() {
  return document.createElement('button');
  console.log('dead-code');
};

exports.Button = Button;

var Link = function Link() {
  return document.createElement('a');
};

exports.Link = Link;

var Heading = function Heading(level) {
  return document.createElement('h' + level);
};

exports.Heading = Heading;

})
```

- 3个成员都被导出，从而压缩优化时，也不会将它们删除

#### 3.2 总结

- 通过以上实验发现，最新版本的 babel-loader，并不会导致 Tree-shaking 失效
- 如果还不确定，也可以尝试将 preset-env 配置中的 modules，设置为 false，这样就会确保，preset-env 不会开启转换 ESM 的插件，同时确保了 Tree-shaking 工作的前提


### 4. sideEffects 副作用

- sideEffects 是 webpack4 新增的功能，允许通过配置的方式去标识代码是否有副作用，从而为 Tree-shaking 提供更多的压缩空间
  - sideEffects 一般用于开发 npm 模块时，标记是否有副作用
  - 官方文档中将它和 Tree-shaking 放在一起讲，所以容易误解为它们是因果关系，实际上二者没什么关系

#### 4.1 副作用

- 副作用：模块执行时除了导出成员之外所作的事情
- 具体场景
  - components 拆分出多个组件文件，在 index.js 中集中导出，便于外界导入，这是一种常见的同类文件组织方式
  - 入口文件导入 components 当中的 button 成员

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Engineering/Webpack/29.png)

- 问题：载入的是 components 目录下的 index，而 index 中又载入了所有组件模块，这导致我们只想载入 button 组件，但是所有的组件模块都会被加载执行，所有组件都会被打包
- sideEffects 特性就可以解决此类问题

```js
module.exports = {
  ...
  optimization: {
    sideEffects: true,
  }
}
```

> [!warning]
> sideEffects 特性在 production 模式下同样也会自动开启

- 开启这个配置后，webpack 在打包时就会先检查当前代码所属的 package.json 当中有没有 sideEffects 的标识
- 如果这个模块没有副作用，那这些没有用到的模块就不再会打包，都会被移除掉

```json
{
  // 当前 package.json 所影响的这个项目，所有的代码都没有副作用
  "sideEffects": false
}
```

> [!warning]
> - webpack 配置中开启的 sideEffects 是用来开启这个功能的
> - package.json 中的 sideEffects 是用来标识代码没有副作用的

#### 4.2 sideEffects 注意事项

- 使用 webpack sideEffects 功能的前提是，确保代码没有副作用
- 否则 webpack 打包时就会误删那些有副作用的代码
- 场景示例
  - extend 文件中，并没有向外导出任何成员，仅仅在 number 对象原型上挂载一个 pad 方法，用来给数字去添加前面的导零
  - 这是一种非常常见的基于原型的扩展方法，在这里属于 extend 模块的副作用
  - 因为在导入 extend 后，number 原型上就会多一个方法

```js
// 为 Number 的原型添加一个扩展方法
Number.prototype.pad = function (size) {
  // 将数字转为字符串 => '8'
  let result = this + ''
  // 在数字前补指定个数的 0 => '008'
  while (result.length < size) {
    result = '0' + result
  }
  return result
}
```

- 此时如果我们还标识项目中所有的代码都没有副作用的话，那这个方法是不会被打包进来的，因为它是副作用代码
- 配置中已经声明没有副作用，那它就会被移除掉

> [!warning]
> 除此之外，在代码中载入的 CSS 模块也都属于副作用模块，同样会有这样的问题

- 解决方法
  - 在 package.json 中关掉副作用，或者标识下当前项目中哪些文件是有副作用的
  - 这样 webpack 就不会忽略这些有副作用的模块了

```json
{
  ...
  "sideEffects": [
    "./src/extend.js",
    "*.css"
  ]
}
```

### 5. Code Splitting 代码分包/代码分割

> 通过 webpack 实现前端项目整体模块化的优势很明显，但是同样存在一些弊端

- 项目中所有的代码最终都会被打包到一起，如果应用非常复杂，模块非常多，打包结果就会特别大 
- 事实上，大多数在应用开始工作时并不是所有模块都必须要加载进来的，但是模块又全部打包到一起，我们需要任何一个模块都必须把整体加载下来过后才能使用
- 而应用一般又运行在浏览器端，这意味着会浪费很多流量和带宽

> [!info]
> 更合理的方案
> - 把打包结果按照一定规则去分离到多个 bundle 中，然后根据应用运行需要，按需去加载这些模块
> - 这样大大提高应用的响应速度以及它的运行效率

- 项目中划分模块的颗粒度一般都会非常的细，很多时候一个模块只是提供一个小小的工具函数，并不能形成一个完整的功能单元
- 如果不把这些散落的模块合并一起，就有可能再去运行一个小小功能时就会加载非常多的模块

> [!warning]
> 目前主流的 HTTP1.1 协议本身就有很多缺陷
> - 不能同时对同一个域名下发起很多次的并行请求
> - 每一次请求都会有一定的延迟
> - 每次请求除了传输具体的内容外，还会有额外的请求头和响应头，浪费带宽流量

- 模块打包是必要的，但是当应用变大，就要开始慢慢变通，webpack 支持一种分包的功能，即代码分割
- 通过把模块按照设计的一个规则打包到不同的 bundle 中，从而提高应用的响应速度
- 目前 webpack 分包提供两种方式
  1. 根据业务去配置不同的打包入口
    - 也就是会有多个入口同时打包，输出多个打包结果
  2. 采用 ESM 的动态导入功能实现模块的按需加载
    - webpack 会自动把动态导入的模块单独输出到一个 bundle 中

#### 5.1 多入口打包 Multi Entry

- 多入口打包一般适用于传统的多页应用程序
- 最常见的划分规则就是一个页面对应一个打包入口
- 对于不同页面公共的部分再去提取到公共结果中

##### 5.1.1 多页应用示例

- index 实现 index 页面上所有功能
- albun 实现相册页面所有功能
- global 公共的样式
- fetch 公共的模块，提供请求 API 的方法

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Engineering/Webpack/30.png)

- 配置多个打包入口
  - 一般配置文件中的 entry 属性只会配置一个文件路径，也就是一个打包入口
  - 如果需要配置多个入口，可以把 entry 定义成一个对象，而不是数组
    - 因为如果定义成数组的话，那它就是把多个文件打包到一起，对于这个应用来讲还是一个入口

```js
module.exports = {
  mode: 'none',
  entry: {
    index: './src/index.js',
    album: './src/album.js'
  },
  output: {
    filename: '[name].bundle.js' // 以占位符的方式动态输出文件名
  },
}
```

> [!warning]
> 小问题：html 文件会同时载入两个打包结果
> - 我们希望一个页面只使用它对应的那个打包输出结果

```html
<script type="text/javascript" src="index.bundle.js"></script>
<script type="text/javascript" src="album.bundle.js"></script>
```

- 解决方法
  - 利用 HtmlWebpackPlugin 插件，这个插件默认会输出一个自动注入所有打包结果的 html
  - 如果需要去指定所输出的 html 所使用的 bundle，可以使用 chunks 属性来设置
  - 每一个打包入口就会形成一个独立的 chunk

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  ...
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Multi Entry',
      template: './src/index.html',
      filename: 'index.html',
      chunks: ['index']
    }),
    new HtmlWebpackPlugin({
      title: 'Multi Entry',
      template: './src/album.html',
      filename: 'album.html',
      chunks: ['album']
    })
  ]
}
```

##### 5.1.2 提取公共模块 Split Chunks

- 多入口打包容易理解、使用，但是存在一个小问题，就是在不同的打包入口中一定有公共部分
- 按照目前多入口的打包方式就会出现在不同的打包结果中会有相同的模块出现
  - 比如在 index 和 albun 里共同使用了 global 和 fetch 两个公共模块
- 所以需要把这些公共模块提取到一个单独的 bundle 中
- webpack 实现提取公共模块的方式就是在优化配置中开启 splitChunks 属性
  - 需要配置一个 chunks 属性，设置为 all 表示把所有公共模块都提取到单独的 bundle 中

```js
module.exports = {
  ...
  optimization: {
    splitChunks: {
      // 自动提取所有公共模块到单独 bundle
      chunks: 'all'
    }
  },
}
```

#### 5.2 动态导入 Dynamic Imports

- 按需加载时开发浏览器应用当中一个非常常见的需求，一般常说的按需加载指的是加载数据
- 这里的按需加载是指在应用运行过程中需要某个模块时，才去加载这个模块，这种方式可以极大的节省带宽和流量
- webpack 中支持以动态导入的方式实现模块的按需加载，所有动态导入的模块都会自动提取到单独的 bundle 中，从而实现分包
- 相比多入口打包的方式，动态导入更灵活，因为可以通过代码的逻辑去控制需不需要加载某个模块，什么时候加载模块
- 分包目的中很重要的一点就是让模块实现按需加载，从而提高应用的响应速度

##### 5.2.1 具体场景

- 文章列表 posts 组件

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Engineering/Webpack/31.png)

- 相册列表 album 组件

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Engineering/Webpack/32.png)

- 打包入口同时导入两个模块，当锚点发生变化时，根据锚点的值决定显示哪个组件
- 如果只打开一个页面，但是另一个页面所对应的组件加载就是浪费

```js
import posts from './posts/posts'
import album from './album/album'
```

- 如果是动态导入组件就不会浪费，动态导入使用的是 ESM 标准中的动态导入
- 在需要动态导入组件的地方，通过 import 函数导入指定路径
  - 这个方法返回一个 promise，通过 then 方法拿到模块对象

```js
if (hash === '#posts') {
  // mainElement.appendChild(posts())
  import('./posts/posts').then(({ default: posts }) => {
    mainElement.appendChild(posts())
  })
} else if (hash === '#album') {
  // mainElement.appendChild(album())
  import('./album/album').then(({ default: album }) => {
    mainElement.appendChild(album())
  })
}
```

- 不需要进行配置，只需要按照 ESM 动态导入成员的方式导入模块，webpack 内部会自动处理分包和按需加载
- 如果使用的是单页应用开发框架（如 vue，react），项目中的路由映射组件，就可以通过这种动态导入的方式，实现按需加载

##### 5.2.2 魔法注释 Magic Comments

- 默认通过动态导入产生的 bundle 文件，它的名称是一个序号，文件名为[number].bundle.js
- 可以通过 webpack 特有的魔法注释，给它们定义名称
- 具体使用就是，在 import 的参数位置(前后都可以)，添加一个特定格式的行内注释

```js
// 格式：/*webpackChunkName:'<name>'*/
import(/* webpackChunkName: 'posts' */'./posts/posts').then(() => {})
import('./posts/posts'/* webpackChunkName: 'album' */).then(() => {})
```

- 如果多个模块使用的相同的 chunkName，那它们最终会被打包到一起，自然不需要提取公共模块，最终只会生成一个文件
- 借助这个特点，就可以根据情况，灵活组织动态导入的模块所输出的文件

### 6. 提取压缩 CSS

#### 6.1 MiniCssExtractPlugin 提取 CSS 到单个文件

> MiniCssExtractPlugin 插件可以将 CSS 内容从打包结果中提取出来，存放到文件中，通过这个插件，就可以实现 CSS 模块的按需加载

- 目前示例中 webpack 使用 CSS 方式，CSS 内容还是存储在 JS 文件中
  1. css-loader：将 JS 中的 CSS 内容解析
  2. style-loader：最终将 CSS 样式通过`<style>`标签方式注入到页面中
- 因为 MiniCssExtractPlugin 插件提取后生成了 CSS 文件，所以就不需要`<style>`标签，而是直接通过`<link>`的方式引入
- 所以使用 MiniCssExtractPlugin，就不需要 style-loader，而是使用插件提供的 loader 实现通过`<link>`标签的方式注入

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          // 'style-loader', // 通过 style 标签注入
          MiniCssExtractPlugin.loader, // 通过 link 标签注入
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin()
  ]
}
```

- 打包后就会在输出目录下，看到提取出来的 CSS 文件了，它的名称使用的是导入它的模块的名称（可能是魔法注释的名称，可能是合并打包成一个文件）
- 打包效果
  - CSS 模块不会被包裹在函数中，作为数组参数的元素被使用
  - 而是在主入口文件执行方法中，以`<link>`标签+文件路径的形式注入到 html 中

> [!important]
> 建议：
> - 如果样式内容不是很多的话，提取到单个文件的效果不是很好
> - 建议 CSS 文件超过150kb左右，才考虑提取到单个文件中
> - 否则 CSS 嵌入到代码中，减少一次请求，效果可能更好

#### 6.2 OptimizeCssAssetsWebpackPlugin 压缩输出的 CSS 文件

> [!warning]
> - 使用 MiniCssExtractPlugin 后，样式就被提取到单独的 CSS 文件中了，webpack 在 production 模式下，会自动压缩优化打包的结果
> - 但是单独提取的 CSS 文件并没有被压缩

- 这是因为 webpack 内置的压缩插件，仅仅支持 JS 文件的压缩，对于其他类型的文件压缩，都需要额外的插件支持
- webpack 推荐使用 optimize-css-assets-webpack-plugin 插件压缩样式文件

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
module.exports = {
  mode: 'none',
  output: {
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          // 'style-loader', // 通过 style 标签注入
          MiniCssExtractPlugin.loader, // 通过 link 标签注入
          'css-loader'
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new OptimizeCssAssetsWebpackPlugin()
  ],
}
```

#### 6.3 optimization.minimizer

- webpack 官方文档介绍时并不是将 OptimizeCssAssetsWebpackPlugin 插件配置在 plugins 数组中，而是配置在 optimization.minimizer 数组中
- 原因
  - 配置在 plugins 中，webpack 就会在启动时使用这个插件
  - 配置在 optimization.minimizer 中，就只会在 optimization.minimize 这个特性开启时使用
- 所以 webpack 推荐，像压缩类的插件，应该配置在 optimization.minimizer 数组中
- 以便于通过 optimization.minimize 统一控制（生产环境会默认开启 minimize）

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
module.exports = {
  mode: 'none',
  output: {
    filename: '[name].bundle.js',
  },
  optimization: {
    minimize: true,
    minimizer: [
      new OptimizeCssAssetsWebpackPlugin()
    ]
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          // 'style-loader', // 通过 style 标签注入
          MiniCssExtractPlugin.loader, // 通过 link 标签注入
          'css-loader'
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
    // new OptimizeCssAssetsWebpackPlugin()
  ],
}
```

> [!warning]
> 这样配置会导致 JS 不会被压缩
> - 原因是 webpack 认为，如果配置了 minimizer，就表示开发者在自定义压缩插件，内部的 JS 压缩器就会被覆盖掉
> - 所以这里还需要手动将它添加回来

- webpack 内部使用的 JS 压缩器是 terser-webpack-plugin，手动添加需要安装这个插件才能使用

```js
// 只展示了添加的代码
const TerserWebpackPlugin = require('terser-webpack-plugin')
module.exports = {
  // ...
  optimization: {
    minimize: true,
    minimizer: [
      new TerserWebpackPlugin(),
      new OptimizeCssAssetsWebpackPlugin()
    ]
  },
  // ...
}
```

### 7. 输出文件名 Hash substitutions

- 一般部署前端的资源文件时，都会启用服务器的静态资源缓存
- 这样对用户的浏览器而言，就可以缓存应用的静态资源，后续就不再需要重复请求服务器获取静态资源文件
- 从而整体提上了应用的响应速度

> [!warning]
> 开启服务器的静态资源缓存也有一些需要注意的地方
> 1. 如果在缓存策略中设置的失效时间过短，效果就不会特别明显
> 2. 如果设置的比较长，一旦这个应用发生了更新，重新部署过后，就没有办法及时更新到客户端

- 为了解决这个问题，建议在生产环境中，在输出的文件名中添加哈希值(Hash)
  - 一旦资源文件发生改变，文件名称也会随之变化
  - 对于客户端而言，新的文件名就会发生新的请求，也就没有缓存，从而实现客户端及时更新
- 这样就可以将缓存策略中的过期时间设置的非常长，而不用担心文件更新的问题

> [!info]
> webpack 的 filename 属性，和绝大多数插件的 filename 属性，都支持通过占位符的方式为文件名设置 hash

#### 7.1 普通 hash

- 项目级别的 hash，一旦项目中有任何改动，当前打包的 hash 就会发生变化

```js
module.exports = {
  ...
  output: {
    filename: '[name]-[hash].bundle.js'
  },
}
```

#### 7.2 chunhash

- chunk 级别的 hash，打包时，只要是同一路的 chunk，使用的 hash 就是一样的
- 动态导入的模块都会形成一个单独的 chunk，这个 chunk 最终生成一个 bundle（JS 文件），如果配置了提取 CSS 文件，模块中引用的 CSS 也会被提取到 CSS 文件中，但它名义上仍然属于这个 chunk
- 例如
  - 通过动态导入方式会生成多个 bundle，而这些 JS 模块中引入的 CSS，如果被提取为 CSS 文件，使用的名称与 JS 模块一致，同样，它们使用的 chunkhash 也一样
  - 而生成的这些 bundle 使用的 chunkhash 就不一样
- 修改一个模块的内容，只会更新这些文件的 chunkhash
  - 同一个 chunk 下的文件（js、css）
  - 使用了这个模块的文件（因为模块名称变化，所以这个文件中引入这个模块的路径也发生了变化，相当于被动改变）
- 相比普通 hash，chunkhash 更精确一些

```js
module.exports = {
  ...
  output: {
    filename: '[name]-[chunkhash].bundle.js'
  },
}
```

#### 7.3 contenthash

- 文件级别，根据输出文件的内容生成的 hash，即不同的文件拥有不同的 hash
- 它影响到的只有
  1. 当前模块生成的文件
  2. 使用这个模块的文件

> [!warning]
> - 如果配置了提取 CSS 文件，CSS 实际上没有被包裹模块的 bundle 中，而是在主 bundle 文件的执行方法中，通过 link 方式注入到 html 中
> - 所以此时修改 CSS 文件，只会更新自己和主 bundle 的 hash，而不会影响引入它的子模块

- contenthash 精确的定位到了文件级别的 hash，只有当文件更新，才会更新它的文件名或路径，最适合解决缓存问题
- hash 长度默认20位，webpack 允许通过在占位符用添加冒号数字的方式指定 hash 的长度
- 建议使用8位就够了

```js
module.exports = {
  ...
  output: {
    filename: '[name]-[contenthash:8].bundle.js'
  },
}
```

