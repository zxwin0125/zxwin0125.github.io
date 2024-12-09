---
title: 性能监控和错误收集与上报
date: 2022-02-09
order: 1
---

:::info
- 性能始终是前端领域非常重要的话题，它直接决定了产品体验的优劣，重要性无需赘言
- 我们在体验一个产品时，能够直观感受到其性能，可是如何量化衡量性能的好坏呢？
- 同时，我们无法保证程序永远不出问题，如何在程序出现问题时及时获得现场数据、还原现场，以做出准确地响应呢？
:::

- 离开了实际场景谈这些话题都是「耍流氓」，性能数据的监控、错误信息的收集和上报应该都要基于线上真实环境，这对于我们随时掌控线上产品，优化应用体验具有重大意义
- 现在就聚焦在性能监控和错误收集与上报系统上，通过学习，做到不仅能够分析性能数据、处理错误，还能建设一个成熟的配套系统
- 主要知识点：

![](https://s21.ax1x.com/2024/09/22/pAMW88e.webp =450x540)

## 性能监控指标

- 既然是性能监控，那首先需要明确衡量指标，一般来说，业界认可的常用指标有：
  - 首次绘制（FP）和首次有内容绘制（FCP）时间
  - 首次有意义绘制（FMP）时间
  - 首屏时间
  - 用户可交互（TTI）时间
  - 总下载时间
  - 自定义指标
- **首次绘制（FP）时间**：对于应用页面，用户在视觉上首次出现不同于跳转之前的内容时间点，或者说是页面发生第一次绘制的时间点
- **首次有内容绘制（FCP）时间**：指浏览器完成渲染 DOM 中第一个内容的时间点，可能是文本、图像或者其他任何元素，此时用户应该在视觉上有直观的感受
- **首次有意义绘制（FMP）时间**：指页面关键元素渲染时间，这个概念并没有标准化定义，因为关键元素可以由开发者自行定义——究竟什么是「有意义」的内容，只有开发者或者产品经理自己了解
- **首屏时间**：对于所有网页应用，这是一个非常重要的指标，用大白话来说，就是进入页面之后，应用渲染完整个手机屏幕（未滚动之前）内容的时间，需要注意的是，业界对于这个指标其实同样并没有确切的定论，比如这个时间是否包含手机屏幕内图片的渲染完成时间
- **用户可交互时间**：顾名思义，也就是用户可以与应用进行交互的时间，一般来讲，我们认为是 domready 的时间，因为我们通常会在这时候绑定事件操作，如果页面中涉及交互的脚本没有下载完成，那么当然没有到达所谓的用户可交互时间，那么如何定义 domready 时间呢？推荐参考文章：[何谓 domReady](https://www.cnblogs.com/rubylouvre/p/4536334.html)

- 以上时间，我们可以通过下图对比认识：

![](https://s21.ax1x.com/2024/09/22/pAMfHfS.webp)

- 这是访问 Medium 移动网站分析得到的时序图，可根据网页加载的不同时段，体会各个时间节点的变化
- 更完整的信息由 Chrome DevTool 给出：

![](https://s21.ax1x.com/2024/09/22/pAMfqSg.webp)

- 通过 Google Lighthouse 分析得到：

![](https://s21.ax1x.com/2024/09/22/pAMfOyj.webp)

- 请注意 First Meaningful Paint 和 First Contentful Paint 以及 Time to Interactive（可交互时间）被收录其中
- 先对这些时间节点以及数据有一个感性的认知，后面将会逐步学习如何统计这些时间，做出如上图一样的分析系统
- **总下载时间**：页面所有资源加载完成所需要的时间
  - 一般可以统计 window.onload 时间，这样可以统计出同步加载的资源全部加载完的耗时
  - 如果页面中存在较多异步渲染，也可以将异步渲染全部完成的时间作为总下载时间
- **自定义指标**：由于应用特点不同，我们可以根据需求自定义时间
  - 比如，一个类似 Instagram 的页面，页面由图片瀑布流组成，那么可能非常关心屏幕中第一排图片渲染完成的时间
- **<font color=red>这里提一下，DOMContentLoaded 与 load 事件的区别</font>**
  - 其实从这两个事件的命名就能体会，DOMContentLoaded 指的是文档中 DOM 内容加载完毕的时间，也就是说 HTML 结构已经完整
  - 但是我们知道，很多页面包含图片、特殊字体、视频、音频等其他资源，这些资源由网络请求获取，DOM 内容加载完毕时，由于这些资源往往需要额外的网络请求，还没有请求或者渲染完成
  - 而当页面上所有资源加载完成后，load 事件才会被触发
  - 因此，在时间线上，load 事件往往会落后于 DOMContentLoaded 事件
- 如图：

![](https://s21.ax1x.com/2024/09/22/pAMhpkV.webp)

- 表示页面加载一共请求了 13 个资源，大小为 309 KB，DOMContentLoaded 时间为 2.82 s，load 时间为 2.95 s，页面完全稳定时间 5.38 s

## FMP 的智能获取算法

:::info
- 结合自定义指标和首次有意义绘制（FMP）时间，稍做延伸：
  - 我们知道首次有意义绘制比较主观，开发者可以自行指定究竟哪些属于有意义的渲染元素
  - 我们也可以通过 FMP 的智能获取算法来完成自定义 FMP 时间
:::

- FMP 算法实现过程如下
- **首先获取有意义的渲染元素**，一般认为具备这几个条件的元素，更像是有意义的元素：
  - 体积占比比较大
  - 屏幕内可见占比大
  - 属于资源加载元素（img、svg、video、object、embed、canvas）
  - 主要元素是多个组成的
- **根据元素对页面视觉的贡献，我们对元素特点的权重进行划分**：

```javascript
const weightMap = {
	SVG: 2,
	IMG: 2,
	CANVAS: 3,
	OBJECT: 3,
	EMBED: 3,
	VIDEO: 3,
	OTHER: 1,
};
```

- **接着，对整个页面进行深度优先遍历搜索，之后对每一个元素进行分数计算**
  - 具体通过 element.getBoundingClientRect 获取元素的位置和大小
  - 然后通过计算「width height weight \* 元素在 viewport 的面积占比」的乘积，确定元素的最终得分
  - 接着将该元素的子元素得分之和与其得分进行比较，取较大值，记录得分元素集
  - 这个集合是「可视区域内得分最高的元素的集合」，对这个集合的得分取均值
  - 然后过滤出在平均分之上的元素集合，进行时间计算
  - 这就得到了一个智能的 FMP 时间
- **最终代码由 qbright 实现**：[fmp-timing](https://github.com/qbright/fmp-timing)

## 性能数据获取

- 了解了上述性能指标，来分析一下这些性能指标数据究竟该如何计算获取

### window.performance：强大但有缺点

- 目前最为流行和靠谱的方案是采用 Performance API，它非常强大
  - 不仅包含了页面性能的相关数据，还带有页面资源加载和异步请求的相关数据
- 调用 window.performance.timing 会返回一个对象，这个对象包含各种页面加载和渲染的时间节点
- 如图：

![](https://s21.ax1x.com/2024/09/22/pAMojII.webp)

- 具体解析：

```javascript
const window.performance = {
   memory: {
       usedJSHeapSize,
       totalJSHeapSize,
       jsHeapSizeLimit
   },

   navigation: {
       // 页面重定向跳转到当前页面的次数
       redirectCount,
       // 以哪种方式进入页面
       // 0 正常跳转进入
       // 1 window.location.reload() 重新刷新
       // 2 通过浏览器历史记录，以及前进后退进入
       // 255 其他方式进入
       type,
   },

   timing: {
       // 等于前一个页面 unload 时间，如果没有前一个页面，则等于 fetchStart 时间
       navigationStart
       // 前一个页面 unload 时间，如果没有前一个页面或者前一个页面与当前页面不同域，则值为 0
       unloadEventStart,
       // 前一个页面 unload 事件绑定的回调函数执行完毕的时间
       unloadEventEnd,
       redirectStart,
       redirectEnd,
       // 检查缓存前，准备请求第一个资源的时间
       fetchStart,
       // 域名查询开始的时间
       domainLookupStart,
       // 域名查询结束的时间
       domainLookupEnd,
       // HTTP（TCP） 开始建立连接的时间            connectStart,
       // HTTP（TCP）建立连接结束的时间
       connectEnd,
       secureConnectionStart,
       // 连接建立完成后，请求文档开始的时间
       requestStart,
       // 连接建立完成后，文档开始返回并收到内容的时间
       responseStart,
       // 最后一个字节返回并收到内容的时间
       responseEnd,
       // Document.readyState 值为 loading 的时间
       domLoading,
       // Document.readyState 值为 interactive
       domInteractive,
       // DOMContentLoaded 事件开始时间
       domContentLoadedEventStart,
       // DOMContentLoaded 事件结束时间
       domContentLoadedEventEnd,
       // Document.readyState 值为 complete 的时间            domComplete,
       // load 事件开始的时间
       loadEventStart,
       // load 事件结束的时间
       loadEventEnd
   }
}
```

- 根据这些时间节点，我们选择相应的时间两两做差，便可以计算出一些典型指标：

```javascript
const calcTime = () => {
	let times = {};
	let t = window.performance.timing;

	// 重定向时间
	times.redirectTime = t.redirectEnd - t.redirectStart;

	// DNS 查询耗时
	times.dnsTime = t.domainLookupEnd - t.domainLookupStart;

	// TCP 建立连接完成握手的时间
	connect = t.connectEnd - t.connectStart;

	// TTFB 读取页面第一个字节的时间
	times.ttfbTime = t.responseStart - t.navigationStart;

	// DNS 缓存时间
	times.appcacheTime = t.domainLookupStart - t.fetchStart;

	// 卸载页面的时间
	times.unloadTime = t.unloadEventEnd - t.unloadEventStart;

	// TCP 连接耗时
	times.tcpTime = t.connectEnd - t.connectStart;

	// request 请求耗时
	times.reqTime = t.responseEnd - t.responseStart;

	// 解析 DOM 树耗时
	times.analysisTime = t.domComplete - t.domInteractive;

	// 白屏时间
	times.blankTime = t.domLoading - t.fetchStart;

	// domReadyTime 即用户可交互时间
	times.domReadyTime = t.domContentLoadedEventEnd - t.fetchStart;

	// 用户等待页面完全可用的时间
	times.loadPage = t.loadEventEnd - t.navigationStart;

	return times;
};
```

- 这个 API 非常强大，但是并不适用所有场景
  - 比如：使用 window.performance.timing 所获的数据，在单页应用中改变 URL 但不刷新页面的情况下（单页应用典型路由方案），是不会更新的，还需要开发者重新设计统计方案
  - 同时，可能无法满足一些自定义的数据
- 下面来分析一下部分无法直接获取的性能指标的计算方法

### 自定义时间计算

- 首屏时间的计算实现方式不尽相同，开发者可以根据自己的需求来确定首屏时间的计算方式
  - 对于网页高度小于屏幕的网站来说，统计首屏时间非常简单，只要在页面底部加上脚本，完成当前时间的打印即可，这个时间再通过与 window.performance.timing.navigationStart 时间做差，即得到首屏渲染耗时
  - 但网页高度小于屏幕的站点毕竟是少数：对于网页高度大于一屏的页面来说，只要在估算接近于一屏幕的最后一个元素的位置后，插入计算脚本即可：

```javascript
var time = +new Date() - window.performance.timing.navigationStart;
```

- 显然上述方案是比较理想化的，我们很难通过自动化工具或者一段集中管理的代码进行统计
  - 开发者直接在页面 DOM 中插入时间统计，不仅代码侵入性太强，而且成本很高
  - 同时，这样的计算方式其实并没有考虑首屏图片加载的情况，也就是说首屏图片未加载完的情况下，我们也认为加载已经完成
- 如果要考虑首屏图片的加载，建议使用集中化脚本统计首屏时间的方法：
  - 使用定时器不断检测 img 节点，判断图片是否在首屏且加载完成，找到首屏加载最慢的图片加载完成的时间，从而计算出首屏时间
  - 如果首屏有没有图片，就用 domready 时间：

```javascript
const win = window;
const firstScreenHeight = win.screen.height;
let firstScreenImgs = [];
let isFindLastImg = false;
let allImgLoaded = false;
let collect = [];

const t = setInterval(() => {
	let i, img;
	if (isFindLastImg) {
		if (firstScreenImgs.length) {
			for (i = 0; i < firstScreenImgs.length; i++) {
				img = firstScreenImgs[i];
				if (!img.complete) {
					allImgLoaded = false;
					break;
				} else {
					allImgLoaded = true;
				}
			}
		} else {
			allImgLoaded = true;
		}
		if (allImgLoaded) {
			collect.push({
				firstScreenLoaded: startTime - Date.now(),
			});
			clearInterval(t);
		}
	} else {
		var imgs = body.querySelector('img');
		for (i = 0; i < imgs.length; i++) {
			img = imgs[i];
			let imgOffsetTop = getOffsetTop(img);
			if (imgOffsetTop > firstScreenHeight) {
				isFindLastImg = true;
				break;
			} else if (imgOffsetTop <= firstScreenHeight && !img.hasPushed) {
				img.hasPushed = 1;
				firstScreenImgs.push(img);
			}
		}
	}
}, 0);

const doc = document;
doc.addEventListener('DOMContentLoaded', () => {
	const imgs = body.querySelector('img');
	if (!imgs.length) {
		isFindLastImg = true;
	}
});

win.addEventListener('load', () => {
	allImgLoaded = true;
	isFindLastImg = true;
	if (t) {
		clearInterval(t);
	}
});
```

- 另外一种方式是不使用定时器，且默认影响首屏时间的主要因素是图片的加载，如果没有图片，纯粹渲染文字是很快的，因此，可以通过统计首屏内图片的加载时间获取首屏渲染完成的时间

```javascript
(function logFirstScreen() {
	let images = document.getElementsByTagName('img');
	let iLen = images.length;
	let curMax = 0;
	let inScreenLen = 0;

	// 图片的加载回调
	function imageBack() {
		this.removeEventListener && this.removeEventListener('load', imageBack, !1);
		if (++curMax === inScreenLen) {
			// 所有在首屏的图片均已加载完成的话，发送日志
			log();
		}
	}
	// 对于所有的位于指定区域的图片，绑定回调事件
	for (var s = 0; s < iLen; s++) {
		var img = images[s];
		var offset = {
			top: 0,
		};
		var curImg = img;
		while (curImg.offsetParent) {
			offset.top += curImg.offsetTop;
			curImg = curImg.offsetParent;
		}
		// 判断图片在不在首屏
		if (document.documentElement.clientHeight < offset.top) {
			continue;
		}
		// 图片还没有加载完成的话
		if (!img.complete) {
			inScreenLen++;
			img.addEventListener('load', imageBack, !1);
		}
	}
	// 如果首屏没有图片的话，直接发送日志
	if (inScreenLen === 0) {
		log();
	}
	// 发送日志进行统计
	function log() {
		window.logInfo.firstScreen =
			+new Date() - window.performance.timing.navigationStart;
		console.log(
			'首屏时间：',
			+new Date() - window.performance.timing.navigationStart
		);
	}
})();
```

- 可见，除了使用教科书般强大的 Performance API 外，我们也完全拥有自主权来统计各种页面性能数据
- 这就需要根据具体场景和业务需求，结合已有方案，找到完全适合自己的统计采集方式

## 错误信息收集

- 提到错误收集方案，应该会首先想到两种：try catch 捕获错误和 window.onerror 监听

### 认识 try catch 方案

- 先看一下 try catch 方案：

```javascript
try {
	// 代码块
} catch (e) {
	// 错误处理
	// 在这里，我们可以将错误信息发送给服务端
}
```

- 这种方式需要对预估有错误风险的代码进行包裹，这个包裹过程可以手动添加，也可以通过自动化工具或类库完成
- 自动化方案的基本原理是 AST 技术
  - 比如 UglifyJS 就提供操作 AST 的 API，可以对每个函数添加 try catch，社区上 [foio](https://github.com/foio/try-catch-global.js/blob/master/try-catch-global.js) 的实现，就是一个很好的例子：

```javascript
const fs = require('fs');
const _ = require('lodash');
const UglifyJS = require('uglify-js');

const isASTFunctionNode = node =>
	node instanceof UglifyJS.AST_Defun || node instanceof UglifyJS.AST_Function;

const globalFuncTryCatch = (source, errorHandler) => {
	if (!_.isFunction(errorHandler)) {
		throw 'errorHandler should be a valid function';
	}

	const errorHandlerSource = errorHandler.toString();
	const errorHandlerAST = UglifyJS.parse(
		'(' + errorHandlerSource + ')(error);'
	);
	var tryCatchAST = UglifyJS.parse('try{}catch(error){}');
	const sourceAST = UglifyJS.parse(source);
	var topFuncScope = [];

	tryCatchAST.body[0].catch.body[0] = errorHandlerAST;

	const walker = new UglifyJS.TreeWalker(function (node) {
		if (isASTFunctionNode(node)) {
			topFuncScope.push(node);
		}
	});
	sourceAST.walk(walker);
	sourceAST.transform(transfer);

	const transfer = new UglifyJS.TreeTransformer(null, node => {
		if (isASTFunctionNode(node) && _.includes(topFuncScope, node)) {
			var stream = UglifyJS.OutputStream();
			for (var i = 0; i < node.body.length; i++) {
				node.body[i].print(stream);
			}
			var innerFuncCode = stream.toString();
			tryCatchAST.body[0].body.splice(0, tryCatchAST.body[0].body.length);
			var innerTyrCatchNode = UglifyJS.parse(innerFuncCode, {
				toplevel: tryCatchAST.body[0],
			});
			node.body.splice(0, node.body.length);
			return UglifyJS.parse(innerTyrCatchNode.print_to_string(), {
				toplevel: node,
			});
		}
	});
	const outputCode = sourceAST.print_to_string({ beautify: true });
	return outputCode;
};

module.exports.globalFuncTryCatch = globalFuncTryCatch;
```

- 我们从 globalFuncTryCatch 函数的第一个参数中获得目标代码 source，将其转换为 AST：

```javascript
const sourceAST = UglifyJS.parse(source);
```

- globalFuncTryCatch 函数的第二个参数为我们定义的在出现错误时的响应函数，我们将其字符串化并转为 AST，并插入到 catch 块当中：

```javascript
var tryCatchAST = UglifyJS.parse('try{}catch(error){}');
const errorHandlerSource = errorHandler.toString();
const errorHandlerAST = UglifyJS.parse('(' + errorHandlerSource + ')(error);');
tryCatchAST.body[0].catch.body[0] = errorHandlerAST;
```

- 这样，借助于 globalFuncTryCatch，可以对每个函数添加 try catch 语句，并根据 globalFuncTryCatch 的第二个参数，传入自定义的错误处理函数（可以在该函数中进行错误上报）：

```javascript
globalFuncTryCatch(inputCode, function (error) {
	// 此处是异常处理代码，可以上报并记录日志
	// ...
});
```

- 关键之处在于使用 UglifyJS 的能力，对 AST 语法树进行遍历，并转换：

```javascript
const walker = new UglifyJS.TreeWalker(function (node) {
	if (isASTFunctionNode(node)) {
		topFuncScope.push(node);
	}
});
sourceAST.walk(walker);
sourceAST.transform(transfer);
```

- 最终再返回经过处理后的代码：

```javascript
const outputCode = sourceAST.print_to_string({ beautify: true });
return outputCode;
```

- 使用 try catch，可以保证页面不崩溃，并对错误进行兜底处理，这是一个非常好的习惯

### try catch 方案的局限性

- 但是 try catch 处理异常的能力有限，对于运行时非异步错误，它并没有问题，但是对于：
  - 语法错误
  - 异步错误
- try catch 就无法 cover 了，来看一个运行时非异步错误：

```javascript
try {
	a; // 未定义变量
} catch (e) {
	console.log(e);
}
```

- 可以被 try catch 处理，但是，将上述代码改动为语法错误：

```javascript
try {
   var a =\ 'a'
} catch(e) {
   console.log(e);
}
```

- 就无法捕获
- 再看一下异步的情况：

```javascript
try {
	setTimeout(() => {
		a;
	});
} catch (e) {
	console.log(e);
}
```

- 也无法捕获

![](https://s21.ax1x.com/2024/09/22/pAM7ip6.webp)

- 除非在 setTimeout 中再加一层 try catch：

![](https://s21.ax1x.com/2024/09/22/pAM7Cfx.webp)

- **<font color=red>总结一下，try catch 能力有限，且对于代码的侵入性较强</font>**

### 认识 window.onerror

- 再看一下 window.onerror 对错误进行处理的方案：
  - 只需要给 window 添加 onerror 事件监听
  - 同时注意需要将 window.onerror 放在所有脚本之前
  - 这样才能对语法异常和运行异常进行处理

```javascript
window.onerror = function (message, source, lineno, colno, error) {
	// ...
};
```

- 这里的参数较为重要，包含稍后需要上传的信息：
  - mesage 为错误信息提示
  - source 为错误脚本地址
  - lineno 为错误的代码所在行号
  - colno 为错误的代码所在列号
  - error 为错误的对象信息，比如 error.stack 获取错误的堆栈信息
- **window.onerror 这种方式对代码侵入性较小，也就不必涉及 AST 自动插入脚本**
- **除了对语法错误和网络错误（因为网络请求异常不会事件冒泡）无能为力以外，无论是异步还是非异步，onerror 都能捕获到运行时错误**

:::warning
- 需要注意的是，**如果想使用 window.onerror 函数消化错误，需要显示返回 true，以保证错误不会向上抛出，控制台也就不会看到一堆错误提示**
:::

### 跨域脚本的错误处理

- 现实场景多种多样，比如一种情况是：**加载不同域的 JavaScript 脚本**
  - 这样的场景较为常见，比如「加载第三方内容，以展示广告，进行性能测试、错误统计，或者想用第三方服务」等
- 对于不同域的 JavaScript 文件，window.onerror 不能保证获取有效信息
- 由于安全原因，不同浏览器返回的错误信息参数可能并不一致
  - 比如，跨域之后 window.onerror 在很多浏览器中是无法捕获异常信息的，要统一返回 Script error，这就需要 script 脚本设置为：

```javascript
crossorigin = 'anonymous';
```

- 同时服务器添加 `Access-Control-Allow-Origin` 以指定允许哪些域的请求访问

### 使用 source map 进行错误还原

- 如果错误脚本是经过压缩的，那么纵使有千般本领，也无用武之地了，因为这样捕获到的错误信息的位置（行列号）就会出现较大偏差，错误代码也经过压缩而难以辨认
- 这时候就需要启用 source map，很多构建工具都支持 source map
  - 比如我们利用 webpack 打包压缩生成的一份对应脚本的 map 文件进行追踪，在 webpack 中开启 source map 功能：

```javascript
module.exports = {
	// ...
	devtool: '#source-map',
	// ...
};
```

- 更多 source map 的内容，还可以参考以下资料：
  - [JavaScript Source Map 详解](https://www.ruanyifeng.com/blog/2013/01/javascript_source_map.html)
  - [Using source maps](https://webpack.js.org/guides/development/%23using-source-maps)

### 对 Promise 错误处理

- 一般提倡养成写 Promise 的时候最后写上 catch 函数的习惯
  - ESLint 插件 eslint-plugin-promise 会帮我们完成这项工作，使用规则：catch-or-return 来保障代码中所有的 promise（被显式返回的除外）都有相应的 catch 处理
- 比如这样的写法：

```jsx
var p = new Promise();
p.then(fn1);
p.then(fn1, fn2);
function fn1() {
	p.then(doSomething);
}
```

- 是无法通过代码检查的
- 这类 ESLint 插件基于 AST 实现，逻辑也很简单：

```javascript
module.exports = {
	meta: {
		docs: {
			// ...
		},
		messages: {
			// ...
		},
	},
	create(context) {
		const options = context.options[0] || {};
		const allowThen = options.allowThen;
		let terminationMethod = options.terminationMethod || 'catch';

		if (typeof terminationMethod === 'string') {
			terminationMethod = [terminationMethod];
		}

		return {
			ExpressionStatement(node) {
				if (!isPromise(node.expression)) {
					return;
				}

				if (
					allowThen &&
					node.expression.type === 'CallExpression' &&
					node.expression.callee.type === 'MemberExpression' &&
					node.expression.callee.property.name === 'then' &&
					node.expression.arguments.length === 2
				) {
					return;
				}

				if (
					node.expression.type === 'CallExpression' &&
					node.expression.callee.type === 'MemberExpression' &&
					terminationMethod.indexOf(node.expression.callee.property.name) !== -1
				) {
					return;
				}

				if (
					node.expression.type === 'CallExpression' &&
					node.expression.callee.type === 'MemberExpression' &&
					node.expression.callee.property.type === 'Literal' &&
					node.expression.callee.property.value === 'catch'
				) {
					return;
				}

				context.report({
					node,
					messageId: 'terminationMethod',
					data: { terminationMethod },
				});
			},
		};
	},
};
```

- 可能大家会想到，promise 实例的 then 方法中的第二个 onRejected 函数也能处理错误，这个和上面提到的 catch 方法有什么差别呢？
- 事实上，我更加推荐 catch 方法，请看下面代码：

```javascript
new Promise((resolve, reject) => {
	throw new Error();
})
	.then(
		() => {
			console.log('resolved');
		},
		err => {
			console.log('rejected');
			throw err;
		}
	)
	.catch(err => {
		console.log(err, 'catch');
	});
```

- 输出：rejected，在有 onRejected 的情况下，onRejected 发挥作用，catch 并未被调用，而当：

```javascript
new Promise((resolve, reject) => {
	resolve();
})
	.then(
		() => {
			throw new Error();
			console.log('resolved');
		},
		err => {
			console.log('rejected');
			throw err;
		}
	)
	.catch(err => {
		console.log(err, 'catch');
	});
```

- 输出：`VM705:10 Error at Promise.then (:4:9) "catch"`，此时 onRejected 并不能捕获 then 方法中第一个参数 onResolved 函数中的错误，一经对比，也许 catch 是进行错误处理更好的选择
- 除此之外，对于 Promise 的错误处理，还可以注册对 Promise 全局异常的捕获事件 unhandledrejection：

```javascript
window.addEventListener('unhandledrejection', e => {
	e.preventDefault();
	console.log(e.reason);
	return true;
});
```

- 这对于集中管理和错误收集更加友好

### 处理网络加载错误

- 设想用 script 标签，link 标签进行脚本或者其他资源加载时，由于某种原因（可能是服务器错误，也可能是网络不稳定），导致了脚本请求失败，网络加载错误

```html
<script src="***.js"></script>
<link rel="stylesheet" href="***.css" />
```

- 为了捕获这些加载异常，我们可以：

```html
<script src="***.js" onerror="errorHandler(this)"></script>
<link rel="stylesheet" href="***.css" onerror="errorHandler(this)" />
```

- 除此之外，也可以使用 `window.addEventListener('error')` 方式对加载异常进行处理

:::warning
- 注意这时候无法使用 window.onerror 进行处理
- 因为 window.onerror 事件是通过事件冒泡获取 error 信息的，而网络加载错误是不会进行事件冒泡的
- 不支持冒泡的事件还有：鼠标聚焦 / 失焦（focus / blur）、鼠标移动相关事件（mouseleave / mouseenter）、一些 UI 事件（如 scroll、resize 等）
:::  

- 因此就知道 window.addEventListener 不同于 window.onerror，它通过事件捕获获取 error 信息，从而可以对网络资源的加载异常进行处理：

```javascript
window.addEventListener(
	'error',
	error => {
		console.log(error);
	},
	true
);
```

- 那么，怎么区分网络资源加载错误和其他一般错误呢？
- 普通错误的 error 对象中会有一个 error.message 属性，表示错误信息，而资源加载错误对应的 error 对象却没有，因此可以根据下面代码进行判断：

```javascript
window.addEventListener(
	'error',
	error => {
		if (!error.message) {
			// 网络资源加载错误
			console.log(error);
		}
	},
	true
);
```

- 但是，也因为没有 error.message 属性，也就没有额外信息获取具体加载的错误细节，现阶段也无法具体区分加载的错误类别
  - 比如是 404 资源不存在还是服务端错误等，只能配合后端日志进行排查
- **<font color=red>分析一下 window.onerror 和 window.addEventListener('error') 的区别</font>**
  - window.onerror 需要进行函数赋值：`window.onerror = function() {//...}`
    - 因此重复声明后会被替换，后续赋值会覆盖之前的值，这是一个弊端

![](https://s21.ax1x.com/2024/09/22/pAM7k6O.webp)

- 而 `window.addEventListener('error')` 可以绑定多个回调函数，按照绑定顺序依次执行，请看下图示例：

![](https://s21.ax1x.com/2024/09/22/pAM7e7d.webp)

### 页面崩溃收集和处理

- 一个成熟的系统还需要收集崩溃和卡顿，对此可以监听 window 对象的 load 和 beforeunload 事件，并结合 sessionStorage 对网页崩溃实施监控：

```javascript
window.addEventListener('load', () => {
	sessionStorage.setItem('good_exit', 'pending');
});

window.addEventListener('beforeunload', () => {
	sessionStorage.setItem('good_exit', 'true');
});

if (
	sessionStorage.getItem('good_exit') &&
	sessionStorage.getItem('good_exit') !== 'true'
) {
	// 捕获到页面崩溃
}
```

- 首先在网页 load 事件的回调里：利用 sessionStorage 记录 good_exit 值为 pending
- 接下来，在页面无异常退出前，即 beforeunload 事件回调中，修改 sessionStorage 记录的 good_exit 值为 true
- 因此，如果页面没有崩溃的话，good_exit 值都会在离开前设置为 true，否则就可以通过 `sessionStorage.getItem('good_exit') && sessionStorage.getItem('good_exit') !== 'true'` 判断出页面崩溃，并进行处理

:::info
- 如果你的应用部署了 PWA，那么便可以享受 service worker 带来的福利，可以通过 service worker 来完成网页崩溃的处理工作
- 基本原理在于：service worker 和网页的主线程独立
- 因此，即便网页发生了崩溃现象，也不会影响 service worker 所在线程的工作
- 我们在监控网页的状态时，通过 navigator.serviceWorker.controller.postMessage API 来进行信息的获取和记录
:::

### 框架的错误处理

- 对于框架来说
  - React 16 版本之前，使用 unstable_handleError 来处理捕获的错误，16 版本之后，使用著名的 componentDidCatch 来处理错误
  - Vue 中，提供了 Vue.config.errorHandler 来处理捕获到的错误，如果开发者没有配置 Vue.config.errorHandler，那么捕获到的错误会以 console.error 的方式输出
- 上面提到框架会用 console.error 的方法抛出错误，因此可以劫持 console.error，捕获框架中的错误并做出处理：

```javascript
const nativeConsoleError = window.console.error;
window.console.error = (...args) =>
	nativeConsoleError.apply(this, [`I got ${args}`]);
```

- 如下图

![](https://s21.ax1x.com/2024/09/22/pAM7Gng.webp)

- 总结一下，大概处理了以下错误或者异常：
  - JavaScript 语法错误、代码异常
  - AJAX 请求异常（xhr.addEventListener('error', function (e) { //... })）
  - 静态资源加载异常
  - Promise 异常
  - 跨域 Script error
  - 页面崩溃
  - 框架错误
- 在真实生产环境中，错误和异常多种多样，需要格外留心，并对每一种情况进行覆盖
- 另外，除了性能和错误信息，一些额外信息，比如页面停留时间、长任务处理耗时等往往对分析网页表现非常重要

## 性能数据和错误信息上报

- 数据都有了，该如何上报呢？可能会想：「不就是一个 AJAX 请求吗？」，实际上还真没有这么简单，有一些细节需要考虑

### 上报采用单独域名是否更好

- 我们发现，成熟的网站数据上报的域名往往与业务域名并不相同，这样做的好处主要有两点：
  - 使用单独域名，可以防止对主业务服务器的压力，能够避免日志相关处理逻辑和数据在主业务服务器的堆积
  - 另外，很多浏览器对同一个域名的请求量有并发数的限制，单独域名能够充分利用现代浏览器的并发设置

### 独立域名的跨域问题

- 对于单独的日志域名，肯定会涉及跨域问题
- 经常发现页面使用「构造空的 Image 对象的方式」进行数据上报
- 原因是请求图片并不涉及跨域的问题

```javascript
let url = 'xxx';
let img = new Image();
img.src = url;
```

- 我们可以将数据进行序列化，作为 URL 参数传递

```jsx
let url = 'xxx?data=' + JSON.stringify(data);
let img = new Image();
img.src = url;
```

### 何时上报数据

- 页面加载性能数据可以在页面稳定后进行上报
- 一次上报就是一次访问，对于其他错误和异常数据的上报，假设我们的应用日志量很大，则有必要合并日志在统一时间，统一上报
- 那么什么情况下上报性能数据呢？一般合适的场景为：
  - 页面加载和重新刷新
  - 页面切换路由
  - 页面所在的 Tab 标签重新变得可见
  - 页面关闭
- 但是，对于越来越多的单页应用来说，需要格外注意数据上报时机

### 单页应用上报

- 如果切换路由是通过改变 hash 值来实现的，那么只需要监听 hashchange 事件，如果是通过 history API 来改变 URL，那么需要使用 pushState 和 replaceState 事件
- 当然一劳永逸的做法是进行 monkey patch，结合发布订阅模式，为相关事件的触发添加处理：

```javascript
const patchMethod = type => () => {
	const result = history[type].apply(this, arguments);
	const event = new Event(type);
	event.arguments = arguments;
	window.dispatchEvent(event);
	return result;
};

history.pushState = patchMethod('pushState');
history.replaceState = patchMethod('replaceState');
```

- 通过重写 history.pushState 和 history.replaceState 方法，添加并触发 pushState 和 replaceState 事件
- 这样一来 history.pushState 和 history.replaceState 事件触发时，可以添加订阅函数，进行上报

```javascript
window.addEventListener('replaceState', e => {
	// report...
});
window.addEventListener('pushState', e => {
	// report...
});
```

### 何时以及如何上报

- 如果是在页面离开时进行数据发送，那么在页面卸载期间是否能够安全地发送完数据是一个难题
- 因为页面跳转，进入下一个页面，就难以保证异步数据的发送了
- 如果使用同步的 AJAX：

```javascript
window.addEventListener('unload', logData, false);
const logData = () => {
	var client = new XMLHttpRequest();
	client.open('POST', '/log', false); // 第三个参数表明是同步的 XHR
	client.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8');
	client.send(data);
};
```

- 又会对页面跳转流畅程度和用户体验造成影响
- 推荐一下 sendBeacon 方法：

```javascript
window.addEventListener('unload', logData, false);

const logData = () => {
	navigator.sendBeacon('/log', data);
};
```

- navigator.sendBeacon 就是天生来解决「页离开时的请求发送」问题的，它的几个特点决定了对应问题的解决方案：
  - 它的行为是异步的，也就是说请求的发送不会阻塞向下一个页面的跳转，因此可以保证跳转的流畅度
  - 它在不受到极端「数据 size 和队列总数」的限制下，优先返回 true 以保证请求的发送成功
- 目前 Google Analytics 使用 navigator.sendBeacon 来上报数据，请参考：[Google Analytics added sendBeacon functionality to Universal Analytics JavaScript API](https://www.thyngster.com/google-analytics-added-sendbeacon-functionality-universal-analytics-javascript-api/)
- 通过这篇文章，看到 Google Analytics 通过动态创建 img 标签，在 img.src 中拼接 URL 的方式发送请求，不存在跨域限制
- 如果 URL 太长，就会采用 sendBeacon 的方式发送请求，如果 sendBeacon 方法不兼容，则发送 AJAX post 同步请求，类似：

```javascript
const reportData = url => {
	// ...
	if (urlLength < 2083) {
		imgReport(url, times);
	} else if (navigator.sendBeacon) {
		sendBeacon(url, times);
	} else {
		xmlLoadData(url, times);
	}
};
```

- 最后，如果网页访问量很大，那么一个错误发送的信息就非常多，我们可以给上报设置一个采集率
- 这个采集率当然可以通过具体实际的情况来设定，方法多种多样

```javascript
const reportData = url => {
	// 只采集 30%
	if (Math.random() < 0.3) {
		send(data);
	}
};
```

## 无侵入和性能友好的方案设计

- 目前为止，已经了解了性能监控和错误收集的所有必要知识点，那么根据这些知识点，**<font color=red>如何设计一个好的系统方案呢？</font>**
  - 首先，这样的系统大致可分为四个阶段：
    - **数据上报优化方面**
      - 借助 HTTP 2.0 带来的新特性，可以持续优化上报性能
        - 比如：采用 HTTP 2.0 头部压缩，以减少数据传送大小
        - 采用 HTTP 2.0 多路复用技术，以充分利用链接资源
    - **接口和智能化设计方面**
      - 我们可以考虑以下方面：
        - 识别周高峰和节假日，动态设置上报采样率
        - 增强数据清洗能力，提高数据的可用性，对一些垃圾信息进行过滤
        - 通过配置化，减少业务接入成本
        - 如果用户一直触发错误，相同的错误内容会不停上报，这时可以考虑是否需要做一个短时间滤重
    - **实时性方面**
      - 目前我们对系统数据的分析都是后置的，如何做到实时提醒呢？
      - 这就要依赖后端服务，将超过阈值的情况进行邮件或短信发送
      - 在这个链路中，所有细节单独拿出来都是一个值得玩味的话题
        - 打个比方，报警阈值如何设定
          - 我们的应用可能在不同的时段和日期，流量差别很大，比如「点评」类应用，或「酒店预订」类应用，在节假日流量远远高于平时
          - 如果报警阈值不做特殊处理，报警过于敏感，也许运维或开发者就要收到「骚扰」
          - 业界上流行 3-sigma 的阈值设置，这是一个统计学概念
            - 它表示对于一个正态分布或近似正态分布来说，数值分布在（μ-3σ,μ+3σ) 中属于正常范围区间
            - 这方面更多内容可以参考：
              - [https://www.investopedia.com/terms/t/three-sigma-limits.asp](https://www.investopedia.com/terms/t/three-sigma-limits.asp)
              - [What does a 1-sigma, a 3-sigma or a 5-sigma detection mean](https://thecuriousastronomer.wordpress.com/2014/06/26/what-does-a-1-sigma-3-sigma-or-5-sigma-detection-mean/)
- 最后，业界几个性能监控和错误收集上报系统的分享，这些分享方案有的以 PPT 形式呈现，有的以源码分析实现
  - [前端异常监控解决方案研究](https://cdc.tencent.com/2018/09/13/frontend-exception-monitor-research/)
  - [解密 ARMS 前端监控数据上报技术内幕](https://zhuanlan.zhihu.com/p/37275225)
  - [别再让你的 Web 页面在用户浏览器端裸奔](https://mp.weixin.qq.com/s/Z8daa96JD5NbjTPn9mGPPg)
  - [把前端监控做到极致](https://zhuanlan.zhihu.com/p/32262716)

## 总结

- 前端业务场景和浏览器的兼容性千差万别，因此数据监控上报系统要兼容多种情况
- 页面生命周期、业务逻辑复杂性也决定了成熟稳定的系统不是一蹴而就的
- 我们要持续打磨，结合新技术和老经验，同时对比类似 Sentry 这样的巨型方案，探索更稳定高效的系统
