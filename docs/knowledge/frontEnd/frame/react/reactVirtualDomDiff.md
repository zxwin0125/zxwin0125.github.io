---
title: 关于 VirtualDOM 和 Diff
order: 2
---

## DOM 操作问题

- 在现代 web 应用程序中使用 JavaScript 操作 DOM 是必不可少且频繁的
- 但是这个操作是非常消耗性能的，因为 JavaScript 操作 DOM 对象要比操作其他对象要慢得多
- 大多数 JavaScript 框架对于 DOM 的更新远远超过其必须进行的更新，从而使得这种缓慢操作变得更糟

> [!info]
> 举例
> - 有一个数组，数组中存储了10项内容，通过这10项内容生成了10个 `<li>`
> - 当数组中某一项内容发生变化时，大多数 JavaScript 框架会根据这个数组 **<font color=red>重新构建整个列表</font>**，这比 **<font color=red>必要的工作</font>**（只更新一项）多出了十倍

- 更新效率低下已经成为严重问题，为了解决这个问题，React 普及了一种叫做 Virtual DOM 的东西，Virtual DOM 出现的目的就是为了 **<font color=red>提高 JavaScript 操作 DOM 对象的效率</font>**

## 什么是 Virtual DOM

- Virtual DOM 对象是 DOM 对象的 JavaScript 对象表现形式
  - 其实就是使用 JavaScript 对象来描述 DOM 对象信息
  - 比如 DOM 对象的类型是什么，它身上有哪些属性，它拥有哪些子元素
- 在 React 中，每个 DOM 对象都有一个对应的 Virtual DOM 对象
- 可以把 Virtual DOM 对象理解为 DOM 对象的副本，但是它不能直接显示在屏幕上

```jsx
<div className="container">
  <h3>Hello React</h3>
  <p>React is great </p>
</div>
```
```jsx
{
  type: "div", // type表示节点的类型信息
  props: { className: "container" }, // props表示节点的属性信息
  children: [ // children表示节点的子节点信息
    {
      type: "h3",
      props: null,
      children: [
        {
          type: "text",
          props: {
            textContent: "Hello React"
          }
        }
      ]
    },
    {
      type: "p",
      props: null,
      children: [
        {
          type: "text",
          props: {
            textContent: "React is great"
          }
        }
      ]
    }
  ]
}
```

## Virtual DOM 如何提升效率

- Virtual DOM 最核心的原则就是 **<font color=red>最小化 DOM 操作</font>**，精准找出发生变化的 DOM 对象，**<font color=red>只更新发生变化的部分</font>**
  - 在 React 第一次创建 DOM 对象后，会为每个 DOM 对象创建其对应的 Virtual DOM 对象
  - 在 DOM 对象发生更新之前，React 会先更新所有的 Virtual DOM 对象
  - 然后 React 会将更新后的 Virtual DOM 和 更新前的 Virtual DOM 进行比较，从而找出发生变化的部分
  - React 只会将发生变化的部分更新到真实的 DOM 对象中，从而提高 JavaScript 操作 DOM 的性能
- Virtual DOM 对象的更新和比较仅发生在内存中，不会在视图中渲染任何内容，所以这一部分的性能损耗成本是微不足道的
- 并且 JavaScript 操作 JavaScript 对象相比操作 DOM 对象是非常快的，所以这提高了操作 DOM 的性能

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Frame/React/08.png =500x)

```jsx
// 更新前的 JSX：
<div id="container">Hello World</div>

// 更新后的 JSX：
<div id="container">Hello React</div>
```
```jsx
// 更新前的 Virtual DOM：
const before = {
  type: 'div',
  props: null,
  children: [
    {
      type: 'text',
      props: {
        textContent: 'Hello World'
      }
    }
  ]
}

// 更新后的 Virtual DOM：
const before = {
  type: 'div',
  props: null,
  children: [
    {
      type: 'text',
      props: {
        textContent: 'Hello React'
      }
    }
  ]
}
```

- 两个 Virtual DOM 对比后仅会更新 DOM 的文本内容，而不会更新整个 DOM 树（整个`<div>`）

## 创建 Virtual DOM

> Virtual DOM 对象是由 JSX 转换来的

### 1. 替换编译 JSX 时使用的函数

- 在 React 代码执行前，JSX 会先被 Babel 转换为 React.createElement 方法的调用
  - 在调用 createElement 方法时，Babel 会向这个方法传入元素的类型、属性、子元素作为参数
  - createElement 方法的返回值为构建好的 Virtual DOM 对象
- 而当前我们要模拟一个精简版的 createElement 方法：TinyReact.createElement

#### 方法一：配置 Babel（.babellc）

- 替换编译 JSX 表达式时使用的函数（progma：默认 React.createElement）：

```json
{
  "presets": [
    "@babel/preset-env",
    [
      "@babel/preset-react",
      {
        // 把 React.createElement 方法转换成 TinyReact.createElement 方法
        "pragma": "TinyReact.createElement"
      }
    ]
  ]
}
```

#### 方法二：使用行注释

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Frame/React/09.png =700x)

### 2. createElement

- createElement 方法根据传递的参数（元素的类型、属性、子节点）返回一个 Virtual DOM 对象，对象也要包含：
  - type：表示节点的类型
  - props：表示节点的属性
  - children：表示子节点
- 新建 src/TinyReact/createElement.js 文件定义 createElement 方法：

```js
/**
 * 创建 Virtual DOM
 * @param {string} type 类型
 * @param {object | null} props 属性
 * @param  {createElement[]} children 子元素
 * @return {object} Virtual DOM
 */
// 从 createElement 方法的第三个参数开始就都是子元素了
// 在定义 createElement 方法时，通过 ...children 将所有的子元素放置到 children 数组中
export default function createElement (type, props, ...children) {
  return {
    type,
    props,
    children
  }
}
```

- 在 src/TinyReact/index.js 中导入这个方法：

```js
import createElement from './createElement'

export default {
  createElement
}
```

- 在 src/index.js 编写 demo 测试结果：

```js
import TinyReact from './TinyReact'

const virtualDOM = (
  <div className="container">
    <h1>你好 Tiny React</h1>
    <h2 data-test="test">(编码必杀技)</h2>
    <div>
      嵌套1 <div>嵌套 1.1</div>
    </div>
    <h3>(观察：这个将会被改变)</h3>
    {2 == 1 && <div>如果2和1相等渲染当前内容</div>}
    {2 == 2 && <div>2</div>}
    <span>这是一段内容</span>
    <button onClick={() => alert('你好')}>点击我</button>
    <h3>这个将会被删除</h3>
    2, 3
    <input type="text" value="13" />
  </div>
)

console.log(virtualDOM)
```

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Frame/React/10.png =500x)

> [!warning]
> 通过以上代码测试，发现返回的 Virtual DOM 存在一些问题
> 1. 文本节点是以字符串形式存在的，例如 "你好 Tiny React"、"2, 3"
> 2. 过滤 JS 表达式结果为 false 的节点
> 3. 无法通过 props.children 获取子节点

### 3. 文本节点处理

- 现在 Virtual DOM 对象中的文本节点是以字符串形式存在的
- 这不符合我们的要求：文本节点也要以一个对象的形式表现，例如 `{type: "text", textContent: "2, 3"}`
- 扩展 createElement 方法：

```js
/**
 * 创建 Virtual DOM
 * @param {string} type 类型
 * @param {object | null} props 属性
 * @param  {createElement[]} children 子元素
 * @return {object} Virtual DOM
 */
export default function createElement (type, props, ...children) {
  // 将原有 children 拷贝一份 不要在原有数组上进行操作
  const childElements = [].concat(...children).map(child => {
    // 判断 child 是否是对象类型
    if (child instanceof Object) {
      // 如果是 什么都不需要做 直接返回即可
      return child
    } else {
      // 如果不是对象就是文本 手动调用 createElement 方法将文本转换为 Virtual DOM
      return createElement("text", { textContent: child })
    }
  })
  return {
    type,
    props,
    children: childElements
  }
}
```

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Frame/React/11.png =500x)

### 4. 过滤 false 节点

- 在 JSX 中，如果 Virtual DOM 被转化为了 boolean 值或者 null，是不应该被更新到真实 DOM 中的
- 为了精简操作，我们直接对生成的 Virtual DOM 对象进行过滤，以实现不执行渲染的结果（React 不是这么处理的）

```js
/**
 * 创建 Virtual DOM
 * @param {string} type 类型
 * @param {object | null} props 属性
 * @param  {createElement[]} children 子元素
 * @return {object} Virtual DOM
 */
export default function createElement (type, props, ...children) {
  // 由于 map 方法无法从数据中刨除元素, 所以此处将 map 方法更改为 reduce 方法
  const childElements = [].concat(...children).reduce((result, child) => {
    // 判断子元素类型 刨除 null true false
    if (child !== false && child !== true && child !== null) {
      if (child instanceof Object) {
        result.push(child)
      } else {
        // 文本节点
        result.push(createElement("text", { textContent: child }))
      }
    }
    // 将需要保留的 Virtual DOM 放入 result 数组
    return result
  }, [])
  return {
    type,
    props,
    children: childElements
}
```

### 5. 通过 props 获取子节点

- 在 React 组件中，可以通过 props.children 获取组件的子节点，所以还需要将子节点存储在 props 对象中

```js
/**
 * 创建 Virtual DOM
 * @param {string} type 类型
 * @param {object | null} props 属性
 * @param  {createElement[]} children 子元素
 * @return {object} Virtual DOM
 */
export default function createElement (type, props, ...children) {
  const childElements = [].concat(...children).reduce((result, child) => {
    if (child !== false && child !== true && child !== null) {
      if (child instanceof Object) {
        result.push(child)
      } else {
        result.push(createElement("text", { textContent: child }))
      }
    }
    return result
  }, [])
  return {
    type,
    props: Object.assign({children: childElements}, props),
    children: childElements
  }
}
```

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Frame/React/12.png =500x)

### 6. 总结

> [!important]
> - createElement 方法用于创建一个 Virtual DOM 对象
> - 在创建 Virtual DOM 对象的时候，要将文本节点也转换成一个 JS 对象
> - 返回值为 Boolean 或 null 的节点不会渲染到视图中，所以要过滤掉
> - 在组件中要通过 props.children 属性获取它的子节点，所以要给 props 添加 children 属性

## 普通 Virtual DOM 对象转化为真实 DOM 对象

> 现在要实现将普通 Virtual DOM 对象转换为真实 DOM 对象，并且将转换后的 DOM 展示到页面当中
> - 这里的 Virtual DOM 对象指的是原生 DOM 转化的对象（不是组件转化的）
> - 要实现这个需求就要用到 render 方法

### 1. 创建、导入、调用这个方法

```js
// src/TinyReact/render.js
export default function render(virtualDOM, container, oldDOM) {}
```
```js
// src/TinyReact/index.js
import createElement from './createElement'
import render from './render'

export default {
  createElement,
  render
}
```
```js
// src/index.js
import TinyReact from './TinyReact'

// 容器
const root = document.querySelector('#root')

const virtualDOM = (
  ...
)

TinyReact.render(virtualDOM, root)

console.log(virtualDOM)
```
```html
<!-- src/index.html -->
<body>
  <div id="root"></div>
</body>
```

### 2. 补充方法调用链

- Virtual DOM 转化为真实 DOM 并渲染到页面之前需要与旧的 DOM 进行对比(Diff)

```js
// src/TinyReact/render.js
import diff from './diff'
export default function render(virtualDOM, container, oldDOM) {
  // 在 diff 方法内部判断是否需要对比
  // 对比也好 不对比也好 都在 diff 方法中进行操作
  diff(virtualDOM, container, oldDOM)
}
```

- 首先判断是否存在旧的 Virtual DOM，即是否首次渲染，如果不存在则直接将 Virtual DOM 对象更新为真实 DOM 对象：

```js
// src/TinyReact/diff.js
import mountElement from './mountElement'
export default function diff(virtualDOM, container, oldDOM) {
  // 判断 oldDOM 是否存在
  if (!oldDOM) {
    // 如果不存在 不需要对比 直接将 Virtual DOM 转换为真实 DOM
    mountElement(virtualDOM, container)
  }
}
```

> [!warning]
> 在进行 Virtual DOM 转换之前还需要确定 Virtual DOM 的类 Component VS Native Element
> - 类型不同需要做不同的处理
>   - 如果是 Native Element
>     - 直接转换
>   - 如果是组件
>     - 需要得到组件实例对象，通过组件实例对象获取组件返回的 Virtual DOM，然后再进行转换

- 目前先只考虑 Native Element 的情况

```js
// src/TinyReact/mountElement.js
import mountNativeElement from './mountNativeElement'
export default function mountElement(virtualDOM, container) {
  // 通过调用 mountNativeElement 方法转换 Native Element
  mountNativeElement(virtualDOM, container)
}
```
```js
// src/TinyReact/mountNativeElement.js
export default function mountNativeElement(virtualDOM, container) {}
```

### 3. mountNativeElement

1. 判断节点类型
  - 元素：创建元素节点
  - 文本：创建文本节点
2. 递归创建子节点
3. 将转换之后的 DOM 对象放置到页面中

```js
// src/TinyReact/mountNativeElement.js
import mountElement from './mountElement'
export default function mountNativeElement(virtualDOM, container) {
  let newElement = null
  if (virtualDOM.type === 'text') {
    // 文本节点
    newElement = document.createTextNode(virtualDOM.props.textContent)
  } else {
    // 元素节点
    newElement = document.createElement(virtualDOM.type)
  }

  // 递归创建子节点
  virtualDOM.children.forEach(child => {
    mountElement(child, newElement)
  })

  // 将转换之后的 DOM 对象放置到页面中
  container.appendChild(newElement)
}
```

- 现在打开页面可以看到 Virtual DOM 被正常渲染到页面中了
- 创建节点的方法在其他地方也会用到，所以这里将它单独作为一个方法 createDOMElement 提取出来：

```js
// src/TinyReact/mountNativeElement.js
import createDOMElement from './createDOMElement'
export default function mountNativeElement(virtualDOM, container) {
  const newElement = createDOMElement(virtualDOM)

  // 将转换之后的 DOM 对象放置到页面中
  container.appendChild(newElement)
}
```
```js
// src/TinyReact/createDOMElement.js
import mountElement from './mountElement'
export default function createDOMElement(virtualDOM) {
  let newElement = null

  if (virtualDOM.type === 'text') {
    // 文本节点
    newElement = document.createTextNode(virtualDOM.props.textContent)
  } else {
    // 元素节点
    newElement = document.createElement(virtualDOM.type)
  }

  // 递归创建子节点
  virtualDOM.children.forEach(child => {
    // 因为不确定子元素是 NativeElement 还是 Component 所以调用 mountElement 方法进行确定
    mountElement(child, newElement)
  })

  return newElement
}
```

### 4. 总结

> [!important]
> 1. 在 HTML 文件中添加了一个 root 容器，用于放置 Virtual DOM 转换的真实 DOM
> 2. render 方法用于将 Virtual DOM 转换的真实 DOM，并放置到容器中 
> 3. render 方法是框架向外部提供开发者使用的方法，其中使用了一些内部方法，例如 diff
> 4. diff 方法接受3个参数：
>   - 要转换的 Virtual DOM
>   - 转换后要放置的位置
>   - 页面中已经存在的旧的 DOM 节点
> 5. diff 中要进行判断，如果存在旧的 DOM 节点则进行比对，如果不存在则直接挂载 mountElement
> 6. mountElement 挂载 DOM 要判断当前是组件 Virtual DOM 还是普通的 Virtual DOM，执行相应的处理（当前只处理了普通的 Virtual DOM）
> 7. 如果是普通的 Virtual DOM 则调用 mountNativeElement 转换为真实 DOM 并展示到页面中
> 8. mountNativeElement
>   - 先创建一个 newElement 变量用于存储创建的节点
>   - 然后判断节点类型 type，创建相应的节点 node
>   - 然后还要递归转换当前节点的子节点，继续调用 mountElement 方法
>   - 最后将转换后的 DOM 对象 ( newElement ) 放置到页面中

## 为 DOM 对象添加属性

> 上面转换的真实 DOM 对象上是没有属性的，如：class、data-test、onclick、type、value<br>
> 属性被存储在 Virtual DOM 对象的 props 属性上，当节点被创建后，我们要为其添加属性

> [!warning]
> 在添加属性的时候还要进行一些判断：
> - 是否是事件属性
>   - 根据属性名是否以 on 开头判断
>   - 然后使用 addEventListener 添加事件处理函数
> - 是否是 checked 或 value 属性，无法使用 setAttribute 设置
> - 是否是 children 属性，它根本不是属性，而是提供给 React 元素，用于获取子元素的
> - 是否是 className，添加 class 属性
> - 普通属性用 setAttribute 方法设置即可

```js
// src/TinyReact/createDOMElement.js
import mountElement from './mountElement'
import updateNodeElement from './updateNodeElement'
export default function createDOMElement(virtualDOM) {
  let newElement = null

  // 看看节点类型是文本类型还是元素类型
  if (virtualDOM.type === 'text') {
    // 创建文本节点 设置节点内容
    newElement = document.createTextNode(virtualDOM.props.textContent)
  } else {
    // 根据 Virtual DOM type 属性值创建 DOM 元素
    newElement = document.createElement(virtualDOM.type)
    // 为元素设置属性
    updateNodeElement(newElement, virtualDOM)
  }

  // 递归创建子节点
  virtualDOM.children.forEach(child => {
    mountElement(child, newElement)
  })

  return newElement
}
```
```js
// src/TinyReact/updateNodeElement.js
export default function updateNodeElement(newElement, virtualDOM) {
  // 获取要解析的 VirtualDOM 对象中的属性对象
  const newProps = virtualDOM.props

  // 将属性对象中的属性名称放到一个数组中并循环数组
  Object.keys(newProps).forEach(propName => {
    // 获取属性值
    const newPropsValue = newProps[propName]

    if (propName.startsWith('on')) {
      // 判断属性是否是事件属性
      // 事件名称 onClick -> click
      const eventName = propName.toLowerCase().slice(2)
      // 为元素添加事件
      newElement.addEventListener(eventName, newPropsValue)
    } else if (propName === 'value' || propName === 'checked') {
      // 判断是否是不能用 setAttribute() 设置的属性
      // 如果属性名称是 value 或者 checked 需要通过 [] 的形式添加
      newElement[propName] = newPropsValue
    } else if (propName !== 'children') {
      // 过滤 children 属性
      if (propName === 'className') {
        // className 属性单独处理 不直接在元素上添加 class 属性是因为 class 是 JavaScript 中的关键字
        newElement.setAttribute('class', newPropsValue)
      } else {
        // 普通属性
        newElement.setAttribute(propName, newPropsValue)
      }
    }
  })
}
```

## 组件渲染

### 1. 组件类型的 Virtual DOM

> Virtual DOM 分为普通 Virtual DOM（Native Element） 和 组件 Virtual DOM（Component）

> [!warning]
> Native Element 和 Component 的主要区别就是它们的 **<font color=red>type</font>** 不同：
> - Native Element 的 type 是字符串
> - Component 的 type 是函数
>   - 函数组件：type 存储的就是定义组件的函数
>   - 类组件：type 存储的是定义组件的 class （JavaScript 中 class 其实就是函数）

```js
function Heart () {
	return <div>&hearts;</div>
}

console.log(<Heart />)
```
```js
// 组件的 Virtual DOM
{
  type: f Heart(),
  props: {},
  children: []  
}
```

- 在渲染组件时，要先将 Component 和 Native Element 区分开
- 如果是 Native Element 可以直接开始渲染，如果是 Component 需要特别处理

```js
// src/index.js
import TinyReact from './TinyReact'

// 容器
const root = document.querySelector('#root')

const virtualDOM = (
	...  
)

// TinyReact.render(virtualDOM, root)

function Heart () {
	return <div>&hearts;</div>
}

TinyReact.render(<Heart />, root)
```
```js
// src/TinyReact/mountElement.js
import mountNativeElement from './mountNativeElement'
import isFunction from './isFunction'
import mountComponent from './mountComponent'
export default function mountElement(virtualDOM, container) {
  // 无论是类组件还是函数组件，其实本质上都是函数 
  // 如果 Virtual DOM 的 type 属性值为函数，就说明当前这个 Virtual DOM 为组件
  if (isFunction(virtualDOM)) {
    // 如果是组件 调用 mountComponent 方法进行组件渲染
    mountComponent(virtualDOM, container)
  } else {
    // NativeElement
    mountNativeElement(virtualDOM, container)
  }
}
```
```js
// src/TinyReact/isFunction.js
// Virtual DOM 是否为函数类型
export default function isFunction(virtualDOM) {
  return virtualDOM && typeof virtualDOM.type === 'function'
}
```
```js
// src/TinyReact/mountComponent.js
export default function mountComponent(virtualDOM, container) {
  // 判断组件是类组件还是函数组件

}
```

### 2. 区分函数组件和类组件

> 在渲染组件的时候还要区分是函数型组件还是类组件

> [!warning]
> 主要区别是类组件的 Virtual DOM 对象的 type 存储的函数的原型包含一个 render 方法<br>
> 因为定义类组件必须定义 render 方法返回渲染的内容，而函数组件则直接返回

```js
class Foo {
  render() {
    return <div>Hello Foo</div>
  }
}

function Bar() {
  return <div>Hello Bar</div>
}
```

- 继续拓展

```js
// src/TinyReact/mountComponent.js
import isFunctionComponent from "./isFunctionComponent";
export default function mountComponent(virtualDOM, container) {
  // 判断组件是类组件还是函数组件
  if (isFunctionComponent(virtualDOM)) {
    console.log('函数组件');
  }
}
```
```js
// src/TinyReact/isFunctionComponent.js
import isFunction from './isFunction'
// Virtual DOM 是否为函数型组件
// 条件有两个: 1. Virtual DOM 的 type 属性值为函数 2. 函数的原型对象中不能有render方法
// 只有类组件的原型对象中有render方法 
export default function isFunctionComponent(virtualDOM) {
  const type = virtualDOM.type
  return type && isFunction(virtualDOM) && !(type.prototype && type.prototype.render)
}
```

### 3. 函数组件

> 函数组件的内容就是 **<font color=red>它所生成的 Virtual DOM 对象的 type 属性存储的函数执行后返回的内容</font>**

```js
// src/TinyReact/mountComponent.js
import isFunctionComponent from './isFunctionComponent'
import mountNativeElement from './mountNativeElement'
export default function mountComponent(virtualDOM, container) {
  // 存放组件调用后返回的 Virtual DOM 的容器
  let nextVirtualDOM = null
  // 区分函数型组件和类组件
  if (isFunctionComponent(virtualDOM)) {
    nextVirtualDOM = buildFunctionComponent(virtualDOM)
  }
  mountNativeElement(nextVirtualDOM, container)
}

function buildFunctionComponent(virtualDOM) {
  return virtualDOM.type()
}
```

- 函数组件返回的也可能是另一个组件

```js
function Heart () {
  return <App />
}
```

- 所以需要增加判断

```js
// src/TinyReact/mountComponent.js
import isFunction from './isFunction'
import isFunctionComponent from './isFunctionComponent'
import mountNativeElement from './mountNativeElement'
export default function mountComponent(virtualDOM, container) {
  let nextVirtualDOM = null
  // 判断组件是类组件还是函数组件
  if (isFunctionComponent(virtualDOM)) {
    // 函数组件 调用 buildFunctionalComponent 方法处理函数组件
    nextVirtualDOM = buildFunctionComponent(virtualDOM)
  }

  // 判断渲染的组件是否直接返回了另一个组件
  if (isFunction(nextVirtualDOM)) {
    // 如果是组件 继续调用 mountComponent 解剖组件
    mountComponent(nextVirtualDOM, container)
  } else {
    // 如果是 Navtive Element 就去渲染
    mountNativeElement(nextVirtualDOM, container)
  }
}

function buildFunctionComponent(virtualDOM) {
  return virtualDOM.type()
}
```

- 而当函数组件返回的内容中包含其他组件时，会在递归创建 DOM 子节点的时候调用 mountElement
- 该方法又会重新判断组件的类型，不用额外处理

```js
function Heart () {
  return <div>&hearts;<App /></div>
}
```

### 4. 函数组件 props 参数处理

- 函数组件会接受一个 props 作为参数，并在返回的内容中访问其中的属性
- 在渲染的时候只需要将 Virtual DOM 对象的 props 属性传递给这个函数即可

> [!warning]
> 要考虑 props 为 null 的情况

```js
// src/index.js
/* ... */

function Heart(props) {
  return <div>{props.title}&hearts;</div>
}

TinyReact.render(<Heart title="Hello React" />, root)
```
```js
// src/TinyReact/mountComponent.js
import isFunction from './isFunction'
import isFunctionComponent from './isFunctionComponent'
import mountNativeElement from './mountNativeElement'
export default function mountComponent(virtualDOM, container) {
  let nextVirtualDOM = null
  // 判断组件是类组件还是函数组件
  if (isFunctionComponent(virtualDOM)) {
    // 函数组件 调用 buildFunctionalComponent 方法处理函数组件
    nextVirtualDOM = buildFunctionComponent(virtualDOM)
  } else {
    // 类组件
  }

  // 判断渲染的组件是否直接返回了另一个组件
  if (isFunction(nextVirtualDOM)) {
    // 如果是组件 继续调用 mountComponent 解剖组件
    mountComponent(nextVirtualDOM, container)
  } else {
    // 如果是 Navtive Element 就去渲染
    mountNativeElement(nextVirtualDOM, container)
  }
}

// 函数组件处理 
function buildFunctionComponent(virtualDOM) {
  // 通过 Virtual DOM 中的 type 属性获取到组件函数并调用
  // 调用组件函数时将 Virtual DOM 对象中的 props 属性传递给组件函数
  // 这样在组件中就可以通过 props 属性获取数据了
  // 组件返回要渲染的 Virtual DOM
  return virtualDOM.type(virtualDOM.props || {})
}
```

### 5. 类组件

> 类组件的内容是调用这个类创建的实例对象的 render 方法返回的内容

- 需要实例化类组件得到类组件实例对象，通过类组件实例对象调用类组件中的 render 方法，获取组件要渲染的 Virtual DOM
- 在 React 中，类组件会继承 React.Component，这里先定义一个 Component 类：

```js
// src/TinyReact/Component.js
export default class Component {}
```
```js
import createElement from './createElement'
import render from './render'
import Component from './Component'

export default {
  createElement,
  render,
  Component
}
```

- 编写类组件示例

```js
// src/index.js
/* ... */

// TinyReact.render(<Heart title="Hello React" />, root)

class Alert extends TinyReact.Component {
  render() {
    return <div>Hello React</div>
  }
}

TinyReact.render(<Alert />, root)
```
```js
// src/TinyReact/mountComponent.js
import isFunction from './isFunction'
import isFunctionComponent from './isFunctionComponent'
import mountNativeElement from './mountNativeElement'
export default function mountComponent(virtualDOM, container) {
  let nextVirtualDOM = null
  // 判断组件是类组件还是函数组件
  if (isFunctionComponent(virtualDOM)) {
    // 函数组件
    nextVirtualDOM = buildFunctionComponent(virtualDOM)
  } else {
    // 类组件
    nextVirtualDOM = buildClassComponent(virtualDOM)
  }

  // 判断渲染的组件是否直接返回了另一个组件
  if (isFunction(nextVirtualDOM)) {
    mountComponent(nextVirtualDOM, container)
  } else {
    mountNativeElement(nextVirtualDOM, container)
  }
}

// 处理函数组件
function buildFunctionComponent(virtualDOM) {
  return virtualDOM.type(virtualDOM.props || {})
}

// 处理类组件
function buildClassComponent(virtualDOM) {
  // 实例化类组件 得到类组件实例对象 并将 props 属性传递进类组件
  const component = new virtualDOM.type(virtualDOM.props || {})
  // 调用类组件中的 render 方法得到要渲染的 Virtual DOM
  const nextVirtualDOM = component.render()
  // 返回要渲染的 Virtual DOM
  return nextVirtualDOM
}
```

### 6. 类组件 props 参数处理

> [!info]
> React 通过在继承的 Component 组件中定义 props 属性，让继承它的子类可以通过 this.props 访问组件的参数
> - 子类需要通过 super 方法将自身的 props 属性传递给 Component 父类
> - 父类会将 props 属性挂载为父类属性，子类继承了父类，自己本身也就自然拥有props属性了
> - 这样做的好处是当 props 发生更新后，父类可以根据更新后的 props 帮助子类更新视图

```js
// src/TinyReact/Component.js
export default class Component {
  constructor(props) {
    this.props = props
  }
}
```

- 给示例添加参数

```js
// src/index.js
/* ... */

class Alert extends TinyReact.Component {
  constructor(props) {
    // 将 props 传递给父类 子类继承父类的 props 子类自然就有 props 数据了
    // 否则 props 仅仅是 constructor 函数的参数而已
    // 将 props 传递给父类的好处是 当 props 发生更改时 父类可以帮助更新 props 更新组件视图
    super(props)
  }
  render() {
    return (
      <div>
        {this.props.name}
        {this.props.age}
      </div>
    )
  }
}

TinyReact.render(<Alert name="张三" age={20} />, root)
```

- JavaScript 的 class 默认会添加一个 constructor 构造函数，如果是继承其他类的子类，则构造函数内部还会调用 super

```js
// 子类默认添加的构造函数
constructor(...args) {
  super(...args)
}
```

- 所以上面的组件示例可以精简为：

```js
class Alert extends TinyReact.Component {
  // constructor(props) {
  //   super(props)
  // }
  render() {
    return (
      <div>
        {this.props.name}
        {this.props.age}
      </div>
    )
  }
}
```

> [!warning]
> 如果要显示定义构造函数中的内容，必须要手动调用 super

## 更新 DOM 元素

> [!info]
> 示例：创建两个 Virtual DOM，在页面加载时渲染第一个 Virtual DOM，在延迟 2 秒 后渲染第二个 Virtual DOM
> - 两个 Virtual DOM 有一些修改：
>   - h2 元素的 data-test
>   - 元素被改变 h3 to h6
>   - span 的文本内容
>   - button 点击事件的 alert 内容

```js
// src/index.js
import TinyReact from './TinyReact'

// 容器
const root = document.querySelector('#root')

const virtualDOM = (
  <div className="container">
    <h1>你好 Tiny React</h1>
    <h2 data-test="test">(编码必杀技)</h2>
    <div>
      嵌套1 <div>嵌套 1.1</div>
    </div>
    <h3>(观察：这个将会被改变)</h3>
    {2 == 1 && <div>如果2和1相等渲染当前内容</div>}
    {2 == 2 && <div>2</div>}
    <span>这是一段内容</span>
    <button onClick={() => alert('你好')}>点击我</button>
    <h3>这个将会被删除</h3>
    2, 3
    <input type="text" value="13" />
  </div>
)

const modifyDOM = (
  <div className="container">
    <h1>你好 Tiny React</h1>
    <h2 data-test="test123">(编码必杀技)</h2>
    <div>
      嵌套1 <div>嵌套 1.1</div>
    </div>
    <h6>(观察：这个将会被改变)</h6>
    {2 == 1 && <div>如果2和1相等渲染当前内容</div>}
    {2 == 2 && <div>2</div>}
    <span>这是一段被修改过的内容</span>
    <button onClick={() => alert('你好！！！')}>点击我</button>
    <h3>这个将会被删除</h3>
    2, 3
    <input type="text" value="13" />
  </div>
)

TinyReact.render(virtualDOM, root)

setTimeout(() => {
  TinyReact.render(modifyDOM, root)
}, 2000)
```

- 在更新 DOM 的时候，要 **<font color=red>先对比两个 Virtual DOM 的差异，然后仅重新渲染差异部分，以达到最小更新</font>**

### 1. 获取更新前的 Virtual DOM

- 在进行 Virtual DOM 对比时，需要用到更新后的 Virtual DOM 和更新前的 Virtual DOM，更新后的 Virtual DOM 目前可以通过 render 方法进行传递
- 现在的问题是 **<font color=red>更新前的 Virtual DOM 要如何获取呢？</font>**
  - 对于更新前的 Virtual DOM，对应的其实就是已经在页面中显示的真实 DOM 对象
  - 那么在创建真实 DOM 对象时，就可以将 Virtual DOM 添加到真实 DOM 对象的属性中
  - 在进行 Virtual DOM 对比之前，就可以通过真实 DOM 对象获取其对应的 Virtual DOM 对象了

```js
export default function createDOMElement(virtualDOM) {
	let newElement = null;
	if (virtualDOM.type === 'text') {
		// 文本节点
		newElement = document.createTextNode(virtualDOM.props.textContent);
	} else {
		// 元素节点
		newElement = document.createElement(virtualDOM.type);
		updateNodeElement(newElement, virtualDOM);
	}

  // 将 Virtual DOM 添加到真实 DOM 对象的属性中
	newElement._virtualDOM = virtualDOM;

	// 递归创建子节点
	virtualDOM.children.forEach(child => {
		mountElement(child, newElement);
	});
	return newElement;
}
```

- 然后通过 render 方法的第三个参数获取的，container.firstChild

> [!warning]
> 为什么是 container.firstChild<br>
> 因为 JSX 要求所有标签必须包含在一个父标签下，所以通过获取容器下的第一个元素，就可以拿到之前渲染到页面的 DOM 元素

```js
// src/TinyReact/render.js
import diff from './diff'
export default function render(virtualDOM, container, oldDOM = container.firstChild) {
  diff(virtualDOM, container, oldDOM)
}
```
```js
export default function diff(virtualDOM, container, oldDOM) {
  // 获取旧的 VirtualDOM
	const oldVirtualDOM = oldDOM && oldDOM._virtualDOM;
	// 判断是否存在 oldDOM
	if (!oldDOM) {
		// 如果不存在 不需要对比 直接将 Virtual DOM 转换为真实 DOM
		mountElement(virtualDOM, container);
	}
}
```

### 2. 节点类型相同的情况

#### 2.1 文本节点

- 节点类型相同的时候，根据节点的类型选择更新方式：
  - 文本节点：对比文本节点内容变化，更新文本内容
  - 元素节点：对比元素节点属性变化，更新元素的属性
- 通过更新前的真实 DOM 元素去执行更新操作
- **<font color=red>更新后也要同步更新旧的 Virtual DOM 对象</font>**
  - 该对象存储在真实 DOM 元素的属性上，将作为每次 DOM 更新对比时的更新前的 Virtual DOM
- 如果包含子元素还要递归对比
  - 当前暂时使用的[序号]进行对比，之后将扩展为使用 key 去对比

```js
// src/TinyReact/diff.js
import mountElement from './mountElement'
import updateTextNode from './updateTextNode'
export default function diff(virtualDOM, container, oldDOM) {
  // 获取未更新前的 Virtual DOM
  const oldVirtualDOM = oldDOM && oldDOM._virtualDOM
  // 判断 oldVirtualDOM 是否存在
  if (!oldVirtualDOM) {
    mountElement(virtualDOM, container)
  } else if (virtualDOM.type === oldVirtualDOM.type) {
    // 节点类型相同
    if (virtualDOM.type === 'text') {
      // 文本节点：对比文本内容是否发生变化，更新内容
      updateTextNode(virtualDOM, oldVirtualDOM, oldDOM)
    } else {
      // 元素节点：对比元素属性是否发生变化，更新元素属性
    }

    // 对比子节点
    virtualDOM.children.forEach((child, i) => {
      diff(child, oldDOM, oldDOM.childNodes[i])
    })
  }
}
```
```js
// src/TinyReact/updateTextNode.js
export default function updateTextNode(virtualDOM, oldVirtualDOM, oldDOM) {
  if (virtualDOM.props.textContent !== oldVirtualDOM.props.textContent) {
    // 更新真实 DOM 对象中的内容
    oldDOM.textContent = virtualDOM.props.textContent
    // 同步更新 真实 DOM 对应的 Virtual DOM
    oldDOM._virtualDOM = virtualDOM
  }
}
```

#### 2.2 元素节点

- 对比新旧元素节点的属性 props 并更新
- 更新元素节点的属性使用的是之前定义过的 updateNodeElement 方法

> [!info]
> 更新元素节点有以下几种情况：
> - 原有属性被修改或添加新的属性
>   - 如果是事件属性，则注册新的事件处理函数，并且删除旧的事件处理函数
>   - 如果是其他属性，则重新设置即可
> - 属性被删除
>   - 如果是事件属性，则删除旧的事件处理函数
>   - 如果是 children 属性，则忽略
>   - 如果是其他属性，则进行删除

```js
// src/TinyReact/diff.js
import mountElement from './mountElement'
import updateTextNode from './updateTextNode'
import updateNodeElement from './updateNodeElement'
export default function diff(virtualDOM, container, oldDOM) {
  const oldVirtualDOM = oldDOM && oldDOM._virtualDOM
  // 判断 oldDOM 是否存在
  if (!oldDOM) {
    mountElement(virtualDOM, container)
  } else if (virtualDOM.type === oldVirtualDOM.type) {
    // 节点类型相同
    if (virtualDOM.type === 'text') {
      // 文本节点：更新内容
      updateTextNode(virtualDOM, oldVirtualDOM, oldDOM)
    } else {
      // 元素节点：更新元素属性
      updateNodeElement(oldDOM, virtualDOM, oldVirtualDOM)
    }

    // 递归对比 Virtual DOM 的子节点
    virtualDOM.children.forEach((child, i) => {
      diff(child, oldDOM, oldDOM.childNodes[i])
    })
  }
}
```
```js
// src/TinyReact/updateNodeElement.js
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
        // 为元素删除事件
        newElement.removeEventListener(eventName, oldPropsValue)
      } else if (propName !== 'children') {
        newElement.removeAttribute(propName)
      }
    }
  })
}
```

### 3. 节点类型不同的情况

- 当两个节点类型不相同的时候，就没有对比的必要了
- 只需要用新的 Virtual DOM 生成新的真实 DOM 对象，然后使用新的 DOM 对象替换旧的 DOM 对象即可

> [!warning]
> 组件需要特殊处理，这里仅处理了普通的 Virtual DOM

```js
// src/TinyReact/diff.js
import mountElement from './mountElement'
import updateTextNode from './updateTextNode'
import updateNodeElement from './updateNodeElement'
import isFunction from './isFunction'
import createDOMElement from './createDOMElement'
export default function diff(virtualDOM, container, oldDOM) {
  const oldVirtualDOM = oldDOM && oldDOM._virtualDOM
  // 判断 oldDOM 是否存在
  if (!oldDOM) {
    mountElement(virtualDOM, container)
  } else if (
    // 对比的两个节点类型不相同
    virtualDOM.type !== oldVirtualDOM.type &&
    // 并且节点的类型不是组件，因为组件要单独处理
    !isFunction(virtualDOM)
  ) {
    // 节点类型不相同
    const newElement = createDOMElement(virtualDOM)
    oldDOM.parentNode.replaceChild(newElement, oldDOM)
  } else if (virtualDOM.type === oldVirtualDOM.type) {
    // 节点类型相同
    if (virtualDOM.type === 'text') {
      // 文本节点：更新内容
      updateTextNode(virtualDOM, oldVirtualDOM, oldDOM)
    } else {
      // 元素节点：更新元素属性
      updateNodeElement(oldDOM, virtualDOM, oldVirtualDOM)
    }

    // 对比子节点
    virtualDOM.children.forEach((child, i) => {
      diff(child, oldDOM, oldDOM.childNodes[i])
    })
  }
}
```

### 4. Diff 对比

- Virtual DOM 对比（Diff）的算法有两个原则：
  - 同级节点对比
  - 深度优先顺序

#### 2.1 同级对比

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Frame/React/13.png =500x)

> [!important]
> Virtual DOM 在对比的时候是同级对比，即父元素和父元素对比，子元素和子元素对比，不会发生跨级对比的
> - 如果对比的节点类型相同
>   - 如果是文本节点，则对比文本内容，如果内容不同，则替换为新的内容
>   - 如果是元素节点，则对比元素属性
>     - 如果属性相同，则不作处理
>     - 如果属性值不同（包括新添加属性的情况），则替换为新节点属性值
>     - 如果属性被删除（新节点不包含该属性），则删除属性
> - 如果对比的节点类型不同
>   - 则直接用新的 Virtual DOM 生成新的真实 DOM 对象，替换旧的 DOM 对象

#### 2.2 深度优先

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Frame/React/14.png =500x)

- Virtual DOM 对比的顺序是深度优先，即子节点对比优先于同级节点对比
- 例如图例：
  - 首先对比最外层的节点 ul
  - 接着对比 ul 节点下的第一个子节点 li
  - 第一个 li 节点对比完后，发现它包含子节点，所以继续对比该节点下的第一个子节点 p
  - 当第一个 li 节点下的 p 节点对比完成后，接着对比 li 的兄弟节点
- 对应到代码中，就是在对比当前节点的过程中，递归对比它的子节点，当全部对比完成后，继续对比下一个兄弟节点

### 5. 删除节点

- 时机：在节点更新完成之后才能分析哪些节点应该被删除
- 范围：发生在同一个父节点下的所有子节点身上
- 如何判断是否有节点需要被删除：在节点更新完成后，如果旧节点对象的数量多于新 Virtual DOM 节点的数量，就说明有节点需要被删除

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Frame/React/15.png =500x)

```js
// src/TinyReact/diff.js
import mountElement from './mountElement'
import updateTextNode from './updateTextNode'
import updateNodeElement from './updateNodeElement'
import isFunction from './isFunction'
import createDOMElement from './createDOMElement'
import unmountNode from './unmountNode'
export default function diff(virtualDOM, container, oldDOM) {
  const oldVirtualDOM = oldDOM && oldDOM._virtualDOM
  // 判断 oldDOM 是否存在
  if (!oldDOM) {
    mountElement(virtualDOM, container)
  } else if (
    // 对比的两个节点类型不相同
    virtualDOM.type !== oldVirtualDOM.type &&
    // 并且节点的类型不是组件，因为组件要单独处理
    !isFunction(virtualDOM)
  ) {
    // 节点类型不相同
    const newElement = createDOMElement(virtualDOM)
    oldDOM.parentNode.replaceChild(newElement, oldDOM)
  } else if (virtualDOM.type === oldVirtualDOM.type) {
    // 节点类型相同
    if (virtualDOM.type === 'text') {
      // 文本节点：更新内容
      updateTextNode(virtualDOM, oldVirtualDOM, oldDOM)
    } else {
      // 元素节点：更新元素属性
      updateNodeElement(oldDOM, virtualDOM, oldVirtualDOM)
    }

    // 对比子节点
    virtualDOM.children.forEach((child, i) => {
      diff(child, oldDOM, oldDOM.childNodes[i])
    })

    // 删除节点
    // 获取旧节点
    const oldChildNodes = oldDOM.childNodes
    // 判断旧节点的数量，如果旧节点的数量多于要渲染的新节点的长度
    if (oldChildNodes.length > virtualDOM.children.length) {
      // 有节点需要被删除
      for (let i = oldChildNodes.length - 1; i > virtualDOM.children.length - 1; i--) {
        unmountNode(oldChildNodes[i])
      }
    }
  }
}
```
```js
// src/TinyReact/unmountNode.js
export default function unmountNode(node) {
  node.remove()
}
```

### 6. setState 方法实现类组件状态更新

#### 6.1 更新 state

- 要更新类组件的状态，要用到 setState 方法
  - setState 也是父类 （Component）定义的方法
  - setState 方法是组件实例调用的，所以内部的 this 指向实例对象
- 该方法可以接受一个对象，调用结果会用传递的对象浅合并类组件的 state 属性

```js
class Alert extends TinyReact.Component {
  constructor(props) {
    super(props)
    this.state = {
      title: 'Default Title'
    }
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick() {
    this.setState({
      title: 'Changed Title'
    })
  }
  render() {
    console.log(this.state)
    return (
      <div>
        {this.props.name}
        {this.props.age}
        <div>
          {this.state.title}
          <button onClick={this.handleClick}>改变Title</button>
        </div>
      </div>
    )
  }
}

TinyReact.render(<Alert name="张三" age={20} />, root)
```
```js
// src/TinyReact/Component.js
export default class Component {
  constructor(props) {
    this.props = props
  }
  setState(state) {
    // setState 方法被子类调用 此处 this 指向子类实例对象
    // 所以改变的是子类的 state 对象
    this.state = Object.assign({}, this.state, state)
    // 通过调用 render 方法获取最新的 Virtual DOM
    let virtualDOM = this.render()
  }
}
```

#### 6.2 对比新旧 Virtual DOM

- state 发生变化后要重新生成新的 Virtual DOM 对象与旧的进行比对，并将差异更新到旧的 DOM 中
  - 获取新的 Virtual DOM 对象：调用 render 方法
  - 获取旧的 DOM 对象：
    - 添加用于存储/获取 DOM 对象的方法，在挂载真实 DOM 时进行存储，之后可以通过 DOM 对象的 _virtualDOM 属性获取它的 Virtual DOM
    - 在 mountNativeElement 中调用存储 DOM 的方法，将 DOM 存储到组件实例对象上
- mountNativeElement 方法中如何访问组件实例对象：
  - 在挂载类组件的时候调用了 buildClassComponent 方法
  - 内部实例化了组件实例对象
  - 然后生成了 Virtual DOM 对象 render，并返回
  - 这个 Virtual DOM 又传递给 mountNativeElement
- 所以可以在 buildClassComponent 方法内部，将实例对象存储在 Virtual DOM 对象中进行传递

```js
// src/TinyReact/Component.js
export default class Component {
  constructor(props) {
    this.props = props
  }
  setState(state) {
    this.state = Object.assign({}, this.state, state)
    // 获取最新的要渲染的 VirtualDOM 对象
    const virtualDOM = this.render()
    // 获取旧的 VirtualDOM 对象进行比对
    const oldDOM = this.getDOM()

    const container = oldDOM.parentNode
    diff(virtualDOM, oldDOM.parentNode, oldDOM)
  }
  setDOM(dom) {
    this._dom = dom
  }
  getDOM() {
    return this._dom
  }
}
```
```js
// src/TinyReact/mountComponent.js
import isFunctionComponent from './isFunctionComponent'
import isFunction from './isFunction'
import mountNativeElement from './mountNativeElement'
export default function mountComponent(virtualDOM, container) {
  let nextVirtualDOM = null
  // 判断组件是类组件还是函数组件
  if (isFunctionComponent(virtualDOM)) {
    // 函数组件
    nextVirtualDOM = buildFunctionComponent(virtualDOM)
  } else {
    // 类组件
    nextVirtualDOM = buildClassComponent(virtualDOM)
  }

  // 判断渲染的组件是否直接返回了另一个组件
  if (isFunction(nextVirtualDOM)) {
    mountComponent(nextVirtualDOM, container)
  } else {
    mountNativeElement(nextVirtualDOM, container)
  }
}

function buildFunctionComponent(virtualDOM) {
  return virtualDOM.type(virtualDOM.props || {})
}

function buildClassComponent(virtualDOM) {
  const component = new virtualDOM.type(virtualDOM.props || {})
  const nextVirtualDOM = component.render()
  // 存储组件实例对象
  nextVirtualDOM.component = component
  return nextVirtualDOM
}
```
```js
// src/TinyReact/mountNativeElement.js
import createDOMElement from './createDOMElement'
export default function mountNativeElement(virtualDOM, container) {
  const newElement = createDOMElement(virtualDOM)

  // 将转换之后的 DOM 对象放置到页面中
  container.appendChild(newElement)

  // 获取组件实例对象
  const component = virtualDOM.component

  // 判断是否是类组件返回的 VirtualDOM
  if (component) {
    // 保存 DOM 对象
    component.setDOM(newElement)
  }
}
```

## 组件更新

### 1. 示例

```js
function Heart(props) {
  return <div>{props.title}&hearts;</div>
}

class Alert extends TinyReact.Component {
  constructor(props) {
    super(props)
    this.state = {
      title: 'Default Title'
    }
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick() {
    this.setState({
      title: 'Changed Title'
    })
  }
  render() {
    return (
      <div>
        {this.props.name}
        {this.props.age}
        <div>
          {this.state.title}
          <button onClick={this.handleClick}>改变Title</button>
        </div>
      </div>
    )
  }
}

TinyReact.render(<Alert name="张三" age={20} />, root)

setTimeout(() => {
  // 相同组件
  // TinyReact.render(<Alert name="李四" age={50} />, root)
  
  // 不同组件
  TinyReact.render(<Heart title="Hello React" />, root)
}, 2000)
```

### 2. 判断是否是同一个组件

- 在 diff 方法中判断要更新的 Virtual DOM 是否是组件
  - 如果不是（已经实现），则直接创建新的节点替换旧的节点
  - 如果是组件，判断新旧 Virtual DOM 是否是同一个组件
    - 如果不是同一个组件就不需要做组件更新操作
    - 直接调用 mountElement 方法将组件返回的 Virtual DOM 生成真实 DOM 显示到页面中，并删除旧的 DOM
  - 如果是同一个组件，则执行更新组件操作
    - 其实就是将最新的 props 传递到组件中
    - 再调用组件的 render 方法获取组件返回的最新的 Virtual DOM 对象
    - 再将 Virtual DOM 对象传递给 diff 方法，让 diff 方法找出差异，从而将差异更新到真实 DOM 对象中
- 在更新组件的过程中，还要在不同阶段调用其不同的组件生命周期函数
- 新增一个 diffComponnent 方法进行判断对比，可以对比旧组件的实例对象的构造函数与新 Virtual DOM 对象的 type 属性存储的构造函数是否相同，判断是否是同一个组件

```js
// src/TinyReact/diff.js
import mountElement from './mountElement'
import updateTextNode from './updateTextNode'
import updateNodeElement from './updateNodeElement'
import isFunction from './isFunction'
import createDOMElement from './createDOMElement'
import unmountNode from './unmountNode'
import diffComponent from './diffComponent'
export default function diff(virtualDOM, container, oldDOM) {
  const oldVirtualDOM = oldDOM && oldDOM._virtualDOM
  const oldComponent = oldVirtualDOM && oldVirtualDOM.component
  // 判断 oldDOM 是否存在
  if (!oldDOM) { /*...*/
  } else if (
    // 对比的两个节点类型不相同
    virtualDOM.type !== oldVirtualDOM.type &&
    // 并且节点的类型不是组件，因为组件要单独处理
    !isFunction(virtualDOM)
  ) {/*...*/
  } else if (isFunction(virtualDOM)) {
    // 要更新的是组件
    // 1) virtualDOM 组件本身的 virtualDOM 对象 通过它可以获取到组件最新的 props
    // 2) oldComponent 要更新的组件的实例对象 通过它可以调用组件的生命周期函数 可以更新组件的 props 属性 可以获取到组件返回的最新的 Virtual DOM
    // 3) oldDOM 要更新的 DOM 象 在更新组件时 需要在已有 DOM 对象的身上进行修改 实现 DOM 最小化操作 获取旧的 Virtual DOM 对象
    // 4) container 如果要更新的组件和旧组件不是同一个组件 要直接将组件返回的 Virtual DOM 显示在页面中 此时需要 container 做为父级容器
    diffComponent(virtualDOM, oldComponent, oldDOM, container)
  } else if (virtualDOM.type === oldVirtualDOM.type) {/*...*/
  }
}
```

- 之前在 mountComponent 模块下的 buildClassComponent 方法中，将组件实例对象存储在了 Virtual DOM 对象上，所以可以直接获取 oldCompoenent

```js
// src/TinyReact/diffComponent.js
/**
 * virtualDOM 组件本身的 virtualDOM 对象：通过它可以获取组件最新的 props
 * oldComponent 要更新的组件的实例对象：通过它可以调用组件的生命周期函数，可以更新组件的 props 属性，可以获取组件返回的最新的 Virtual DOM 对象
 * oldDOM 要更新的 DOM 对象：在更新组件时，需要在已有 DOM 对象身上进行修改，实现 DOM 最小化操作，可以获取旧的 Virtual DOM 对象，如果是不同组件，则需要通过它删除旧的 DOM
 * container 父级容器：如果要更新的组件和旧组件不是同一个组件，要直接将组件返回的 Virtual DOM 显示到页面中，此时需要父级容器
 */
export default function diffComponent(virtualDOM, oldComponent, oldDOM, container) {
  // 判断要更新的组件和未更新的组件是否是同一个组件
  // 只需要确定两者使用的是否是同一个构造函数就可以了
  if (isSameComponent(virtualDOM, oldComponent)) {
    // 同一个组件：执行组件更新操作
  } else {
    // 不是同一个组件：直接将组件内容显示在页面中
  }
}

// 判断是否是同一个组件
// virtualDOM.type 更新后的组件构造函数
// oldComponent.constructor 未更新前的组件构造函数
// 两者等价就表示是同一组件
function isSameComponent(virtualDOM, oldComponent) {
  return oldComponent && oldComponent.constructor === virtualDOM.type
}
```

### 3. 不同组件

- 如果是不同的组件，则直接执行两个操作：
  - 挂载新的 DOM：mountElement 方法已实现
  - 删除旧的 DOM
- 将真实 DOM 挂载到页面的操作最终是在 mountNativeElement 方法中实现的
- 所以要将删除旧的 DOM 操作添加到里面，这就需要将旧的 DOM 传递到这个方法中
- 通过 mountElement -> mountComponent -> mountNativeElement 的调用过程执行挂载，所以需要扩展这几个方法，让它们接收 oldDOM，并在 mountNativeElement 中执行删除旧 DOM 操作：
- 在 diffComponent 中调用 mountElement，并传递 oldDOM

```js
// src/TinyReact/diffComponent.js
import mountElement from "./mountElement"

export default function diffComponent(virtualDOM, oldComponent, oldDOM, container) {
  if (isSameComponent(virtualDOM, oldComponent)) {
    // 同一个组件：执行组件更新操作
  } else {
    // 不是同一个组件
    mountElement(virtualDOM, container, oldDOM)
  }
}

// 判断是否是同一个组件
function isSameComponent(virtualDOM, oldComponent) {
  return oldComponent && oldComponent.constructor === virtualDOM.type
}
```
```js
// src/TinyReact/mountElement.js
/*...*/
export default function mountElement(virtualDOM, container, oldDOM) {
  // Component VS NativeElement
  if (isFunction(virtualDOM)) {
    // Component
    mountComponent(virtualDOM, container, oldDOM)
  } else {
    // NativeElement
    mountNativeElement(virtualDOM, container, oldDOM)
  }
}
```
```js
// src/TinyReact/mountComponent.js
/*...*/
export default function mountComponent(virtualDOM, container, oldDOM) {
	/*...*/

  // 判断渲染的组件是否直接返回了另一个组件
  if (isFunction(nextVirtualDOM)) {
    mountComponent(nextVirtualDOM, container, oldDOM)
  } else {
    mountNativeElement(nextVirtualDOM, container, oldDOM)
  }
}

/*...*/
```
```js
// src/TinyReact/mountNativeElement.js
/*...*/
export default function mountNativeElement(virtualDOM, container, oldDOM) {
  const newElement = createDOMElement(virtualDOM)

  // 将转换之后的 DOM 对象放置到页面中
  container.appendChild(newElement)

  // 判断旧的 DOM 对象是否存在，如果存在则删除
  if (oldDOM) {
    unmountNode(oldDOM)
  }

	/*...*/
}
```

### 4. 相同组件

- 组件更新操作
  - 将最新的 props 传递到组件中：通过调用组件实例的 updateProps 方法
  - 再调用组件的 render 方法获取组件返回的最新的 Virtual DOM 对象
    - 此时要重新存储组件实例对象
  - 将其传递给 diff 方法，找出差异，从而将差异更新到真实 DOM 对象中

```js
// src/TinyReact/diffComponent.js
import mountElement from "./mountElement"
import updateComponent from "./updateComponent"
export default function diffComponent(virtualDOM, oldComponent, oldDOM, container) {
  if (isSameComponent(virtualDOM, oldComponent)) {
    // 同一个组件：执行组件更新操作
    updateComponent(virtualDOM, oldComponent, oldDOM, container)
  } else {
    // 不是同一个组件
    mountElement(virtualDOM, container, oldDOM)
  }
}

// 判断是否是同一个组件
function isSameComponent(virtualDOM, oldComponent) {
  return oldComponent && oldComponent.constructor === virtualDOM.type
}
```
```js
// src/TinyReact/updateComponent.js
import diff from "./diff"
export default function updateComponent(virtualDOM, oldComponent, oldDOM, container) {
  // 组件更新
  // 1. 更新组件的 props
  oldComponent.updateProps(virtualDOM.props)

  // 2. 获取组件返回的最新的 VirtualDOM
  let nextVirtualDOM = oldComponent.render()
  // 重新存储组件实例
  nextVirtualDOM.component = oldComponent

  // 3. 进行比对
  diff(nextVirtualDOM, container, oldDOM)
}
```

### 5. 调用组件的生命周期函数

- 在组件的更新过程中我们还需要去调用组件的生命周期函数，我们先在 Component 类中将生命周期默认添加进去
  - 在父类 Component 中定义生命周期函数，这样子类都可以继承
  - 如果子类要使用生命周期函数，重新定义覆盖即可

```js
// src/TinyReact/Component.js
import diff from './diff'
export default class Component {
  constructor(props) {
    this.props = props
  }
  setState(state) {
    this.state = Object.assign({}, this.state, state)
    // 获取最新的要渲染的 VirtualDOM 对象
    const virtualDOM = this.render()
    // 获取旧的 VirtualDOM 对象进行比对
    const oldDOM = this.getDOM()

    const container = oldDOM.parentNode
    diff(virtualDOM, oldDOM.parentNode, oldDOM)
  }
  setDOM(dom) {
    this._dom = dom
  }
  getDOM() {
    return this._dom
  }
  updateProps(props) {
    this.props = props
  }

  // 生命周期函数
  componentWillMount() {}
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {}
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps != this.props || nextState != this.state
  }
  componentWillUpdate(nextProps, nextState) {}
  componentDidUpdate(prevProps, prevState) {}
  componentWillUnmount() {}
}
```

- 在 updateComponent 这个函数中我们应该先调用 componentWillReceviceProps 生命周期，在调用这个生命周期的时候要传入最新的 props
- 接着我们要调用 shouldComponentUpdate 生命周期，来判断组件是否需要更新
- 接着要调用 componentWillUpdate 生命周期
- 在组件更新结束之后需要执行 componentDidUpdate 生命周期，这里传入的应该是更新前的 props，我们可以提前定义一个变量存储起来

```js
// src/TinyReact/updateComponent.js
import diff from "./diff"
export default function updateComponent(virtualDOM, oldComponent, oldDOM, container) {
  // 调用生命周期函数
  oldComponent.componentWillReceiveProps(virtualDOM.props)
  if (oldComponent.shouldComponentUpdate(virtualDOM.props)) {
    // 未更新前的 props
    let prevProps = oldComponent.props
    oldComponent.componentWillUpdate(virtualDOM.props)

    // 组件更新
    // 1. 更新组件的 props
    oldComponent.updateProps(virtualDOM.props)

    // 2. 获取组件返回的最新的 VirtualDOM
    let nextVirtualDOM = oldComponent.render()
    // 更新 component 组件实例对象
    nextVirtualDOM.component = oldComponent

    // 3. 进行比对
    diff(nextVirtualDOM, container, oldDOM)

    // 调用生命周期函数
    oldComponent.componentDidUpdate(prevProps)
  }
}
```

## ref 属性获取元素的 DOM 对象和组件实例对象

- 在 React 中可以为 React 元素添加 ref 属性，值是一个函数：
  - 如果是普通元素，通过 ref 属性获取到元素的 DOM 对象
    - 函数接收的参数是当前元素对应的 DOM 对象
  - 如果是类组件，通过 ref 属性获取到组件的实例对象
    - 函数接收的参数是当前组件的实例对象
  - 函数组件不能使用 ref，因为它没有实例

```js
class DemoRef extends TinyReact.Component {
  constructor() {
    super()
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick() {
    console.log(this.input.value)
  }
  render() {
    return (
      <div>
        <input type="text" ref={input => (this.input=input)} />
        <button onClick={this.handleClick}>按钮</button>
      </div>
    )
  }
}

TinyReact.render(<DemoRef />, root)
```

- 实现思路
  - 如果是普通 DOM 元素
    - 在创建节点时（createDOMElement）判断其 Virtual DOM 对象中是否有 ref 属性
    - 如果有，就调用 ref 属性中所存储的方法，并且将创建出来的 DOM 对象作为参数传递给 ref 方法
    - 这样在渲染组件节点的时候就可以拿到元素对象并将元素对象存储为组件属性

```js
// src/TinyReact/createDOMElement.js
import mountElement from './mountElement'
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

  // 将元素对应的 virtual DOM 存储到元素的属性上
  newElement._virtualDOM = virtualDOM

  // 递归创建子节点
  virtualDOM.children.forEach(child => {
    mountElement(child, newElement)
  })

  // ref 属性
  if (virtualDOM.props && virtualDOM.props.ref) {
    virtualDOM.props.ref(newElement)
  }

  return newElement
}
```

- 如果是类组件
  - 在 mountComponent 方法中，判断当前处理的如果是类组件
    - 则通过类组件返回的 VirtualDOM 对象中获取组件实例对象
    - 判断组件实例对象中的 props 属性中是否存在 ref 属性
    - 如果存在就调用 ref 方法，并将组件实例对象传递给 ref 方法

```js
// src/TinyReact/mountComponent.js
import isFunctionComponent from './isFunctionComponent'
import isFunction from './isFunction'
import mountNativeElement from './mountNativeElement'
export default function mountComponent(virtualDOM, container, oldDOM) {
  let nextVirtualDOM = null
  let component = null
  // 判断组件是类组件还是函数组件
  if (isFunctionComponent(virtualDOM)) {
    // 函数组件
    nextVirtualDOM = buildFunctionComponent(virtualDOM)
  } else {
    // 类组件
    nextVirtualDOM = buildClassComponent(virtualDOM)
    component = nextVirtualDOM.component
  }

  // 判断渲染的组件是否直接返回了另一个组件
  if (isFunction(nextVirtualDOM)) {
    mountComponent(nextVirtualDOM, container, oldDOM)
  } else {
    mountNativeElement(nextVirtualDOM, container, oldDOM)
  }

  // 如果是类组件
  if (component) {
    component.componentDidMount()
    // ref 属性
    if (component.props && component.props.ref) {
      component.props.ref(component)
    }
  }
}

function buildFunctionComponent(virtualDOM) {
  return virtualDOM.type(virtualDOM.props || {})
}

function buildClassComponent(virtualDOM) {
  const component = new virtualDOM.type(virtualDOM.props || {})
  const nextVirtualDOM = component.render()
  // 存储组件实例对象
  nextVirtualDOM.component = component
  return nextVirtualDOM
}
```

## 使用 key 属性进行节点对比

### 1. key 属性

- 在 React 中，渲染列表数据时会要求在列表元素上添加 key 属性，否则会发出警告
  - key 属性就是数据的唯一标识，用于 React 识别哪些数据被修改或者删除了，从而达到 DOM 最小化操作的目的
  - key 属性不需要全局唯一，但是在同一个父节点下的同类型节点之间必须唯一
  - 也就是说，仅在对比同一个父节点下类型相同的子节点时需要用到 key 属性
- key 属性的作用是减少 DOM 操作，提高 DOM 操作的性能
- 例如之前删除节点的示例是按顺序依次对比更新每个节点，然后删除最后一个 li：

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Frame/React/16.png =500x)

- 如果使用 key 属性，经过对比，只需删除文本为 2 的 li 即可，而不需要更新其他 li 的文本：

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Frame/React/17.png =500x)

### 2. 节点对比

- 实现思路
  - 两个元素进行对比时，如果类型相同，并且为元素节点（文本节点不用设置 key），就循环旧的 DOM 对象的子元素，查看其身上是否有 key 属性
    - 如果都没有，则使用索引的方式对比每个节点
    - 如果有，就将这个子元素的 DOM 对象存储在一个 JavaScript 对象中
  - 接着循环要渲染的 Virtual DOM 对象的子元素，在循环的过程中获取这个子元素的 key 属性
  - 然后使用这个 key 属性去之前的 JavaScript 对象中查找 DOM 对象
    - 如果能够找到，就说明这个元素已经存在，不需要重新渲染
      - 通过与旧 DOM 对象下相同索引的子元素是否相同，判断位置是否发生了变化
      - 如果位置变化，则将当前元素移动到旧 DOM 对象下当前索引的位置（通过 insertBefore 移动到被对比的旧的子元素前面）
      - 如果位置没有发生变化，则不需要渲染
    - 如果找不到这个元素，说明这个元素是新增的，需要渲染，通过调用 mountElement 直接渲染到页面中
- 示例

```js
class KeyDemo extends TinyReact.Component {
  constructor() {
    super()
    this.state = {
      persons: [
        { id: 1, name: '张三' },
        { id: 2, name: '李四' },
        { id: 3, name: '王五' },
        { id: 4, name: '赵六' }
      ]
    }
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick() {
    const newState = JSON.parse(JSON.stringify(this.state))
    // 位置变化
    newState.persons.push(newState.persons.shift())
    // 添加元素
    // newState.persons.splice(1, 0, { id: 0, name: '李逵' })
    // 删除元素
    // newState.persons.pop()
    this.setState(newState)
  }
  render() {
    return (
      <div>
        <ul>
          {this.state.persons.map(person => (
            <li key={person.id}>{person.name}</li>
          ))}
        </ul>
        <button onClick={this.handleClick}>按钮</button>
      </div>
    )
  }
}

TinyReact.render(<KeyDemo />, root)
```

- 位置变化

```js
// src/TinyReact/diff.js
import mountElement from './mountElement'
import updateTextNode from './updateTextNode'
import updateNodeElement from './updateNodeElement'
import isFunction from './isFunction'
import createDOMElement from './createDOMElement'
import unmountNode from './unmountNode'
import diffComponent from './diffComponent'
export default function diff(virtualDOM, container, oldDOM) {
  const oldVirtualDOM = oldDOM && oldDOM._virtualDOM
  const oldComponent = oldVirtualDOM && oldVirtualDOM.component
  // 判断 oldDOM 是否存在
  if (!oldDOM) {
    mountElement(virtualDOM, container)
  } else if (
    // 对比的两个节点类型不相同
    virtualDOM.type !== oldVirtualDOM.type &&
    // 并且节点的类型不是组件，因为组件要单独处理
    !isFunction(virtualDOM)
  ) {
    // 节点类型不相同
    const newElement = createDOMElement(virtualDOM)
    oldDOM.parentNode.replaceChild(newElement, oldDOM)
  } else if (isFunction(virtualDOM)) {
    // 组件
    diffComponent(virtualDOM, oldComponent, oldDOM, container)
  } else if (virtualDOM.type === oldVirtualDOM.type) {
    // 节点类型相同
    if (virtualDOM.type === 'text') {
      // 文本节点：更新内容
      updateTextNode(virtualDOM, oldVirtualDOM, oldDOM)
    } else {
      // 元素节点：更新元素属性
      updateNodeElement(oldDOM, virtualDOM, oldVirtualDOM)
    }

    // 1. 将拥有 key 属性的子元素放置在一个单独的对象中
    const keyedElements = {}
    for (let i = 0, len = oldDOM.childNodes.length; i < len; i++) {
      const domElement = oldDOM.childNodes[i]
      if (domElement.nodeType === 1) {
        // 元素节点
        const key = domElement._virtualDOM.props.key
        if (key) {
          keyedElements[key] = domElement
        }
      }
    }

    const hasNokey = Object.keys(keyedElements).length === 0

    if (hasNokey) {
      // 对比子节点
      virtualDOM.children.forEach((child, i) => {
        diff(child, oldDOM, oldDOM.childNodes[i])
      })
    } else {
      // 2. 循环 virtualDOM 的子元素，获取子元素的 key 属性
      virtualDOM.children.forEach((child, i) => {
        const key = child.props.key
        if (key !== undefined) {
          const domElement = keyedElements[key]
          if (domElement) {
            // 3. 看看当前位置的元素是不是期望的元素
            if (oldDOM.childNodes[i] && oldDOM.childNodes[i] !== domElement) {
              oldDOM.insertBefore(domElement, oldDOM.childNodes[i])
            }
          }
        }
      })
    }

    // 删除节点
    // 获取旧节点
    const oldChildNodes = oldDOM.childNodes
    // 判断旧节点的数量
    if (oldChildNodes.length > virtualDOM.children.length) {
      // 有节点需要被删除
      for (let i = oldChildNodes.length - 1; i > virtualDOM.children.length; i--) {
        unmountNode(oldChildNodes[i])
      }
    }
  }
}
```

> [!warning]
> 这里通过 domElement._virtualDOM.props.key 获取 key，而不是 domElement.getAttribute('key') 获取，是因为 React 并没有将 key 属性添加到真实的 DOM 元素上，这里与 React 保持一致

- 可以通过 chrome 浏览器查看 Elements 元素：
  - 当未设置 key 属性时，点击按钮，4个 li 都闪烁（表示重新渲染）
  - 当设置 key 属性时，点击按钮，只有3个 li 由于位置发生变化，发生了闪烁（重新渲染）

### 3. 新增节点

- 示例修改

```js
handleClick() {
  const newState = JSON.parse(JSON.stringify(this.state))
  // 位置变化
  // newState.persons.push(newState.persons.shift())
  // 添加元素
  newState.persons.splice(1, 0, { id: 0, name: '李逵' })
  // 删除元素
  // newState.persons.pop()
  this.setState(newState)
}
```

- mountElement 最终通过 mountNativeElement 向页面挂载元素
- 当前使用的是 container.appendChild(newElement)，所以新增的节点总会插入到容器的尾部
- 所以要修改这个挂载方式，使其可以指定插入节点的位置（旧节点的前面）

> [!info]
> insertBefore(newnode, existingnode)：
> - newnode 要插入的节点对象
> - existingnode 可选，在其之前插入新节点，如果未指定则会在结尾插入 newnode
>   - 如果与 newnode 相同，则会执行移动操作

```js
// src/TinyReact/diff.js
/*...*/
export default function diff(virtualDOM, container, oldDOM) {
  const oldVirtualDOM = oldDOM && oldDOM._virtualDOM
  const oldComponent = oldVirtualDOM && oldVirtualDOM.component
  // 判断 oldDOM 是否存在
  if (!oldDOM) {/*...*/
  } else if (
    // 对比的两个节点类型不相同
    virtualDOM.type !== oldVirtualDOM.type &&
    // 并且节点的类型不是组件，因为组件要单独处理
    !isFunction(virtualDOM)
  ) {/*...*/
  } else if (isFunction(virtualDOM)) {/*...*/
  } else if (virtualDOM.type === oldVirtualDOM.type) {
    // 节点类型相同
    /*...*/

    if (hasNokey) {
      // 对比子节点
      virtualDOM.children.forEach((child, i) => {
        diff(child, oldDOM, oldDOM.childNodes[i])
      })
    } else {
      // 2. 循环 virtualDOM 的子元素，获取子元素的 key 属性
      virtualDOM.children.forEach((child, i) => {
        const key = child.props.key
        if (key !== undefined) {
          const domElement = keyedElements[key]
          if (domElement) {
            // 3. 看看当前位置的元素是不是期望的元素
            if (oldDOM.childNodes[i] && oldDOM.childNodes[i] !== domElement) {
              oldDOM.insertBefore(domElement, oldDOM.childNodes[i])
            }
          } else {
            // 新增元素
            mountElement(child, oldDOM, oldDOM.childNodes[i])
          }
        }
      })
    }

    // 删除节点
    // 获取旧节点
    const oldChildNodes = oldDOM.childNodes
    // 判断旧节点的数量
    if (oldChildNodes.length > virtualDOM.children.length) {
      // 有节点需要被删除
      for (let i = oldChildNodes.length - 1; i > virtualDOM.children.length; i--) {
        unmountNode(oldChildNodes[i])
      }
    }
  }
}
```
```js
// src/TinyReact/mountElement.js
import createDOMElement from './createDOMElement'
import unmountNode from './unmountNode'
export default function mountNativeElement(virtualDOM, container, oldDOM) {
  const newElement = createDOMElement(virtualDOM)

  // 将转换之后的 DOM 对象放置到页面中
  if (oldDOM) {
    container.insertBefore(newElement, oldDOM)
  } else {
    container.appendChild(newElement)
  }

  // 判断旧的 DOM 对象是否存在，如果存在则删除
  if (oldDOM) {
    unmountNode(oldDOM)
  }

  // 获取类组件的实例对象
  const component = virtualDOM.component

  // 判断是否是类组件返回的 VirtualDOM
  if (component) {
    component.setDOM(newElement)
  }
}
```

### 4. 卸载节点

- 在对比节点的过程中，如果旧节点的数量多于要渲染的新节点的数量，就说明有节点被删除了
  - 先判断 keyedElements 对象中是否有元素
    - 如果没有就使用索引方式删除
    - 如果有就要使用 key 属性对比的方式进行删除
- 实现思路
  - 循环旧节点，获取旧节点对应的 key 属性
  - 然后根据 key 属性在新节点中查找这个旧节点
    - 如果找到就说明这个节点没有被删除
    - 如果没有找到，就说明节点被删除了，调用卸载节点的方法卸载节点即可
- 示例修改

```js
handleClick() {
  const newState = JSON.parse(JSON.stringify(this.state))
  // 位置变化
  // newState.persons.push(newState.persons.shift())
  // 添加元素
  // newState.persons.splice(1, 0, { id: 0, name: '李逵' })
  // 删除元素
  newState.persons.pop()
  this.setState(newState)
}
```

- diff

```js
// src/TinyReact/diff.js
/*...*/
export default function diff(virtualDOM, container, oldDOM) {
  const oldVirtualDOM = oldDOM && oldDOM._virtualDOM
  const oldComponent = oldVirtualDOM && oldVirtualDOM.component
  // 判断 oldDOM 是否存在
  if (!oldDOM) {/*...*/
  } else if (
    // 对比的两个节点类型不相同
    virtualDOM.type !== oldVirtualDOM.type &&
    // 并且节点的类型不是组件，因为组件要单独处理
    !isFunction(virtualDOM)
  ) {/*...*/ 
  } else if (isFunction(virtualDOM)) {/*...*/
  } else if (virtualDOM.type === oldVirtualDOM.type) {
    // 节点类型相同
    /*...*/

    // 删除节点
    // 获取旧节点
    const oldChildNodes = oldDOM.childNodes
    // 判断旧节点的数 量
    if (oldChildNodes.length > virtualDOM.children.length) {
      // 有节点需要被删除
      if (hasNokey) {
        for (let i = oldChildNodes.length - 1; i > virtualDOM.children.length; i--) {
          unmountNode(oldChildNodes[i])
        } 
      } else {
        // 通过 key 属性删除节点
        for (let i = 0; i < oldChildNodes.length; i++) {
          const oldChild = oldChildNodes[i]
          const oldChildKey = oldChild._virtualDOM.props.key
          const found = virtualDOM.children.some(newChild => {
            return oldChildKey === newChild.props.key
          })
          if (!found) {
            unmountNode(oldChild)
          }
        }
      }
    }
  }
}
```

#### 4.1 卸载节点需要考虑的几种情况

- 卸载节点并不是说将节点直接删除就可以了，还需要考虑以下几种情况
  - 如果要删除的节点是文本节点，可以直接删除
  - 如果要删除的节点由组件生成，需要调用组件卸载生命周期函数 componentWillUnmount
  - 如果要删除的节点中包含了其他组件生成的节点，需要调用其他组件的卸载生命周期函数
  - 如果要删除的节点身上有 ref 属性，还需要删除通过 ref 属性传递给组件的 DOM 节点对象
  - 如果要删除的节点身上有事件，需要删除事件对应的事件处理函数
- 示例

```js
class DemoRef extends TinyReact.Component {
  constructor() {
    super()
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick() {
    console.log(this.input.value)
    console.log(this.alert)
  }
  componentWillUnmount() {
    console.log('componentWillUnmount')
  }
  render() {
    return (
      <div>
        <input type="text" ref={input => (this.input = input)} />
        <button onClick={this.handleClick}>按钮</button>
        <Alert ref={alert => (this.alert = alert)} name="张三" age={20} />
      </div>
    )
  }
}

// TinyReact.render(<DemoRef />, root)

class KeyDemo extends TinyReact.Component {
  constructor() {
    super()
    this.state = {
      persons: [
        { id: 1, name: '张三' },
        { id: 2, name: '李四' },
        { id: 3, name: '王五' },
        { id: 4, name: '赵六' }
      ]
    }
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick() {
    const newState = JSON.parse(JSON.stringify(this.state))
    // 位置变化
    // newState.persons.push(newState.persons.shift())
    // 添加元素
    // newState.persons.splice(1, 0, { id: 0, name: '李逵' })
    // 删除元素
    newState.persons.pop()
    this.setState(newState)
  }
  render() {
    return (
      <div>
        <ul>
          {this.state.persons.map(person => (
            <li key={person.id}>
              {person.name}
              <DemoRef />
            </li>
          ))}
        </ul>
        <button onClick={this.handleClick}>按钮</button>
      </div>
    )
  }
}

TinyReact.render(<KeyDemo />, root)
```
```js
// src/TinyReact/unmountNode.js
export default function unmountNode(node) {
  const virtualDOM = node._virtualDOM
  // 1. 文本节点可以直接删除
  if (virtualDOM.type === 'text') {
    // 直接删除
    node.remove()
    // 阻止程序向下执行
    return
  }

  // 2. 节点是否是由组件生成
  const component = virtualDOM.component
  // 如果 component 存在，就说明节点是由组件生成的
  if (component) {
    component.componentWillUnmount()
  }

  // 3. 节点身上是否有 ref 属性
  if (virtualDOM.props && virtualDOM.props.ref) {
    virtualDOM.props.ref(null)
  }

  // 4. 节点的属性中是否有事件属性
  Object.keys(virtualDOM.props).forEach(propName => {
    if (propName.startsWith('on')) {
      const eventName = propName.toLowerCase().slice(0, 2)
      const eventHandler = virtualDOM.props[propName]
      node.removeEventListener(eventName, eventHandler)
    }
  })

  // 5. 递归删除子节点
  if (node.childNodes.length > 0) {
    for (let i = 0; i < node.childNodes.length; i++) {
      unmountNode(node.childNodes[i])
      i--
    }
  }

  // 删除节点
  node.remove()
}
```



