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

.\node_modules\.bin\sass.cmd sass/style.sass css/style.css
```

- 这样使用的话，每次转换都要执行一边代码，过于繁琐
- 所以要解决在项目开发阶段重复去执行的命令，可以使用 NPM Scripts

### NPM Scripts

- 可以在 NPM Scripts 中定义一些与这个项目开发过程中有关的脚本命令，让这些命令跟在项目一起去维护
- 包装构建命令的方式就是在 package.json 中添加一个 scripts 字段：

```json
"scripts": {
  "build-sass": "sass sass/style.sass css/style.css"
}
```
- 键是 script 命令，值是需要去执行的命令

> [!warning]
> scripts 可以自动去发现 node_modules 中的命令，这里就不需要写完整的命令，直接写名称可以

- NPM Scripts 也是实现自动化构建最简单的方式

