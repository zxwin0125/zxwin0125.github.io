---
title: rollup
order: 3
---

## rollup 概述

> rollup 同样也是一款 ESM 打包器，也可以将散落的细小模块打包为整块的代码，从而使划分的模块可以更好的运行在浏览器环境或者是 NodeJS 环境

> [!info]
> 从作用上看，rollup 和 webpack 非常类似，但是 rollup 要小巧很多
>
> - 因为 webpack 再去配合一些插件使用下，几乎可以完成前端工程化的绝大多数工作
> - rollup 仅仅是一个 ESM 打包器，并没有其他额外的功能
>   - 比如 webpack 支持 HMR，rollup 中并不支持类似 HMR 高级特性

- rollup 诞生初衷就是希望提供一个高效利用 ESM 各项特性的打包器，利用 ESM 各项特性构建出结构比较扁平，性能出众的类库

## rollup 快速上手

### 1. 场景案例

- index.js

```js
// 导入模块成员
import { log } from './logger'
import messages from './messages'

// 使用模块成员
const msg = messages.hi

log(msg)
```

- messages.js

```js
export default {
  hi: 'Hey Guys, I am zs'
}
```

- logger.js

```js
export const log = msg => {
  console.log('---------- INFO ----------')
  console.log(msg)
  console.log('--------------------------')
}

export const error = msg => {
  console.error('---------- ERROR ----------')
  console.error(msg)
  console.error('---------------------------')
}
```

- 从 rollup 提示信息里，可以看到它的用法，它需要通过参数去指定一个打包入口文件
- 并且还应该去指定一个代码输出的格式
  - 也就是希望把 ESM 代码转换过后以什么样的格式去输出
  - 可以通过`--format` 参数指定最适合浏览器的 iife 就是自调用函数的格式
    - `yarn rollup ./src/index.js --format iife`
- 可以通过 `--file` 指定一个输出路径
  - `yarn rollup ./src/index.js --format iife --file dist/bundle.js`
- 查看打包结果

```js
;(function () {
  'use strict'

  const log = msg => {
    console.log('---------- INFO ----------')
    console.log(msg)
    console.log('--------------------------')
  }

  var messages = {
    hi: 'Hey Guys, I am zce~'
  }

  // 导入模块成员

  // 使用模块成员
  const msg = messages.hi

  log(msg)
})()
```

- rollup 打包结果非常简洁，基本和手写的代码差不多，相比于 webpack 中大量的引导代码，还有一堆的模块函数，这里的输出结果几乎没有任何多余的代码
- 就是把打包过程中各个模块按照模块的依赖顺序先后拼接到一起
- 输出结果只保留用到的部分，没有用到的部分都没有输出
  - 因为 rollup 会默认开启 Tree-shaking 去优化输出的结果
  - Tree-shaking 的概念最早就是在 rollup 这个打包工具提出来的

## rollup 配置文件

- rollup 同样也支持通过配置文件配置打包过程中的各项参数
- 在项目根目录新建 rollup.config.js，这个文件也是运行在 Node 环境中，rollup 会额外的处理这个配置文件，所以可以直接使用 ESM 的写法

```js
// rollup.config.js
export default {
  input: 'src/index.js', // 入口文件路径
  output: {
    // 输出相关配置 （对象）
    file: 'dist/bundle.js', // 输出文件名
    format: 'iife' // 输出格式
  }
}
```

- `yarn rollup --config rollup.config.js` 需要指明配置文件，默认 rollup.config.js

## rollup 使用插件

- rollup 自身的功能就只是 ESM 模块的合并打包
- 如果项目有更高级的需求，例如
  1. 想要加载其他类型资源模块
  2. 导入 CommonJS 模块
  3. 编译 ECMAScript 新特性
- rollup 支持使用插件的方式扩展，插件是 rollup 唯一扩展途径（不像 webpack 划分 loader、plugin、minimizer 三种扩展方式）
- 这里尝试导入可以让项目代码导入 json 文件的插件

```js
// rollup.config.js
import json from 'rollup-plugin-json' // 默认导出插件函数

export default {
  ...
  plugins: [
    json() // 调用结果而不是函数
  ]
}
```

```js
// src/index.js

// 导入模块成员
import { log } from './logger'
...
import { name, version } from '../package.json'

// 使用模块成员
...
log(name)
log(version)
```

```js
// bundle.js
;(function () {
  'use strict'

  const log = msg => {
    console.log('---------- INFO ----------')
    console.log(msg)
    console.log('--------------------------')
  }

  var messages = {
    hi: 'Hey Guys, I am zce~'
  }

  var name = '03-plugins' // 打印出 json 数据，没有用到的数据会被 Tree-shaking 移除
  var version = '0.1.0'

  // 导入模块成员

  // 使用模块成员
  const msg = messages.hi

  log(msg)

  log(name)
  log(version)
})()
```

## rollup 加载 npm 模块（rollup-plugin-node-resolve）

- rollup 默认只能按照文件路径的方式加载本地的文件模块，对于 node_modules 当中那些第三方的模块，它并不能像 webpack 一样直接通过模块的名称导入对应的模块
- 为了抹平这样一个差异，rollup 官方给出了 rollup-plugin-node-resolve 这样一个插件
- 这样就可以在代码中直接使用模块名称导入对应的模块

```js
// rollup.config.js
import resolve from 'rollup-plugin-node-resolve'

export default {
  ...
  plugins: [
    ...
    resolve()
  ]
}
```

```js
// src/index.js

// 导入模块成员
import _ from 'lodash-es' // rollup 默认只能处理 ESM 模块 使用普通版本需要额外处理
...

// 使用模块成员
...
log(_.camelCase('hello world'))
```

## rollup 加载 CommonJS 模块（rollup-plugin-commonjs）

- rollup 设计的就是只处理 ESM 模块打包，如果在代码中导入 CommonJS 模块，默认是不被支持的
- 但是目前还会有大量的 npm 模块使用 CommonJS 的方式导出成员，为了兼容这些模块，官方给出了一个叫做 rollup-plugin-commonjs 的插件

```js
// rollup.config.js
import commonjs from 'rollup-plugin-commonjs'

export default {
  ...
  plugins: [
    ...
    commonjs()
  ]
}
```

```js
// src/cjs-module.js

module.exports = {
  foo: 'bar'
}
```

```js
// src/index.js

// 导入模块成员
...
import { log } from './logger'
...
import cjs from './cjs-module'

// 使用模块成员
...
log(cjs)
```

## rollup 代码拆分（Code Splitting）

- rollup 也支持代码拆分，同样可以使用符合 ESM 标准的动态导入（Dynamic Imports）的方式实现模块的按需加载
- rollup 内部也会自动处理代码拆分（Code Splitting）也就是分包

```js
// src/index.js

import('./logger').then(({ log }) => {
  log('code splitting~')
})
```

- 代码拆分这种方式打包，要求 format 输出格式不能是 iife 自执行函数
  - 自执行函数会把所有的模块都放在同一个函数中，不会像 webpack 有一些引导函数，无法实现代码拆分
  - 如果想代码拆分就必须使用 AMD 或者 CommonJS 这样一些其他标准
- 浏览器环境可以使用 AMD 格式输出，但是 Code Splitting 需要输出多个文件，就不能再使用 file 配置，而是使用 dir 参数

```js
// rollup.config.js
export default {
  input: 'src/index.js',
  output: {
    // file: 'dist/bundle.js',
    // format: 'iife'
    dir: 'dist', // 输出目录
    format: 'amd' // 输出格式
  }
}
```

- rollup 会根据动态导入，生成一个入口的 bundle，以及动态导入所对应的 bundle，都是采用 AMD 的标准输出的

## rollup 多入口打包

- rollup 同样支持多入口打包，对于不同入口的公共部分也会自动提取到单个文件作为独立的 bundle

```js
export default {
  // input: ['src/index.js', 'src/album.js'],
  input: {
    foo: 'src/index.js',
    bar: 'src/album.js'
  },
  output: {
    dir: 'dist',
    format: 'amd' // 内部使用代码拆分，就不能使用自调用函数
  }
}
```

- 对于 AMD 这种输出模式的输出文件，不能直接引用到页面，必须通过实现 AMD 标准的库加载

```html
<body>
  <!-- AMD 标准格式的输出 bundle 不能直接引用 -->
  <!-- <script src="foo.js"></script> -->
  <!-- 需要 Require.js 这样的库 -->
  <script src="https://unpkg.com/requirejs@2.3.6/require.js" data-main="foo.js"></script>
</body>
```

## rollup / webpack 选用规则

- rollup 确实有它的优势
  1. 输出结果更加扁平
  2. 自动移除未引用代码
  3. 打包结果依然完全可读
- rollup 缺点也很明显
  1. 加载非 ESM 的第三方模块比较复杂
  2. 模块最终都被打爆到一个函数中，无法实现 HMR
  3. 浏览器环境中，代码拆分功能依赖 AMD 库

> [!warning]
>
> - 如果正在开发应用程序（大量引入第三方模块、需要 HMR 提升开发体验、体积过大需要分包）不适合使用 rollup，建议使用 webpack
> - 如果正在开发一个框架或者类库（很少依赖第三方模块）适合使用 rollup
