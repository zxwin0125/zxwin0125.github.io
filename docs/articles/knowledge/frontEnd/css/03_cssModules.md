---
title: CSS Modules 理论和实战
description: 如何实现 CSS Modules
keywords: CSS Modules, CSS 模块化
---

# CSS Modules 理论和实战

面试官除了对 CSS 的考察除了基础布局和经验以外，还非常喜欢问 CSS 工程相关的题目，比如：

- 如何维护大型项目的 `z-index`
- 如何维护 CSS 选择器和样式之间的冲突

## 什么是 CSS Modules

> CSS Modules 是指项目中所有 class 名称默认都是局部起作用的

其实，CSS Modules 并不是一个官方规范，更不是浏览器的机制

它依赖项目的构建过程，因此实现往往需要借助 Webpack 或者其他构建工具的帮助，可以将 class 的名字唯一化，从而实现局部作用

来看一个例子：

```html
<div class="test">This is a test</div>
```

对应的样式表为：

```css
.test {
  color: red;
}
```

再经过编译构建之后，对应的 HTML 和 CSS 分别为：

```html
<div class="_style_test_309571057">This is a test</div>
```

```css
._style_test_309571057 {
  color: red;
}
```

其中 class 名是动态生成的，全项目唯一的，因此通过命名规范的唯一性，达到了避免样式冲突的目的

> [!warning] 有点疑问 🤔
> 生成了全局唯一的 class 名，那么如何像传统方式那样实现样式复用呢？

从原理上想，<font color=red>全局唯一的 class 是在构建过程中，如果能给在构建过程进行标识，表示该 class 将被复用</font>，就可以解决问题了，这样的方式，就依靠 `composes` 关键字实现，来看案例

样式表 style.css 文件中

```css
.common {
  color: red;
}

.test {
  composes: common; /* 注意使用了 composes 关键字，在 .test 中关联了 .common 样式 */
  font-size: 18px;
}
```

对于 HTML 文件

```html
import style from "./style.css";

<div class="${style.test}">this is a test</div>
```

进行编译构建后

```html
<div class="_style__test_0980340 _style__common_404840">this is a test</div>
```

看 `div` 的 `class` 被加进了 `_style__common_404840`，这样就实现了复用样式

## CSS Modules 实战

### Step 1：创建项目

```bash
npm init --y
```

```json
{
  "name": "css-modules",
  "version": "1.0.0",
  "description": "README.md",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

### Step 2：创建必要文件

```bash
mkdir src
touch index.html
```

```javascript
import bluestyle from './style.css'
import greenstyle from './app.css'

let html = `
  <h2 class="${bluestyle.my_css_selector}">I should be displayed in blue.</h2>
  <br/>
  <h2 class="${greenstyle.my_css_selector}">I should be displayed in green.</h2> 
`
document.write(html)
```

```css
/* style.css */
.my_css_selector {
  color: blue;
}
```

```css
/* app.css */
.my_css_selector {
  color: green;
}
```

在这两个样式文件中，使用了相同的 class 名

### Step 3：安装依赖

接下来按照 webpack、webpack-cli、babel 全家桶（babel-core、babel-loader、babel-preset-env）和相应的 loaders：css-loader、style-loader 以及 extract-text-webpack-plugin 插件

建议安装版本遵循，否则会出现类似 webpack 版本和 extract-text-webpack-plugin 不兼容等依赖版本问题

```json
"babel-core": "^6.26.3",
"babel-loader": "^7.1.4",
"babel-preset-env": "^1.6.1",
"css-loader": "^0.28.11",
"extract-text-webpack-plugin": "^4.0.0-beta.0",
"style-loader": "^0.21.0",
"webpack": "^4.1.0",
"webpack-cli": "^3.1.1"
```

正常流程下来，package.json 如下：

```json
{
  "name": "css-modules",
  "version": "1.0.0",
  "description": "README.md",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "babel-core": "^6.26.3",
    "babel-loader": "^7.1.4",
    "babel-preset-env": "^1.6.1",
    "css-loader": "^0.28.11",
    "extract-text-webpack-plugin": "^4.0.0-beta.0",
    "style-loader": "^0.21.0",
    "webpack": "^4.1.0",
    "webpack-cli": "^3.1.1"
  }
}
```

### Step 4：编写 webpack 配置

创建 webpack 配置文件，并编写

使用了 extract-text-webpack-plugin 插件，并定义入口为 src 目录，产出为 build 目录

对后缀名为 css 的文件使用 css-loader 解析，产出为 styles.css 文件并在 index.html 中使用

> [!warning] 注意看
> 对于 css-loader，设置了 modules 参数，进行了 css modules 处理

```bash
touch webpack.config.js
```

```javascript
var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: './src',
  output: {
    path: __dirname + '/build',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js/,
        loader: 'babel-loader',
        include: __dirname + '/src'
      },
      {
        test: /\.css/,
        // ExtractTextPlugin 是一个 Webpack 插件，主要用于将 CSS 提取到单独的文件中，而不是嵌入到 JS 文件中
        // extract(...) 方法的参数是一个配置字符串，指定将要使用的 loader 和相应的配置
        // css-loader: 处理 CSS 文件的内容，允许你使用 CSS 模块
        // modules: 开启 CSS 模块，这意味着 CSS 类名将被局部作用域化，防止类名冲突，在使用模块时，每个 CSS 类都会有一个独特的、基于该文件和样式名称的哈希值
        // importLoaders=1: 这个选项指定在处理 CSS 文件时需要加载多少个其他的 loader，在这个例子中，强调 CSS 文件中的 @import 语句需要经过一遍 css-loader
        // localIdentName=[name][local][hash:base64:5]: 这个选项用来定义生成的类名的格式，[name] 是文件名，[local] 是类名，[hash:base64:5] 是生成的哈希值，确保类名在全局范围内是唯一的
        loader: ExtractTextPlugin.extract(
          'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]__[hash:base64:5]'
        )
      }
    ]
  },
  plugins: [new ExtractTextPlugin('styles.css')]
}
```

### Step 5：编写 npm script 并运行

将 package.json 中的 `script` 命令改为

```json
"scripts": {
  "start": "webpack --mode development"
},
```

运行 webpack，此时 package.json 内容为

```json
{
  "name": "css-modules",
  "version": "1.0.0",
  "description": "README.md",
  "main": "index.js",
  "scripts": {
    "start": "webpack --mode development"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "babel-core": "^6.26.3",
    "babel-loader": "^7.1.4",
    "babel-preset-env": "^1.6.1",
    "css-loader": "^0.28.11",
    "extract-text-webpack-plugin": "^4.0.0-beta.0",
    "style-loader": "^0.21.0",
    "webpack": "^4.1.0",
    "webpack-cli": "^3.1.1"
  }
}
```

运行 `npm start`，得到产出，打开页面会发现如图，已经在编译过程中完成了 css module 处理

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/img/CSS/10.png)
