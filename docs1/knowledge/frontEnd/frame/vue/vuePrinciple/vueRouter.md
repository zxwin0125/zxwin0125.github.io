---
title: Vue Router 原理实现
star: true
category:
	- Vue
tag:
  - Vue Router
order: 2
---

## vue-router 基础回顾

- 使用 vue-cli 创建一个 vue 应用，创建时选择 router 插件，自动生成 vue-router 的基础代码结构，先选择使用 hash 模式

```bash
npm install -g @vue/cli

vue create vue-router-basic-usage
```

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/img/Frame/Vue/02.png)

### 1. 使用步骤

1. 注册路由插件，配置路由规则
2. 创建 router 路由对象，并将规则传递进去
3. 实例化 vue 的时候传递（注册）router 路由对象
4. 创建路由组件占位`<router-view>`
5. 创建链接`<router-link>`

> [!important]
> 实例化 vue 时配置了 router 属性（router 路由对象），会在 vue 实例对象中注入以下属性
>
> 1. $route：路由规则
>
> - 存储了当前路由的规则和数据
>
> 2. $router：vue-router（路由对象）的实例
>
> - 提供一些和路由相关的方法（查看`$router.__proto__`），push、replace、go 等
> - 和路由相关的信息
>   1. mode 当前模式 hash history
>   2. currentRoute 当前路由规则
>   - 有些情况无法通过 $route 获取当前路由信息，例如插件中
>   - 可以想办法拿到 $router

```js
import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index.vue'
// 1. 注册路由插件
Vue.use(VueRouter)

// 路由规则
const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index
  },
  {
    path: '/blog',
    name: 'Blog',
    component: () => import(/* webpackChunkName: "blog" */ '../views/Blog.vue')
  },
  {
    path: '/photo',
    name: 'Photo',
    component: () => import(/* webpackChunkName: "photo" */ '../views/Photo.vue')
  }
]
// 2. 创建 router 对象
const router = new VueRouter({
  routes
})

export default router
```

```js
import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

new Vue({
  // 3. 注册 router 对象
  router,
  render: h => h(App)
}).$mount('#app')
```

```vue
<template>
  <div id="app">
    <div>
      <img src="@/assets/logo.png" alt="" />
    </div>
    <div id="nav">
      <!-- 5. 创建链接 -->
      <router-link to="/">Index</router-link> | <router-link to="/blog">Blog</router-link> |
      <router-link to="/photo">Photo</router-link>
    </div>
    <!-- 4. 创建路由组建的占位 -->
    <router-view />
  </div>
</template>
```

### 2. 动态路由

> [!tip]
> 配置路由规则的时候
>
> 1. 可以直接导入页面组件模块，配置在 component
> 2. 不经常访问的页面可以使用动态导入的方式实现懒加载
>
> - 当访问这个页面（路由地址）的时候才开始加载这个页面组件
> - 不访问的时候不加载，提高性能

- 在路由地址中（path）可以使用参数占位符，例如：`path: '/detail/:id'`
- 在页面中访问可以通过
  1. 通过路由规则获取
  - `this.$route.params.id`
  - `this.$router.currentRoute.params.id`
  2. 通过props接收
  - 路由规则中配置 props 选项为 true
  - 在页面组件中通过 props 接收参数，通过 this.id 访问

> [!warning]
>
> - 通过路由规则获取的缺点是这个组件必须强依赖这个路由，也就是使用这个组件时，必须在路由上配置这个参数
> - 使用 props 可以使组件不依赖这个路由

```js
const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index
  },
  {
    path: '/detail/:id',
    name: 'Detail',
    // 开启 props，会把 URL 中的参数传递给组件
    // 在组件中通过 props 来接收 URL 参数
    props: true,
    component: () => import(/* webpackChunkName: "detail" */ '../views/Detail.vue')
  }
]
```

```vue
<template>
  <div>
    <!-- 方式1： 通过当前路由规则，获取数据 -->
    通过当前路由规则获取：{{ $route.params.id }}

    <br />
    <!-- 方式2：路由规则中开启 props 传参 -->
    通过开启 props 获取：{{ id }}
  </div>
</template>

<script>
export default {
  name: 'Detail',
  props: ['id']
}
</script>
```

### 2. 嵌套路由

> 当多个路由组件都有相同的内容，可以把这些相同的内容提取到一个公共的组件中

- 举个例子
  - 首页和详情页都有同样的头部和尾部，可以提取一个新的组件 Layout，将头尾放到这个组件中
  - 然后放一个`<router-view>`占位，将有变化的内容（首页组件或详情页组件）放到其中
  - 这样访问首页或详情页时，就会将 Layout 组件和首页/详情页的组件合并到一起输出

> [!tip]
> 路由规则中配置嵌套路由：在模板路由的 children 下配置嵌套的路由规则
>
> 1. path：嵌套路由会将外部的 path 和 children 中路由的 path 进行合并
>
> - children 中的 path 可以配置为：绝对路径 or 相对路径
>
> 2. component：当访问合并后的 path 时，页面会分别加载 Layout 组件和对应的 Index 组件，并把它们合并到一起

```js
const routes = [
  {
    name: 'login',
    path: '/login',
    component: Login
  },
  // 嵌套路由
  {
    path: '/',
    component: Layout,
    children: [
      {
        name: 'index',
        path: '',
        component: Index
      },
      {
        name: 'detail',
        path: 'detail/:id',
        props: true,
        component: () => import('@/views/Detail.vue')
      }
    ]
  }
]
```

### 3. 编程式导航

- 除了使用`<router-link>`组件实现导航跳转，还可以使用编程式导航（`$router.push`等方法），实现点击按钮通过进行路由跳转操作

> [!important] > `$router.push`接收两种参数
>
> 1. 字符串：跳转的路由地址，例如`/detail`
> 2. 对象：包含路由名称（命名式导航）及其他信息，例如`{ name: 'Detail', params:{ id: 10 } }`

> [!warning] > `$router.replace`方法同 push 的使用一样，区别是
>
> 1. replace 不会向 history 添加新记录，它直接替换当前的 history 记录
> 2. 效果：A 页面 push 到 B 页面，再 replace 到 C 页面
>
> - 后退：返回到 A 页面，而不是 B 页面
> - 再前进：前进到 C 页面，而不是 B 页面
> - B 页面被覆盖

- `$router.go`方法参数是一个整数，表示在 history 记录中向前或向后多少步
  1. 参数为负数表示后退，-1等效于`$router.back()`
  2. 参数为正数表示前进
  3. 参数为0，会刷新当前页面，不建议使用，缺陷：
  - 刷新整个页面效果同 F5（有瞬间白屏）
  - safari 不支持
  4. 超出历史记录数量，就会失败

```vue
<template>
  <div>
    用户名：<input type="text" /><br />
    密&nbsp;&nbsp;码：<input type="password" /><br />

    <button @click="push">push</button>
  </div>
</template>

<script>
export default {
  name: 'Login',
  methods: {
    push() {
      this.$router.push('/')
      // this.$router.push({ name: 'Home' })
    }
  }
}
</script>
```

```vue
<template>
  <div class="home">
    <div id="nav">
      <router-link to="/">Index</router-link>
    </div>
    <button @click="replace">replace</button>

    <button @click="goDetail">Detail</button>
  </div>
</template>

<script>
export default {
  name: 'Index',
  methods: {
    replace() {
      this.$router.replace('/login')
    },
    goDetail() {
      this.$router.push({ name: 'Detail', params: { id: 1 } })
    }
  }
}
</script>
```

```vue
<template>
  <div>
    路由参数：{{ id }}

    <button @click="go">go(-2)</button>
  </div>
</template>

<script>
export default {
  name: 'Detail',
  props: ['id'],
  methods: {
    go() {
      this.$router.go(-2)
    }
  }
}
</script>
```

### 4. Hash 和 History 模式区别

- 首先要知道，这两种模式都是客户端路由的使用方式，也就是当路径发生变化时，不会向服务器发送请求，而是使用 JS 监视路由的变化，然后根据不同的地址，渲染不同的内容
- 如果需要服务器端内容，会发送 ajax 请求来获取

#### 4.1 表现形式区别

- Hash 模式的 URL 中带有 #，# 后面的内容是路由地址
  - `https://music.163.com/#/playlist`
- History 模式的 URL 就是个正常的 URL
  - `https://music.163.com/playlist`
  - 要用好 History 模式的 URL 还需要服务端配置去配合

#### 4.2 原理的区别

- Hash 模式是基于锚点，以及 onhashchange 事件
  - 通过锚点的值作为路由地址
  - 当地址发生变化时触发 onhashchange 事件
  - 根据路径决定页面上呈现的内容
- History 模式是基于 HTML5 中的 History API
  - History API 即：
    - history.pushState() IE10以后才支持
    - history.replaceState() IE10以后才支持
  - history.pushState() 与 location 跳转的区别
    - 当使用 location 跳转时，地址栏中的 URL 会发生变化，并且会向服务器发送请求
    - pushState 方法不会向服务器发送请求，只会改变地址栏中的 URL，并且把这个 URL 添加到 history 记录中
    - 所以通过 pushState 可以实现客户端路由
- 由于 pushState 具有兼容性问题，所以 IE9 以下浏览器只能使用 hash 模式
- 两个模式都是客户端修改 url，性能相差不大

### 5. History 模式的使用

1. 配置404路由

- 在路由规则最后配置对所有路由(\*)的默认页面：404 路由
- 当访问路径没有匹配到路由时，会输出 404 组件的内容
- 注意：只是输出内容，而不是跳转到 404 地址，URL 不会变更

2. History 需要服务器的支持

- 单页应用中，服务端不存在 `https://www.testurl.com/login` 这样的地址
- 在单页应用中通过跳转(pushState)可以访问到该页面，但是 F5 刷新页面时会向服务器发送请求，此时它就会返回找不到该页面（404）
- 所以在服务器端应该配置，除了静态资源外的所有路径，都返回单页应用的 `index.html`
- vue-cli 创建的应用启动的服务器已经进行了 history 的配置
- 重现这个问题，需要将应用打包，部署到 node 服务器或者 nginx 服务器

```js
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '*',
    name: '404',
    component: () => import(/* webpackChunkName: "404" */ '../views/404.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})
```

#### 5.1 History 模式 - Node.js 服务器配置

- 将上面的应用打包，拷贝到网站根目录，使用基于 node 的 express 搭建一个服务器，配置静态资源路径指向网站根目录，启动服务器
- 从页面中点击链接或按钮跳转到根目录（/）以外的地址，发现可以正常访问
  - 因为这个跳转过程使用的是 Histroy API（如 history.pushState）实现改变 URL 和添加 history 记录
  - 这些操作都是在客户端完成的，并没有向服务器发送请求
- 此时刷新页面，就会向服务器发送请求，例如请求`http://localhost:3000/blog`地址，而服务器并没有配置处理这个地址的内容，所以结果会返回默认的 404 页面：Cannot GET /xxx
- 配置服务器对 history 的支持：注册处理 history 模式的中间件
  - 该中间件的工作就是服务器会判断当前请求的页面是否存在，如果不存在，会将默认的首页内容（index.html）返回给浏览器，
    浏览器接收到这个页面后，会再去判断路径，找到对应的路由，并将对应的组件渲染到浏览器中

```js
const path = require('path')
// 导入处理 history 模式的模块
const history = require('connect-history-api-fallback')
// 导入 express
const express = require('express')

const app = express()
// 注册处理 history 模式的中间件
app.use(history())
// 处理静态资源的中间件，网站根目录 ../web
app.use(express.static(path.join(__dirname, '../web')))

// 开启服务器，端口是 3000
app.listen(3000, () => {
  console.log('服务器开启，端口：3000')
})
```

#### 5.2 History 模式 - nginx 服务器配置

> [!tip]
> nginx 服务器配置：
>
> - 从官网下载 nginx 的压缩包
> - 把压缩包解压到 c 盘根目录，注意目录不能有中文
> - 打开命令行，切换到 nginx 目录，启动 nginx

- nginx 命令

```bash
# 启动(后台启动，不会阻塞命令行)
start nginx
# 重启(如果修改了nginx配置，需要重启服务器)
nginx -s reload
# 停止
nginx -s stop
```

> [!warning]
> 以上命令行中直接使用 nginx 命令，需要将 nginx.exe 配置到环境变量中，否则需要使用 nginx.exe 的路径

> [!tip]
> nginx 目录
>
> - html 用于存储网站资源
>   - 将打包好的文件放到该文件
> - conf 存放 nginx 配置文件
>   - 稍后修改 nginx.conf 配置文件

- 启动 nginx 测试是否安装成功 start nginx
  - 如果 80 端口(nginx 默认端口)没有被占用，nginx 服务器会启动成功，此时 localhost 会访问成功
  - 如果 80 端口被占用，nginx 服务器不会启动成功，不过也不会报错

> [!tip]
> 配置 nginx 站点
>
> 1. 将打包的 web 文件拷贝到 nginx 目录的 html 文件夹中
> 2. 浏览器重新访问 localhost
> 3. 刷新/根目录以外的地址，报出 404

- 修改 nginx.conf 文件，配置服务器支持 history 模式

> [!tip]
> nginx.conf 字段
>
> - http
>   - listen 端口
>   - server_name 域名
>   - location
>     - root 指定当前网站的根目录，默认 html
>     - index 指定当前网站默认的首页，默认 index.html index.htm
>     - try_files 按指定顺序检查文件是否存在，并使用找到的第一个文件进行请求处理
>       - $uri 表示客户端请求的地址
>       - [官方文档](https://nginx.org/en/docs/http/ngx_http_core_module.html#try_files)

```bash
# ...
http {
  # ...
  server {
    # ...
    location / {
      # ...
      try_files $uri $uri/ /index.html;
    }
  }
}
```

- 以上配置会在客户端请求 `/blog` 时，按照以下顺序检查文件是否存在：
  - `/blog`
  - `/blog/`
  - `/index.html`
- 保证了找不到地址时返回 `/index.html`
- 重启 nginx，再次访问 web，刷新正常

## vue-router 实现原理

- 模拟 vue-router，默认使用 history 模式

### 1. 原理

- vue-router 是前端路由，当路径切换的时候，在浏览器端判断当前路径，并加载当前路径对应的组件

#### 1.1 Hash 模式

1. URL 中 # 后面的内容（锚点的值）作为路由地址

- 可以直接通过 location.href 切换浏览器中的地址
- 如果只改变了 # 后面的内容，浏览器不会向服务器发送请求这个地址，但是会将这个地址添加到浏览器的 history 记录中

2. 监听 hashchange 事件

- hash 改变后，触发 hashchange 事件，作出相应的处理，记录当前路由地址

3. 根据当前路由地址找到对应的组件，重新渲染

#### 1.2 History 模式

> history 模式地址就是个普通的 URL 地址

1. 通过 history.pushState 方法改变地址栏

- pushState 方法仅仅改变地址栏，并将当前地址添加到 history 记录中
- 并不会真正的跳转到访问路径，即不会向服务端发送请求

2. 监听 popstate 事件

- 可以监听到浏览器地址操作的变化，并作出相应处理，记录改变后的地址

> [!warning]
> popstate 事件的触发条件
>
> - 当调用 pushState 或 replaceState 改变地址时，并不会触发 popstate 事件
> - 只有做出浏览器动作时才会触发，例如：
>   - 点击浏览器前进后退按钮
>   - 调用 history.back 或 history.forward 方法

3. 根据当前路由地址找到对应的组件，重新渲染

### 2. vue-router 简单实现

#### 2.1 分析

- 回顾核心代码

```js
// router/index.js
// 注册插件
Vue.use(vue - router)
// 创建路由对象
const router =
  new vue() -
  router({
    routes: [{ name: 'home', path: '/', component: homeComponent }]
  })

// main.js
// 创建 Vue 实例，注册 router 对象
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
```

1. vue-router 是一个插件，需要使用 Vue.use 注册

- Vue.use 接收一个参数
  - 参数为函数：会执行这个函数
  - 参数为对象：会执行这个对象的 install 方法
- vue-router是一个对象，所以需要内部实现一个 install 方法

2. new 创建一个 vue-router 实例

- 所以 vue-router 应该是一个构造函数或类
- 构造函数结构一个对象参数，里面传入路由规则
  - 路由规则核心要记录的是对应的路径 path 和组件 component

3. 创建 Vue 实例，构造函数参数中传入 vue-router 实例对象

- 总结
  1. vue-router 应该是个类，内部应该有一个 install 的静态方法
  2. vue-router 构造函数接收一个对象参数，里面传入路由规则

#### 2.2 UML 类图

- 首先通过类图整理 vue-router 类需要定义的成员

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/img/Frame/Vue/03.png =500x)

- 类图分为三部分：（+ 表示 public，# 表示 protected，- 表示 private，\_ 开头表示 static）

1. 类的名称 VueRouter
2. 类的属性

- options 记录构造函数中传入的对象，包含一个 routes 对象（route 路由规则）
- routeMap 用来记录路由地址和组件的对应关系，将来会将路由规则解析到 routeMap
- data 一个包含 current 的响应式的对象
  - current 用于记录当前路由地址
  - 响应式目的：路由地址发生变化后，对应的组件要自动更新，通过 Vue.observable 方法将 data 转化为响应式对象

3. 类的方法

- Constructor 构造函数，初始化类的属性
- install 用于实现 vue 的插件机制，包括注入router对象，以及调用一些初始化方法
- init 用于调用 initEvent initRouteMap initComponents 方法
- initEvent 用于注册 popstate 事件，用于监听浏览器历史的变化
- initRouteMap 用于初始化 routeMap 属性
  - 它把构造函数中传入的路由规则，转化为键值对的形式，存储到 routeMap 对象中
    - key：路由地址
    - value：对应的组件
  - 在`<router-view>`组件中会使用到 routeMap
- initComponents 用于创建`<router-view>`和`<router-link>`组件

#### 2.3 init

- 使用 vue-cli 创建应用模板，在此基础上替换 vue-router 插件

```js
// import VueRouter from 'vue-router'
import VueRouter from '../vuerouter'
```

- init 方法用于包装一些初始化方法

```js
// src/vue-router/index.js
export default class VueRouter {
  init() {
    // this.initRouteMap()
    // this.initComponents(_Vue)
    // this.initEvent()
  }
}
```

#### 2.4 install

- Vue.use 调用 install 方法时会传递两个参数
  1. Vue：Vue 的构造函数
  2. Options：可选的选项对象（当前不需要）
- install 中需要做的事情
  1. 判断当前插件是否已经被安装
  2. 把 Vue 的构造函数添加到全局变量中
  - 因为 install 方法是一个静态方法
  - 将来在 vue-router 的实例中还要使用 Vue，例如在 initComponents 中创建组件时，需要调用 Vue.component
  3. 把创建 Vue 实例时传入的 router 对象，注入到所有Vue 实例上，例如：`this.$router`
  - 所有的组件也都是 Vue 实例，也需要被注入，想要所有的实例共享一个成员，应该把它设置到构造函数的原型(prototype)上
  - 在 install 内部获取创建 Vue 实例时传入的 `$options` 对象，需要用到混入 mixin
    1. 因为 install 内部的 this 不是指向 Vue 实例，因而获取不到创建 Vue 实例时传入的 `$options` 对象
    2. mixin 可以为所有 Vue 实例/组件定义一个混入对象，当 Vue 实例/组件被使用时，混入对象的选项将被「混合」进该实例/组件本身的选项
    - 同名数据对象合并，以实例/组件数据为先
    - 同名钩子函数合并为一个数组，全部被调用，混入对象的钩子将在实例/组件自身钩子之前调用
    - 值为对象的选项，例如 methods、components 等，将被合并为同一个对象，同名冲突时，以实例/组件为先
    3. 在 mixin 中定义一个 beforeCreate 钩子，在钩子函数中为 Vue 实例注入 router 对象
    - 因为 beforeCreate 的调用者是 Vue 实例，所以它内部的 this 就指向 Vue 实例
  4. 调用一些初始化方法
  - 在向 Vue 实例注入 router 对象的时候，调用 router 对象的初始化方法
    1. 初始化 routeMap
    2. 注册组件
    3. 注册事件

```js
// /src/vue-router/index.js
let _Vue = null

export default class VueRouter {
  static install(Vue) {
    // 1. 判断当前插件是否已经被安装
    if (VueRouter.install.installed) {
      return
    }
    // 创建一个用于记录插件是否被安装的变量
    VueRouter.install.installed = true

    // 2. 把Vue构造函数记录到全局变量
    _Vue = Vue

    // 3. 把创建Vue实例时传入的router对象注入到所有Vue实例上
    // 混入
    _Vue.mixin({
      beforeCreate() {
        // Vue实例的$options中才有router，组件中没有传递router对象
        // 混入的beforeCreate会在 实例 和 组件 中都调用
        // 所以需要判断如果是实例才注入，避免组件也会执行，导致无意义的执行
        if (this.$options.router) {
          _Vue.prototype.$router = this.$options.router
          this.$options.router.init()
        }
      }
    })
  }

  init() {
    // this.initRouteMap()
    // this.initComponents(_Vue)
    // this.initEvent()
  }
}
```

#### 2.5 构造函数

- 构造函数接收 options 对象参数，最终返回 vue-router 对象
- 构造函数中需要初始化3个属性
  1. options 记录构造函数传入的 options 对象
  2. routeMap 由 route 规则解析的，以 path 为 key，以 component 为 value 的键值对对象，`<router-view>`组件会通过这个对象找到对应的组件
  3. data 一个包含当前路由地址（current，默认为当前路径）的响应式对象，通过 Vue.observable 将其转化为响应式对象

```js
constructor (options) {
  this.options = options
  this.routeMap = {}
  this.data = _Vue.observable({
    current: window.location.pathname
  })
}
```

#### 2.6 initRouteMap

- 该方法的作用是将构造函数中传入的 route 规则转化为键值对的形式，存储到 routeMap 对象，以方便当路由地址发生变化时，很方便的根据 routeMap 对象找到对应的组件
  - key：路由地址
  - value：路由地址对应的组件

```js
initRouteMap () {
  // 遍历所有的路由规则，把路由规则解析成键值对的形式，存储到 routeMap 中
  this.options.routes.forEach(route => {
    this.routeMap[route.path] = route.component
  })
}
```

#### 2.7 initComponents - router-link

- initComponents 方法用于创建`<router-link>`和`<router-view>`组件
- 创建组件使用 Vue.component

```js
<router-link to="/">Home</router-link>
// 渲染为
<a href="/">Home</a>
```

- router-link 组件最终渲染成一个超链接
  - 链接地址是参数 to 传递的字符串，接收参数使用 props
  - 文本内容是 router-link 标签包裹的文本，使用插槽（slot）获取文本
  - 使用 template 渲染一个超链接

```js
// 通过参数传递Vue构造函数的目的是减少这个函数和外部的依赖
initComponents (Vue) {
  Vue.component('router-link', {
    props: {
      to: String
    },
    template: '<a :href="to"><slot></slot></a>'
  })
}
```

- 此时在 init 方法中放开 initRouteMap 和 initComponents 的调用，运行项目有两个报错
  1. 未注册`<router-view>`组件，此报错暂时忽略
  2. `You are using the runtime-only build of Vue where the template compiler is not available. Either pre-compile the templates into render functions, or use the compiler-included build.`
  - 您使用的是 Vue 的仅运行时版本，其中模板编辑器不可用，可以使用预编译把模板编译成 render 函数，或者使用编译器版本的Vue

#### 2.8 Vue 的构建版本

> Vue 的构建版本包含运行时版和完整版

- 运行时版(runtime)：不支持 template 模板，需要打包的时候提前编译
- 完整版：包含运行时和编译器，因为多了一个编译器，所以体积比运行时版大 10k 左右
  - 编译器的作用：在程序运行的时候把模板转换成 render 函数
  - 性能不如运行时版本
- vue-cli 创建的项目，默认使用的是运行时版本

#### 2.9 完整版的 Vue

- 参考 [vue-cli 官方文档 - 配置参考](https://cli.vuejs.org/zh/config/#jest)
- vue-cli 默认使用运行时版本，想要修改 vue-cli 的配置，需要在项目根目录创建一个`vue.config.js`的配置文件
- 在配置中开启`runtimeCompiler`选项
  - Default: false
  - 是否使用包含运行时编译器的 Vue 构建版本，设置为 true 后就可以在创建 Vue 实例及注册组件时使用 template 选项了，但是这会让应用额外增加 10kb 左右
- 现在就解决了之前的版本错误

#### 2.10 运行时版本的 Vue - render

- 运行时版本的 Vue 不带编译器，也就是不支持组件中的 template 选项，而编译器的作用就是将 template 编译成 render 函数
- 运行时版本的 Vue 中，可以直接编写 render 函数，以实现不需要编译器
- 当前项目中的单文件组件（.vue文件）可以使用 template，是因为在运行时对其进行了打包，打包过程中将其编译成了 render 函数，这叫做预编译 pre-compile

##### 编写 render 函数

- render 函数接收一个 createElement 方法作为参数，一般命名为 h，h 方法用于创建虚拟 DOM，并将结果返回
- Vue 选项中如果包含 render 函数，则 Vue 构造函数就不会从 template 选项或通过 el 选项指定的挂载元素中提取处 HTML 模板编译 render 函数
- 渲染函数 render-function，参考[官方文档——渲染函数 & JSX](https://cn.vuejs.org/v2/guide/render-function.html)

```js
// 通过参数传递 Vue 构造函数的目的是减少这个函数和外部的依赖
initComponents (Vue) {
  Vue.component('router-link', {
    props: {
      to: String
    },

    // template 选项需要编译器支持
    // template: '<a :href="to"><slot></slot></a>'

    // 直接编写 render 函数
    render (h) {
      return h('a', {
        attrs: {
          href: this.to
        }
      }, [this.$slots.default])
    }
  })
}
```

#### 2.11 initComponents - router-view

> router-view 组件相当于一个占位符

- router-view 组件内容要根据当前路由地址获取对应的路由组件，并渲染到 router-view 的位置上
- vue 的 createElement(h) 函数还可以直接将一个组件转化成虚拟DOM

```js
// 通过参数传递Vue构造函数的目的是减少这个函数和外部的依赖
initComponents (Vue) {
  Vue.component('router-link', {
    props: {
      to: String
    },
    render (h) {
      return h('a', {
        attrs: {
          href: this.to
        }
      }, [this.$slots.default])
    }
  })

  const self = this
  Vue.component('router-view', {
    render (h) {
      // 此处this指向Vue实例，所以要从外部获取指向VueRouter实例的this
      // 也可以使用this.$router
      const component = self.routeMap[self.data.current]
      return h(component)
    }
  })
}
```

#### 2.12 initComponents - 跳转处理

- 此时根目录地址的 router-view 中的内容可以正常显示，点击 router-link 链接可以实现跳转（暂时未实现 router-view 更新）
- 但是跳转过程发现页面进行了服务器请求，因为当前 router-link 编译成一个超链接，点击超链接默认会向服务器发送请求，而在单页应用的 history 模式中进行「跳转」，不希望向服务器发送请求
- 所以现在需要实现几件事情
  1. 取消超链接默认跳转，避免向服务器发送请求，为这个超链接注册一个点击事件，取消超链接后续任务（跳转）的执行
  2. 变更地址栏上的地址为超链接 href 属性上的地址，但不要向服务器发送请求，使用 history.pushState 方法实现
  3. 重新渲染新地址对应的内容，将当前地址更新到 this.data.current 中，由于 this.data 是响应式对象，所以它的变更会同步到 router-view 组件的 render 函数中，从而实现视图的更新

```js
initComponents (Vue) {
  Vue.component('router-link', {
    props: {
      to: String
    },
    render (h) {
      return h('a', {
        attrs: {
          href: this.to
        },
        on: {
          click: this.clickHandler
        }
      }, [this.$slots.default])
    },
    methods: {
      clickHandler (e) {
        history.pushState({}, '', this.to)
        this.$router.data.current = this.to
        // 阻止默认行为
        e.preventDefault()
      }
    }
  })

  const self = this
  Vue.component('router-view', {
    render (h) {
      const component = self.routeMap[self.data.current]
      return h(component)
    }
  })
}
```

#### 2.13 initEvent

- 该方法中注册 popstate 事件，以上实现的内容，当操作浏览器的前进后退时，根目录/以外的地址不会正常渲染对应组件的内容
- 这是因为没有对这些操作进行相应的处理，所以需要使用 popstate 监听历史地址发生变化，从而加载对应的组件

> [!warning]
> pushState 和 replaceState 方法不会触发 popstate 事件

- popstate 事件要做的事情
  1. 把当前地址栏上的地址取出来，只需要路径部分，即 location.pathname
  2. 这个路径部分就是路由地址，将其存储在 this.data.current 中，实现视图更新

```js
initEvent () {
  window.addEventListener('popstate', () => {
    // 当前使用箭头函数，this指向VueRouter实例
    this.data.current = window.location.pathname
  })
}
```

- 此时操作前进后端，视图会跟着变化，到此 vue-router 简单模拟完成
