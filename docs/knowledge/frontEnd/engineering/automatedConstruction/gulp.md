---
title: Gulp
date: 2021-04-07
order: 3
---

## gulp 与 grunt 的不同

> [!important]
> **<font color=red>易用</font>**
> - gulp 相比 grunt 更简洁，而且遵循代码优于配置策略，维护 gulp 更像是写代码
>
> **<font color=red>高效</font>**<br>
> - gulp 相比 grunt 更有设计感，核心设计基于 Unix 流的概念，通过管道连接，不需要写中间文件
>
> **<font color=red>高质量</font>**<br>
> - gulp 的每个插件只完成一个功能，这也是 Unix 的设计原则之一，各个功能通过流进行整合并完成复杂的任务
>   - 例如：grunt 的 imagemin 插件不仅压缩图片，同时还包括缓存功能
>   - 在 gulp 中，缓存是另一个插件，可以被别的插件使用，这样就促进了插件的可重用性
>   - 目前官方列出的有673个插件
>
> **<font color=red>易学</font>**<br>
> - gulp 的核心 API 只有5个，掌握了5个 API 就学会了 gulp，之后便可以通过管道流组合自己想要的任务
>
> **<font color=red>流</font>**<br>
> - 使用 grunt 的 I/O 过程中会产生一些中间态的临时文件，一些任务生成临时文件，其它任务可能会基于临时文件再做处理并生成最终的构建后文件
> - 而使用 gulp 的优势就是利用流的方式进行文件的处理，通过管道将多个任务和操作连接起来，因此只有一次 I/O 的过程，流程更清晰，更纯粹
>
> **<font color=red>代码优于配置</font>**<br>
> - 维护 gulp 更像是写代码，而且 gulp 遵循 CommonJS 规范，因此跟写 Node 程序没有差别

## gulp 的基本使用

> [!info]
> 使用 gulp 非常简单：
> - 现在项目中安装 gulp 的开发依赖，然后在根目录添加 gulpfile.js文件用于编写构建任务
> - 然后在命令行终端使用 gulp 模块的 cli 去运行这些任务

- 安装 gulp 模块作为开发依赖，会同时安装 gulp-cli 的模块

```bash
yarn add gulp --dev
```

- 创建 gulpfile.js 文件，定义一些需要 gulp 执行的构建任务
  - 因为这个文件运行在 node 环境中，所以它可以使用 commonJs 的规范
  - 这个文件定义构建任务的方式就是
    - 通过导出函数成员去定义（通过 exports 导出）
  - 最新的 gulp 当中取消了同步模式，约定每一个任务都必须是异步任务，当我们执行完任务后必须通过回调函数标记任务已经完成（函数成员的形参得到）

```javascript
// // 导出的函数都会作为 gulp 任务
// exports.foo = () => {
//   console.log('foo task working~')
// }

// gulp 的任务函数都是异步的
// 可以通过调用回调函数标识任务完成
exports.foo = done => {
  console.log('foo task working~')
  done() // 标识任务执行完成
}

// default 是默认任务
// 在运行是可以省略任务名参数
exports.default = done => {
  console.log('default task working~')
  done()
}

// v4.0 之前需要通过 gulp.task() 方法注册任务
const gulp = require('gulp')

gulp.task('bar', done => {
  console.log('bar task working~')
  done()
})
```

## gulp 的创建组合任务（并行任务和串行任务）

- 这里首先定义了三个函数，可以把这种未被导出的成员函数理解为私有任务
- 这三个成员函数并不能直接被 gulp 运行，可以通过 gulp 模块提供的 series、parallel 这两个 API 把它们组合成一个组合任务
  - 创建一个串行任务 foo：这个任务通过 series 函数创建
  - 创建一个并行任务 bar：这个任务通过 parallel 函数创建

```javascript
const { series, parallel } = require('gulp')

const task1 = done => {
  setTimeout(() => {
    console.log('task1 working~')
    done()
  }, 1000)
}

const task2 = done => {
  setTimeout(() => {
    console.log('task2 working~')
    done()
  }, 1000)  
}

const task3 = done => {
  setTimeout(() => {
    console.log('task3 working~')
    done()
  }, 1000)  
}

// 让多个任务按照顺序依次执行
exports.foo = series(task1, task2, task3)

// 让多个任务同时执行
exports.bar = parallel(task1, task2, task3)
```

## gulp 的异步任务

### 通过回调的方式去解决

- 这个回调函数和 node 中的回调函数一个标准，都是一种叫做错误优先的回调函数
- 当我们在执行过程中报出一个错误，阻止剩下任务执行的时候，可以通过给回调函数传入一个参数是错误对象就可以了
- 命令行执行中会报出这个错误，而且如果是多个任务同时执行，那后续的任务也不会再工作了

```javascript
// 任务的函数中接收一个回调函数形参
exports.callBack = (done)=>{
  console.log("callBack task!");
  // 在任务执行完毕后调用这个回调函数，从而通知 gulp 任务完成
  // done(); 
  done( new Error('task failed!') ); 
}
```

### Promise

- resolve 中不需要返回任何值，因为 gulp 会忽略掉它
- 如果 return 的是 reject，那么 gulp 会认为它是一个失败的任务，同样也会终止后续任务的执行

```javascript
exports.promise = ()=>{
  console.log("promise task!");
  // 在任务的执行函数中 return 一个 promise 对象
  // return Promise.resolve();

  return Promise.reject( new Error('task failed!') );
}
```

### async await

- 理解为 Promise 的语法糖

```javascript
const timeout = time => {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}

exports.async = async () => {
  await timeout(1000)
  console.log('async task')
}
```

### stream

> JavaScript 中处理异步函数的常见方式，在 gulp 中都被支持<br>
> gulp 中还支持 stream 这种方式，因为构建系统大都是在处理文件

- 在任务函数中需要返回一个 stream 对象
  - 例如在 fs 模块中提供的 createReadStream 创建一个读取文件的文件流对象
    - 通过 writeReadStream 创建一个写入文件的文件流对象
    - 通过 pipe 的方式导入到 writeReadStream 中，文件复制
    - 把 readStream 给 return 出来

```javascript
const fs = require("fs");
exports.stream = ()=>{
    const readStream = fs.createReadStream('package.json')
    const writeStream = fs.createWriteStream('temp.txt')
    readStream.pipe(writeStream);
    return readStream;
}
```

- 执行 `yarn gulp stream` 可以发现这个任务也是可以正常开始正常结束
- 它结束的时机就是 readStream 在 end 的时候 ，因为 stream 中都有一个 end 事件，一旦文件读取完成后就会触发 end 事件，从而 gulp 就知道任务已完成

> [!important]
> 模拟一下 gulp 中做的事情：
> - 接收到 readStream 后为它注册了一个 end 事件
> - 在 end 事件中结束了任务的执行
> - 执行 stream2，可以发现任务也可以正常结束，这意味着其实 gulp 也只是注册这个事件去监听任务的结束罢了

```javascript
exports.stream2 = (done)=>{
  const readStream = fs.createReadStream('package.json')
  const writeStream = fs.createWriteStream('temp.txt')
  readStream.pipe(writeStream);
  readStream.on('end',()=>{
      done()
  })
}
```

## gulp 构建过程核心工作原理

> 构建过程大多数情况下都是将文件读取出来，进行转换过后写入另一个位置

- 通过原始的 node 文件流 API 模拟实现一下这个过程
  - 创建文件的读取流
  - 导入 stream 模块的 transform 类，这个类型可以创建文件转换流对象
  - 创建文件的写入流
  - 把读取到的数据导入转换流进行转换后，最后导入到写入文件流中，完成文件的转换构建过程
  - 最后通过 return 的方式把 steam 返回，这样 gul p就可以根据流的状态判断任务是否执行完成

```javascript
const fs = require("fs");
const { Transform } = require("stream");
exports.default =  ()=>{
  // 文件读取流
  const read = fs.createReadStream('normallize.css');
  // 文件写入流
  const write = fs.createWriteStream('normallize.min.css');
  // 文件转换流
  // Transform 中需要指定一个 transform 属性，这个属性就是转换流的核心转换过程     
  const transform = new Transform({
    transform:(chunk,encoding,callBack)=>{
      // chunk 可以获得读取流中读取到的内容，它读出来的是一个字节数组，可以通过 toString 的方式将它转换为字符串
      const input = chunk.toString(); // input 就是读取到文件的文本内容
      const output = input.replace(/\s+/g,'').replace(/\/\*.+?\*\//g, '') // 通过 replace 把空白字符、css 注释全部替换掉，赋值给 output 变量
      // 在 callBack 中将转换后的结果返回出去
      callBack(null,output)   // callBack 是一个错误优先的回调函数，第一个参数是错误对象
    }
  })

  // 把读取到的数据导入转换流进行转换后 最后导入到写入文件流中，完成文件的转换构建过程
  read
    .pipe(transform)
    .pipe(write)
  return read;
}
```

> [!important]
> 这就是 gulp 中一个常规任务的核心工作过程：
> - **<font color=red>输入（读取文件） -> 加工（转换流的转换逻辑） -> 输出（写入文件）</font>**

- gulp 的官方定义就是 The streaming build system，基于流的构建过程
- 因为 gulp 希望实现一个构建管道的概念，在后续做一些扩展插件的话就会有一个很统一的方式

## gulp 文件操作 API + 插件的使用

> [!info]
> gulp 中也提供了专门用于去创建读取流和写入流的 API， 更强大也更易于使用
> 至于负责文件加工的转换流一般是通过独立的插件来提供

> [!important]
> 一般通过 gulp 创建构建任务的工作流程
> - 先通过 src 方法去创建读取流
> - 再通过插件提供的转换流来实现文件加工
> - 最后通过 gulp 提供的 dist 方法创建写入流从而写入到目标文件

- `src()` 接受 glob 参数，并从文件系统中读取文件然后生成一个 Node 流（stream），它将所有匹配的文件读取到内存中并通过流（stream）进行处理
- `dest()` 可以用在管道（pipeline）中间用于将文件的中间状态写入文件系统
- 通过插件提供的转换流来实现文件加工

```javascript
const { src , dest } = require("gulp");
// 安装 gulp-clean-css 插件，这个插件提供了压缩 css 代码的转换流
const cleancss = require("gulp-clean-css")
// 安装 gulp-rename 的插件，这个插件
const rename = require('gulp-rename')

exports.default =  ()=>{ 
  // 相当于 node 原始 api，gulp 提供的 api 更强大一些，在这里可以使用通配符的方式去匹配批量文件
  const read = src('src/normallize.css')
  const write = dest('dist')
  read
    .pipe(cleancss()) // 文件流先 pipe 到 cleancss 文件转换流中进行转换
    .pipe(rename({
        extname:'.min.css' // extname 用于指定重命名的扩展名为 .min.css
    })) // 文件流先 pipe 到 rename 文件转换流中进行转换 
    .pipe(write)
  // 将创建的读取流 return 出去，这样 gulp 就可以控制我们的任务完成
  return read;
}
```

- 这种通过 src 去 pipe 到 一个或多个插件转换流，再 pipe 到写入流这样的过程，就是使用 gulp 的常规过程

## gulp 自动化构建案例

> 学习下如何使用 gulp 来完成一个网页应用的自动化构建工作流

### style 样式编译（sass）

- 使用 gulp-sass 插件

> [!warning]
> gulp-sass 会自动帮我们安装 node-sass 的核心转换模块

```javascript
const { src, dest } = require('gulp')
const sass = require('gulp-sass')

const style = () =>{
  // src 读取流                              
  // base 转换时基准路径,保留 src 后面原始目录结构
  return src('src/assets/styles/*.scss', { base:'src' })
    .pipe(sass({ outputStyle:'expanded' })) // 插件提供的一般都是方法，调用返回一个文件转换流，outputStyle:'expanded' 样式选择展开
    .pipe(dest('dist'))
}

module.exports = {
  style
}
```

### JavaScript 脚本编译（babel）

- 使用 gulp-babel 插件

> [!warning]
> gulp-babel 这个插件只是唤醒 babel-core 模块中的转换过程，需要手动安装

```javascript
const babel = require('gulp-babel')

const script = ()=>{
  return src('src/assets/scripts/*.js', { base:'src' })
  // babel 默认只是 ECMAScript 的一个转换平台，具体做转换的其实是 babel 它内部的一些插件
  // 而 preset 就是一些插件的集合，比如 preset-env 就是最新的 ES 最新的一些整体特性的打包，使用它就会把所有特性全部做转换
  // 也可以安装对应的 babel 转换插件，然后指定对应的转换插件，它就会只转换对应的特性
  .pipe(babel({presets:[ '@babel/preset-env' ] }))   
  .pipe(dest('dist'))
}

module.exports = {
  script
}
```

### 页面模版编译

- 模板文件就是 html 文件，为了把 html 中一些数据抽象出来使用了模板引擎，这里使用的模板引擎是 swig
- 使用 gulp-swig 的转换插件

```javascript
const swig = require('gulp-swig')

const page = () => {
  return src('src/*.html', { base: 'src' })
  .pipe(swig({ data, defaults: { cache: false } }))	// data 是页面中需要用到的数据，cache 防止模板缓存导致页面不能及时更新
  .pipe(dest('dist'))
}

module.exports = {
  page
}
```

- 利用 parallel 将三个任务进行组合，同时编译

```javascript
const { src, dest, parallel } = require('gulp')

const compile = parallel(style, script, page)

module.exports = {
  compile
}
```

### 图片和字体文件转换

- 利用 gulp-imagemin 插件（无损的图片压缩，只是删除了一些元数据的信息）处理一下图片和字体文件
- imagemin 插件内部依赖的模块同样是一些通过 c++ 完成的模块，就需要去下载二进制的程序集

```javascript
const imagemin = require('gulp-imagemin')

const image = () => {
  return src('src/assets/images/**', { base: 'src' })
    .pipe(imagemin())
    .pipe(dest('dist'))
}

const font = () => {
  return src('src/assets/fonts/**', { base: 'src' })
  // 有的时候字体文件夹下可能会有 svg 文件也可以通过 imagemin 压缩一下，对于 imagemin 不能处理的文件它不会去处理
    .pipe(imagemin())
    .pipe(dest('dist'))
}

const compile = parallel( style, script, html, image, font )

module.exports = {
  compile
}
```

### 其他文件及文件清除

- 其他文件

```javascript
// 额外的文件直接通过拷贝的方式拷贝过去就可以了
const extra = ()=>{
  return src('public/**', { base: 'public' })
    .pipe(dest('dist'))
}

// compile 完成 src 文件夹下的所有文件且完成转换
const compile = parallel( style, script, html, image, font )
// build 通过 parallel 在组合的基础上再次组合将 compile 任务和 extra 进行组合，后续可以使用 build 完成所有文件的构建
const build = parallel( compile, extra )

module.exports = {
  build
}
```

- 利用 del 插件进行文件清除

> [!warning]
> del 不是 gulp 的插件，但是在 gulp 中可以使用，因为 gulp 并不只是通过 src 找文件流然后最终 pipe 到 dist 中

- del 可以删除指定文件，并且它是一个 promise 方法

```javascript
// 有了 del 后可以通过 del 指定一个数组，放入任意的文件路径
const clean = () => {
  // 就不再是 return 一个 src 之类的东西
  // 它返回的是一个 promise，意味着在 delete 完成后 gulp 可以标记 clean 任务完成
  return del(['dist'])
}

const build =  series(
  clean,
  parallel( compile, extra )
)
```

### 自动加载插件

> 随着构建任务越来越复杂，使用到的插件也越来越多，如果都是手动的加载插件的话，那么 require 的操作会非常多，在这里可以通过 gulp-load-plugins 插件来解决这个小问题

```javascript
// 通过 load-plugins 提供的 api 自动去加载全部的 plugin
const loadPlugins = require('gulp-load-plugins')
// plugins 是一个对象，所有的插件都会自动成为这个对象下面的属性
const plugins = loadPlugins()

const style = () =>{
  return src('src/assets/styles/*.scss', { base:'src' })
    .pipe(plugins.sass({ outputStyle:'expanded' }))
    .pipe(dest('dist'))
}
```

### 热更新开发服务器

- 除了对文件的构建操作外，还需要一个开发服务器，用于在开发时调试应用
- 使用 gulp 去启动管理这个开发服务器，这样就可以配合其他构建任务去实现修改文件后自动编译并且自动更新浏览器页面
- browser-sync 这个模块可以提供给我们一个开发服务器，相比较普通使用 express 创建的服务器，有更强大的功能，它支持代码更改之后的自动热更新到浏览器中

```javascript
const browserSync = require('browser-sync')
// 它会自动创建一个开发服务器
const bs = browserSync.create()

// 将开发服务器单独定义到 serve 的任务中去启动
// 启动这个任务会自动唤醒浏览器并打开页面
const serve = ()=>{
  bs.init({
    notify: false,
    port: '2080', // 端口
    // open: false, // 启动服务时 取消自动打开页面
    files: 'dist/**', // 文件修改之后 自动更新 浏览器  // 热更新
    server: {  
      baseDir: 'dist',  // server 中要指定一下网站的根目录
      routes: {
        // 页面中有些文件路径指向，优先于 baseDir 的配置
        '/node_modules': 'node_modules'
      }
    }
  })
}
```

### 监视文件变化

- 有了开发服务器后，就要考虑 src 目录下的源代码修改后自动编译，这个需要借助 gulp 提供的另一个 API：watch
- watch 会监视一个文件路径的通配符，根据这些文件的变化决定是否要执行一些任务
- 这样就可以实现之前的设想「文件修改后自动编译到 dist 目录，然后自动同步到浏览器」

```javascript
const serve = ()=>{
  // watch 接收两个参数，第一个参数是 globs--通配符（所有产生构建任务的路径），第二个参数就是要执行的任务
  watch( 'src/assets/styles/*.scss' , style )
  watch( 'src/assets/scripts/*.js' , script )
  watch( 'src/*.html' , html )
  
  // watch( 'src/assets/images/*.*' , image )
  // watch( 'src/assets/fonts/**' , font )
  // watch( 'public/**' , extra )
	// 对于监听图片，字体和其他一些静态文件，在开发阶段没有什么意义，会减慢构建速度
  // 这样就可以实现文件修改后自动编译到 dist 目录，然后自动同步到浏览器

  bs.init({
    notify: false,
    port: '2080',
    // open: false, //启动服务时 取消自动打开页面
    files: 'dist/**', // 文件修改之后 自动更新 浏览器
    server: {  
      baseDir: ['dist','src','public'],  //server中要指定一下网站的根目录
      routes: {
        // 页面中有些文件路径指向，优先于 baseDir 的配置
        '/node_modules':'node_modules'
      }
    }
  })
}
```

### 构建优化

1. 考虑到如果 serve 之前不存在编译后的 dist 目录，所以需要增加一个组合任务：develop，去执行一下 compile 任务：

```javascript
const develop = series(compile, serve)
```

2. 之前 compile 里面的 image，font 任务可以拿掉
  - 因为 html，scss，js 文件必须要经过编译后才能在浏览器环境运行
  - 而图片、字体还有那些静态资源在开发阶段则不需要进行编译，可以直接请求源文件，这样在开发阶段就可以减少一次构建过程
  - image，font 任务就可以加入 build 任务中，最后在 build 项目时统一进行编译

```javascript
// compile 在上线之前也会用到，不过它是一个子任务，主要在开发阶段使用
const compile = parallel( style, script, html )
// build 任务就是上线之前要执行的任务
const build = series( clean, parallel( compile, extra ) )
const develop = series(compile, serve)
```

3. 图片、字体还有那些静态资源在开发阶段也要进行热更新：在 serve 任务中再添加一个 watch 监听它们的源文件

```javascript
watch([
    'src/assets/images/**',
    'src/assets/fonts/**',
    'public/**'
  ], bs.reload) // 监听这三种文件变化后，调用 bs.reload 方法，reload 也可以理解为一个任务，因为在 gulp 中一个任务就是一个函数
```

- 这样 develop 任务就以一个最小的代价把应用跑起来了，上线之前执行 build 任务以最大模型方式把所有的任务都执行一次

### useref 文件引用处理（引用关系）

- html 文件中会有一些引用 node_modules 文件中的一些依赖，这些文件没有被打包到 dist 目录中
  - 此时如果将 dist 目录部署上线后会出现问题，因为找不到这些文件
  - 在开发阶段没有出现问题是因为在开发服务器中做了路由映射
- 可以借助 gulp-useref 插件解决这个问题
  - 自动的把 useref 遇到的构建注释当中引入的资源全部合并到同一个文件当中
  - 比如：它会自动将注释的开始标签和结束标签中的文件打包到一个文件中

```html
<!-- build:css assets/styles/vendor.css -->
<link rel="stylesheet" href="/node_modules/bootstrap/dist/css/bootstrap.css">
<!-- endbuild -->
<!-- build:css assets/styles/main.css -->
<link rel="stylesheet" href="assets/styles/main.css">
<!-- endbuild -->
```
```javascript
const useref = () => {
  // 这个时候找的 html 是 dist 目录下的 html
  return src('dist/*.html', { base: 'dist' })
    // 把创建的读取流 pipe 到 useref 插件，这个插件会被自动加载进来，useref 插件会创建一个转换流
    // 这个转换流会把 html 中的构建注释做一个转换：searchPath 找到这些文件 dist 和根目录
    .pipe(plugins.useref({ searchPath: ['dist', '.'] }))
    .pipe(dest('dist'))
}
```

### 文件压缩

- 压缩 HTML 使用 gulp-htmlmin
- 压缩 JavaScript 使用 gulp-uglify
- 压缩 CSS 使用 gulp-clean-css
- 利用 gulp-if 插件进行文件类型判断

```javascript
const useref = () => {
  return src('dist/*.html', { base: 'dist' })
    .pipe(plugins.useref({ searchPath: ['dist', '.'] }))
    // if 会自动创建转换流，只是在内部会根据判断条件决定是否执行这个任务
    .pipe(plugins.if(/\.js$/, plugins.uglify()))
    .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
    .pipe(plugins.if(/\.html$/, plugins.htmlmin({
      collapseWhitespace: true, // 折叠空白字符
      minifyCSS: true, // 内部标签压缩
      minifyJS: true,
    })))
    .pipe(dest('temp'))
}
```

### 重新规划构建过程

- 因为执行 useref 任务的时候同时涉及到对 dist 目录下文件的读写操作，所以需要一个中间目录暂时存放一下临时文件
- html，css，js 文件在开发阶段需要频繁的编译转换，而 image、font 和其他静态文件则只是在 build 的时候才会去进行转换
- 总而言之，只有会被 useref 影响到的才会去修改

### 补充

> 把需要单独使用的任务导出，一些组合起来使用的任务则不必都导出来，其他使用者用起来会方便一些

- 一般将 clean、develop、serve 任务导出使用，其他任务则被加入其中自动化使用
- 还可以把这三个任务定义到 package.json 中的 scripts 中，这样更容易理解一点，使用更方便

```json 
// 注意：npmScripyts 会自动找到我们所执行的命令在 node_modules 中的命令文件，就不需要 yarn 去找这个命令了 
"scripts": {
  "clean": "gulp clean",
  "build": "gulp build",
  "develop": "gulp develop"
}
```
- 在 gitignore 文件中需要忽略掉生成的这些目录：temp、dist

### 总结

- 在开发过程中创建的这个构建的自动化工作流，在开发时会被重复使用到，但是不推荐每次创建项目都把它拷贝过去直接使用
- 因为这个工作流难免有一些不足、或者随着时间推移有些插件或模块更新时使用方式出现改变，到时候所以项目的这个构建文件都需要被修改
