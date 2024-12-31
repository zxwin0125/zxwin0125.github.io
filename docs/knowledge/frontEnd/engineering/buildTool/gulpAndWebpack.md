---
title: Gulp vs Webpack
order: 1
---

> [!tip]
> Gulp 不具备任何具体功能，完全自主，自定义性强
> - 需要开发者自己实现各种功能
> - 对 Node.js 储备要求高
> - 强调任务的概念，Gulp 本身实际上是一个任务调度工具（tasks runner）
> - 通俗点说：Gulp 就是你想干什么就干什么～

> [!tip]
> Webpack 从模块打包出发，通过插件实现一部分 Web 项目的自动化任务
> - 开箱即用，门槛更低
> - 主要应对 SPA 类应用的模块打包

- 以往使用 Gulp 去实现的常用自动化工作现在都可以使用 Webpack 实现
- 让开发者产生二者「类似」这个误会的原因：Webpack 一直在突破边界

## Gulp 常见场景

- 如果只是传统的静态页面开发（多页应用），注重的是页面结构与样式，建议采用 Gulp
- 小程序项目中使用 Sass/Less
- 再者就是日常的综合事务：文件重命名/前后缀

## 最佳实践

- 工具层面没有唯一标准答案
- 充分掌握 Gulp 与 Webpack，因地制宜
- SPA 类使用 Webpack
- MPA 类使用 Gulp
- 如果只是个别的需求直接使用 npm scripts 配合个别工具就好
  - 例如，只需要交验代码，单独使用 ESLint
  - npm scripts 就是小型的 tasks runner





 