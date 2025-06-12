---
title: JSX 到底是什么
order: 2
---

## 定义

- 使用 React 就一定会写 JSX，JSX 到底是什么呢？
  - 它是一种 **<font color=red>JavaScript 语法的扩展</font>**，React 使用它来描述用户界面长成什么样子
  - 虽然它看起来非常像 HTML，但它确实是 JavaScript
  - 在 React 代码执行之前，**<font color=red>Babel 会将 JSX 编译为 React API，编译成浏览器能执行的 JavaScript 代码</font>**
- 从两种语法对比来看，JSX 语法的出现是为了让 React 开发人员编写用户界面代码更加轻松

```jsx
<div className="container">
  <h3>Hello React</h3>
  <p>React is great </p>
</div>
```

```jsx
// 每一个节点都会编译成 React.createElement 方法的调用
// React.createElement 的作用是创建 VirtualDOM 对象
// VirtualDOM 对象就是 JavaScript 对象
React.createElement(
  'div',
  {
    className: 'container' // 节点属性
  },
  React.createElement('h3', null, 'Hello React'),
  React.createElement('p', null, 'React is great')
)
```

- [Babel REPL](https://babeljs.io/repl)

```jsx
;<div className="container">
  <h2>Hello World</h2>
</div>

function App() {
  return <div>Hello React</div>
}
```

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/img/Frame/React/07.png)

## JSX 代码的转换过程

- JSX 先会被 Babel 转译为 React.createElement 方法的调用
- React.createElement 方法返回 Virtual DOM 对象
- React 将 Virtual DOM 对象转为真实 DOM 进行渲染
