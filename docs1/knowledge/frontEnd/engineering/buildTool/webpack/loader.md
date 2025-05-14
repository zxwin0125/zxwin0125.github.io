---
title: loader 资源模块加载器
star: true
order: 2
---

## webpack 资源模块加载

- webpack 内部(loader)默认只会处理 JavaScript 文件
  - 也就是说它会把打包过程中所有遇到的文件当作 JavaScript 文件去解析
- 可以为其他类型的文件添加不同的加载器(loader)

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Engineering/Webpack/04.png)

### loader

> loader 是 webpack 实现整个前端模块化的核心，借助于 loader 就可以加载任何类型的资源

- 安装 loader，然后在配置文件中的 module 属性下配置 rules 数组
- rules 是针对其他资源模块的加载规则的配置
- 每个规则对象，都需要设置两个属性：
  - test：一个正则表达式，用于匹配打包过程中遇到的文件路径
  - use：用于指定匹配到的文件需要使用的 loader
    - 可以配置 loader 模块名称，也可以配置 loader 相对路径，原理同 require 函数
      - use: 'css-loader' 使用 npm 上的 loader 模块
      - use: './xxx-loader' 使用自定义的 .js 文件的相对路径

> [!warning]
> 如果配置了多个 loader(数组)，执行顺序是从后向前

> [!info]
> 一些插件介绍
> 1. css-loader
>   - 将 css 文件转换成一个 js 模块，具体实现是将 css 代码 push 到一个数组当中
>   - 但是整个过程中，并没有使用到这个数组，还需要一个 style-loader 去使用它
> 2. style-loader
>   - 将 css-loader 转换后的结果，通过 style 标签的形式追加到页面上
> 3. html-loader
>   - 使 webpack 识别 .html 的模块

```js
// webpack.config.js
const path = require('path')

module.exports = {
  mode: 'none',
  entry: './src/main.css',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  }
}
```

## webpack 导入资源模块

> 虽然可以通过 loader 将任何类型的资源作为入口去打包，但 webpack 一般还是将 JavaScript 作为打包入口

> [!warning]
> 打包入口可以说是项目的运行入口，webpack 建议：
> 1. 编写代码过程中，根据代码的需要，动态导入资源
> 2. 需要资源的不是应用，而是代码

- 目前而言，JavaScript 代码负责完成整个应用的业务功能，JavaScript 驱动前端应用的业务，在实现业务的过程中，需要其他类型的资源(例如样式、图片)
- webpack 建立 JavaScript 和资源的依赖关系的目的：
  1. 逻辑合理，JavaScript 确实需要这些资源文件
  2. 确保上线资源不缺失，都是必要的

```js
// main.js
import createHeading from './heading.js'
import './main.css'

const heading = createHeading()

document.body.append(heading)
```
```js
// webpack.config.js
const path = require('path')

module.exports = {
  mode: 'none',
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  }
}
```

## webpack 文件资源加载器

- 大部分 loader 都类似 css-loader，都是将资源模块转换为 JavaScript 代码的实现方式
- 还有一部分(例如图片、字体)不能通过 JavaScript 的方式去表示的资源，需要用到文件资源加载器，例如 file-loader

> [!info]
> webpack 默认将输出目录作为网站的根目录，所以资源的路径默认以 dist 为根目录
> - 通过配置 publicPath，告诉 webpack 打包的文件在网站中的位置，默认为 '' 即网站根目录
>   - 例如：publicPath: 'dist/'，即打包文件到 dist 文件夹下，注意 / 不能省略

- publicPath 即打包后文件中 webpack 使用的变量`__webpack_require__.p`
- 使用图片时，它拼接在图片路径前，即`__webpack_require__.p + imgSrc`，所以 / 不能省略

> [!important]
> webpack 在打包时遇到图片等文件，根据配置匹配对应的文件加载器，先将文件拷贝到输出目录，然后将输出的文件的路径，作为返回值返回，从而可以通过 import 拿到访问这个文件的路径

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Engineering/Webpack/05.png)

```js
// webpack.config.js
module: {
  rules: [
    {
      test: /.png$/,
      use: 'file-loader'
    }
  ]
}
```
```js
// bundle.js
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "dist/";
...
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "aaa0e8af948e470ee7dd81a36b503e18.png";

/***/ })
```

## webpack URL 加载器

> 除了 file-loader 这种通过拷贝文件的方式去处理文件资源以外，还有一种通过 Data URLs 表示文件的常见方式

### Data URLs

> [!info]
> - 传统的 URL 一般要求服务器有一个对应的文件，然后通过请求这个地址得到服务器上的这个文件
> - Data URLs 是特殊的 URL 协议，它可以直接表示一个文件的内容，即 url 中的文本已经包含了文件的内容，所以使用 Data URLs 时就不会再发送 HTTP 请求

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Engineering/Webpack/06.png)

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Engineering/Webpack/07.png)

- 上图表示一个编码为 UTF-8，内容为`<h1>html content</h1>`的 html 内容，可以通过浏览器打开这个地址查看效果

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Engineering/Webpack/08.png)

- 而如果是图片或字体这种无法直接通过文本去表示的二进制类型的文件，可以通过将文件的内容进行 base64 编码，然后以编码后的字符串去表示文件的内容

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Engineering/Webpack/09.png)

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Engineering/Webpack/10.png)

- 上图表示 base64 编码的 png 类型的文件，一般情况 base64 编码比较长，浏览器也能解析出来对应的文件

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Engineering/Webpack/11.png)

- 通过 Data URLs 可以以代码形式表示任意类型的文件

### url-loader

- file-loader 通过拷贝的方式打包文件，最终返回输出文件的路径
- url-loader 将文件转换为 Data URLs，最终返回一个完整的 Data URLs 类型的 url 地址，不会输出独立的物理文件

### 最佳实践

> [!important]
> - 小文件使用 Data URLs，减少请求次数
> - 大文件单独提取存放(传统方式)，提高加载速度(Data URLs 表示大文件内容过大)

- 每个 loader 加载器都有 options 配置选项
- 通过配置 url-loader 的 limit(字节上限)实现最佳实践
  - 超出 limit 的文件单独提取存放(调用 file-loader 加载器)
  - 小于 limit 的文件转换为 Data URLs 嵌入代码

> [!warning]
> 如果 url-loader 配置了 limit，大文件是使用 file-loader 加载器处理的，所以需要安装它依赖的 file-loader

```js
// webpack.config.js
module: {
  rules: [
    {
      test: /.png$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 10 * 1024 // 10 KB
        }
      }
    }
  ]
}
```
```js
// bundle.js
(function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAACXBIWXMAAAsSAAALEgHS3X78AAAgAElEQVR4nO3debwcVZn/8aeqbwIJRgISCEtEdtCg4MowCpFFMTjqoEjG...
/***/ })
```

## 常用加载器分类

1. 编译转换类
  - 把加载到的模块，转换为 JavaScript 代码，例如 css-loader

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Engineering/Webpack/12.png)

2. 文件操作类
  - 把加载到的资源模块，拷贝到输出的目录，同时导出文件的访问路径，例如 file-loader

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Engineering/Webpack/13.png)

3. 代码检查类
  - 对代码加载的文件中的代码进行校验
  - 目的：统一代码风格，从而提高代码质量，一般不会修改生产环境的代码，例如 eslint-loader

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Engineering/Webpack/14.png)

## webpack 处理 ES2015

> [!warning]
> webpack 默认就能处理代码当中的 import 和 export，但这不表示 webpack 会自动编译 ES6 的代码
> - 因为模块打包需要，所以 webpack 对代码中的 import 和 export 作了相应的转换
> - webpack 并不能转换代码中其他的 ES6 特性

- 如果需要 webpack 处理代码中其他 ES6 特性的转换，就需要为 JavaScript 文件配置一个额外的编译类型的 loader，例如常见的babel-loader
  - babel-loader 依赖额外的 babel 的核心模块 @babel/core
  - 另外可以安装一个 babel 的插件集合(预设) @babel/preset-env

> [!warning]
> babel 只是转换 JavaScript 代码的一个平台，我们需要基于这个平台，通过不同的插件去转换代码中具体的特性，所以需要配置 babel 要使用的插件

> [!important]
> webpack 只是打包工具，不会处理代码中的 ES6 的新特性，通过配置加载器实现编译转换代码

```js
// webpack.config.js
module: {
  rules: [
    {
      test: /.js$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    },
  ]
}
```
```js
// 处理前
/* harmony default export */ __webpack_exports__["default"] = (() => {
  const element = document.createElement('h2');
  element.textContent = 'Hello world';
  element.classList.add('heading');
  element.addEventListener('click', () => {
    alert('Hello webpack');
  });
  return element;
});

// 处理后
/* harmony default export */ __webpack_exports__["default"] = (function () {
  var element = document.createElement('h2');
  element.textContent = 'Hello world';
  element.classList.add('heading');
  element.addEventListener('click', function () {
    alert('Hello webpack');
  });
  return element;
});
```

## webpack 模块加载方式

> 除了代码中的 import 可以触发模块的加载，webpack 还提供了其他几种方式

1. 遵循 ES Modules 标准的 import 声明

```js
import createHeading from './heading.js'
import icon from './icon.png'
import './main.css'

const heading = createHeading()
const img = new Image()
img.src = icon
document.body.append(heading)
document.body.append(img)
```

2. 遵循 CommonJS 标准的 require 函数

```js
const createHeading = require('./heading.js').default
const icon = require('./icon.png')
require('./main.css')

const heading = createHeading()
const img = new Image()
img.src = icon
document.body.append(heading)
document.body.append(img)
```

> [!warning]
> 如果 require 一个 ESM 的模块，需要通过`require(<path>).default`获取 ESM 模块的默认属性

3. 遵循 AMD 标准的 define 函数和 require 函数

```js
define(['./heading.js', './icon.png', './main.css'], (createHeading, icon) => {
  const heading = createHeading.default()
  const img = new Image()
  img.src = icon
  document.body.append(heading)
  document.body.append(img)
})

require(['./heading.js', './icon.png', './main.css'], (createHeading, icon) => {
  const heading = createHeading.default()
  const img = new Image()
  img.src = icon
  document.body.append(heading)
  document.body.append(img)
})
```

> [!warning]
> 除非必要情况，否则不要再项目中混合使用这几种标准

- webpack 除了以上3个方式，loader 加载的非 JavaScript 也会触发资源加载（一些独立的加载器，在工作时也会处理所加载到的资源当中导入的模块），例如
  - css-loader 加载的 css 文件（样式代码中 @import 指令和 url 函数）
  - html 代码的图片标签的 src 属性，a 标签的 href 属性，使用 html-loader
    - html-loader 默认只会处理 html 中的 src 属性，如果要实现其他标签的属性也能触发 webpack 打包，需要为加载器添加一些相应配置

```js
module: {
  rules: [
    {
      test: /.html$/,
      use: {
        loader: 'html-loader',
        options: {
          attrs: ['img:src', 'a:href']
        }
      }
    }
  ]
}
```

> [!important]
> 代码中所有引用到的资源（有引用资源可能性的地方）都会被 webpack 找到，然后根据配置交给对应的 loader 去处理，最后将处理的结果整体打包到输出目录，webpack 就是依据这样的特点，去实现整个项目的模块化


## webpack 核心工作原理

1. 在项目中一般都会散落着各种各样的代码及资源文件(.js .html .css .png .json .scss…)，webpack 会根据配置找到其中的一个文件作为打包入口(entry)，一般是一个 JavasSript 文件

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Engineering/Webpack/15.png)

2. 顺着入口文件的代码，根据代码中出现的 import 或 require 之类的语句，解析推断出这个资源所依赖的模块，分别再解析每个模块对应的依赖，最后形成了，整个项目中所有用到的文件之间的依赖关系的依赖树

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Engineering/Webpack/16.png)

3. webpack 会递归这个依赖树，找到每个节点对应的资源文件，根据配置文件中的 rules 属性，找到模块对应的加载器去加载这个模块，最后会将加载到的结果，放到打包文件 bundle.js 中，从而实现整个项目的打包

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Engineering/Webpack/17.png)

> [!important]
> loader 机制是 webpack 的核心，如果没有 loader，webpack 就没有办法实现各种资源文件的加载，而只是打包合并 JavaScript 代码的工具

## webpack Loader 的工作原理

### 1. 开发一个 loader

- 开发一个 markdown 文件加载器（markdown-loader），实现在代码中直接导入 markdown 文件
- 原理：将 md 内容转换为 html 呈现到页面中

### 2. 起步

1. 创建一个 loader 的 js 文件，编写内容
2. 每个 loader 都需要导出一个函数，这个函数是 loader 对所加载到的资源的处理过程
  - 输入：就是资源所加载到的内容，参数 source 接收
  - 输出：return 处理后的结果
3. 在 webpack 配置文件中配置 rules，使用这个 loader

```js
// markdown-loader.js
module.exports = source => {
  console.log(source)
  return 'hello ~'
}

// webpack.config.js
module.exports = source => {
	module: {
    rules: [
      {
        test: /.md$/,
        use: './markdown-loader', // 同 require 一样可以指定相对路径
      }
    ]
    }
}
```

- 此时执行打包命令，会报错`You may need an additional loader to handle the result of these loaders.你可能需要一个额外的loader去处理这个自定义加载器的结果`
  - webpack 加载资源的过程，类似于一个工作管道，可以在这个过程中依次使用多个 loader
    - Source => loader1 -> loader2 -> loaderx => Result
  - 但是它要求最终这个管道工作过后的结果，必须是一段 JavaScript 代码
  - 而上面的 loader 返回的是`hello ~`，它不是 JavaScript 代码，所以才会出现这个错误提示
- 解决办法
  1. 直接返回 JavaScript 代码
    - 例如 `return 'exports default "hello ~"'`
  2. 或者找一个合适的 loader 继续处理 markdown-loader 处理的结果

### 3. 使用合适的 loader 处理

- 继续完善功能，安装 markdown 解析模块 marked，该模块可以解析 md 内容，并返回一个字符串
- markdown-loader 仍然返回解析后的 html 字符串，将结果交给下一个 loader 处理

```js
const market = require('market')
module.exports = source => {
  const html = market(source)
  return html
}
```

- 安装用于加载 html 的 loader（html-loader）
- 将这个加载器，配置在 markdown-loader 的后面执行（代码中位置靠前）

```js
const path = require('path')

module.exports = {
  mode: 'none',
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist'),
    publicPath: 'dist/'
  },
  module: {
    rules: [
      {
        test: /.md$/,
        use: [
          'html-loader',
          './markdown-loader'
        ]
      }
    ]
  }
}
```

### 4. 总结

- loader 负责资源文件从输入到输出的转换
- loader 实际上是一种管道的概念，对于同一个资源可以依次使用多个 loader，将此次 loader 返回的结果交给下一个 loader 处理
  - 例如上面的 markdown-loader -> html-loader，以及处理样式的 css-loader -> style-loader
