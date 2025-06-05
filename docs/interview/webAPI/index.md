---
article: false
title: webAPI 面试重点
category:
	- 面试
tag:
	- webAPI
---

### sessionStorage 与 localStorage 有何区别

> 题目：sessionStorage 与 localStorage 有何区别

- localStorage 生命周期是永久，除非自主清除
- sessionStorage 生命周期为当前窗口或标签页，关闭窗口或标签页则会清除数据
- localStorage、sessionStorage 都只能存储字符串类型的对象
- 不同浏览器无法共享 localStorage 或 sessionStorage 中的信息
- 相同浏览器的不同页面间可以共享相同的 localStorage（页面属于相同域名和端口），但是不同页面或标签页间无法共享sessionStorage 的信息
  > [!warning]
  > 页面及标签页仅指顶级窗口，如果一个标签页包含多个 iframe 标签且他们属于同源页面，那么他们之间是可以共享sessionStorage 的

### 如何设置一个支持过期时间的 localStorage

> 题目：如何设置一个支持过期时间的 localStorage

- 设置如下数据结构，当用户存储数据时，存储至 **value 字段，并将过期时间存储至 **expires 字段

```javascript
{
  __value, __expires
}
```

- 而当每次获取数据时，判断当前时间是否已超过 \_\_expires 过期时间，如果超过，则返回 undefined，并删除该数据

### Cookie 属性

> 题目：浏览器中 cookie 有哪些字段

- Cookie 有以下属性
  - Domain
  - Path
  - Expire/MaxAge
  - HttpOnly: 是否允许被 JavaScript 操作
  - Secure: 只能在 HTTPS 连接中配置
  - SameSite

### Cookie maxAge

> 题目：当 cookie 没有设置 maxage 时，cookie 会存在多久

- 如果没有 maxAge，则 cookie 的有效时间为会话时间

### Cookie SameSite

> 题目：SameSite Cookie 有哪些值，是如何预防 CSRF 攻击的？

> 见文档 [SameSite Cookie - MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#samesitesamesite-value)

- None: 任何情况下都会向第三方网站请求发送 Cookie
- Lax: 只有导航到第三方网站的 Get 链接会发送 Cookie，跨域的图片、iframe、form 表单都不会发送 Cookie
- Strict: 任何情况下都不会向第三方网站请求发送 Cookie

> [!info]
> 目前，主流浏览器 Same-Site 的默认值为 Lax，而在以前是 None，将会预防大部分 CSRF 攻击，如果需要手动指定 Same-Site 为 None，需要指定 Cookie 属性 Secure，即在 https 下发送

### Cookie 增删改查

> 题目：如何设置一个 Cookie
> 题目：如何删除一个 Cookie

- 通过把该 cookie 的过期时间改为过去时即可删除成功，具体操作的话可以通过操作两个字段来完成

1. max-age: 将要过期的最大秒数，设置为 -1 即可删除
2. expires: 将要过期的绝对时间，存储到 cookies 中需要通过 date.toUTCString() 处理，设置为过期时间即可删除

- 很明显，max-age 更为简单，以下代码可在命令行控制台中进行测试

```javascript
// max-age 设置为 -1 即可成功
document.cookie = 'a=3; max-age=-1'
```

```javascript
> document.cookie
< ""

> document.cookie = 'a=3'
< "a=3"

> document.cookie
< "a=3"

// 把该字段的 max-age 设置为 -1
> document.cookie = 'a=3; max-age=-1'
< "a=3; max-age=-1"

// 删除成功
> document.cookie
< ""
```

- 同时，也可以使用最新关于 cookie 操作的 API: CookieStore API 其中的 cookieStore.delete(name) 删除某个 cookie

### ClipBoard API

> 题目：在浏览器中如何获取剪切板中内容
> 题目：浏览器的剪切板中如何监听复制事件
> 题目：如何实现页面文本不可复制

- 通过 Clipboard API 可以获取剪切板中内容，但需要获取到 clipboard-read 的权限，以下是关于读取剪贴板内容的代码：

```javascript
// 是否能够有读取剪贴板的权限
// result.state == "granted" || result.state == "prompt"
const result = await navigator.permissions.query({ name: 'clipboard-read' })

// 获取剪贴板内容
const text = await navigator.clipboard.readText()
```

> [!warning]
> 该方法在 devtools 中不生效

- 有 CSS 和 JS 两种方法禁止复制，以下任选其一或结合使用
- 使用 CSS 如下：

```css
user-select: none;
```

- 或使用 JS 如下，监听 selectstart 事件，禁止选中
- 当用户选中一片区域时，将触发 selectstart 事件，Selection API 将会选中一片区域
- 禁止选中区域即可实现页面文本不可复制

```javascript
document.body.onselectstart = e => {
  e.preventDefault()
}

document.body.oncopy = e => {
  e.preventDefault()
}
```

### fetch 中 credentials 指什么意思

> 题目：fetch 中 credentials 指什么意思

- credentials 指在使用 fetch 发送请求时是否应当发送 cookie
  - omit: 从不发送 cookie
  - same-origin: 同源时发送 cookie (浏览器默认值)
  - include: 同源与跨域时都发送 cookie

### 如何取消请求的发送

> 题目：如何取消请求的发送

- 以下两种 API 的方式如下
  - XHR 使用 xhr.abort()
  - fetch 使用 AbortController

### 如何判断在移动端

> 题目：如何判断当前环境是移动端还是 PC 端

- 判断 navigator.userAgent，对于 Android/iPhone 可以匹配以下正则

```javascript
const appleIphone = /iPhone/i
const appleIpod = /iPod/i
const appleTablet = /iPad/i
const androidPhone = /\bAndroid(?:.+)Mobile\b/i // Match 'Android' AND 'Mobile'
const androidTablet = /Android/i
```

- 推荐一个库: [ismobilejs](https://github.com/kaimallea/isMobile)

```javascript
import isMobile from 'ismobilejs'

const mobile = isMobile()
```

### requestIdleCallback

> 题目：简单介绍 requestIdleCallback 及使用场景

- requestIdleCallback 维护一个队列，将在浏览器空闲时间内执行
- 它属于 Background Tasks API，可以使用 setTimeout 来模拟实现

```javascript
window.requestIdleCallback =
  window.requestIdleCallback ||
  function (handler) {
    let startTime = Date.now()

    return setTimeout(function () {
      handler({
        didTimeout: false,
        timeRemaining: function () {
          return Math.max(0, 50.0 - (Date.now() - startTime))
        }
      })
    }, 1)
  }
```

- 以上实现过于复杂以及细节化，也可以像 swr 一样做一个简单的模拟实现，见[代码](https://github.com/vercel/swr/blob/8670be8072b0c223bc1c040deccd2e69e8978aad/src/use-swr.ts#L33)

```javascript
const rIC = window['requestIdleCallback'] || (f => setTimeout(f, 1))
```

> [!warning]
> 在 rIC 中执行任务时需要注意以下几点：
>
> - 执行重计算而非紧急任务
> - 空闲回调执行时间应该小于 50ms，最好更少
> - 空闲回调中不要操作 DOM，因为它本来就是利用的重排重绘后的间隙空闲时间，重新操作 DOM 又会造成重排重绘

### 如何把 DOM 转化为图片

> 题目：如何把 DOM 转化为图片

- [html2canvas](https://html2canvas.hertzen.com/): Screenshots with JavaScript
- [dom-to-image](https://github.com/tsayen/dom-to-image): Generates an image from a DOM node using HTML5 canvas

### 异步加载 JS 脚本时，async 与 defer 有何区别

> 题目：异步加载 JS 脚本时，async 与 defer 有何区别

- 以下图片取自 whatwg 的规范，可以说是最权威的图文解释了

[!](https://html.spec.whatwg.org/images/asyncdefer.svg)

- 在正常情况下，即 `<script>` 没有任何额外属性标记的情况下，有几点共识
  1. JS 的脚本分为加载、解析、执行几个步骤，简单对应到图中就是 fetch (加载) 和 execution (解析并执行)
  2. JS 的脚本加载(fetch)且执行(execution)会阻塞 DOM 的渲染，因此 JS 一般放到最后头
- 而 defer 与 async 的区别如下:
  - 相同点: **<font color=red>异步加载 (fetch)</font>**
  - 不同点:
    - async 加载(fetch)完成后立即执行 (execution)，因此可能会阻塞 DOM 解析
    - defer 加载(fetch)完成后延迟到 DOM 解析完成后才会执行(execution)，但会在事件 DomContentLoaded 之前
