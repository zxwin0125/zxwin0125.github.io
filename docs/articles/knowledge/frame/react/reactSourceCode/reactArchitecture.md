---
title: React 16 架构与 Fiber 数据结构
order: 3
---

## React 架构

> React 16 版本中使用了 Fiber Reconciler 替代了 Stack Reconciler
> 在 Fiber Reconciler 中又分为三层：调度层、协调层、渲染层

- Scheduler (调度层)：调度任务的优先级，高优任务优先进入协调层
- Reconciler (协调层)：构建 Fiber 数据结构，比对 Fiber 对象找出差异, 记录 Fiber 对象要进行的 DOM 操作
- Renderer (渲染层)：负责将发生变化的部分渲染到页面上

### Scheduler 调度层

> [!info]
> React 15 的版本中，没有调度层
>
> - 采用了循环加递归的方式进行了 VirtualDOM 的比对
> - 由于递归使用 JavaScript 自身的执行栈，一旦开始就无法停止，直到任务执行完成
> - 如果 VirtualDOM 树的层级比较深，VirtualDOM 的比对就会长期占用 JavaScript 主线程
> - 由于 JavaScript 又是单线程的无法同时执行其他任务，所以在比对的过程中无法响应用户操作，无法即时执行元素动画，造成了页面卡顿的现象

- 为了解决这个问题，React 16 版本加入了调度层
- 所有的任务并不是直接去执行，而是要先加入到任务队列中，等到浏览器有空闲时间了才去执行

> [!info]
> React 16 的版本
>
> - 放弃了 JavaScript 递归的方式进行 VirtualDOM 的比对，而是采用循环模拟递归
> - 而且比对的过程是利用浏览器的空闲时间完成的，不会长期占用主线程，这就解决了 VirtualDOM 比对造成页面卡顿的问题

> [!warning]
> window 对象中提供了 requestIdleCallback API，它可以利用浏览器的空闲时间执行任务，但是它自身也存在一些问题，比如说并不是所有的浏览器都支持它，而且它的触发频率也不是很稳定，所以 React 最终放弃了 requestIdleCallback 的使用

- 在 React 中，官方实现了自己的任务调度库，这个库就叫做 Scheduler
- 它也可以实现在浏览器空闲时执行任务，而且还可以设置任务的优先级，高优先级任务先执行，低优先级任务后执行
- Scheduler 存储在 `packages/scheduler` 文件夹中

### Reconciler 协调层

> [!important]
> 在 React 15 的版本中，协调层和渲染层交替执行，即找到了差异就直接更新差异<br>
> 在 React 16 的版本中，协调层和渲染层不再交替执行
>
> - 协调层负责构建 Fiber 节点，并找出差异，在所有差异找出之后，统一交给渲染层进行 DOM 的更新
> - 协调层的主要任务就是找出差异部分，并为差异打上标记

### Renderer 渲染层

- 渲染层根据协调层为 Fiber 节点打的标记，同步执行对应的 DOM 操作

> [!warning]
> 比对的过程从递归变成了可以中断的循环，那么 React 是如何解决中断更新时 DOM 渲染不完全的问题呢？
>
> - 根本就不存在这个问题，因为在整个过程中，调度层和协调层的工作是在内存中完成的，是可以被打断的，渲染层的工作被设定成不可以被打断，所以不存在 DOM 渲染不完全的问题

## Fiber 数据结构

- Fiber 其实就是 JavaScript 对象，它是从 VirtualDOM 对象演变而来的
- Fiber 对象中的几个主要属性，大致分为四类：
  - DOM 实例相关
  - 构建 Fiber 树相关
  - 组件状态数据相关
  - 副作用相关：可以触发 DOM 操作的属性

### DOM 实例相关

```js
type Fiber = {
  /************************  DOM 实例相关  *****************************/

  // 标记不同的组件类型, 值详见 WorkTag
  tag: WorkTag,

  // 组件类型 div、span、组件构造函数
  type: any,

  // 实例对象, 如类组件的实例、原生 dom 实例, 而 function 组件没有实例, 因此该属性是空
  stateNode: any
}
```

#### 1. tag 属性

- tag 属性用来区分组件类型，当前 Fiber 节点表示的是函数组件还是类组件，还是普通的 React 元素，或者其他的组件类型呢
- tag 属性值可以查看 WorkTag，文件位置：packages/shared/ReactWorkTags.js

```js
type WorkTag =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22;

export const FunctionComponent = 0;
export const ClassComponent = 1;
export const IndeterminateComponent = 2;
export const HostRoot = 3;
export const HostPortal = 4;
export const HostComponent = 5;
export const HostText = 6;
export const Fragment = 7;
export const Mode = 8;
export const ContextConsumer = 9;
export const ContextProvider = 10;
export const ForwardRef = 11;
export const Profiler = 12;
export const SuspenseComponent = 13;
export const MemoComponent = 14;
export const SimpleMemoComponent = 15;
export const LazyComponent = 16;
export const IncompleteClassComponent = 17;
export const DehydratedFragment = 18;
export const SuspenseListComponent = 19;
export const FundamentalComponent = 20;
export const ScopeComponent = 21;
export const Block = 22;
```

- 实际上 tag 属性值就是 0～22 之间的数值，不同的数值表示不同的组件类型，比如
  - 0 代表的是函数组件
  - 1 代表类组件，
  - 3 代表当前组件挂载点对应的 Fiber 对象，默认情况就是 id 为 root 的那个 div 节点对应的 Fiber 对象
  - 5 代表普通的 React 节点，比如 div、span 之类的节点

#### 2. type 属性

- type 属性是 createElement 方法的第一个参数，表示节点类型
- 如果当前节点是 div、span，type 属性当中存储的就是字符串类型的 div、span
- 如果当前元素是组件，type 属性当中存储的就是组件的构造函数

#### 3. stateNode 属性

- 如果当前 Fiber 表示的是普通 DOM 节点，stateNode 属性当中存储的就是节点所对应的真实的 DOM 对象
- 如果当前 Fiber 表示的是类组件，stateNode 属性当中存储的就是类组件的实例对象
- 如果当前 Fiber 表示的是函数组件，stateNode 属性当中存储的就是 null，因为函数组件没有实例

### 构建 Fiber 树相关

> Fiber 树和 DOM 树其实是对应的关系，但不是完全对应

- DOM 树中有子节点、父节点、兄弟节点这样的概念，有了这些才能构成树，Fiber 树也一样有这些概念，比如
  - return 表示父级 Fiber 节点
  - child 表示子级 Fiber 节点
  - sibling 表示下一个兄弟 Fiber 节点
- 这样无论当前处于 Fiber 树中的哪一个 Fiber 节点，都可以通过它找到子级父级以及同级

```js
type Fiber = {
	/************************  构建 Fiber 树相关  ***************************/

  // 指向自己的父级 Fiber 对象
  return: Fiber | null,

  // 指向自己的第一个子级 Fiber 对象
  child: Fiber | null,

  // 指向自己的下一个兄弟 iber 对象
  sibling: Fiber | null,

  // 在 Fiber 树更新的过程中，每个 Fiber 都会有一个跟其对应的 Fiber
  // 我们称他为 current <==> workInProgress
  // 在渲染完成之后他们会交换位置
  // alternate 指向当前 Fiber 在 workInProgress 树中的对应 Fiber
	alternate: Fiber | null,
}
```

### 组件状态数据相关

- pendingProps 属性当中存储的是组件即将更新的 props，就是新的 props
- memoizedProps 属性当中存储的是上一次组件更新后的 props，就是旧的 props
- memoizedState 属性当中存储的是上一次组件更新后的 state，就是旧的 state

```js
type Fiber = {
  /************************  状态数据相关  ********************************/

  // 即将更新的 props
  pendingProps: any,
  // 旧的 props
  memoizedProps: any,
  // 旧的 state
  memoizedState: any,
}
```

### 副作用相关

> 副作用指的就是可以触发 DOM 操作的属性

```js
type Fiber = {
  /************************  副作用相关 ******************************/

  // 该 Fiber 对应的组件产生的状态更新会存放在这个队列里面
  updateQueue: UpdateQueue<any> | null,

  // 用来记录当前 Fiber 要执行的 DOM 操作
  effectTag: SideEffectTag,

  // 存储第一个要执行副作用的子级 Fiber 对象
  firstEffect: Fiber | null,

  // 存储下一个要执行副作用的子级 Fiber 对象
  // 执行 DOM 渲染时要先通过 first 找到第一个, 然后通过 next 一直向后查找
  nextEffect: Fiber | null,

  // 存储 DOM 操作完后的副作用 比如调用生命周期函数或者钩子函数的调用
  lastEffect: Fiber | null,

  // 任务的过期时间
  expirationTime: ExpirationTime,

	// 当前组件及子组件处于何种渲染模式 详见 TypeOfMode
  mode: TypeOfMode,
};
```

#### 1. updateQueue

- updateQueue 表示的是任务队列，当前 Fiber 对应的组件要执行的任务都会被存储在这个任务队列当中，比如
  - 组件的状态更新
  - 组件的初始化渲染
- 以上都属于任务的一种，都会存储在 updateQueue 属性当中

> [!warning]
> 既然是队列，那在队列当中就可以存储多个任务，在什么情况下会存储多个任务呢？
>
> - 比如在组件当中多次调用了 setState 方法进行状态更新
> - **<font color=red>在 setState 方法被调用后，更新并不是马上发生，React 会将多个更新操作放在这个队列当中，最后执行批量更新操作</font>**

- updateQueue 属性的值其实就是 JavaScript 对象，对象中会以链表的方式存储一个个要更新的任务

```js
const queue: <State> = {
  // 上一次更新之后的 state, 作为下一次更新的基础
  baseState: fiber.memoizedState,
  baseQueue: null,
  shared: {
    pending: null,
  },
  effects: null,
}
fiber.updateQueue = queue;
```

#### 2. effectTag

- effectTag 属性表示的是当前 Fiber 节点对应的 DOM 节点要进行什么样的操作
- 具体的值可以参考 SideEffectTag
-

##### 2.1 SideEffectTag

- 文件位置：packages/shared/ReactSideEffectTags.js
- 在源码中这些值都是以二进制方式进行存储的，但在代码运行的时候会的到十进制数值
  - 0 NoEffect 表示当前 Fiber 节点，不需要进行任何 DOM 操作
  - 1 PerformedWork 表示该节点要执行的 DOM 操作已经完成，当 Fiber 节点对应的 DOM 操作执行完成以后，effectTag 属性的值会被重置为这个 1
  - 2 Placement 表示当前 Fiber 节点对应的 DOM 节点要被插入到页面中
  - 4 Update 表示当前节点需要被更新
  - 8 Deletion 表示当前节点需要被删除

```js
export type SideEffectTag = number;

// Don't change these two values. They're used by React Dev Tools.
export const NoEffect = /*              */ 0b0000000000000; // 0
export const PerformedWork = /*         */ 0b0000000000001; // 1

// You can change the rest (and add more).
export const Placement = /*             */ 0b0000000000010; // 2
export const Update = /*                */ 0b0000000000100; // 4
export const PlacementAndUpdate = /*    */ 0b0000000000110; // 6
export const Deletion = /*              */ 0b0000000001000; // 8
export const ContentReset = /*          */ 0b0000000010000; // 16
export const Callback = /*              */ 0b0000000100000; // 32
export const DidCapture = /*            */ 0b0000001000000; // 64
export const Ref = /*                   */ 0b0000010000000; // 128
export const Snapshot = /*              */ 0b0000100000000; // 256
export const Passive = /*               */ 0b0001000000000; // 512
export const Hydrating = /*             */ 0b0010000000000; // 1024
export const HydratingAndUpdate = /*    */ 0b0010000000100; // 1028

// Passive & Update & Callback & Ref & Snapshot
export const LifecycleEffectMask = /*   */ 0b0001110100100; // 932

// Union of all host effects
export const HostEffectMask = /*        */ 0b0011111111111; // 2047

export const Incomplete = /*            */ 0b0100000000000; // 2048
export const ShouldCapture = /*         */ 0b1000000000000; // 4096
```

#### 3. firstEffect、nextEffect、lastEffect

- firstEffect、nextEffect、lastEffect 这些属性当中存储的是 Fiber 节点，存储的是当前 Fiber 节点的子级 Fiber 节点，是需要执行副作用的子级 Fiber 节点
- 可以将这三个属性理解为 effectList，理解为一个存储 effectTag 副作用的列表容器
- 它是单链表结构，firstEffect 是第一个，lastEffect 是最后一个，中间使用 nextEffect 进行存储

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/img/Frame/React/31.png)

#### 4. expirationTime

- expirationTime 表示的是过期时间

> [!warning]
> 如果因为任务优先级的关系，任务迟迟没有得到执行，超过任务的过期时间呢
>
> - React 会强制执行该任务
> - 如果是同步任务，这个过期时间会被设置成一个很大的数值

#### 5. mode

- mode 属性表示当前 Fiber 节点的模式
- 这个模式可以参考 TypeOfMode

##### 5.1 TypeOfMode

- 文件位置: packages/react-reconciler/src/ReactTypeOfMode.js

```js
export type TypeOfMode = number;

// 0 同步渲染模式
export const NoMode = 0b0000;
// 1 严格模式
export const StrictMode = 0b0001;
// 10 异步渲染过渡模式
export const BlockingMode = 0b0010;
// 100 异步渲染模式
export const ConcurrentMode = 0b0100;
// 1000 性能测试模式
export const ProfileMode = 0b1000;
```

### 双缓存技术

> 在 React 中，DOM 的更新采用了双缓存技术，双缓存技术致力于更快速的 DOM 更新

> [!inof]
> 什么是双缓存？
>
> - 举个例子，使用 canvas 绘制动画时，在绘制每一帧前都会清除上一帧的画面，清除上一帧需要花费时间，如果当前帧画面计算量又比较大，又需要花费比较长的时间，这就导致上一帧清除到下一帧显示中间会有较长的间隙，就会出现白屏
> - 为了解决这个问题，可以在内存中绘制当前帧动画，绘制完毕后直接用当前帧替换上一帧画面，这样的话在帧画面替换的过程中就会节约非常多的时间，就不会出现白屏问题
>   这种 **<font color=red>在内存中构建并直接替换的技术叫做双缓存</font>**

- React 使用双缓存技术完成 Fiber 树的构建与替换，实现 DOM 对象的快速更新

#### 实现思路

- 在 React 中最多会同时存在两棵 Fiber 树
  - 当前在屏幕中显示的内容对应的 Fiber 树叫做 current Fiber 树
  - 当发生更新时，React 会在内存中重新构建一颗新的 Fiber 树，这颗正在构建的 Fiber 树叫做 workInProgress Fiber 树
- 在双缓存技术中，workInProgress Fiber 树就是即将要显示在页面中的 Fiber 树，当这颗 Fiber 树构建完成后，React 会使用它直接替换 current Fiber 树达到快速更新 DOM 的目的，因为 workInProgress Fiber 树是在内存中构建的所以构建它的速度是非常快的
- 一旦 workInProgress Fiber 树在屏幕上呈现，它就会变成 current Fiber 树

> [!warning]
> current Fiber 树和 workInProgress Fiber 树是存在联系的
>
> - 因为每次在构建 workInProgress Fiber 树的时候并不是完全的重新构建，实际上有很多属性是可以复用 current Fiber 树的
> - 所以在代码层面两者之间必须要建立关联关系

> [!important]
> 这个关联关系是如何建立的呢？
>
> - 在 current Fiber 节点对象中有一个 alternate 属性指向对应的 workInProgress Fiber 节点对象
> - 在 workInProgress Fiber 节点中有一个 alternate 属性也指向对应的 current Fiber 节点对象

#### 初始渲染时 Fiber 树的构建与替换

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/img/Frame/React/32.png)

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/img/Frame/React/33.png)

- rootFiber 对应的是组件的挂载点对应的 Fiber 对象
  - 项目中例如 id 为 root 的 div 所对应的 Fiber 对象
- React 在初始渲染时会先构建这个 div 所对应的 Fiber 对象，构建完成后会将这个对象看作是 current Fiber 树
- 接下来会在这个 Fiber 对象中添加一个 alternate 属性，属性的值是 current Fiber 的拷贝
  - 就是说将 rootFiber 拷贝了一份
- 将拷贝出的树当作 workInProgress Fiber 树，在 workInProgress Fiber 对象中也添加一个 alternate 属性，属性值指向 current Fiber 树
- 接下来构建子级 Fiber 对象的工作就全部在 workInProgress Fiber 树中完成
  - 例如 App 组件、p 节点的构建
- 当所有 Fiber 节点构建完成以后，使用 workInProgress Fiber 树替换 current Fiber 树，这样就完成了 Fiber 节点的构建与替换
- 替换之后，workInProgress Fiber 树就变成了 current Fiber 树
- Fiber 节点对象中是存储了对应的 DOM 节点对象的
  - 也就是说 DOM 对象的构建是在内存中完成的
- 当所有的 Fiber 对象构建完成后，所有的 DOM 对象也就构建完成了
- 这时就可以直接使用内存中的 DOM 对象替换页面中的 DOM 对象了
- 以上就是 React 中使用的双缓存技术，目的是实现更快速的DOM更新

### 区分 fiberRoot 与 rootFiber

> [!info]
> fiberRoot 表示 Fiber 数据结构对象，是 Fiber 数据结构中的最外层对象<br>
> rootFiber 表示组件挂载点对应的 Fiber 对象
>
> - 比如 React 应用中默认的组件挂载点就是 id 为 root 的 div

> [!warning]
> fiberRoot 包含 rootFiber，在 fiberRoot 对象中有一个 current 属性，存储 rootFiber<br>
> rootFiber 指向 fiberRoot，在 rootFiber 对象中有一个 stateNode 属性，指向 fiberRoot

- 在 React 应用中 FiberRoot 只有一个，而 rootFiber 可以有多个
- 因为 render 方法是可以调用多次的，每次调用 render 方法时，render 方法的第二个参数就是 rootFiber
- fiberRoot 会记录应用的更新信息
  - 比如协调层在完成工作后，会将工作成果存储在 fiberRoot 中
