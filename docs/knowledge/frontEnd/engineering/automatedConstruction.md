---
title: 自动化构建
date: 2021-03-08
order: 3
---

## 什么是自动化构建

> 重复的工作都应自动化

- 开发行业中的自动化构建，就是把开发中写的源代码自动转换成可以在生产环境中运行的代码
- 一般把这个转换过程称为自动化构建工作流，作用是让开发者脱离运行环境兼容带来的种种问题，在开发阶段使用一些提高效率的语法规格和标准
- 典型应用场景，开发网页应用时可以使用
  - ECMAScript Next 新语法提高编码效率和代码质量
  - Sass 增强 css 的可编程性
  - 模板引擎抽象页面中重复的 html
- 通过自动化构建工具可以将上述不被浏览器支持的特性转换成能够直接运行的代码

## 自动化构建初体验

> 通过 sass 增强 css 的可编程性

### 浏览器使用 sass

```bash
yarn add sass --dev

npx sass scss/main.scss css/main.css
```

- 这样使用的话，每次转换都要执行一边代码，过于繁琐
- 所以要解决在项目开发阶段重复去执行的命令，可以使用 NPM Scripts

### NPM Scripts

- 可以在 NPM Scripts 中定义一些与这个项目开发过程中有关的脚本命令，让这些命令跟在项目一起去维护
- 包装构建命令的方式就是在 package.json 中添加一个 scripts 字段：

```json
"scripts": {
  "sass-build": "sass scss/main.scss:css/main.css",
}
```
- 键是 script 命令，值是需要去执行的命令

> [!warning]
> scripts 可以自动去发现 node_modules 中的命令，这里就不需要写完整的命令，直接写名称可以

- NPM Scripts 也是实现自动化构建最简单的方式

### browser-sync（启动测试服务器运行项目）

```bash
yarn add browser-sync --dev
```

```json
"scripts": {
  "sass-build": "sass scss/main.scss:css/main.css",
  "serve":"browser-sync ."
}
```

- 执行 yarn serve 启动测试服务器

### NPM Scripts 钩子机制

- 想要实现项目启动前让 sass-build 工作，定义一个 preserve 命令，它会在 serve 命令执行前去执行

```json
"scripts": {
  "sass-build": "sass scss/main.scss:css/main.css",
  "preserve": "yarn sass-build",
  "serve": "browser-sync ."
}
```

### 监听 sass 文件并同时执行多个任务

- 为 sass 命令添加一个 `–watch` 的参数，sass 就会监听文件的变化
- 为 browser-sync 添加 `–files` 参数，可以让 browser-sync 启动后监听一些文件的变化，然后自动同步到浏览器，自动更新页面，可以不用手动刷新浏览器了
- 借助 npm-run-all 模块同时执行多个任务
- 安装 npm-run-all:

```bash
yarn add npm-run-all --dev 
```

```json
"scripts": {
  "sass-build": "sass sass/style.sass css/style.css --watch",
  "serve": "browser-sync . --files \"css/*.css\"",
  "start": "run-p sass-build serve"
}
```

- 这样就借助 NPM Scripts 完成了一个简单的自动化构建的工作流，（启动后同时运行 serve 和 sass-build 这两个命令）
                                                                  