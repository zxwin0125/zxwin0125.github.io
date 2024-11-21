---
title: 前端工程化背后的项目组织设计
date: 2021-08-25
order: 3
---

![示意图](https://s21.ax1x.com/2024/09/21/pAM3v6A.webp =600x380)

## 大型前端项目的组织设计

:::info
- 随着业务复杂度的直线上升，前端项目不管是从代码量上，还是从依赖关系上都爆炸式增长
- 同时，团队中一般不止有一个业务项目，多个项目之间如何配合，如何维护相互关系？
- 公司自己的公共库版本如何管理？
:::

- 这些话题随着业务扩展，纷纷浮出水面，一名合格的高级前端工程师，在宏观上必需能妥善处理这些问题
- 举个例子，团队主业务项目名为：App-project，这个仓库依赖了组件库：Component-lib，因此 App-project 项目的 package.json 会有类似的代码：

```json
{
   "name": "App-project",
   "version": "1.0.0",
   "description": "This is our main app project",
   "main": "index.js",
   "scripts": {
      "test": "echo \\"Error: no test specified\\" && exit 1"
   },
   "dependencies": {
      "Component-lib": "^1.0.0"
   }
}
```

- 这时新的需求来了，产品经理需要更改 Component-lib 组件库中的 modal 组件样式及交互行为
- 作为开发者，我们需要切换到 Component-lib 项目，进行相关需求开发，开发完毕后进行测试
- 这里的测试包括 Component-lib 当中的单元测试，当然也包括在实际项目中进行效果验收
- 为方便调试，也许会使用 npm link/yarn link 来开发和调试效果
- 当确认一切没问题后，我们还需要 npm 发包 Component-lib 项目，并提升版本为 1.0.1
- 在所有这些都顺利完成的基础上，才能在 App-project 项目中进行升级：

```json
{
	//...
	"dependencies": {
		"Component-lib": "^1.0.1"
	}
}
```

- 这个过程已经比较复杂了，如果中间环节出现任何纰漏，我们都要重复上述所有步骤
- 另外，这只是单一依赖关系，现实中 App-project 不可能只依赖 Component-lib
- 这种项目管理的方式无疑是低效且痛苦的，那么在项目设计哲学上，有更好的方式吗？

### monorepo 和 multirepo

- 答案是肯定的，管理组织代码的方式主要分为两种：
  - multirepo
  - monorepo
    > 顾名思义，multirepo 就是将应用按照模块分别在不同的仓库中进行管理，即上述 App-project 和 Component-lib 项目的管理模式<br>
    > 而 monorepo 就是将应用中所有的模块一股脑全部放在同一个项目中，这样自然就完全规避了前文描述的困扰，不需要单独发包、测试，且所有代码都在一个项目中管理，一同部署上线，在开发阶段能够更早地复现 bug，暴露问题
- 这就是项目代码在组织上的不同哲学：
  - 一种倡导分而治之，一种倡导集中管理
  - 究竟是把鸡蛋放在同一个篮子里，还是倡导多元化，这就要根据团队的风格以及面临的实际场景进行选型
- **<font color=red>multirepo 存在以下问题：</font>**
  - 开发调试以及版本更新效率低下
  - 团队技术选型分散，不同的库实现风格可能存在较大差异（比如有的库依赖 Vue，有的依赖 React）
  - changelog(更新日志) 梳理困难，issues(问题) 管理混乱（对于开源库来说）
- **<font color=red>而 monorepo 缺点也非常明显：</font>**
  - 库体积超大，目录结构复杂度上升
  - 需要使用维护 monorepo 的工具，这就意味着学习成本比较高
- 清楚了不同项目组织管理的缺点，我们再来看一下社区上的经典选型案例
  - Babel 和 React 都是典型的 monorepo，其 issues 和 pull requests 都集中到唯一的项目中，changelog 可以简单地从一份 commits 列表梳理出来
  - 而著名的 Rollup 目前是 multirepo 方式
- 我们查看 React 项目仓库，从目录结构即可看出其强烈的 monorepo 风格：

```javascript
react-16.2.0/
   packages/
      react/
      react-art/
      react-.../
```

- 因此，[react](https://www.npmjs.com/package/react) 和 [react-dom](https://www.npmjs.com/package/react-dom) 在 npm 上是两个不同的库，它们只不过在 React 项目中通过 monorepo 的方式进行管理
- **<font color=red>为什么 react 和 react-dom 是两个包</font>**
  - 关注点分离
    - react 包包含了组件、状态管理、生命周期等核心功能，而 react-dom 专注于将 React 组件渲染到浏览器 DOM
  - 支持多平台
    - 将核心逻辑与平台特定代码分离，使 React 可以支持 Web、移动端等多个平台
    - react 包可以在 Web 和移动端通用，而 react-dom 只用于 Web 应用
  - 优化包大小
    - 对于不需要 DOM 操作的场景(如服务器端渲染)，可以只使用 react 包，减小应用体积
  - 适应 React Native 的需求
    - React Native 出现后，将与 DOM 相关的功能分离到 react-dom，使核心库更加通用
  - 灵活性
    - 允许开发者根据需求选择性地使用功能，比如只用 react 进行组件开发，或者用 react-dom 进行 DOM 渲染
  - 维护和更新便利
    - 将 DOM 操作相关代码独立出来，便于单独维护和更新 react-dom 包，而不影响核心 react 包
- 这种拆分使得 React 生态系统更加模块化和灵活，同时为跨平台开发提供了更好的支持
- 对于 monorepo 和 multirepo，选择了 monorepo 的 Babel 贡献了文章：[Why is Babel a monorepo?](https://github.com/babel/babel/blob/master/doc/design/monorepo.md)，其中提到：
- **<font color=red>monorepo 的优势：</font>**
  - 所有项目拥有一致的 lint，以及构建、测试、发布流程
  - 不同项目之间容易调试、协作
  - 方便处理 issues
  - 容易初始化开发环境
  - 易于发现 bug
- **<font color=red>monorepo 的劣势：</font>**
  - 源代码不易理解
  - 项目体积过大
    > 从业内技术发展来看，monorepo 目前越来越受欢迎<br>
    > 了解了 monorepo 的利弊，我们应该如何实现 monorepo 呢？

## 使用 Lerna 实现 monorepo

- Lerna 是 Babel 管理自身项目并开源的工具，官网对 Lerna 的定位非常简单直接：
  - A tool for managing JavaScript projects with multiple packages.
- 我们来建立一个简单的 demo，首先安装依赖，并创建项目：

```bash
mkdir new-monorepo && cd new-monorepo
npm init -y
npm i -g lerna（有需要的话要 sudo）
git init new-monorepo
lerna init
```

- 成功后，Lerna 会在 new-monorepo 项目下自动添加以下三个文件目录：
  - packages
  - lerna.json
  - package.json
- 我们添加第一个项目 module-1：

```bash
cd packages
mkdir module-1
cd module-1
npm init -y
```

- 这样，我们在 ./packages 目录下新建了第一个项目：module-1，并在 module-1 中添加了一些依赖，模拟更加真实的场景
- 同样的方式，建立 module-2 以及 module-3
- 此时，读者可以自行观察 new-monorepo 项目下的目录结构为：

```javascript
packages / module - 1 / package.json;
module - 2 / package.json;
module - 3 / package.json;
```

- 接下来，我们退到主目录下，安装依赖：

```bash
cd ..
lerna bootstrap
```

- 关于该命令的作用，官网直述为：
  - Bootstrap the packages in the current Lerna repo. Installs all of their dependencies and links any cross-dependencies
- 也就是说，假设我们在 module-1 项目中添加了依赖 module-2，那么执行 lerna bootstrap 命令后，会在 module-1 项目的 node_modules 下创建软链接直接指向 module-2 目录
- 也就是说 lerna bootstrap 命令会建立整个项目内子 repo 之间的依赖关系，这种建立方式不是通过「硬安装」，而是通过软链接指向相关依赖
- Linux 中关于硬链接和软链接的区别，可以参考文章：[linux 硬链接与软链接](https://www.cnblogs.com/crazylqy/p/5821105.html)
- 在正确连接了 Git 远程仓库后，我们可以发布：

```bash
lerna publish
```

- 这条命令将各个 package 一步步发布到 npm 当中
- Lerna 还可以支持自动生成 changelog 等功能
- 到这里，你可能觉得 Lerna 还挺简单，但其实里面还是有更多学问
  - 比如 Lerna 支持下面两种模式
    - Fixed/Locked 模式
      - Babel 便采用了这样的模式
      - 这个模式的特点是，开发者执行 lerna publish 后，Lerna 会在 lerna.json 中找到指定 version 版本号
      - 如果这一次发布包含某个项目的更新，那么会自动更新 version 版本号
      - 对于各个项目相关联的场景，这样的模式非常有利，任何一个项目大版本升级，其他项目的大版本号也会更新
    - Independent 模式
      - 不同于 Fixed/Locked 模式，Independent 模式下，各个项目相互独立
      - 开发者需要独立管理多个包的版本更新
      - 也就是说，我们可以具体到更新每个包的版本
      - 每次发布，Lerna 会配合 Git，检查相关包文件的变动，只发布有改动的 package
- 开发者可以根据团队需求进行模式选择
- 我们也可以使用 Lerna 安装依赖，该命令可以在项目下的任何文件夹中执行：

```bash
lerna add dependencyName
```

- Lerna 默认支持 hoist 选项，即默认在 lerna.json 中：

```javascript
{
	bootstrap: {
		hoist: true;
	}
}
```

- 这样项目中所有的 package 下 package.json 都会出现 dependencyName 包：

```javascript
packages / module - 1 / package.json(+dependencyName);
node_modules;
module - 2 / package.json(+dependencyName);
node_modules;
module - 3 / package.json(+dependencyName);
node_modules;
node_modules;
dependencyName;
```

- 这种方式，会在父文件夹的 node_modules 中高效安装 dependencyName（Node.js 会向上在祖先文件夹中查找依赖）
- 对于未开启 hoist 的情况，执行 lerna add 后，需要执行：

```bash
lerna bootstrap --hoist
```

- 如果我们想有选择地升级某个依赖，比如只想为 module-1 升级 dependencyName 版本，可以使用 scope 参数：

```bash
lerna add dependencyName --scope=module-1
```

- 这时候 module-1 文件夹下会有一个 node_modules，其中包含了 dependencyName 的最新版本

## 分析一个项目迁移案例

- **接下来，选取一个正在线上运行的 multirepo 项目，并演示使用 Lerna 将其迁移到 monorepo 的过程**
- 此案例来自 [mitter.io](http://mitter.io)，该团队以往一直以 multirepo 的形式维护以下几个项目：
  - @mitter-io/core，mitter.io SDK 核心基础库
  - @mitter-io/models，TypeScript models 库
  - @mitter-io/web，Web 端 SDK 应用
  - @mitter-io/react-native，React Native 端 SDK 应用
  - @mitter-io/node，Node.js 端 SDK 应用
  - @mitter-io/react-scl，React.js 组件库

### 背景介绍

- 项目使用 TypeScript 和 Rollup 工具，以及 TypeDoc 生成规范化文档
- 在使用 Lerna 做 monorepo 化之前，这样的技术方案带来的困扰显而易见，我们来分析一下当前技术栈的弊端，以及 monorepo 化能为这些项目带来哪些收益
  - 如果 @mitter-io/core 中出现任何一处改动，其他所有的包都需要升级到 @mitter-io/core 最新版本，不管这些改动是 feature 还是 bug fix，成本都比较大
  - 如果所有这些包能共同分享版本，那么带来的收益也是非常巨大的
  - 这些不同的仓库之间，由于技术栈近似，一些构建脚本大体相同，部署流程也都一致，如果能够将这些脚本统一抽象，也将带来便利

### 迁移步骤

- 我们运用 Lerna 构建 monorepo 项目，第一步：

```bash
mkdir my-new-monorepo && cd my-new-monorepo
git init .
lerna init
```

- 不同于之前的示例，这是从现有项目中导入，因此我们可以使用命令：

```bash
lerna import ~/projects/my-single-repo-package-1 --flatten
```

- 这行命令不仅可以导入项目，同时也会将已有项目中的 git commit 一并搬迁过来
- 我们可以放心地在新 monorepo 仓库中使用 git blame 来进行回溯
- 如此一来，得到了这样的项目结构：

```java
packages/
   core/
   models/
   node/
   react-native/
   web/
lerna.json
package.json
```

- 接下来，运行熟悉的：

```bash
lerna boostrap
lerna publish
```

- 进行依赖维护和发布

:::warning
并不是每次都需要执行 lerna bootstrap，只需要在第一次切换到项目，安装所有依赖时运行
:::

- 对于每一个 package 来说，其 pacakge.json 文件中都有以下雷同的 npm script 声明

```bash
"scripts": {
   ...
   "prepare": "yarn run build",
   "prepublishOnly": "./../../ci-scripts/publish-tsdocs.sh",
   ...
   "build": "tsc --module commonjs && rollup -c rollup.config.ts && typedoc --out docs --target es6 --theme minimal --mode file src"
}
```

- 受益于 monorepo，所有项目得以集中管理在一个仓库中，这样我们将所有 package 公共的 npm 脚本移到 ./scripts 文件中
- 在单一的 monorepo 项目里，我们就可以在不同 package 之间共享构建脚本了
- 运行公共脚本时，有时候有必要知道当前运行的项目信息
- npm 是能够读取到每个 package.json 信息的
- 因此，对每个 package，在其 package.json 中添加以下信息：

```json
{
	"name": "@mitter-io/core",
	"version": "0.6.28",
	"repository": {
		"type": "git"
	}
}
```

- 之后，如下变量都可以被 npm script 使用：

```bash
npm_package_name = @mitter-io/core
npm_package_version = 0.6.28
npm_package_repository_type = git
```

### 流程优化

- 团队中正常的开发流程是每个程序员新建一个 git branch，通过代码审核之后进行合并
- 整套流程在 monorepo 架构下变得非常清晰，我们来梳理一下
  - step1：当开发完成后，我们计划进行版本升级，只需要运行：lerna version
  - step2：Lerna 会提供交互式 prompt，对下一版本进行序号升级

```bash
lerna version --force-publish
   lerna notice cli v3.8.1
   lerna info current version 0.6.2
   lerna info Looking for changed packages since v0.6.2
   ? Select a new version (currently 0.6.2) (Use arrow keys)
   ❯ Patch (0.6.3)
   Minor (0.7.0)
   Major (1.0.0)
   Prepatch (0.6.3-alpha.0)
   Preminor (0.7.0-alpha.0)
   Premajor (1.0.0-alpha.0)
   Custom Prerelease
   Custom Version
```

- 新版本被选定之后，Lerna 会自动改变每个 package 的版本号，在远程仓库中创建一个新的 tag，并将所有的改动推送到 GitLab 实例当中
- 接下来，CI 构建实际上只需要两步：
  - Build 构建
  - Publish 发布
- 构建实际就是运行：

```bash
lerna bootstrap
lerna run build
```

- 而发布也不复杂，需要执行：

```bash
git checkout master
lerna bootstrap
git reset --hard
lerna publish from-package --yes
```

- 注意，这里我们使用了 lerna publish from-package，而不是简单的 lerna publish
- 因为开发者在本地已经运行了 lerna version，这时候再运行 lerna publish 会收到「当前版本已经发布」的提示
- 而 from-package 参数会告诉 Lerna 发布所有非当前 npm package 版本的项目
- 通过这个案例，我们了解了 Lerna 构建 monorepo 的经典套路，Lerna 还封装了更多的 API 来支持更加灵活的 monorepo 的创建

## 第一阶段总结

- monorepo 目前来看是一个流行趋势，但是任何一个项目都有自己的独立性和特殊性，究竟该如何组织调配、生产部署，需要每一个开发者开动脑筋
  - 比如：monorepo 方式会导致整个项目体积变大，在上线部署时，用时更长，甚至难以忍受，在工程中如何解决这类问题？
  - 针对于此，可以设计增量部署构建方案，通过分析项目依赖以及拓扑排序，优化项目编译构建

## 依赖关系

- 说到项目中的依赖关系，我们往往会想到使用 yarn/npm 解决依赖问题，依赖关系大体上可以分为：
  - 嵌套依赖
  - 扁平依赖
- 项目中，我们引用了三个包：PackageA、PackageB、PackageC，它们都依赖了 PackageD 的不同版本
- 那么在安装时，如果 PackageA、PackageB、PackageC 在各自的 node_modules 目录中分别含有 PackageD，那么我们将其理解为嵌套依赖：

```javascript
PackageA
   node_modules/PackageD@v1.1
PackageB
   node_modules/PackageD@v1.2
PackageC
   node_modules/PackageD@v1.3
```

- 如果在安装时，先安装了 PackageA，那么 PackageA 依赖的 PackageD 版本成为主版本，它和 PackageA、PackageB、PackageC 一起平级出现，我们认为这是扁平依赖
- 此时 PackageB、PackageC 各自的 node_modules 目录中也含有各自的 PackageD 版本：

```javascript
PackageA
PackageD@v1.1
PackageB
   node_modules/PackageD@v1.2
PackageC
   node_modules/PackageD@v1.3
```

- npm 在安装依赖包时，会将依赖包下载到当前的 node_modules 目录中
- 对于嵌套依赖和扁平依赖的话题，npm 给出了不同的处理方案：
  - npm3 以下版本在依赖安装时，非常直接，它会按照包依赖的树形结构下载到本地 node_modules 目录中，也就是说，每个包都会将该包的依赖放到当前包所在的 node_modules 目录中
    - 这么做的原因可以理解：
      - 它考虑到了包依赖的版本错综复杂的问题，同一个包因为被依赖的关系原因会出现多个版本，保证树形结构的安装能够简化和统一对于包的安装和删除行为
      - 这样能够简单地解决多版本兼容问题，可是也带来了较大的冗余
  - npm3 则采用了扁平结构，但是更加智能
    - 在安装时，按照 package.json 里声明的顺序依次安装包，遇到新的包就把它放在第一级 node_modules 目录
    - 后面再进行安装时，如果遇到一级 node_modules 目录已经存在的包，那么会先判断包版本，如果版本一样则跳过安装，否则会按照 npm2 的方式安装在树形目录结构下
- npm3 这种安装方式只能够部分解决问题
  - 比如：项目里依赖模块 PackageA、PackageB、PackageC、PackageD, 其中 PackageC、PackageB 依赖模块 PackageD v2.0，A 依赖模块 PackageD v1.0
  - 那么可能在安装时，先安装了 PackageD v1.0，然后分别在 PackageC、PackageB 树形结构内部分别安装 PackageD v2.0，这也是一定程度的冗余
  - 为了解决这个问题，因此也就有了 npm dedupe 命令
- 另外，为了保证同一个项目中不同团队成员安装的版本依赖相同，我们往往使用 package-lock.json 或 yarn-lock.json 这类文件通过 git 上传以共享
- 在安装依赖时，依赖版本将会锁定

## 复杂依赖关系分析和处理

- 前端项目，安装依赖非常简单：

```bash
npm install / yarn add
```

- 安装一时爽，而带来的依赖关系慢慢地会让人头大，依赖关系的复杂性带来的主要副作用有就是**循环依赖**
- 简单来说，循环依赖就是模块 A 和模块 B 相互引用，在不同的模块化规范下，对于循环依赖的处理不尽相同
- Node.js 中，我们制造一个简单的循环引用场景

```javascript
// 模块 A
exports.loaded = false;
const b = require('./b');
module.exports = {
	bWasLoaded: b.loaded,
	loaded: true,
};

// 模块 B
exports.loaded = false;
const a = require('./a');
module.exports = {
	aWasLoaded: a.loaded,
	loaded: true,
};
```

- 在 index.js 中调用：

```javascript
const a = require('./a');
const b = require('./b');
console.log(a);
console.log(b);
```

- 这种情况下，并未出现死循环崩溃的现象，而是输出：

```javascript
{ bWasLoaded: true, loaded: true }
{ aWasLoaded: false, loaded: true }
```

- 因是模块加载过程的缓存机制：Node.js 对模块加载进行了缓存
- 按照执行顺序，第一次加载 a 时，走到 const b = require('./b')，这样直接进入模块 B 当中，此时模块 B 中 const a = require('./a')，模块 A 已经被缓存，因此模块 B 返回的结果为：

```javascript
{
   aWasLoaded: false,
   loaded: true
}
```

- 模块 B 加载完成，回到模块 A 中继续执行，模块 A 返回的结果为：

```javascript
{
   aWasLoaded: true,
   loaded: true
}
```

- 据此分析，我们不难理解最终的打印结果，也可以总结为：
  - **<font color=red>Node.js，或者 CommonJS 规范，得益于其缓存机制，在遇见循环引用时，程序并不会崩溃</font>**
- 但这样的机制，仍然会有问题：**<font color=red>它只会输出已执行部分，对于未执行部分，export 内容为 undefined</font>**
- **<font color=red>ES 模块化与 CommonJS 规范不同，ES 模块不存在缓存机制，而是动态引用依赖的模块</font>**
- [《Exploring ES6》](https://exploringjs.com/es6/ch_modules.html) 一文中的示例很好地阐明了这样的行为：

```javascript
//------ a.js ------
import { bar } from 'b'; // (i)
export function foo() {
	bar(); // (ii)
}

//------ b.js ------
import { foo } from 'a'; // (iii)
export function bar() {
	if (Math.random()) {
		foo(); // (iv)
	}
}
```

- 这样的代码，如果在 commonJS 规范中：

```javascript
//------ a.js ------
var b = require('b');
function foo() {
	b.bar();
}
exports.foo = foo;

//------ b.js ------
var a = require('a');
function bar() {
	if (Math.random()) {
		a.foo();
	}
}
exports.bar = bar;
```

- 如果模块 a.js 先被执行，a.js 依赖 b.js，在 b.js 中，因为 a.js 此刻还并没有暴漏出任何内容，因此如果在 b.js 中，对于顶层 a.foo() 的调用，会得到报错
- 但是如果 a.js 模块执行完毕后，再调用 b.bar()，b.bar() 当中的 a.foo() 可以正常运行
- 但是这样的方式的局限性：
  - 如果 a.js 采用 module.exports = function () { ··· } 的方式，那么 b.js 当中的 a 变量在赋值之后不会二次更新
  - **ESM 不会存在这样的局限性，ESM 加载的变量，都是动态引用其所在的模块，只要引用是存在的，代码就能执行**
    - 回到代码，第 ii 行和第 iv 行，bar 和 foo 都指向原始模块数据的引用
  - **ESM 的设计目的之一就是支持循环引用**

```javascript
//------ a.js ------
import { bar } from 'b'; // (i)
export function foo() {
	bar(); // (ii)
}

//------ b.js ------
import { foo } from 'a'; // (iii)
export function bar() {
	if (Math.random()) {
		foo(); // (iv)
	}
}
```

- **ES 的设计思想是：尽量静态化，这样在编译时就能确定模块之间的依赖关系**
  - 这也是 import 命令一定要出现在模块开头部分的原因，在模块中，import 实际上不会直接执行模块，而是只生成一个引用，在模块内真正引用依赖逻辑时，再到模块里取值
- 这样的设计非常有利于 tree shaking 技术的实现
- 在工程实践中，循环引用的出现往往是由设计不合理造成的
- 如果使用 webpack 进行项目构建，可以使用 webpack 插件 [circular-dependency-plugin](https://www.npmjs.com/package/circular-dependency-plugin) 来帮助检测项目中存在的所有循环依赖
- 另外复杂的依赖关系还会带来以下等问题：
  - 依赖版本不一致
  - 依赖丢失
- 对此，需要我们根据真实情况进行处理，同时，合理使用 npm/yarn 工具，也能起到非常关键的作用

```javascript
"scripts": {
   // ...
   "analyzeDeps": "scripts analyzeDeps",
   "graph": "scripts graph",
   // ...
}
```

- 即

```bash
yarn run analyzeDeps
```

- 来对依赖进行分析
- 具体流程是 analyzeDeps 脚本会对依赖版本冲突和依赖丢失的情况进行处理，这个过程依赖 missingDepsAnalyze 和 versionConflictsAnalyze 两个任务：
  - 其中 missingDepsAnalyze 依赖 [depcheck](https://www.npmjs.com/package/depcheck)，depcheck 可以找出哪些依赖是没有用到的，或者对比 package.json 声明中缺少的依赖项
  - 同时 missingDepsAnalyze 会读取 lerna.json 配置，获得项目中所有 package，接着对所有 package 中的 package.json 进行遍历，检查是否存在相关依赖，如果不存在则自动执行 yarn add XXXX 进行安装
  - versionConflictsAnalyze 任务类似，只不过在获得每个 package 的 package.json 中定义的依赖之后，检查同一个依赖是否有重复声明且存在版本不一致的情况
  - 对于版本冲突，采用交互式命令行，让开发者选择正确的版本

## 使用 yarn workspace 管理依赖关系

- monorepo 项目中依赖管理问题值得重视
- 现在来看一下非常流行的 yarn workspace 如何处理这种问题

:::info
- workspace 的定位为：It allows you to setup multiple packages in such a way that you only need to run yarn install once to install all of them in a single pass.
- 翻译过来，workspace 能帮助你更好地管理有多个子 package 的 monorepo，开发者既可以在每个子 package 下使用独立的 package.json 管理依赖，又可以享受一条 yarn 命令安装或者升级所有依赖的便利
:::

- 引入 workspace 之后，在根目录执行：

```bash
yarn install / yarn updrade XX
```

- 所有的依赖都会被安装或者更新
- 当然，如果只想更新某一个包内的版本，可以通过以下代码完成：

```bash
yarn workspace upgrade XX
```

- 在使用 yarn 的项目中，如果想使用 yarn workspace，我们不需要安装其他的包，只要简单更改 package.json 便可以工作：

```json
// package.json
{
	"private": true,
	"workspaces": ["workspace-1", "workspace-2"]
}
```

:::warning
- 如果需要启用 workspace，那么这里的 private 字段必须设置成 true
- 同时 workspaces 这个字段值对应一个数组，数组每一项是个字符串，表示一个 workspace（可以理解为一个 repo）
:::

- 接着，我们可以在 workspace-1 和 workspace-2 项目中分别添加 package.json 内容：

```json
{
	"name": "workspace-1",
	"version": "1.0.0",

	"dependencies": {
		"react": "16.2.3"
	}
}
```

- 以及：

```json
{
	"name": "workspace-2",
	"version": "1.0.0",

	"dependencies": {
		"react": "16.2.3",
		"workspace-1": "1.0.0"
	}
}
```

- 执行 yarn install 之后，发现项目根目录下的 node_modules 内已经包含所有声明的依赖，且各个子 package 的 node_modules 里面不会重复存在依赖，只会有针对根目录下 node_modules 中的 React 引用
- 我们发现，yarn workspace 跟 Lerna 有很多共同之处，解决的问题也部分重叠，下面对比一下 **workspace 和 Lerna**
  - yarn workspace 寄存于 yarn，不需要开发者额外安装工具，同时它的使用也非常简单，只需要在 package.json 中进行相关的配置，不像 Learn 那样提供了大量 API
  - yarn workspace 只能在根目录中引入，不需要在各个子项目中引入
- 事实上，Lerna 可以与 workspace 共存，搭配使用能够发挥更大作用
  - 比如：Lerna 负责版本管理与发布，依靠其强大的 API 和设置，做到灵活细致
  - workspace 负责依赖管理，整个流程非常清晰
- 在 Lerna 中使用 workspace，首先需要修改 lerna.json 中的设置：

```bash
{
   ...
   "npmClient": "yarn",
   "useWorkspaces": true,
   ...
}
```

- 然后将根目录下的 package.json 中的 workspaces 字段设置为 Lerna 标准 packages 目录：

```bash
{
 ...
 "private": true,
 "workspaces": [
   "packages/*"
 ],
 ...
}
```

:::warning
- 如果我们开启了 workspace 功能，lerna.json 中的 packages 值便不再生效
- 原因是 Lerna 会将 package.json 中 workspaces 中所设置的 workspaces 数组作为 lerna packages 的路径，也就是各个子 repo 的路径
- 换句话说，Lerna 会优先使用 package.json 中的 workspaces 字段，在不存在该字段的情况下，再使用 lerna.json 中的 packages 字段
:::

- 如果未开启 workspace 功能，lerna.json 配置为：

```json
{
	"npmClient": "yarn",
	"useWorkspaces": false,
	"packages": ["packages/11/*", "packages/12/*"]
}
```

- 根目录下的 package.json 配置为：

```bash
{
   "private": true,
   "workspaces": [
     "packages/21/*",
     "packages/22/*",
   ],
     ...
}
```

- 那么这就意味着使用 yarn 管理的是 package.json 中 workspaces 所对应的项目路径下的依赖：`packages/21/*` 以及 `packages/22/_`
- 而 Leran 管理的是 lerna.json 中 packages 所对应的 `packages/11/_` 以及 `packages/12/*` 的项目

## 总结

- 主要抛出了大型前端项目的组织选型问题，着重分析了 monorepo 方案，内容注重实战
- 对于大型代码库的组织，梳理出一条完善的工作流程，找到适合自己团队的风格，是一名合格的开发者所需要具备的技能
- 但是关于 npm 和 yarn 以及所牵扯出的依赖问题、monorepo 设计问题仍然将是挑战
- 具体工程化项目的代码组织选型和设计，开发者一定要通过动手来理解
