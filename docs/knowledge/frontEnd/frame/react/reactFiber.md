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
    - 方法：timeRemaining()
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

- 在 Fiber 方案中，为了实现任务的终止再继续，DOM 对比算法被拆分成了两阶段：
  1. render 阶段（可中断）
    - VirtualDOM 的比对，构建 Fiber 对象，构建链表
  2. commit 阶段（不可中断）
    - 根据构建的链表进行 DOM 操作

> [!info]
> 整体过程：
> 1. 在使用 React 编写用户界面的时候仍然使用 JSX 语法
> 2. Babel 会将 JSX 语法转换成 React.createElement() 方法的调用
> 3. React.createElement() 方法调用后会返回 VirtualDOM 对象
> 4. 接下来就可以执行第一个阶段了：**<font color=red>构建 Fiber 对象</font>**
>   - 采用循环的方式从 VirtualDOM 对象中，找到每一个内部的 VirtualDOM 对象
>   - 为每一个 VirtualDOM 对象构建 Fiber 对象
>   - Fiber 对象也是 JavaScript 对象，它是从 VirtualDOM 对象衍化来的，它除了 type、props、children 以外还存储了更多节点的信息，其中包含的一个核心信息是：当前节点要进行的操作，例如删除、更新、新增
>   - 在构建 Fiber 的过程中还要构建链表
> 5. 接着进行第二阶段的操作：执行 DOM 操作
>   - 在循环链表的过程中，根据当前节点存储的要执行的操作的类型，将这个操作应用到真实 DOM 中

> [important]
> - DOM 初始渲染：根据 VirtualDOM --> 创建 Fiber 对象 及 构建链表 --> 将 Fiber 对象存储的操作应用到真实 DOM 中
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

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Frame/React/20.png)

#### 4.3 数据结构

- Fiber 是一种数据机构，支撑 Fiber 构建任务的运转
- Fiber 其实就是 JavaScript 对象，对象中存储了当前节点的父节点、第一个子节点、下一个兄弟节点，以便在构建链表和执行 DOM 操作的时候知道它们的关系
- 在 render 阶段的时候，React 会从上（root）向下，再从下向上构建所有节点对应的 Fiber 对象，在从下向上的同时还会构建链表，最后将链头存储到 Root Fiber
  - 从上向下
    - 从 Root 节点开始构建，优先构建子节点
  -c从下向上
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

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Frame/React/21.png)

```js
// B1 的 Fiber 对象包含这几个属性：
{
  child: C1_Fiber,
  sibling: B2_Fiber,
  parent: A1_Fiber
}
```