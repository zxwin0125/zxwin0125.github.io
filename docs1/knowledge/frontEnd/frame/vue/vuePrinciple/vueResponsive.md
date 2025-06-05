---
title: 模拟 Vue 响应式原理
star: true
category:
	- Vue
order: 3
---

## 学习目的

- 了解响应式原理，从原理层面解决实际项目中的问题
  1. 给 Vue 实例新增一个成员是否是响应式的？
  2. 给属性重新赋值成对象，是否是响应式的？
- 学习 Vue 响应式原理，为学习 Vue 源码做铺垫

## 数据驱动

> 数据响应式、双向绑定、数据驱动

### 1. 数据响应式

- 数据响应式中的「数据」，指的是数据模型，基于 Vue 开发时，数据模型就是普通的 JavaScript 对象
- 数据响应式的核心是：当修改数据时，视图会自动进行更新，避免了繁琐的 DOM 操作，提高开发效率
  - 对比 JQuery，JQuery 的使用就是进行 DOM 操作

### 2. 双向绑定

- 双向绑定指的是：当数据发生改变，视图会跟着改变，当视图发生改变，数据也随之改变
- 双向绑定的概念中，包含了数据响应式
  - 因为双向绑定包含视图变化，所以它针对的是可以和用户进行交互的表单元素
- 可以使用 v-model 在表单元素上创建双向数据绑定

### 3. 数据驱动

- 数据驱动就是一种开发的过程
- 它指的是：开发过程中只需要关注数据本身（即业务本身），不需要关心数据是如何渲染到视图（DOM）上的
- 它是 MVVM 框架 （如 Vue） 最独特的特性之一，因为主流的 MVVM 框架内部已经实现了「数据响应式」和「双向绑定」

## 数据响应式核心原理

> Vue 2.x 和 Vue 3.0 实现数据响应式的方式不同

### 1. Vue 2.x Object.defineProperty

> Vue2.x 的响应式原理基于 ES5 的 Object.defineProperty 实现的

- [官方文档](https://v2.cn.vuejs.org/v2/guide/reactivity.html#%E5%A6%82%E4%BD%95%E8%BF%BD%E8%B8%AA%E5%8F%98%E5%8C%96)

> [!important]
> 当你把一个普通的 JavaScript 对象传入 Vue 实例作为 data 选项， Vue 会遍历此对象所有的属性，并使用 Object.defineProperty 把这些属性全部转为 getter/setter<br>
> Object.defineProperty 是 ES5 中一个无法 shim（降级处理）的特性，这也就是 Vue 不支持 IE8 以及更低版本浏览器的原因

- [MDN - Object.defineProperty](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)

> [!warning]
> shim 指的是可以使用 es[x]-shim 使低版本浏览器可以使用 es[x] 的新特性<br>
> 一些特性无法 shim，例如 ES5 的 Object.defineProperty 和 ES6 的 Proxy

#### 1.1 数据劫持

> [!info]
> 数据劫持：访问或修改对象的某个属性时，除了执行基本的数据获取和修改操作之外，还基于数据的操作行为，以数据为基础去执行额外的操作

> [!info]
> Vue 的数据劫持：当访问或设置 Vue 实例的成员的时候，做一些干预操作
>
> - 例如修改 Vue 实例成员的值，将新的值渲染到 DOM，整个 DOM 操作不希望在赋值的时候手动去做，所以需要使用数据劫持

- 具体通过 Object.defineProperty 方法向 Vue 实例对象中添加具有 get/set 描述符的成员属性
- 语法：`Object.definePorperty(obj, prop, descriptor)`
- 当访问属性时调用 get（getter 访问器）方法，当修改属性值时，调用 set（setter 设置器）方法

```js
<input type="text" oninput="inputHandle(event)" />
<div id="app">
  hello
</div>
<script>
  {/* 表单输入事件，用于测试修改vm的属性，是否实现双向绑定 */}
  function inputHandle(e) {
    vm.msg = e.target.value // 触发set
    console.log(vm.msg) // 触发get
  }

  {/* 模拟 Vue 中的 data 选项 */}
  let data = {
    msg: 'hello'
  }

  {/* 模拟 Vue 实例 */}
  let vm = {}

  {/* 数据劫持：当访问或设置 vm 中的成员的时候，做一些干预操作 */}
  Object.defineProperty(vm, 'msg', {
    // 可枚举（可遍历）
    enumerable: true,
    // 可配置（可以delete删除，可以通过 defineProperty 重新定义）
    configurable: true,
    // 访问器：当获取值时执行
    get () {
      console.log('get: ', data.msg)
      return data.msg
    },
    // 设置器：当设置值时执行
    set (newValue) {
      console.log('set: ', newValue)
      if (newValue === data.msg) {
        return
      }
      // 更新数据的值
      data.msg = newValue
      // 数据更改，更新 DOM 的值
      document.querySelector('#app').textContent = data.msg
    }
  })
</script>
```

#### 1.2 多个属性的对象

- 当一个对象拥有多个属性，使用 Object.defineProperty 实现对这个对象的数据劫持，需要遍历对象中的每一个属性，为它们添加 getter/setter
- 可通过 Object.keys 获取所有属性，然后遍历

```js
msg：<input type="text" oninput="inputHandle(event, 'msg')" />
count：<input type="text" oninput="inputHandle(event, 'count')" />
<div id="app">
  <span class="msg">hello</span>
  <span class="count">10</span>
</div>
<script>
  {/* 表单输入事件，用于测试修改vm的属性，是否实现双向绑定 */}
  function inputHandle(e, key) {
    vm[key] = e.target.value // 触发set
    console.log(vm[key]) // 触发get
  }

  {/* 模拟 Vue 中的 data 选项 */}
  let data = {
    msg: 'hello',
    count: 10
  }

  {/* 模拟 Vue 实例 */}
  let vm = {}

  {/* 遍历 data 对象的所有属性 */}
  Object.keys(data).forEach(key => {
    Object.defineProperty(vm, key, {
      enumerable: true,
      configurable: true,
      get () {
        console.log('get: ', key, data[key])
        return data[key]
      },
      // 设置器：当设置值时执行
      set (newValue) {
        console.log('set: ', key, newValue)
        if (newValue === data[key]) {
          return
        }
        // 更新数据的值
        data[key] = newValue
        // 数据更改，更新 DOM 的值
        document.querySelector(`.${key}`).textContent = data[key]
      }
    })
  })
</script>
```

### 2. Vue 3 Proxy

> Vue 3 的响应式（数据劫持）是基于 ES6 新增的 Proxy（代理对象）实现的

- [MDN - Proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

> [!important]
> Proxy 监听的是对象，而非属性<br>
> 因此在把多个属性转化成 getter 或 setter 时，不需要循环遍历对象的全部属性

> [!warning]
> Proxy 是 ES6 新增，且不能被 polyfill 磨平，无法 shim，所以 IE 不支持，性能比 Object.defineProperty 高，速度快

#### 2.1 具体使用

- Proxy 是一个类，通过 new 创建一个代理对象 `new Proxy(target, handler)`
  - 访问和修改，操作的都是代理对象
- Proxy 构造函数接收两个参数:
  - target：被代理的对象
  - handler：包含一系列拦截器（函数）的对象
- 拦截器：执行代理行为的函数，Proxy 有13种拦截器
  - 当访问代理对象的属性时，执行 get 拦截器
  - 当修改代理对象的属性时，执行 set 拦截器

```js
msg：<input type="text" oninput="inputHandle(event, 'msg')" />
count：<input type="text" oninput="inputHandle(event, 'count')" />
<div id="app">
  <span class="msg">hello</span>
  <span class="count">10</span>
</div>
<script>
  {/* 表单输入事件，用于测试修改vm的属性，是否实现双向绑定 */}
  function inputHandle(e, key) {
    vm[key] = e.target.value // 触发set
    console.log(vm[key]) // 触发get
  }

  {/* 模拟 Vue 中的 data 选项 */}
  let data = {
    msg: 'hello',
    count: 10
  }

  {/* 模拟 Vue 实例 */}
  let vm = new Proxy(data, {
    // 拦截器：执行代理行为的函数

    // 访问代理对象(vm)的属性时执行
    get (target, key) {
      console.log('get: ', key, target[key])
      return target[key]
    },
    // 修改代理对象(vm)的属性时执行
    set (target, key, newValue) {
      console.log('set: ', key, newValue)
      if (newValue === target[key]) {
        return
      }
      // 更新数据的值
      target[key] = newValue
      // 数据更改，更新 DOM 的值
      document.querySelector(`.${key}`).textContent = newValue
    }
  })
</script>
```

> [!important]
> 可以看到，Proxy 设置数据劫持，比 Object.defineProperty 简洁的多，并且由于 Proxy 监听的是整个对象，所以对每个属性的访问修改，都会触发相应的拦截器，省去了遍历的工作

## 发布/订阅模式 和 观察者模式

> 发布/订阅模式 和 观察者模式 是两种设计模式，在 Vue 中有各自的应用场景，两种模式的本质是相同的，它们经常被混为一谈，但是二者是有区别的

### 1. 发布/订阅模式

- 订阅者、发布者、信号中心

> [!info]
> 假定存在一个「信号中心」<br>
>
> - 某个任务执行完成，就向信号中心「发布」（publish）一个信号<br>
> - 其他任务可以向信号中心「订阅」（subscribe）这个信号，从而知道什么时候自己可以开始执行<br>
>   这就叫做「发布/订阅模式」（publish-subscribe pattern）

- Vue 中的自定义事件以及 node 中的事件机制都是基于发布/订阅模式

#### 1.1 Vue 自定义事件

- 官方文档参考自定义事件如何使用
  1. 创建一个Vue实例
  2. 通过`$on`方法注册（订阅）自定义事件
  - 同一个事件可以注册多个处理函数
  3. 通过调用这个实例的$emit方法触发（发布）事件
  4. 通过`$off`方法取消注册（订阅）事件

```js
var vm = new Vue()
// 注册/订阅事件
vm.$on('dataChange', () => {
  console.log('dosomething')
})
vm.$on('dataChange', () => {
  console.log('dosomething2')
})
// 触发/发布事件
vm.$emit('dataChange')
```

#### 1.2 兄弟组件通信过程

> 通过 Vue 兄弟组件的通信过程，更清晰的认识 订阅者、发布者、信号中心（事件中心）

```js
// eventBus.js
// 事件中心 / 信息中心
let eventHub = new Vue()

// ComponentA.vue
// 发布者
methods: {
  // 发布一条待办消息
  addTodo: function () {
    // 发布消息（事件）
    eventHub.$emit('add-todo', { text: this.newTodoText })
    this.newTodoText = ''
  }
}

// ComponentB.vue
// 发布者
created: function () {
  // 订阅消息（事件）
  eventHub.$on('add-todo', this.renderTodoText)
},
methods: {
  // 把消息渲染到界面中
  renderTodoText(newTodoText) {
    // ...
  }
}
```

#### 1.3 模拟 Vue 自定义事件（发布订阅）的实现

- 首先分析 Vue 自定义事件如何实现：
  1. 创建 Vue 实例：vm
  2. `$on`注册事件（订阅消息）
  - `$on`仅仅注册事件，事件处理函数并不立即执行
  - 所以 vm 中需要定义内部的变量，用于存储注册的事件成以及事件处理函数
    - 注册的时候可以注册多个事件名称，也可以给同一个事件注册多个事件处理函数
    - 存储事件的时候，要记录所有的事件名称，以及对应的处理函数，即键值对的形式
    - 例如：`{ 'click': [fn1, fn2], 'change': [fn3] }`
  3. `$emit`触发事件（发布消息）
  - `$emit`接收的第一个参数是事件的名称
  - 内部通过事件的名称，去存储事件的对象中寻找对应的事件处理函数，依次执行

```js
// 事件触发器
class EventEmitter {
  constructor() {
    // subs 存储事件及处理函数
    // { 'click': [fn1, fn2], 'change': [fn3] }
    // this.subs = {}

    // 使用Object.create(null)创建的对象没有原型属性
    // 因为subs只需要存储键值对形式的数据，不需要原型
    // 使用Object.create(null)可以提高性能
    this.subs = Object.create(null)
  }

  // 注册事件
  $on(eventType, handler) {
    this.subs[eventType] = this.subs[eventType] || []
    this.subs[eventType].push(handler)
  }

  // 触发事件
  $emit(eventType, ...args) {
    if (this.subs[eventType]) {
      this.subs[eventType].forEach(handler => {
        handler.apply(this, args)
      })
    }
  }
}

// 测试

// 创建一个事件中心
let em = new EventEmitter()

// 订阅
em.$on('click', msg => {
  console.log('click1', msg)
})
em.$on('click', msg => {
  console.log('click2', msg)
})

// 发布
em.$emit('click', '触发事件')
// click1 触发事件
// click2 触发事件
```

### 2. 观察者模式

- 观察者模式 和 发布订阅模式 的区别是：
  1. 没有事件中心
  2. 只有发布者和订阅者
  3. 并且发布者需要知道订阅者的存在

> [!info]
> 观察者模式：定义对象间一种一对多的依赖（Dependency）关系，使得每当一个对象改变状态，则所有依赖于它的对象都会得到通知并被自动更新

- 观察者（订阅者） - Watcher
  - 所有的订阅者自身都有一个 update 方法
  - update()：当事件发生时，具体要做的事情
    - 在 Vue 响应式中，当数据放生变化时，会调用订阅者的 update 方法
    - Vue 中订阅者的 update 方法内部就是更新视图
  - 观察者模式中，订阅者的 update 方法是由发布者调用的
- 目标（发布者）- Dep(Dependency 缩写：依赖)
  - 当事件发生的时候，是由发布者去通知所有订阅者
  - 发布者包含以下属性：
    - subs[]：存储所有订阅者的数组
      - 所有依赖该事件的订阅者，都需要添加到subs数组中
    - addSub()：用于添加观察者的方法
    - notify()：当事件发生，调用所有观察者的 update() 方法
  - 命名 Dep 原因：Vue 响应式机制中，内部使用的「Dep」单词
- 模拟一个观察者模式（未考虑 update 传参）

```js
// 发布者 - 目标
// Vue 响应式机制中内部使用的“Dep”命名
class Dep {
  constructor() {
    // 记录所有的订阅者
    this.subs = []
  }
  // 添加订阅者
  addSub(sub) {
    // 确保这是一个拥有 update 方法的订阅者对象
    if (sub && sub.update) {
      this.subs.push(sub)
    }
  }
  // 发布通知
  notify() {
    this.subs.forEach(sub => {
      sub.update()
    })
  }
}

// 订阅者 - 观察者
class Wathcer {
  // 当事件发生时，由发布者调用update方法
  // update内部可以更新视图或做一些其他操作
  update() {
    console.log('update')
  }
}

// 测试
let dep = new Dep()
let watcher = new Wathcer()
let watcher2 = new Wathcer()

dep.addSub(watcher)
dep.addSub(watcher2)

dep.notify()
```

### 3. 发布/订阅模式 和 观察者模式 的区别

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/img/Frame/Vue/04.png)

#### 3.1 观察者模式

- 当目标对象数据发生变化（事件发生）时，目标对象（发布者）会调用它的 notify 方法
- notify 方法会通知所有的观察者（订阅者），调用观察者（订阅者）的 update 方法，处理各自的业务
- 所以如果对目标对象的变化有兴趣，就要调用目标对象的 addSub 方法，把自己订阅到目标对象里
- 目标对象内部记录了所有的观察者
- 目标对象（发布者）和观察者（订阅者）之间存在相互依赖的关系

#### 3.2 发布订阅模式

- 发布订阅模式中多了一个「事件中心」，通过「事件中」隔离了 发布者 和 订阅者
- 结合兄弟组件的传值来理解，假设发布者 和 订阅者 分别是两个不相关的组件（发布者：组件A，订阅者：组件B）
  - 组件A的作用是添加待办事项，组件B的作用是把新增的待办事项渲染到页面
    - 当组件A中新增了一个待办事项，会发布一个事件（命名为 add），此时会调用 事件中心 的 `$emit` 方法，触发 add 事件
    - `$emit` 方法中会找到事件中心中注册的 add 事件对应的处理函数并执行
  - 而事件处理函数是由组件B提供的
  - 组件B想要知道 add 事件是否发生了变化，就需要通过`$on`方法订阅事件中心的 add 事件
- 事件中心的作用是 隔离订阅者和发布者，去除它们之间的依赖

#### 3.3 总结

- 观察者模式 是由具体目标调度，比如当事件触发，Dep 就会去调用观察者的方法，所以观察者模式的订阅者与发布者之间是存在依赖的
- 发布/订阅模式 由统一调度中心调用，因此发布者和订阅者不需要知道对方的存在，减少二者依赖关系，这样会变得更灵活

## 模拟 Vue 的响应式原理

### 1. 整体分析

- 准备工作
  - 回顾 Vue 的基本结构，以及要模拟实现的功能
  - 打印 Vue 实例观察要模拟 Vue 中的哪些成员
  - 整理要模拟的最小版本的 Vue 的整体结构

```js
<div id="app">
  <h1>插值表达式</h1>
  <h3>{{ msg }}</h3>
  <h3>{{ count }}</h3>

  <h1>指令</h1>
  <h2>v-text</h2>
  <div v-text="msg"></div>
  <h2>v-model</h2>
  <input type="text" v-model="msg">
  <input type="text" v-model="count">
</div>

<script src="https://cdn.jsdmirror.com/npm/vue/dist/vue.js"></script>
<script>
  let vm = new Vue({
    el: '#app',
    data: {
      msg: 'Hello Vue',
      count: 20
    }
  })
</script>
```

#### 1.1 回顾 Vue 的基本结构

1. 首先调用了 Vue 的构造函数

- 该构造函数接收一个对象参数
- 对象中设置了 el 和 data
  - el：设置了一个选择器
  - data：使用的一些数据

2. 然后在模板中，通过插值表达式、v-text、v-model 进行绑定数据

#### 1.2 打印 Vue 实例观察

##### 1.2.1 data

- 打印发现 Vue 实例中除了包含 msg 和 count 外，还包含它们对应的 getter（get msg、get count） 和 setter(set msg 、set count)
- 这是通过 Object.definePorperty 设置了 get 和 set 的效果，打印它们的描述符

```js
// msg 的描述符
{
  configurable: true,
  enumerable: true,
  get: proxyGetter,
  set: proxySetter
}
```

- 所以 Vue 构造函数内部需要把 data 中的成员转换成 getter 和 setter 注入到 Vue 实例上
- 这样做的目的是，在其他地方使用的时候，可以直接通过 this.msg 和 this.count 使用

##### 1.2.2 $data

- 接着看到 data 中的成员被记录到了`$data`属性中，并且也传换成了 getter 和 setter

```js
// $data.msg 的描述符
{
  configurable: true,
  enumerable: true,
  get: reactiveGetter,
  set: reactiveSetter
}
```

- `$data`中的 setter 是真正监视数据变化的地方

##### 1.2.3 $options

- `$options`可以简单认为把构造函数的参数记录到了这个属性中

##### 1.2.4 \_data

- `_data`和`$data`指向的是同一个对象
- 下划线\_开头的是私有成员，$开头的是公共成员
- 这里只需要模拟`$data`即可

##### 1.2.5 $el

- `$el`对应选项中的 el 设置的 DOM 对象
- 设置 el 选项的时候，可以是一个选择器，也可以是一个 DOM 对象
- 如果是一个选择器，Vue 构造函数内部会把这个选择器转换成相应的DOM对象

##### 1.2.6 总结要实现的属性

- 最小版本的 Vue 中要模拟 vm(Vue 实例)中的成员：
  - $data
  - $el
  - $options
  - 把 data 中的成员注入到 vm 中

#### 1.3 整体结构

- 模拟的最小版本的 Vue 由下面5个类组成

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/img/Frame/Vue/05.png)

- Vue
  - 创建一个 Vue 实例
  - 把 data 中的成员转换成 getter/setter，并注入到 Vue 实例
  - Vue 内部会调用 Observer 和 Compiler
- Observer：作用是数据劫持
  - 能够对数据对象的所有属性进行监听，如有变动可拿到最新值并通知Dep
- Compiler：
  - 解析每个元素中的指令/插值表达式，并替换成相应的数据
- Dep：观察者模式中的目标
  - 添加观察者
  - 当数据发生变化的时候，通知所有的观察者
- Watcher：观察者模式中的观察者
  - 内部有 update 方法，用于更新视图

### 2. Vue 类

#### 2.1 功能

- 构造函数接收初始化的对象参数
- 负责把 data 中的属性转换成 getter/setter，注入到 Vue 实例
- 负责调用 observer 对象监听 data 中所有属性的变化
  - 当属性变化的时候，更新视图
- 负责调用 compiler 解析指令/插值表达式

#### 2.2 结构

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/img/Frame/Vue/06.png)

- `_proxyData()`：私有成员
  - 把 data 中的属性转换成 getter/setter，注入到 Vue 实例

#### 2.3 代码

```js
// js/vue.js
class Vue {
  constructor(options) {
    // 1. 通过属性保存选项的数据
    this.$options = options || {}
    this.$data = options.data || {}
    this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el

    // 2. 把 data 中的成员转换成 getter/setter 注入到Vue实例中
    this._proxyData(this.$data)

    // 3. 调用 observer 对象，监听数据的变化

    // 4. 调用 compiler 对象，解析指令和插值表达式
  }

  _proxyData(data) {
    // 遍历 data 中的所有属性
    // 注意遍历回调内部需要使用vue实例，所以这里使用箭头函数，使this指向vue实例
    Object.keys(data).forEach(key => {
      // 把 data 中的属性注入到 Vue 实例中
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get() {
          return data[key]
        },
        set(newValue) {
          if (data[key] === newValue) {
            return
          }
          data[key] = newValue
        }
      })
    })
  }
}
```

```html
<!-- index.html -->
<div id="app">
  <h1>插值表达式</h1>
  <h3>{{ msg }}</h3>
  <h3>{{ count }}</h3>

  <h1>指令</h1>
  <h2>v-text</h2>
  <div v-text="msg"></div>
  <h2>v-model</h2>
  <input type="text" v-model="msg" />
  <input type="text" v-model="count" />
</div>

<script src="./js/vue.js"></script>
<script>
  let vm = new Vue({
    el: '#app',
    data: {
      msg: 'Hello Vue',
      count: 20
    }
  })

  console.log(vm)
</script>
```

### 3. Observer 类

#### 3.1 功能（数据劫持）

- 负责把 data 选项中的属性转换成响应式数据（getter/setter）
- 如果 data 中的某个属性也是对象，把该属性转换成响应式数据
- 数据变化发送通知

#### 3.2 结构

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/img/Frame/Vue/07.png)

- Observer 类中有两个方法（方法名与 Vue 源码中一致）：
  - walk
    - 遍历 data 中的所有属性，调用 defineReactive
  - defineReactive
    - 定义响应式数据，通过调用 defineProperty 将属性转换成 getter/setter

#### 3.3 代码

```js
class Observer {
  constructor(data) {
    this.walk(data)
  }

  walk(data) {
    // 1. 判断data是否是空值或对象
    if (!data || typeof data !== 'object') {
      return
    }

    // 2. 遍历data对象的所有属性
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key])
    })
  }

  defineReactive(obj, key, val) {
    // 注意获取和设置属性的值，使用的是参数 val
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        // return obj[key] // 死递归
        return val
      },
      set(newValue) {
        if (val === newValue) {
          return
        }
        val = newValue
        // 发送通知
      }
    })
  }
}
```

```js
class Vue {
  constructor(options) {
    // ...

    // 3. 调用 observer 对象，监听数据的变化
    new Observer(this.$data)

    // 4. 调用 compiler 对象，解析指令和插值表达式
  }
  // ...
}
```

```html
<script src="./js/observer.js"></script>
<script src="./js/vue.js"></script>
<script>
  let vm = new Vue({
    el: '#app',
    data: {
      msg: 'Hello Vue',
      count: 20
    }
  })
  console.log(vm.msg)
</script>
```

#### 3.4 相关问题

> [!warning]
> 为什么向 defineReactive 传递一个 val 参数，并在 getter/setter 中使用它，而不是使用 obj[key]？<br>
> 这是因为当访问 vm.msg 时：
>
> 1. 会首先触发 Vue 类中 \_proxyData 方法转化的 msg 属性的 getter 方法
> 2. getter 方法最后 return 的 data[key]，其中 data 指向的 this.$data
> 3. 此时就又会调用 Observer 类中，defineReactive 方法转化 this.$data 的属性时，定义的 getter 方法
> 4. 而假如这个方法返回的是 obj[key]，此时 obj 同样指向的 this.$data，就又会触发这个 getter 方法
> 5. 如此就会造成「死递归」，所以这里需要使用一个 val 变量存储 this.$data.msg 的值

- 问题完善
  - 当前定义的 Observer 只会将 data 中的属性转化成响应式数据（getter/setter）
  - 当 data 中的属性的值也是一个对象时，这个对象中的属性并没有被转换成响应式数据（getter/setter）
  - 所以需要修改一下 defineReactive，使 data 中的对象类型的属性，内部也是响应式的
  - 只需要在一开始，调用一个 walk，walk 内部会判断如果属性是对象，就执行遍历转化

> [!warning]
> defineReactive 方法中接收的 value 参数为什么没有在方法执行完后释放？<br>
> 因为 defineReactive 方法内部转化 obj 的属性时，设置了 getter/setter 方法，这些方法内部使用了 val，这样就行成了闭包，扩展了 val 的作用域，所以 val 不会被释放

- 问题完善
  - 如果将 data 中的属性，重新赋值为一个对象，该对象内部的属性也应该是响应式的
  - 所以需要在触发 this.$data 中属性的 setter 方法时，调用 walk 方法转化新值，它会判断新的值是否是对象，如果是则转化

#### 3.5 问题总结

1. 如果 data 中的某个属性是对象，把这个对象内部的属性转化成响应式数据
2. 当 data 的当前属性重新赋值为一个新对象时，该对象内部的属性也要转化成响应式数据

```js
defineReactive(obj, key, val) {
  let that = this

  // 如果 val 是对象，把 val 内部的属性转换成响应式数据
  this.walk(val)

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get () {
      // return obj[key] // 死递归
      return val
    },
    set (newValue) {
      if (val === newValue) {
        return
      }
      val = newValue
      that.walk(newValue)
      // 发送通知
    }
  })
}
```

```html
<!-- index.html -->
<script>
  let vm = new Vue({
    el: '#app',
    data: {
      msg: 'Hello Vue',
      count: 20,
      person: {
        name: 'Tom',
        info: {
          age: 18
        }
      }
    }
  })
  console.log(vm.person)
  vm.msg = { test: 'Yeah' }
  console.log(vm)
</script>
```

### 4. Compiler 类

#### 4.1 功能（操作DOM）

- 负责编译模板，解析指令/插值表达式
- 负责页面的首次渲染
- 当数据变化后重新渲染视图

#### 4.2 结构

- 当前模拟直接操作 DOM，没有使用虚拟 DOM

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/img/Frame/Vue/08.png)

#### 4.3 属性

- el：Vue 构造函数传入的 el 表示的 DOM 对象
- vm：Vue 的实例，后续方法需要用到 Vue 实例中的数据，所以在此记录下来方便调用

#### 4.4 方法

> 一系列 DOM 操作的方法

- compile(el)
  - el：DOM 对象
  - 方法内部遍历 DOM 对象的多有节点，并判断：
    - 文本节点（isTextNode）：解析插值表达式(compileText)
    - 元素节点（isElementNode）：解析指令(compileElement)
- isTextNode(node)：判断是否是文本节点
- isElementNode(node)：判断是否是元素节点
- compileText(node)：解析插值表达式
- compileElement(node)：解析指令，内部调用 isDirective 判断指令
- isDirective(attrName)：判断属性是否是指令

#### 4.5 DOM 操作

- node.childNodes - 获取当前节点子节点
  - 它是一个伪数组，可以用 Array.from 转换成数组进行遍历
- node.nodeType - 判断节点类型
  - 1 - 元素节点
  - 2 - 属性节点（node.attributes 中存在）
  - 3 - 文本节点
- node.textContent - 节点的文本
- node.nodeValue - 节点的值
  - 文本节点的值 同 textContent
  - 元素节点的值 是 undefined 或 null
  - 属性节点的值 是 属性的值
- node.attributes - 获取节点的所有属性
  - 它是一个伪数组，可以用 Array.from 转换成数组进行遍历
  - 属性节点的 name：属性的名称
  - 属性节点的 value：属性的值

#### 4.6 代码

```js
class Compiler {
  constructor(vm) {
    this.el = vm.$el
    this.vm = vm
    this.compiler(this.el)
  }
  // 编译模板，处理文本节点和元素节点
  compiler(el) {
    let childNodes = el.childNodes
    // childNodes是一个伪数组，通过Array.from将其转化为数组
    Array.from(childNodes).forEach(node => {
      if (this.isElementNode(node)) {
        // 处理元素节点
        this.compileElement(node)
      } else if (this.isTextNode(node)) {
        // 处理文本节点
        this.compileText(node)
      }
      // 判断如果有node有子节点，递归调用compiler编译子节点
      if (node.childNodes && node.childNodes.length > 0) {
        this.compiler(node)
      }
    })
  }
  // 编译元素节点，处理指令
  compileElement(node) {
    // 遍历所有的属性节点
    Array.from(node.attributes).forEach(attr => {
      // 判断是否是指令
      let attrName = attr.name
      if (this.isDirective(attrName)) {
        // v-text --> text
        attrName = attrName.substr(2)
        let key = attr.value
        this.update(node, key, attrName)
      }
    })
  }
  update(node, key, attrName) {
    let updateFn = this[attrName + 'Updater']
    updateFn && updateFn(node, this.vm[key])
  }
  // 处理v-text指令
  textUpdater(node, value) {
    // 更新节点文本
    node.textContent = value
  }
  // 处理v-model指令
  modelUpdater(node, value) {
    // 更新表单元素的值
    node.value = value
  }
  // 编译文本节点，处理指令
  compileText(node) {
    // console.log(node)
    // console.dir会将内容以对象形式打印
    // console.dir(node)

    // {{  msg }}
    let reg = /\{\{(.+?)\}\}/
    let value = node.textContent
    if (reg.test(value)) {
      let key = RegExp.$1.trim()
      node.textContent = value.replace(reg, this.vm[key])
    }
  }
  // 判断元素属性是否是指令
  isDirective(attrName) {
    return attrName.startsWith('v-')
  }
  // 判断节点是否是元素节点
  isElementNode(node) {
    return node.nodeType === 1
  }
  // 判断节点是否是文本节点
  isTextNode(node) {
    return node.nodeType === 3
  }
}
```

```js
// js/vue.js
constructor (options) {
  // ...

  // 4. 调用 compiler 对象，解析指令和插值表达式
  new Compiler(this)
}
```

### 5. Dep(Dependency) 类

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/img/Frame/Vue/09.png)

- Dep：目标 / 依赖 / 发布者

#### 5.1 功能

- Dep 类的作用是在 getter 方法中收集依赖，每个响应式的属性，最终都会创建一个对应的 Dep 对象
- 它负责收集所有依赖于该属性的地方，所有依赖该属性的位置，都会创建一个 Watacher 对象，所以 Dep 收集的就是依赖于该属性的 Watcher 对象
- setter 方法中会通知依赖，当属性发生变化，会调用 Dep 对象的 notify 发送通知，进而调用 Watcher 对象的 update 方法
- 总结，Dep 的作用就是：
  - 在 getter 中收集依赖 - 添加观察者
  - 在 setter 中通知依赖 - 通知观察者

#### 5.2 结构

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/img/Frame/Vue/10.png)

- subs - 存储所有 Watcher 的数组
- addSub - 添加观察者 Watcher
- notify - 通知观察者

#### 5.3 代码

```js
class Dep {
  constructor() {
    // 存储所有的观察者
    this.subs = []
  }
  // 添加观察者
  addSub(sub) {
    if (sub && sub.update) {
      this.subs.push(sub)
    }
  }
  // 发送通知
  notify() {
    this.subs.forEach(sub => {
      sub.update()
    })
  }
}
```

```js
defineReactive(obj, key, val) {
  let that = this
  // 负责收集依赖，并发送通知
  let dep = new Dep()

  this.walk(val)

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get () {
      // 收集依赖
      // Dep.target指向的是一个观察者，在实例化Watcher对象时定义这个静态属性
      Dep.target && dep.addSub(Dep.target)

      return val
    },
    set (newValue) {
      if (val === newValue) {
        return
      }
      val = newValue
      that.walk(newValue)
      // 发送通知
      dep.notify()
    }
  })
}
```

- Dep 类中并没有定义 target 这个静态属性，这个属性是在 Watcher 类中定义的，它用来向 dep 对象的 subs 中添加观察者对象

### 6. Watcher 类

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/img/Frame/Vue/11.png)

- 在 Data 属性的 getter 方法中，通过 Dep 对象收集依赖，在 Data 属性的 setter 方法中，通过 Dep 对象触发依赖，所以 Data 中的每个属性都要创建一个对应的 Dep对象
- 在收集依赖的时候，把依赖该数据的所有 Watcher（观察者对象）添加到 Dep 对象的 subs 数组中
- 在 setter方法中，触发依赖（发送通知），会调用 Dep 的 notify 方法，通知所有关联的 Watcher 对象，Watcher 对象负责更新对应的视图

#### 6.1 功能

- 更新视图
  - 当数据发生变化触发依赖，dep 通知所有的 Watcher 实例更新视图
- 实例化一个 Watcher 对象时，内部将自己添加到 dep 对象的 subs 数组中
  - 通过将自身记录到 Dep 的 target 静态属性中
  - 然后再访问 data 的属性，触发 getter 方法
  - getter 方法中判断 Dep.target 是否记录了一个 Watcher 对象，如果记录了就添加到属性对应的 dep 对象的依赖列表（subs）中
  - 最后重置这个属性为 null，防止重复添加

#### 6.2 结构

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/img/Frame/Vue/12.png)

- update - 更新视图
  - 不同的 Watcher 对象更新视图所作的事情是不一样的
  - 所以需要一个存储如何更新视图的变量 cb
- cb - callback 回调函数
  - 当创建一个 Watcher 对象的时候，需要传入一个回调函数
  - 这个函数中用于指明如何更新视图
- key - data 中的属性名，更新视图需要数据，通过key获取数据
- vm - Vue 实例，用于获取数据
- oldValue - 记录数据变化之前的值
  - update 触发时，内部可以获取数据最新的值
  - 对比新旧值，如果数据发生变化，调用 cb 更新视图

#### 6.3 代码

```js
class Watcher {
  constructor(vm, key, cb) {
    // vue实例
    this.vm = vm
    // data中的属性名称
    this.key = key
    // 回调函数，负责更新视图
    this.cb = cb

    // 把 watcher对象记录到Dep类的静态属性target中
    Dep.target = this
    // 触发get方法，在get方法中会调用addSub
    this.oldValue = vm[key]
    // 添加完后重置target，防止重复添加
    Dep.target = null
  }
  // 当数据发生变化的时候，更新视图
  update() {
    // 调用update时数据已经发生变化，直接获取就是最新的值
    let newValue = this.vm[this.key]
    if (newValue === this.oldValue) {
      return
    }
    this.cb(newValue)
  }
}
```

#### 6.4 在何处创建 watcher 对象

- Watcher 的作用之一是，当数据改变的时候更新视图
- 数据改变发送通知，是在 Observer 中的 setter 方法中通过调用 dep 对象的 notify 方法实现
  - notify 方法中会遍历所有的 watcher 对象，调用它们的 update 方法
  - update 内部是通过调用 cb 回调函数来更新视图的
  - cb 函数是在 Watcher 构造函数中传递的（创建 watcher 对象时）
- 更新视图其实就是操作 DOM，而所有的 DOM 操作都在 Compiler 中
  - 在 Complier 中找到把数据渲染到 DOM 的位置，即：
    - compileText - 处理插值表达式的位置
    - compileElement（textUpdater、modelUpdater） - 处理指令的位置
  - 这3个方法都是最终把数据更新到 DOM 元素上，这3个方法都是在页面首次加载的时候执行的
- 指令和插值表达式都是依赖于数据的，而所有视图中依赖数据的位置，都应该创建一个 watcher 对象
  - 当数据发生改变的时候，dep 对象会通知所有的 watcher 对象，重新渲染视图
  - 所以要在这3个方法中创建 watcher 对象

##### 6.4.1 调整代码

```js
update (node, key, attrName) {
  let updateFn = this[attrName + 'Updater']
  updateFn && updateFn.call(this, node, this.vm[key], key)
}
// 处理v-text指令
textUpdater (node, value, key) {
  // 更新节点文本
  node.textContent = value
  new Watcher(this.vm, key, newValue => {
    node.textContent = newValue
  })
}
// 处理v-model指令
modelUpdater (node, value, key) {
  // 更新表单元素的值
  node.value = value
  new Watcher(this.vm, key, newValue => {
    node.value = newValue
  })
}
// 编译文本节点，处理指令
compileText (node) {
  let reg = /\{\{(.+?)\}\}/
  let value = node.textContent
  if (reg.test(value)) {
    let key = RegExp.$1.trim()
    node.textContent = value.replace(reg, this.vm[key])

    // 创建watcher对象，当数据改变更新视图
    new Watcher(this.vm, key, newValue => {
      node.textContent = newValue
    })
  }
}
```

##### 6.4.2 调整的位置

1. 在3个方法先创建 watcher 对象，并传入 vue 实例、属性名、更新视图用的回调方法
2. 调整处理元素节点的 Updater 方法

- 增加属性名参数 key
- 改变指向为当前 compiler 对象，用于 Updater 内部通过 this 获取 vue 实例

```html
<!-- watcher中依赖dep，所以dep应该先于watcher引入 -->
<script src="./js/dep.js"></script>
<script src="./js/watcher.js"></script>
<script src="./js/compiler.js"></script>
<script src="./js/observer.js"></script>
<script src="./js/vue.js"></script>
<script>
  let vm = new Vue({
    el: '#app',
    data: {
      msg: 'Hello Vue',
      count: 20,
      person: {
        name: 'Tom',
        info: {
          age: 18
        }
      }
    }
  })
  console.log(vm)

  setTimeout(() => {
    vm.msg = '变更后的msg'
  }, 1000)
</script>
```

### 7. 双向绑定

- 以上代码实现了，改变 vue 的数据改变时更新视图
- 但是更新表单元素的值，并没有更新绑定的 vue 中的数据，即双向绑定

> [!warning]
> 双向绑定机制包括两点
>
> 1. 数据发生变化，更新视图（数据响应式，已实现）
> 2. 视图发生变化，更新数据

- 实现方法：
  - 当文本框内容发生变化时，触发一个事件（Vue 中使用的是 input 事件）
  - 当 input 事件发生的时候，要把文本框的值取出来，重新赋给绑定的 vm 的属性
  - 也就是给包含 v-model 指令的文本框元素绑定 input 事件

```js
// js/compiler.js
// 处理v-model指令
modelUpdater (node, value, key) {
  // 更新表单元素的值
  node.value = value
  new Watcher(this.vm, key, newValue => {
    node.value = newValue
  })
  // 双向绑定
  node.addEventListener('input', () => {
    this.vm[key] = node.value
  })
}
```

- 以上就实现了双向绑定：
  1. 当文本框的内容发生变化，会触发 input 事件
  2. input 事件处理函数中，把文本框的值取出来，并重新赋值给 vm[key]
  3. 当给 vm[key] 赋值时，又会触发响应式机制
  4. 响应式机制的工作就是触发 setter 方法，setter 中向所有依赖这个属性的 watcher 发送通知
  5. watcher 的 update 被调用，更新视图中使用了这个属性的所有节点

### 8. 调试

- 开发人员工具 - Sources-调试快捷键：
  - F8 - 直接跳到下一个断点
  - F10 - 单步执行，遇到子函数并不进去，将子函数执行完并将其作为一个单步
  - F11 - 单步执行，遇到子函数就进去继续单步执行
  - F9 - 似乎等效于 F11
  - Shift + F11 - 直接跳出当前函数，返回父函数
- 添加断点
  - 点击代码行号
- 删除断点：
  - 删除单个断点：点击断点
  - 删除全部断点：Breakpoints 中删除
- 查看断点：
  - 右侧查看 Breakpoints
    - 复选框：可以禁用/开启断点
    - 点击断点下的代码快速跳到断点处代码
    - 删除全部断点：右键-remove all breakpoints

### 9. 新增属性是否是响应式

- 上面代码的实现中已知，当给一个 vm 中 data 的属性重新赋值为一个对象时，会触发这个属性的 setter 方法
- setter 方法内部调用 walk 方法将新赋予的这个对象及对象下的属性转化为响应式
- 但如果给 vm 添加一个新的属性时，这个属性并没有转化为响应式
- 因为将 vm 中 data 的属性转化为响应式是在 new 初始化 vue 实例的时候，所以新增属性并不会被转化
- Vue官方文档提供了如果将新增的属性转化成响应式数据的方法

> [!warning]
> 对于已经创建的实例，Vue 不允许动态添加根级别的响应式 property<br>
> 但是，可以使用 Vue.set(object, propertyName, value) 方法向嵌套（下一级）对象添加响应式 property

```js
// 静态访问方法
Vue.set(vm.someObject, 'b', 2)
// or
// 实例方法
this.$set(this.someObject, 'b', 2)
```

- 可以推测到，Vue.set 方法内部使用了 Object.defineProperty 将属性 b 转换成了 getter/setter

### 10. 总结

- 通过下图回顾整体流程

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/img/Frame/Vue/12.png)

1. 创建 Vue 对象，构造函数中做的事情：

- 记录 options 传过来的选项
- 调用 proxyData 将 data 中的属性转化为 getter/setter，并注入到实例中
- 创建 Observer，作用：数据劫持
  - 它将 data 中的属性转化为 getter/setter
    - 当数据变化的时候（setter），调用 dep 对象的 notify 通知变化
      - notify 内部发送通知：调用 watcher 的 update
        - watcher 的 update 内部实现更新视图
- 创建 Compiler，作用：解析模板
  - 页面首次加载时，调用 compiler 方法，在具体更新视图的方法中的工作
    - 更新视图
    - 创建 watcher
      - 订阅数据变化
        - watcher 实例化时会将自己添加到 dep 对象的 subs（依赖/订阅者）列表中
      - 绑定更新函数 cb
        - 在 update 方法中被调用
- 当页面首次加载时，通过 compiler 更新视图
- 当数据发生变化时，通过 watcher 更新视图
