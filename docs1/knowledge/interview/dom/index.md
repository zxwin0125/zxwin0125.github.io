---
article: false
title: DOM 面试重点
category:
	- 面试
tag:
	- DOM
---

### 统计当前页面出现次数最多的标签

> 题目：如何找到当前页面出现的所有标签
> 题目：如何找到当前页面出现次数最多的 HTML 标签

- 有三种 API 可以列出页面所有标签：
  - document.querySelectorAll('*')，标准规范实现
  - document.getElementsByTagName('*')
  - $$('*')，devtools 实现
  - document.all，非标准规范实现，已废弃，不建议使用

- 两道拓展的面试题
  - 如何找到当前页面出现次数前三多的 HTML 标签
  - 如过多个标签出现次数同样多，则取多个标签

```javascript
new Set($$('*').map(it => it.tagName.toLowerCase()))
```

### 跨域

> 题目：什么是跨域，如何解决

- **<font color=red>协议，域名，端口</font>**，三者有一不一样，就是跨域
  - www.baidu.com 与 zhidao.baidu.com 是跨域
- 目前有两种最常见的解决方案：
1. CORS，在服务器端设置几个响应头，如 Access-Control-Allow-Origin: *
2. Reverse Proxy，在 nginx/traefik/haproxy 等反向代理服务器中设置为同一域名
3. JSONP

### 图片懒加载

> 题目：网站开发中，如何实现图片的懒加载

- 最新的实现方案是使用 IntersectionObserver API

```javascript
const observer = new IntersectionObserver((changes) => {
  changes.forEach((change) => {
    // intersectionRatio
    if (change.isIntersecting) {
      const img = change.target
      img.src = img.dataset.src
      observer.unobserve(img)
    }
  })
})
 
observer.observe(img)
```

### addEventListener()

> 题目：浏览器中监听事件函数 addEventListener 第三个参数有那些值

- 详见 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener)

### 什么是事件冒泡和事件捕获

> 题目：什么是事件冒泡和事件捕获
> 题目：关于事件捕获和冒泡，以下代码输出多少

- 可以使用一道代码题，完全理解事件冒泡和事件捕获
- 代码见: [事件捕获和冒泡](https://codepen.io/zxwin0125/pen/dPbbWEP)
- 以下代码输出多少:

```html
<div class="container" id="container">
  <div class="item" id="item">
    <div class="btn" id="btn">
      Click me
    </div>
  </div>
</div>
```
```javascript
document.addEventListener('click', (e) => {
  console.log('Document click')
}, {
  capture: true
})
 
container.addEventListener('click', (e) => {
  console.log('Container click')
  // e.stopPropagation()
}, {
  capture: true
})
 
item.addEventListener('click', () => {
  console.log('Item click')
})
 
btn.addEventListener('click', () => {
  console.log('Btn click')
})
 
btn.addEventListener('click', () => {
  console.log('Btn click When Capture')
}, {
  capture: true
})
```

### 什么是事件委托，e.currentTarget 与 e.target 有何区别

> 题目：什么是事件委托，e.currentTarget 与 e.target 有何区别

![](https://static.shanyue.tech/images/23-02-11/clipboard-0095.c66057.webp)

- 事件委托指当有大量子元素触发事件时，将事件监听器绑定在父元素进行监听，此时数百个事件监听器变为了一个监听器，提升了网页性能
- 另外，React 把所有事件委托在 Root Element，用以提升性能

### e.preventDefault

> 题目：DOM 中如何阻止事件默认行为，如何判断事件否可阻止？

- 如下：
  - e.preventDefault(): 取消事件
  - e.cancelable: 事件是否可取消
- 如果 addEventListener 第三个参数 { passive: true}，preventDefault 将会会无效

### input 事件

> 题目：React 中监听 input 的 onChange 事件的原生事件是什么
> 题目：input 中监听值的变化是在监听什么事件

- 重点要了解下 input 事件，比如 React 的 onChange 在底层实现时，就是用了原生的 input 事件，可观察以下代码输出

```javascript
import "./styles.css";
 
export default function App() {
  return (
    <div className="App">
      <input
        onChange={(e) => {
          console.log("Event: ", e);
          console.log("NativeEvent: ", e.nativeEvent);
          console.log("CurrentTarget: ", e.nativeEvent.currentTarget);
          console.log("NativeEvent Type: ", e.nativeEvent.type);
        }}
      />
    </div>
  );
}
```

### React/Vue 中的 router 实现原理如何

> 题目：React/Vue 中的 router 实现原理如何

- 前端路由有两种实现方式:
  - history API
    - 通过 history.pushState() 跳转路由
    - 通过 popstate event 监听路由变化，但无法监听到 history.pushState() 时的路由变化
  - hash
    - 通过 location.hash 跳转路由
    - 通过 hashchange event 监听路由变化

### 浏览器中如何读取二进制信息

> 题目：浏览器中如何读取二进制信息

![](https://shanyue.tech/assets/img/transform.77175c26.jpg)

- 可在 MDN 中熟读以下 API
  - File/Blob API
  - TypedArray/ArrayBuffer API
  - FileReader API