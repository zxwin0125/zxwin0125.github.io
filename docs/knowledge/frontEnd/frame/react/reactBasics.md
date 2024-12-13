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

## 