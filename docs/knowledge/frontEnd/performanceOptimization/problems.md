---
title: 性能优化问题，老司机如何解决
date: 2022-02-23
order: 2
---

- 一直以来，性能优化是前端的重要课题，不仅实实在在影响产品性能，在面试环节也会被反复提及。无论应聘者是初入前端的新手，还是工作经验丰富的老司机，面试官都能在性能方面找到合适的切入点，对候选人进行考察。作为程序员，应该如何在平时学习、工作中积累性能优化方面的经验，保障产品顺畅体验？作为面试者，如何在面试流程中出色地回答性能相关问题？
- **前端性能是一个太过宽泛的话题，脱离场景和需求谈性能往往毫无意义。**我相信很少有面试官会直接把：「前端如何优化性能？」——这样一个空架子问题抛出的。也不会有技术经理直接丢给你「把产品性能提升一些」这样的项目。毕竟这样的问题过大，根本让人无处下手。我们还需要针对具体场景和瓶颈来分析。
- 但是，如果真的有面试官这么问了呢？
- 如果是我，我也许会这样回答：
- 前端性能涉及方方面面，优化角度切入点都有所不同。我认为，主要可以分为：页面工程优化和代码细节优化两大方向。
- **页面工程优**化从页面请求开始，涉及网络协议、资源配置、浏览器性能、缓存等；**代码细节优化**上相对零散，比如 JavaScript 对 DOM 操作，宿主环境的单线程相关内容等。
- 也正如上所答，本节课程也会基于以下两个大方向的相关知识进行梳理：
    - 页面工程优化
    - 代码细节优化
- 为了更好地还原真实场景，这两方面我都将配合两类面试题目来解析：
    - 开放例题实战
    - 代码例题实战
- 这个主题的知识点如下：

## 开放例题实战

- 如上分析，面试官往往会根据面试者的实际经验或者性能的某一细分方向，进行深度提问，以了解候选人的知识储备以及在以往项目中的表现。
- 作为一个面试者，包括在蚂蚁金服、阿里淘宝某团队、头条、美团以及其他公司的多次面试流程中，我曾经被问到过：**「在平时工作中做过哪些性能优化方面的项目？」**
- 我是这样回答的：
- 因为我服务的是有亿级流量的 To C 型产品，因此平时工作中，在性能优化方面一直持续进行探索和迭代。除了代码细节方面外，较大型工程优化主要有 WebP 图片格式替换、资源打包和逆向代码拆分（按需加载）等。

### WebP 图片优化

- 因为并不知道面试官需要考察的程度，以上回答可以避免自己「侃侃而谈」浪费时间的尴尬。在这样的面试场景中，我往往会把主动权交给面试官。大部分面试官会继续追问，比如他对 WebP 图片格式优化项目感兴趣，那我会从项目的立项、实施、收益的角度进行解答，表现作为一个项目负责人对优化项目的理解：
- 我们的产品页面中，往往存在大量的图片内容，因此图片的性能优化是瓶颈和重点。除了传统的图片懒加载手段以外，我调研并实施了 WebP 图片格式的替换。由于可能会有潜在兼容性的问题，因而具体做法是先进行兼容性嗅探。这一手段借鉴了社区一贯做法，利用 img 标签加载一张 base64 的 WebP 图片，并将结果存入 localStorage 中防止重复判断。如果该终端支持，则再对图片格式进行替换。这个兼容性嗅探过程，也封装成 promise 化的通用接口。
- 相关代码片段如下：

```jsx
const supportWebp = () => new Promise(resolve => {
   const image = new Image()
   image.onerror = () => resolve(false)
   image.onload = () => resolve(image.width === 1)
   image.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA='
}).catch(() => false)
```

- 这时候，面试官往往会进一步关心项目收益情况。这就需要面试者根据实情作答，仍然以这个项目为例：
- 在具体上线时，我对 10% 的流量进行了分组切分。5% 为对照组，仍然采用传统格式；另外 5% 为实验组，进行 WebP 格式试验。 最终结果显示收益非常有限。 为此我进行分析：认为出现近似零收益的原因是图片服务的缓存问题。新转换的一批 WebP 格式图片由于没有缓存，因而在性能上打了折扣。为了验证猜想，我决定继续进行扩量试验并观察结果。果然，后续排除缓存问题之后，收益提升 25%~30% 左右。
- 这里，我们就涉及了工程优化中的一个重要环节：网络请求和缓存。这些内容我们会在后续课程网络环节《第 8-1 课：缓存谁都懂，一问都哑口》中具体展开。
- 通过以上回答，我如实讲述了出现的非预期 case，并说明遇见问题时，如何进行分析进而解决问题的一系列过程。这样的回答能明确表现出我确实做过该项目并进行了思考分析，最终落地。这类思路也更容易被面试官所接受。
- 更多关于 WebP 的好文章：
    - [WebP Support - It's More Than You Think](https://links.jianshu.com/go?to=https%3A%2F%2Fwww.keycdn.com%2Fsupport%2Fwebp-support)
    - [从零开始带你认识最新的图片格式 WebP](https://links.jianshu.com/go?to=http%3A%2F%2Fwww.uisdc.com%2Fimage-format-webp-introduction)
    - [把网站的图片升级到 WebP 格式吧](https://links.jianshu.com/go?to=https%3A%2F%2Fsegmentfault.com%2Fa%2F1190000007482148)
- 也由此看出，性能优化其实并不难做，重要的是解决问题的思路，以及解决过程中对于项目的把控和推荐。这些内容我们称之为「软素质」。

### 按需加载优化

- 如果面试官围绕着刚才列举的「资源打包和逆向拆分（按需加载）」方向提问，我仍然会采用同样的「思路」进行回答：
- 我接手项目之后，发现历史原有的资源打包配置并不合理，严重影响了性能表现。因此借助构建工具，对资源进行合并打包。但是，需要注意的是，我的策略并不是大刀阔斧地进行资源合并，因为这样会让 bundle.js 的 size 越来越大，所以也进行了逆向过程。
- 以实际页面为例：
- 如上，当点击左图播放按钮之后，页面出现视频列表浮层（右侧所示，仍为同一页面，类似单页应用）。视频列表浮层包含了滚动处理、视频播放等多项复杂逻辑，因此关于这个浮层的脚本我并没有进行打包合并，而是单独进行拆分。当用户点击浮层触发按钮后，再执行对这一部分脚本的请求。
- 工程化性能优化不仅需要做，还要用数据证明做法的合理性：
- 同时，我对用户点击触发按钮的概率进行统计，发现进入页面的用户只有 10% 左右会点击按钮，从而触发视频列表浮层。也就是说，大部分用户（90%）并不会看到这一浮层，延迟按需加载是有统计数据支持的。
- 通过这个案例，我们发现性能优化其实是一个开放式问题，非常依赖实践。读者可根据上面的例子，结合自己的项目进行回答。
- 虽然没有涉及代码实施，但是建立起项目意识和方向意识，这在工程化性能上非常难能可贵。上面提到的借助构建工具进行「按需加载」等内容，前面章节如《webpack 工程师 > 前端工程师》都会具体从代码角度给出示例。
- 当然上述举例的按需加载，我们并不是使用成熟的 webpack 工具链，而是采用公司内部封装的工程化工具。在几年前，这样的方案并不成熟，因此我写了一些按需加载的差距，配合自己的工程化工具使用。这一方面内容，很多面试官会很感兴趣，话题也可以延伸到 FIS 和 webpack 的比较，工程化工具的设计等话题。

### 讲不完的工程化优化

- 此外，工程优化方向还包括：
    - 图片懒加载
    - 雪碧图
    - 合理设置缓存策略
    - 使用 prefetch / preload 预加载等新特性
    - 以 tree shaking 手段为主的代码瘦身
- 这里不再一一举例，欢迎订阅此课程的同学结合自己的经历在评论区留言讨论或者直接向我提问，我会尽量拿出时间跟大家一起进行项目分析、描述。
- 以上是工程化性能的实际题目，总结一下：工程师需要对日常项目进行深入总结，结合产品角度、研发角度描述。在面试前就需要做到「心中有数，胸有成竹」。
- 另外，在具体的实现方向上，关于性能优化的切入点也有很多。比如：
    - 动画性能方向
    - 操作 DOM 方向
    - 浏览器加载、渲染性能方向
    - 性能测量、监控方向
- 这些方向并不是相互独立的，它们彼此依存，**比如动画性能方向与浏览器渲染性能息息相关。**这里我用一道经典的面试题来分析：**「如果发现页面动画效果卡顿，你会从哪些角度解决问题？」**
- 首先从动画实现入手：
    - 一般 CSS3 动画会比基于 JavaScript 实现的动画效率要高，因此优先使用 CSS3 实现效果（这一点并不绝对）
    - 在使用 CSS3 实现动画时，考虑开启 GPU 加速（这一点也并不总是正向效果）
    - 优先使用消耗最低的 transform 和 opacity 两个属性
    - 使用 will-change 属性
    - 独立合成层，减少绘制区域
    - 对于只能使用 JavaScript 实现动画效果的情况，考虑 requestAnimationFrame、requestIdleCallback API
    - 批量进行样式变换，减少布局抖动
- 事实上，上面每一点的背后都包含着很多知识点，例如：
    - 如何理解 requestAnimationFrame 和 60 fps
    - 如何实现 requestAnimationFrame polyfill
    - 哪些操作会触发浏览器 reflow（重排）或者 repaint（重绘）
    - 对于给出的代码，如何进行优化
    - 如何实现滚动时的节流、防抖函数
- 这些问题，我们会拿出其中几个在下一节分析。同时，订阅课程的朋友们，都可以在下节课末尾彩蛋区获得我在这些主题方向上收藏的文章。

## 总结

- 工程化优化是一个太大的话题了，本节课我们只是在「大面上」进行方向指引，以面试为角度抛砖引玉，更多具体代码细节实例，下节课我们会继续探讨。
- 另外，正因为这个话题的特殊性，一千个项目，就有一千个优化场景，也欢迎大家拿出来项目中的具体情况，跟我讨论。

## 代码例题实战

- 「白板写代码」是考察候选人基础能力、思维能力的有效手段。这一部分，我们列举几个性能相关的代码片段，供读者体会。

### 实战 1：初步解决布局抖动问题

- 请候选人对以下代码进行优化：

```javascript
var h1 = element1.clientHeight
element1.style.height = (h1 * 2) + 'px'

var h2 = element2.clientHeight
element2.style.height = (h2 * 2) + 'px'

var h3 = element3.clientHeight
element3.style.height = (h3 * 2) + 'px'
```

- 这是一道较为基础的题目，上面的代码，会造成典型的布局抖动问题。
- **布局抖动**是指 DOM 元素被 JavaScript 多次反复读写，导致文档多次无意义重排。我们知道浏览器很「懒」，它会收集（batch）当前操作，统一进行重排。可是，如果在当前操作完成前，从 DOM 元素中获取值，这会迫使浏览器提早执行布局操作，这称为**强制同步布局**。这样的副作用对于低配置的移动设备来说，后果是不堪设想的。
- 我们对 element1 进行读、写操作之后，又企图去获取 element2 的值，浏览器为了获取正确的值，只能进行重排。优化思路为：

```javascript
// 读
var h1 = element1.clientHeight
var h2 = element2.clientHeight
var h3 = element3.clientHeight

// 写（无效布局）
element1.style.height = (h1 * 2) + 'px'
element2.style.height = (h2 * 2) + 'px'
element3.style.height = (h3 * 2) + 'px'
```

### 实战 2：使用 window.requestAnimationFrame 对上述代码优化

- 如果读者对 window.requestAnimationFrame 不熟悉的话，我们先来看一下 MDN 上的说明：
- 该方法告诉浏览器你希望执行的操作，并请求浏览器在下一次重绘之前调用指定的函数来更新。
- 语法：

```javascript
window.requestAnimationFrame(callback)
```

- 也就是说，当你需要更新屏幕画面时就可以调用此方法。在浏览器下次重绘前统一执行回调函数，优化方案：

```jsx
// 读
var h1 = element1.clientHeight
// 写
requestAnimationFrame(() => {
   element1.style.height = (h1 * 2) + 'px'
})

// 读
var h2 = element2.clientHeight
// 写
requestAnimationFrame(() => {
   element2.style.height = (h2 * 2) + 'px'
})

// 读
var h3 = element3.clientHeight
// 写
requestAnimationFrame(() => {
   element3.style.height = (h3 * 2) + 'px'
})
```

- 我们将代码中所有 DOM 的写操作在下一帧一起执行，保留所有 DOM 的读操作在当前同步状态。这样有效减少了无意义的重排，显然效率更高。

### 实战 3：延伸题目，实现 window.requestAnimationFrame 的 polyfill

- polyfill 就是我们常说的垫片，此处指在浏览器兼容性不支持的情况下，备选实现方案。
- window.requestAnimationFrame 在一些老版本浏览器中无法兼容，为了让代码在老机器也能运行不报错，请用代码实现：

```jsx
if (!window.requestAnimationFrame) window.requestAnimationFrame = (callback, element) => {
   const id = window.setTimeout(() => {
       callback()
   }, 1000 / 60)
   return id
}
if (!window.cancelAnimationFrame) window.cancelAnimationFrame = id => {
   clearTimeout(id)
}
```

- 上面的代码按照 1 秒钟 60 次（大约每 16.7 毫秒一次），并使用 window.setTimeout 来进行模拟。这是一种粗略的实现，并没有考虑统一浏览器前缀和 callback 参数等问题。一般需求中，实现上面的答案已经可以符合要求了。

### 实战 4：为以下每个 li 添加点击事件

```javascript
//...
```

- 这道题目非常基础，但是实现方式上需要注意是否使用了事件委托。如果候选人直接对 li 进行绑定处理，那么很容易给面试官留下「平时代码习惯不好」的印象，造成潜在性能负担。更好的做法显然是：

```jsx
window.onload = () => {
   const ul = document.getElementsByTagName('ul')[0]
   const liList = document.getElementsByTagName('li')

   ul.onclick = e => {
       const normalizeE = e || window.event
       const target = normalizeE.target || normalizeE.srcElement

       if (target.nodeName.toLowerCase() == "li") {
           alert(target.innerHTML)
       }
   }
}
```

- 一般情况下，作为面试官，我不会提示候选人采用事件委托的写法，而是观察候选人的第一反应，对其代码习惯进行考察。如果候选人没有采用事件委托的写法，才会进一步追问。

### 实战 5：实现节流、防抖

- 我们知道，鼠标滚动（scroll）、调整窗口大小（resize）、敲击键盘（keyup）这类事件在触发时往往频率极高。这时候事件对应的回调函数也会在极短时间内反复执行。想象一下，如果这些回调函数内的逻辑涉及复杂的计算，或者对 DOM 操作非常频繁，从而造成大量布局操作、绘制操作，那么就存在阻塞主线程的危险，直接后果就是掉帧，用户能够感受到明显的卡顿。
- 有经验的程序员为了规避这样的问题，往往会使用节流（throttle）或者防抖（debounce）来进行处理。因此节流和防抖已经成为非常常见的优化手段，现如今也是面试的必考题型之一。
- **节流和防抖总是一起出现，那么它们有什么不同呢？**
- 回答这个问题，我们首先要知道它们解决的问题相同，方向类似：两者并不会减少事件的触发，而是减少事件触发时回调函数的执行次数。为了达成这个目的，节流和防抖采用的手段有所差别。
    - 防抖：抖动现象本质就是指短时间内高频次触发。因此，我们可以把短时间内的多个连续调用合并成一次，也就是只触发一次回调函数。
    - 节流：顾名思义，就是将短时间的函数调用以一个固定的频率间隔执行，这就如同水龙头开关限制出水口流量。
- [这个例子](https://links.jianshu.com/go?to=http%3A%2F%2Fcaiogondim.github.io%2Fjs-debounce-throttle-visual-explanation%2F)可以很形象地展示节流与防抖的区别。
- 另外，请参考防抖图示：
- 节流图示：
- 了解了原理，我们先来实现事件防抖：

```jsx
// 简单的防抖动函数
const debounce = (func, wait, immediate) => {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;

    const callNow = immediate & !timeout;

    timeout && clearTimeout(timeout);

    timeout = setTimeout(function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    }, wait);

    if (callNow) func.apply(context, args);
  };
};
```

```tsx
// 采用了防抖动
window.addEventListener('scroll', debounce(() => {
   console.log('scroll')
}, 500))

// 没采用防抖动
window.addEventListener('scroll', () => {
   console.log('scroll')
})
```

- 如代码所示，我们使用 setTimeout 在 500ms 后执行事件回调，如果在这 500ms 内又有相关事件触发，则通过 clearTimeout(timeout) 取消上一次设置的回调。因此在 500ms 内没有连续触发多次 scroll 事件，才会真正触发 scroll 回调函数——或者说，500ms 内的多次调用被归并成了一次，在最后一次「抖动」后，进行回调执行。同时，我们设置了 immediate 参数，用以立即执行。关于 func.apply 的用法，学习过《第 1-1 课：一网打尽 this，对执行上下文说 Yes》的读者应该不会陌生。
- 关于事件节流：

```jsx
const throttle = (func, wait) => {
  let startTime = 0;
  return function () {
    let handleTime = +new Date();
    let context = this;
    const args = arguments;

    if (handleTime - startTime >= wait) {
      func.apply(context, args);
      startTime = handleTime;
    }
  };
};

window.addEventListener(
  'scroll',
  throttle(() => {
    console.log('scroll');
  }, 500)
);
```

- 当然，我们同样可以用 setTimeout 来实现：

```jsx
const throttle = (func, wait) => {
    let timeout 

    return function () {
        const context = this
        const args = arguments
        if (!timeout) {
            timeout = setTimeout(function() {
                func.apply(context, args)
                   timeout = null
          }, wait)
        }
    }
 }
```

- 与防抖相比，少了 clearTimeout 的操作，请读者细心对比。
- 要准确理解节流和防抖，需要多动手实践。这里也建议大家有时间研究研究 lodash 库关于节流和防抖的实现。事实上，这个话题还可以玩出很多花来，比如如何暴露给开发者 cancelDebounce，又如上述 throttle 的两种方式各有哪些瑕疵，针对这些瑕疵，是否可以结合两种实现优化？感兴趣的读者请在评论区留言探讨，或者在文末彩蛋部分找到相关内容。

## 总结

- 性能优化，实在是一个极大的话题，需要我们在平时工作学习中不断积累。对于准备面试的朋友，在面试前，除了时刻注意代码习惯、掌握常见考点以外，还要整理、回顾、复盘平时的性能相关项目。
- 这一节课难以覆盖性能优化的方方面面，本课程的其他章节，还会有这个话题的相关渗透，如网络协议、缓存策略、数据结构和算法等，这些内容和性能息息相关。请大家持续关注学习，同时欢迎在评论区和其他小伙伴讨论以及向我提问。
- 课程代码仓库： [https://github.com/HOUCe/lucas-gitchat-courses](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2FHOUCe%2Flucas-gitchat-courses%253C%2Fa%253E)

## 彩蛋分享

### 节流和防抖相关

- [Debouncing and Throttling Explained Through Examples](https://links.jianshu.com/go?to=https%3A%2F%2Fcss-tricks.com%2Fdebouncing-throttling-explained-examples%2F)
- [谈谈 JS 中的函数节流](https://links.jianshu.com/go?to=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzAxODE2MjM1MA%3D%3D%26mid%3D2651551467%26idx%3D2%26sn%3D2ce4ce1ec06c32aa698451128985b870%26chksm%3D8025a12ab752283c66f1e529664fcc9fe272d5d500f8daedcc35e85f79baa69b62a208b2235a%26scene%3D0%23wechat_redirect)
- [JavaScript 函数节流和函数防抖之间的区别](https://links.jianshu.com/go?to=https%3A%2F%2Fjuejin.im%2Fentry%2F58a3911b570c35006cdc2d6a)
- [高性能滚动 scroll 及页面渲染优化](https://links.jianshu.com/go?to=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzAxODE2MjM1MA%3D%3D%26mid%3D2651552107%26idx%3D1%26sn%3D7ea1a6d4b3cf1c8a99b50f703e4c41f1%26chksm%3D8025aeaab75227bc3bae46270d175bd1444f4983c9472eb93de5fc9c19951416e239dcc4860f%26mpshare%3D1%26scene%3D1%26srcid%3D0419s6nwU8LrOAy4BP2TH3wO%26key%3D14e4edd6ca5f2a5d9d86be4c9f83873bba1ae3395ad7d51553704ab7d15851bb129ead9ae2751548d6e530fcdfb471b1b7fdc9d4576bac260e706ef288ada0c02f31962f40314318bb69347d0284f0c2%26ascene%3D0%26uin%3DNjI4NTQ2ODIx%26devicetype%3DiMac%2BMacBookPro12%252C1%2BOSX%2BOSX%2B10.10.4%2Bbuild%2814E46%29%26version%3D12020110%26nettype%3DWIFI%26fontScale%3D100%26pass_ticket%3DOxCcOonsw3hgntyvXy%252FSYPn%252Fw9jx2Hv%252FheV8seAGt987cQT%252FygphdRBJ0UyMTQvc)
- [从 lodash 源码学习节流与防抖](https://links.jianshu.com/go?to=https%3A%2F%2Fjuejin.im%2Fpost%2F5b043309f265da0ba77015e7)
- [理解并优化函数节流 Throttle](https://links.jianshu.com/go?to=https%3A%2F%2Fjuejin.im%2Fpost%2F5be24d76e51d451def13cca2)

### 浏览器引擎渲染性能相关

- [Inside look at modern web browser](https://links.jianshu.com/go?to=https%3A%2F%2Fdevelopers.google.com%2Fweb%2Fresources%2Fcontributors%2Fkosamari)
- [How Browsers Work: Behind the scenes of modern web browsers](https://links.jianshu.com/go?to=https%3A%2F%2Fwww.html5rocks.com%2Fen%2Ftutorials%2Finternals%2Fhowbrowserswork%2F)
- [How browsers work](https://links.jianshu.com/go?to=http%3A%2F%2Ftaligarsiel.com%2FProjects%2Fhowbrowserswork1.htm)
- [How browser rendering works — behind the scenes](https://links.jianshu.com/go?to=https%3A%2F%2Fblog.logrocket.com%2Fhow-browser-rendering-works-behind-the-scenes-6782b0e8fb10)
- [What Every Frontend Developer Should Know About Webpage Rendering](https://links.jianshu.com/go?to=http%3A%2F%2Ffrontendbabel.info%2Farticles%2Fwebpage-rendering-101%2F)
- [前端文摘：深入解析浏览器的幕后工作原理](https://links.jianshu.com/go?to=https%3A%2F%2Fwww.cnblogs.com%2Flhb25%2Fp%2Fhow-browsers-work.html)
- [从 Chrome 源码看浏览器如何加载资源](https://links.jianshu.com/go?to=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F30558018)
- [浏览器内核渲染：重建引擎](https://links.jianshu.com/go?to=https%3A%2F%2Fjuejin.im%2Fpost%2F5bbaa7da6fb9a05d3761aafe)
- [体现工匠精神的 Resource Hints](https://links.jianshu.com/go?to=https%3A%2F%2Fjuejin.im%2Fentry%2F5c26d05d5188257a937fb6b2)
- [浏览器页面渲染机制，你真的弄懂了吗](https://links.jianshu.com/go?to=https%3A%2F%2Fwww.itcodemonkey.com%2Farticle%2F10417.html)
- [前端不止：Web 性能优化 – 关键渲染路径以及优化策略](https://links.jianshu.com/go?to=https%3A%2F%2Finsights.thoughtworks.cn%2Fcritical-rendering-path-and-optimization-strategy%2F)
- [浏览器前端优化](https://links.jianshu.com/go?to=https%3A%2F%2Fzcfy.cc%2Farticle%2Foptimising-the-front-end-for-the-browser-hacker-noon-2847.html)
- [浅析前端页面渲染机制](https://links.jianshu.com/go?to=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2F1kQ-cyQmLfLcYiLiJ_ViwA%3F)
- [浅析渲染引擎与前端优化](https://links.jianshu.com/go?to=https%3A%2F%2Fjuejin.im%2Fentry%2F5893fbe88d6d8100582e8b7f)
- [渲染性能](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2Fsundway%2Fblog%2Fissues%2F2)
- [Repaint 、Reflow 的基本认识和优化 (2)](https://links.jianshu.com/go?to=https%3A%2F%2Fsegmentfault.com%2Fa%2F1190000002629708)

### 动画性能相关

- [Timing control for script-based animations](https://links.jianshu.com/go?to=https%3A%2F%2Fdocs.microsoft.com%2Fen-us%2Fprevious-versions%2Fwindows%2Finternet-explorer%2Fie-developer%2Fdev-guides%2Fhh920765%28v%3Dvs.85%29)
- [Gain Motion Superpowers with requestAnimationFrame](https://links.jianshu.com/go?to=https%3A%2F%2Fmedium.com%2F%40bdc%2Fgain-motion-superpowers-with-requestanimationframe-ecc6d5b0d9a4)
- [CSS Animation 性能优化](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2Famfe%2Farticle%2Fissues%2F47)
- [GSAP 的动画快于 jQuery 吗？为何？](https://links.jianshu.com/go?to=https%3A%2F%2Fsegmentfault.com%2Fa%2F1190000000391529)
- [Javascript 高性能动画与页面渲染](https://links.jianshu.com/go?to=https%3A%2F%2Fjuejin.im%2Fentry%2F58b0187c1b69e60058a09faf)
- [也许你不知道，JS animation 比 CSS 更快！](https://links.jianshu.com/go?to=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzA5NzkwNDk3MQ%3D%3D%26mid%3D2650585331%26idx%3D1%26sn%3Dc2d55ab4c5458d3dcda25188fd608079%26source%3D41%23wechat_redirect)
- [渐进式动画解决方案](https://links.jianshu.com/go?to=https%3A%2F%2Fwww.w3cplus.com%2Fanimation%2Fprogressive-web-animation.html)
- [你应该知道的 requestIdleCallback](https://links.jianshu.com/go?to=https%3A%2F%2Fjuejin.im%2Fpost%2F5ad71f39f265da239f07e862)
- [无线性能优化：Composite](https://links.jianshu.com/go?to=http%3A%2F%2Ftaobaofed.org%2Fblog%2F2016%2F04%2F25%2Fperformance-composite%2F)
- [优化动画卡顿：卡顿原因分析及优化方案](https://links.jianshu.com/go?to=https%3A%2F%2Fjuejin.im%2Fpost%2F5c8a1db15188257e9044ec52)
- [一篇文章说清浏览器解析和 CSS（GPU）动画优化](https://links.jianshu.com/go?to=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FkC7RmozaG5bWjIqdiZat7A%3F)

### 实战案例相关

- [Building the Google Photos Web UI](https://links.jianshu.com/go?to=https%3A%2F%2Fmedium.com%2Fgoogle-design%2Fgoogle-photos-45b714dfbed1)
- [A Netflix Web Performance Case Study](https://links.jianshu.com/go?to=https%3A%2F%2Fmedium.com%2Fdev-channel%2Fa-netflix-web-performance-case-study-c0bcde26a9d9)
- [The Cost Of JavaScript In 2018](https://links.jianshu.com/go?to=https%3A%2F%2Fmedium.com%2F%40addyosmani%2Fthe-cost-of-javascript-in-2018-7d8950fbb5d4)
- [How we reduced our initial JS/CSS size by 67%](https://links.jianshu.com/go?to=https%3A%2F%2Fdev.to%2Fgoenning%2Fhow-we-reduced-our-initial-jscss-size-by-67-3ac0%3Futm_source%3Dmybridge%26utm_medium%3Dblog%26utm_campaign%3Dread_more%3Fadd%3Dadd)
- [Front-End Performance Checklist 2019](https://links.jianshu.com/go?to=https%3A%2F%2Fwww.smashingmagazine.com%2F2019%2F01%2Ffront-end-performance-checklist-2019-pdf-pages%2F)
- [网站性能优化实战——从 12.67s 到 1.06s 的故事](https://links.jianshu.com/go?to=https%3A%2F%2Fimweb.io%2Ftopic%2F5b6fd3c13cb5a02f33c013bd)
- [前端黑科技：美团网页首帧优化实践](https://links.jianshu.com/go?to=https%3A%2F%2Fmp.weixin.qq.com%2Fs%3F__biz%3DMzUxMzcxMzE5Ng%3D%3D%26mid%3D2247489935%26idx%3D1%26sn%3Df59537133b8548caf5a513ee95ecc1be%26chksm%3Df951acccce2625da71bacdb5cd814bcdc8900c293c56662bbad6e39af40ebd451837d3866404%26token%3D1623409489%26lang%3Dzh_CN%26scene%3D21%23wechat_redirect)
- [Web 字体图标-自动化方案](https://links.jianshu.com/go?to=https%3A%2F%2Fjuejin.im%2Fpost%2F5c398a81e51d4551e13b88f3%3Fadd%3Dasd)
- [JS 加载慢？谷歌大神带你飞!](https://links.jianshu.com/go?to=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FuWuzwE1jPHbd73Y3UiyezA)
- [前端性能优化（三） 移动端浏览器前端优化策略](https://links.jianshu.com/go?to=https%3A%2F%2Fmy.oschina.net%2Fzhangstephen%2Fblog%2F1601383%3Ffrom%3Djuejin)
- [CSS @font-face 性能优化](https://links.jianshu.com/go?to=https%3A%2F%2Fjuejin.im%2Fpost%2F5c7e578de51d4541c11413fc)
- [移动 Web 性能优化从入门到进阶](https://links.jianshu.com/go?to=https%3A%2F%2Fjuejin.im%2Fpost%2F5c931c4a6fb9a070dc28923b)
- [记一次惊心动魄的前端性能优化之旅](https://links.jianshu.com/go?to=https%3A%2F%2Fsegmentfault.com%2Fa%2F1190000005147979)