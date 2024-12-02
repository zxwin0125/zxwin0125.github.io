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
