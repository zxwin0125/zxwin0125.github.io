---
title: StyleLint
order: 3
---

> 目前在前端项目中除了 JavaScript 代码是需要被 lint 之外，CSS 代码同样也是需要去被 lint <br>
> 对于 CSS 代码的 link 操作一般都会去使用 StyleLink 的工具，与 ESLint 基本上是一致的

## StyleLint 介绍

- 提供默认的代码检查规则
- 提供 CLI 工具，快速调用
- 通过插件支持 Sass Less PostCSS
- 支持 Gulp 或 Webpack 集成

## StyleLint 使用

- 安装

```bash
npm i stylelint -D
```

- StyleLint 的内部并没有提供任何可用的共享配置，所以需要安装 standard 插件

```bash
npm i stylelint-config-standard -D
```

- 创建 .stylelintrc.js 配置文件，并修改 extends 字段

```js
// .stylelintrc.js

module.exports = {
  extends: 'stylelint-config-standard'
}
```

- 执行 `npx stylelint ./index.css`，加上参数 --fix 可以自动修复部分格式问题

### Sass 代码校验

- 安装 stylelint-config-sass-guidelines 插件
- 修改 .stylelintrc.js 文件中的 extends 为数组，添加 sass 插件

```js
// .stylelintrc.js

module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-sass-guidelines']
}
```
