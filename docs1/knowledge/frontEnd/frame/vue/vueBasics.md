---
title: 基础回顾
order: 1
---

## Vue.js 基础结构

- 这是最基础一段 Vue 代码，在创建 Vue 实例的时候，传入了 el 和 data 选项
- Vue 内部会把 data 中的数据填充到 el 指向的模版中，并把模版渲染到浏览器

```html
<div id="app">
  <p>名字：{{ person.name }}</p>
  <p>年龄：{{ person.age }}</p>
</div>
<script src="https://csn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<script>
  new Vue({
    el: '#app',
    data: {
      person: {
        name: '张三',
        age: 18
      }
    }
  })
</script>
```

- 再来看一段代码，这段代码执行效果和上面一样
- 这里使用 render 选项和 $mount 方法
- 我们使用 Vue-cli 脚手架创建的项目和这段代码结构是一样的

> [!important]
> render 方法接收一个参数，这个参数是 h 函数
> - h 函数的作用是创建虚拟 DOM
> - render 方法把 h 函数创建的虚拟 DOM 返回
> - $mount 方法把虚拟 DOM 转换成真实 DOM 渲染到浏览器

```html
<div id="app"></div>
<script src="https://csn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<script>
  new Vue({
    data: {
      person: {
        name: '张三',
        age: 18
      }
    },
    render(h) {
      return h('div', [
        h('p', '名字：' + this.person.name),
        h('p', '年龄：' + this.person.age),
      ])
    }
  }).$mount('#app')
</script>
```

## Vue.js 生命周期

> [!important]
> 在创建 Vue 实例的过程中会发生很多事情
> 1. 初始化事件、生命周期相关的成员，包括 h 函数都是在这个位置初始化的
> 2. 触发生命周期中 beforeCreate 钩子函数
> 3. 初始化注入操作，把 props、data、methods 等成员注入到 Vue 的实例上
> 4. 触发 created 钩子函数，可以访问到 props、data、methods 等成员

> [!important]
> 创建 Vue 实例过后，进行模版编译
> 1. 判断选项中是否设置了 el 选项，如果没有设置 el 选项，就调用 $mount 方法，$mount 方法就是把 el 转换为模版 template，之后把模版编译成 render 函数
> 2. 判断是否设置模版 template，如果没有设置模版 template，会把 el 元素的外层 HTML 作为模版，然后把 template 模版编译到渲染函数中，渲染函数就是用来生成虚拟 DOM 的

> [!important]
> 如何挂载 DOM
> 1. 触发 beforeMount 钩子函数，DOM 挂载之前执行的钩子函数，这个函数中无法获取新元素的内容
> 2. 准备挂载 DOM，把新的结构渲染到页面上，再触发 mounted 钩子函数，这个函数可以访问到新的 DOM 结构中的内容，DOM 挂载完毕

> [!important]
> 更新 DOM
> 1. DOM 挂载完毕后，修改 data 中成员的时候，触发 beforeUpdate 钩子函数，在这个函数中，如果直接访问浏览器中的渲染内容，还是上一次的结果
> 2. 进行新旧虚拟 DOM 对比，把差异重新渲染到浏览器中
> 3. 触发 updated 钩子函数，这个函数中可以获取页面最新的结果

> [!important]
> 销毁 DOM
> 1. 调用 vm.$destroy 这个函数，触发 beforeDestroy 钩子函数
> 2. 执行一些清理工作
> 3. 执行 destroyed 钩子函数

> [!warning]
> 如果使用单文件组件的话，模版编译是在打包或构建的时候完成的，不在运行的时候处理模版编译的工作<br>
> Vue 始终推荐提前去编译模版，性能会更好

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Frame/Vue/01.png)

## Vue.js 语法和概念

### 1. 差值表达式

> 可以通过 `{{}}` 把 data 中的成员显示在模版中的任何位置

- 如果内容中有 HTML 字符串，差值表达式会把内容解析为普通文本，HTML 内容会被转译
- 如果想把内容作为 HTML 输出，可以使用 `v-html` 指令

### 2. 指令

> Vue 中的内置指令有 14 个，可以帮助我们做很多事情

- 如果指令不满足需求，可以创建自定义指令，在自定义指令中操作 DOM
  - 例如，让文本框在页面打开的时候获取焦点

### 3. 计算属性和侦听器

- 当模版中有太多的逻辑需要处理的时候，推荐使用计算属性，计算属性的结果会被缓存，下次再访问该计算属性的时候，会从缓存中获取相应的结果，提高性能
- 如果需要监听数据的变化，做一些比较复杂的操作，可以使用侦听器
  - 例如，异步操作、开销比较大的操作

### 4. class 和 style 绑定

> 当绑定样式的时候，可以使用 class 和 style

- 分别可以绑定数组和对象，实际开发中，推荐使用 class 绑定，让样式可以复用

### 5. 条件渲染/列表渲染

> 可以通过 `v-if` 或者 `v-show` 控制元素的显示和隐藏，`v-for` 进行列表渲染

- `v-if` 是如果条件为 false 时，不输出元素，`v-show` 是元素会渲染到页面，通过样式控制其隐藏
- 使用`v-for` 进行列表渲染时，推荐在循环项中设置一个 key，用来跟踪每个节点的身份，让每一项都能最大程度的复用，提高性能

### 6. 表单输入绑定

- 使用 v-model 绑定表单元素的时候，负责监听用户的输入事件以及更新数据，也就是双向绑定

### 7. 组件

> 组件就是可复用的 Vue 实例

- 一个组件封装了 HTML、CSS、JavaScript，可以实现页面上的一个功能区域，可以无限次的被复用

### 8. 插槽

> 插槽可以在一个自定义组件中挖一个坑，在使用这个组件的时候去填坑，目的是让组件更灵活

- 例如，vue-router 中的 router-link 这个组件里面的文本是在外部使用的时候传递进来的，内部就是使用插槽来进行占位的

### 9. 插件

> Vue 的插件机制，vue-router、vuex 都是插件

### 10. 混入 mixin

> 如果多个组件都有相同选项，就可以使用混入的方式，把相同的选项进行合并进行组件复用

### 11. 深入响应式原理

### 12. 不同构建版本的 Vue

> Vue 打包之后会生成不同版本的 Vue，支持不同的模块化方式，以及带编译器和不带编译器版本的 Vue