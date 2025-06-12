---
article: false
title: 你以为你懂 React 吗？
date: 2023-03-08
order: 1
---

- React 是前端中最受瞩目的框架，其倡导的多种思想也对其他框架（比如 Vue）有着广泛影响
- 对此，挑选出 React 中一些「不为人知」却又非常重要的点，进行解析，可以更好、更深入地理解 React
- 相关知识点如下：

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/image/Frame/React/01.png)

## 神奇的 JSX

> JSX 是 React 的骨骼，它搭起了 React 应用的组件，是整个项目的组件框架基础

### JSX 就是丑陋的模版

- 直观上看，JSX 是将 HTML 直接嵌入在了 JS 代码里面，这是刚开始接触 React 时，很多人最不能接受的设定，因为表现和逻辑耦合在一起，在某种程度上是一种混乱和困扰
- 但是从现在发展来看，JSX 让前端实现真正意义上的组件化成为了可能
- 先来看看 **<font color=red>JSX 是如何实现条件渲染的</font>**

### JSX 多种姿势实现条件渲染

> 场景：渲染一个列表，但是需要满足：列表为空数组时，显示空文案「Sorry，the list is empty」，同时列表数据可能通过网络获取，存在列表没有初始值为 null 的情况

- JSX 实现这种条件渲染最简洁的手段就是三目运算符：

```javascript
const list = ({ list }) => {
  const isNull = !list
  const isEmpty = !isNull && !list.length

  return (
    <div>
      {isNull ?
        null
      : isEmpty ?
        <p>Sorry, the list is empty </p>
      : <div>
          {list.map(item => (
            <ListItem item={item} />
          ))}
        </div>
      }
    </div>
  )
}
```

- 但是多加了几个状态：加上出现错误时，正在加载时的逻辑，三目运算符嵌套地狱可能就要出现了：

```javascript
const list = ({isLoading, list. error}) => {
  return (
    <div>
    {
      condition1
      ? <Component1 />
      : (
          condition2
          ? <Component2 />
          : (
            condition3
            ? <Component3 />
            : <Component4 />
          )
        )
    }
    </div>
  )
}
```

- 如何破解这种嵌套呢？常用的手段是抽离出 render function：

```javascript
const getListContent = (isLoading, list, error) => {
    console.log(list)
    console.log(isLoading)
    console.log(error)
   // ...
   return ...
}

const list = ({isLoading, list, error}) => {
  return (
    <div>
      {
        getListContent(isLoading, list, error)
      }
    </div>
  )
}
```

- 甚至使用 IIFE：

```javascript
const list = ({ isLoading, list, error }) => {
  return (
    <div>
      {(() => {
        console.log(list)
        console.log(isLoading)
        console.log(error)

        if (error) {
          return <span>Something is wrong!</span>
        }
        if (!error && isLoading) {
          return <span>Loading...</span>
        }
        if (!error && !isLoading && !list.length) {
          return <p>Sorry, the list is empty </p>
        }
        if (!error && !isLoading && list.length > 0) {
          return (
            <div>
              {list.map(item => (
                <ListItem item={item} />
              ))}
            </div>
          )
        }
      })()}
    </div>
  )
}
```

- 这样一来就可以使用 console.log 进行简单调试了，也可以使用 if...else 进行条件渲染

> [!important] > **<font color=red>为什么不能直接在 JSX 中使用 if...else，只能借用函数逻辑实现呢</font>**
>
> - 实际上，JSX 会被编译为 React.createElement
> - 直白来说，**<font color=red>React.createElement 的底层逻辑是无法运行 JavaScript 代码的，而它只能渲染一个结果</font>**
> - 因此 JSX 中除了 JS 表达式，不能直接写 JavaScript 语法
> - 准确来讲，JSX 只是函数调用和表达式的语法糖

### JSX 的强大和灵活

- 虽然 JSX 只是函数调用和表达式的语法糖，但是 JSX 仍然具有强大而灵活的能力
- React 组件复用最流行的方式都是在 JSX 能力基础之上的，比如 HoC，比如 render prop 模式：

```javascript
class WindowWidth extends React.Component {
  constructor() {
    super()
    this.state = {
      width: 0
    }
  }

  componentDidMount() {
    this.setState(
      {
        width: window.innerWidth
      },
      window.addEventListener('resize', ({target}) => {
        this.setState({
          width: target.innerWidth
        })
      })
    )
  }

  render() {
    return this.props.children(this.state.width)
  }
}

<WindowWidth>
  {
    width => (width > 800 ? <div>show</div> : null)
  }
<WindowWidth>
```

- 甚至，还可以让 JSX 具有 Vue template 的能力：

```javascript
render() {
  const visible = true

  return (
    <div>
      <div v-if={visible}>
       content
      </div>
    </div>
  )
}

render() {
  const list = [1, 2, 3, 4]

  return (
    <div>
      <div v-for={item in list}>
        {item}
      </div>
    </div>
  )
}
```

- 因为 JSX 总要进行一步编译，在这个编译过程中借助 AST（抽象语法树）对 v-if、v-for 进行处理即可

## 你真的了解异步的 this.setState 吗？

> this.setState 到底是异步执行还是同步执行？

### this.setState 全是异步执行吗？

- this.setSate 这个 API，官方描述为：

> setState() does not always immediately update the component. It may batch or defer the update until later. This makes reading this.state right after calling setState() a potential pitfall.

- 既然用词是 may，那么说明 this.setState 一定不全是异步执行，也不全是同步执行的，所谓的「延迟更新」并不是针对所有情况
- 实际上， React 控制的事件处理过程，setState 不会同步更新 this.state
- 而在 React 控制之外的情况，setState 会同步更新 this.state
- 什么是 React 控制内外呢？举个例子：

```javascript
onClick() {
  this.setState({
    count: this.state.count + 1
  })
}

componentDidMount() {
  document.querySelectorAll('#btn-raw')
    .addEventListener('click', this.onClick)
}

render() {
  return (
    <React.Fragment>
      <button id="btn-raw">
        click out React
      </button>

      <button onClick={this.onClick}>
        click in React
      </button>
    </React.Fragment>
  )
}
```

- id 为 btn-raw 的 button 上绑定的事件，是在 componentDidMount 方法中通过 addEventListener 完成的，这是脱离于 React 事件之外的
- 因此它是同步更新的，反之，代码中第二个 button 所绑定的事件处理函数对应的 setState 是异步更新的
- 这样的设计也不难理解，通过「延迟更新」，可以达到更好的性能

### this.setState promise 化

- 官方提供了这种处理异步更新的方法，其中之一就是 setState 接受第二个参数，作为状态更新后的回调，但这无疑又带来了 callback hell 问题

> 举一个场景
>
> - 开发一个 tabel，这个 table 类似 excel，当用户敲下回车键时，需要将光标移动到下一行，这是一个 setState 操作，然后马上进行聚焦，这又是一个 setState 操作
> - 如果当前行就是最后一行，那用户敲下回车时，需要先创建一个新行，这是第一个 setState 操作，同时将光标移动到新的「最后一行」，这是第二个 setState 操作
> - 在这个新行中进行聚焦，这是第三个 setState 操作
> - 这些 setState 操作依赖于前一个 setState 的完成

- 面对这种场景，如果不想出现回调地狱的场景，常见的处理方式是利用生命周期方法，在 componentDidUpdate 中进行相关操作
  - 第一次 setState 进行完后，在其触发的 componentDidUpdate 中进行第二次 setState，依此类推
- 但是这样存在的问题也很明显：
  - 逻辑过于分散，生命周期方法中有很多很难维护的「莫名其妙操作」，出现「面向生命周期编程」的情况
- 回到刚才问题，解决回调地狱，最直接的方案就是将 setState Promise 化：

```javascript
const setStatePromise = (me, state) => {
  new Promise(resolve => {
    me.setState(state, () => {
      resolve()
    })
  })
}
```

- 这只是 patch 做法，如果修改 React 源码的话，也不困难：

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/image/Frame/React/02.png)

## 原生事件 VS React 合成事件

> [!info]
>
> - React 中的事件机制并不是原生的那一套，事件没有绑定在原生 DOM 上 ，大多数事件绑定在 document 上（除了少数不会冒泡到 document 的事件，如 video 等)
> - 同时，触发的事件也是对原生事件的包装，并不是原生 event
> - 出于性能因素考虑，合成事件（syntheticEvent）是被池化的
>   - 这意味着合成事件对象将会被重用，在调用事件回调之后所有属性将会被废弃
>   - 这样做可以大大节省内存，而不会频繁的创建和销毁事件对象

- 这样的事件系统设计，无疑性能更加友好，但同时也带来了几个潜在现象

### 现象 1：异步访问事件对象

- 不能以异步的方式访问合成事件对象：

```javascript
function handleClick(e) {
  console.log(e)

  setTimeout(() => {
    console.log(e)
  }, 0)
}
```

- 上述代码第二个 console.log 总将会输出 undefined
- 为此 React 准备了持久化合成事件的方法：

```javascript
function handleClick(e) {
  console.log(e)

  e.persist()

  setTimeout(() => {
    console.log(e)
  }, 0)
}
```

### 现象 2：如何阻止冒泡

- 在 React 中，直接使用 `e.stopPropagation` 不能阻止原生事件冒泡，因为事件早已经冒泡到了 `document` 上，React 此时才能够处理事件句柄
- 如代码：

```javascript
componentDidMount() {
  document.addEventListener('click', () => {
    console.log('document click')
  })
}

handleClick = e => {
  console.log('div click')
  e.stopPropagation()
}

render() {
  return (
    <div onClick={this.handleClick}>
      click
    </div>
  )
}
```

- 执行后会打印出 `div click`，之后是 `document click`，`e.stopPropagation` 是没有用的
- 但是 React 的合成事件还给使用原生事件留了一个口子，通过合成事件上的 nativeEvent 属性，还是可以访问原生事件
- 原生事件上的 stopImmediatePropagation 方法：
  - 除了能做到像 stopPropagation 一样阻止事件向父级冒泡之外，也能阻止当前元素剩余的、同类型事件的执行（第一个 click 触发时，调用 `e.stopImmediatePropagtion` 阻止当前元素第二个 click 事件的触发）
- 因此这一段代码只会打印出 `div click`：

```javascript
componentDidMount() {
  document.addEventListener('click', () => {
    console.log('document click')
  })
}

handleClick = e => {
  console.log('div click')
  e.nativeEvent.stopImmediatePropagation()
}

render() {
  return (
    <div onClick={this.handleClick}>
      click
    </div>
  )
}
```

## 请不要再背诵 Diff 算法了

- 通过一个侧面来剖析 Diff 算法的细节

### Element diff 的那些事儿

- React 把对比两个树的时间复杂度从 On 立方降低到大 On，三个假设也都老生常谈了
- 但是关于兄弟列表的 diff 细节，React 叫做 element diff，可以展开一下
- React 三个假设在对比 element 时，存在短板，于是需要开发者给每一个 element 通过提供 key
- 这样 react 可以准确地发现新旧集合中的节点中相同节点，对于相同节点无需进行节点删除和创建，只需要将旧集合中节点的位置进行移动，更新为新集合中节点的位置

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/image/Frame/React/03.png)

- 组件 1234，变为 2143，此时 React 给出的 diff 结果为 2，4 不做任何操作，1，3 进行移动操作即可
- 也就是元素在旧集合中的位置，相比新集合中的位置更靠后的话，那么它就不需要移动，当然这种 diff 听上去就并非完美无缺的
- 来看这么一种情况：

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/image/Frame/React/04.png)

- 实际只需对 4 执行移动操作，然而由于 4 在旧集合中的位置是最大的，导致其他节点全部移动，移动到 4 节点后面
- 这无疑是很愚蠢的，性能较差，针对这种情况，官方建议：

  > 「在开发过程中，尽量减少类似将最后一个节点移动到列表首部的操作」

- 实际上很多类 React 类库（Inferno.js，Preact.js）都有了更优的 element diff 移动策略

### 有 key 就一定「性能最优」吗？

- 刚才提到，在进行 element diff 时：由于 key 的存在，react 可以准确地判断出该节点在新集合中是否存在，这极大地提高了 element diff 效率
- 但是加了 key 一定要比没加 key 的性能更高吗？
- 来看这个场景，集合 [1,2,3,4] 渲染成 4 组数字，注意仅仅是数字这么简单：1234
- 当它变为 [2，1，4，5]：删除了 3，增加了 5，按照之前的算法，把 1 放到 2 后面，删除 3，再新增 5，整个操作移动了一次 dom 节点，删除和新增一共 2 处节点
- 由于 dom 节点的移动操作开销是比较昂贵的，其实对于这种简单的 node text 更改情况，不需要再进行类似的 element diff 过程，只需要更改 `dom.textContent` 即可

```javascript
const startTime = performance.now()

$('#1').textContent = 2
$('#2').textContent = 1
$('#3').textContent = 4
$('#4').textContent = 5

console.log('time consumed:' performance.now() - startTime)
```

- 这么看，也许没有 key 的情况下要比有 key 的性能更好

## 总结

- 实际上，任何一个类库或者框架，都不能停留在初级使用上，而更应该从使用的经验出发，深入细节，这样才能更好地理解框架，也能更快地自我提升
