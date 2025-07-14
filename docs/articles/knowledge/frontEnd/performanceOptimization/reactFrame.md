---
article: false
title: 以 React 为例，说说框架和性能
date: 2024-09-15
order: 3
---

- 在上一节课中，我们提到了性能优化。在这个话题上，除了工程化层面的优化和语言层面的优化以外，框架性能也备受瞩目。这一节课，我们就来聊聊框架的性能话题，并以 React 为例进行分析。
- 主要知识点如下：

## 框架性能到底指什么

- 说起框架的性能话题，很多读者可能会想到「不要过早地做优化」这条原则。实际上，大部分应用的复杂度并不会对性能和产品体验构成挑战。毕竟在之前课程中我们学习到，现代化的框架凭借高效的虚拟 DOM diff 算法和（或）响应式理念，以及框架内部引擎，已经做得较为完美了，一般项目需求对性能的压力并不大。
- 但是对于一些极其复杂的需求，性能优化是无法回避的。如果你开发的是图形处理应用、DNA 检测实验应用、富文本编辑器或者功能丰富的表单型应用，则很容易触碰到性能瓶颈。同样，作为框架的使用者，也需要对性能优化有所了解，这对于理解框架本身也是有很大帮助的。
- 前端开发自然离不开浏览器，而性能优化大都在和浏览器打交道。我们知道，页面每一帧的变化都是由浏览器绘制出来的，并且这个绘制频率受限于显示器的刷新频率，因此一个重要的性能数据指标是每秒 60 帧的绘制频率。这样进行简单的换算之后，每一帧只有 16.6ms 的绘制时间。
- 如果一个应用对用户的交互响应处理过慢，则需要花费很长的时间来计算更新数据，这就造成了应用缓慢、性能低下的问题，被用户感知造成极差的用户体验。对于框架来说，以 React 为例，开发者不需要额外关注 DOM 层面的操作。因为 React 通过维护虚拟 DOM 及其高效的 diff 算法，可以决策出每次更新的最小化 DOM batch 操作。但实际上，使用 React 能完成的性能优化，使用纯原生的 JavaScript 都能做到，甚至做得更好。只不过经过 React 统一处理后，大大节省了开发成本，同时也降低了应用性能对开发者优化技能的依赖。
- 因此现代框架的性能表现，除了想办法缩减自身的 bundle size 之外，主要优化点就在于框架本身运行时对 DOM 层操作的合理性以及自身引擎计算的高效性。这一点我们会通过两节课程来慢慢展开。

## React 的虚拟 DOM diff

- React 主要通过以下几种方式来保证虚拟的 DOM diff 算法和更新的高效性能：
  - 高效的 diff 算法
  - Batch 操作
  - 摒弃脏检测更新方式
- 当任何一个组件使用 setState 方法时，React 都会认为该组件变「脏」，触发组件本身的重新渲染（re-render）。同时因其始终维护两套虚拟的 DOM，其中一套是更新后的虚拟的 DOM；另一套是前一个状态的虚拟的 DOM。通过对这两套虚拟的 DOM 的 diff 算法，找到需要变化的最小单元集，然后把这个最小单元集应用在真实的 DOM 当中。
- 而通过 diff 算法找到这个最小单元集后，React 采用启发式的思路进行了一些假设，将两棵 DOM 树之间的 diff 成本由 O(n3) 缩减到 O(n)。
- 说到这里，你一定很想知道 React 的那些大胆假设吧：
  - DOM 节点跨层级移动忽略不计
  - 拥有相同类的两个组件生成相似的树形结构，拥有不同类的两个组件生成不同的树形结构
- 根据这些假设，ReactJS 采取的策略如下：
- React 对组件树进行分层比较，两棵树只会对同一层级的节点进行比较
- 当对同一层级节点进行比较时，对于不同的组件类型，直接将整个组件替换为新类型组件
- 对于下图所示的组件结构，我们可以想象：如果子组件 B 和 H 的类型同时发生变化，当遍历到 B 组件时，直接进行新组件的替换，减少了不必要的消耗。
  - 当对同一层级节点进行比较时，对于相同的组件类型，如果组件的 state 或 props 发生变化，则直接重新渲染组件本身。开发者可以尝试使用 - - - -----
  - shouldComponentUpdate 生命周期函数来规避不必要的渲染。  
    当对同一层级节点进行比较时，开发者可以使用 key 属性来「声明」同一层级节点的更新方式。
- 另外，setState 方法引发了「蝴蝶效应」，并通过创新的 diff 算法找到需要更新的最小单元集，但是这些变更也并不一定立即同步产生。实际上，React 会进行 setState 的 batch 操作，通俗地讲就是「积攒归并」一批变化后，再统一进行更新。显然这是出于对性能的考虑。

## 提升 React 应用性能的建议

- 我们知道，React 渲染真实的 DOM 节点的过程由两个主要过程组成：
  - 对 React 内部维护的虚拟的 DOM 进行更新
  - 前后两个虚拟 DOM 比对，并将 diff 所得结果应用于真实的 DOM 中的过程
- 这两步极其关键，设想一下，如果虚拟的 DOM 更新很慢，那么重新渲染势必会很耗时。本节我们就针对此问题，对症下药，来了解更多的性能优化小技巧。

### 最大限度地减少 re-render

- 为了提升 React 应用性能，我们首先想到的就是最大限度地规避不必要的 re-render。但是当状态发生变化时，重新渲染是 React 内部的默认行为，我们如何保证不必要的渲染呢？
- 最先想到的一定是使用 shouldComponentUpdate 生命周期函数，它旨在对比前后状态 state/props 是否出现了变更，根据是否变更来决定组件是否需要重新渲染。
- 实际上，还有很多方式，开发者都可以给 React 发送「不需要渲染」的信号。
- 比如，无状态组件返回同一个 element 实例：如果 render 方法返回同一个 element 实例，React 会认为组件并没有发生变化。请参考以下代码：

```javascript
class MyComponent extends Component {
  text = ''
  renderedElement = null
  _render() {
    return <div>{this.props.text}</div>
  }
  render() {
    if (!this.renderedElement || this.props.text !== this.text) {
      this.text = this.props.text
      this.renderedElement = _render()
    }
    return this.renderedElement
  }
}
```

- 熟悉 lodash 库的读者，可能会想到其带来的 memoize 函数，同样可以用来简化上述代码：

```jsx
import memoize from 'lodash/memoize'

class MyComponent extends Component {
  _render = memoize(text => <div>{text}</div>)
  render() {
    return _render(this.props.text)
  }
}
```

- 在之前介绍的高阶组件的基础上，我们不妨设想这样一类高阶组件：它能够细粒度地控制组件的渲染行为。比如，某个组件仅仅在某一项 props 变化时才会触发 re-render。这样一来，开发者可以完全掌控组件渲染时机，更有针对性地进行渲染优化。
- 这样的方法有点类似于农业灌溉上的「滴灌」技术，它规避了代价昂贵的粗暴型灌溉，而是精准地定位需求，从而达到节约水资源的目的。
- 在社区中，优秀的 recompose 库恰好可以满足我们的需求。请参考如下代码：

```dart
@onlyUpdateForKeys(['prop1', 'prop2'])
class MyComponent2 extends Component {
 render() {
     //...
 }
}
```

- 使用 @onlyUpdateForKeys 修饰器，MyComponent2 组件只在 prop1 和 prop2 变化时才进行渲染；否则其他的 props 发生任何改变，都不会触发 re-render。
- 藏在 onlyUpdateForKeys 背后的「黑魔法」其实并不难理解，只需要在高阶组件中调用 shouldComponentUpdate 方法，在 shouldComponentUpdate 方法中比较对象由完整的 props 转为传入的指定 props 即可。有兴趣的读者，可以翻阅 recompose 源码进行了解，其实思路即是如此。

### 规避 inline function 反模式

- 我们需要注意一个「反模式」。当使用 render 方法时，要留意 render 方法内创建的函数或者数组等，这些创建可能是显式地，也可能是隐式生成。因为这些新生成的函数或数组，在量大时会造成一定的性能负担。同时 render 方法经常被反复执行多次，也就是说总有新的函数或数组被创建，这样造成内存无意义开销。往往性能更友好的做法只需要它们创建一次即可，而不是每次渲染都被创建。比如：

```javascript
render() {
  return <Myinput onchange={this.props.update.bind(this)}/>
}
```

- 或者：

```javascript
render() {
  return <Myinput onchange={()=>{this.props.update.bind(this)}}/>
}
```

- 对于 render 方法内产生数组或其他类型的情况，也存在类似问题：

```javascript
render() {
  return <Subcomponent items={this.props.items ||  []} / >
}
```

- 这样做会在每次渲染且 this.props.items 不存在时创建一个空数组。更好的做法是：

```javascript
const EMPTY_ARRAY = []
render() {
  return <Subcomponent items={this.props.items || EMPTY_ARRAY}/>
}
```

- 事实上，不得不说，这些性能副作用或者优化手段都「微乎其微」，并不是性能恶化的「罪魁祸首」。但是理解这些内容对我们编写出高质量的代码还是有帮助的。我们后续课程会针对这种情况进行框架层面上的启发式探索。

### 使用 PureComponent 保证开发性能

- PureComponent 大体与 Component 相同，唯一不同的地方是 PureComponent 会自动帮助开发者使用 shouldComponentUpdate 生命周期方法。也就是说，当组件 state 或者 props 发生变化时，正常的 Component 都会自动进行 re-render，在这种情况下，shouldComponentUpdate 默认都会返回 true。但是 PureComponent 会先进行对比，即比较前后两次 state 和 props 是否相等。需要注意的是，这种对比是浅比较：

```jsx
function shallowEqual (objA: mixed, objB: mixed) {
   if (is(objA, objB)) {
       return true;
   }

   if (typeof objA !== 'object' || objA === null ||
       typeof objB !== 'object' || objB === null) {
       return false;
   }

   const keysA = Object.keys(objA);
   const keysB = Object.keys(objB);

   if (keysA.length !== keysB.length) {
       return false;
   }

   for (let i = 0; i < keysA.length; i++) {
       if (
       !hasOwnProperty.call(objB, keysA[i]) ||
       !is(objA[keysA[i]], objB[keysA[i]])
       ) {
           return false;
       }
   }

   return true;
}
```

- 基于以上代码，我们总结出使用 PureComponent 需要注意如下细节：
  - 既然是浅比较，也就是说，当与前一状态下的 props 和 state 比对时，如果比较对象是 JavaScript 基本类型，则会对其值是否相等进行判断；如果比较对象是 JavaScript 引用类型，比如 object 或者 array，则会判断其引用是否相同，而不会进行值比较；
  - 开发者需要避免共享（mutate）带来的问题。
- 如果在一个父组件中对 object 进行了 mutate 的操作，若子组件依赖此数据，且采用 PureComponent 声明，那么子组件将无法进行更新。尽管 props 中的某一项值发生了变化，但是它的引用并没有发生变化，因此 PureComponent 的 shouldComponentUpdate 也就返回了 false。更好的做法是在更新 props 或 state 时，返回一个新的对象或数组。

### 分析一个真实案例

- 设想一下，如果应用组件非常复杂，含有一个具有很长 list 的组件，如果只是其中一个子组件发生了变化，那么使用 PureComponent 进行对比，有选择性地进行渲染，一定是比所有列表项目都重新渲染划算很多。
- 我们来看一个案例：简易实现一个采用 PureComponent 和不采用 PureComponent 的性能差别对比试验。假如在页面中需要渲染非常多的用户信息，所有的用户信息都被维护在一个 users 数组当中，数组的每一项为一个 JavaScript 对象，表示一个用户的基本信息。User 组件负责渲染每一个用户的信息内容：

```jsx
import User from './User'
const Users = ({ users }) => {
  return (
    <div>
      {users.map(item => (
        <User {...item} />
      ))}
    </div>
  )
}
```

- 这样做存在的问题是：users 数组作为 Users 组件的 props 出现，users 数组的第 K 项发生变化时，users 数组即发生变化，Users 组件重新渲染导致所有的 User 组件都会进行渲染。某个 User 组件，即使非 K 项并没有发生变化，这个 User 组件不需要重新渲染，但也不得不必要的渲染。
- 在测试中，我们渲染了一个有 200 项的数组：

```jsx
const arraySize = 200
const getUsers = () =>
  Array(arraySize)
    .fill(1)
    .map((_, index) => ({
      name: 'John Doe',
      hobby: 'Painting',
      age: index === 0 ? Math.random() * 100 : 50
    }))
```

- 注意：在 getUsers 方法中，对 age 属性进行了判断，保证每次调用时，getUsers 返回的数组只有第一项的 age 属性不同，其余的全部为 50。在测试组件中，在 componentDidUpdate 中保证数组将会触发 400 次 re-render，并且每一次只改变数组第一项的 age 属性，其他的均保持不变。

```javascript
const repeats = 400;
 componentDidUpdate() {
   ++this.renderCount;
   this.dt += performance.now() - this.startTime;
   if (this.renderCount % repeats === 0) {
     if (this.componentUnderTestIndex > -1) {
       this.dts[componentsToTest[this.componentUnderTestIndex]] = this.dt;
       console.log(
         'dt',
         componentsToTest[this.componentUnderTestIndex],
         this.dt
       );
     }
     ++this.componentUnderTestIndex;
     this.dt = 0;
     this.componentUnderTest = componentsToTest[this.componentUnderTestIndex];
   }
   if (this.componentUnderTest) {
     setTimeout(() => {
       this.startTime = performance.now();
       this.setState({ users: getUsers() });
     }, 0);
   }
   else {
     alert(`
       Render Performance ArraySize: ${arraySize} Repeats: ${repeats}
       Functional: ${Math.round(this.dts.Functional)} ms
       PureComponent: ${Math.round(this.dts.PureComponent)} ms
       Component: ${Math.round(this.dts.Component)} ms
     `);
   }
 }
```

- 下面对三种组件声明方式进行对比。
  - 函数式方式

```jsx
export const Functional = ({ name, age, hobby }) => (
  <div>
    <span>{name}</span>
    <span>{age}</span>
    <span>{hobby}</span>
  </div>
)
```

- PureComponent 方式

```jsx
export class PureComponent extends React.PureComponent {
  render() {
    const { name, age, hobby } = this.props
    return (
      <div>
        <span>{name}</span>
        <span>{age}</span>
        <span>{hobby}</span>
      </div>
    )
  }
}
```

- 经典 class 方式

```jsx
export class Component extends React.Component {
  render() {
    const { name, age, hobby } = this.props
    return (
      <div>
        <span> {name}</span>
        <span> {age}</span>
        <span> {hobby}</span>
      </div>
    )
  }
}
```

- 在使用 PureComponent 声明的组件中，会自动在触发渲染前后进行 {name, age, hobby} 对象值比较。如果没有发生变化，则 shouldComponentUpdate 返回 false，以规避不必要的渲染。因此，使用 PureComponent 声明的组件性能明显优于其他方式。在不同的浏览器环境下，可以得出：
  - 在 Firefox 下，PureComponent 收益 30%
  - 在 Safari 下，PureComponent 收益 6%
  - 在 Chrome 下，PureComponent 收益 15%
- 实际上，我们通过定义 changedItems 来表示变化数组的项目，array 表示所需渲染的数组。changedItems.length/array.length 的比值越小，表示数组中变化的元素也越少，React.PureComponent 涉及的性能优化也越有必要实施，因为 React.PureComponent 通过浅比较规避了不必要的更新过程，而浅比较自身的计算成本一般都不值一提，可以节约成本。
- 当然，PureComponent 也不是万能的，尤其是它的浅比较，需要开发者格外注意。因此在特定情况下，开发者根据需求自己实现 shouldComponentUpdate 中的比较逻辑，将是更高效的选择。

## 总结

- 性能优化是前端开发中一个永恒的话题，不同框架之间的性能对比也一直是各位开发者关注的方面。性能涉及方方面面，如前端工程化、浏览器解析和渲染、比较算法等。本章主要介绍了 React 框架在性能上的优劣、虚拟的 DOM 思想，以及在开发 React 应用时需要注意的性能优化环节和手段。 也许不是每个应用都会面临性能的问题，如同社区中所说的：「过早地进行性能优化是毫无必要的，但是开发者在性能优化方面的积累却要时刻先行。」同时，优化手段也在与时俱进，不断更新，需要开发者时刻保持学习。

- 在上一讲中，我们提到了框架性能优化的一些基本概念，并分析了以 React 框架为代表的常用优化手段。但是这些内容还不够，需要了解更多框架设计底层的性能相关话题。这一讲，我将会以 Vue（未来新版本 3.0）和 React 为主，分析这两个框架在设计层面，而非使用层面的性能考量。
- 相关知识点如下图所示：

## React 性能设计亮点

- React 设计上的性能亮点非常多，除了「老生常谈」的虚拟 DOM 之外，还有很多不为人知的细节，比如事件机制（合成和池化）、React fiber 设计。

### React 性能设计亮点之事件

- React 事件机制我们前面已经有所介绍，总结一下性能亮点的体现有：
- 将所有事件挂载到 document 节点上，利用事件代理实现优化；  
  采用合成事件，在原生事件的基础上包装合成事件，并结合池化思路实现内存保护。  
  前面课程《第 4-2 课：你真的懂 React 吗？》已经介绍过相关内容，这里不再展开。

### React 性能设计亮点之 setState

- setState 这个谜之 API 我们也有所介绍，其异步（或者叫做 batch 合并）设计也是出于性能的考虑。这种优化思路已经被很多框架所借鉴，Vue 当中也是有类似的设计。

### React 性能设计亮点之 React fiber

- 前面两个「亮点」我们在以往的课程中已经有所涉及，这里来重点说一下 React fiber。
- 通过课程《第 2-1 和 2-2 课：异步不可怕「死记硬背」+ 实战拿下》，我们知道在浏览器主线程中，JavaScript 代码在调用栈 call stack 执行时，可能会调用浏览器的 APIs，对 DOM 进行操作；也可能执行一些异步任务：这些异步任务如果是以回调的方式处理，那么往往会被添加到 event queue 当中；如果是以 promise 处理，就会先放到 job queue 当中。这个涉及到宏任务和微任务，这些异步任务和渲染任务将会在下一个时序当中由调用栈处理执行。
- 理解了这些，大家就会明白：如果调用栈 call stack 运行一个很耗时的脚本，比如解析一个图片，call stack 就会像北京上下班高峰期的环路入口一样，被这个复杂任务堵塞。主线程其他任务都要排队，进而阻塞 UI 响应。这时候用户点击、输入、页面动画等都没有了响应。
- 这样的性能瓶颈，就如同阿喀琉斯之踵一样，在一定程度上限制着 JavaScript 的发挥。
- 我们一般有两种方案突破上文提到的瓶颈，其中之一就是将耗时高、成本高、易阻塞的长任务切片，分成子任务，并异步执行。
- 这样一来，这些子任务会在不同的 call stack tick 周期执行，进而主线程就可以在子任务间隙当中执行 UI 更新操作。设想一个常见的场景：如果我们需要渲染一个由十万条数据组成的列表，那么相比一次性渲染全部数据，我们可以将数据分段，使用 setTimeout API 去分步处理，构建渲染列表的工作就被分成了不同的子任务在浏览器中执行。在这些子任务间隙，浏览器得以处理 UI 更新。
- React 在 JavaScript 执行层面花费的时间较多，这是因为下面一系列复杂过程所造成的：
- Virtual DOM 构建 → 计算 DOM diff → 生成 render patch
- 也就是说，在一定程度上：React 著名的调度策略 -- stack reconcile 是 React 的性能瓶颈。因为 React stack reconcile 过程会深度优先遍历所有的 Virtual DOM 节点，进行 diff。整棵 Virtual DOM 树计算完成之后，将任务出栈释放主线程。因此，浏览器主线程被 React 更新状态任务占据的时候，用户与浏览器进行任何交互都不能得到反馈，只有等到任务结束，才能得到浏览器的响应。
- 我们来看一个典型的场景，来自文章：[React 的新引擎—React Fiber 是什么？](https://links.jianshu.com/go?to=https%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttp%253A%2F%2Fwww.infoq.com%2Fcn%2Farticles%2Fwhat-the-new-engine-of-react)
- 这个例子会在页面中创建一个输入框、一个按钮、一个 BlockList 组件。BlockList 组件会根据 NUMBER_OF_BLOCK 数值渲染出对应数量的数字显示框，数字显示框显示点击按钮的次数。
- 在这个例子中，我们可以设置 NUMBER_OF_BLOCK 的值为 100000，表示渲染 100000 个矩形框。这时候点击按钮，触发 setState，页面开始更新。此时点击输入框，输入一些字符串，比如 「hi，react」，可以看到：页面没有任何响应；等待 7s 之后，输入框中突然出现了之前输入的 「hireact」。同时，BlockList 组件也更新了。
- 显而易见，这样的用户体验并不好。
- 浏览器主线程在这 7s 的 performance 如下图所示：
  - 黄色部分：是 JavaScript 执行时间，也是 React 占用主线程的时间。
  - 紫色部分：是浏览器重新计算 DOM Tree 的时间。
  - 绿色部分：是浏览器绘制页面的时间。
- 这三种任务，总共占用浏览器主线程 7s 的时间，此时间内浏览器无法与用户交互。主要是黄色部分执行时间较长，占用了 6s，即 React 较长时间占用主线程，导致主线程无法响应用户输入。这就是一个典型的例子。
- React 核心团队很早之前就预知性能风险的存在，并且持续探索可解决的方式。基于浏览器对 requestIdleCallback 和 requestAnimationFrame 这两个 API 的支持，React 团队实现新的调度策略 —— Fiber reconcile。
- 在应用 React Fiber 的场景下，重复刚才的例子，不会再出现页面卡顿，交互自然而顺畅。
- 浏览器主线程的 performance 如下图所示：
- 可以看到：在黄色 JavaScript 执行过程中，也就是 React 占用浏览器主线程期间，浏览器也在重新计算 DOM Tree，并且进行重绘。直观来看，黄色和紫色等互相交替，同时页面截图显示，用户输入得以及时响应。简单说，在 React 占用浏览器主线程期间，浏览器也在与用户交互。这显然是「更好的性能」表现。

## 从 Vue 3.0 动静结合的 Dom diff 谈起

- Vue3.0 提出的动静结合的 DOM diff 思想，我个人认为是 Vue 近几年在「创新」上的一个很好体现。之所以能够做到动静结合的 DOM diff，或者把这个问题放得更大：之所以能够做到预编译优化，是因为 Vue core 可以静态分析 template，在解析模版时，整个 parse 的过程是利用正则表达式顺序解析模板，当解析到开始标签、闭合标签和文本的时候都会分别执行对应的回调函数，来达到构造 AST 树的目的。
- 这个过程换成代码如下：
- 借助预编译过程，Vue 可以做到的预编译优化就很强大了。比如在预编译时标记出模版中可能变化的组件节点，再次进行渲染前 diff 时就可以跳过「永远不会变化的节点」，而只需要对比「可能会变化的动态节点」。这也就是动静结合的 DOM diff 将 diff 成本与模版大小正相关优化到与动态节点正相关的理论依据。
- 类似地，我们也可以标记出来一些「快速通道（fast path）」。比如某个复杂的组件之所以 className 发生变化（这个场景很常见，我们根据变量，通过更改 className 来应用不同的样式）。针对这种场景，我们在预编译阶段进行特定的标记，在重新渲染 diff 时只需要更新新的 className 即可。

### 预编译优化的本质是什么？

- 我关心的是：React 能否像 Vue 那样进行预编译优化？
- Vue 需要做数据双向绑定，需要进行数据拦截或代理，那它就需要在预编译阶段静态分析模版，分析出视图依赖了哪些数据，进行响应式处理。而 React 就是局部重新渲染，React 拿到的或者说掌管的，所负责的就是一堆递归 React.createElement 的执行调用，它无法从模版层面进行静态分析。
- 比如这样的 JSX：

```html
<div>
  <p>
    <span> This is a test </span>
  </p>
</div>
```

- 将会被编译为：

```javascript
React.createElement('div', null, React.createElement('p', null, React.createElement('span', null, 'This is a test')))
```

- 因此 React JSX 过度的灵活性导致运行时可以用于优化的信息不足。但是，在 React 框架之外，我们作为开发者还是可以通过工程化手段达到类似的目的，因为我们能够接触到 JSX 编译成 React.createElement 的整个过程。开发者在项目中开发 babel 插件，实现 JSX 编译成 React.createElement，那么优化手段就是是从编写 babel 插件开始：
- 如图：
- 那么到底开发者应该怎么做，实现预编译优化呢？
- 为此我挑出了一些具有代表性的案例，这些案例都是由开发者开发 Babel plugin 实现的 React 预编译手段。

### Hoist constant elements

- 将静态不变的节点在预编译阶段就抽象成函数或者静态变量，这个和 Vue 框架内所做的一样，不过需要开发者实现，这样一来就不需要在每次重新渲染时生成多余实例，只需要调用 \_ref 变量即可。

```jsx
const _ref = <span>Hello World</span>
class MyComponent extends React.Component {
  render() {
    return <div className={this.props.className}>{_ref}</div>
  }
}
```

### remove propTypes in runtime

- PropTypes 提供了许多验证工具，用来帮助确定 React 组件中 props 数据的有效性。但是，React v15.5 后就被移除了 PropTypes ，因此现在使用 prop-types 库代替。
- propTypes 对于业务开发非常有用，帮助我们弥补了 JS 数据类型检查的不足。但是在线上代码中，propTypes 是多余的。
- 因此在运行时代码删除 propTypes 就变的比较有必要了。

### remove inline functions and varaibles

- 第三个优化场景是这样的：我们知道组件内如果存在函数生成（箭头函数定义，bind 使用）或者闭包变量的情况下，组件每一次刷新，都会生成一个新的函数或者闭包变量。我们将这种不必要的函数称为 inline functions。
- 比如下面这段代码中，transformeData 和 onClick 对应的匿名函数，都会随着组件渲染重新生成一个全新的引用。

```jsx
export default ({ data, sortComparator, filterPredicate, history }) => {
  const transformedData = data.filter(filterPredicate).sort(sortComparator)
  return (
    <div>
      <button className="back-btn" onClick={() => history.pop()} />

      <ul classname="data-list">
        {transformedData.map(({ id, value }) => (
          <Item value={value} />
        ))}
      </ul>
    </div>
  )
}
```

- 反复生成这些 inline functions 或者数据，这对于 React 运行时性能或多或少会有一点影响，也带来了 GC 压力。
- 我们在工程中，可以通过插件对 inline functions 或者变量进行内存持久化处理。最终经过预编译优化后的代码为：

```jsx
let _anonymousFnComponent

export default ({ data, sortComparator, filterPredicate, history }) => {
  const transformedData = React.useMemo(
    () => data.filter(filterPredicate).sort(sortComparator),
    [data, data.filter, filterPredicate, sortComparator]
  )

  return React.createElement(
    (_anonymousFnComponent =
      _anonymousFnComponent ||
      (() => {
        const _onClick2 = React.useCallback(() => history.pop(), [history, history.pop])

        return (
          <div>
            <button classname="back-btn" onclick={_onClick2} />
            <ul className="data-list">
              {transformedData.map(({ id, value }) =>
                React
                  .createElement
                  //...
                  ()
              )}
            </ul>
          </div>
        )
      })),
    null
  )
}
```

- 我们使用了 React 新特性 useMemo 和 useCallback 将这些变量包裹。 useMemo 和 useCallback 都会在组件第一次渲染的时候执行，之后会在其依赖的变量，也就是 useMemo 和 useCallback 的第二个参数数组，数组内的数值发生改变时再次执行；这两个 hooks 都返回缓存的值，useMemo 返回缓存的变量，useCallback 返回缓存的函数。
- 我们看代码，transformeData 在其数据源：data,data.filter,filterPredicate,sortComparator 发生变化时才会更新，才会重新生成一份 transformeData，函数渲染时只要依赖的 data,data.filter,filterPredicate,sortComparator 不变，不会重新生成 transformeData，而是使用缓存的值。onClick 也使用了 useCallback 将函数引用持久化保存，道理一样。
- 这样一来就避免了在组件重新渲染时，总是生成不必要的 inline functions 和闭包变量的困扰。
- transform to stateless function component  
  我们知道函数式组件虽然未来会比 class 声明的组件性能更好，并且函数不管是从性能上、可组合性上还是 TS 契合度上，都要要优于 class 使用。
- 这个例子，我们将符合条件的 class 声明组件自动在预编译阶段转化为函数式组件。
- 我们的目标是：

```jsx
class MyComponent extends React.Component {
  static propTypes = {
    className: React.PropTypes.string.isRequired
  }

  render() {
    return (
      <div classname={this.props.className}>
        <span>Hello World</span>
      </div>
    )
  }
}
```

- 在预编译阶段优化为：

```jsx
const MyComponent = props => (
  <div classname={this.props.className}>
    <span>Hello World</span>
  </div>
)

MyComponent.propTypes = {
  className: React.PropTypes.string.isRequired
}
```

- 在这里我们展开实现一下 Babel plugin 的编写，其中会涉及到一些 AST 的内容，读者只需明白思想方向即可。

```jsx
module.exports = function ({ types: t }) {
  return {
    visitor: {
      Class(path) {
        const state = {
          renderMethod: null,
          properties: [],
          thisProps: [],
          isPure: true
        }

        path.traverse(bodyVisitor, state)

        let replacement = []

        state.thisProps.forEach(function (thisProp) {
          thisProp.replaceWith(t.identifier('props'))
          thisProp.replaceWith(t.identifier('props'))
        })

        replacement.push(t.functionDeclaration(id, [t.identifier('props')], state.renderMethod.node.body))

        state.properties.forEach(prop => {
          replacement.push(
            t.expressionStatement(t.assignmentExpression('=', t.MemberExpression(id, prop.node.key), prop.node.value))
          )
        })

        if (t.isExpression(path.node)) {
          replacement.push(t.returnStatement(id))

          replacement = t.callExpression(t.functionExpression(null, [], t.blockStatement(replacement)), [])
        }

        path.replaceWithMultiple(replacement)
      }
    }
  }

  const bodyVisitor = {
    ClassMethod(path) {
      if (path.node.key.name === 'render') {
        this.renderMethod = path
      } else {
        this.isPure = false
        path.stop()
      }
    },

    ClassProperty(path) {
      const name = path.node.key.name

      if (path.node.static && (name === 'propTypes' || name === 'defaultProps')) {
        this.properties.push(path)
      } else {
        this.isPure = false
        this.isPure = false
      }
    },

    MemberExpression(path) {
      this.thisProps.push(path)
    },

    JSXIdentifier(path) {
      if (path.node.name === 'ref') {
        this.isPure = false
        path.stop()
      }
    }
  }
}
```

- 代码分析：我们先明确，什么样的 class 组件，具备转换成函数式组件的条件？
- 首先，class 组件不能具有 this.state 的引用，组件不能出现任何生命周期方法，也不能出现 createRef，因为这些特性在函数式组件中并不存在。
- 满足这样的条件时，我们在进行 JSX 转换过程进行组件替换：通过 AST 进行遍历， 首先在遍历过程中找到符合条件的 class 组件，是否符合条件我们用 isPure 来进行标记， 同时在遍历时，对每一个符合条件的 class 组件，储存 render 方法，作为转换函数式组件的返回值；储存 propTypes 和 defaultProps 静态属性，之后会挂载在函数组件函数属性上；同时对 this.props 的用法转为 props, props 作为函数式组件的参数出现 最后在按照上述规则，修改 AST 树，新的 AST 树相关组件节点会生成函数式组件。

### Prepack 对于框架的影响

- Prepack 同样是 FaceBook 团队的作品。它让你编写普通的 JavaScript 代码，它在构建阶段就试图了解代码将做什么，然后生成等价的代码，减少了运行时的计算量。
- 我们看一个 fibonacci 数列求和的例子，再经过 prepack 处理之后，直接输出结果，运行时就是一个 610 这么一个结果。这么看 prepack 是一个 JavaScript 的部分求值器（Partial Evaluator），可在编译时执行原本在运行时的计算过程，并通过重写 JavaScript 代码来提高其执行效率。
- 我就用 Prepack 结合 React 尝了个鲜：
- 上图左边部分是我编写的代码，在不使用 prepack 情况下，运行时代码如右边所示：经过编译之后右边的代码仍然是对数组 list 进行 map，逐条渲染出数组内容。
- 经过 preack 优化后，运行时代码已经非常轻量了。运行时就减少 map 的计算等，直接用生成的组件内容作为运行时结果。
