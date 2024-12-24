---
title: 核心算法 Fiber
order: 4
---

## 开发环境配置

### 1. 文件夹结构

- 创建 package.json 文件 `npm init -y`

| 文件/文件夹 | 描述 |
| :-- | :-- |
| src | 存储源文件 |
| dist | 存储客户端代码打包文件 |
| build | 存储服务端代码打包文件 |
| server.js | 存储服务端代码 |
| webpack.config.server.js | 服务端 webpack 配置文件 |
| webpack.config.client.js | 客户端 webpack 配置文件 |
| babel.config.json | babel 配置文件 |
| package.json | 项目工程文件 |

### 2. 安装项目依赖

- 开发依赖：`npm install webpack webpack-cli webpack-node-externals @babel/core @babel/preset-env @babel/preset-react babel-loader nodemon npm-run-all -D`
- 项目依赖：`npm install express`

| 依赖项 | 描述 |
| :-- | :-- |
| webpack | 模块打包工具 |
| webpack-cli | 打包命令 |
| webpack-node-externals | 打包服务器模块时剔除 node_modules 文件夹中的模块 |
| @babel/core | JavaScript 代码转换工具 |
| @babel/preset-env | babel 预置，转换高级 JavaScript 语法 |
| @babel/preset-react | babel 预置，转换 JSX 语法 |
| babel-loader| webpack 中的 babel 工具加载器 |
| nodemon | 监控服务端文件变化，重启应用 |
| npm-run-all | 命令行工具，可以同时执行多个命令 |
| express | 基于 node 平台的 web 开发框架 |

### 3. 环境配置

#### 3.1 创建 web 服务器

```js
// server.js
// 使用 es 模块，还不能直接被运行
import express from 'express'

const app = express()

const template = `
  <html>
    <head>
      <title>React Fiber</title>
    </head>
    <body>
      <div id="root"></div>
    </body>
  </html>
`

// 接收所有 get 请求
app.get('*', (req, res) => {
  // 对客户端进行响应原本写在 index.html 文件中的代码
  res.send(template)
})

app.listen(3000, () => console.log('server is running on http://localhost:3000'))
```

#### 3.2 服务端 webpack 配置

```js
// webpack.config.server.js
const path = require('path')
const nodeExternals = require('webpack-node-externals')
module.exports = {
  // node 环境下运行
  target: 'node',
  // 开发环境模式
  mode: 'development',
  // 入口文件
  entry: './server.js',
  // 打包路径
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'server.js'
  },
  module: {
    // 加载器配置
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  // 打包时剔除 node_modules 下的模块
  externals: [nodeExternals()]
}
```

#### 3.3 babel 配置

```js
// babel.config.js
module.exports = {
	presets: ['@babel/preset-env', '@babel/preset-react'],
};
```

#### 3.4 package.json 启动命令

> 运行 `npm start`，访问 `http://localhost:3000`

```json
"scripts": {
  // 同时执行dev开头的命令
  "start": "npm-run-all --parallel dev:*",
  // 打包服务端代码
  "dev:server-compile": "webpack --config webpack.config.server.js --watch",
  // 运行打包后的服务端代码
  "dev:server": "nodemon ./build/server.js"
},
```

#### 3.5 客户端 webpack 配置

```js
// webpack.config.client.js
const path = require('path')
module.exports = {
  // 浏览器环境下运行（target默认为web）
  // target: 'web',
  // 开发环境模式
  mode: 'development',
  // 入口文件
  entry: './src/index.js',
  // 打包路径
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  devtool: 'source-map',
  module: {
    // 加载器配置
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
}
```

#### 3.6 添加客户端打包脚本

```json
"scripts": {
  "start": "npm-run-all --parallel dev:*",
  "dev:server-compile": "webpack --config webpack.config.server.js --watch",
  "dev:server": "nodemon ./build/server.js",
  "dev:client-compile": "webpack --config webpack.config.client.js --watch"
},
```

#### 3.7 HTML 模版加载客户端脚本

```js
// server.js
import express from 'express'

const app = express()

app.use(express.static('dist'))

const template = `
  <html>
    <head>
      <title>React Fiber</title>
    </head>
    <body>
      <div id="root"></div>
      <script src="bundle.js"></script>
    </body>
  </html>
`

app.get('*', (req, res) => {
  res.send(template)
})

app.listen(3000, () => console.log('server is running'))
```

## requestIdleCallback

### 1. 核心 API 功能介绍

> [!info]
> requestIdleCallback 利用浏览器的空余时间执行任务，如果浏览器没有空余时间，可以随时终止这些任务
> - 如果有更高优先级的任务要执行时，当前执行的任务可以被终止，优先执行高级别的任务

> [!important]
> 原理是该方法将在浏览器的空闲时段内调用的函数排队
> - 使得开发者能够在主事件循环上执行后台和低优先级的任务，而不会影响像动画和用户交互这些关键的延迟触发的事件
> - 这里的「延迟」指的是大量计算导致运行时间较长

### 2. 浏览器空余时间

- 页面是一帧一帧绘制出来的，当每秒绘制的帧数达到 60 时，页面时流畅的，小于这个值时，用户会感觉到卡顿

> 1秒60帧意思是1秒中60张画面在切换<br>
> 当帧数低于人眼的捕捉频率（有说24帧或30帧，考虑到视觉残留现象，这个数值可能会更低）时，人脑会识别这是几张图片在切换，也就是静态的<br>
> 当帧数高于人眼的捕捉频率，人脑会认为画面是连续的，也就是动态的动画<br>
> 帧数越高画面就看起来更流畅<br>
> 1秒60帧（大约 1000/60 ≈ 16ms 切换一个画面）差不多是人眼能识别卡顿的分界线<br>

- 如果每一帧执行的时间小于 16 ms，就说明浏览器有空余时间
- 一帧时间内浏览器要做的事情包括：脚本执行、样式计算、布局、重绘、合成等
- 如果某一项内容执行时间过长，浏览器会推迟渲染，造成丢帧卡顿，就没有剩余时间

### 3. 应用场景

- 现在有一项计算任务，需要花费比较长的时间(例如超过16ms）去执行，在执行过程当中，浏览器的主线程会被一直占用，导致浏览器被阻塞，并不能执行其他的任务
- 如果此时用户想要操作页面，比如向下滑动页面查看其它内容，浏览器是不能响应用户的操作的，给用户的感觉就是页面卡死了，体验非常差

#### 如何解决

- 将这项任务注册到 requestIdleCallback 中，利用浏览器的空余时间执行它
- 当用户操作页面时，就是优先级比较高的任务被执行时，此时计算任务会被终止，优先响应用户的操作，这样用户就不会感觉页面发生卡顿了
- 当高优先级的任务执行完成后，再继续执行计算任务

### 4. 使用方式

```js
var handle = window.requestIdleCallback(callback[, options])
```

- callback：一个在空闲时间即将被调用的回调函数
  - 该函数接收一个形参：IdleDeadline，它提供一个方法和一个属性：
    - 方法：timeRemaining 
      - 用于获取浏览器空闲期的剩余时间，也就是空余时间
        - 返回值是毫秒数
        - 如果闲置期结束，则返回 0
      - 根据时间的多少可以来决定是否要执行任务
    - 属性：didTimeout(Boolean，只读)
      - 表示是否是上一次空闲期因为超时而没有执行的回调函数
      - 超时时间由 requestIdleCallback 的参数 options.timeout 定义
- options：可选配置，目前只有一个配置项
  - timeout：超时时间，如果设置了超时时间并超时，回调函数还没有被调用，则会在下一次空闲期强制被调用

### 5. API 功能体验

> 页面中有两个按钮和一个 div，点击第一个按钮执行一项昂贵的计算，使其长期占用主线程，当计算任务执行的时候去点击第二个按钮更改页面中 div 的背景颜色

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>requestIdleCallback</title>
    <style>
      #box {
        background: palegoldenrod;
        padding: 20px;
        margin-bottom: 10px;
      }
    </style>
  </head>
  <body>
    <div id="box">playground</div>
    <button id="btn1">执行计算任务</button>
    <button id="btn2">更改背景颜色</button>

    <script>
      var box = document.querySelector('#box')
      var btn1 = document.querySelector('#btn1')
      var btn2 = document.querySelector('#btn2')
      var number = 100000000
      var value = 0

      function calc() {
        while (number > 0) {
          value = Math.random() < 0.5 ? Math.random() : Math.random()
          number--
        }
      }

      btn1.onclick = function () {
        calc()
      }

      btn2.onclick = function () {
        console.log(number) // 0：计算任务执行完
        box.style.background = 'palegreen'
      }
    </script>
  </body>
</html>
```

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Frame/React/18.png)

- 使用 requestIdleCallback 可以完美解决这个卡顿问题
  - 浏览器在空余时间执行 calc 函数
  - 当空余时间小于 1ms 时，跳出 while 循环
  - calc 根据 number 判断计算任务是否执行完成，如果没有完成，则继续注册新的空闲期的任务
  - 当 btn2 点击事件触发，会等到当前空闲期任务执行完后执行「更改背景颜色」的任务
  - 「更改背景颜色」任务执行完成后，继续进入空闲期，执行后面的任务

```js
var box = document.querySelector('#box')
var btn1 = document.querySelector('#btn1')
var btn2 = document.querySelector('#btn2')
var number = 100000000
var value = 0

function calc(IdleDeadline) {
  while (number > 0 && IdleDeadline.timeRemaining() > 1) {
    value = Math.random() < 0.5 ? Math.random() : Math.random()
    number--
  }
  if (number > 0) {
    requestIdleCallback(calc)
  } else {
    console.log('计算结束')
  }
}

btn1.onclick = function () {
  requestIdleCallback(calc)
}

btn2.onclick = function () {
  console.log(number) // 显示当前计算中的number
  box.style.background = 'palegreen'
}
```

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Frame/React/19.png)

- 由此可见，所谓执行优先级更高的任务，是手动将计算任务拆分到浏览器的空闲期，以实现每次进入空闲期之前优先执行主线程的任务

## Fiber

### 1. 问题

> React 16 之前的版本对比更新 VirutalDOM 的过程是采用 **<font color=red>循环加递归</font>** 实现的<br>
> 这种对比方式有一个问题，就是一旦任务开始进行就无法中断（由于递归需要一层一层的进入，一层一层的退出，所以过程不能中断）<br>
> 如果应用中组件数量庞大，主线程被长期占用，直到整棵 VirtualDOM 树对比更新完成之后主线程才能被释放，主线程才能执行其它任务<br>
> 这就会导致一些用户交互、动画等任务无法立即得到执行，页面就会产生卡顿，非常影响用户的体验<br>

- 因为递归利用的 JavaScript 自身的执行栈，所以旧版 DOM 比对的算法称为 Stack(堆栈)
- 可以通过这个 [Demo](https://claudiopro.github.io/react-fiber-vs-stack-demo/) 查看 Stack 算法 和 Fiber 算法的效果区别

> [!warning]
> 核心问题：递归无法中断，执行重任务耗时长，JavaScript 又是单线程的，无法同时执行其它任务，导致在绘制页面的过程当中不能执行其它任务，比如元素动画、用户交互等任务必须延后，给用户的感觉就是页面变得卡顿，用户体验差

### 2. 解决方案

1. 利用浏览器空闲时间执行任务，拒绝长时间占用主线程
  - 在新版本的 React 版本中，使用了 requestIdleCallback API
  - 利用浏览器空余时间执行 VirtualDOM 比对任务，也就表示 VirtualDOM 比对不会长期占用主线程
  - 如果有高优先级的任务要执行，就会暂时终止 VirtualDOM 的比对过程，先去执行高优先级的任务
  - 高优先级任务执行完成，再回来继续执行 VirtualDOM 比对任务
  - 这样页面就不会出现卡顿现象

2. 放弃递归只采用循环，因为循环可以被中断
  - 由于递归必须一层一层进入，一层一层退出，所以过程无法中断
  - 所以要实现任务的终止再继续，就必须放弃递归，只采用循环的方式执行比对的过程
  - 因为循环是可以终止的，只需要将循环的条件保存下来，下一次任务就可以从中断的地方执行了

3. 任务拆分，将任务拆分成一个个的小任务
  - 如果任务要实现终止再继续，任务的单元就必须要小
  - 这样任务即使没有执行完就被终止，重新执行任务的代价就会小很多
  - 所以要进行任务的拆分，将一个大的任务拆分成一个个小的任务
  - VirtualDOM 比对任务如何拆分？
    - 以前将整棵 VirtualDOM 树的比对看作一个任务
    - 现在将树中每一个节点的比对看作一个任务

> Fiber 翻译过来是「纤维」，意思就是执行任务的颗粒度变得细腻，像纤维一样<br>

### 3. 实现思路

> [!important]
> 在 Fiber 方案中，为了实现任务的终止再继续，DOM 对比算法被拆分成了两阶段：
> 1. render 阶段（可中断）
>   - VirtualDOM 的比对，构建 Fiber 对象，构建链表
> 2. commit 阶段（不可中断）
>   - 根据构建的链表进行 DOM 操作

> [!info]
> 整体过程：
> 1. 在使用 React 编写用户界面的时候仍然使用 JSX 语法
> 2. Babel 会将 JSX 语法转换成 React.createElement 方法的调用
> 3. React.createElement 方法调用后会返回 VirtualDOM 对象
> 4. 接下来就可以执行第一个阶段了：**<font color=red>构建 Fiber 对象</font>**
>   - 采用循环的方式从 VirtualDOM 对象中，找到每一个内部的 VirtualDOM 对象
>   - 为每一个 VirtualDOM 对象构建 Fiber 对象
>   - Fiber 对象也是 JavaScript 对象，它是从 VirtualDOM 对象衍化来的，它除了 type、props、children 以外还存储了更多节点的信息，其中包含的一个核心信息是：当前节点要进行的操作，例如删除、更新、新增
>   - 在构建 Fiber 的过程中还要构建链表
> 5. 接着进行第二阶段的操作：执行 DOM 操作
>   - 在循环链表的过程中，根据当前节点存储的要执行的操作的类型，将这个操作应用到真实 DOM 中

> [!important]
> - DOM 初始渲染：根据 VirtualDOM --> 创建 Fiber 对象及构建链表 --> 将 Fiber 对象存储的操作应用到真实 DOM 中
> - DOM 更新操作：newFiber(重新获取所有 Fiber 对象) --> newFiber vs oldFiber(获取旧的 Fiber 对象，进行比对) 将差异操作追加到链表 --> 将 Fiber 对象应用到真实 DOM 中

### 4. Fiber 对象

#### 4.1 什么是 Fiber

- Fiber 有两层含义：
  - Fiber 是一个执行单元
  - Fiber 是一种数据结构

#### 4.2 执行单元

- 在 React 16 之前，将 Virtual DOM 树整体看成一个任务进行递归处理，任务整体庞大执行耗时且不能中断
- 在 React 16，将整个任务拆分成一个个小的任务进行处理，每个小的任务指的就是一个 Fiber 节点的构建
- 任务会在浏览器的空闲时间被执行，每个单元执行完成后，React 都会检查是否还有空余时间，如果有就交还主线程的控制权

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Frame/React/20.png =500x)

#### 4.3 数据结构

- Fiber 是一种数据机构，支撑 Fiber 构建任务的运转
- Fiber 其实就是 JavaScript 对象，对象中存储了当前节点的父节点、第一个子节点、下一个兄弟节点，以便在构建链表和执行 DOM 操作的时候知道它们的关系
- 在 render 阶段的时候，React 会从上（root）向下，再从下向上构建所有节点对应的 Fiber 对象，在从下向上的同时还会构建链表，最后将链头存储到 Root Fiber
  - 从上向下
    - 从 Root 节点开始构建，优先构建子节点
  - 从下向上
    - 如果当前节点没有子节点，就会构建下一个兄弟节点
    - 如果当前节点没有子节点，也没有下一个兄弟节点，就会返回父节点，构建父节点的兄弟节点
    - 如果父节点的下一个兄弟节点有子节点，就继续向下构建
    - 如果父节点没有下一个兄弟节点，就继续向上查找
- 在第二阶段的时候，通过链表结构的属性（child、sibling、parent）准确构建出完整的 DOM 节点树，从而才能将 DOM 对象追加到页面当中

```js
// Fiber 对象
{
  type				节点类型（元素、文本、组件）（具体的类型）
  props				节点属性（props中包含children属性，标识当前节点的子级 VirtualDOM）
  stateNode		节点的真实 DOM 对象 | 类组件实例对象 | 函数组件的定义方法
  tag					节点标记（对具体类型的分类 host_root[顶级节点root] || host_component[普通DOM节点] || class_component[类组件]
  || function_component[函数组件]）
  effectTag		当前 Fiber 在 commit 阶段需要被执行的副作用类型/操作（新增、删除、修改）
  nextEffect	单链表用来快速查找下一个 sideEffect
  lastEffect	存储最新副作用，用于构建链表的 nextEffect
  firstEffect	存储第一个要执行的副作用，用于向 root 传递第一个要操作的 DOM
  parent			当前 Fiber 的父级 Fiber（React 中是 `return`）
  child				当前 Fiber 的第一个子级 Fiber
  sibling			当前 Fiber 的下一个兄弟 Fiber
  alternate		当前节点对应的旧 Fiber 的备份，用于新旧 Fiber 比对
}
```

- 以上述为例

```html
<div id="a1">
  <div id="b1">
    <div id="c1"></div>
    <div id="c2"></div>
  </div>
  <div id="b2"></div>
</div>
```

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Frame/React/21.png =500x)

```js
// B1 的 Fiber 对象包含这几个属性：
{
  child: C1_Fiber,
  sibling: B2_Fiber,
  parent: A1_Fiber
}
```

## 实现 Fiber 算法

### 1. 准备工作

> 准备一段 JSX，之后实现 Fiber 算法将这段 JSX 内容渲染到页面中

```jsx
// src/index.js
import React from './react'
const jsx = (
  <div>
    <p>Hello React</p>
  </div>
)

console.log(jsx)
```

- Babel 会将 JSX 转换成 React.createElement 方法的调用，调用结果是生成的 VirtualDOM 对象，所以文件中要先引入 React 模块
- 改写 React 的算法，这里使用自定义的 React 模块

```js
// src/react/index.js
import createElement from './CreateElement'
export default {
  createElement
}
```

```js
// src/react/CreateElement/index.js
/**
 * 创建 Virtual DOM
 * @param {string} type 类型
 * @param {object | null} props 属性
 * @param  {createElement[]} children 子元素
 * @return {object} Virtual DOM
 */
export default function createElement(type, props, ...children) {
  const childElements = [].concat(...children).reduce((result, child) => {
    if (child !== false && child !== true && child !== null) {
      if (child instanceof Object) {
        result.push(child)
      } else {
        // 文本节点
        result.push(createElement('text', { textContent: child }))
      }
    }
    return result
  }, [])
  return {
    type,
    props: Object.assign({ children: childElements }, props)
  }
}
```

### 2. 创建任务队列并添加任务

- 将 VirtualDOM 对象转换成真实 DOM 对象，渲染到页面中，需要用到 render 方法

```js
// src/index.js
import React, { render } from './react'

const root = document.getElementById('root')

const jsx = (
  <div>
    <p>Hello React</p>
  </div>
)
render(jsx, root)
```

```js
// src/react/index.js
import createElement from './CreateElement'
export { render } from './Reconciliation'
export default {
  createElement
}
```

- 在 react 目录下创建 Reconciliation 文件夹，放置 Fiber 算法的核心逻辑，在其中定义 render方法

```js
// src/react/Reconciliation/index.js
export const render = (element, dom) => {
  /**
   * 1. 向任务队列中添加任务
   * 2. 指定在浏览器空闲时执行任务
   */
  /**
   * 任务就是通过 vdom 对象 构建的 fiber 对象，对象中存储着要执行的操作，如JSX 的初始化渲染、组件状态的更新等
   * 任务队列是一个存储各种任务的数组
   */
}
```

- 在 react 目录下新建 Misc（杂项）文件夹，放置实现主业务逻辑的时候需要的一些辅助方法，在其中定义创建和管理任务队列的方法

```js
// src\react\Misc\CreateTaskQueue\index.js
const CreateTaskQueue = () => {
  // 创建一个任务队列
  const taskQueue = []
  return {
    // 向任务队列添加任务
    push: item => taskQueue.push(item),
    // 删除并获取队列中的第一个任务（先进先出原则）
    pop: () => taskQueue.shift()
  }
}

export default CreateTaskQueue
```

```js
// src\react\Misc\index.js
export { default as createTaskQueue } from './CreateTaskQueue'
```

#### 2.1 向任务队列中添加任务

```js
// src/react/Reconciliation/index.js
import { createTaskQueue } from '../Misc'

const taskQueue = createTaskQueue()

export const render = (element, dom) => {
  /**
   * 1. 向任务队列中添加任务
   * 2. 指定在浏览器空闲时执行任务
   */
  /**
   * 任务就是通过 vdom 对象 构建的 fiber 对象，对象中存储着要执行的操作，如JSX 的初始化渲染、组件状态的更新等
   * 任务队列是一个存储各种任务的数组
   */

  taskQueue.push({
    // 父级真实 DOM 对象
    dom,
    props: {
      // 子级 vdom 对象
      children: element
    }
  })

  console.log(taskQueue.pop());
}
```

### 3. 实现任务的调度逻辑

> 扩展 render 方法，实现「指定在浏览器空闲时执行任务」

1. 内部调用 requestIdleCallback 方法，创建空闲期工作内容，在浏览器空闲时间执行任务
  - 向 requestIdleCallback 方法传递一个回调函数 performTask 

> [!info]
> performTask 译为「执行任务」
>   - performTask 接收一个形参 deadline 用于获取空余时间
>   - performTask 方法只负责调度任务，执行任务交给另一个方法 workLoop

> [!info]
> workLoop 译为「循环工作」
>   - workLoop 调用的时候，将 deadline 传递进去
>   - workLoop 先判断当前是否有要执行的子任务
>     - 如果没有则获取子任务 getFirstTask
>       - getFirstTask 不是获取任务队列中的第一个任务，而是获取队列中第一个任务中的第一个小任务
>       - 该方法先从任务队列中获取第一个大任务
>       - 然后再获取这个任务中的小任务，以此将一个大的任务拆分成一个个小任务
>     - 如果有，并且浏览器空余时间满足条件，则执行子任务
>     - 由于子任务不止一个，所以要循环（while）执行
>     - 在 while 循环中使用一个函数 executeTask 去执行子任务

> [!info]
> executeTask 方法
>   - 接收任务(Fiber 对象)并执行
>   - 返回一个新的任务用于替换当前子任务，保证循环继续执行

2. 当有高优先的任务要执行的时候，requestIdleCallback 中执行的任务会被中断
  - 也就是跳出 while 循环，workLoop 执行结束
  - 为了让任务继续执行，需要再次调用 requestIdleCallback 创建空闲期工作内容
  - 调用之前还需要判断当前任务是否执行完成，判断依据：
    - 当前子任务是否存在
    - 任务队列中是否还有任务

```js
// src/react/Reconciliation/index.js
import { createTaskQueue } from '../Misc'

const taskQueue = createTaskQueue()
// 当前要执行的子任务
let subTask = null

const getFirstTask = () => {}

const executeTask = fiber => {}

const workLoop = deadline => {
  // 如果子任务不存在，则获取子任务
  if (!subTask) {
    subTask = getFirstTask()
  }

  // 如果子任务存在，并且浏览器有空余时间，则执行子任务
  while (subTask && deadline.timeRemaining() > 1) {
    // executeTask 接收任务 + 执行任务 + 返回新的任务
    subTask = executeTask(subTask)
  }
}

const performTask = deadline => {
  // 执行任务
  workLoop(deadline)

  // 判断当前任务是否执行完成
  if (subTask || !taskQueue.isEmpty()) {
    // 再次告诉浏览器在空余时间继续执行任务
    requestIdleCallback(performTask)
  }
}

export const render = (element, dom) => {
  /**
   * 1. 向任务队列中添加任务
   * 2. 指定在浏览器空闲时执行任务
   */
  /**
   * 任务就是通过 vdom 对象 构建的 fiber 对象，对象中存储着要执行的操作，如JSX 的初始化渲染、组件状态的更新等
   * 任务队列是一个存储各种任务的数组
   */

  taskQueue.push({
    // 父级真实 DOM 对象
    dom,
    props: {
      // 子级 vdom 对象
      children: element
    }
  })

  // 创建空闲期工作内容，在浏览器空闲时间执行任务
  requestIdleCallback(performTask)

  console.log(taskQueue.pop());
}
```

- 为任务队列添加一个判断是否为空的方法

```js
// src\react\Misc\CreateTaskQueue\index.js
const CreateTaskQueue = () => {
  // 创建一个任务队列
  const taskQueue = []
  return {
    // 向任务队列添加任务
    push: item => taskQueue.push(item),
    // 删除并获取队列中的第一个任务（先进先出原则）
    pop: () => taskQueue.shift(),
    // 判断任务队列中是否还有任务
    isEmpty: () => taskQueue.length === 0
  }
}

export default CreateTaskQueue
```

### 4. 构建节点的 Fiber 对象

#### 4.1 构建顺序

> 为每一个节点构建对应的 Fiber 对象

```js
// Fiber 对象
{
  type				节点类型（元素、文本、组件）（具体的类型）
  props				节点属性（props中包含children属性，标识当前节点的子级 VirtualDOM）
  stateNode		节点的真实 DOM 对象 | 类组件实例对象 | 函数组件的定义方法
  tag					节点标记（对具体类型的分类 host_root[顶级节点root] || host_component[普通DOM节点] || class_component[类组件] || function_component[函数组件]）
  effects			数组，存储需要更改的 Fiber 对象
  effectTag		当前 Fiber 需要被执行的操作（新增 placement、删除 deletion、修改 update）
  parent			当前 Fiber 的父级 Fiber
  child				当前 Fiber 的子级 Fiber
  sibling			当前 Fiber 的下一个兄弟 Fiber
  alternate		当前节点对应的旧 Fiber 的备份，用于新旧 Fiber 比对 alternate 当前 Fiber 的备份，用于新旧 Fiber 比对
}
```

> [!important]
> - 构建的时候是从最外层节点开始构建的
> - 外层节点构建完成后，再去构建它的子节点
> - 当子节点构建完成后，要指定它们之间的关系
> - 关系计算逻辑：
>   - 只有第一个子级才算是父级的子级（父级 Fiber 对象的 child 只会存储第一个子级）
>   - 第二个子级是第一个子级的下一个兄弟节点，依次类推（兄弟子级也会存储它们的父级）
> - 构建完成后，再判断父级下的第一个子级是否还有子级
>   - 如果有则继续向下构建
>   - 如果没有判断下一个兄弟节点是否有子级
>   - 如果都没有，则向上判断父级的兄弟节点
>   - 最终又回到最外层的节点

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Frame/React/22.png)

- 如图所示，构建的顺序为：A --> B --> C --> [A -> B ->] D --> [B -> D ->] E --> F --> [D -> E -> F -> D -> B -> C] --> G --> H --> [c -> G -> H -> A]
- []中是寻找要构建节点的中间过程

#### 4.2 构建根节点的 Fiber 对象

- 当前示例的最外层节点就是 id 为 root 的节点，它的子节点就是添加的 div
- 构建最外层节点（根节点）的工作在 getFirstTask 中执行：
  - 该方法从任务队列中获取任务（Fiber 对象）
  - 然后将其作为根节点的 Fiber 对象返回
  - 根节点中有一些不需要的属性
  - 根节点的 child 子级，由构建它的子节点的时候进行赋值

```js
// src/react/Reconciliation/index.js
import { createTaskQueue } from '../Misc'

const taskQueue = createTaskQueue()
// 当前要执行的子任务
let subTask = null

const getFirstTask = () => {
  // 从任务队列中获取任务
  const task = taskQueue.pop()

  // 返回最外层节点的 Fiber 对象
  return {
    // 最外层节点不需要的属性：
    // type: '',
    // effectTag: null,
    // parent: null,
    // sibling: null,

    props: task.props,
    stateNode: task.dom,
    tag: 'host_root',
    effects: [], // 暂不指定
    child: null, // 在构建子节点的时候指定其与父节点的关系
    alternate: null // 暂不指定
  }
}

/*...*/
```

#### 4.3 构建子节点的 Fiber 对象

- 在执行任务 executeTask 时通过调用 reconcileChildren 构建子节点的 Fiber 对象，还要在里面指明父子节点、兄弟节点的关系，所以要将父节点 fiber 和子节点 fiber.props.children 传递进去：

```js
// src/react/Reconciliation/index.js
/*...*/
const reconcileChildren = (fiber, children) => {}

const executeTask = fiber => {
  // 构建子级 fiber 对象
  reconcileChildren(fiber, fiber.props.children)
}
/*...*/
```

> [!warning]
> reconcileChildren 接收的 children 还要处理一下，因为它可能是对象也可能是数组
> - 当它是 render 方法返回的，它是对象
> - 当它是 createElement 方法返回的，它是数组

- 定义一个方法将 children 转换成数组

```js
// src\react\Misc\Arrified\index.js
const arrified = arg => (Array.isArray(arg) ? arg : [arg])

export default arrified
```

```js
// src\react\Misc\index.js
export { default as createTaskQueue } from './CreateTaskQueue'
export { default as arrified } from './Arrified'
```

```js
// src/react/Reconciliation/index.js
/*...*/
const reconcileChildren = (fiber, children) => {
  // 将 children 转换成数组
  const arrifiedChildren = arrified(children)
}

const executeTask = fiber => {
  // 构建子级 fiber 对象
  reconcileChildren(fiber, fiber.props.children)
}
/*...*/
```

- 然后遍历每个子节点，创建 Fiber 对象，并根据判断设置父节点的 child 和当前节点的 sibling 属性

```js
// src/react/reconciliation/index.js
/*...*/
const reconcileChildren = (fiber, children) => {
  // 将 children 转换成数组
  const arrifiedChildren = arrified(children)

  let index = 0
  let numberOfElements = arrifiedChildren.length
  let element = null
  let newFiber = null
  let prevFiber = null

  while (index < numberOfElements) {
    element = arrifiedChildren[index]
    newFiber = {
      type: element.type,
      props: element.props,
      tag: 'host_component', // 暂时处理普通DOM节点
      effects: [], // 暂不指定
      effectTag: 'placement', // 暂时处理追加节点的操作
      stateNode: null, // 暂不指定
      parent: fiber
    }
    
    // 指明父子关系、兄弟关系
    if (index === 0) {
      // 父节点的子节点只能是第一个子节点
      fiber.child = newFiber
    } else {
      // 其它的节点作为上一个节点的兄弟节点
      prevFiber.sibling = newFiber
    }

    prevFiber = newFiber

    index++
  }
}
/*...*/
```

#### 4.4 完善 Fiber 对象的 stateNode 属性

> [!info]
> stateNode 属性的值取决于当前节点的类型：
>   - 普通节点：存储当前节点对应的 DOM 对象
>   - 组件：存储当前组件的实例对象

- 创建节点对应的 DOM 对象

```js
// src\react\DOM\createDOMElement.js
import updateNodeElement from './updateNodeElement'
export default function createDOMElement(virtualDOM) {
  let newElement = null

  if (virtualDOM.type === 'text') {
    // 文本节点
    newElement = document.createTextNode(virtualDOM.props.textContent)
  } else {
    // 元素节点
    newElement = document.createElement(virtualDOM.type)

    updateNodeElement(newElement, virtualDOM)
  }

  return newElement
}
```

```js
// src\react\DOM\updateNodeElement.js
/**
 * @param {*} newElement 要更新的 DOM 元素对象
 * @param {*} virtualDOM 新的 Virtual DOM 对象
 * @param {*} oldVirtualDOM 旧的 Virtual DOM 对象
 */
export default function updateNodeElement(newElement, virtualDOM = {}, oldVirtualDOM = {}) {
  // 获取节点对应的属性对象
  const newProps = virtualDOM.props
  const oldProps = oldVirtualDOM.props || {}

  // 属性被修改或添加属性的情况
  Object.keys(newProps).forEach(propName => {
    // 获取属性值
    const newPropsValue = newProps[propName]
    const oldPropsValue = oldProps[propName]

    if (newPropsValue !== oldPropsValue) {
      if (propName.startsWith('on')) {
        // 判断属性是否是事件属性
        // 事件名称 onClick -> click
        const eventName = propName.toLowerCase().slice(2)
        // 为元素添加事件
        newElement.addEventListener(eventName, newPropsValue)

        // 删除原有事件的事件处理函数
        if (oldPropsValue) {
          newElement.removeEventListener(eventName, oldPropsValue)
        }
      } else if (propName === 'value' || propName === 'checked') {
        // 判断是否是不能用 setAttribute() 设置的属性
        newElement[propName] = newPropsValue
      } else if (propName !== 'children') {
        // 过滤 children 属性
        if (propName === 'className') {
          newElement.setAttribute('class', newPropsValue)
        } else {
          newElement.setAttribute(propName, newPropsValue)
        }
      }
    }
  })

  // 判断属性被删除的情况
  Object.keys(oldProps).forEach(propName => {
    const newPropsValue = newProps[propName]
    const oldPropsValue = oldProps[propName]
    if (!newPropsValue) {
      // 属性被删除
      if (propName.startsWith('on')) {
        // 判断属性是否是事件属性
        const eventName = propName.toLowerCase().slice(2)
        // 为元素添加事件
        newElement.removeEventListener(eventName, oldPropsValue)
      } else if (propName !== 'children') {
        newElement.removeAttribute(propName)
      }
    }
  })
}
```

```js
// src\react\DOM\index.js
export { default as createDOMElement } from './createDOMElement'
export { default as updateNodeElement } from './updateNodeElement'
```

- 定义一个方法用于获取 stateNode 的值（当前只处理普通节点）

```js
// src\react\Misc\CreateStateNode\index.js
import { createDOMElement } from '../../DOM'

const createStateNode = fiber => {
  if (fiber.tag === 'host_component') {
    return createDOMElement(fiber)
  }
}

export default createStateNode
```

```js
// src\react\Misc\index.js
export { default as createTaskQueue } from './CreateTaskQueue'
export { default as arrified } from './Arrified'
export { default as createStateNode } from './CreateStateNode'
```

```js
// src/react/Reconciliation/index.js
import { createTaskQueue, arrified, createStateNode } from '../Misc'

/*...*/

const reconcileChildren = (fiber, children) => {
  // 将 children 转换成数组
  const arrifiedChildren = arrified(children)

  let index = 0
  let numberOfElements = arrifiedChildren.length
  let element = null
  let newFiber = null
  let prevFiber = null

  while (index < numberOfElements) {
    element = arrifiedChildren[index]
    newFiber = {
      type: element.type,
      props: element.props,
      tag: 'host_component', // 暂时处理普通DOM节点
      effects: [], // 暂不指定
      effectTag: 'placement', // 暂时处理追加节点的操作
      parent: fiber
    }

    newFiber.stateNode = createStateNode(newFiber)

    console.log(newFiber)

    /*...*/
  }
}

/*...*/
```

#### 4.5 完善 Fiber 对象的 tag 属性

> [!info]
> tag 属性标识节点的具体分类：
>   - host_root：根节点
>   - host_component：普通节点
>   - class_component：类组件
>   - function_component：函数型组件

- 当前将子节点的 tag 设置为固定 host_component，现在要将它改为动态的，根据节点的类型设置对应的值（当前仅处理普通节点的情况）

> 根节点不需要动态获取，它固定为 host_root

- 定义一个方法用于获取 tag

```js
// src\react\Misc\GetTag\index.js
const getTag = vdom => {
  if (typeof vdom.type === 'string') {
    // 普通节点
    return 'host_component'
  }
}

export default getTag
```

```js
// src\react\Misc\index.js
export { default as createTaskQueue } from './CreateTaskQueue'
export { default as arrified } from './Arrified'
export { default as createStateNode } from './CreateStateNode'
export { default as getTag } from './GetTag'
```

```js
// src/react/Reconciliation/index.js
import { createTaskQueue, arrified, createStateNode, getTag } from '../Misc'

/*...*/

const reconcileChildren = (fiber, children) => {
  // 将 children 转换成数组
  const arrifiedChildren = arrified(children)

  let index = 0
  let numberOfElements = arrifiedChildren.length
  let element = null
  let newFiber = null
  let prevFiber = null

  while (index < numberOfElements) {
    element = arrifiedChildren[index]
    newFiber = {
      type: element.type,
      props: element.props,
      tag: getTag(element),
      effects: [], // 暂不指定
      effectTag: 'placement', // 暂时处理追加节点的操作
      parent: fiber
    }

    newFiber.stateNode = createStateNode(newFiber)

    console.log(newFiber)

    /*...*/
  }
}

/*...*/
```

#### 4.6 构建左侧节点树中的剩余子节点的 Fiber 对象

- 当前示例的最外层节点是 root，它的子级是 div，div 的子级是 p，p 的子级是文本节点
- 它们都是节点树中的最左侧节点

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Frame/React/23.png)

- 当构建完 div 后，接着判断 root 是否有子级（只有第一个子级会存储在 Fiber 对象的 child 属性上）
- 如果有，则将这个子级通过 executeTask 返回
  - 这样，这个子级的 Fiber 将会重新赋值给当前子任务 subFiber
  - 在 workLoop 的循环中继续执行 executeTask
  - 这个子级将作为父级（fiber），这个子级的子级作为子级（children），传递给构建子节点 Fiber 对象的方法：reconcileChildren(fiber, children)
- 这样就是不断向下构建节点的子级，最终最左侧的节点树将构建完成

```js
// src/react/Reconciliation/index.js
/*...*/
const executeTask = fiber => {
  // 构建子级 fiber 对象
  reconcileChildren(fiber, fiber.props.children)

  if (fiber.child) {
    return fiber.child
  }

  console.log(fiber);
}
/*...*/
```

- 打印最后创建的 fiber 对象，就是最后的文本节点，通过 parent 属性，可以查看它的上级节点

#### 4.7 构建其它剩余节点的 Fiber 对象

- 当构建完左侧节点树中的节点，此时定位到的一定是左侧最后一层的第一个节点（如图上的 textNode）
- 接下来要根据这个节点来构建其它节点的 Fiber 对象

> [!important]
> 查找的原则是：如果这个节点有同级节点（sibling）则构建同级节点的子级（child：第一个子节点），如果没有同级，则返回它的父级（parent），查看父级有没有同级

- 如果退回到了根节点，则表示所有的节点已经构建完成
- 修改示例，增加同级节点

```js
// src/index.js
import React, { render } from './react'

const root = document.getElementById('root')

const jsx = (
  <div>
    <p>Hello React</p>
    <p>Hi Fiber</p>
  </div>
)
render(jsx, root)
```

- 此时查看 executeTask 中打印的 Fiber 对象，可以看到打印的是 Hello React 文本节点，查看它的父节点 p 可以看到兄弟节点属性指向了另一个 p，但是这个节点还没有构建子节点的 Fiber 对象

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Frame/React/24.png)

- 构建其它节点

```js
const executeTask = fiber => {
  // 构建子级 fiber 对象
  reconcileChildren(fiber, fiber.props.children)

  /**
   * 如果子级存在 返回子级
   * 将这个子级当作父级 构建这个父级下的子级
   */
  if (fiber.child) {
    return fiber.child
  }

  let currentExecutelyFiber = fiber

  while (currentExecutelyFiber.parent) {
    if (currentExecutelyFiber.sibling) {
      return currentExecutelyFiber.sibling
    }

    currentExecutelyFiber = currentExecutelyFiber.parent
  }

  console.log(fiber);
}
```

- 到此所有节点 Fiber 对象构建完成

### 5. 构建 effects 数组

> 现在所有节点的 Fiber 对象已经构建完成，要将所有 Fiber 对象存储到一个数组中

- 因为在 Fiber 算法的第二阶段，要循环这个数组，统一获取 Fiber 对象，从而构建真实 DOM 对象，并且要将构建出来的真实 DOM 对象添加到页面中，Fiber 对象中的 effects 数组就是用来存储 Fiber 对象的
- 最终目标是将所有 Fiber 对象都存储在最外层节点的 effects 数组中
- 如何实现：
  - 每个节点的 Fiber 对象都有 effects 数组
  - 最外层节点的 effects 数组负责存放所有 Fiber 对象
  - 其它节点的 effects 数组负责协助搜集 Fiber 对象
  - 最终会将所有收集到的 Fiber 对象汇总在最外层节点的 effects 数组中

> [!important]
> 收集 Fiber 对象的具体过程：
> 1. 当左侧节点树中的节点全部构建完成以后，开启了一个 while 循环去构建其它节点
> 2. 在构建其它节点的过程中，找到每个节点的父级 Fiber 对象
> 3. 此时就可以通过数组的合并操作为这个节点的 effects 数组添加 Fiber 对象了：
>   - 将父级 effects 数组和子级 effects 数组中的值进行合并
>   - 子级中的 effects 数组和子级 Fiber 对象进行合并
> 4. 这个数组的合并操作在 while 循环的过程中不断进行，并且 while 是从最底层节点开始循环的
> 5. 循环结束之后，在最外层节点的 effects 数组就包含所有的 Fiber 对象了

```js
const executeTask = fiber => {
  // 构建子级 fiber 对象
  reconcileChildren(fiber, fiber.props.children)

  /**
   * 如果子级存在 返回子级
   * 将这个子级当作父级 构建这个父级下的子级
   */
  if (fiber.child) {
    return fiber.child
  }

  /**
   * 如果存在同级 返回同级 构建同级的子级
   * 如果同级不存在 返回到父级 看父级是否有同级
   */
  let currentExecutelyFiber = fiber

  while (currentExecutelyFiber.parent) {
    // 通过将 Fiber 对象合并到 effects 数组，收集所有 Fiber 对象
    currentExecutelyFiber.parent.effects = currentExecutelyFiber.parent.effects.concat(
      currentExecutelyFiber.effects.concat([currentExecutelyFiber])
    )

    // 返回其它节点去构建 Fiber 对象
    if (currentExecutelyFiber.sibling) {
      return currentExecutelyFiber.sibling
    }

    currentExecutelyFiber = currentExecutelyFiber.parent
  }

  console.log(fiber)
}
```

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Frame/React/25.png)

### 6. Fiber 第二阶段 - 实现初始渲染

> 在第二个阶段当中，要进行真实 DOM 操作，构建 DOM 节点之间的关系，构建完成后将真实 DOM 节点添加到页面中

#### 6.1 获取所有 Fiber 对象

- 当构建完所有节点的 Fiber 对象后，只需通过最外层节点的 effects 属性就可以获取到所有的 Fiber 对象
- 当 executeTask 方法不再返回一个新的 Fiber 对象，就表示所有节点已经构建完成，也表示 while 循环一直判断到最外层节点并结束，此时 currentExecutelyFiber 就是最外层节点
- 这样就可以获取所有 Fiber 对象，进行 Fiber 算法的第二个阶段了
  - 当所有节点构建完成后，将最外层节点存储到一个全局变量，以便进行第二阶段的时候可以获取到
  - 当 executeTask 中 while 循环结束，并未返回新的 Fiber 对象，则会结束 workLoop 中的 while 循环，此时就要进入第二阶段了

```js
// src/react/Reconciliation/index.js
import { createTaskQueue, arrified, createStateNode, getTag } from '../Misc'

/*...*/

// 存储根节点所对应的 Fiber 对象
let pendingCommit = null

const commitAllWork = fiber => {
  console.log(fiber.effects)
}

/*...*/

const executeTask = fiber => {
	/*...*/

  while (currentExecutelyFiber.parent) {
		/*...*/
  }

  pendingCommit = currentExecutelyFiber
}

const workLoop = deadline => {
  // 如果子任务不存在，则获取子任务
  if (!subTask) {
    subTask = getFirstTask()
  }

  // 如果子任务存在，并且浏览器有空余时间，则执行子任务
  while (subTask && deadline.timeRemaining() > 1) {
    // executeTask 接收任务 + 执行任务 + 返回新的任务
    subTask = executeTask(subTask)
  }

  if (pendingCommit) {
    commitAllWork(pendingCommit)
  }
}

/*...*/
```

#### 6.2 追加节点

- 现在只需遍历 Fiber 数组，根据节点 effectTag 进行操作
- 当前示例的每个节点的 effectTag 都是 placement 追加节点
- 只需将每个节点追加到它们的父节点下，最终这些节点会被追加到最外层节点，从而显示在页面中

```js
const commitAllWork = fiber => {
  fiber.effects.forEach(item => {
    if (item.effectTag === 'placement') {
      item.parent.stateNode.appendChild(item.stateNode)
    }
  })
}
```

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Frame/React/26.png)