---
title: plugin 插件机制
star: true
order: 3
---

## webpack 插件机制

> [!info]
> - loader 专注实现资源模块的加载，从而实现整体项目的打包
> - plugin 解决项目中除了资源加载以外的自动化工作

- 插件目的是为了增强 webpack 项目自动化能力，例如
  1. 在打包之前，自动清除 dist 目录
  2. 拷贝不需要参与打包的资源文件到输出目录
  3. 压缩打包结果输出的代码

- webpack + plugin 实现了大多前端工程化的工作，也是很多开发者理解为 webpack 就是前端工程化的原因

## webpack 常见插件

- clean-webpackl-plugin
- html-webpack-plugin
- copy-webpack-plugin

> [!info]
> 绝大多数插件导出的都是一个模块类(class)，所以使用时就要创建这个插件的示例，并配置到 plugins 属性中

### 1. clean-webpack-plugin 自动清理输出目录

> [!info]
> webpack 每次打包的结果都是覆盖到 dist 目录，在打包之前，dist 目录中就可能已经存在一些之前的遗留文件，再次打包，只能覆盖掉那些同名的文件<br>
> 对于其他已经移除的资源文件就会一直积累在里面，非常不合理，合理的做法就是在每次打包之前，自动清理 dist 目录，这样 dist 目录中就只会存在需要的文件

- 利用 clean-webpack-plugin 插件能实现清理的功能

```js
// webpack.config.js
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
	// ...
	plugins: [
		new CleanWebpackPlugin()
	]
}
```

### 2. html-webpack-plugin 自动生成 html

- 目前为止示例都是以硬编码的方式，单独存放在项目根目录下，这个方式有两个问题：
  1. 项目发布时需要同时发布根目录下的 html 文件和 dist 目录下所有的打包结果，并且上线后，需要人工确认 html 中路径引用都是正确的，相对麻烦
  2. 项目输出(output)的目录或文件名，也就是打包结果的配置，发生了变化，还需要手动去修改 html 中 script 标签的 src

> [!important]
> 解决办法，通过 webpack 输出 html 文件，也就是让 html 也参与到 webpack 的构建过程
> 1. webpack 知道生成了多少 bundle，它会自动将这些打包文件添加到 html 文件中
> 2. webpack 还把 html 文件输出到 dist 目录，这样上线时直接发布 dist 目录即可
> 3. bundle 文件是 webpack 动态的注入到 html 文件中，不需要手动的硬编码，它确保路径的引用是正常的

- html-webpack-plugin 默认自动生成一个空白的 index.html 文件到配置的输出目录，并将打包文件(bundle)动态注入到 html 中

```js
// webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin') // 默认导出的就是一个插件类型，不需要解构内部成员

module.exports = {
	// ...
	plugins: [
		new HtmlWebpackPlugin()
	]
}
```

#### 2.1 html-webpack-plugin 配置

- 通过修改插件的配置属性，对自动生成的 html 文件做一些简单改进，例如：
  1. title：配置标题
  2. meta：自定义元数据标签

```js
module.exports = {
	// ...
	plugins: [
		new HtmlWebpackPlugin({
      title: 'Webpack Plugin Sample',
      meta: {
        viewport: 'width=device-width'
      }
    })
	]
}
```

- 如果需要对 html 文件进行大量的自定义，更好的做法是通过配置 template 指定一个 html 模板，让 html-webpack-plugin 插件根据模版生成页面
  - html 模板默认使用 lodash 语法输出
  - htmlWebpackPlugin 是插件内部提供的变量

```js
module.exports = {
	// ...
	plugins: [
		new HtmlWebpackPlugin({
      title: 'Webpack Plugin Sample',
      meta: {
        viewport: 'width=device-width'
      },
      template: './src/index.html'
    })
	]
}
```

#### 2.2 同时输出多个页面文件

- html-webpack-plugin 默认生成一个 index.html 文件
- 同样可以通过创建多个实例，生成多个 html 文件
- 通过 filename 指定输出的文件名

```js
module.exports = {
	// ...
	plugins: [
		// 用于生成 index.html
    new HtmlWebpackPlugin({
      title: 'Webpack Plugin Sample',
      meta: {
        viewport: 'width=device-width'
      },
      template: './src/index.html'
    }),
    // 用于生成 about.html
    new HtmlWebpackPlugin({
      filename: 'about.html'
    })
	]
}
```

### 3. copy-webpack-plugin 复制静态文件

- 对于项目中不需要参与构建的静态文件，也需要发布到线上，它们一般统一放在项目的 public 目录中
- 可以通过 copy-webpack-plugin 插件将它们拷贝到输出目录
- 它接收一个文件相对路径或目录组成的数组，路径可以使用通配符

```js
// 拷贝文件 v5.x 用法
// new CopyWebpackPlugin([
	// 'public/**',
  // 'public'
// ])

// 拷贝文件 v6.x 使用 patterns 配置
new CopyWebpackPlugin({
  patterns: [
    // 'public/**'
    'public'
  ]
})
```

## 插件机制的工作原理

> 相比于 loader，plugin 拥有更宽的能力范围
> - loader 只是在加载模块的环节工作
> - plugin 的作用范围几乎可以触及 webpack 工作的每一个环节

### 1. 钩子机制

> [!warning]
> 这样的插件机制是如何实现的呢？
> - webpack 插件机制就是软件开发中常见的钩子机制，有点类似于 web 中的事件

- webpack 工作过程中有很多环节，为了便于插件的扩展，webpack 几乎给每一个环节都埋下一个钩子
- 在开发插件的时候，可以通过这些不同的节点去挂载不同的任务，来扩展 webpack 的能力
- 有哪些预先定义好的钩子，可以参考官网[Compiler Hooks](https://webpack.docschina.org/api/compiler-hooks/)

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Engineering/Webpack/18.png)

### 2. 如何往钩子上挂载任务

- webpack 要求插件(在 plugins 中使用时)必须是一个函数或者是一个包含 apply 方法的对象

> 官方：插件是由[具有 apply 方法的 prototype 对象]所实例化出来的

> [!important]
> - 一般都会把一个插件定义为一个类(class)，然后在其中定义一个 apply 方法，使用插件时，通过这个 class 构建一个实例
> - webpack 在启动时，会自动调用插件的 apply 方法，apply 方法接收一个 compiler 对象作为参数
> - compiler 对象是 webpack 工作过程中最核心的对象，它包含当前构建的所有的配置信息，也是通过这个对象来注册钩子函数

```js
class MyPlugin {
  apply (compiler) {
    console.log('MyPlugin 启动')
  }
}
```

### 3. 开发一个插件

> 自定义一个用于清除 bundle.js 中`/******/`注释的插件

1. 确认插件执行时机（即挂载到哪个钩子上）
  - emit 钩子：确认 bundle.js 内容，在生成到 output 目录之前
2. 通过 compiler.hooks 访问到具体的钩子
3. 通过 tap 方法注册一个钩子函数，它接收两个参数：
  - 参数1：插件的名称
  - 参数2：需要挂载到这个钩子上的函数，它接收一个 compilation 对象作为参数
    - compilation 可以理解为此次打包过程的上下文，此次所有打包过程产生的结果都会放到 compilation 对象中
    - compilation.assets 访问所有编译的资源文件，每个元素都是一个包含资源文件信息的对象
      - key 是资源文件的名称
      - value 包含一个 source 方法
        - 调用它可以获取编译文件的内容
        - 重定义这个方法返回的值，实现修改编译文件的内容

> [!warning]
> webpack 还要求必须返回一个 size 方法，用于返回编译文件的大小

```js
class MyPlugin {
  apply(compiler) {
    compiler.hooks.emit.tap('MyPlugin', compilation => {
      // 打印资源文件的名称
      // console.log(name)

      // 打印资源文件的内容，通过资源文件的值的source方法获取
      // onsole.log(compilation.assets[name].source())
      
      // 判断是否是js文件
        if (name.endsWith('.js')) {
          // 获取内容
          const contents = compilation.assets[name].source()
          // 清除/*[*+]*/注释
          const withoutComments = contents.replace(/\/\*\*+\*\//g, '')
          // 覆盖编译内容
          compilation.assets[name] = {
            source: () => withoutComments,
            size: () => withoutComments.length, // 必要属性
          }
        }
    }
  }
}
```

### 4. 总结

- 插件是通过往 webpack 的生命周期里的钩子函数里挂载任务函数实现的扩展
- 在插件开发中最重要的两个资源就是 compiler 和 compilation 对象，理解它们的角色是扩展 webpack 引擎重要的第一步
  - compiler 对象代表了完整的 webpack 环境配置
    - 这个对象在 webpack 启动时一次性建立，并配置好所有可操作的设置
    - 当在 webpack 环境中应用一个插件时，插件将受到此 compiler 对象的引用
    - 可以使用它来访问 webpack 的主环境
  - compilation 对象代表了一次资源版本构建
    - 当运行 webpack 开发环境中间件时，每检测到一个文件变化，就会创建一个新的 compilation，从而生成一组新的编译资源
    - 一个 compilation 对象表现了当前模块资源、编译生成资源、变化的文件、以及被跟踪依赖的状态信息
    - compilation 也提供了很多关键时机的回调，供插件做自定义处理时选择使用

