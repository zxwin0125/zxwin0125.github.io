---
title: 基础回顾
order: 1
---

# React 介绍 & JSX 语法

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Frame/React/01.png)

## React 介绍

- React 是一个用于构建用户界面的 JavaScript 库
- 构建用户界面结构、样式、逻辑皆是 JavaScript
- 它只负责应用程序的视图层，帮助开发人员构建快速且交互式的 web 应用程序
- React 使用组件的方式构建用户界面

## JSX 语法

- 在 React 中使用 JSX 语法描述用户界面，它是一种 **<font color=red>JavaScript 语法扩展</font>**

```jsx
// 这是一段既不是字符串也不是 HTML 的 JSX 代码
const element = <h1 className="greeting">Hello, world!</h1>
```

- JSX 不能直接放到浏览器中去运行，在 React 代码执行之前，Babel 会将 JSX 语法转换为标准的 JavaScript API（**<font color=red>React.createElement</font>**）并调用

```jsx
// 上面的 JSX 代码将被转换为
const element = React.createElement("h1", { className: 'greeting' }, "Hello, world!");
```

- JSX 语法就是 **<font color=red>React.createElement </font>**方法的一种<font color=red>语法糖</font>，让开发人员使用更加舒服的代码构建用户界面
- **<font color=red>React.createElement </font>**实际上创建了一个描述 DOM 的 JS 对象，这个对象被称为 「React 元素」，所以 JSX 也被称为 「React 元素」

```jsx
// 注意：这是简化过的结构
const element = {
  type: 'h1',
  props: {
    className: 'greeting',
    children: 'Hello, world!'
  }
}
```

### 1. 在 JSX 中使用表达式

- JSX 语法可以在大括号 {} 中使用任何有效的 JS 表达式

```jsx
function formatName(user) {
  return user.firstName + ' ' + user.lastName;
}

const user = {
  firstName: 'Harper',
  lastName: 'Perez'
};

// 一般建议将内容包裹在括号 `()` 中，这样可以避免遇到`自动插入分号`陷阱
const element = (
  <h1>
    Hello, {formatName(user)}!
  </h1>
);
```

- JSX 本身其实也是一种表达式，**<font color=red>将它赋值给变量，当作参数传入，作为返回值都可以，</font>**以及 **<font color=red>从函数中返回 JSX</font>**

```jsx
function getGreeting(user) {
  if (user) {
    return <h1>Hello, {formatName(user)}!</h1>;
  }
  return <h1>Hello, Stranger.</h1>;
}
```

### 2. 属性

- Reac 元素的属性有几个特殊性：
    - 如果属性的值是字符串字面量，使用引号
        - 因为 HTML 语法是比较松散的，属性的值可以加引号也可以不加，所以 JSX 做了严格要求
    - 如果属性的值是 JS 表达式，使用大括号
    - 引号和大括号两者只能使用其中一个
    - 属性名采用驼峰命名法，例如 onclick 写作 onClick，colspan写作 colSpan

```jsx
const element = <div greeting="hello"></div>;
```

```jsx
const element = <img src={user.avatarUrl} />;
```

### 3. JSX 单标记必须闭合

- 如果一个标签里没有内容，可以使用 `/>` 来闭合标签
- 如果 JSX 是单标记，必须闭合，否则报错

```jsx
const element = <div></div>
// 也可以写作：
const element = <div />

// HTML 语法中，单标记（也叫自闭和标签）没有强制使用 / 闭合，但 JSX 不闭合会报错：
// 以下会报错：
const img = <img src="">
const input = <input type="text">
```

### 4. className

- 为 JSX 标记添加类名需要使用 className，而不是class，因为 class 是 JavaScripit 语法的关键字：

```jsx
const element = <div className="title" tabIndex="0"></div>
```

### 5. JSX 自动展开数组

```jsx
const arr = [<p>line 1</p>, <p>line 2</p>, <p>line 3</p>];
const element = (
	<div>{ arr }</div>
);
// 解析后：
/*
<div>
	<p>line 1</p>
	<p>line 2</p>
	<p>line 3</p>
</div>
*/
```

### 6. 三元运算

- 在 JSX 中可以直接使用三元表达式

```jsx
// 如果返回 null，则什么都不会显示：
{ boolean ? <div>Hello React</div> : null }

// 如果返回布尔值（true、false），也不会显示任何内容，所以也可以写作：
{ boolean && <div>Hello React</div> }
```

### 7. 循环

- Vue 中使用循环可以通过 v-for 指令
- 在 React 中可以直接使用 JavaScript 方法遍历循环

```jsx
const persons = [{
  id: 1,
  name: '张三',
  age: 20
}, {
  id: 2,
  name: '李四',
  age: 15
}, {
  id: 3,
  name: '王五',
  age: 22
}]
```

- 遍历数组并返回一个 JSX 数组，然后这个数组又会自动展开（记得添加唯一的 **<font color=red>key</font>** 属性，提高 DOM 操作的性能）

```jsx
<ul>
  { persons.map(person => <li key={person.id}> {person.name} {person.age} </li>) }
</ul>
```

### 8. 事件

- 指定事件处理函数的几种方式：

```jsx
{/* 第一个参数即是事件对象 不需传递 */}
<button onClick={this.eventHandler}>按钮</button>
{/* 需要传递事件对象 */}
<button onClick={e=>this.eventHandler('arg',e)}>按钮</button>
{/* 最后一个参数即是事件对象 不需传递 */}
<button onClick={this.eventHandler.bind(null, 'arg')}>按钮</button>
```

- 上面除了 bind 方式指定了事件处理函数内部 this 的指向，其他的方式，默认内部 this 指向 undefined，所以要在组件构造函数中为事件处理函数绑定 this，使其指向组件本身：

```jsx
constructor () {
  this.eventHandler = this.eventHandler.bind(this)
}
eventHandler () {}
<button onClick={this.eventHandler}>按钮</button>
```

### 9. 样式

#### 9.1 行内样式

```jsx
// 使用 JS 对象方式编写样式，赋值给 React 元素的 style 属性
class App extends React.Component {
  render() {
    return <div style={{ width: 200, height: 200, backgroundColor: 'red' }}></div>
  }
}
```

- 如果通过 JavaScript 对象的方式编写样式：
    - 数值类型的值，后面可以不加单位，例如上面的 width: 200 同 width: 200px
    - 如果样式属性名是短横线命名：kebab-case，则要写成驼峰式 ：caseCase，例如 background-color 写成 backgroundColor
    - 注意赋值时实际上是两个大括号 {}，外面的表示使用表达式，里面的表示是 JS 对象
- JSX 中不能使用向 style 赋值字符串，例如这样会报错 `Thestyleprop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX`：

```jsx
return <div style="color: red"></div>
```

#### 9.2 外链样式

- 可以使用 CSS Modules 保证单个组件样式的作用域，原理可以看阮一峰的 [CSS Modules 用法教程](http://www.ruanyifeng.com/blog/2016/06/css_modules.html)
- Create React App 2.0 开始支持 CSS Modules，可以零配置使用，详见[官网 Adding a CSS Modules Stylesheet](https://create-react-app.dev/docs/adding-a-css-modules-stylesheet)
- React 组件名一般与 .js 文件名同名，可以创建同名的后缀为 .module.css 的文件编写组件样式，在组件文件中 import 这个文件，会获取一个类名集合：

```jsx
// Button.js
import styles from './Button.module.css';
class Button extends Component {
  render() {
    return <button className={styles.error}>Error Button</button>;
  }
}
```

#### 9.3 全局样式

```jsx
import './styles.css'
```

### 10. ref 属性

- 通过 ref 属性可以获取 React 元素 或 组件的实例对象

#### 10.1 createRef

```jsx
class Input extends Component {
  constructor() {
    super()
    this.inputRef = React.createRef()
  }
  render() {
    return (
      <div>
        <input type="text" ref={this.inputRef} />
        <button onClick={() => console.log(this.inputRef.current)}> button </button>
      </div>
    )
  }
}
```

#### 10.2 函数参数

```jsx
class Input extends Component {
  render() {
    return (
      <div>
        <input type="text" ref={input => (this.input = input)} />
        <button onClick={() => console.log(this.input)}>button</button>
      </div>
    )
  }
}
```

#### 10.3 ref 字符串

- 不推荐使用，在严格模式下报错

```jsx
class Input extends Component {
  render() {
    return (
      <div>
        <input type="text" ref="username" />
        <button onClick={() => console.log(this.refs.username)}>button</button>
      </div>
    )
  }
}
```

#### 10.4 获取组件实例

- 点击按钮让 input 文本框获取焦点
- input 文本框以及让文本框获取焦点的方法定义在 Input 组件中，在 App 组件中引入 Input 组件，按钮定义在 App 组件中

```jsx
// App.js
class App extends Component {
  constructor() {
    super()
    this.InputComponentRef = React.createRef()
  }
  render() {
    return (
      <div className="App">
        <Input ref={this.InputComponentRef} />
        <button onClick={() => this.InputComponentRef.current.focusInput()}>button</button>
      </div>
    )
  }
```

```jsx
// Input.js
class Input extends Component {
  constructor() {
    super()
    this.inputRef = React.createRef()
    this.focusInput = this.focusInput.bind(this)
  }
  focusInput() {
    this.inputRef.current.focus()
  }
  render() {
    return (
      <div>
        <input type="text" ref={this.inputRef} />
      </div>
    )
  }
}
```

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Frame/React/02.gif)

# React 组件

## 什么是组件

- React 是基于组件的方式进行用户界面开发的. 组件可以理解为对页面中某一块区域的封装

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Frame/React/03.png)

## 创建组件

### 1. 创建 class 组件

- 创建的 class 必须继承自 React 的 Component 类
- 类中必须定义一个 render 方法，返回要呈现的内容
- 组件还必须引入 React 模块，原因是 JSX 代码在执行时会被转换成 React.createElement()，会调用 React 模块的方法，所以要引入它

```jsx
import React, { Component } from 'react'
class App extends Component {
  render () {
    return <div>Hello，我是 class 组件</div>
  }
}
```

### 2. 创建函数组件

- 定义一个返回要呈现的内容的函数

```jsx
const Person = () => {
  return <div>Hello, 我是函数型组件</div>;
}
```

> [!warning]
> - 组件名称 **<font color=red>首字母必须大写</font>**，用以区分组件和普通标签，如果首字母是小写，React 会将其视为原生 DOM 标签
> - JSX 语法外层必须有一个<font color=red>根元素</font>

## 组件 props

### 1. props 传递数据

- 在调用组件时，可以向组件内部传递数据，在组件中可以通过 props 对象获取外部传递进来的数据

```jsx
<Person name="乔治" age="20"/>
<Person name="玛丽" age="10"/>
```

```jsx
// class 组件
class Person extends React.Component {
  render() {
    return (
      <div>
          <h3>姓名： {this.props.name}</h3>
          <h4>年领： {this.props.age}</h4>
      </div>
    )
  }
}
```

```jsx
// 函数组件
const Person = props => {
  return (
    <div>
      <h3>姓名：{props.name}</h3>
      <h4>年龄：{props.age}</h4>
    </div>
  );
}
```

> [!warning]
> - props 对象中存储的数据是 **<font color=red>只读</font>**的，不能在组件内部被修改，（例如禁止这种操作`props.name='约翰'`）
> - 当 props 数据源中的数据被修改后，组件中的接收到的 props 数据会被 **<font color=red>同步更新</font>**( 数据驱动DOM )

### 2. 设置 props 默认值

- class 组件通过它的静态属性 **<font color=red>defaultProps</font>** 设置 props 默认值

```jsx
// class 组件
class App extends React.Component {
  static defaultProps = {
    name: '菲利普'
  }
}
```

- 函数组件通过设置函数的属性 **<font color=red>defaultProps</font>** 设置 props 默认值

```jsx
function ThemedButton(props) {
}
ThemedButton.defaultProps = {
  theme: "secondary",
  label: "Button Text"
};
```

### 3. 组件 children

- 通过 props.children 属性可以获取到在调用组件时填充到组件标签内部的内容

```jsx
<Person>组件内部的内容</Person>
```

```jsx
const Person = (props) => {
  return (
    <div>{props.children}</div>
  );
}
```

### 4. 单向数据流

- 在 React 中, 关于数据流动有一条原则, 就是 **<font color=red>单向数据流动</font>**, 自顶向下, 从父组件到子组件
- 单向数据流特性要求我们 **<font color=red>共享数据要放置在上层组件中</font>**
- 子组件通过调用父组件传递过来的方法更改数据
- 当数据发生更改时, React 会 **<font color=red>重新渲染组件树</font>**
- 单向数据流使组件之间的数据流动变得可预测. 使得定位程序错误变得简单

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Frame/React/04.png)

## class 组件状态 state

- state 与 props 类似，但是 state 是私有的，并且完全受控于当前组件

> [!warning]
> - state 类似 Vue 选项的 data
> - class 组件的 constructor 函数相当于 Vue 组件选项用于返回 data 的方法

### 1. 定义组件状态

- class 组件除了能够从外部 (props) 接收状态数据以外，还可以拥有自己的状态 (state)，此状态在组件内部可以被更新，状态更新 DOM 更新
- 组件内部的状态数据被存储在组件类中的 state 属性中，state 属性值为对象类型，属性名称固定不可更改
- state 的初始化是在 class 组件的构造函数中直接赋值，构造函数也是唯一可以给 this.state 赋值的地方

```jsx
class App extends React.Component {
  constructor () {
    super() // 此调用不能省略
    this.state = {
      person: { name: '张三', age: 20 }
    }
  }
  render() {
    return (
    	<div>
      	{this.state.person.name}
      	{this.state.person.age}
      </div>
    )
  }
}
```

#### 1.1 为什么要在构造函数中调用 super()

- 这其实是 JavaScript 的限制，要想在构造函数中使用 **<font color=red>this</font>**，必须得在此之前调用 **<font color=red>super()</font>**
- 因为 React 创建组件是通过继承 **<font color=red>React.Component</font>**，JS语法对于继承父类的子类，可以通过在构造函数中调用 **<font color=red>super()</font>**，调用父类的构造函数，从而使得创建子类的实例时，可以继承父类的属性
- 而如果在子类的构造函数中没有调用 **<font color=red>super()</font>**，也就是没有继承父类的属性，使得这个继承名不副实，所以 JS 就会报错

```jsx
class A {
  constructor() {
    this.name = '张三'
  }
}
class B extends A {
  constructor() {
    // super()
    this.age = 13
  }
}
console.log(new B().name)
// Uncaught ReferenceError: Must call super constructor in derived class before accessing 'this' or returning from derived constructor
```

#### 1.2 super 里什么时候需要传入 props

- React 组件的构造函数被调用之后，会给创建的 React 实例对象的 props 属性赋值，所以在实例调用 render 方法时可以使用 this.props访问 props 数据

```jsx
class App extends React.Component {
  render () {
    return <h1>{this.props.name}</h1>
  }
}
```

- 因为 **<font color=red>组件的 props 属性是在构造函数被调用之后才赋值的</font>**，所以在构造函数中组件的 props 属性值还是 **<font color=red>undefined</font>**
- 要想在构造函数中使用 this.props 就得在调用 super() 时传入 props，或者直接从构造函数接收的参数 props 中访问

```jsx
class App extends React.Component {
  constructor(props) {
    super()
    this.state = {
      name: props.name // 使用参数 props 访问
    }
  }
}
```

```jsx
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: this.props.name // 使用 this.props 访问
    }
  }
}
```

```jsx
class App extends React.Component {
  constructor(props) {
    /* 不影响 render 中 this.props 的访问 */
  }
  render () {
    return <div>{this.props.name}</div>
  }
}
```

### 2. 更改组件状态

- state 状态对象中的数据不可直接更改，如果直接更改，DOM 不会被更新，要更改 state 状态数据需要使用 **<font color=red>setState </font>**方法

```jsx
class App extends React.Component {
  constructor() {
    super()
    this.state = {
      person: { name: '张三', age: 20 }
    }
    this.changePerson = this.changePerson.bind(this)
  }
  changePerson() {
    // 此代码不会重新渲染DOM
    // this.state.perspm = { name: '李四', age: 15 }
    
    // 正确方法
    this.setState({
      person: { name: '李四', age: 15 }
    })
  }
  render() {
    return (
    	<div>
      	{this.state.person.name}
      	{this.state.person.age}
        <button onClick={this.changePerson}>按钮</button>
      </div>
    )
  }
}
```

### 3. state 的更新会被合并

- 调用 setState() 的时候，React 会把你提供的对象合并到当前的 state，这个合并是 **<font color=red>浅合并</font>**，所以只会替换你提供的属性的值

```jsx
constructor(props) {
  super(props)
  this.state = {
    posts: [],
    comments: []
  }
}

this.setState({
  posts: postsData // 只会替换 posts，会完整保留 comments
})
```

### 4. 双向数据绑定

- 双向数据绑定是指，**<font color=red>组件类中更新了状态，DOM 状态同步更新，DOM 更改了状态，组件类中同步更新</font>**
    - 组件 <=> 视图
- 要实现双向数据绑定需要用到表单元素和 state 状态对象（因为在 DOM 中只有表单元素可以更改数据）

```jsx
class App extends React.Component {
  constructor() {
    super()
    this.state = { name: '张三' }
    this.nameChanged = this.nameChanged.bind(this)
  }
  nameChanged(event) {
    this.setState({ name: event.target.value })
  }
  render() {
    return (
    	<div>
      	<div>{this.state.name}</div>
        <input type="text" value={this.state.name} onInput={this.nameChanged} />
      </div>
    )
  }
}

```

## class 组件生命周期函数

- 生命周期函数：当程序运行到某一时刻会被自动运行的函数
- [生命周期图谱](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Frame/React/05.png)

### 1. 组件挂载阶段

#### constructor

- 当一个新的组件被创建的时候，首先会执行这个组件的 constructor 函数
- 可以在 constructor 函数中：
    - 初始化状态对象（state）
    - 改变函数的 this 指向（fn.bind(this)）
- **<font color=red>不要在 constructor 函数中引起一些副作用，例如向服务器端发送请求获取数据，这种操作应该放在 componentDidMount 生命周期函数中</font>**

#### getDerivedStateFromProps

- 当 consturctor 函数执行结束，会执行 getDerivedStateFromProps 函数（替代以前的 componentWillReceiveProps）

```jsx
static getDerivedStateFromProps(props, state)
```

- 该函数接收组件传入的 props，通过返回一个对象来更新 state，如果返回 null 则不更新任何内容，注意：不能什么都不返回

#### render

- 在 render 方法中会挂载 DOM 对象

#### componentDidMount

- 当前组件已经挂载完成

### 2. 数据更新阶段

#### getDerivedStateFromProps

#### shouldComponentUpdate

```jsx
shouldComponentUpdate(nextProps, nextState)
```

- 该函数返回一个 Boolean 值，默认返回 true，如果返回 true 则继续执行后面的生命周期函数，如果返回 false 则停止更新组件

#### render

#### getSnapshotBeforeUpdate

- getSnapshotBeforeUpdate 方法会在组件完成更新之前执行，用于执行某种逻辑或计算，返回值可以在 componentDidUpdate 方法中的第三个参数中获取，就是说在组件更新之后可以拿到这个值再去做其他事情

```jsx
getSnapshotBeforeUpdate(prevProps, prevState) {
  return 'snapshot'
}
```

- **<font color=red>在组件完成更新之前需要做某种逻辑或者计算，就需要用到快照</font>**

```javascript
componentDidUpdate(prevProps, prevState, snapshot) {}
```

- 如果只定义了 getSnapshotBeforeUpdate 而没有定义 componentDidUpdate 程序将会报错：`Warning: App: getSnapshotBeforeUpdate() should be used with componentDidUpdate(). This component defines getSnapshotBeforeUpdate() only.`

#### componentDidUpdate

```javascript
componentDidUpdate(prevProps, prevState, snapshot)
```

- componentDidUpdate 会在更新后会被立即调用，首次渲染不会执行此方法

### 3. 组件卸载阶段

#### componentWillUnmount

- 在这个生命周期中可以做一些清理操作，例如：
    - 清理某个对象的事件
    - 清理通过 ref 属性绑定的 DOM 对象

## Context

- props 是自上而下依次传递的，当组件层级比较深的时候，这样传递就会很麻烦
- 通过 Context 可以跨层级传递数据

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Frame/React/06.png)

```jsx
// userContext.js
import React from 'react'

// 创建上下文对象
const userContext = React.createContext()
// Provider用于向下传递数据
const UserProvider = userContext.Provider
// Consumer用于向上获取数据
const UserConsumer = userContext.Consumer

export { UserProvider,  UserConsumer}
```

```jsx
// App.js
import { UserProvider } from './userContext.js'
class App extends React.Component {
  render() {
    return (
      // 将传递的值传递给 value
    	<UserProvider value="张三">
      	<A />
      </UserProvider>
    )
  }
}
```

```jsx
// A.js
class A extends React.Component {
  render() { return <B /> }
}
```

```jsx
// B.js
class B extends React.Component {
  render() { return <C /> }
}
```

```jsx
// C.js
import { UserConsumer } from './userContext'
class C extends React.Component {
  render() {
    return (
      // 定义一个函数，通过参数接收传递的 value
    	<div>
      	<UserConsumer>
          { username => <h3>{username}</h3> }
        </UserConsumer>
      </div>
    )
  }
}

```

- context 的另一种用法

```jsx
// userContext.js
export default userContext
```

```jsx
// C.js
import userContext from "./userContext"

export class C extends Component {
  static contextType = userContext
  render() {
    return (
      <div>
        {this.context}
      </div>
    )
  }
}
```

- 还可以定义一个默认的数据

```jsx
// 创建上下文对象
const userContext = React.createContext('李四')
```

# React 表单 & 路由

## 表单

### 1. 受控表单

- 表单控件中的值由组件的 state 对象来管理，state对象中存储的值和表单控件中的值时同步状态的

```jsx
class App extends React.Component {
  constructor() {
    super()
    this.state = { username: '' }
    this.nameChanged = this.nameChanged.bind(this)
  }
  
  nameChanged(e) {
    this.setState({
      username: e.target.value
    })
  }
  render() {
    return (
    	<form>
      	<p>{this.state.username}</p>
        <input type="text" value={this.state.username} onInput={this.nameChanged} />
      </form>
    )
  }
}
```

### 2. 非受控表单

- 表单元素的值由 DOM 元素本身管理

```jsx
class App extends React.Component {
  constructor() {
    super()
    this.onSubmit = this.onSubmit.bind(this)
  }
  
  onSubmit(e) {
    // 通过ref获取DOM元素的数据
    console.log(this.username.value)
    e.preventDefault()
  }
  render() {
    return (
    	<form onSubmit={this.onSubmit}>
        <input type="text" ref={username => this.username = username} />
      </form>
    )
  }
}
```

## 路由

- url 地址与组件之间的对应关系，访问不同的 url 地址显示不同的组件

```bash
# 安装
npm install react-router-dom
```

### 1. 路由基本使用

- BrowserRouter 路由组件使用 HTML5 的 History API 修改路由 URL
- Router 组件应放在应用程序的最外层
- Route 组件用来设置和匹配路由规则
    - path 匹配的路由路径
    - component 匹配的路由组件
- Link 组件用来设置路由链接
    - to 定义链接地址

```jsx
// App.js
import React from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

function Index() {
  return <div>首页</div>
}

function News() {
  return <div>新闻</div>
}

function App() {
  return (
    <Router>
			<div>
        <Link to="/index">首页</Link>
        <Link to="/news">新闻</Link>
      </div>
      <div>
      	<Route path="/index" component={Index} />
      	<Route path="/news" component={News} />
      </div>
    </Router>
  )
}
```

### 2. 路由嵌套

- props.match.url 获取当前组件真实的URL
- props.match.path 获取当前组件的路由路径
- 当通过路由传递参数时，可以明显看到两者的区别，例如 params.id=10时：
    - props.match.url 可能是 `/news/detail/10`
    - props.match.path 可能是 `/news/detail/:id`

```jsx
function News(props) {
  return (
  	<div>
    	<div>
      	<Link to={`${props.match.url}/company`}>公司新闻</Link>
      	<Link to={`${props.match.url}/industry`}>行业新闻</Link>
      </div>
      <div>
      	<Route path={`${props.match.path}/company`} component={CompanyNews} />
      	<Route path={`${props.match.path}/industry`} component={IndustryNews} />
      </div>
    </div>
  )
}

function CompanyNews() {
  return <div>公司新闻</div>
}
function IndustryNews() {
  return <div>行业新闻</div>
}
```

### 3. 路由传参

```jsx
import url from 'url';
class News extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [{
        id: 1,
        title: '新闻1'
      }, {
        id: 2,
        title: '新闻2'
      }]
    }
  }

  render() {
    return (
      <div>
        <div>新闻列表组件</div>
        <ul>
          this.state.list.map((item, index) => {
            return (
              <li key={index}>
                <Link to={`/detail?id=${item.id}`}>{item.title}</Link>
              </li>
          	)
          })
        </ul>
      </div>
    );
  }
}
class Detail extends Component {
  constructor(props) {
    super(props);
  }
  const { query } = url.parse(this.props.location.search, true);
  console.log(query); // {id: 1}
  render() {
    return <div>新闻详情</div>
  }
}
```

### 4. 路由重定向

```jsx
import { Redirect } from 'react-router-dom';

class Login extends Component {
  render() {
    if (this.state.isLogin) {
      return <Redirect to="/"/>
    }
  }
}
```

