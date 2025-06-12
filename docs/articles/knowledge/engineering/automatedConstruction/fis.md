---
title: FIS
date: 2021-04-21
order: 4
---

## FIS 特点

- 相对于 Gulp 和 Grunt，FIS 的核心特点是高度集成
- 他把前端开发过程中常见的构建任务、调试任务都集成在内部
- 这样开发者就可以通过简单的配置文件的方式去配置构建过程需要完成的一些工作
- 它内部有一些内置任务能根据开发者的配置自动完成整个构建过程
- 除此之外，还有内置的一款 webServer，可以方便的去调试构建结果

## FIS 基本使用

- 安装 fis3 到项目目录下

```bash
npm install fis3 --save-dev
```

- 在项目目录下新建一个 fis 的配置文件 `fis-conf.js`

### 资源定位

- fis3 配置文件（默认`fis-conf.js`）所在的目录为项目根目录
- 执行 `fis3 release -d '路径'`将资源发布到该路径

```bash
fis3 release -d output
```

- 利用 fis 里内置 match 方法进行资源定位
  - selector：fis3 把匹配文件路径的路径作为 selector，匹配到的文件会分配给它设置的 props
  - props：编译规则属性，包括文件属性和插件属性

```js
fis.match(selector, props)
```

### 编译与压缩

- 可以通过配置文件的方式去配置如何处理文件的编译
- fis-conf 的书写方式是类似于 css 的声明方式，通过 match 方法的第一个参数去指定一个选择器（global 通配符），用选择器去命中那些转换过程中的文件

#### scss 文件的转换

- 安装 fis-parser-node-sass（依赖 node-sass）

```bash
yarn add fis-parser-node-sass --save-dev
```

- 在 match 选项中添加 parser，通过 fis.plugin 载入插件

```javascript
fis.match('**/*.scss', {
  // renameExt 扩展名的修改
  rExt: '.css',
  // 通过 node-sass 指定使用插件
  parser: fis.plugin('node-sass'),
  // fis 内置，压缩 css
  optimizer: fis.plugin('clean-css')
})
```

- 执行 `fis3 release -d output`
- 执行编译后会发现 assets/css 目录下生成了 .css 文件，而且在最终使用这些文件的地方，也会自动只使用编译后的资源（index.html 引用 scss 文件变成了引用 css 文件）
- 这也是资源定位能力的核心体现

#### JS文件（ES6）的转换：

- 安装babel

```bash
yarn add fis-parser-babel-6.x --save-dev
```

- 在 match 选项中添加 parser，通过 fis.plugin 载入插件

```javascript
fis.match('**/*.js', {
  // 通过 node-sass 指定使用插件
  parser: fis.plugin('babel-6.x'),
  // fis 内置，压缩 js
  optimizer: fis.plugin('uglify-js')
})
```
