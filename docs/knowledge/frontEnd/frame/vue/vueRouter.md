---
title: Vue Router 原理实现
order: 2
---

## vue-router 基础回顾

- 使用 vue-cli 创建一个 vue 应用，创建时选择 router 插件，自动生成 vue-router 的基础代码结构，先选择使用 hash 模式

```bash
npm install -g @vue/cli

vue create vue-router-basic-usage
```

1. 注册路由插件，配置路由规则
2. 创建 router 路由对象，并将规则传递进去
3. 实例化 vue 的时候传递（注册）router 路由对象
4. 创建路由组件占位`<router-view>`
5. 创建链接`<router-link>`

> [!important]
> 实例化 vue 时配置了 router 属性（router 路由对象），会在 vue 实例对象中注入以下属性
> 1. $route：路由规则
>   - 存储了当前路由的规则和数据
> 2. $router：VueRouter（路由对象）的实例
>   - 提供一些和路由相关的方法（查看`$router.__proto__`），push、replace、go 等
>   - 和路由相关的信息
>     1. mode 当前模式hash history
>     2. currentRoute 当前路由规则
>       - 有些情况无法通过$route获取当前路由信息，例如插件中。
>       - 可以想办法拿到$router

### 1 动态路由

> [!tip]
> 配置路由规则的时候
> 1. 可以直接导入页面组件模块，配置在 component
> 2. 不经常访问的页面可以使用动态导入的方式实现懒加载
>   - 当访问这个页面（路由地址）的时候才开始加载这个页面组件
>   - 不访问的时候不加载，提高性能

- 在路由地址中（path）可以使用参数占位符，例如：`path: '/detail/:id'`
- 在页面中访问可以通过
  1. 通过路由规则获取
    - `this.$route.params.id`
    - `this.$router.currentRoute.params.id`
  2. 通过props接收
    - 路由规则中配置 props 选项为 true
    - 在页面组件中通过 props 接收参数，通过 this.id 访问

> [!warning]
> - 通过路由规则获取的缺点是这个组件必须强依赖这个路由，也就是使用这个组件时，必须在路由上配置这个参数
> - 使用 props 可以使组件不依赖这个路由

### 2. 嵌套路由

> 当多个路由组件都有相同的内容，可以把这些相同的内容提取到一个公共的组件中

- 举个例子
  - 首页和详情页都有同样的头部和尾部，可以提取一个新的组件 Layout，将头尾放到这个组件中
  - 然后放一个`<router-view>`占位，将有变化的内容（首页组件或详情页组件）放到其中
  - 这样访问首页或详情页时，就会将 Layout 组件和首页/详情页的组件合并到一起输出

> [!tip]
> 路由规则中配置嵌套路由：在模板路由的 children 下配置嵌套的路由规则
> 1. path：嵌套路由会将外部的 path 和 children 中路由的 path 进行合并
>   - children 中的 path 可以配置为：绝对路径 or 相对路径
> 2. component：当访问合并后的 path 时，页面会分别加载 Layout 组件和对应的 Index 组件，并把它们合并到一起

```js
const routes = {
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        name: 'index',
        component: Index
      },
  }
}
```

### 3. 编程式导航

- 除了使用`<router-link>`组件实现导航跳转，还可以使用编程式导航（`$router.push`等方法），实现点击按钮通过进行路由跳转操作

> [!important]
> `$router.push`接收两种参数
> 1. 字符串：跳转的路由地址，例如`/detail`
> 2. 对象：包含路由名称（命名式导航）及其他信息，例如`{ name: 'Detail', params:{ id: 10 } }`

> [!warning]
> `$router.replace`方法同 push 的使用一样，区别是
> 1. replace 不会向 history 添加新记录，它直接替换当前的 history 记录
> 2. 效果：A 页面 push 到 B 页面，再 replace 到 C 页面
>   - 后退：返回到 A 页面，而不是 B 页面
>   - 再前进：前进到 C 页面，而不是 B 页面
>   - B 页面被覆盖

- `$router.go`方法参数是一个整数，表示在 history 记录中向前或向后多少步
  1. 参数为负数表示后退，-1等效于`$router.back()`
  2. 参数为正数表示前进
  3. 参数为0，会刷新当前页面，不建议使用，缺陷：
    - 刷新整个页面效果同 F5（有瞬间白屏）
    - safari 不支持
  4. 超出历史记录数量，就会失败

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
  - 在路由规则最后配置对所有路由(*)的默认页面：404 路由
  - 当访问路径没有匹配到路由时，会输出 404 组件的内容
  - 注意：只是输出内容，而不是跳转到 404 地址，URL 不会变更
2. History 需要服务器的支持
  - 单页应用中，服务端不存在 `https://www.testurl.com/login` 这样的地址
  - 在单页应用中通过跳转(pushState)可以访问到该页面，但是 F5 刷新页面时会向服务器发送请求，此时它就会返回找不到该页面（404）
  - 所以在服务器端应该配置，除了静态资源外的所有路径，都返回单页应用的 `index.html`
  - vue-cli 创建的应用启动的服务器已经进行了 history 的配置
  - 重现这个问题，需要将应用打包，部署到 node 服务器或者 nginx 服务器

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
> - html 用于存储网站资源
>   - 将打包好的文件放到该文件
> - conf 存放 nginx 配置文件
>   - 稍后修改 nginx.conf 配置文件

- 启动 nginx 测试是否安装成功 start nginx
  - 如果 80 端口(nginx 默认端口)没有被占用，nginx 服务器会启动成功，此时 localhost 会访问成功
  - 如果 80 端口被占用，nginx 服务器不会启动成功，不过也不会报错

> [!tip]
> 配置 nginx 站点
> 1. 将打包的 web 文件拷贝到 nginx 目录的 html 文件夹中
> 2. 浏览器重新访问 localhost
> 3. 刷新/根目录以外的地址，报出 404

- 修改 nginx.conf 文件，配置服务器支持 history 模式

> [!tip]
> nginx.conf 字段
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
> - 当调用 pushState 或 replaceState 改变地址时，并不会触发 popstate 事件
> - 只有做出浏览器动作时才会触发，例如：
>   - 点击浏览器前进后退按钮
>   - 调用 history.back 或 history.forward 方法

3. 根据当前路由地址找到对应的组件，重新渲染

