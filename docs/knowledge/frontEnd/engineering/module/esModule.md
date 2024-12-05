---
title: 深入 ES Modules
date: 2021-08-12
order: 2
---

ES Modules
从两个维度学习ES Modules：1、作为一个规范标准，它约定了哪些特性和语法2、如何通过工具解决它在运行环境中兼容性带来的问题

ES Module的基本特性：
ESM自动采用严格模式，忽略’use strict’
每个ES Module都是运行在单独的私有作用域中
ESM通过CORS的方式请求外部js模块的
ESM的script标签会延迟脚本执行
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <!-- 通过给 script 添加 type=module 属性，就可以使用ES Module 的标准执行其中的JS代码 -->
    <script type="module">
        console.log('this is ES module')
    </script>

    <!-- 1.ESM 自动采用严格模式 -->
    <script type="module">
        console.log(this)
    </script>

    <!-- 2.每个ES Module都是运行在单独的私有作用域中 -->
    <script type="module">
        var foo = '123'
        console.log(foo)
    </script>
    <script type="module">
        console.log(foo)
    </script>

    <!-- 3.ES Module是通过 CORS 的方式请求外部JS 模块的，所以引用的外部文件的地址必须支持CORS -->
    <script src="https://libs.qq.com/css/dialog-plus-min.js" type="module"></script>
    <script type="module" src="https://cdn.bootcdn.net/ajax/libs/vue/2.6.11/vue.min.js"></script>

    <!-- 4. 延迟执行，等到页面渲染完成过后才去执行脚本，与def属性一样 -->
    <script type="module">
        alert(0)
    </script>
    <p>1231</p>
</body>
</html>

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
ES Module导入导出
export：模块内对外导出接口

import：模块内导入其他模块提供的接口

export导出：

1、修饰成员声明

// export关键词修饰变量的声明
export var name = "foo module"
// export关键词修饰函数的声明
export function hello(){
    console.log('hello')
}
// export关键词修饰类的声明
export class Person{
    
}
1
2
3
4
5
6
7
8
9
10
2、单独使用（模块尾部导出所有成员）

var name = "foo module"
function hello(){
    console.log('hello')
}
class Person{
    
}
export { name , hello , Person }
1
2
3
4
5
6
7
8
3、通过 as 关键词对成员进行重命名

export { name as fooName , hello as fooHello , Person as fooPerson }
1
4、导出默认成员

将成员重命名为 default ，这个成员会作为当前模块默认导出的成员;

export { name as default }
1
export default 直接导出

export default name
1
接收默认导出成员时可以根据需要随意命名：

import aaa from './modules.js'
console.log(aaa)
1
2
ES Module导入导出的注意事项：
export default 后面可以跟变量名，也可以是 值

var name = 'wjp'
var age = 18
export default { name , age }
//export default { name , age } 后面的{ ... } 就是对象字面量
1
2
3
4
使用 export { … } 导出成员 是一种固定的语法，不是对象字面量

使用 import { … } 导入成员 是一种固定的语法，并不是解构（就只是用来提取目标模块导出的成员）

导出的成员并不是成员的值，而是成员的引用关系

//--------------a.js
var name = 'jack'
var age = '18'
export {name , age}
setTimeout(()=>{
    name = 'ben'
},1000);
//--------------b.js
import {name,age} from './a.js'
console.log(name , age)
setTimeout(()=>{
    console.log(name , age)
},1000);
1
2
3
4
5
6
7
8
9
10
11
12
13
模块导出的成员（引用关系）是只读的 ，不能被修改
ES Moudule导入用法
1、导入模块必须填写完成路径

不能省略文件的拓展名
载入index.js也必须填写完整的路径
相对路径./不能省略，可以使用’/'开头的绝对路径，也可以使用完整的url
2、加载模块并不提取模块中的成员import {} from './module1.js 或者 import './module1.js

3、使用import * as 导入重命名需要载入模块的所有成员。import * as a from './module1.js

4、动态加载模块**.import(...).then(module) ：ES Moudule提供了全局的import函数，返回值是Promise对象

import可以理解为导入模块的声明， 在编译阶段执行的，在代码运行之前
import命令具有提升效果，会提升到整个模块的头部，首先执行。
import关键词只能出现在模块的最顶层，不能出现在模块内的任何局部作用域内
5、同时导出命名成员和默认成员。

import { name ,default as a} from './module.js
import a , { name } from './module.js
// 1、---import引入的文件路径必须是完整路径名称，不能省略.js扩展名，这与commonJs是有区别的
// 目录下的index文件名也不能省略， 而commonJs是可以省略的
//  后续使用打包工具时，就可以省略扩展名和index文件名
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

//2、加载模块并不提取模块中的成员
import {} from './module1.js'
//--- 简写
import './module1.js

// 3、导入需要载入模块的所有成员
import * as a from './module1.js'

// 4、动态加载模块
import('./module1.js').then(function (module){
    console.log(module)
})

// 5、同时导出命名成员和默认成员 
import { name ,default as a}='./module.js'
// 等价于
import a,{ name }='./module.js'

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
ES Moudule导出导入成员
除了导入模块，import可以配合export 使用。将导入结果作为当前模块的导出成员。

//button模块
export const button1 = 'button模块1'
export const button2 = 'button2'
export default 'aaa'
//中间模块 index
export {button1 , button2 , default as aaa} from './button.js'
//导入模块
import { button1 , button2 ,aaa} from "./components/index.js";
console.log(button1 , button2 ,aaa)
1
2
3
4
5
6
7
8
9
ES Moudule 浏览器环境 Polyfill
接下里看一下ES Moudule 在浏览器环境下的兼容问题：以 IE11 为例（不兼容）

Polyfill 可以让 在浏览器直接支持ES Moudule绝大多数的特性

原理：将浏览器中不识别的ES Module交给Balel进行转换，对于需要 import 进来的文件，通过Ajax的方式请求回来后再通过Babel进行转换，从而支持ES Module

在不支持ES Modules的浏览器中代码会执行两遍。给script标签加上nomodule属性后，就只会在不支持ES Moudle的浏览器当中进行工作

//最新的IE 还是不支持Promise，  Promise的Polyfill
<script nomodule src="https://unpkg.com/promise-polyfill@8.1.3/dist/polyfill.min.js"></script>
//babel即时运行在浏览器的版本
<script nomodule src="https://unpkg.com/browser-es-module-loader@0.4.1/dist/babel-browser-build.js"></script>
//ES Module的loader，通过loader把代码读出来再交给babel区转换
<script nomodule src="https://unpkg.com/browser-es-module-loader@0.4.1/dist/browser-es-module-loader.js"></script>
<script type="module">
    import { foo } from './module.js'
    console.log(foo)
</script>


1
2
3
4
5
6
7
8
9
10
11
12
注意：这种兼容ES Moudle的方式只支持我们在本地测试，生产阶段基本不要使用，因为他的原理是运行阶段动态解析脚本，效率很差。生产阶段还是应该执行预先编译好的代码，直接执行。

ES Moudule in NodeJs
ES Moudule 作为语言层面上的模块化标准，逐渐它会统一JS 领域所有的模块化需求。NodeJS作为JAVAScript 非常重要的一个领域，也已经逐步在支持这个特性了。

如何在NodeJS环境下运行ES Moudule：

文件的拓展名为.mjs
启动node加上–experimental-modules
node --experimental-modules app.mjs
1
在node14版本直接使用node app.mjs也不会有问题

// 会报错，因为import{...}不是对导出对象的解构,而这些第三方模块还没有兼容分别导出各个模块成员
import { camelCase } from 'lodash'
console.log('ES Modules')

// 系统内置模块没问题，因为系统内置模块都做了兼容，除了默认导出所有成员的集合，还分别对所有模块成员做了导出
import {writeFileSync} from 'fs'
writeFileSync('./foo.txt', 'es module123')
1
2
3
4
5
6
7
ES Modules与CommonJs交互
ES Modules中可以载入CommonJs模块
CommonJs 不能载入ES Modules 模块
CommonJs 始终都会导出一个默认成员
注意import {…}不是解构导出对象
//---------------es-module.mjs
// 正常
import common from './common.js'
// 报错
import {common} from './common.js'
console.log(name)
//---------------common.js
module.exports = {
    foo:'common js '
}
1
2
3
4
5
6
7
8
9
10
node环境不能在CommonJs模块中通过requre载入模块

//报错
const module1 = require('./es-module.mjs')
1
2
ES Modules与CommonJs的差异
这五个成员是CommonJs把模块包装成为一个函数，通过参数提供的成员；

ES Module的加载方式发生变化，也就不再提供这五个成员了。

//----------------------CommonJs 模块全局成员
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
//----------------------ES Module 模块全局成员
//require、module、exports可以使用import和export去代替
import { fileURLToPath} from 'url'
import { dirname } from 'path'
//获取__filename
const __filename = fileURLToPath(import.meta.url)
console.log( __filename )
//获取__dirname
const __dirname = dirname( __filename )
console.log( __dirname )


1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
Node新版本对ESM的支持
通过在package.json的type设置为module,该项目下所有文件都会以ESM执行

//package.json文件
{
    "type": "module"
}
1
2
3
4
此环境下如果想要使用CommonJs规范,需要将文件拓展名修改为.cjs

Babel兼容方案
babel是基于插件机制去实现的，核心模块并不会去转换我们的代码，具体转换我们代码中的每一个特性是通过插件来实现的；（也就是说一个插件转换一个特性），preset-env 是一个插件的集合，它包含了ES 最新标准所有的新特性。

安装@babel/node @babel/core，然后在安装使用代码编译所需要用到的babel相关的模块，配置babel。然后再执行yarn babel-node ...

npm install @babel/node @babel/core @babel/preset-env --dev
1
配置 .babelrc 文件

{
    "presets": ["@babel/preset-env"]
}
1
2
3
使用@babel/plugin-transform-modules-commonjs

{
    "plugins": ["@babel/plugin-transform-modules-commonjs"]
}
