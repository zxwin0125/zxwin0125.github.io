---
title: 自动化构建介绍
date: 2021-03-08
order: 1
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
- 所以要解决在项目开发阶段重复去执行的命令，可以使用 npm scripts

### npm scripts

- 可以在 npm scripts 中定义一些与这个项目开发过程中有关的脚本命令，让这些命令跟在项目一起去维护
- 包装构建命令的方式就是在 package.json 中添加一个 scripts 字段：

```json
"scripts": {
  "sass-build": "sass scss/main.scss:css/main.css",
}
```
- 键是 script 命令，值是需要去执行的命令

> [!warning]
> scripts 可以自动去发现 node_modules 中的命令，这里就不需要写完整的命令，直接写名称可以

- npm scripts 也是实现自动化构建最简单的方式

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

### npm scripts 钩子机制

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

- 这样就借助 npm scripts 完成了一个简单的自动化构建的工作流，（启动后同时运行 serve 和 sass-build 这两个命令）
                                                                  
## 常用的自动化构建工具

> npm scripts 确实能解决一部分的自动化构建任务，但是对于相对复杂的构建过程，npm scripts 就显得有些吃力，这时就需要更为专业的构建工具

- 目前市面上开发者使用最多的一些开发工具主要是 gulp ，grunt 和 fis

> [!warning]
> 严格来说 webpack 实际上是一个模块打包工具

- 这些工具都可以解决那些重复而且无聊的工作，从而实现自动化，用法上他们也都大体相同，都是先通过一些简单的代码去组织一些插件的使用，然后就可以使用这些工具执行各种重复的工作了

> [!info]
> - grunt 算是最早的前端构建系统了，他的插件生态非常的完善，用官方的一句话来说就是 grunt 的插件几乎可以帮你自动化的完成任何你想要做的事情
> - 但是由于他的工作过程是基于临时文件实现的，所以说他的构建速度相对较慢
> - 例如使用它去完成项目中 sass 文件的构建，一般会先对 sass 文件做编译操作，再去自动添加一些私有属性的前缀，最后再去压缩代码
> - 这样一个过程当中，grunt 每一步都会有磁盘读写操作，处理的环节越多文件读写的次数也就越多，对于超大型项目来说项目文件会非常多，构建速度就会特别的慢

> [!info]
> - gulp 很好的解决了 grunt 当中构建速度慢的问题
> - 因为他是基于内存实现的，也就是说对文件的处理环节都是在内存中完成的
> - 相对于磁盘读写速度自然就快了很多
> - 另外他默认支持同时执行多个任务，效率自然大大提高，而且他的使用方式相对于 grunt 更加直观易懂，插件生态也同样非常完善，所以说他后来居上，更受欢迎，应该是目前市面上最流行的前端构建系统了

> [!info]
> - fis 是百度的前端团队推出的一款构建系统，最早只是在团队内部使用，开源过后在国内快速流行，相对于前面两个构建系统这种微内核的特点 fis 更像是一种捆绑套餐
> - 他把项目当中一些典型的需求尽可能都集成在内部了
> - 例如在 fis 内部可以很轻松的处理资源加载，模块化开发，代码部署，甚至是性能优化
> - 正是因为这种大而全，所以在国内很多项目中就流行开了

- 总体来说如果是初学者的话，可能 fis 更适合，但是如果要求灵活多变的话，gulp 和 grunt 应该是更好的选择


