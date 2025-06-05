---
title: ESLint
order: 2
---

## ESLint 介绍

- 最为主流的 JavaScript Lint 工具，检测 JS 代码质量
- ESLint 很容易统一开发者的编码风格，例如
  - 缩进换行分号以及空格之类的使用
- ESLint 还可以去找出代码当中一些不合理的地方，例如
  - 定义了一个从未使用的变量
  - 在一个变量使用之后才去对它进行声明
  - 进行比较的时候选择两等的符号等
- ESLint 可以帮助开发者提升编码能力

## ESLint 快速上手

### 1. ESLint 安装步骤

1. 初始化项目

```bash
npm init --yes
```

2. 安装 ESLint 模块为开发依赖

```bash
npm install eslint -D
```

3. 通过 CLI 命令验证安装结果

```bash
npx eslint --version
```

### 2. ESLint 检查步骤

- 初始化配置文件 `npx eslint --init`，编写问题代码
- 使用 ESLint 执行检测 `npx eslint 文件路径`，加上参数 --fix 可以自动修复格式问题
- 完成 ESLint 使用配置

## ESLint 配置文件解析

```js
// .eslintrc.js

module.exports = {
  env: {
    // 标记当前代码最终的运行环境
    browser: true, // 代码运行在浏览器环境
    es2020: true
  },
  extends: [
    // 记录共享配置
    'standard' // 如果需要在多个项目共享一个eslin配置，可以定义一个公共配置文件并在此集成
  ],
  parserOptions: {
    // 设置语法解析器的相关配置 控制是否允许使用某一个ES版本的语法
    ecmaVersion: 11
  },
  rules: {
    // 配置eslint中每一个校验规则的开启/关闭
    'no-alert': 'error' // 内置规则名称： off/warn/error
  },
  global: {
    // 额外声明代码中可使用全局成员 最新版本默认配置已不再体现
    // 例如要使用jQuery对象
    jQuery: 'readonly'
  }
}
```

- env 环境示例

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/img/Engineering/15.png)

## ESLint 配置注释

- 将配置通过注释的方式写在脚本文件中，再去执行代码校验
- 实际开发过程中难免会遇到一两个必须要违反配置规则的情况，但是又不能因为这一两个点去推翻校验规则的配置
- 所以在这个时候就可以去使用 ESLint 的配置注释

```js
// 使用注释临时禁用指定规则
const str1 = '${name} is a coder' // eslint-disable-line no-template-curly-in-string

console.log(str1)
```

- 注释的方式不仅可以禁用某个规则，还可以
  - 声明全局变量
  - 修改某个规则的配置
  - 临时开启某个环境
- [文档使用](https://eslint.cn/docs/user-guide/configuring#configuring-rules)

## ESLint 结合自动化工具（gulp-eslint）

- 建议把 ESLi n t 集成到自动化构建的工作流当中
  - 集成之后，ESLint 一定会工作
  - 与项目统一，管理更加方便

### ESLint 与 Gulp 的一个集成的实际操作

- 结合 gulp 使用

```js
const script = () => {
  return (
    src('src/assets/scripts/*.js', { base: 'src' })
      .pipe(plugins.eslint()) // 集成 eslint 操作
      .pipe(plugins.eslint.format()) // 使用 format 方法在控制台打印出具体的错误信息
      .pipe(plugins.eslint.failAfterError()) // 让 eslint 在检查到错误之后直接去终止任务管道
      // 先去进行 eslint 操作，否则经过 babel 之后就不是真正的源代码
      .pipe(plugins.babel({ presets: ['@babel/preset-env'] }))
      .pipe(dest('temp'))
      .pipe(bs.reload({ stream: true }))
  )
}
```

## ESLint 结合 Webpack（eslint-loader）

> Webpack 可以通过 loader 机制实现 ESLint 的检测工作

- 在 webpack.config.js 文件配置 eslint-loader 应用在 .js 文件中

```js
// webpack.config.js
module.exports = {
  ...
	module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'eslint-loader',
        enforce: 'pre' // 优先级更高
      }
    ]
  }
}
```

> [!warning]
> ESLint 爆出 React 虽然定义但是从来没有使用的错误，但是 React 是 JSX 编译之后代码所必须要使用到的

- 可以安装相关插件处理，如：eslint-plugin-react
- 修改 .eslintrc.js 的配置

```js
// .eslintrc.js

module.exports = {
  ...
  rules: {
    'react/jsx-uses-react': "error" // 可以数字2代替
    'react/jsx-uses-vars': "error"
  },
  plugins: [
    'react'
  ]
}
```

- 也可以使用共享配置 recomended 降低使用成本

```js
// .eslintrc.js

module.exports = {
  ...
  extends: [
    ...
    'plugin: react/recomended' // plugin：插件名称/配置名字
  ],
  ...
  rules: {
    // 'react/jsx-uses-react': "error"
    // 'react/jsx-uses-vars': "error"
  },
  plugins: [
    // 'react'
  ]
}
```

## ESLint 检查 TypeScript

> 建议使用 ESLint 配合 TypeScript 插件来实现代码校验

```js
// .eslintrc.js

module.exports = {
  ...
  parser: '@typescript-selint/parser', // 指定一个语法解析器
  ...
}
```

## ESLint 结合 Git Hooks

### Git Hooks 介绍

> 代码规范落地仍然有些问题，比如代码提交至仓库之前未执行 lint 工作，而使用 lint 的目的就是保证提交到仓库的代码是没有问题的

- 可以通过 Git Hooks 在代码提交前强制 lint

> [!info]
> Git Hook 也称之为 git 钩子，每个钩子都对应一个具体的 git 操作任务
>
> - 比如 commit、push
>   通过 shell 脚本可以编写钩子任务触发时要具体执行的操作

### Git Hooks 快速上手

> [!warning]
> 希望通过 Git Hooks 钩子在代码提交前强制实现对代码的 lint 操作，但是很多前端开发者并不擅长使用 shell，怎么办？

- Husky 可以实现 Git Hooks 的使用需求，安装后在 package.json 中添加如下配置

```json
// package.json
{
  ...
  "scripts": {
    "test": "eslint ./index.js"
  }
  ...
  "husky": {
    "hooks": {
      "pre-commit": "npm run test" // commit 之前执行 eslint
    }
  }
}
```

- 在检查之后还想再继续的去做一些后续的操作，可以配合 lint-stage 使用，例如
  - 让经过检查的代码进行格式化
  - 直接将这个格式化后的代码添加到暂存区

```json
// package.json
{
  ...
  "scripts": {
    "test": "eslint ./index.js",
    "precommit": "lint-staged"
  }
  ...
  "husky": {
    "hooks": {
      "pre-commit": "npm run precommit"
    }
  },
  "lint-staged": {
    "*.js*": [
      "eslint",
      "git add"
    ]
  }
}
```
