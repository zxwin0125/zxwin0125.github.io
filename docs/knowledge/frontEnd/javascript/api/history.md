---
title: History API
order: 2
---

## history

> window.history 对象是一个只读属性

1. 提供了操作浏览器会话历史（浏览器地址栏中访问的页面，以及当前页面中通过框架加载的页面）的接口
  - history.go
  - history.back
  - history.forward
  - history.pushState
  - history.replaceState
2. 提供了会话历史的信息
  - history.length 会话历史中元素的数目
  - history.state 当前会话的状态的值（history栈顶的任意值的拷贝）

## state

> history 历史记录的状态信息

- 可以通过 history.state 查看当前历史记录的状态，返回在 history 栈顶的历史记录项的状态对象的拷贝
- 也可以在 popstate 事件发生后通过 event.state 查看
- 如果未调用 pushState 或 replaceState，state 的值将会是null
- 如果调用了两者，只要窗口未关闭，即便刷新页面，state 依然会保留

## history.pushState

- 语法：`history.pushState(stateObj, title[, url])`
- pushState 接收3个参数
  1. 状态对象：一个表示state状态的能被序列化的任意值
  2. 标题
  3. URL（可选）：定义了新的历史URL记录，默认为当前 URL
- 调用 pushState 会发生
  1. 向 history 添加一条新的历史记录，包含 state、标题、url
  2. 修改地址栏地址为指定的 URL

> [!warning]
> 以上操作都是客户端操作，并没有向服务端发送 url 请求

> [!important]
> pushState 与 `window.location='#foo'` 在跳转锚点上的区别
> - location 只有在哈希与上一个地址的哈希不同时才会创建新的历史记录，而 pushState 依然会创建
> - pushState 不会触发 hashchange 事件

## history.replaceState

- replaceState 与 pushState 非常相似，区别在于 replaceState 是修改当前历史记录项，而不是新建一个

> [!warning]
> 虽然在当前页面窗口（标签）中的历史记录操作是修改而不是新建，但并不会阻止其在全局浏览器历史记录中创建一个新的历史记录项（查看浏览器历史记录）

- replaceState 的使用场景在于为了响应用户操作，更新状态对象 state 或当前历史记录的 URL

## popstate 事件

- 当活动的历史记录项发生变化时，就会触发 popstate 事件，通过 event.state 可以访问当前历史记录的状态对象的拷贝
- 但是，通过调用 pushState 或 replaceState 造成的历史记录项的变更，并不会触发 popstate 事件
- 只有在做出浏览器动作时，才会触发该事件，例如：
  - 用户点击浏览器的前进后退按钮
  - 代码中调用 history.back 、history.forward、history.go
- 使用

```js
window.onpopstate = function(event) {
  console.log(event.state)
}
```

## vue-router 的 history 模式

- vue-router 的 history 模式就是使用 pushState、replaceState、popstate 事件实现路由跳转以及监听地址变更，进而进行相应的处理（组件渲染等）
