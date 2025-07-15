---
title: parcel
order: 4
---

> parcel 是零配置的前端应用打包器

- 在一个空项目中初始化 package.json
- 安装 parcel-bundler 模块

```bash
yarn add parcel-bundler --dev
```

- 虽然 parcel 与 webpack 一样都支持以任意类型的文件作为打包入口，但是 parcel 官方建议使用 html 文件
  - 理由为 html 是应用运行在浏览器端的入口

```html
<!-- 打包入口 src/index.html -->
<body>
  <script src="main.js"></script>
</body>
```

- parcel 同样支持对 ESM 的打包

```js
// src/main.js

import foo from './foo'

foo.bar()
```

```js
// src/foo.js

export default {
  bar: () => {
    console.log('hello parcel~')
  }
}
```

- 可以发现，parcel 不仅仅打包了应用，而且还同时开启了一个开发服务器，类似 webpak-dev-server
- 如果需要模块热替换，parcel 也支持

```js
// src/main.js

import foo from './foo'

foo.bar()
if (module.hot) {
  module.hot.accept(() => {
    // 此处的 accept 只接受一个参数，当前的模块或所依赖模块更新才会执行
    console.log('hmr')
  })
}
```

- 除了热替换，parcel 还支持自动安装依赖，极大程度避免了额外的一些手动操作

```js
import $ from 'jquery'
```

```json
{
  "dependencies": {
    "jquery": "^3.4.1" // 引入后自动安装
  }
}
```

- 除此之外，parcel 同样支持加载其他类型的资源模块，而且相比其他的模块打包器，在 parcel 中加载任意类型的资源模块也是零配置，整个过程不需要安装任何插件
- 还可以添加图片到项目当中

```css
// src/style.css

body {
  background-color: #282c40;
}
```

```js
// src/main.js

import $ from 'jquery'
...
import './style.css'
import logo from './zce.png'

...
$(document.body).append(`<img src="${logo}" />`)
...
```

- parcel 同样支持使用动态导入，内部如果使用了动态导入，它也会自动拆分代码

```js
// src/main.js

// import $ from 'jquery'
...
import('jquery').then($ => {
  ...
  $(document.body).append(`<img src="${logo}" />`)
})
...
```

- parcel 如何以生产环境打包

```bash
yarn parcel build src/index.html
```

> [!warning]
> 对于相同体量的打包，parcel 会比 webpack 的构建速度快很多
>
> - 因为在 parcel 内部是多进程同时去工作，充分发挥了多核 CPU 的性能
> - 当然 webpack 中也可以使用 happypack 的插件来实现这一点
