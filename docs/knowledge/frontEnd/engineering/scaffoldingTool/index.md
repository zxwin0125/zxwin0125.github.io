---
title: 如何开发脚手架工具
date: 2021-02-14
order: 1
---

## 脚手架工具概述

> 脚手架工具的本质作用：创建项目基础结构、提供项目规范和约定

- 通常在去开发相同类型的项目时都会有一些相同的规范和约定，其中包括：
  - 相同的组织结构
  - 相同的开发范式
  - 相同的模块依赖
  - 相同的工具配置
  - 相同的基础代码
- 这样一来就会出现，每次搭建新项目时有大量重复工作要做，脚手架工具就是去用来解决这一问题的
- 我们可以通过脚手架工具去快速搭建特定类型的项目骨架，基于这个骨架完成后续的开发工作，像一些 IDE 创建项目的过程就是一个脚手架的工作流程
- 前端脚手架
  - 在前端项目创建过程中，由于前端技术选型比较多样，又没有一个统一的标准，所以前端脚手架不会集成在某一个IDE中，一般都是以一个独立的工具存在，相对会复杂一些
  - 本质的目标是一样的，都是为了解决创建项目时那行复杂的工作

## 常用的脚手架工具

- 目前市面上有许多成熟的前端脚手架工具，但大都是为了特定项目类型服务，根据信息创建对应的项目基础结构，适用于自身所服务的框架的那个项目
  - 例如：
    - React.js 项目 --> creat-react-app
    - Vue.js 项目 --> vue-cli
    - Angular.js 项目 --> angular-cli
- 还有一类以 Yeoman 这样的工具为代表的通用型项目脚手架工具
  - 它们可以根据一套模板生成一个对应的项目结构，这种类型的脚手架一般都很灵活，很容易扩展
- 还有一类以 Plop 为代表的脚手架
  - 它们用于在项目开发过程中创建一些特定类型的文件，例如创建组件/模板所需要的文件，这些文件一般都是由特定结构组成的，有相同的结构

## Yeoman 通用脚手架工具剖析

- Yeoman 是最老牌、最强大、最通用的脚手架工具，用于创造现代化 Web 应用的脚手架工具(The web's scaffolding tool for medern webapps)
- Yeoman 不同于 vue-cli 更像是一个脚手架的运行平台，我们可以通过 Yeoman 搭配不同的 generator 创建任何类型的项目，我们可以创建我们自己的 Generator，从而去创建我们自己的前端脚手架
- 缺点是，在框架开发的项目中，Yeoman 过于通用，不够专注

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Engineering/06.png)

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Engineering/07.png)

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Engineering/08.png)

### Yeoman 基础使用

- Yeoman 要搭配相应的 generator 创建任务，所以要安装 generator
- 例如创建一个 node_modules 项目，则安装 generator-node
- 通过 Yeoman 的 yo 命令安装刚才的生成器(去掉生成器名字前的 generator-)
- 交互模式填写一些项目信息，会生成项目基础结构，并且生成一些项目文件，然后自动运行 npm install 安装一些项目依赖

```bash
// 1. 在全局范围安装 yo
npm install yo --global # or yarn global add yo

// 2. 安装对应的 generator
npm install generator-node --global # or yarn global add generator-node

// 3. 通过 yo 运行 generator
yo node
```

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Engineering/09.png)

### Sub generator

> 有时候可能不需要创建一个完成的项目结构，而是在已有项目的基础上，创建一些项目文件
> 如README.md，或者是创建一些特定类型的文件，如 ESLint、Babel 配置文件
> 这些配置文件都有一些基础代码如果自己手动去写的话很容易配错，可以使用 Yeoman 提供的 Sub generator 实现

- 在项目目录下运行特定的 Sub generator 命令生成对应的文件，例如在项目中使用 generator-node 中的子集的 cli 生成器，来帮我们生成一个 cli 应用所需要的文件，让模块变成 cli 应用

```javascript
yo node:cli
```

- 运行 Sub generator 的方式就是在原有 generator 命令后面跟上 Sub generator 的名字，这里会提示我们是否要重写 package.json 这样一个文件
- 原因是在去添加 cli 支持的时候，会添加一些新的模块和配置，我们选择 yes，完成过后会提示重写了 package.json 创建了 `lib\cli.js`

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Engineering/10.png)

- lib 目录下的 cli.js 提供了一些 cli 应用基础的代码结构，有了这些就可以将这个模块作为一个全局的命令行模块去使用

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Engineering/11.png)

- 本地的模块我们通过 npm link 到全局范围

```javascript
npm link // 映射到全局
```

- 运行模块

```javascript
npm install --save zx-cli // 安装依赖
zx-cli --help // 运行
```

> [!warning]
> 并不是每一个 generator 都提供自己生成器，所以我们在使用之前，需要通过你所使用的 generator 的官方文档，明确这个 generator 下面有没有子集生成器

### Yeoman 使用步骤总结

- 明确你的需求
- 找到合适的 generator
- 全局安装 generator
- 通过 yo 运行对应的 generator
- 通过命令行交互填写选项
- 生成你所需要的项目结构

## 基于 Yeoman 搭建自己的脚手架

### 自定义 generator

> 不同的 generator 可以生成不同的项目，可以通过创建自己的 generator 生成自定义的项目结构

- 即便市面上已经有了很多的 Generator，我们还是有创建自己 generator 的必要
  - 因为它们都是通用的，而我们在实际开发中还是会有很多代码，甚至业务代码在相同类型项目都是重复的
  - 这个时候可以把公用的部分都放到脚手架中去生成，最大化的发挥脚手架工具的作用
  - 例如 vue-cli 脚手架工具只提供了最基础的项目结构，并不包含vue-router、axios、vuex，需要在每次创建完成后手动引入这些模块并编写一些基础的使用代码，如果我们把这些也放入脚手架中，就会相对方便一些了

#### 创建 generator 模块

> generator 本质上就是一个 npm 模块

- 一般 generator 基本结构
  - 根目录下有一个 generators 文件夹
  - generators 文件夹下面有一个 app 文件夹存放生成器对应的代码
  - 如果需要提供多个 Sub generator，在 app 同级目录添加新的生成器目录，这样我们的模块就有了components 的子生成器

```bash
|—— generators   # 生成器目录
|    app/        # 默认生成器目录
        index.js # 默认生成器实现
     component/  # 其他生成器目录
        index.js # 其他生成器实现
|—— package.json # 模块包配置文件
```

> [!warning]
>
> - Yeoman 的 generator 模块名称必须是 **<font color=red>`generator-<name>`</font>** 的模式
> - 如果在具体开发的时候没有去使用这样格式的名称，Yeoman 在后续工作的时候就没有办法找到你所提供的这个生成器模块

#### 开始创建模块

- 创建文件夹 generator-simple 作为生成器模块的目录

```bash
mkdir generator-simple
cd generator-sample
```

- 在目录下通过 npm init 的方式创建一个 package.json

```bash
npm init
```

- 还需要安装 yeoman-generator 的模块，这个模块提供了生成器的基类，基类中提供了一些工具函数可以在创建生成器的时候更加便捷

```bash
npm install yeoman-generator
```

#### index.js 文件作为 generator 的核心入口

- 在目录下按照项目结构要求，创建 generators 文件夹，在这个目录下创建 app 目录，在目录中创建 index.js 作为 generator 的核心入口文件
- index.js 需要导出一个继承自 Yeoman generator 的类型，Yeoman generator 在工作时会自动调用此类型中定义的一些生命周期方法，可以在这些方法中通过调用父类提供的工具方法实现一些功能，例如文件写入

```javascript
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
	writing() {
		// Yeoman 自动生成文件阶段调用此方法
		// 我们尝试往项目目录中写入文件
		this.fs.write(
			// 这里的 fs 模块与 node 中的 fs 不同，是高度封装的模块功能更强大一些
			this.destinationPath('temp.txt'), // this.destinationPath 是父类中方法用来获取绝对路径
			Math.random().toString()
		);
	}
};
```

- 这时一个简单的 generator 就已经完成了，通过 npm link 的方式把这个模块连接到全局范围，使之成为一个全局模块包，这样 Yeoman 在工作的时候就可以找到自己写的这个 generator-simple 模块

```bash
npm link
```

- 可以通过 Yeoman 运行这个生成器具体的操作方式是 yo simple

```bash
yo simple
```

- 就会生成一个 temp.txt 文件

> [!warning]
> 如果你的 Node.js 版本超过 v12，推荐使用动态 import 来处理兼容问题（ Node.js 的 CommonJS require 不能直接加载 ES 模块）
> package.json 中添加声明 "type": "module"
> 更新 index.js 代码

```javascript
// index.js
import Generator from 'yeoman-generator';

export default class extends Generator {
	writing() {
		this.fs.write(this.destinationPath('temp.txt'), Math.random().toString());
	}
}
```

#### 根据模版创建文件

- 有时候需要自动创建的文件有很多，且文件内容相对复杂，这个时候可以使用模板创建文件

1. 首先在生成器目录（app文件夹）下添加 templates 文件夹作为模板目录，然后将需要生成的文件放入 templates 目录作为模板，例如 `foo.txt` 文件
2. 模板中完全遵循 EJS 模板引擎的模板语法，可以使用 EJS 模板标记输出数据，例如：`<%= title >` 动态输出数据
3. 有了模板后在生成文件时就不用借助 fs 的 write 方法去写入文件，而是通过借助 fs 中专门使用模板引擎的方法：copy templates 写入文件到目标目录
4. 它有三个参数：模板文件路径、输出文件路径、模板数据的上下文
5. 此时 yeoman 在运行中就会自动使用模板引擎渲染模板

- foo.txt 模版
```javascript
这是一个模版文件
内部可以使用 EJS 模版标记输出数据
例如：<%= title %>

其他的 EJS 语法也支持

<% if (success) { %>
哈哈哈
<% }%>
```

- 修改后的 index.js

```javascript
import Generator from 'yeoman-generator';

export default class extends Generator {
	writing() {
		// 模板文件路径，可以借助 templatePath 方法去自动获取当前生成器下 templates 下文件路径
		const tmpl = this.templatePath('foo.txt');
		// 输出目标路径，还是借助父类的 destinationPath 方法自动获取
		const output = this.destinationPath('temp.txt');
		// 模板数据上下文
		const context = { title: 'hello zxwin', success: 'false' };

		// copyTpl 方法会自动将模板文件映射到生成的输出文件上
		this.fs.copyTpl(tmpl, output, context);
	}
}
```

- 此时 yeoman 在运行中就会自动使用模板引擎渲染模板

#### 接收用户输入数据

- 对于模版中的动态数据，如项目的标题、名称等，这样的数据一般通过命令行交互的方式询问使用者
- 在 generator 中想要发起一个命令行交互询问，可以通过实现 generator 类型中的 promting 方法

```html
<!-- bar.html 模版 -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title><%= name %></title>
</head>
<body>
  <h1><%= name %></h1>
</body>
</html>
```

```javascript
// index.js
prompting() {
  // 可以调用父类提供的 promit 方法发出对用户的命令行询问
  // 这个方法返回 promise，在调用的时候对他 return ，这样 Yeoman 在调用的时候就有更好的异步流程控制
  return this.prompt([
    // 这个方法接受数组参数，数组的每一项都是一个问题对象，可以传入类型 type 、name、message 和 default
    {
      type: 'input',
      name: 'name',
      message: 'Your project name',
      default: this.appname // appname 为项目生成目录名称
    }
  ])
  .then(answers => {
    // promise 执行过后我们会得到一个返回值，返回值就是问题的结果，会以对象的形式出现，对象的键就是输入的 name ，值就是用户输入的内容，可以将这个值挂载在全局 this 中方便日后使用
    // answers => { name: 'user input value' }
    this.answers = answers
 })
}
```

- 有了 this.answers 就可以在 writing 的时候传入模板引擎，使用这个数据作为模板数据的上下文

```javascript
writing() {
  // ...
  const context = this.answers;
  this.fs.copyTpl(tmpl, output, context);
}
```

### Vue 案例演示

> 按照之前的做法自定义一个有基础代码的 Vue 项目脚手架

- 首先要想清楚原始的项目结构，把需要重复使用的基础代码全部定义好，作为模版
- 然后封装 generator 用于生成理想的这个项目结构

#### Step1 定义目标结构模版

- 这里看下用脚手架创建的最新 Vue3 项目结构

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Engineering/12.png)

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Engineering/13.png)

#### Step2 封装 gengerator

- 创建一个全新的 gengerator 目录

```bash
mkdir generator-zx-cli
cd generator-zx-cli
```

- 通过 npm init 初始化 package.json ，然后安装 Yeoman 的依赖

```bash
npm init
npm install yeoman-generator
```

- 新建 generator 主入口文件 generators/app/index.js

```javascript
import Generator from "yeoman-generator";

export default class extends Generator {
  prompting() {
    return this.prompt([
      {
        type: "input",
        name: "name",
        message: "Your project name",
        default: this.appname
      }
    ]).then(answers => {
      this.answers = answers;
    });
  }

  writing() {}
}
```

- 创建 templates 目录，把目标项目的目录结构 copy 到 templates 当中作为模板
1. 有了模板过后，需要把项目结构里面一些可能发生变化的地方通过模板引擎的方式修改
2. 通过数组循环的方式批量生成每一个文件，把每一个文件通过模板转换，生成到对应的路径

```javascript
writing() {
    const templates = [
        // ...
        'public/favicon.ico',
        'src/App.vue',
        'src/main.js',
    ]
    templayes.forEach(item => {
        this.copyTpl(this.templatePath(item),
        this.destinationPath(item),
        this.answer);
    })
}
```

- 将 generator-zx-cli 通过 link 的方式定义到全局

```javascript
npm link
```

- 在全新的目录使用该 generator

```javascript
yo zx-cli;
```

- 会提示输入项目名称，输入之后就可以看到模板被拉去到了新的目录下

### 发布 Generator

> Generator 实际上就是一个 npm 的模块，发布 generator 就是发布 npm 的模块

- 只需要将已经写好的 generator 模块通过 npm publish 命令发布成一个公开模块就可以了

## Plop 脚手架工具

> Plop 是一款主要用于去创建项目中特定类型文件的小工具，类似于 Yeoman 中的 Sub generator<br>
> 不过它一般不会独立去使用，一般会把 Plop 集成到项目中，用来自动化创建项目中同类型的文件

- 日常开发中经常会需要重复创建相同类型的文件，例如每一个组件都会有三个文件去组成 js ，css，test.js
  - 如果需要创建一个组件，就要去创建三个文件，并且每一个文件中都要有一些基础代码，这就比较繁琐，而且很难统一每一个组件文件中基础的代码
  - Plop可以解决这个问题，只需要在命令行中取运行 Plop

```bash
yarn plop component
```

- 会询问一些信息，并且自动的创建一些文件，这也就保证了每次创建的文件都是统一的，并且是自动的

### Plop 基本使用

- Plop 作为 npm 的模块安装到我们的开发依赖

```bash
npm install plop --dev
```

- 安装后在项目根目录新建 plopfile.js 文件，这个文件是 plop 工作的一个入口文件
- 需要导出一个函数，而且这个函数可以接收一个叫 plop 的对象，对象提供了一系列工具函数，用于创建生成器的任务

```javascript
module.exports = plop => {
  plop.setGenerator('component', {});
}
```

- plop 有个成员叫 setGenerator , 接收两个参数
  - 第一个参数是生成器的名字
  - 第二个参数是生成器的一些选项
- 配置选项中需要指定生成器的参数

```javascript
{
  description: '生成器的描述',
  prompts: [ // 发出的命令行问题
    {
      type: 'input',
      name: 'name',
      message: 'component name',
      default: 'MyComponent'
    }
  ],
  actions: [ // 问题完成后的动作
    {
      type: 'add', // 添加一个全新的文件
      path: 'src/components/{{name}}/{{name}}.js', // 指定添加的文件会被添加到哪个具体的路径, 可以通过双花括号的方式使用命令行传入的变量
      templateFile: 'plop-templates/component.hbs', // 本次添加文件的母版文件是什么, 一般我们会把母版文件放在 plop-template 目录中，可以通过 handlebars 去创建模板文件 .hbs
    }
  ]
}
```

- 数据填写完毕 Plop 就算是完成了，安装 Plop 模块的时候 Plop 提供了一个 CLI 程序，可以通过 yarn 启动这个程序 `yarn plop <name>`，会执行上面定义的 Plop

```plain
yarn plop component
```

- 可以添加多个模板就是添加多个 actions ，官网中提供了多个 type ，可以参考官网
- Plop 用来去创建项目当中同类型的文件还是非常方便的

> [!important]
> 使用 Plop 步骤总结
> 1. 将 plop 模块作为项目开发依赖安装
> 2. 在项目根目录下创建一个 plopfile.js 文件
> 3. 在 plopfile.js 文件中定义脚手架任务
> 4. 编写用于生成特定类型文件的模版
> 5. 通过 Plop 提供的 CLI 运行脚手架任务

## 脚手架工具的工作原理

> 脚手架工具实际上就是一个 node-cli 应用，创建脚手架就是创建 node-cli 应用

### cli 应用的基础

- package.json 中添加一个 bin 字段，用于指定 cli 应用的入口文件
- cli 应用的入口文件必须要有一个特定的文件头 `#!/usr/bin/env node`
  - 如果是 Linux 或者 MacOS 系统还需要修改此文件的读写权限 755
- yarn link 链接成为全局模块，在命令行中使用这个命令，cli 应用的基础就 ok 了

### 具体步骤

- yarn init 初始化一个 package.json 文件

```plain
yarn init
```

- 在 package.json 中添加 bin 字段，用于指定 cli 应用的入口文件

```json
{
	"name": "sample-scaffolding",
	"bin": "cli.js"
}
```

- 添加 cli.js 文件，入口文件必须要有一个特定的文件头

```javascript
#! /usr/bin/env node

console.log('cli working')
```

- 如果操作系统是 linux 或者 mac 需要修改这个文件的读写权限，把他修改成 755 ，这样才可以作为 cli 的入口文件执行

```javascript
chmod 755 /path/to/your/file.js
```

- 通过 yarn link 将这个模块映射到全局

```bash
yarn link
```

- 这个时候就可以在命令行执行 sample-scaffolding 命令了，通过执行这个命令 console.log 成功打印出来，表示代码执行了，也就意味着 cli 已经可以运行了

```bash
sample-scaffolding
```

### 实现一个简单脚手架

> [!important]
> 1. 通过命令行交互的询问用户信息
> 2. 根据用户反馈结果生成文件

- 在 node 中发起命令行交互询问可以使用 inquirer 模块

```bash
yarn add inquirer --dev
```

- inquirer 模块提供一个 prompt 方法用于发起一个命令行的询问，可以接收一个数组参数
  - 数组中每一个成员就是一个问题
  - 可以通过 type 指定问题输入方式
  - 然后 name 指定返回值的键
  - message指定屏幕上给用户的一个提示
  - 在 promise 的 then 里面拿到这个问题接收到用户的答案

```javascript
const inquirer = require('inquirer');

inquirer.prompt([
    {
        type: 'input',
        name: 'name',
        message: 'Project name'
    }
]).then(answer => {
    console.log(answer);
})
```

- 动态生成项目文件，一般会根据模板去生成，所以在项目的跟目录下新建一个 templates 目录，在这个目录下新建一些模板
- 模板的目录应该是项目当前目录的 templates 通过 path 获取
- 输出的目标目录一般是命令行所在的路径也就是 cwd 目录

```javascript
const path = require('path');

// 工具当前目录
const tmplDir = path.join(__dirname, 'templates');
// 命令行所在目录
const destDir = process.cwd();
```

- 明确这两个目录就可以通过 fs 模块读取模板目录下一共有哪些文件
- 把这些文件全部输入到目标目录，通过 fs 的 readDir 方法自动扫描目录下的所有文件

```javascript
fs.readdir(tmplDir, (err, files) => {
    if (err) {
        throw err;
    }
    files.forEach(file => {
        console.log(file); // 得到每个文件的相对路径
    })
})
```

- 可以通过模板引擎渲染路径对应的文件，比如 ejs

```bash
yarn add ejs --dev
```

- 回到代码中引入模板引擎，通过模板引擎提供的 renderFile 渲染路径对应的文件
  - 第一个参数是文件的绝对路径
  - 第二个参数是模板引擎在工作的时候的数据上下文
  - 第三个参数是回调函数
- 也就是在渲染成功过后的回调函数，当然如果在渲染过程中出现了意外可以通过 throw err 的方式错误抛出去
- 打印结果是经过模板引擎工作过后的结果，只需要将这个结果通过文件写入的方式写入到目标目录就可以了
- 目标目录应该是通过 path.join 把 destDir 以及 file 做一个拼接，内容就是 result

```javascript
#!/usr/bin/env node

// Node CLI 应用入口文件必须要有这样的文件头
// 如果是 Linux 或者 macOS 系统下还需要修改此文件的读写权限为 755
// 具体就是通过 chmod 755 cli.js 实现修改

// 脚手架的工作过程：
// 1. 通过命令行交互询问用户问题
// 2. 根据用户回答的结果生成文件

const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const ejs = require('ejs')

const questions = [
  {
    type: 'input',
    name: 'name',
    message: 'Project name?'
  }
];

inquirer.default.prompt(questions)
  .then(anwsers => {
    // console.log(anwsers)
    // 根据用户回答的结果生成文件

    // 模板目录
    const tmplDir = path.join(__dirname, 'templates')
    // 目标目录
    const destDir = process.cwd()

    // 将模板下的文件全部转换到目标目录
    fs.readdir(tmplDir, (err, files) => {
      if (err) throw err
      files.forEach(file => {
        // 通过模板引擎渲染文件
        ejs.renderFile(path.join(tmplDir, file), anwsers, (err, result) => {
          if (err) throw err

          // 将结果写入目标文件路径
          fs.writeFileSync(path.join(destDir, file), result)
        })
      })
    })
  })
```

- 完成过后找到一个新的目录使用脚手架

```bash
sample-scaffolding
```

- 输入项目名称过后，就会发现他会把模板里面的文件自动生成到对应的目录里面，至此就已经完成了一个非常简单，非常小型的一个脚手架应用
- 其实脚手架的工作原理并不复杂，但是他的意义却是很大的，因为他确实在创建项目环节大大提高了效率
