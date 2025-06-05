---
title: webpack 初探
order: 1
---

## 快速上手

> webpack 作为目前最主流的前端模块打包器，提供一整套前端项目模块化方案，不仅仅局限于只对 JavaScript 的模块化

- 安装依赖 `yarn add webpack webpack-cli --dev`
- 执行命令 `yarn webpack`
- 会默认从 src/index.js 开始打包，并将文件默认输出为 dist 目录下的 main.js 文件
- 打包过程会把 import、export 转换掉，所以引入 js 文件时，就不再需要 `type="module"`

```js
// package.json
{
  "scripts": {
    "build": "webpack"
  },
  "devDependencies": {
    "webpack": "^4.40.2",
    "webpack-cli": "^3.3.9"
  }
}
```

```js
// main.js
!(function (e) {
  var t = {}
  function n(r) {
    if (t[r]) return t[r].exports
    var o = (t[r] = { i: r, l: !1, exports: {} })
    return e[r].call(o.exports, o, o.exports, n), (o.l = !0), o.exports
  }
  ;(n.m = e),
    (n.c = t),
    (n.d = function (e, t, r) {
      n.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: r })
    }),
    (n.r = function (e) {
      'undefined' != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }),
        Object.defineProperty(e, '__esModule', { value: !0 })
    }),
    (n.t = function (e, t) {
      if ((1 & t && (e = n(e)), 8 & t)) return e
      if (4 & t && 'object' == typeof e && e && e.__esModule) return e
      var r = Object.create(null)
      if ((n.r(r), Object.defineProperty(r, 'default', { enumerable: !0, value: e }), 2 & t && 'string' != typeof e))
        for (var o in e)
          n.d(
            r,
            o,
            function (t) {
              return e[t]
            }.bind(null, o)
          )
      return r
    }),
    (n.n = function (e) {
      var t =
        e && e.__esModule ?
          function () {
            return e.default
          }
        : function () {
            return e
          }
      return n.d(t, 'a', t), t
    }),
    (n.o = function (e, t) {
      return Object.prototype.hasOwnProperty.call(e, t)
    }),
    (n.p = ''),
    n((n.s = 0))
})([
  function (e, t, n) {
    'use strict'
    n.r(t)
    const r = (() => {
      const e = document.createElement('h2')
      return (
        (e.textContent = 'Hello world'),
        e.addEventListener('click', () => {
          alert('Hello webpack')
        }),
        e
      )
    })()
    document.body.append(r)
  }
])
```

```html
<body>
  <script src="dist/main.js"></script>
</body>
```

## webpack 配置文件

> webpack 4 以后的版本支持零配置的方式直接启动打包<br>
> 整个打包过程会按照约定，默认将 src/index.js 作为打包入口，最终打包结果会存放在 dist/main.js 中

> [!warning]
> 如何自定义路径？
>
> - 通过在配置文件 webpack.config.js 中配置 entry、output 自定义入口和输出路径

- webpack.config.js 是运行在 node 环境中的 js 文件，需要按照 CommonJS 的方式去编写代码

  - entry 如果是相对路径，前面的./不能省略
  - output 输出配置
    - filename输出文件的路径
    - path 输出目录，必须是绝对路径，使用 node 的 path 模块转换

- webpack的配置文件，支持导出的格式：
  1. 配置对象
  2. 多个配置对象组成的数组，可以一次构建执行多个配置任务
  3. 函数(env, argv) => {}
  - env 接收 cli 命令传递的环境名（--env）参数
  - argv 指 cli 命令中所有的参数

```js
// webpack.config.js
const path = require('path')

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'output')
  }
}
```

## webpack 工作模式

> webpack 4 新增了一个「工作模式」的用法，大大简化了 webpack 的复杂程度

> [!info]
> 它是针对不同环境的几组预设的配置
>
> - 当未配置 mode 属性时，终端会发出警告，大致内容是：mode 未配置，默认使用 production，可以指定值为 development、production、none
>   - 比如 production 预设，webpack 会自动启动一些优化插件，例如压缩代码

- 可以通过`--mode <value>`命令指定工作模式，也可以在配置文件中指定 mode 属性，取值有以下三个：
  - production 生产模式，自动启动一些优化打包结果的配置
  - development 开发模式，会自动优化打包的速度，添加一些调试当中用到的辅助
  - none 运行最原始状态的打包，不会做额外的处理

> [!warning]
> webpack 三种工作模式的区别
>
> 1. development 模式
>
> - 在这个模式下，webpack 的目标是提供最快的速度以供开发时使用
> - 它会启用一些内置的优化，例如更友好的错误提示和更快的重新构建时间
> - 不会进行代码压缩或混淆，因为这会增加编译时间，不利于快速迭代
> - 使用 eval 来包裹模块代码，使得映射回原始源代码变得容易，有助于调试
>
> 2. production 模式
>
> - 这个模式下的 webpack 关注点在于优化输出，包括代码压缩（UglifyJsPlugin）、删除未使用的代码（Tree Shaking）、作用域提升（scope hoisting）等
> - 它默认启用了代码压缩和其他插件来确保最终的包尽可能小，以便在生产环境中获得更好的性能
> - 禁用了 source maps 默认配置，以减少构建时间和输出体积（但可以根据需要自定义配置以包含 source maps）
> - 缓存、懒加载和其他长期缓存策略也会在这个模式下被优化
>
> 3. none 模式
>
> - 如果没有明确设置 mode 或者设置了为 'none'，webpack 将不会应用任何预设的优化
>   这意味着将得到最基础的配置，没有任何预设的优化，所有的优化都必须手动配置
> - 这种模式适合控制构建过程，或者用于某些特殊的构建场景

```js
// webpack.config.js
const path = require('path')

module.exports = {
  // 这个属性有三种取值，分别是 production、development 和 none。
  // 1. 生产模式下，Webpack 会自动优化打包结果；
  // 2. 开发模式下，Webpack 会自动优化打包速度，添加一些调试过程中的辅助；
  // 3. None 模式下，Webpack 就是运行最原始的打包，不做任何额外处理；
  mode: 'development',
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist')
  }
}
```

## webpack 打包结果工作原理

- 先将工作模式设置为 none 以观察最原始状态的打包
- 查看打包文件代码

```js
(function(modules){...})([...])
```

- 整体生成代码是一个立即执行函数，这个函数是 webpack 的工作入口，它接收一个 modules 参数
- 调用函数时传入一个数组，数组中每个元素都是参数列表相同的函数
- 每一个函数，就是源代码中对应的每个模块
  - 也就是说，每个模块都会包裹在这样一个函数中，从而实现一个私有作用域
- 工作入口函数讲解

```js
(function(modules) {
  // 用于缓存(/存放)载过的模块
  var installedModules = {};
  // 定义一个用于加载模块的函数
  function __webpack_require__(moduleId) {...}
  // 下面是在__webpack_require__上挂载了一些数据和工具函数
  __webpack_require__.m = modules;
  __webpack_require__.c = installedModules;
  __webpack_require__.d = function(exports, name, getter) {...};
  __webpack_require__.r = function(exports) {...};
  __webpack_require__.t = function(value, mode) {...};
  __webpack_require__.n = function(module) {...};
  __webpack_require__.o = function(object, property) {...};
  __webpack_require__.p = "";

  // 最后调用__webpack_public_path__加载源代码中的入口模块并返回
  // moduleId(0)即传入的模块列表(modulelist)的下标
  return __webpack_require__(__webpack_require__.s = 0);
})([...modulelist])
```
