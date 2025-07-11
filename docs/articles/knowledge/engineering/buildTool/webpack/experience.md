---
title: webpack 开发体验
star: true
order: 4
---

## webpack 增强开发体验

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/img/Engineering/Webpack/19.png)

- 以目前状态应对日常开发工作还远远不够，因为这种方式，即编写源代码 -> webpack 打包 -> 运行应用 -> 刷新浏览器，过于原始
- 如果实际开发过程中还按照这种方式去使用，会大大降低开发效率

> [!info]
> 设想理想的开发环境
>
> 1. 以 HTTP Server 运行，不是以文件形式预览
>
> - 更加接近生产环境的状态
> - 类似 ajax 这类 api，不支持文件访问形式
>
> 2. 自动编译 + 自动刷新
>
> - 减少额外操作
>
> 3. 提供 Source Map 支持
>
> - 调试错误时快速定位

### 1. watch 监听模式实现自动编译

- 目前每次修改完源代码，都是通过命令行手动重复去运行 webpack 命令，从而得到最新的打包结果
- 也可以使用 webpack-cli 提供的一种 watch 的工作模式去解决这个问题

> [!info]
> watch 监听模式：监听文件变化，自动重新运行打包任务（类似其他构建工具的 watch）

- 命令行使用方法：`--watch`参数启动监听模式
  - 例如：`yarn webpack --watch`
- cli 不会立即退出，会等待文件的变化，然后再次工作，直到手动结束 cli

### 2. browser-sync 实现编译后自动刷新浏览器

- 使用 browser-sync 模块的`--files`参数监听文件变化，触发浏览器刷新
  - 例如：`browser-sync dist --files "**/*"`
- 它的原理就是 webpack 自动打包源代码到 dist 中，dist 文件变化又被 browser-sync 监听了，从而实现了自动编译并且自动刷新浏览器

## webpack-dev-server 实现自动编译 + 自动刷新

> 上面实现两个开发体验的方式的缺点
>
> 1. 需要打开两个终端去执行命令，操作较麻烦
> 2. webpack 频繁将编译后的文件写入磁盘，browser-sync 从磁盘中读取文件，这个过程中，一次就会多出两步磁盘读写的操作，效率上降低了

> [!info]
> webpack-dev-server 是 webpack 官方的开发工具
>
> - 它提供一个用于开发的 HTTP Server 服务器，并且集成了「自动编译」和「自动刷新浏览器」等功能

- 安装命令：`yarn add webpack-dev-server --dev`，安装完后，这个模块会提供一个 webpack-dev-server 的 cli 程序
- 运行这个命令，它内部会自动去使用 webpack 去打包应用，并且会启动一个 HTTP Server 服务器运行打包结果
- 运行过后还会监听代码变化，一旦源文件发送变化，它就会自动立即重新打包

> [!warning]
>
> - webpack-dev-server 为了提高工作效率，并没有将打包结果写入到磁盘当中，而是将打包结果，暂时存放在内存中
> - 内部的 HTTP Server 从内存中读取这些文件，发送给浏览器
> - 这样减少很多不必要的磁盘读写操作，从而大大提高构建效率

- 还可以为这个命令添加`--open`参数，即`yarn webpack-dev-server --open`自动唤起浏览器打开运行地址

### 1. 静态资源访问

- webpack-dev-server 默认会将构建结果输出的文件，全部作为开发服务器的资源文件（即默认只会 serve 打包输出的文件）
  - 也就是说，只要是 webpack 输出的文件，都可以直接被访问
- 但是还有一些没有参与构建的静态资源如果也需要被访问的话，就需要额外的告诉 webpack-dev-server
- 具体做法就是在 webpack 配置文件中去添加一个对应的配置

```js
module.exports = {
  ...
  devServer: {
    contentBase: './public',
  },
}
```

- webpack 配置的 devServer.contentBase 属性，可以额外的为开发服务器指定查找资源目录
- 这个属性可以接收表示目录的字符串或数组，也就是可以配置一个或多个路径

#### 1.1 配置 contentBase 替代 copy 插件

- 由于 webpack 打包任务可能使用 copy(copy-webpack-plugin) 插件将静态资源文件拷贝到输出目录（webpack-dev-server 是将拷贝的内容存储在内存中），所以运行 HTTP 可以访问到这些静态资源

> [!warning]
> 一般开发阶段最好不要使用 copy 插件
>
> - 由于开发阶段修改代码会频繁重复的执行 webpack 打包任务
> - 如果拷贝的文件比较多或比较大，每次执行 copy 任务，打包的开销就比较大，并且会降低速度
> - 所以拷贝任务一般会配置在打包发布版本的阶段执行，而开发阶段使用配置额外资源的查找路径 devServer.contentBase 的方式去访问

### 2. 代理 API 服务

- 由于 webpack-dev-server 启动了一个本地的开发服务器，默认运行在 `http://localhost:8080` 这样一个端口上面
- 而最终上线过后，应用一般和请求后端的 API 会部署到同源地址下面，这样就会在开发环境中出现跨域请求失败的问题
  - 虽然可以使用跨域资源共享（CORS）的方式去解决，但这个方式的前提是请求的这个 API 支持 CORS
  - 这需要后端和服务器配合，而且并不是任何情况下 API 都应该支持 CORS
  - 例如：前后端同源部署，即发布后，前后端在同一个域名、协议、端口下，就没有必要开启 CORS
- 所以解决「开发阶段接口跨域问题」的最好的办法就是在开发服务器当中配置「代理服务」
  - 也就是将接口服务，代理到本地的开发服务地址

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/img/Engineering/Webpack/20.png)

- webpack-dev-server 支持通过配置（devServer.proxy）的方式，添加代理服务

#### 2.1 实现：将 GitHub API 代理到开发服务器

> 目标：将 API(https://api.github.com/) 代理到本地开发服务器中

- github 接口的 Endpoint 一般都是在根目录下，Endpoint 可以理解为接口端点/入口
  - 例如 https://api.github.com/users
- webpack 通过 devServer.proxy 对象配置代理服务，对象中的每个属性，都是一个代理规则的配置
  - 属性的名称(key)就是需要代理的请求路径的前缀，也就是请求以哪个地址开始，就会走代理请求
    - 例如'/api'，请求开发服务器当中的 '/api' 开头的地址，都会代理到接口中
  - 属性的值(value)是为这个前缀匹配的代理规则配置
  - target：代理目标，即访问 key 相当于访问 target/key，他会将 key 添加到后面
    - 例如 `http://localhost:8080/api/users` 相当于 https://api.github.com/api/users
    - 也就是请求的路径是什么，最终代理的这个地址路径会完全一致的
    - 但是需要请求的接口地址实际上是 api.github.com/users，没有 '/api'
    - 所以对于代理路径当中的 '/api' 需要通过重写的方式去掉
  - pathRewrite：重写代理路径
    - 它接收一个对象，key 是正则匹配的路径字符串，value 是要替换的内容
    - 它修改的是 path 路径(参考 location.pathname)，例如 https://api.github.com/api/users 修改的是 /api/users
  - changeOrigin：设置为 true
    - 因为默认代理服务器会以实际在浏览器中请求的主机名，例如 `localhost:8080`，而一般情况下，服务器需要根据主机名判断请求是属于哪个网站，从而把这个请求指派到对应的网站，所以需要修改默认的主机名，`localhost:8080`
    - changeOrigin 设置为 true 就会以实际代理请求发生过程中的主机名去请求，所以真正请求的是 api.github.com 这样一个地址，主机名保持原有状态
    - 这样只需要正常去请求就行，不用关心最终代理成什么样

```js
module.exports = {
  ...
  devServer: {
    contentBase: './public',
    proxy: {
      '/api': {
        // http://localhost:8080/api/users -> https://api.github.com/api/users
        target: 'https://api.github.com',
        // http://localhost:8080/api/users -> https://api.github.com/users
        pathRewrite: {
          '^/api': ''
        },
        // 不能使用 localhost:8080 作为请求 GitHub 的主机名
        changeOrigin: true
      }
    }
  },
}
```

#### 2.2 Host 和 changeOrigin

- HTTP 请求头(Request Headers)中必须包含一个「host」头字段
  - 「host」请求头指明了服务器的域名和以及（可选的）端口号（也有说是指明了主机名和端口号）
- 如果没有给定端口号，会自动使用被请求服务的默认端口
  - 例如：请求 https://api.github.com/api/users 时，请求头的「host」为 api.github.com（默认 80 端口）

> [!info]
> 「host」的意义：一般情况下，服务器会配置多个网站，服务器端需要根据「host」判断当前请求是哪个网站，从而把这个请求指派到对应的网站

- webpack-dev-server 在客户端对代理后的地址发起请求时，请求的地址是 `http://localhost:8080/api/users`，所以请求头的「host」为 `localhost:8080`
- 代理背后又去请求被代理的地址 https://api.github.com/users，请求的过程中同样会带一个「host」，而代理服务默认使用用户在客户端发起请求的「host」，即 `localhost:8080`
- 而 `localhost:8080` 并不是 GitHub 配置的网站，请求头应为实际请求地址的「host」，即 api.github.com
- 配置 changeOrigin 为 true，就会以实际发生代理请求的「host」（api.github.com）作为发起请求的「host」

## Source Map

> 通过构建编译，可以将开发环境的源代码转化为能在生产环境运行的代码，这使得运行代码完全不同于源代码

- 由于调试和报错都是基于运行代码，如果需要调试应用，或运行应用时报出了错误，就无法定位
- Source Map(源代码地图) 就是解决这类问题最好的办法
  - 它用来映射转换后的代码(compiled)与源代码(source)之间的关系
  - 转换后的代码，通过转换过程中生成的 Source Map 文件进行解析，就可以逆向得到源代码

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/img/Engineering/Webpack/21.png)

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/img/Engineering/Webpack/22.png)

### 1. Source Map 文件

- 目前很多第三方的库在打包后都会生成一个 .map 后缀的 Source Map 文件，它是一个 json 格式的文件，主要包含以下属性：
  - version：表示当前文件所使用 source map 标准的版本
  - sources：记录转换之前源文件的名称，可能是多个文件合并转换成一个文件，所以它是数组形式
  - names：记录源代码中使用的成员名称
    - 压缩代码时，会将开发阶段编写的有意义的变量名替换为简短的字符，从而去压缩整体代码的体积
    - names 记录的就是原始对应的名称
  - mappings：记录转换后的代码当中的字符，与转换前所对应的映射关系
    - 它是整个 source map 的核心属性，是一个 Base64 VLQ 编码的字符串

```json
{
	"version": 3,
  "sources": ["jquery-3.4.1.js"],
	"names": [...],
	"mappings": "Base64 VLQ编码字符串"
}
```

### 2. Source Map 文件使用

- 可以在转换后的文件中通过添加注释的方式引入 source map 文件，例如：

```js
// jquery.min.js
// ...转换后的代码

//# sourceMappingURL=jquery.min.map
```

- 引入后，如果在浏览器中打开开发人员工具，开发人员工具在加载到这个 js 文件时发现有这个注释，它就会自动去请求这个 source map 文件
- 然后根据这个文件的内容，逆向解析对应的源代码，以便于调试(在开发人员工具的 sources 面板就会多出一个解析后的源文件)
- 同时因为有了映射的关系，如果源代码中出现了错误，也能很容易定位到源代码中对应的位置

> [!warning]
> source map 文件主要用于调试和定位错误，所以它对生产环境没有太大的意义，所以生产环境一般不需要生成 source map 文件

### 3. Source Map 总结

- 解决了在前端方向引入了构建编译之类的概念之后，导致前端编写的代码与运行的代码之间不一样所产生的调试的问题

## webpack 配置 Source Map

- webpack 支持对打包后的结果生成对应的 source map 文件，可通过 devtool 属性配置指定一个生成方式
  - 例如：devtool: 'source-map'
- webpack 基于对 source map 不同风格的支持，提供了26种不同的模式（实现方式）
  - 每种方式的效率和效果各不相同，简单表现为：效果越少的，生成速度越快

> [!info] > [webpack 官方文档](https://webpack.js.org/configuration/devtool/#devtool)提供了一个 devtool 不同模式对比表
>
> - 分别从初次构建(打包)速度「build」、监视模式重新打包速度「rebuild」、是否适合在生产环境中使用「production」以及 所生成的 source map 的质量「quality」4个维度对比了不同方式之间的差异

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/img/Engineering/Webpack/23.png)

> webpack 期望设置 devtool 时，使用特定的顺序(eval(none)除外)：[inline-|hidden-|eval-][nosources-][cheap-[module-]]source-map

- webpack 的配置文件，一般返回一个配置对象，也可以返回由多个配置对象组成的数组，从而实现一次构建执行多个配置任务，以下使用这种方式查看不同 devtool 模式的差异

### 1. source-map

- 会生成对应的 source map 文件，并以常规方式在打包文件最后添加 sourceMappingsURL 注释

```js
module.exports = {
  ...
  devtool: 'eval',
}
```

```js
//# sourceMappingURL=jquery-3.4.1.min.map
```

### 2. eval

- eval 即 JavaScript 当中的 eval 函数

```js
eval('console.log(123)')
```

- 它可以用来运行字符串中的 JavaScript 代码，默认运行在一个临时的虚拟机环境中
  - 在开发者环境中执行这条语句，可以看到它的来源指向VM**，点击可跳转到 sources 面板查看它的源代码，tab 名即虚拟机环境名称 VM**

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/img/Engineering/Webpack/24.png)

- 可以通过 sourceURL 修改它的运行环境的名称/所属文件路径
  - 控制台输入以下代码，它的来源就会指向`./foo/bar.js`

```bash
eval('console.log(123)' //# sourceURL=./foo/bar.js
```

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/img/Engineering/Webpack/25.png)

> [!warning]
> 代码依然在虚拟机上运行，只不过它告诉执行引擎这段代码所属的这个文件路径，它修改的只是个标识而已

- webpack 配置 devtool 使用 eval 模式，根据控制台提示就能找到错误所出现的文件

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/img/Engineering/Webpack/26.png)

> [!warning]
> 但是查看源代码时，只能看到对应的模块打包后的代码，这是为什么呢？
>
> - 因为使用 eval 模式，会在打包文件中将要执行的代码放到 eval 方法中执行，并且在 eval 函数执行的字符串最后，通过 sourceURL 去说明所对应的模块文件路径
> - 这样浏览器在通过 eval 执行这段代码时，就知道所对应的源代码文件，从而实现定位错误所出现的文件，只能去定位文件

- eval 模式只能正确定位到代码所属的模块文件（路径），这种模式不会生成 source map，也就是和 source map 没有太大关系
  - 构建速度最快：不需要生成 source.map
  - 效果最差：只能定位源代码文件的路径，而不知道具体的行列信息

### 3. eval-source-map

- 与 eval 模式类似，但它查看的代码内容，是编译前的内容，所以它能定位到具体的行和列的信息
- 它能生成了一个 Data URLs 地址的 source map

```js
// eval 执行的字符串
// ...执行代码
//# sourceURL=[module]
//# sourceMappingURL=data:application/json;charset=utf-8;base64,[base64内容]
```

### 4. eval-cheap-source-map

- cheap 表示会生成廉价（阉割版）的 source-map
- 通过开发人员工具跳转到源代码时，光标只会定位到代码的行，不会定位到代码的列
  - 因为查看的源码是经过 loader 转换后的代码(如果配置了对应的 loader)，导致定位到的行与实际源代码不一致无法定位到列
  - 由于少了一些效果，所以生成速度比 eval-source-map 快很多

### 5. eval-cheap-module-source-map

- 与 eval-cheap-source-map 的区别是，查看的源码与实际源文件一样（loader 转换前），但同样无法定位列

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/img/Engineering/Webpack/27.png)

### 6. devtool 总结

- devtool 是将几种配置拼接在一起使用，webpack 期望设置 devtool 时，使用特定的顺序(eval (none)除外)：
  - [inline/hidden/eval]-[nosources]-[cheap]-[module]-source-map

> [!info]
> 拆解介绍
>
> - eval：是否使用 eval 执行模块代码
> - inline：指定 source map 以 Data URLs 方式嵌入到打包文件
> - hidden：指定不会在打包文件中，通过注释引入 source map 文件
>   - 一般用于开发第三方包时使用
>     nosources：在开发人员工具中会看到行列信息，但无法看到源码（报错：Could not load content for xxxx）
>   - 用于在生产环境避免其他人看到源码的同时，定位错误
>   - 可能是通过未定义 sourcesContent 实现
> - source-map：表示会生成 source map，eval/inline 模式会以 Data URLs 形式嵌入到打包文件中，其他模式以物理文件（.map）形式生成
> - cheap：source map 是否包含行信息
>   - 会解析生成阉割版的 source map，即经过 loader 加工后的代码，并且无法定位到列
> - module：解析 loader 处理之前的源代码
>   - 会解析完整的 source map，即没有经过 loader 加工的与源代码一致的代码，因为它需要配置在 cheap- 后，所以同样无法定位到列

- 根据它们的定义可以理解以下规则
  - inline/hidden/nosources/cheap 需要与 source-map 一起使用
  - module 需要与 cheap 一起使用

> [!info]
> 使用建议
>
> - [eval/inline]-source-map 会将 source map 以 Data URLs 方式嵌入到打包文件中，会使文件变大很多，一般不建议使用

## Source Map 模式选择建议

- 开发环境：cheap-module-eval-source-map
  1. cheap：每行代码不会太长，只需要定位到行位置即可
  2. module：项目中一般都使用了 loader，经过 loader 转换过后的代码差异很大，需要查看加工前的代码
  3. 通过官方对比表可以看到，这个模式首次启动打包速度慢，但是重写打包速度快，开发中一般使用 webpack-dev-server 实现自动编译，所以首次启动打包速度慢无所谓
- 生产环境：none
  1. source map 会暴露源代码
  2. 调试是开发阶段的事情
- 如果没有信心预防生产环境报错的情况，建议使用 nosources-source-map，以定位位置又不至于暴露源代码内容

## webpack 自动刷新

- webpack-dev-server 主要为使用 webpack 构建的项目，提供友好的开发环境，和一个用于调试的开发服务器，它可以监视到代码的变化，自动打包，最后通过自动刷新页面的方式同步到浏览器以便于即时预览
  - 缺点：自动刷新浏览器会导致页面状态丢失
  - 期望：页面不刷新的前提下，模块也可以及时更新

## webpack HMR 热替换

> HMR(Hot Module Replacement)：模块热替换 / 模块热更新

> [!info]
> 计算机行业常见名词「热拔插」：在一个正在运行的机器上随时插拔设备，例如电脑上的 USB 端口就是可以热拔插的
>
> - 机器的运行状态不会受插拔设备的影响
> - 插上的设备可以立即开始工作

- 「模块热替换」中的「热」与「热拔插」中的「热」是一个道理，它们都是在运行过程中的即时变化
- 模块热替换就是应用运行过程中实时替换某个模块，应用运行状态不受影响
- 相对于自动刷新页面丢失页面状态，热替换只将修改的模块实时替换至应用中，不必完全刷新应用
- HMR 可以实时更新包括 CSS、JS 以及静态资源的所有模块
- HMR 是 Webpack 中最强大、最受欢迎的功能之一，它极大程度的提高了开发者的工作效率

### 1. 开启 HMR

- webpack-dev-server 已经集成了 HMR
- webpack 或 webpack-dev-server 可以通过在运行命令时添加`--hot`参数去开启这个特性
- 也可以通过在配置文件中配置 devServer.hot 为 true 开启

> [!warning]
> 如果通过配置文件启用，则需要配合 webpack 内置的热替换插件 HotModuleReplacementPlugin 才能完全启用 HMR
> 如果通过命令行参数`--hot`启用，则会自动添加此插件，而不需要将其添加到 webpack.config.js

```js
const webpack = require('webpack')

module.exports = {
  devServer: {
    hot: true
  },
  plugins: [new webpack.HotModuleReplacementPlugin()]
}
```

### 2. HMR 疑问

- 通过上述启用 HMR 后发现，修改 css 文件确实实现了热替换，而修改 js 文件依然会刷新页面
- 这是由于 webpack 中的 HMR 并不像其他特性一样开箱即用，它还需要进行一些额外的操作，才能正常工作
- webpack 中的 HMR 需要通过代码手动处理模块热替换逻辑（当模块更新后，如何把更新过的模块替换到运行页面中）
  - 如果没有手动处理，就会触发自动刷新页面，反之就不会触发自动刷新页面

#### 2.1 为什么样式文件的热更新开箱即用?

- 因为样式文件是通过 loader 处理的，上例中样式文件在 style-loader 中就已经自动处理了样式文件的热更新
- 可通过在开发这工具中查看样式文件的 source map，其中使用了处理热替换逻辑的代码：

```js
if (module.hot) {
  // ...
  module.hot.accept(/*...*/)
  // ...
}
```

#### 2.2 为什么样式文件可以自动处理，而脚本文件需要手动处理？

- 因为样式文件变更后，只需要将样式文件的内容替换到页面中，就可以实现样式的即时更新
- 而 JavaScript 模块是没有任何规律的：模块可能导出的是一个对象，一个字符串，或者一个函数，开发中对这些导出的使用方式也是不同的
- 所以 webpack 面对这些毫无规律的 JavaScript 模块，不知道如何处理当前更新后的模块
  - 也就没有办法实现一个可以通用所有情况的模块替换方案

#### 2.3 使用 vue-cli 或 create-react-app 创建的项目，没有手动处理，JS 照样可以热替换

- 这是因为项目使用了框架，框架提供了统一的规则，框架下的开发，每种文件都是有规律的
  - 例如在 react 中要求每个文件必须导出一个函数或一个类
- 有了规律，就可能有一个通用的替换方案
  - 例如如果每个文件都导出一个函数，就把这个函数拿过来再次执行一次，实现热替换
- 另一方面，通过脚手架创建的项目内部已经集成并使用了通用的 HMR 方案，所以不需要手动处理

### 3. HMR APIs

> HotModuleReplacementPlugin 为 JavaScript 提供了一套用于处理 HMR 的 API<br>
> 开发者需要在自己的代码中使用这套 API，以处理当某个模块更新后，应该如何替换到当前正在运行的页面中

- module.hot 是 HMR API 的核心对象
- module.hot.accept(arg1, arg2)用于注册，当某个模块更新后的处理函数
  - arg1 接收一个依赖模块的路径
  - arg2 就是依赖模块更新后的处理函数

```js
if (module.hot) {
  module.hot.accept('./editor', () => {
    console.log('editor 模块更新了，需要这里手动处理热替换逻辑')
  })
}
```

### 4. HMR 原生处理 JS 模块以图片资源热更新

```js
// main.js
if (module.hot) {
  let lastEditor = editor
  module.hot.accept('./editor', () => {
    // console.log('editor 模块更新了，需要这里手动处理热替换逻辑')
    const value = lastEditor.innerHTML
    document.body.removeChild(lastEditor)
    const newEditor = createEditor()
    newEditor.innerHTML = value
    document.body.appendChild(newEditor)
    lastEditor = newEditor
  })

  module.hot.accept('./better.png', () => {
    img.src = background
    console.log(background)
  })
}
```

### 4. HMR 注意事项

#### 4.1 处理 HMR 的代码报错会导致自动刷新

- 手动处理 HMR 时，如果处理逻辑的代码中报错导致失败，就会回退到自动刷新页面的方式实现替换
- 而由于自动刷新，处理逻辑代码中的报错信息就不会展示

> [!warning]
> 解决办法：配置 devServer.hotOnly:true 启用不刷新页面的热模块替换，代替 devServer.hot:true，或者命令行使用：`--hot-only`

#### 4.2 没启用 HMR 的情况下，HMR API 报错

- 项目中使用了 HMR APIs(module.hot.accept)，但是并没有配置完全启用 HMR，执行时就会报错：Cannot read property 'accept' of undefined
- 这是由于 module.hot 是内置插件 HotModuleReplacementPlugin 提供的，未启用 HMR（也就是未使用这个插件）， module.hot 就是 undefined

> [!warning]
> 解决办法：在使用 API 前先确认下 hot 是否开启，使用 if (module.hot)

#### 4.3 代码中写了很多与业务无关的代码（处理热替换的逻辑代码）

> [!warning]
> 解决办法：由于生产环境不需要启用 HMR，并且在调用 HMR APIs 前进行了 if(module.hot) 确认，所以生产环境打包后，处理热替换的代码就会编译为 if (false) {}，代码全部清空
