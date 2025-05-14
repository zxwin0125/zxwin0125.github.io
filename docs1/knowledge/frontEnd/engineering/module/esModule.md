---
title: 深入 ES Module
date: 2021-08-12
order: 2
---

> 从两个维度学习 ES Modules
> 1. 作为一个规范标准，它约定了哪些特性和语法
> 2. 如何通过工具、方案解决它在运行环境中兼容性带来的问题

## ES Module 特性

> [!important]
> - ES Module 自动采用严格模式，忽略 'use strict'
> - 每个 ES Module 都是运行在单独的私有作用域中
> - ES Module 通过 CORS 的方式请求外部 js 模块的
> - ES Module 的 script 标签会延迟脚本执行

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <!-- 通过给 script 添加 type=module 属性，就可以使用 ES Module 的标准执行其中的 JS 代码 -->
    <script type="module">
        console.log('this is ES module')
    </script>

    <!-- 1.ESM 自动采用严格模式 -->
    <script type="module">
      // 严格模式代表，不能在全局范围直接使用 this
      console.log(this) // undefined
    </script>

    <!-- 2.每个 ES Module 都是运行在单独的私有作用域中 -->
    <script type="module">
        var foo = '123'
        console.log(foo)
    </script>
    <script type="module">
        console.log(foo)
    </script>

    <!-- 3.ES Module 是通过 CORS 的方式请求外部 JS 模块的，所以引用的外部文件的地址必须支持 CORS -->
    <script src="https://libs.qq.com/css/dialog-plus-min.js" type="module"></script>
    <script type="module" src="https://cdn.bootcdn.net/ajax/libs/vue/2.6.11/vue.min.js"></script>

    <!-- 4. 延迟执行，等到页面渲染完成过后才去执行脚本，与 def 属性一样 -->
    <script type="module">
        alert(0)
    </script>
    <p>1231</p>
</body>
</html>
```

## ES Module 导入导出

- export：模块内对外导出接口
- import：模块内导入其他模块提供的接口

### export 导出

1. 修饰成员声明

```javascript
// export 关键词修饰变量的声明
export var name = "foo module"

// export 关键词修饰函数的声明
export function hello(){
  console.log('hello')
}

// export 关键词修饰类的声明
export class Person{
    
}
```

2. 单独使用（模块尾部导出所有成员）

```javascript
var name = "foo module"

function hello(){
  console.log('hello')
}

class Person{
    
}

export { name , hello , Person }
```

3. 通过 as 关键词对成员进行重命名

```javascript
export { name as fooName , hello as fooHello , Person as fooPerson }
```

4. 导出默认成员

- 将成员重命名为 default ，这个成员会作为当前模块默认导出的成员

```javascript
export { name as default }
```

- export default 直接导出

```javascript
export default name
```

- 接收默认导出成员时可以根据需要随意命名：

```javascript
import aaa from './modules.js'
console.log(aaa)
```

### 注意事项

1. export default 后面可以跟变量名，也可以是值

```javascript
var name = 'wjp'
var age = 18

export default { name , age }
//export default { name , age } 后面的{ ... } 就是对象字面量
```

2. 使用 `export { ... }` 导出成员是一种固定的语法，不是对象字面量
3. 使用 `import { ... }` 导入成员是一种固定的语法，并不是解构（就只是用来提取目标模块导出的成员）
4. 导出的成员并不是成员的值，而是成员的引用关系
5. 模块导出的成员（引用关系）是只读的，不能被修改

```javascript
//--------------a.js
var name = 'jack'
var age = '18'

export { name , age }

setTimeout(()=>{
  name = 'ben'
},1000);

//--------------b.js
import { name, age } from './a.js'

console.log(name , age)

setTimeout(()=>{
  console.log(name , age)
},1000);
```

### 导入用法

1. 导入模块必须填写完成路径
  - 不能省略文件的拓展名
  - 载入 index.js 也必须填写完整的路径
  - 相对路径`./`不能省略，可以使用`/`开头的绝对路径，也可以使用完整的 url

2. 加载执行模块并不提取模块中的成员，`import {} from './module1.js'` 或者 `import './module1.js'`

3. 使用`import * as` 导入重命名需要载入模块的所有成员，`import * as a from './module1.js'`

4. 动态加载模块`import(...).then(module)`，ES Moudule 提供了全局的 import 函数，返回值是 Promise 对象
  - import 可以理解为导入模块的声明，在编译阶段执行的，在代码运行之前
  - import 命令具有提升效果，会提升到整个模块的头部，首先执行
  - import 关键词只能出现在模块的最顶层，不能出现在模块内的任何局部作用域内

5. 同时导出命名成员和默认成员
  - `import { name, default as a } from './module.js'`
  - `import a , { name } from './module.js'`

```javascript
// 1. import 引入的文件路径必须是完整路径名称，不能省略 .js 扩展名，这与 CommonJS 是有区别的
// 目录下的 index 文件名也不能省略， 而 CommonJS 是可以省略的
// 后续使用打包工具时，就可以省略扩展名和 index 文件名
import { name } from './modules'
console.log(name)
//  引入文件路径是相对路径时，不能省略./
import { name } from './modules.js'
// 省略掉./ 直接以字母开头，ES module会认为是在加载第三方模块
import { name } from 'modules.js'
// 以 / 开头的绝对路径，也就是从网站根目录下去找
import { name } from '/04-import/modules.js'
// 使用完整的url 加载模块，可以加载cdn 上的资源等
import { name } from 'http://localhost:3000/04-import/modules.js'
console.log(name)

// 2. 加载模块并不提取模块中的成员
import {} from './module1.js'
//--- 简写
import './module1.js

// 3. 导入需要载入模块的所有成员
import * as a from './module1.js'

// 4. 动态加载模块
import('./module1.js').then(function (module){
  console.log(module)
})

// 5. 同时导出命名成员和默认成员 
import { name ,default as a}='./module.js'
// 等价于
import a,{ name }='./module.js'
```

### 导出导入成员

- 除了导入模块，import 可以配合 export 使用，将导入结果作为当前模块的导出成员

```javascript
// button 模块
export const button1 = 'button模块1'
export const button2 = 'button2'
export default 'aaa'

// 中间模块 index
export { button1, button2, default as aaa } from './button.js'

// 导入模块
import { button1, button2, aaa } from "./components/index.js";
console.log(button1, button2, aaa)
```

## ES Module in Browser
### Polyfill 兼容方案

> ES Moudule 在浏览器环境下的兼容问题：以 IE11 为例（不兼容）

- Polyfill 可以让在浏览器直接支持 ES Moudule 绝大多数的特性
- 原理：将浏览器中不识别的 ES Module 交给 Balel 进行转换，对于需要 import 进来的文件，通过 Ajax 的方式请求回来后再通过 Babel 进行转换，从而支持 ES Module

> 在不支持 ES Modules 的浏览器中代码会执行两遍<br>
> 给 script 标签加上 nomodule 属性后，就只会在不支持 ES Moudle 的浏览器当中进行工作

```html
<!-- 最新的 IE 还是不支持 Promise，Promise 的 Polyfill -->
<script nomodule src="https://unpkg.com/promise-polyfill@8.1.3/dist/polyfill.min.js"></script>
<!-- babel 即时运行在浏览器的版本 -->
<script nomodule src="https://unpkg.com/browser-es-module-loader@0.4.1/dist/babel-browser-build.js"></script>
<!-- ES Module 的loader，通过 loader 把代码读出来再交给 babel 区转换 -->
<script nomodule src="https://unpkg.com/browser-es-module-loader@0.4.1/dist/browser-es-module-loader.js"></script>
<script type="module">
  import { foo } from './module.js'
  console.log(foo)
</script>
```

> [!warning]
> 这种兼容 ES Moudle 的方式只支持在本地测试，生产阶段基本不要使用<br>
> 因为他的原理是运行阶段动态解析脚本，效率很差，生产阶段还是应该执行预先编译好的代码，直接执行

## ES Module in Node.js

> ES Moudule 作为语言层面上的模块化标准，逐渐它会统一 JavaScript 领域所有的模块化需求<br>
> Node.js 作为 JavaScript 非常重要的一个领域，也已经逐步在支持这个特性了

### 支持情况

> 如何在 Node 环境下运行 ES Moudule

- 文件的拓展名为`.mjs`
- 启动 node 加上 `–experimental-modules`

```bash
node --experimental-modules app.mjs
```

- 在 node14 版本直接使用 node app.mjs 也不会有问题

```javascript
// 会报错，因为 import {...} 不是对导出对象的解构，而这些第三方模块还没有兼容分别导出各个模块成员
import { camelCase } from 'lodash'
console.log('ES Modules')

// 系统内置模块没问题，因为系统内置模块都做了兼容，除了默认导出所有成员的集合，还分别对所有模块成员做了导出
import { writeFileSync } from 'fs'
writeFileSync('./foo.txt', 'es module123')
```

### 与 CommonJS 交互

- ES Modules 中可以载入 CommonJS 模块
- CommonJS 不能载入 ES Module 模块
- CommonJS 始终都会导出一个默认成员

> [!warning]
> import 不是解构导出对象

```javascript
//---------------es-module.mjs
// 正常
import common from './common.js'
// 报错
import { common } from './common.js'
console.log(name)
//---------------common.js
module.exports = {
  foo:'common js '
} 
```

- node 环境不能在 CommonJS 模块中通过 require 载入模块

```javascript
// 报错
const module1 = require('./es-module.mjs')
```

### 与 CommonJS 的差异

- 这五个成员是 CommonJS 把模块包装成为一个函数，通过参数提供的成员
- ES Module 的加载方式发生变化，也就不再提供这五个成员了

```javascript
//----------------------CommonJS 模块全局成员
// 加载模块函数
console.log(require)
// 模块对象
console.log(module)
// 导出对象别名
console.log(exports)
// 当前文件绝对路径
console.log(__filename)
// 当前文件所在目录
console.log(__dirname)
// ---------------------- ES Module 模块全局成员
// require、module、exports 可以使用 import 和 export 去代替
import { fileURLToPath } from 'url'
import { dirname } from 'path'
// 获取__filename
const __filename = fileURLToPath(import.meta.url)
console.log( __filename )
// 获取__dirname
const __dirname = dirname( __filename )
console.log( __dirname )
```

### 新版本进一步支持

- 通过在 package.json 的 type 设置为 module，该项目下所有文件都会以 ESM 执行

```json
// package.json 文件
{
  "type": "module"
}
```

- 此环境下如果想要使用 CommonJS 规范，需要将文件拓展名修改为 `.cjs`

### Babel 兼容方案

- babel 是基于插件机制去实现的，核心模块并不会去转换我们的代码，具体转换我们代码中的每一个特性是通过插件来实现的（也就是说一个插件转换一个特性），preset-env 是一个插件的集合，它包含了 ES 最新标准所有的新特性
- 安装`@babel/node @babel/core`，然后在安装使用代码编译所需要用到的 babel 相关的模块，配置 babel
- 然后再执行 `yarn babel-node ...`

```bash
npm install @babel/node @babel/core @babel/preset-env --dev
```

- 配置 `.babelrc` 文件

```json
{
  "presets": ["@babel/preset-env"]
}
```

- 单独使用插件，例如使用`@babel/plugin-transform-modules-commonjs`

```json
{
  "plugins": ["@babel/plugin-transform-modules-commonjs"]
}
```
