---
title: 探索 React Hooks
date: 2023-09-12
order: 4
---

## Reat Hooks 介绍

### React Hooks 是用来做什么的

> [!info]
> React Hooks 是 React 16.8 版本新添加的特性，实际上是一堆钩子函数<br>
> **<font color=red>主要是增强函数型组件的功能，让函数型组件可以实现类组件相同的功能</font>**，例如：
> - 使用和存储 state（状态）
> - 拥有处理副作用的能力

- 从 React 16.8 版本开始，React 官方推荐开发者使用函数去创建组件，但没有计划从 React 中移除 class，类组件依然可用

> [!info]
> 关于副作用：**<font color=red>在一个组件中，只要不是把数据转换成视图的代码，就属于「副作用」</font>**，例如：
> - 获取 DOM 元素
> - 为 DOM 元素添加事件
> - 设置定时器
> - 发送 ajax 请求

- 在类组件中，通常使用生命周期函数来处理这些副作用
- 在函数型组件中，就要使用 Hooks 来处理副作用

## 类组件的不足（Hooks 要解决的问题）

### 1. 缺少逻辑复用机制

- 类组件中缺少逻辑复用的机制
  - 通常情况下，开发者可能会使用 Render Props（渲染属性） 或高阶函数来实现逻辑复用
    - 无论是渲染属性还是高阶组件，这个代码本身是非常复杂的
  - 而且为了实现逻辑复用的机制，通常是在原有组件的外面又包裹了一层组件，而这一层组件又没有实际的渲染效果，增加了组件嵌套层次，变得十分臃肿
    - 组件嵌套层级的增加，增加了调试的难度，以及降低了运行效率

### 2. 业务逻辑经常会变得很复杂且难以维护

- 这点体现在类组件的生命周期函数中
  - 通常将一组相关的业务逻辑拆分到多个生命周期函数中，比如
    - 在组件挂载时设置事件监听，又要在组件被卸载前清除事件监听
    - 这两个事情都属于同一个业务逻辑，但是却拆分到多个生命周期函数中，使得组件代码难以维护
  - 类似的，在一个生命周期函数中存在多个不相干的业务逻辑，例如：
    - 在组件挂载时，获取数据，同时进行其它初始化设置

### 3. 类成员方法不能保证 this 指向的正确性

- 当给一个元素绑定事件，在事件处理函数中更改状态的时候，通常要更正这个函数中的 this 指向，否则就会指向全局（window），严格模式下则会指向 undefined
- 通常使用 bind 或者函数嵌套函数的方式去更改这个 this 指向
- 这样的代码也使得类组件变得难以维护

```javascript
import React from 'react'
class Demo extends React.Component {
  handleClick() {
    console.log(this);
    // 非严格模式 window
    // 严格模式 this
  }
  render() {
    return <button onClick={this.handleClick}>Click</button>
  }
}
export default Demo
```

> 这需要开发者理解 JavaScript 中 this 的工作原理，简单来说，函数中的 this 指向函数的调用者<br>
> 当前 click 事件直接绑定了类成员 handleClick 这个函数的引用，在触发时，它的调用者就是全局对象 window，在严格模式下就是 undefined

- 通常会使用以下3种方式去更改 this 指向：

1. 使用箭头函数定义类成员

- 如果使用箭头函数定义这个成员，那函数内部的 this 就是定义时 this 的指向，即组件实例对象：

```javascript
handleClick = () => {
  console.log(this);
  // this 指向组件实例对象
}
```

2. 使用 bind 更改 this 指向

```javascript
constructor() {
  this.handleClick = this.handleClick.bind(this)
}

// 或者

render() {
  return <button onClick={this.handleClick.bind(this)}>Click</button>
}
```

3. 箭头函数嵌套（原理同方式1）

```javascript
render() {
  return <button onClick={() => this.handleClick()}>Click</button>
}
```

- 这些方式都使代码变得复杂难以理解和维护

## React Hooks 使用

> Hooks 意为钩子，React Hooks 就是一堆钩子函数，React 通过这些钩子函数对函数型组件进行增强，不同的钩子函数提供了不同的功能

- 钩子函数以 use 开头，自定义 Hooks 也约定以 use 开头的命名规则，以方便 linter 插件校验
- 基础 Hooks
  - useState：用于为函数组件引入状态
  - useEffect：让函数型组件拥有处理副作用的能力，类似生命周期函数
  - useContext：在使用 createContext 跨组件层级传递数据时，简化获取数据的代码
- 额外的 Hooks
  - useReducer：另一种让函数组件引入状态的方式
  - useCallback：性能优化 - 缓存函数，使组件重新渲染时得到相同的函数实例
  - useMemo：性能优化 - 监测某个数据的变化，根据变化值计算新值，类似 Vue 中的计算属性
  - useRef：获取 DOM 元素对象、保存跨组件周期的数据
  - useImperativeHandle
  - useLayoutEffect
  - useDebugValue

## useState 钩子函数

### useState 介绍

> 用于为函数组件引入状态，让函数组件可以保存状态

- 通常情况下，函数中的变量在函数执行完就会被释放掉，所以函数组件原本是不可以保存状态数据的
- useState 方法通过闭包（将数据存储在组件函数外）让函数型组件实现保存和变更状态

### useState 使用

- useState 方法接收一个初始状态的值作为参数，返回一个数组
- 数组的第一个元素是状态数据，第二个元素是设置状态数据的方法，该方法接收一个参数用于修改状态数据
  - 方法名称约定以 set 开头，后面加上状态名称
  - 可以通过数组解构的方式将数组中的元素解构出来
- 组件重新渲染时，useState 会获取状态的值，忽略设置的初始值

```jsx
import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)
  return <div>
    <span>{count}</span>
    <button onClick={() => setCount(count+1)}>+ 1</button>
  </div>
}

export default App
```

### useState 使用细节

1. useState 接收唯一的参数，即状态初始值，初始值可以是 JavaScript 中的任意数据类型

2. useState 方法可以被调用多次，用于保存不同状态值

```jsx
import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);
  const [person, setPerson] = useState({name: '张三', age: 17});

  return <div>
    <span>{count} {person.name} {person.age}</span>
    <button onClick={() => setCount(count+1)}>+ 1</button>
    <button onClick={() => setPerson({...person, name: '李四'})}>setPerson</button>
  </div>
}

export default App
```

3. 参数可以是一个函数，函数返回什么，初始状态就是什么，由于函数只会被调用一次，适用在初始值是动态值得情况

```jsx
import { useState } from 'react'

// 参数是函数的场景，优先取组件接收的数据，这样只会在挂载时获取一次 props 中的数据
function App(props) {
  // 错误写法：每次渲染都会获取 props.count
  // const propCount = props.count
  // const [count, setCount] = useState(propCount || 0)
  
  // 正确写法：只会在挂载时执行一次
  const [count, setCount] = useState(() => {
    return props.count || 0
  })
  return <div>
    <span>{count}</span>
    <button onClick={() => setCount(count+1)}>+ 1</button>
  </div>
}

export default App
```

### useState 设置状态值方法的使用细节

- **<font color=red>设置状态值方法接收唯一的参数，可以是一个值也可以是一个回调函数</font>**
  - 参数即新的状态值或返回新的状态值的函数，它会完全替换状态值，不会像 setState 一样合并对象类型的状态值
- **<font color=red>设置状态值方法的方法本身是异步的</font>**
  - 如果代码依赖这个方法的执行结果，要同步执行，那就一定要放置在回调函数中

```jsx
import { useState } from 'react'

function App(props) {
  const [count, setCount] = useState(() => {
    return props.count || 0
  })

  function handlePower(number) {
    setCount(() => {
      const power = number * number

      // 同步代码在 setCount 参数内定义
      // document.title = count

      return power
    })

    // count 为 setCount 执行前的值
    document.title = count
  }
  return <div>
    <span>{count}</span>
    <button onClick={() => setCount(count+1)}>+ 1</button>
    <button onClick={() => handlePower(count)}>求平方</button>
  </div>
}

export default App
```

## useReducer 钩子函数

### useReducer 介绍

> useState 的替代方案，是另一种让函数组件保存状态的方式

> [!important]
> useReducer 的方式类似 Redux
> - 组件的状态被保存在特定的地方，要想改变状态，需要通过 dispatch 方法触发一个 Action
> - 这个 Action 会被 Reducer 函数接收，Reducer 内部要判断 Action 的类型来决定如何处理状态，最后通过返回值的方式去更新状态

### useReducer 使用

- useReducer 方法的参数：
  - 第一个参数：接收一个形如`(state, action) => newState`的 Reducer 函数
  - 第二个参数：默认的状态初始值
  - 返回：当前的 state 和配套的 dispatch 方法

```jsx
import { useReducer } from 'react'

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return state + 1
    case 'decrement':
      return state - 1
    default:
      return state
  }
}

function App() {
  const [count, dispatch ] = useReducer(reducer, 0)

  return <div>
    <span>{count}</span>
    <button onClick={() => dispatch({type: 'increment'})}>+ 1</button>
    <button onClick={() => dispatch({type: 'decrement'})}>- 1</button>
  </div>
}

export default App
```

### useReducer 相对于 useState 的好处

- 对逻辑较复杂且包含多个子值的 state，使用 useReducer 方便，根据 Action 的类型修改部分数据
- 适合下一个 state 依赖上一个 state 的场景
- 给那些会触发深更新的组件做性能优化
- 可以向下级组件传递 dispatch 方法，而不是组件内定义的函数
  - 这样当组件重新渲染时，如果传给下级组件的状态未发生变化，下级组件就不会重新渲染
  - 因为 dispatch 的引用是固定的，而组件内定义的函数在组件重新渲染时被重新定义，因此也会触发下级组件的渲染

## useContext 钩子函数

### useContext 介绍

> 在使用 createContext 跨组件层级传递数据时，简化获取数据的代码

- useContext 接收一个 context 对象（React.createContext 的返回值），返回该 context 的当前值
- 调用了 useContext 的组件总会在 context 值变化时重新渲染

### context 类组件 static 使用

```jsx
import React, { createContext } from 'react'

const ThemeContext = createContext()

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Foo />
    </ThemeContext.Provider>
  )
}

class Foo extends React.Component {
  static contextType = ThemeContext

  render() {
    return <div>{ this.context }</div>
  }
}

export default App
```

### Consumer 嵌套组件使用

```jsx
import { createContext } from 'react'

const ThemeContext = createContext()

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Foo />
    </ThemeContext.Provider>
  )
}

function Foo() {
  return <ThemeContext.Consumer>
    {
      theme => <div>{ theme }</div>
    }
  </ThemeContext.Consumer>
}

export default App
```

### useContext 使用

- 使函数型组件中不适用组件嵌套（Consumer）就可以订阅 Context

```jsx
import { createContext, useContext } from 'react'

const ThemeContext = createContext()

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Foo />
    </ThemeContext.Provider>
  )
}

function Foo() {
  const theme = useContext(ThemeContext)
  return <div>{ theme }</div>
}

export default App
```

## useEffect 钩子函数

### useEffect 介绍

> 让函数型组件拥有处理副作用的能力，类似生命周期函数

- 在类组件中使用生命周期函数处理副作用，在函数型组件中使用 useEffect 处理副作用

### useEffect 执行时机

- useEffect 可以看作 componentDidMount、componentDidUpdate 和 componentWillUnmount 三个函数的组合
- 也就是说，useEffect 会在
  - 组件挂载完成之后执行
  - 组件数据更新完成之后执行
  - 组件被卸载之前执行

1. `useEffect(() => {}) ==> componetDidMount, componentDidUpdate`

- 当组件挂载完成和状态更新完成时会调用传入的函数

```jsx
import { useState, useEffect } from 'react'

function App() {
  const [count, setCount] = useState(0);
  // 组件挂载完成之后执行 组件数据更新完成之后执行
  useEffect(() => {
    console.log('123');
  })
  return <div>
    <span>{count}</span>
    <button onClick={() => setCount(count+1)}>+ 1</button>
  </div>
}

export default App
```

2. `useEffect(() => {}, []) ==> componetDidMount`

- 第二个参数接收一个数组，用于指定监听的状态，当组件挂载完成和指定的状态变更完成时执行传入的函数
- 如果第二个参数是空数组，表示没有要监听的状态，则只会在挂载完成时执行一次

```jsx
import { useState, useEffect } from 'react'

function App() {
  const [count, setCount] = useState(0);
  // 组件挂载完成之后执行一次
  useEffect(() => {
    console.log('123');
  }, []);
  return <div>
    <span>{count}</span>
    <button onClick={() => setCount(count+1)}>+ 1</button>
  </div>
}

export default App
```

3. `useEffect(() => () => {}) ==> componetWillUnmount`

- 传入的函数如果返回了一个回调函数，组件更新前和被卸载前会执行这个回调函数
- 这个函数用于清理上一个副作用，以保证一致性（避免上一个副作用的效果残留）
- 当组件重新渲染时，useEffect 会用新的副作用函数替换之前的副作用函数

```jsx
import { useState, useEffect } from 'react'

function App() {
  const [count, setCount] = useState(0);
  // 组件被卸载之前执行
  useEffect(() => {
    return () => {
      console.log('组件被卸载了')
    }
  })
  return <div>
    <span>{count}</span>
    <button onClick={() => setCount(count+1)}>+ 1</button>
    {/* ReactDom.unmountComponentAtNode(container) 用于卸载容器中渲染的组件 */}
    <button onClick={() => ReactDom.unmountComponentAtNode(document.getElementById('root'))}>卸载组件</button>
  </div>
}

export default App
```

### useEffect 使用示例

- 为 window 对象添加滚动事件
- 设置定时器，让 count 数值每秒 +1

```jsx
import { useState, useEffect } from 'react'
import ReactDom from 'react-dom'

function App() {
  function onScroll() {
    console.log('页面滚动了')
  }

  useEffect(() => {
    window.addEventListener('scroll', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const [count, setCount] = useState(0)

  useEffect(() => {
    const timerId = setInterval(() => {
      // 这里需使用函数，将 count 作为参数传入，否则数值只会更新一次
      setCount(count => {
        document.title = count + 1
        return count + 1
      })

    }, 1000)

    return () => {
      clearInterval(timerId)
    }
  }, [])

  return (
    <div>
      <span>{count}</span>
      <button onClick={() => ReactDom.unmountComponentAtNode(document.getElementById('root'))}>卸载组件</button>
    </div>
  );
}

export default App;
```

### useEffect 解决的问题

> 在处理副作用上 useEffect 相比类组件的优势

1. 按照用途将代码进行分类

- 由于 useEffect 可以被多次调用，所以将一组相干的业务逻辑归置到同一个副作用函数中，将不相干的业务逻辑分置到不同的副作用函数中

2. 简化重复代码，使组件内部代码更加清晰

- 例如避免在 componentDidMount 和 componentDidUpdate 中编写重复代码

###  useEffect 的第二个参数

- useEffect 的第二个参数是依赖项数组，作用是：只有指定数据发生变化时才会触发副作用（effect）
- 当不传递依赖项数组的时候，会在组件数据（所有）发生变化的时候触发副作用函数
- 如果传递一个空数组，则只会在初始加载时执行副作用函数，不会监听任何数据的变化
- 原理是接收一个给定值的数组，组件每次渲染，用新的数组和旧的数组去对比，有任何一项不相等则执行副作用

```jsx
import { useState, useEffect } from 'react'

function App() {
  const [count, setCount] = useState(0)
  const [person, setPerson] = useState({name:'张三'})

  useEffect(() => {
    console.log('只有当 count 变化时才会执行回调函数')
    document.title = count
  }, [count])

  return (
    <div>
      <span>{count}</span>
      <button onClick={() => setCount(count + 1)}>+ 1</button>
      <br/>
      <span>{person.name}</span>
      <button onClick={() => setPerson({name: '李四'})}>更名</button>
    </div>
  );
}

export default App;
```

### useEffect 异步操作

- 使用 await async 关键字
- 在 useEffect 回调函数中执行异步操作，例如：

```jsx
import { useEffect } from 'react'

function App() {
  useEffect(() => {
    getData().then(result => {
      console.log(result)
    })
  }, [])

  return (
    <div>App</div>
  );
}

// 模拟的异步操作
function getData() {
  return new Promise(resolve => {
    resolve({msg: 'Hello Async'})
  })
}

export default App;
```

- 如果想使用await关键字，则需要添加 async 关键字：

```jsx
useEffect(() => {
  const asyncFn = async () => {
    const result = await getData()
    console.log(result)
  }
  asyncFn()
}, [])
```

- 但是这样写，会出现问题：

```jsx
# 在 React 16 中会报错打断运行（Error）
An effect function must not return anything besides a function, which is used for clean-up.
It looks like you wrote useEffect(async () => ...) or returned a Promise. Instead, write the async function inside your effect and call it immediately：<推荐写法>
# 副作用函数必须返回一个用于清理的普通函数。
# 看起来你编写了 useEffect(async () => ...) 或返回了一个 Promise。相反，你可以在副作用函数中编写异步函数，并立即调用它：<推荐写法>
```
```jsx
# 在 React 17 中会警告（Warning）
Effect callbacks are synchronous to prevent race conditions. Put the async function inside：<推荐写法>
# 为了防止竞态条件（异步创建的任务无法确定执行顺序），副作用回调函数都是同步的。将异步函数像这样写入：<推荐写法>
```

- 错误原因如控制台提示的，副作用函数必须返回一个用做清理资源（组件销毁时调用）的普通函数
- 如果使用 async 关键字声明函数，则会声明一个异步函数，异步函数会返回一个 Pormise，副作用函数返回 Promise，违反了使用规则
> - React 17 这种写法虽然不会阻塞程序，但也不建议这样使用

#### 推荐写法

- 如官方推荐的写法，在普通函数中执行异步操作，将普通函数传给 useEffect

```jsx
useEffect(() => {
  const asyncFn = async () => {
    const result = await getData()
    console.log(result)
  }
  asyncFn()
}, [])
```

- 或在自执行函数中执行：

```jsx
useEffect(() => {
  (async () => {
    const result = await getData()
    console.log(result)
  })()
}, [])
```

## useMemo 钩子函数

### useMemo 介绍

> useMemo 的行为类似 Vue 中的计算属性，可以监测某个数据的变化，根据变化值计算新值，计算出的新值可以参与视图渲染

- useMemo 会缓存计算结果，如果监测值没有发生变化，即使组件重新渲染，也不会重新计算，此行为有助于避免在每个渲染上进行昂贵的计算

### useMemo 使用

- useMemo 接收一个计算回调函数和依赖项数组
  - 计算回调函数：当监听的数据发生变化，执行这个回调函数，回调函数返回的值就是计算的新值
  - 依赖项数组：需要监听的数据    
    - 如果不传，则会在每次渲染时执行计算回调函数
    - 如果传一个空数组则仅会在初始加载时执行一次回调函数
- useMemo 返回的值就是计算回调函数返回的值

```jsx
import { useState, useMemo } from 'react'

function App() {
  const [count, setCount] = useState(0);
  const [bool, setBool] = useState(true)

  const result = useMemo(() => {
    console.log('测试在修改 bool 时是否会重新计算')
    return count * 2
  }, [count])

  return (
    <div>
      <span>{result}</span>
      <span>{count}</span>
      <button onClick={() => setCount(count+1)}>+1</button>
      <br/>
      <span>{bool ? '真' : '假'}</span>
      <button onClick={() => setBool(!bool)}>改变Bool</button>
    </div>
  );
}

export default App;
```

## React.memo 方法

### memo 介绍

> memo 方法是用于性能优化的高阶组件

- 如果组件中的数据没有发生变化，可以阻止组件重新渲染，并直接复用最近一次渲染的结果
- 类似类组件中的 PureComponent 和 shouldComponentUpdate

### memo 使用

```jsx
import React, { memo, useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <span>{count}</span>
      <button onClick={() => setCount(count+1)}>+1</button>
      <Foo />
    </div>
  );
}

/*
// count 每次变化都会渲染 Foo 组件
function Foo() {
  console.log('Foo 组件重新渲染了')
  return (
    <div>Foo 组件</div>
  )
}
*/

// count 变化不会重新渲染 Foo 组件
const Foo = memo(function() {
  console.log('Foo 组件重新渲染了')
  return (
    <div>Foo 组件</div>
  )
})

export default App;
```

### memo 与类组件的 shouldComponentUpdata 和 PureComponent 的区别

#### 相同点

- 场景：当页面数据发生改变（包括对象重新赋值导致的引用地址的改变）的时候，都会导致页面（包括组件）重新渲染，非常消耗性能
- 作用：当页面数据发生变化时，可以对比新旧数据，如果数据的值没有发生变化，或子组件没有依赖发生变化的数据，则可以避免组件或页面重新渲染
- 都是浅对比

#### 不同点

- shouldComponentUpdata
  - 生命周期函数，只能在类组件中使用
  - 对比数据类型：state 和 props
  - 可以自定义对比逻辑
  - 函数返回 true 组件重新渲染，返回 false 不渲染
- React.PureComponent
  - 组件继承类
  - 继承了 PureComponent 的类组件不能使用 shouldComponentUpdata
  - 对比数据类型：state 和 props
  - 自带对比逻辑，相当于默认定义了 shouldComponentUpdata，但不能自定义对比逻辑
- React.memo
  - 高阶组件，只能在函数型组件中使用
  - 对比数据类型：props
  - 第二个参数接收一个函数，定义对比逻辑，返回 true 不重新渲染，返回 false 重新渲染

## useCallback 钩子函数

### useCallback 介绍

> useCallback 也是用于性能优化，它可以缓存函数，使组件重新渲染时得到相同的函数实例

### 向组件传递方法

```jsx
import { useState, memo } from 'react'

function App() {
  const [count, setCount] = useState(0)

  const resetCount = () => {
    setCount(0)
  }

  return <div>
    <span>{count}</span>
    <button onClick={() => setCount(count+1)}>+ 1</button>
    <Foo resetCount={resetCount} />
  </div>
}

const Foo = memo(function(props) {
  console.log('Foo 组件重新渲染了')
  return (
    <div>
      <button onClick={() => props.resetCount()}>重置Count</button>
    </div>
  )
})

export default App
```

- App 组件在 count 更新时就会重新渲染（App 函数就会重新执行），resetCount 也会重新定义，与之前传递给 Foo 的函数实例不一样，所以 Foo 就会重新下渲染
- 结果就是，Foo 组件总会在未使用到的 count 的值变化时重新渲染

### 缓存函数

- 为了避免这种不必要的重复渲染，可以使用 useCallback 将 resetCount 方法缓存下来，在 App 重新渲染时，获取缓存中的 resetCount 方法传递给 Foo 组件
- 由于缓存中的 resetCount （引用地址）未发生变化，所以 Foo 组件不会被额外渲染
- useCallback 同样可以接受一个依赖项数组作为第二个参数：
  - 如果不传，则在每次组件渲染时重新定义函数（相当于没有使用 useCallback）
  - 如果数组不为空，组件渲染时会对比数组，如果数组发生了变化则重新定义函数
  - 如果数组为空，则只会在组件挂载时执行一次

```jsx
const resetCount = useCallback(() => {
  setCount(0)
}, [])

// 或

const resetCount = useCallback(() => {
  setCount(0)
}, [setCount])
```

## useRef 钩子函数

### useRef 介绍

> useRef 有两个功能：1. 获取 DOM 元素对象，2. 保存跨组件周期的数据

### 获取 DOM 元素对象

- useRef (initial) 会返回一个可变的 ref 对象，该对象只有一个 current 属性，初始值时 initial
- 当把 ref 对象传递给组件或元素的 ref 属性后，ref 对象的 current 就指向该 DOM 元素对象
- 节点变化时只会改变 ref 对象的 current 属性，不会触发组件重新渲染

#### 函数型组件使用 useRef

```jsx
import { useRef } from 'react'

function App() {
  const box = useRef()

  return <div>
    <button ref={box} onClick={() => console.log(box)}>获取 DIV</button>
  </div>
}

export default App
```

#### 类组件使用 createRef

```jsx
import React from 'react'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.box = React.createRef()
  }

  render() {
    return <div ref={this.box}>
      <button onClick={() => console.log(this.box)}>获取 DIV</button>
    </div>
  }
}

export default App
```

### 保存数据（跨组件周期）

- useRef 返回的 ref 对象在组件的整个生命周期内保持不变，每次重新渲染，都返回同一个 ref 对象
- ref 对象的 current 属性变化，并不会引发组件重新渲染
- 本质上，这个 ref 对象就像是可以在其 `.current` 属性中保存一个可以变值的「盒子」
- 所以 useRef 还可以用于保存跨组件周期的数据：
  - 即使组件重新渲染，保存的数据仍然还在
  - 保存的数据被更改，也不会触发组件重新渲染
  - 通常保存一些程序在运行过程当中的辅助数据
- 与 useState 保存的数据的区别：useState 保存的是状态数据，当状态发生变化，会触发组件重新渲染

#### 停止计时器案例

> 在副作用函数里创建计时器，定时修改状态，点击按钮停止计时器

- 下面的方式不会成功：

```jsx
import { useState, useEffect } from 'react'

function App() {
  const [count, setCount] = useState(0)

  // 组件重新渲染 timerId 就会被重置
  let timerId = null

  useEffect(() => {
    timerId = setInterval(() => {
      setCount(count => count + 1)
    }, 1000)
  }, [])

  const stopCount = () => {
    clearInterval(timerId)
  }

  return <div>
    {count}
    <button onClick={stopCount}>停止</button>
  </div>
}

export default App
```

##### 使用 useState

- 可以使用 useState 将 timerId 当作状态保存，避免重新渲染时被重置

```jsx
import { useState, useEffect } from 'react'

function App() {
  const [count, setCount] = useState(0)

  // 使用 useState 确保组件重新渲染后 timerId 不会被重置
  const [timerId, setTimerId] = useState(null)

  useEffect(() => {
    setTimerId(setInterval(() => {
      setCount(count => count + 1)
    }, 1000))
  }, [])

  const stopCount = () => {
    clearInterval(timerId)
  }

  return <div>
    {count}
    <button onClick={stopCount}>停止</button>
  </div>
}

export default App
```

##### 使用 useRef

```jsx
import { useState, useEffect, useRef } from 'react'

function App() {
  const [count, setCount] = useState(0)

  // 使用 useRef 保存数据，在整个生命周期都不变
  const timerId = useRef(null)

  useEffect(() => {
    timerId.current = setInterval(() => {
      setCount(count => count + 1)
    }, 1000)
  }, [])

  const stopCount = () => {
    clearInterval(timerId.current)
  }

  return <div>
    {count}
    <button onClick={stopCount}>停止</button>
  </div>
}

export default App
```

## 自定义 Hook 函数

### 自定义 Hook 介绍

- 自定义 Hook 是标准的封装和共享逻辑的方式
  - 其实就是逻辑和内置 Hook 的组合，用于将组件逻辑提取到可重用的函数中
- 自定义 Hook 是一个函数，其名称以 use 开头，函数内部可以调用其它的 Hook
- 使用自定义 Hook 提取可复用的逻辑，相比 render props 和高阶函数简单很多

#### 示例1

```jsx
import { useState, useEffect, useRef } from 'react'

function App() {
  const [count, setCount] = useState(0)
  const timerId = useRef()

  useEffect(() => {
    timerId.current = setInterval(() => {
      setCount(count => count + 1)
    }, 1000)

    return () => {
      clearInterval(timerId.current)
    }
  }, [])

  return (
    <div>
      <div>Count 的值：{count}</div>
      <div>Count 的平方：{count * count}</div>
    </div>
  )
}

export default App
```

- 提取组件

```jsx
import { useState, useEffect, useRef } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  const timerId = useRef()

  useEffect(() => {
    timerId.current = setInterval(() => {
      setCount(count => count + 1)
    }, 1000)

    return () => {
      clearInterval(timerId.current)
    }
  }, [])

  return <div>Count 的值：{count}</div>
}

function PowerCounter() {
  const [count, setCount] = useState(0)

  const timerId = useRef()

  useEffect(() => {
    timerId.current = setInterval(() => {
      setCount(count => count + 1)
    }, 1000)

    return () => {
      clearInterval(timerId.current)
    }
  }, [])

  return <div>Count 的平方：{count * count}</div>
}

function App() {
  return (
    <div>
      <Counter />
      <PowerCounter />
    </div>
  )
}

export default App
```

- 使用自定义 Hook 提取重复逻辑

```jsx
import { useState, useEffect } from 'react'

// 自定义 Hook
function useCounter() {
  const [count, setCount] = useState(0)

  const timerId = useRef()

  useEffect(() => {
    timerId.current = setInterval(() => {
      setCount(count => count + 1)
    }, 1000)

    return () => {
      clearInterval(timerId.current)
    }
  }, [])

  return count
}

function Counter() {
  const count = useCounter()
  return <div>Count 的值：{count}</div>
}

function PowerCounter() {
  const count = useCounter()
  return <div>Count 的平方：{count * count}</div>
}

function App() {
  return (
    <div>
      <Counter />
      <PowerCounter />
    </div>
  )
}

export default App
```

#### 示例2

```jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function useGetPost () {
  const [post, setPost] = useState({});
  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/posts/1')
      .then(response => setPost(response.data));
  }, [])
  return [post, setPost]
}

funtion App() {
  const [post, setPost] = useGetPost()
  return <div>
    <div>{post.title}</div>
    <div>{post.body}</div>
  </div>
}

export default App
```

#### 示例3

- 在创建表单元素的时候通常都会将组件的状态和表单元素进行绑定（value 属性和 onChange事件），以实现数据同步
- 每个表单都需要绑定 value 和 onChange，可以把这个公共的逻辑提取到自定义 Hook 中

```jsx
import { useState } from 'react'

function useUpdateInput(initialValue) {
  const [value, setValue] = useState(initialValue)
  return {
    value,
    onChange: event => setValue(event.target.value)
  }
}

function App() {
  const usernameInput = useUpdateInput('')
  const passwordInput = useUpdateInput('')

  const submitForm = event => {
    event.preventDefault()
    console.log(usernameInput.value)
    console.log(passwordInput.value)
  }

  return (
    <form onSubmit={submitForm}>
      <input type="text" name="username" {...usernameInput} />
      <input type="password" name="password" {...passwordInput} />
      <input type="submit" />
    </form>
  )
}

export default App
```

## 路由钩子函数

- 当进入某个路由组件的时候，这个组件的 props 对象会附加几个对象：

![示意图](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Frame/React/01.png)

- React 路由模块（react-router-dom）提供了4个钩子函数，用来获取相关的路由信息：
  - useHistory：获取 history 对象
  - useLocation：获取 location 对象
  - useRouteMatch：获取 match 对象
  - useParams：获取 match 对象下的 params 对象，即路由参数

```jsx
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { useHistory, useLocation, useRouteMatch, useParams } from 'react-router-dom'

function Index(props) {
  console.log('Index', props)
  console.log('history', useHistory())
  console.log('location', useLocation())
  return <div>首页</div>
}

function News(props) {
  console.log('News', props)
  console.log('match', useRouteMatch())
  console.log('params', useParams())
  return <div>新闻</div>
}

function App() {
  return (
    <Router>
      <div>
        <Link to="/index">首页</Link>
        <Link to="/news/100">新闻</Link>
      </div>
      <div>
        <Route path="/index" component={Index} />
        <Route path="/news/:id" component={News} />
      </div>
    </Router>
  )
}

export default App
```

## 实现 useState 钩子函数

### useState 示例

```jsx
function App() {
  const [count, setCount] = useState(0)
  return (
    <div>
      {count}
      <button onClick={() => setCount(count + 1)}>setCount</button>
    </div>
  )
}

export default App
```

### useState 初始定义

- 接收一个状态初始值，返回一个数组，数组第一个元素是状态值，第二个元素是修改状态的方法

```jsx
function useState(initialState) {
  let state = initialState
  function setState(newState) {
    state = newState
  }
  return [state, setState]
}

function App() {
  const [count, setCount] = useState(0)
  return (
    <div>
      {count}
      <button onClick={() => setCount(count + 1)}>setCount</button>
    </div>
  )
}

export default App
```

### 重新渲染视图

- 状态变更后重新渲染视图

```jsx
import ReactDOM from 'react-dom'

function useState(initialState) {
  let state = initialState
  function setState(newState) {
    console.log(newState)
    state = newState
    // 在状态更改完成后，重新渲染视图
    render()
  }
  return [state, setState]
}

function render() {
  ReactDOM.render(<App />, document.getElementById('root'))
}

function App() {
  const [count, setCount] = useState(0)
  return (
    <div>
      {count}
      <button onClick={() => setCount(count + 1)}>setCount</button>
    </div>
  )
}

export default App
```

- 现在点击按钮数值变成1后，在此点击没有效果，打印结果 newState 一直是1
- 这是因为 App 组件每次渲染都会重新执行 useState，重置 state 的值为 0

### 在 useState 外部保存状态

- 为了避免组件每次渲染都重新初始化 state 的值，要将 state 存储在 useState 函数外部，先判断 state 是否有值，如果有则使用当前值，如果没有则设置为初始值

```jsx
let state

function useState(initialState) {
  state = state ? state : initialState
  function setState(newState) {
    console.log(newState)
    state = newState
    // 在状态更改完成后，重新渲染视图
    render()
  }
  return [state, setState]
}
```

### 多次调用

```jsx
function App() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('张三')
  return (
    <div>
      {count}
      <button onClick={() => setCount(count + 1)}>setCount</button>
      <br/>
      {name}
      <button onClick={() => setName('李四')}>setName</button>
    </div>
  )
}
```

- 当前显示的 count 和 name 的值都一样，因为一个 state 无法存储多个状态
- 将 state 设置为一个数组，按照调用 useState 的顺序存储每次创建的状态值，这样就可以存储多个状态
- 设置状态值的方法也同理

```jsx
import React from 'react'
import ReactDOM from 'react-dom'

let state = []
let setters = [] // 存储设置状态值的方法
let stateIndex = 0

function createSetter(index) {
  return function(newState) {
    if (typeof newState === 'function') {
      // 如果传入的是回调函数
      state[index] = newState(state[index])
    } else {
      state[index] = newState
    }

    // 在状态更改完成后，重新渲染视图
    render()
  }
}

function useState(initialState) {
  state[stateIndex] = state[stateIndex] ? state[stateIndex] : initialState

  if (!setters[stateIndex]) {
    // 错误：直接保存一个 set 方法，方法中使用 stateIndex 会采用最终的值
    // setters.push(function(newState) {
    //   state[stateIndex] = newState
    //   render()
    // })

    // 正确：声明一个函数，采用闭包的方式，保存各自状态的 index
    setters.push(createSetter(stateIndex))
  }


  const value = state[stateIndex]
  const setter = setters[stateIndex]

  stateIndex++

  return [value, setter]
}

function render() {
  // 重置 index
  stateIndex = 0
  ReactDOM.render(<App />, document.getElementById('root'))
}

function App() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('张三')

  return (
    <div>
      {count}
      <button onClick={() => setCount(count => count + 1)}>setCount</button>
      <br/>
      {name}
      <button onClick={() => setName('李四')}>setName</button>
    </div>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

### 模拟的不足

- 当前模拟 useState 实现原理的组件直接挂载到 root 元素下，没有嵌套其它组件，若嵌套，state 和 setters 则会出现重复数据

> [!warning]
> React 中的 useState 基于 useReducer 实现，返回的数组的第二个元素其实是 dispatch 方法<br>
> - useState 调用时会创建一个 hook 对象并挂载到节点 Fiber 对象中，其中包括：
>   - state：缓存的上一次 state 和当前 state
>   - queue：dispatch 触发队列，保证多个触发 dispatch 的任务
>   - next：hook 链，保证多次调用 useState 的定位

## 实现 useEffect 钩子函数

### 单次调用

```jsx
import ReactDOM from 'react-dom'

/* ---------- useState ---------- */
let state = []
let setters = [] // 存储设置状态值的方法
let stateIndex = 0

function createSetter(index) {...}

function useState(initialState) {...}

function render() {
  // 重置 index
  stateIndex = 0
  ReactDOM.render(<App />, document.getElementById('root'))
}

/* ---------- useEffect ---------- */
// 上一次的依赖值
let prevDepsAry = []

function useEffect(callback, depsAry) {
  // 判断 callback 是不是函数
  if (Object.prototype.toString.call(callback) !== '[object Function]') throw new Error('useEffect 函数的第一个参数必须是函数')

  // 判断 depsAry 有没有被传递
  if (typeof depsAry === 'undefined') {
    // 没有传递
    callback()
  } else {
    // 判断 depsAry 是不是数组
    if (Object.prototype.toString.call(depsAry) !== '[object Array]') throw new Error('useEffect 函数的第二个参数必须是数组')

    // 将当前的依赖值和上一次的依赖值作对比 如果有变化 调用 callback
    const hasChange = depsAry.every((dep, index) => dep !== prevDepsAry[index])
    
    // 判断值是否有变化
    if (hasChange) {
      callback()
    }

    // 同步依赖值
    prevDepsAry = depsAry
  }
}

function App() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('张三')

  useEffect(() => {
    console.log('Hello')
  }, [count])

  return (
    <div>
      {count}
      <button onClick={() => setCount(count => count + 1)}>setCount</button>
      <br/>
      {name}
      <button onClick={() => setName('李四')}>setName</button>
    </div>
  )
}

export default App
```

### 多次调用

```jsx
import ReactDOM from 'react-dom'

/* ---------- useState ---------- */
let state = []
let setters = [] // 存储设置状态值的方法
let stateIndex = 0

function createSetter(index) {...}

function useState(initialState) {...}

function render() {
  // 重置 index
  stateIndex = 0
  effectIndex = 0

  ReactDOM.render(<App />, document.getElementById('root'))
}

/* ---------- useEffect ---------- */
// 上一次的依赖值
let prevDepsAry = []
let effectIndex = 0

function useEffect(callback, depsAry) {
  // 判断 callback 是不是函数
  if (Object.prototype.toString.call(callback) !== '[object Function]') throw new Error('useEffect 函数的第一个参数必须是函数')

  // 判断 depsAry 有没有被传递
  if (typeof depsAry === 'undefined') {
    // 没有传递
    callback()
  } else {
    // 判断 depsAry 是不是数组
    if (Object.prototype.toString.call(depsAry) !== '[object Array]') throw new Error('useEffect 函数的第二个参数必须是数组')

    // 获取上一次的依赖值
    const prevDeps = prevDepsAry[effectIndex]

    // 判断上一次的依赖值是否存在 如果不存在 调用 callback
    // 将当前的依赖值和上一次的依赖值作对比 如果有变化 调用 callback
    const hasChange = prevDeps ? depsAry.every((dep, index) => dep !== prevDeps[index]) : true
    // 判断值是否有变化
    if (hasChange) {
      callback()
    }

    // 同步依赖值
    prevDepsAry[effectIndex] = depsAry

    effectIndex++
  }
}

function App() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('张三')

  useEffect(() => {
    console.log('Hello')
  }, [count])

  useEffect(() => {
    console.log('World')
  }, [name])

  return (
    <div>
      {count}
      <button onClick={() => setCount(count => count + 1)}>setCount</button>
      <br/>
      {name}
      <button onClick={() => setName('李四')}>setName</button>
    </div>
  )
}

export default App
```

## 实现 useReducer 钩子函数

```jsx
import { useState } from 'react'

/* ---------- useReducer ---------- */

function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState)

  function dispatch(action) {
    const newState = reducer(state, action)
    setState(newState)
  }

  return [state, dispatch]
}

function App() {
  function reducer(state, action) {
    switch (action.type) {
      case 'increment':
        return state + 1
      case 'decrement':
        return state - 1
      default:
        return state
    }
  }
  const [count, dispatch] = useReducer(reducer, 0)

  return (
    <div>
      {count}
      <button onClick={() => dispatch({type: 'increment'})}>+1</button>
      <button onClick={() => dispatch({type: 'decrement'})}>-1</button>
    </div>
  )
}

export default App
```