---
title: Virtual DOM 的实现原理
star: true
category:
	- Vue
order: 4
---

## 什么是 Virtual DOM

- Virtual DOM（虚拟 DOM），是由普通的 JS 对象来描述 DOM 对象
- 真实 DOM 成员

```js
let element = document.querySelector('#app')
let s = ''
for (var key in element) {
  s += key + ','
}
console.log(s)
```

- 真实 DOM 成员非常多，所以创建一个 DOM 对象的成本是非常高的

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/img/Frame/Vue/14.png)

- 使用 Virtual DOM 来描述真实 DOM，创建一个虚拟 DOM 的属性很少，成本自然也小很多

```js
{
  sel: "div",
  data: {},
  children: undefined,
  text: "Hello Virtual DOM",
  elm: undefined,
  key: undefined
}
```

## 为什么使用 Virtual DOM

- 前端开发刀耕火种的时代，手动操作 DOM 比较麻烦，还需要考虑浏览器兼容性问题，虽然有 jQuery 等库简化 DOM 操作，但是随着项目的复杂 DOM 操作复杂提升
- 为了简化 DOM 的复杂操作于是出现了各种 MVVM 框架，MVVM 框架解决了视图和状态的同步问题
- 为了简化视图的操作可以使用模板引擎，但是模板引擎没有解决跟踪状态变化的问题
- 虚拟 DOM 跟踪状态变化，Virtual DOM 的好处是当状态改变时不需要立即更新 DOM，只需要创建一个虚拟 DOM 树来描述真实的 DOM 树， Virtual DOM 内部将弄清楚如何有效(diff)的更新真实 DOM，它内部将使用 Diff 算法来找到状态的差异，只更新变化的部分
- 参考 github 上 [virtual-dom](https://github.com/Matt-Esch/virtual-dom) 的动机描述
  - 虚拟 DOM 可以维护程序的状态，跟踪上一次的状态
  - 通过比较前后两次状态差异更新真实 DOM

### 1. 案例演示

> 线上，观察操作后页面是否闪烁

- [jQuery-demo](https://codesandbox.io/s/jq-demo-5i7qp) 页面上的 DOM 元素会重新创建
- [Snabbdom-demo](https://codesandbox.io/s/snabbdom-demo-4hbyb) 使用虚拟 DOM

## Virtual DOM 的作用

- 维护视图和状态的关系
- 复杂视图情况下提升渲染性能
- 跨平台
  - 浏览器平台渲染 DOM
  - 服务端渲染 SSR（Nuxt.js/Next.js）
  - 原生应用（Weex/React Native）
  - 小程序（mpvue/uni-app）等

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/img/Frame/Vue/15.png)

## Virtual DOM 库

- [Snabbdom](https://github.com/snabbdom/snabbdom)
  - Vue.js 2.x 内部使用的虚拟 DOM 就是改造的 Snabbdom
  - 大约 200 SLOC (single line of code)
  - 通过模块可扩展
  - 源码使用 TypeScript 开发
  - 最快的 Virtual DOM 之一
- [virtual-dom](https://github.com/Matt-Esch/virtual-dom)
  - 最早的虚拟 DOM 开源库

## Snabbdom 基本使用

### 1. 创建项目

- 打包工具为了方便，这里我们使用 [parcel](https://parceljs.org/getting_started.html)
- 安装 parcel

```bash
npm install parcel-bundler -D
```

- 配置 package.json 中的 scripts

```json
"scripts": {
  "dev": "parcel index.html --open", // 启动
  "build": "parcel build index.html" // 编译
},
```

- 创建目录结构（此处 src 中的文件包括后续章节演示的代码，在阅读时请留意不同章节所用来演示的文件名称）

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/img/Frame/Vue/16.png)

- index.html（入口文件）

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Snabbdom-demo</title>
  </head>
  <body>
    <div id="app"></div>
    <script src="./src/01-basicusage.js"></script>
  </body>
</html>
```

### 2. 导入 Snabbdom

- [Snabbdom 文档](https://github.com/snabbdom/snabbdom?tab=readme-ov-file)
- [Snabbdom 文档中文](https://github.com/snabbdom/snabbdom/blob/master/README-zh_CN.md)

- 安装 Snabbdom

```bash
npm intall snabbdom@3.6.2
```

- 导入 Snabbdom
  - Snabbdom 的两个核心函数 init 和 h
  - init 是一个高阶函数，接收数组作为参数，数组中加载的是 Snabbdom 模块，返回 patch
  - h 返回虚拟节点 Vnode，这个函数我们在使用 Vue.js 的时候见过

```js
import { init } from 'snabbdom/init'
import { h } from 'snabbdom/h'
const patch = init([])
```

> [!warning]
> 此时运行的话会告诉我们找不到 init / h 模块，因为模块路径并不是 snabbdom/int，这个路径是在 package.json 中的 exports 字段设置的，而我们使用的打包工具不支持 exports 这个字段，webpack 4 也不支持，webpack 5 支持该字段，该字段在导入 snabbdom/init 的时候会补全路径成 snabbdom/build/package/init.js

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/img/Frame/Vue/17.png)

- 如果使用不支持 package.json 的 exports 字段的打包工具，我们应该把模块的路径写全
  - 查看安装的 snabbdom 的目录结构

```js
import { h } from 'snabbdom/build/package/h'
import { init } from 'snabbdom/build/package/init'
import { classModule } from 'snabbdom/build/package/modules/class'
```

- 回顾 Vue 中的 render 函数

```js
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
```

- thunk() 是一种优化策略，可以在处理不可变数据时使用

### 3. 案例 1

#### 3.1 basicusage.js

```js
import { init } from 'snabbdom/build/package/init'
import { h } from 'snabbdom/build/package/h'

const patch = init([])

// h() 返回虚拟节点 VNode
// 第一个参数：标签 + 选择器
// 第二个参数：如果是字符串就是标签中的文本内容
// div#container.cls：标签是 div、id选择器#container、类选择器 .cls
let vnode = h('div#container.cls', 'Hello World')
let app = document.querySelector('#app')

// 第一个参数：旧的 VNode，可以是 DOM 元素
// 第二个参数：新的 VNode
// path 内部会对比两个 VNode 的差异，并将差异更新到真实 DOM
// 返回新的 VNode，作为下一次的 oldVnode，也就是把当前状态保存起来
let oldVnode = patch(app, vnode)

vnode = h('div#container.xxx', 'Hello Snabbdom')
patch(oldVnode, vnode)
```

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/img/Frame/Vue/18.png)

### 4. 案例 2

#### 4.1 basicusage.js

```js
import { init } from 'snabbdom/build/package/init'
import { h } from 'snabbdom/build/package/h'

const patch = init([])

let vnode = h('div#container', [h('h1', 'Hello Snabbdom'), h('p', '这是一个p')])

let app = document.querySelector('#app')
let oldVnode = patch(app, vnode)

setTimeout(() => {
  // 这里我们假设 h1 和 p 是存储在服务器上的，要向服务器发送请求获取数据，
  // 当获取到内容后，在把数据设置到 h1 和 p 标签，这里我们用定时器模拟一下
  // vnode = h("div#container", [h("h1", "Hello World"), h("p", "Hello P")]);
  // patch(oldVnode, vnode);

  // 清除 div 中的内容，会生成一个空的注释节点
  patch(oldVnode, h('!'))
}, 2000)
```

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/img/Frame/Vue/19.png)

#### 4.2 定时器回调函数执行

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/img/Frame/Vue/20.png)

## Snabbdom 模块的使用

### 1. 模块的作用

- Snabbdom 的核心库并不能处理 DOM 元素的属性/样式/事件等，可以通过注册 Snabbdom 默认提供的模块来实现
- Snabbdom 中的模块可以用来扩展 Snabbdom 的功能
- Snabbdom 中的模块的实现是通过注册全局的钩子函数来实现的

### 2. 官方提供的模块

> [!info]
> 官方提供了 6 个模块
>
> 1. attributes
>
> - 设置 DOM 元素的属性，使用 setAttribute
> - 会对 DOM 对象的布尔类型的属性做判断，如：selected、checked 等
>
> 2. props
>
> - 和 attributes 模块相似，设置 DOM 元素的属性，内部设置属性的方式是通过[对象.属性]的方式实现的
> - 不会处理布尔类型的属性
>
> 3. dataset
>
> - 处理 HTML5 中提供的 data- 这样的自定义属性
>
> 4. class
>
> - 切换类样式
> - 如果要设置类样式，可以通过 h 函数的第一个参数设置
>
> 5. style
>
> - 设置行内样式，支持过渡动画
>
> 6. eventlisteners
>
> - 注册和移除事件

### 3. 模块的使用步骤

- 导入需要的模块（类似插件，不在核心库中）
- init 中注册模块
- 使用 h 函数创建 VNode 的时候，可以把第二个参数设置为对象，这个对象就是设置模块中需要的数据，其他参数往后移

#### 3.1 modules.js

```js
import { init } from 'snabbdom/build/package/init'
import { h } from 'snabbdom/build/package/h'

// 1. 导入模块
import { styleModule } from 'snabbdom/build/package/modules/style'
import { eventListenersModule } from 'snabbdom/build/package/modules/eventlisteners'

// 2. 注册模块
const patch = init([styleModule, eventListenersModule])

// 3. 使用 h() 函数的第二个参数传入模块中使用的数据（对象）
let vnode = h('div', [
  h('h1', { style: { backgroundColor: 'red' } }, 'Hello World'),
  h('p', { on: { click: eventHandler } }, 'Hello P')
])

function eventHandler() {
  console.log('别点我')
}

let app = document.querySelector('#app')
patch(app, vnode)
```

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/img/Frame/Vue/21.png)

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/img/Frame/Vue/22.png)

## Snabbdom 源码解析

### 1. Snabbdom 的核心

- 使用 h 函数创建 JavaScript 对象（Vnode）描述真实 DOM
- init 设置模块，创建 patch 函数
- patch 比较新旧两个 VNode
- 把变化的内容更新到真实 DOM 树

### 2. Snabbdom 源码

- 地址：[https://github.com/snabbdom/snabbdom](https://github.com/snabbdom/snabbdom)
- 克隆代码：`git clone -b v3.6.2 --depth=1 https://github.com/snabbdom/snabbdom.git`

### 2. h 函数

- 作用：创建 VNode 对象
- Vue 中的 h 函数

```js
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
```

- h 函数最早见于 [hyperscript](https://github.com/hyperhype/hyperscript)，使用 JavaScript 创建超文本
- Snabbdom 中的 h 函数源于 hyperscript 的 h 函数，它增强了 h 函数的功能，不在用来创建超文本，而是创建 VNode
- h 函数源码位置：src/package/h.ts

```js
import { vnode, VNode, VNodeData } from './vnode'
import * as is from './is'

export type VNodes = VNode[]
export type VNodeChildElement = VNode | string | number | undefined | null
export type ArrayOrElement<T> = T | T[]
export type VNodeChildren = ArrayOrElement<VNodeChildElement>

function addNS (data: any, children: VNodes | undefined, sel: string | undefined): void {
  data.ns = 'http://www.w3.org/2000/svg'
  if (sel !== 'foreignObject' && children !== undefined) {
    for (let i = 0; i < children.length; ++i) {
      const childData = children[i].data
      if (childData !== undefined) {
        addNS(childData, (children[i] as VNode).children as VNodes, children[i].sel)
      }
    }
  }
}

// h 函数的重载
export function h (sel: string): VNode
export function h (sel: string, data: VNodeData | null): VNode
export function h (sel: string, children: VNodeChildren): VNode
export function h (sel: string, data: VNodeData | null, children: VNodeChildren): VNode
export function h (sel: any, b?: any, c?: any): VNode {
  var data: VNodeData = {}
  var children: any
  var text: any
  var i: number
  // 处理参数，实现重载的机制
  if (c !== undefined) {
    // 处理三个参数的情况
    // sel、data、children/text
    if (b !== null) {
      data = b
    }
    if (is.array(c)) {
      children = c
      // 如果 c 是字符串或者数字
    } else if (is.primitive(c)) {
      text = c
      // 如果 c 是 VNode
    } else if (c && c.sel) {
      children = [c]
    }
  } else if (b !== undefined && b !== null) {
    // 处理两个参数的情况
    // 如果 b 是数组
    if (is.array(b)) {
      children = b
      // 如果 b 是字符串或者数字
    } else if (is.primitive(b)) {
      text = b
      // 如果 b 是 VNode
    } else if (b && b.sel) {
      children = [b]
    } else { data = b }
  }
  if (children !== undefined) {
    // 处理 children 中的原始值(string/number)
    for (i = 0; i < children.length; ++i) {
      // 如果 child 是 string/number，创建文本节点
      if (is.primitive(children[i])) children[i] = vnode(undefined, undefined, undefined, children[i], undefined)
    }
  }
  if (
    sel[0] === 's' && sel[1] === 'v' && sel[2] === 'g' &&
    (sel.length === 3 || sel[3] === '.' || sel[3] === '#')
  ) {
    // 如果是 svg，添加命名空间
    addNS(data, children, sel)
  }
  // 返回 VNode
  return vnode(sel, data, children, text, undefined)
};
```

#### 2.1 函数重载

- 参数个数或参数类型不同的函数
- JavaScript 中没有重载的概念
- TypeScript 中有重载，不过重载的实现还是通过代码调整参数

##### 2.1.1 参数个数

```js
function add(a: number, b: number) {
  console.log(a + b);
}
function add(a: number, b: number, c: number) {
  console.log(a + b + c);
}
add(1, 2); // 调用的是第一个函数
add(1, 2, 3); // 调用的是第二个函数
```

##### 2.1.2 参数类型

```js
function add(a: number, b: number) {
  console.log(a + b);
}
function add(a: number, b: string) {
  console.log(a + b);
}
add(1, 2);  // 调用的是第一个函数
add(1, '2'); // 调用的是第二个函数
```

### 3. VNode 函数

- 一个 VNode 就是一个虚拟节点用来描述一个 DOM 元素，如果这个 VNode 有 children 就是 Virtual DOM
- 源码位置：src/package/vnode.ts

```js
import { Hooks } from './hooks'
import { AttachData } from './helpers/attachto'
import { VNodeStyle } from './modules/style'
import { On } from './modules/eventlisteners'
import { Attrs } from './modules/attributes'
import { Classes } from './modules/class'
import { Props } from './modules/props'
import { Dataset } from './modules/dataset'
import { Hero } from './modules/hero'

export type Key = string | number

export interface VNode {
  // 选择器
  sel: string | undefined
  // 节点数据：属性/样式/事件等
  data: VNodeData | undefined
  // 子节点，和 下边的 text 只能互斥，二者只有一个起作用
  children: Array<VNode | string> | undefined
  // 记录 vnode 对应的真实 DOM
  elm: Node | undefined
  // 节点中的文本内容，和 children 互斥
  text: string | undefined
  // 唯一标识节点（优化用）
  key: Key | undefined
}

export interface VNodeData {
  props?: Props
  attrs?: Attrs
  class?: Classes
  style?: VNodeStyle
  dataset?: Dataset
  on?: On
  hero?: Hero
  attachData?: AttachData
  hook?: Hooks
  key?: Key
  ns?: string // for SVGs
  fn?: () => VNode // for thunks
  args?: any[] // for thunks
  [key: string]: any // for any other 3rd party module
}

export function vnode (sel: string | undefined,
  data: any | undefined,
  children: Array<VNode | string> | undefined,
  text: string | undefined,
  elm: Element | Text | undefined): VNode {
  const key = data === undefined ? undefined : data.key
  return { sel, data, children, text, elm, key }
}
```

### 4. VNode 渲染成真实 DOM 的过程（Snabbdom 核心）

#### 4.1 patch 整体过程分析

- patch（oldVnode, newVnode）
- 打补丁，把新节点中变化的内容渲染到真实 DOM，最后返回新节点作为下一次处理的旧节点
- 对比新旧 VNode 是否相同节点（节点的 key[唯一标识] 和 sel[选择器] 相同）
- 如果不是相同节点，删除之前的内容，重新渲染
- 如果是相同节点，再判断新的 VNode 是否有 text，如果有并且和 oldVnode 的 text 不同，直接更新文本内容
- 如果新的 VNode 有 children，判断子节点是否有变化，判断子节点的过程使用的就是 diff 算法
- diff 过程只进行同层级比较

#### 4.2 init

##### 4.2.1 功能

- init(modules, domApi)，返回 patch 函数（高阶函数）

> [!warning]
> 为什么要使用高阶函数？
>
> - 因为 patch 函数再外部会调用多次，每次调用依赖一些参数，比如：modules/domApi/cbs
> - 通过高阶函数让 init 内部形成闭包，返回的 patch 可以访问到 modules/domApi/cbs，而不需要重新创建

- init 在返回 patch 之前，首先收集了所有模块中的钩子函数存储到 cbs 对象中
- 源码位置：src/package/init.ts

```js

...

// 存储钩子函数的名称
const hooks: Array<keyof Module> = ['create', 'update', 'remove', 'destroy', 'pre', 'post']

// 参数1：模块数组、参数2: 把 VNode 对象转换成其它平台下对应的元素，没有传入则默认 DOMAPI
export function init (modules: Array<Partial<Module>>, domApi?: DOMAPI) {
  let i: number
  let j: number
  const cbs: ModuleHooks = {
    create: [],
    update: [],
    remove: [],
    destroy: [],
    pre: [],
    post: []
  }
  // 初始化 转换虚拟节点的 api
  const api: DOMAPI = domApi !== undefined ? domApi : htmlDomApi
  // 把传入的所有模块的钩子函数，统一存储到 cbs 对象中
  for (i = 0; i < hooks.length; ++i) {
    // cbs['create'] = [], cbs['update'] = [] ...
    cbs[hooks[i]] = []
    for (j = 0; j < modules.length; ++j) {
      // modules 传入的模块数组
      // 获取其中的 hook 函数
      // const hook = modules[0]['create']
      const hook = modules[j][hooks[i]]
      if (hook !== undefined) {
        // 把获取到的hook函数放入到 cbs 对应的钩子函数数组中
        //  cbs ----> { create: [fn1, fn2], update: [fn1, fn2], ... }
        (cbs[hooks[i]] as any[]).push(hook)
      }
    }
  }

...

  // init 内部返回 patch 函数，把 vnode 渲染成真实 dom，并返回 vnode
  return function patch (oldVnode: VNode | Element, vnode: VNode): VNode {...}
```

#### 4.3 patch

##### 4.3.1 功能

- 传入新旧 VNode，对比差异，把差异渲染到 DOM
- 返回新的 VNode，作为下一次 patch 的 oldVnode

##### 4.3.2 执行过程

- 首先执行模块中的钩子函数 pre
- 如果 oldVnode 和 vnode 相同（key 和 sel 相同）
  - 调用 patchVnode，找节点的差异并更新 DOM
- 如果 oldVnode 是 DOM 元素

  - 把 DOM 元素转换成 oldVnode
  - 调用 createElm 把 vnode 转换为真实 DOM，记录到 vnode.elm
  - 把刚创建的 DOM 元素插入到 parent 中
  - 移除老节点
  - 触发用户设置的 create 钩子函数

- 源码位置：src/package/init.ts

```js
// init 内部返回 patch 函数，把 vnode 渲染成真实 dom，并返回新的 vnode，作为下次的 oldVnode
return function patch(oldVnode: VNode | Element, vnode: VNode): VNode {
  let i: number, elm: Node, parent: Node;
  // 保存新插入节点的队列，为了触发钩子函数
  const insertedVnodeQueue: VNodeQueue = [];
  // 执行模块的 pre 钩子函数
  for (i = 0; i < cbs.pre.length; ++i) cbs.pre[i]();
  // 如果 oldVnode 不是 VNode，创建 VNode 并设置 elm
  if (!isVnode(oldVnode)) {
    // 把 DOM 元素转换成空的 VNode
    oldVnode = emptyNodeAt(oldVnode);
  }
  // 如果新旧节点是相同节点(key 和 sel 相同)
  if (sameVnode(oldVnode, vnode)) {
    // 找节点的差异并更新 DOM
    patchVnode(oldVnode, vnode, insertedVnodeQueue);
  } else {
    // 如果新旧节点不同，vnode 创建对应的 DOM
	// 获取当前的 DOM 元素
    elm = oldVnode.elm!;
    parent = api.parentNode(elm) as Node
    // 触发 init/create 钩子函数,创建 DOM
    createElm(vnode, insertedVnodeQueue);

    if (parent !== null) {
      // 如果父节点不为空，把 vnode 对应的 DOM 插入到文档中
      api.insertBefore(parent, vnode.elm!, api.nextSibling(elm));
      // 移除老节点
      removeVnodes(parent, [oldVnode], 0, 0);
    }
  }
  // 执行用户设置的 insert 钩子函数
  for (i = 0; i < insertedVnodeQueue.length; ++i) {
  insertedVnodeQueue[i].data!.hook!.insert!(insertedVnodeQueue[i])
  }
  // 执行模块的 post 钩子函数
  for (i = 0; i < cbs.post.length; ++i) cbs.post[i]();
  // 返回 vnode
  return vnode;
};
```

#### 4.4 createElm 函数

##### 4.4.1 功能

- createElm(vnode, insertedVnodeQueue)，返回创建的 DOM 元素
- 创建 vnode 对应的 DOM 元素

```js
import { h, init } from 'snabbdom'

// 1. hello world
// 参数：数组，模块
// 返回值：patch函数，作用对比两个vnode的差异更新到真实DOM
let patch = init([])
// 第一个参数：标签+选择器
// 第二个参数：如果是字符串的话就是标签中的内容
// let vnode = h('div#container.cls', 'Hello World')
let vnode = h(
  'div#container.cls',
  {
    // 传递钩子函数
    hook: {
      init(vnode) {
        console.log(vnode.elm)
      },
      create(emptyVnode, vnode) {
        console.log(vnode.elm)
      }
    }
  },
  'Hello World'
)

let app = document.querySelector('#app')
// 第一个参数：可以是DOM元素，内部会把DOM元素转换成VNode
// 第二个参数：VNode
// 返回值：VNode
let oldVnode = patch(app, vnode)

// 假设的时刻
vnode = h('div', 'Hello Snabbdom')

patch(oldVnode, vnode)
```

##### 4.4.2 执行过程

- 首先触发用户设置的 init 钩子函数
- 如果选择器是!，创建评论节点
- 如果选择器为空，创建文本节点
- 如果选择器不为空

  - 解析选择器，设置标签的 id 和 class 属性
  - 执行模块的 create 钩子函数
  - 如果 vnode 有 children，创建子 vnode 对应的 DOM，追加到 DOM 树
  - 如果 vnode 的 text 值是 string/number，创建文本节点并追击到 DOM 树
  - 执行用户设置的 create 钩子函数
  - 如果有用户设置的 insert 钩子函数，把 vnode 添加到队列中

- 源码位置：src/package/init.ts

```js
function createElm (vnode: VNode, insertedVnodeQueue: VNodeQueue): Node {
  let i: any
  let data = vnode.data
  if (data !== undefined) {
    // 执行用户设置的 init 钩子函数
    const init = data.hook?.init
    if (isDef(init)) {
      init(vnode)
      data = vnode.data
    }
  }
  const children = vnode.children
  const sel = vnode.sel
  // 把 vnode 转换成真实 DOM 对象（没有渲染到页面）
  if (sel === '!') {
    // 如果选择器是!，创建注释节点
    if (isUndef(vnode.text)) {
      vnode.text = ''
    }
    vnode.elm = api.createComment(vnode.text!)
  } else if (sel !== undefined) {
    // 如果选择器不为空
    // 解析选择器
    // Parse selector
    const hashIdx = sel.indexOf('#')
    const dotIdx = sel.indexOf('.', hashIdx)
    const hash = hashIdx > 0 ? hashIdx : sel.length
    const dot = dotIdx > 0 ? dotIdx : sel.length
    const tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel
    const elm = vnode.elm = isDef(data) && isDef(i = data.ns)
      ? api.createElementNS(i, tag)
      : api.createElement(tag)
    if (hash < dot) elm.setAttribute('id', sel.slice(hash + 1, dot))
    if (dotIdx > 0) elm.setAttribute('class', sel.slice(dot + 1).replace(/\./g, ' '))
    // 执行模块的 create 钩子函数
    for (i = 0; i < cbs.create.length; ++i) cbs.create[i](emptyNode, vnode)
    // 如果 vnode 中有子节点，创建子 vnode 对应的 DOM 元素并追加到 DOM 树上
    if (is.array(children)) {
      for (i = 0; i < children.length; ++i) {
        const ch = children[i]
        if (ch != null) {
          api.appendChild(elm, createElm(ch as VNode, insertedVnodeQueue))
        }
      }
    } else if (is.primitive(vnode.text)) {
      // 如果 vnode 的 text 值是 string/number，创建文本节点并追加到 DOM 树
      api.appendChild(elm, api.createTextNode(vnode.text))
    }
    const hook = vnode.data!.hook
    if (isDef(hook)) {
      // 执行用户传入的钩子 create
      hook.create?.(emptyNode, vnode)
      // 把 vnode 添加到队列中，为后续执行 insert 钩子做准备
      if (hook.insert) {
        insertedVnodeQueue.push(vnode)
      }
    }
  } else {
    // 如果选择器为空，创建文本节点
    vnode.elm = api.createTextNode(vnode.text!)
  }
  // 返回新创建的 DOM
  return vnode.elm
}
```

#### 4.5 removeVnodes 和 addVnodes

- 源码位置：src/package/init.ts

```js
function removeVnodes (parentElm: Node,
  vnodes: VNode[],
  startIdx: number,
  endIdx: number): void {
  for (; startIdx <= endIdx; ++startIdx) {
    let listeners: number
    let rm: () => void
    const ch = vnodes[startIdx]
    if (ch != null) {
      // 如果 sel 有值
      if (isDef(ch.sel)) {
        // 执行 destroy 钩子函数（会执行所有子节点的 destroy 钩子函数）
        invokeDestroyHook(ch)
        listeners = cbs.remove.length + 1
        // 创建删除的回调函数
        rm = createRmCb(ch.elm!, listeners)
        for (let i = 0; i < cbs.remove.length; ++i) cbs.remove[i](ch, rm)
        // 执行用户设置的 remove 钩子函数
        const removeHook = ch?.data?.hook?.remove
        if (isDef(removeHook)) {
          removeHook(ch, rm)
        } else {
          // 如果没有用户钩子函数，直接调用删除元素的方法
          rm()
        }
      } else { // Text node
        // 如果是文本节点，直接调用删除元素的方法
        api.removeChild(parentElm, ch.elm!)
      }
    }
  }
}

function invokeDestroyHook (vnode: VNode) {
  const data = vnode.data
  if (data !== undefined) {
    // 执行用户设置的 destroy 钩子函数
    data?.hook?.destroy?.(vnode)
    // 调用模块的 distroy 钩子函数
    for (let i = 0; i < cbs.destroy.length; ++i) cbs.destroy[i](vnode)
    // 执行子节点的 distroy 钩子函数
    if (vnode.children !== undefined) {
      for (let j = 0; j < vnode.children.length; ++j) {
        const child = vnode.children[j]
        if (child != null && typeof child !== 'string') {
          // 递归调用
          invokeDestroyHook(child)
        }
      }
    }
  }
}

function createRmCb (childElm: Node, listeners: number) {
  // 返回删除元素的回调函数
  return function rmCb () {
    if (--listeners === 0) {
      const parent = api.parentNode(childElm) as Node
      api.removeChild(parent, childElm)
    }
  }
}
```

- 源码位置：src/package/init.ts

```js
function addVnodes (
  parentElm: Node,
  before: Node | null,
  vnodes: VNode[],
  startIdx: number,
  endIdx: number,
  insertedVnodeQueue: VNodeQueue
) {
  for (; startIdx <= endIdx; ++startIdx) {
    const ch = vnodes[startIdx]
    if (ch != null) {
      api.insertBefore(parentElm, createElm(ch, insertedVnodeQueue), before)
    }
  }
}
```

#### 4.6 patchVnode 函数

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/img/Frame/Vue/23.png)

##### 4.6.1 功能

- patchVnode(oldVnode, vnode, insertedVnodeQueue)
- 对比 oldVnode 和 vnode 的差异，把差异渲染到 DOM

##### 4.6.2 执行过程

- 首先执行用户设置的 prepatch 钩子函数
- 执行 create 钩子函数
  - 首先执行模块的 create 钩子函数
  - 然后执行用户设置的 create 钩子函数
- 如果 vnode.text 未定义
  - 如果 oldVnode.children 和 vnode.children 都有值
    - 调用 updateChildren
    - 使用 diff 算法对比子节点，更新子节点
  - 如果 vnode.children 有值，oldVnode.children 无值
    - 清空 DOM 元素
    - 调用 addVnodes，批量添加子节点
  - 如果 oldVnode.children 有值，vnode.children 无值
    - 调用 removeVnodes，批量移除子节点
  - 如果 oldVnode.text 有值
    - 清空 DOM 元素的内容
- 如果设置了 vnode.text 并且和 oldVnode.text 不等
  - 如果老节点有子节点，全部移除
  - 设置 DOM 元素的 textContent 为 vnode.text
- 最后执行用户设置的 postpatch 钩子函数

- 源码位置：src/package/init.ts

```js
function patchVnode (oldVnode: VNode, vnode: VNode, insertedVnodeQueue: VNodeQueue) {
  // 第一个过程：触发 prepathch 和 update 钩子函数
  const hook = vnode.data?.hook
  hook?.prepatch?.(oldVnode, vnode)
  const elm = vnode.elm = oldVnode.elm!
  const oldCh = oldVnode.children as VNode[]
  const ch = vnode.children as VNode[]
  if (oldVnode === vnode) return
  if (vnode.data !== undefined) {
    for (let i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
    vnode.data.hook?.update?.(oldVnode, vnode)
  }
  // 第二个过程：真正对比新旧 vnode 差异的地方
  if (isUndef(vnode.text)) {
    if (isDef(oldCh) && isDef(ch)) {
      if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue)
    } else if (isDef(ch)) {
      if (isDef(oldVnode.text)) api.setTextContent(elm, '')
      addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
    } else if (isDef(oldCh)) {
      removeVnodes(elm, oldCh, 0, oldCh.length - 1)
    } else if (isDef(oldVnode.text)) {
      api.setTextContent(elm, '')
    }
  } else if (oldVnode.text !== vnode.text) {
    if (isDef(oldCh)) {
      removeVnodes(elm, oldCh, 0, oldCh.length - 1)
    }
    api.setTextContent(elm, vnode.text!)
  }
  // 第三个过程：触发 postpatch 钩子函数
  hook?.postpatch?.(oldVnode, vnode)
}
```

#### 4.7 updateChildren 整体执行过程

> Diff 算法的核心，对比所有子节点的差异，并更新 DOM

##### 4.7.1 虚拟 DOM 中为什么要使用 Diff 算法

- 渲染真实 DOM 的开销很大，DOM 操作会引起浏览器的重排和重绘，也就是浏览器重新渲染，浏览器重新渲染页面是非常消耗性能的
- 虚拟 DOM 中 Diff 的核心是当数据变化后，不直接操作 DOM 而是用 JS 对象来描述真实 DOM，当数据变化后，会先比较 JS 对象是否发生变化，找到变化后的位置，最后只去最小化的更新变化后的位置，从而提高性能

##### 4.7.2 虚拟 DOM 中的 Diff 算法

- Diff 是一种算法，类似于排序算法
- 虚拟 DOM 中的 Diff 算法用来查找两颗树上所有节点的差异

###### 方式一：查找两颗树每一个节点的差异

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/img/Frame/Vue/24.png)

###### 方式二：Snbbdom 根据 DOM 的特点对传统的 diff 算法做了优化

- DOM 操作时候很少会跨级别操作节点
- 只比较同级别节点

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/img/Frame/Vue/25.png)

###### Snbbdom 对比子节点的执行过程

- 在对开始和结束节点比较的时候，总共有四种情形
  - oldStartVnode / newStartVnode (旧开始节点 / 新开始节点)
  - oldEndVnode / newEndVnode (旧结束节点 / 新结束节点)
  - oldStartVnode / newEndVnode (旧开始节点 / 新结束节点)
  - oldEndVnode / newStartVnode (旧结束节点 / 新开始节点)

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/img/Frame/Vue/26.png)

###### 开始和结束节点

- 如果新旧开始节点是 sameVnode (key 和 sel 相同，如果是 sameVnode 会重用之前旧节点 DOM元素)
  - 调用 patchVnode 对比和更新节点，将差异更新到重用的 DOM 元素上
  - 把旧开始和新开始索引往后移动 oldStartIdx++ / newStartIdx++

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/img/Frame/Vue/27.png)

###### 旧开始节点 / 新结束节点

- 调用 patchVnode 对比和更新节点
- 把 oldStartVnode 对应的 DOM 元素，移动到右边，更新索引

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/img/Frame/Vue/28.png)

###### 旧结束节点 / 新开始节点

- 调用 patchVnode 对比和更新节点
- 把 oldEndVnode 对应的 DOM 元素，移动到左边，更新索引

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/img/Frame/Vue/29.png)

###### 非上述四种情况

- 遍历新节点，使用 newStartNode 的 key 在老节点数组中找相同节点
- 如果没有找到，说明 newStartNode 是新节点
  - 创建新节点对应的 DOM 元素，插入到 DOM 树中
- 如果找到了
  - 判断新节点和找到的老节点的 sel 选择器是否相同
  - 如果不相同，说明节点被修改了
  - 重新创建对应的 DOM 元素，插入到 DOM 树中
  - 如果相同，把 elmToMove 对应的 DOM 元素，移动到左边

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/img/Frame/Vue/30.png)

###### 循环结束

- 当老节点的所有子节点先遍历完 (oldStartIdx > oldEndIdx)， 循环结束
  - 说明新节点有剩余，把剩余节点批量插入到右边

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/img/Frame/Vue/31.png)

- 新节点的所有子节点先遍历完 (newStartIdx > newEndIdx)，循环结束
  - 说明老节点有剩余，把剩余节点批量删除

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/img/Frame/Vue/32.png)

#### 4.8 updateChildren 函数

- 源码位置：src/package/init.ts

```js
function createKeyToOldIdx (children: VNode[], beginIdx: number, endIdx: number): KeyToIndexMap {
  const map: KeyToIndexMap = {}
  for (let i = beginIdx; i <= endIdx; ++i) {
    const key = children[i]?.key
    if (key !== undefined) {
      map[key] = i
    }
  }
  return map
}

function updateChildren (parentElm: Node,
  oldCh: VNode[],
  newCh: VNode[],
  insertedVnodeQueue: VNodeQueue) {
  // 旧开始节点索引
  let oldStartIdx = 0
  // 新开始节点索引
  let newStartIdx = 0
  // 旧结束节点索引
  let oldEndIdx = oldCh.length - 1
  // 旧开始节点
  let oldStartVnode = oldCh[0]
  // 旧结束节点
  let oldEndVnode = oldCh[oldEndIdx]
  // 新结束节点索引
  let newEndIdx = newCh.length - 1
  // 新的开始节点
  let newStartVnode = newCh[0]
  // 新的结束节点
  let newEndVnode = newCh[newEndIdx]
  let oldKeyToIdx: KeyToIndexMap | undefined
  let idxInOld: number
  let elmToMove: VNode
  let before: any
  // 同级别节点比较
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    // 索引变化后，可能会把节点设置为空
    if (oldStartVnode == null) {
    // 节点为空移动索引
      oldStartVnode = oldCh[++oldStartIdx] // Vnode might have been moved left
    } else if (oldEndVnode == null) {
      oldEndVnode = oldCh[--oldEndIdx]
    } else if (newStartVnode == null) {
      newStartVnode = newCh[++newStartIdx]
    } else if (newEndVnode == null) {
      newEndVnode = newCh[--newEndIdx]
      // 比较开始和结束节点的四种情况
    } else if (sameVnode(oldStartVnode, newStartVnode)) {
    // 1. 比较老开始节点和新的开始节点
      patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue)
      oldStartVnode = oldCh[++oldStartIdx]
      newStartVnode = newCh[++newStartIdx]
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
      // 2. 比较老结束节点和新的结束节点
      patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue)
      oldEndVnode = oldCh[--oldEndIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
    // 3. 比较老开始节点和新的结束节点
      patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue)
      api.insertBefore(parentElm, oldStartVnode.elm!, api.nextSibling(oldEndVnode.elm!))
      oldStartVnode = oldCh[++oldStartIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
    // 4. 比较老结束节点和新的开始节点
      patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue)
      api.insertBefore(parentElm, oldEndVnode.elm!, oldStartVnode.elm!)
      oldEndVnode = oldCh[--oldEndIdx]
      newStartVnode = newCh[++newStartIdx]
    } else {
    // 开始节点和结束节点都不相同
    // 使用 newStartNode 的 key 再老节点数组中找相同节点
    // 先设置记录 key 和 index 的对象
      if (oldKeyToIdx === undefined) {
        oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
      }
      // 遍历 newStartVnode, 从老的节点中找相同 key 的 oldVnode 的索引
      idxInOld = oldKeyToIdx[newStartVnode.key as string]
        // 如果是新的vnode
      if (isUndef(idxInOld)) { // New element
        // 如果没找到，newStartNode 是新节点
    // 创建元素插入 DOM 树
        api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm!)
      } else {
      // 如果找到相同 key 相同的老节点，记录到 elmToMove 遍历
        elmToMove = oldCh[idxInOld]
        if (elmToMove.sel !== newStartVnode.sel) {
          // 如果新旧节点的选择器不同
    // 创建新开始节点对应的 DOM 元素，插入到 DOM 树中
          api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm!)
        } else {
          // 如果相同，patchVnode()
    // 把 elmToMove 对应的 DOM 元素，移动到左边
          patchVnode(elmToMove, newStartVnode, insertedVnodeQueue)
          oldCh[idxInOld] = undefined as any
          api.insertBefore(parentElm, elmToMove.elm!, oldStartVnode.elm!)
        }
      }
      // 重新给 newStartVnode 赋值，指向下一个新节点
      newStartVnode = newCh[++newStartIdx]
    }
  }
  // 循环结束的收尾工作
  if (oldStartIdx <= oldEndIdx || newStartIdx <= newEndIdx) {
    if (oldStartIdx > oldEndIdx) {
      // 如果老节点数组先遍历完成，说明有新的节点剩余
  // 把剩余的新节点都插入到右边
      before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm
      addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
    } else {
      // 如果新节点数组先遍历完成，说明老节点有剩余
  // 批量删除老节点
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
    }
  }
}
```

#### 4.9 Key 的意义

- Snabbdom 中使用的 Key 和 Vue 中使用的 Key 意义是一样的，都是在 Diff 算法中用来比较 VNode 是否是相同节点，如果不设置 Key，会最大程度重用当前的 DOM 元素
- 但是，重用当前的 DOM 元素有时候会有问题

##### 4.9.1 案例

```js
import { init } from 'snabbdom/build/package/init'
import { h } from 'snabbdom/build/package/h'
import { attributesModule } from 'snabbdom/build/package/modules/attributes'
import { eventListenersModule } from 'snabbdom/build/package/modules/eventlisteners'

let patch = init([attributesModule, eventListenersModule])

const data = [1, 2, 3, 4]
let oldVnode = null

function view(data) {
  let arr = []
  data.forEach(item => {
    // 不设置 key
    arr.push(h('li', [h('input', { attrs: { type: 'checkbox' } }), h('span', item)]))
    // 设置key
    // arr.push(h('li', { key: item }, [h('input', { attrs: { type: 'checkbox' } }), h('span', item)]))
  })
  let vnode = h('div', [
    h(
      'button',
      {
        on: {
          click: function () {
            data.unshift(100)
            vnode = view(data)
            oldVnode = patch(oldVnode, vnode)
          }
        }
      },
      '按钮'
    ),
    h('ul', arr)
  ])
  return vnode
}

let app = document.querySelector('#app')
// 首次渲染
oldVnode = patch(app, view(data))
```

- 点击按钮后（未设置 key）
  - 判断新旧节点开始，会重用当前的 DOM 元素，标签内的文字改变了会更新
- 点击按钮后（设置 key）
  - 新旧开始节点都有 key 值且不相同，会重新创建节点，不会造成渲染错误
