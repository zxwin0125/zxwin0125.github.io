---
title: 深入浅出模块化（含 tree shaking）
date: 2021-07-18
order: 3
---

- **模块化是工程化的基础**：只有能将代码模块化，拆分为合理单元，才具备调度整合的能力，才有架构和工程一说
- 早期，JavaScript 只是作为浏览器端脚本语言出现，只负责简单的页面交互，并不具备先天的模块化能力
- 随着 Node.js 的发展和 ES 的演进，模块化如今在前端领域早已经不新鲜，但是，对于模块化不应该只停留在了解、会用的基础上，还要深入其中，认识在这个演进过程中：
  - 模块化经历了怎样的发展历程，从中能学习到哪些知识？
  - 跟其他早已发展成熟的语言相比，JavaScript 语言的模块化又有哪些特点？
  - 新的模块化 feature 又有哪些？dynamic import 现在停留在哪个阶段？
- 知识点如下：

![示意图](https://s21.ax1x.com/2024/09/22/pAMrveU.webp =600x320)

## 模块化简单概念

- 到底什么是模块化？
  - 简单来说就是：**<font color=red>对于一个复杂的应用程序，与其将所有代码一股脑地放在一个文件当中，不如按照一定的语法，遵循确定的规则（规范）拆分成几个互相独立的文件，这些文件应该具有原子特性，也就是说，其内部完成共同的或者类似的逻辑，通过对外暴露一些数据或调用方法，与外部完成整合</font>**
  - 这样一来，每个文件彼此独立，开发者更容易开发和维护代码，模块之间又能够互相调用和通信，这是现代化开发的基本模式
- 其实，不论在日常生活还是其他科学领域，都离不开模块化的概念，它主要体现了以下原则：
  - 可复用性
  - 可组合型
  - 中心化
  - 独立性
- **在模块化的基础上，结合工程化，又可以衍生出很多概念和话题。比如基于模块化的 tree shaking 技术，模块循环加载的处理等**

## 模块化发展历程

- 我认为前端模块化发展主要经历了三个阶段：
  - 早期“假”模块化时代
  - 规范标准时代
  - ES 原生时代
- **这些阶段逐次递进，每一种新方案的诞生，都离不开老方案的启示**

### 早期“假”模块化时代

- 在早期，JavaScript 属于运行在浏览器端的玩具脚本，它只负责实现一些简单的交互，随着互联网技术的演进，这样的设计逐渐不能满足业务的需求
- 这时候开发者往往从代码可读性上，借助函数作用域来模拟实现“假”的模块化，我称其为 **函数模式** ，即将不同功能封装成不同的函数：

```javascript
function f1() {
	//...
}
function f2() {
	//...
}
```

- 这样的方式其实根本不算模块化，各个函数在同一个文件中，混乱地互相调用，而且存在命名冲突的风险
- 这没有在根本上解决问题，只是从代码编写的角度，拆分成了更小的函数单元而已
- 于是，聪明的开发者很快就想出了第二种方式，姑且称它为 **对象模式** ，即利用对象，实现命名空间的概念：

```javascript
const module1 = {
    foo: 'bar',
    f11: function f11 () { //... },
    f12: function f12 () { //... },
}

const module2 = {
    data: 'data',
    f21: function f21 () { //... },
    f22: function f22 () { //... },
}
```

- 这样模拟了简单的 module1、module2 命名空间，在函数主体中可以调用：

```javascript
module1.f11();
console.log(module2.data);
```

- 可是这样问题也很明显，module1 和 module2 中的数据并不安全，任何开发者都可以修改：

```javascript
module2.data = 'modified data';
```

- 对象内部成员可以随意被改写，极易出现 bug，那么有什么手段能弥补这个不足呢？
- 从某种角度上看，闭包简直就是一个天生解决数据访问性问题的方案
- 通过立即执行函数（IIFE），构造一个私有的作用域，再通过闭包，将需要对外暴露的数据和接口输出，称此为 **IIFE 模式**
- 立即执行函数结合闭包实现的代码如下：

```javascript
const module = (function () {
	var foo = 'bar';
	var fn1 = function () {
		// ...
	};
	var fn2 = function fn2() {
		// ...
	};
	return {
		fn1: fn1,
		fn2: fn2,
	};
})();
```

- 我们在调用时：

```javascript
module.fn1();
```

- 如果想要访问变量 foo：

```javascript
module.foo;
// undefined
```

- 是访问不到具体数据的，了解了这种模式，可以在此基础上“玩出另外一个花”来，该方式的变种：结合顶层 window 对象，我们再来看：

```javascript
(function (window) {
	var data = 'data';

	function foo() {
		console.log(`foo executing, data is ${data}`);
	}
	function bar() {
		data = 'modified data';
		console.log(`bar executing, data is now ${data} `);
	}
	window.module1 = { foo, bar };
})(window);
```

- 这样的实现，数据 data 完全做到了私有，外界无法修改 data 值
- 那么如何访问 data 呢？
- 这时候需要模块内部设计并暴露相关接口
- 上述代码中，只需要调用模块 module1 暴露给外界（window）的函数即可:

```javascript
module1.foo();
// foo executing, data is data
```

- 修改 data 值的途径，也只能由模块 module1 提供：

```javascript
module1.bar();
// bar executing, data is now modified data
```

- 如此一来，已经初具“模块化”的实质，实现了模块化所应该具备的初级功能
- 再进一步思考，如果 module1 依赖外部模块 module2，该怎么办？请参考代码：

```javascript
(function (window, $) {
	var data = 'data';

	function foo() {
		console.log(`foo executing, data is ${data}`);
		console.log($);
	}
	function bar() {
		data = 'modified data';
		console.log(`bar executing, data is now ${data} `);
	}
	window.module1 = { foo, bar };
})(window, jQuery);
```

- **事实上，这就是现代模块化方案的基石，到此为止，这是模块化的第一阶段：“假”模块化时代**
- 这种实现极具阿 Q 精神，它并不是语言原生层面上的实现，而是开发者利用语言，借助 JavaScript 特性，模拟了类似的功能，为后续方案打开了大门

### 规范标准时代 CommonJS

- Node.js 无疑对前端的发展具有极大的促进作用，它带来的 CommonJS 模块化规范像一股“改革春风”
  - 在 Node.js 中，每一个文件就是一个模块，具有单独的作用域，对其他文件是不可见的
  - 关于 CommonJS 的规范，来看看它的 **几个容易被忽略的特点**
    - 文件即模块，文件内所有代码都运行在独立的作用域，因此不会污染全局空间
    - 模块可以被多次引用、加载，在第一次被加载时，**会被缓存**，之后都从缓存中直接读取结果
    - 加载某个模块，就是引入该模块的 module.exports 属性
    - module.exports 属性 **输出的是值的拷贝**，一旦这个值被输出，模块内再发生变化不会影响到输出的值
    - 模块加载顺序按照代码引入的顺序
    - 注意 module.exports 和 exports 的区别
  - CommonJS 规范用代码如何在浏览器端实现呢？
    - 其实就是实现 module.exports 和 require 方法
    - 实现思路：根据 require 的文件路径，加载文件内容并执行，同时将对外接口进行缓存
    - 因此我们需要定义：

```javascript
let module = {};
module.exports = {};
```

- 借助立即执行函数，将 module 和 module.exports 对象进行赋值：

```javascript
(function (module, exports) {
	// ...
})(module, module.exports);
```

- 社区上对 CommonJS 实现的模拟很多，给大家推荐[浅谈前端模块化](https://juejin.cn/post/6844903741020192776)，以及 [browserify](https://github.com/browserify/browserify)

### 规范标准时代 AMD

- 由于 Node.js 运行于服务器上，所有的文件一般都已经存在了本地硬盘中，不需要额外的网络请求去异步加载，因而 CommonJS 规范加载模块是同步的，只有加载完成，才执行后续操作
- 但是，如果放在浏览器环境中，我们都需要从服务器端获取模块文件，此时再采用同步的方式，显然就不合适了，这时候，社区上推出了 AMD 规范。
- AMD 规范，全称为：Asynchronous Module Definition，看到 “Asynchronous”，就知道它的模块化标准不同于 CommonJS，是异步的，完全贴合浏览器的
  - 它规定了如何定义模块，如何对外输出，如何引入依赖
  - 这一切都需要代码去实现，因此一个著名的库 —— require.js 应运而生，require.js 实现很简单：通过 define 方法，将代码定义为模块
  - 通过 require 方法，实现代码的模块加载
  - define 和 require 就是 require.js 在全局注入的函数
- [require.js 源码](https://github.com/requirejs/requirejs)

```javascript
var require, define;
(function (global, setTimeout) {
	// ...
})(this, typeof setTimeout === 'undefined' ? undefined : setTimeout);
```

- 我们看到，require.js 在全局定义了 require 和 define 两个方法，也是利用立即执行函数，将全局对象（this）和 setTimeout 传入函数体内
- 其中：

```javascript
define = function (name, deps, callback) {
	// ...
	if (context) {
		context.defQueue.push([name, deps, callback]);
		context.defQueueMap[name] = true;
	} else {
		globalDefQueue.push([name, deps, callback]);
	}
};
```

- 这里主要是将依赖注入到依赖队列
- 而 require 的主要作用是完成创建 script 标签去请求相应的模块，对模块进行加载和执行：

```javascript
req.load = function (context, moduleName, url) {
    var config = (context && context.config) || {},
    node;
    if (isBrowser) {
        //create a async script element
        node = req.createNode(config, moduleName, url);

        //add Events [onreadystatechange,load,error]
        .....

        //set url for loading
        node.src = url;

        //insert script element to head and start load
        currentlyAddingScript = node;
        if (baseElement) {
            head.insertBefore(node, baseElement);
        } else {
            head.appendChild(node);
        }
        currentlyAddingScript = null;

        return node;
    } else if (isWebWorker) {
        .........
    }
};

req.createNode = function (config, moduleName, url) {
    var node = config.xhtml ?
        document.createElementNS('http://www.w3.org/1999/xhtml', 'html:script') :
        document.createElement('script');
    node.type = config.scriptType || 'text/javascript';
    node.charset = 'utf-8';
    node.async = true;
    return node;
};
```

- 有人可能会有疑问：在我们使用 require.js 之后，并没有发现额外多出来的 script 标签，这个秘密就在于 checkLoaded 方法会把已经加载完毕的脚本删除，因为我们需要的是模块内容，一旦加载之后，没有必要保留有 script 标签了：

```javascript
function removeScript(name) {
	if (isBrowser) {
		each(scripts(), function (scriptNode) {
			if (
				scriptNode.getAttribute('data-requiremodule') === name &&
				scriptNode.getAttribute('data-requirecontext') === context.contextName
			) {
				scriptNode.parentNode.removeChild(scriptNode);
				return true;
			}
		});
	}
}
```

### 规范标准时代 CMD

- CMD 规范整合了 CommonJS 和 AMD 规范的特点
- 它的全称为：Common Module Definition，类似 require.js，CMD 规范的实现为 sea.js
- **AMD 和 CMD 的两个主要区别如下**
  - AMD 需要异步加载模块，而 CMD 在 require 依赖的时候，可以通过同步的形式（require），也可以通过异步的形式（require.async）
  - CMD 遵循依赖就近原则，AMD 遵循依赖前置原则
    - 也就是说，在 AMD 中，我们需要把模块所需要的依赖都提前在依赖数组中声明
    - 而在 CMD 中，我们只需要在具体代码逻辑内，使用依赖前，把依赖的模块 require 进来

### 规范标准时代 UMD

- UMD 全称：Universal Module Definition，看到 “Universal”，可以猜到它允许在环境中同时使用 AMD 与 CommonJS 规范，相当于一个整合
- 该模式的 **核心思想** 在于利用立即执行函数根据环境来判断需要的参数类别，譬如在 CommonJS 环境下，上述代码会以如下方式执行：

```javascript
function (factory) {
    module.exports = factory();
}
```

- 而如果是在 AMD 模块规范下，函数的参数就变成了 define，适用 AMD 规范
- 具体代码：

```javascript
(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD 规范
		define(['b'], factory);
	} else if (typeof module === 'object' && module.exports) {
		// 类 Node 环境，并不支持完全严格的 CommonJS 规范
		// 但是属于 CommonJS-like 环境，支持 module.exports 用法
		module.exports = factory(require('b'));
	} else {
		// 浏览器环境
		root.returnExports = factory(root.b);
	}
})(this, function (b) {
	// 返回值作为 export 内容
	return {};
});
```

- 至此，介绍完了模块化的 Node.js 和社区解决方案
- 这些方案充分利用了 JavaScript 语言特性，并结合浏览器端的特点，加以实现
- 不同的实现方式体现了不同的设计哲学，但是它们的最终方向都指向了模块化的几个原则：可复用性、可组合型、中心化、独立性

### ES 原生时代和 tree shaking

- ES 模块的设计思想是尽量静态化，这样能保证在编译时就确定模块之间的依赖关系，每个模块的输入和输出变量也都是确定的
- CommonJS 和 AMD 模块，无法保证前置即确定这些内容，只能在运行时确定
- 这是 ES 模块化和其他规范的显著不同
- 第二个差别在于，CommonJS 模块输出的是一个值的拷贝，ES 模块输出的是值的引用
- 我们来具体看一下：

```javascript
// data.js
export let data = 'data';
export function modifyData() {
	data = 'modified data';
}

// index.js
import { data, modifyData } from './lib';
console.log(data); // data
modifyData();
console.log(data); // modified data
```

- 我们在 index.js 中调用了 modifyData 方法，之后查询 data 值，得到了最新的变化
- 而同样的逻辑，在 CommonJS 规范下的表现为：

```javascript
// data.js
var data = 'data';
function modifyData() {
	data = 'modified data';
}

module.exports = {
	data: data,
	modifyData: modifyData,
};

// index.js
var data = require('./data').data;
var modifyData = require('./data').modifyData;
console.log(data); // data
modifyData();
console.log(data); // data
```

- 因为 CommonJS 是输出了值的拷贝，而非引用，因此在调用 modifyData 之后，index.js 的 data 值并没有发生变化，其值为一个全新的拷贝

#### ES 模块化为什么要设计成静态的

- 一个明显的优势是：通过静态分析，我们能够分析出导入的依赖，如果导入的模块没有被使用，我们便可以通过 tree shaking 等手段减少代码体积，进而提升运行性能，这就是基于 ESM 实现 tree shaking 的基础
- 这么说可能过于笼统，我们从设计的角度分析这两种规范哲学的利弊
  - 静态性需要规范去强制保证，不像 CommonJS 那样灵活，ES 模块化的静态性带来了限制：
    - 只能在文件顶部 import 依赖
    - export 导出的变量类型严格限制
    - 变量不允许被重新绑定，import 的模块名只能是字符串常量，即不可以动态确定依赖
  - 这样的限制在语言层面带来的便利之一是：我们可以通过作用域分析，分析出代码里变量所属的作用域以及它们之间的引用关系，进而可以推导出变量和导入依赖变量的引用关系，在没有明显引用时，就可以进行去冗余

#### tree shaking

- 上面说到的「在没有明显引用时，就可以进行去冗余」，就是我们经常提到的 tree shaking，它的目的就是减少应用中写出，但没有被实际运用的 JavaScript 代码
- 这样一来，无用代码的清除，意味着更小的代码体积，bundle size 的缩减，对用户体验起到了积极作用
- 在计算机科学当中，一个典型去除无用代码、冗余代码的手段是 [DCE](https://en.wikipedia.org/wiki/Dead_code_elimination)，dead code elimination
- **<font color=red>那么 tree shaking 和 DCE（Dead Code Elemination）有什么区别？</font>**
  - Rollup 的主要贡献者 Rich Harris 做过这样的比喻：假设我们用鸡蛋做蛋糕，显然，我们不需要蛋壳而只需要蛋清和蛋黄，那么如何去除蛋壳呢？
  - DCE 是这样做的：直接把整个鸡蛋放到碗里搅拌，蛋糕做完后再慢慢地从里面挑出蛋壳
  - 相反，与 DCE 不同，tree shaking 是开始阶段就把蛋壳剥离，留下蛋清和蛋黄，事实上，也可以将 tree shaking 理解为广义 DCE 的一种，它在前置打包时即排除掉不会用到的代码
- 当然说到底，tree shaking 只是一种辅助手段，良好的模块拆分和设计才是减少代码体积的关键
- Tree shaking 也有局限性，它还有很多不能清除无用代码的场景
  - 比如 Rollup 的 tree shaking 实现只处理函数和顶层的 `import/export` 导入的变量，不能把没用到的类的方法消除
  - 对于 tree shaking 来说，具有副作用的脚本无法被优化
- 更多情况可以参考：
  - [tree-shaking 不完全指南](https://juejin.im/post/5a64724df265da3e5a575d65)
  - [webpack-common-shake](https://github.com/indutny/webpack-common-shake%23limitations)
  - [你的 Tree-Shaking 并没什么卵用](https://juejin.cn/post/6844903549290151949)
  - [Webpack Tree shaking 深入探究](https://juejin.cn/post/6844903687412776974)

#### tree shaking 使用注意事项

- webpack 和 Rollup 构建工具目前都有成熟的方案，但是并不建议马上引入到项目中
- 事实上，是否要在成熟的项目上立即实施 tree shaking 需要妥善考虑
- 这里提供几篇文章，介绍了 tree shaking 的使用方法
  - [Webpack 之 treeShaking](https://mp.weixin.qq.com/s/Y4v7tAWUeDNs_FWpUnKmAw)
  - [体积减少 80%！释放 webpack tree-shaking 的真正潜力](https://juejin.cn/post/6844903669100445710)
  - [Tree-Shaking 性能优化实践 - 原理篇](https://juejin.cn/post/6844903544756109319)

#### ES 的 export 和 export default

- ES 模块化导出有 export 和 export default 两种
  - 这里建议减少使用 export default 导出，原因是一方面 export default 导出整体对象结果，不利于 tree shaking 进行分析
  - 另一方面，export default 导出的结果可以随意命名变量，不利于团队统一管理
- Nicholas C. Zakas 有一篇文章： [Why I've stopped exporting defaults from my JavaScript modules](https://humanwhocodes.com/blog/2019/01/stop-using-default-exports-javascript-module/) ，表达了类似的观点

## 未来趋势和思考

- 个人认为，ES 模块化是未来不可避免的发展趋势，它的优点毫无争议，比如开箱即用的 tree shaking 和未来浏览器兼容性支持
- Node.js 的 CommonJS 模块化方案甚至也会慢慢过渡到 ES 模块化上
- 如果正在使用 webpack 构建应用项目，那么 ES 模块化是首选
- 如果项目是一个前端库，也建议使用 ES 模块化
- 这么看来，或许只有在编写 Node.js 程序时，才需要考虑 CommonJS

### 在浏览器中快速使用 ES 模块化

- 目前各大浏览器较新版本都已经开始逐步支持 ES 模块了
- 如果我们想在浏览器中使用原生 ES 模块方案，只需要在 script 标签上添加一个 type="module" 属性
- 通过该属性，浏览器知道这个文件是以模块化的方式运行的
- 而对于不支持的浏览器，需要通过 nomodule 属性来指定某脚本为 fallback 方案：

```html
<script type="module">
	import module1 from './module1';
</script>

<script nomodule>
	alert('你的浏览器不支持 ES 模块请先升级');
</script>
```

- 使用 type="module" 的另一个作用是进行 ES Next 兼容性的嗅探
- 因为支持 ES 模块化的浏览器，都支持 ES Promise 等特性，基于此，应用场景较多

### 在 Node.js 中使用 ES 模块化

- Node.js 从 9.0 版本开始支持 ES 模块，执行脚本需要启动时加上 `--experimental-modules`，不过这一用法要求相应的文件后缀名必须为 `\*.mjs`：

```javascript
node --experimental-modules module1.mjs
import module1 from './module1.mjs'
console.log(module1)
```

- 另外，也可以安装 `babel-cli` 和 `babel-preset-env`，配置 `.babelrc` 文件后，执行：

```bash
./node_modules/.bin/babel-node
```

- 或：

```bash
npx babel-node
```

- 在工具方面，webpack 本身维护了一套模块系统，这套模块系统兼容了几乎所有前端历史进程下的模块规范，包括 AMD/CommonJS/ES 模块化等

## 总结

- 通过学习，了解了 JavaScript 模块化的历史，重点分析了不同过渡方案的不同实现以及 ES 模块化标准的细节
