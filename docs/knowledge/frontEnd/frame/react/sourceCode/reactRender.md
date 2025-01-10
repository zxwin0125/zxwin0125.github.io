---
title: React 初始化渲染
order: 4
---

> 了解 React 元素是如何被渲染到页面中的，也就是 React 元素初始渲染的过程
> React 元素渲染到页面分为两个阶段
> - render 阶段
> - commit 阶段

- render 阶段
  - 协调层负责的阶段，该阶段会为每一个 React 元素构建对应的 Fiber 对象
  - 在构建 Fiber 对象过程中，还有为此 Fiber 对象创建其对应的 DOM 对象，并且要为 Fiber 对象添加 effectTag 属性，即标注当前 Fiber 对象对应的 DOM 对象要进行的操作（插入、删除、更新）
  - 这个新构建的 Fiber 对象称之为 workInProgress Fiber 树，即待提交的 Fiber 树
  - 当 render 阶段结束之后，它会被保存在 fiberRoot 对象中，然后进入 commit 阶段
- commit 阶段
  - 先获取 render 阶段的工作成果，即获取保存到 fiberRoot 对象中的新构建的 workInProgress Fiber 树
  - 接着根据 Fiber 对象中的 effectTag 属性进行相应的 DOM 操作

## render 阶段

### render 方法

#### 1. 相关源码

- 文件位置：packages/react-dom/src/client/ReactDOMLegacy.js

```js
/**
 * 渲染入口
 * element 要进行渲染的 ReactElement, createElement 方法的返回值
 * container 渲染容器 <div id="root"></div>
 * callback 渲染完成后执行的回调函数
 */
export function render(
  element: React$Element<any>,
  container: Container,
  callback: ?Function,
) {
  // 检测 container 是否是符合要求的渲染容器
  // 即检测 container 是否是真实的DOM对象
  // 如果不符合要求就报错
  invariant(
    isValidContainer(container),
    'Target container is not a DOM element.',
  );
  return legacyRenderSubtreeIntoContainer(
    // 父组件 初始渲染没有父组件 传递 null 占位
    null,
    element,
    container,
    // 是否为服务器端渲染 false 不是服务器端渲染 true 是服务器端渲染
    false,
    callback,
  );
}
```

#### 2. 具体分析

- render 方法接收三个参数
  - 第一个参数 element，指定的就是要渲染的 React 元素，实际上就是 createElement 方法的返回值
  - 第二个参数 container，指定的渲染容器，id 为 root 的 div 那个 DOM 对象
  - 第三个参数 callback，渲染完成后要执行的回调函数，可选
- render 方法内部先判断渲染容器是否符合要求，之后返回 legacyRenderSubtreeIntoContainer 方法的调用

### isValidContainer 检测是否是有效容器

#### 1. 相关源码

- 文件位置：packages/react-dom/src/client/ReactDOMRoot.js

```js
/**
 * 判断 node 是否是符合要求的 DOM 节点
 * 1. node 可以是元素节点
 * 2. node 可以是 document 节点
 * 3. node 可以是 文档碎片节点
 * 4. node 可以是注释节点，但
 */
export function isValidContainer(node: mixed): boolean {
  return !!(
    node &&
    (node.nodeType === ELEMENT_NODE ||
      node.nodeType === DOCUMENT_NODE ||
      node.nodeType === DOCUMENT_FRAGMENT_NODE ||
      (node.nodeType === COMMENT_NODE &&
        (node: any).nodeValue === ' react-mount-point-unstable '))
  );
}
```

#### 2. 具体分析

- isValidContainer 方法作为判断条件执行，判断 container 是否是符合要求的渲染容器

> [!warning]
> 如果 node 是注释节点，注释内容必须是 react-mount-point-unstable<br>
> react 内部会找到注释节点的父级，通过调用父级元素的 insertBefore 方法, 将 element 插入到注释节点的前面


### legacyRenderSubtreeIntoContainer 初始化 Fiber 数据结构

#### 1. 相关源码

- 文件位置: packages/react-dom/src/client/ReactDOMLegacy.js

```js
/**
 * 将子树渲染到容器中 (初始化 Fiber 数据结构: 创建 fiberRoot 及 rootFiber)
 * parentComponent: 父组件, 初始渲染传入了 null
 * children: render 方法中的第一个参数, 要渲染的 ReactElement
 * container: 渲染容器
 * forceHydrate: true 为服务端渲染, false 为客户端渲染
 * callback: 组件渲染完成后需要执行的回调函数
 **/
function legacyRenderSubtreeIntoContainer(
  parentComponent: ?React$Component<any, any>,
  children: ReactNodeList,
  container: Container,
  forceHydrate: boolean,
  callback: ?Function,
) {
  /**
   * 检测 container 是否已经是初始化过的渲染容器
   * react 在初始渲染时会为最外层容器添加 _reactRootContainer 属性
   * react 会根据此属性进行不同的渲染方式
   * root 不存在 表示初始渲染
   * root 存在 表示更新
   */
  // 获取 container 容器对象下是否有 _reactRootContainer 属性
  let root: RootType = (container._reactRootContainer: any);
  // 即将存储根 Fiber 对象
  let fiberRoot;
  if (!root) {
    // 初始渲染
    // 初始化根 Fiber 数据结构
    // 为 container 容器添加 _reactRootContainer 属性
    // 在 _reactRootContainer 对象中有一个属性叫做 _internalRoot
    // _internalRoot 属性值即为 FiberRoot 表示根节点 Fiber 数据结构
    // legacyCreateRootFromDOMContainer
    // createLegacyRoot
    // new ReactDOMBlockingRoot -> this._internalRoot
    // createRootImpl
    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(
      container,
      forceHydrate,
    );
    // 获取 Fiber Root 对象
    fiberRoot = root._internalRoot;
    /**
     * 改变 callback 函数中的 this 指向
     * 使其指向 render 方法第一个参数的真实 DOM 对象
     */
    // 如果 callback 参数是函数类型
    if (typeof callback === 'function') {
      // 使用 originalCallback 存储 callback 函数
      const originalCallback = callback;
      // 为 callback 参数重新赋值
      callback = function () {
        // 获取 render 方法第一个参数的真实 DOM 对象
        // 实际上就是 id="root" 的 div 的子元素
        // rootFiber.child.stateNode
        // rootFiber 就是 id="root" 的 div
        const instance = getPublicRootInstance(fiberRoot);
        // 调用 callback 函数并改变函数内部 this 指向
        originalCallback.call(instance);
      };
    }
    // 初始化渲染不执行批量更新
    // 因为批量更新是异步的是可以被打断的, 但是初始化渲染应该尽快完成不能被打断
    // 所以不执行批量更新
    unbatchedUpdates(() => {
      updateContainer(children, fiberRoot, parentComponent, callback);
    });
  } else {
    // 非初始化渲染 即更新
    fiberRoot = root._internalRoot;
    if (typeof callback === 'function') {
      const originalCallback = callback;
      callback = function () {
        const instance = getPublicRootInstance(fiberRoot);
        originalCallback.call(instance);
      };
    }
    // Update
    updateContainer(children, fiberRoot, parentComponent, callback);
  }
  // 返回 render 方法第一个参数的真实 DOM 对象作为 render 方法的返回值
  // 就是说渲染谁 返回谁的真实 DOM 对象
  return getPublicRootInstance(fiberRoot);
}
```

#### 2. 分析

- legacyRenderSubtreeIntoContainer 接收五个参数
  - 第一个参数 parentComponent，表示父组件，初始化渲染没有父组件，所以为 null
  - 第二个参数 children，表示要渲染的 React 元素
  - 第三个参数 container，表示渲染的目标容器
  - 第四个参数 forceHydrate，表示当前是否为服务器端渲染
    - 如果在 render 方法中调用这个方法，那就一定传 false，不是服务器端渲染
    - 如果在 hydrate 方法中调用这个方法，那就一定传 true，代表服务器端渲染
  - 第五个参数 callback，表示组件渲染完成后需要执行的回调函数

> [!warning]
> 为什么在 legacyRenderSubtreeIntoContainer 里要去判断是否为服务器端渲染呢？
> - 如果是服务器端渲染，要复用 container 内部的 DOM 元素
> - 如果不是服务器端渲染，就不需要复用 container 内部的 DOM 元素，要去删除 container 内部的内容

- legacyRenderSubtreeIntoContainer 是 render 方法的核心内容，将子树渲染到容器中
- **<font color=red>主要内容是初始化 Fiber 数据结构，创建 fiberRoot 及 rootFiber</font>**

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Frame/React/35.png)

##### 1.1 检测 container 是否已经是初始化过的渲染容器

- legacyRenderSubtreeIntoContainer 方法里可以看到它拿到 container 这个 DOM 对象，去这个 DOM 对象中获取 _reactRootContainer 这样一个和 React 相关的属性

> [!warning]
> 这个属性到底能不能获取到呢?
> - 肯定是不能获取到的
> - 因为 container 就是一个普通的 DOM 对象，没有和 React 相关的属性
> - 所以返回值 root 一定是一个 undefined

> [!warning]
> 为什么要去获取 _reactRootContainer 这样一个属性呢?
> - 实际上就是检测 container 是否已经是初始化过的渲染容器

- react 在初始渲染时会为最外层容器添加 _reactRootContainer 属性，并根据此属性是否存在进行不同的渲染方式
  - root 不存在，即没有获取到 _reactRootContainer 属性，表示初始渲染
  - root 存在，即已经获取到 _reactRootContainer 属性，表示处于更新阶段

##### 1.2 初始化 Fiber 数据结构

- root 不存在，即初始渲染，就给 root 重新赋值，给 container 添加 _reactRootContainer 属性，属性值是 legacyCreateRootFromDOMContainer 方法的调用
- 这些事情就是在创建 fiberRoot 以及 rootFiber

##### 1.3 legacyCreateRootFromDOMContainer 判断是否为服务器端渲染

- legacyCreateRootFromDOMContainer 判断是否为服务器端渲染，如果不是服务器端渲染，清空 container 容器中的节点
- 声明 rootSibling 变量存储 container 内部的子元素，while 循环条件为 container 最后一个子元素赋值给 rootSibling，也就是说如果这个 rootSibling 存在就进行循环，while 循环里 container 调用 removeChild 方法删除节点

> [!warning]
> 为什么要清除 container 中的元素?
> - 为提供首屏加载的用户体验, 有时需要在 container 中放置一些占位图或者 loading 图，就无可避免的要向 container 中加入 html 标记
> - 在将 ReactElement 渲染到 container 之前, 必然要先清空 container，因为占位图和 ReactElement 不能同时显示

> [!important]
> 开发技巧启示
> - React 清空容器内容的方式是循环遍历容器的下级子元素，依次删除
> - 所以在加入占位图代码时，最好只有一个父级元素，这样 React 在清空容器中的占位图代码的时候，只需要循环一次即可删除，减少内部代码的循环次数，提高性能

```html
<!-- React 只会删除一次 div，而不会删除三次 p -->
<div>
	<p>placement<p>
	<p>placement<p>
	<p>placement<p>
</div>
```

- legacyCreateRootFromDOMContainer 最后返回的是 createLegacyRoot 方法的调用

###### 1.3.1 相关源码

- 文件位置: packages/react-dom/src/client/ReactDOMLegacy.js

```js
/**
 * 判断是否为服务器端渲染 如果不是服务器端渲染
 * 清空 container 容器中的节点
 */
function legacyCreateRootFromDOMContainer(
  container: Container,
  forceHydrate: boolean,
): RootType {
  // container => <div id="root"></div>
  // 检测是否为服务器端渲染
  const shouldHydrate =
    forceHydrate || shouldHydrateDueToLegacyHeuristic(container);
  // 如果不是服务器端渲染
  if (!shouldHydrate) {
    let rootSibling;
    // 开启循环 删除 container 容器中的节点
    while ((rootSibling = container.lastChild)) {
      // 删除 container 容器中的节点
      container.removeChild(rootSibling);
      /**
       * 为什么要清除 container 中的元素 ?
       * 为提供首屏加载的用户体验, 有时需要在 container 中放置一些占位图或者 loading 图
       * 就无可避免的要向 container 中加入 html 标记.
       * 在将 ReactElement 渲染到 container 之前, 必然要先清空 container
       * 因为占位图和 ReactElement 不能同时显示
       *
       * 在加入占位代码时, 最好只有一个父级元素, 可以减少内部代码的循环次数以提高性能
       * <div>
       *  <p>placement<p>
       *  <p>placement<p>
       *  <p>placement<p>
       * </div>
       */
    }
  }
  return createLegacyRoot(
    container,
    shouldHydrate
      ? {
          hydrate: true,
        }
      : undefined,
  );
}
```

##### 1.4 createLegacyRoot 创建 LegacyRoot

- 通过实例化 ReactDOMBlockingRoot 类创建对应的实例对象
- 实例化 ReactDOMBlockingRoot 类的时候传递了一些参数
  - 第一个参数 container 表示 DOM 对象
  - 第二个参数 LegacyRoot 是一个常量，值为 0

> [!warning]
> 什么是 LegacyRoot？
> - 通过 render 方法创建的 container 就是 LegacyRoot

###### 1.4.1 LegacyRoot 定义

- RootTag，文件位置：packages/shared/ReactRootTags.js
- 通过常量标记当前 root 类型

```js
export type RootTag = 0 | 1 | 2;

// ReactDOM.render
export const LegacyRoot = 0;
// ReactDOM.createBlockingRoot
export const BlockingRoot = 1;
// ReactDOM.createRoot
export const ConcurrentRoot = 2;
```

###### 1.4.1 相关源码

- 文件位置: packages/react-dom/src/client/ReactDOMRoot.js

```js
/**
 * 通过实例化 ReactDOMBlockingRoot 类创建 LegacyRoot
 */
export function createLegacyRoot(
  container: Container,
  options?: RootOptions,
): RootType {
  // container => <div id="root"></div>
  // LegacyRoot 常量, 值为 0,
  // 通过 render 方法创建的 container 就是 LegacyRoot
  return new ReactDOMBlockingRoot(container, LegacyRoot, options);
}
```

##### 1.5 ReactDOMBlockingRoot 类

- 通过 this 关键字向这个对象当中添加了 _internalRoot 属性，属性值是 createRootImpl 方法的调用，返回的也是一个对象

###### 1.5.1 相关源码

- 文件位置: packages/react-dom/src/client/ReactDOMRoot.js

```js
/**
 * 类, 通过它可以创建 LegacyRoot 的 Fiber 数据结构
 */
function ReactDOMBlockingRoot(
  container: Container,
  tag: RootTag,
  options: void | RootOptions,
) {
  // tag => 0 => legacyRoot
  // container => <div id="root"></div>
  // container._reactRootContainer = {_internalRoot: {}}
  this._internalRoot = createRootImpl(container, tag, options);
}
```

##### 1.6 createRootImpl

- 通过调用 createContainer 方法返回一个 root，作为当前方法的返回值

###### 1.6.1 相关源码

- 文件位置: packages/react-dom/src/client/ReactDOMRoot.js

```js
function createRootImpl(
  container: Container,
  tag: RootTag,
  options: void | RootOptions,
) {
  // container => <div id="root"></div>
  // tag => 0
  // options => undefined
  const root = createContainer(container, tag, hydrate, hydrationCallbacks);
  markContainerAsRoot(root.current, container);
  return root;
}
```

##### 1.7 createContainer

- 实际上调用 createFiberRoot 方法作为返回值

###### 1.7.1 相关源码

- 文件位置: packages/react-reconciler/src/ReactFiberReconciler.js

```js
// 创建 container
export function createContainer(
  containerInfo: Container,
  tag: RootTag,
  hydrate: boolean,
  hydrationCallbacks: null | SuspenseHydrationCallbacks,
): OpaqueRoot {
  // containerInfo => <div id="root"></div>
  // tag: 0
  // hydrate: false
  // hydrationCallbacks: null
  // 忽略了和服务器端渲染相关的内容
  return createFiberRoot(containerInfo, tag, hydrate, hydrationCallbacks);
}
```

##### 1.8 createFiberRoot

1. 创建 fiberRoot
  - const 关键字声明 root 常量，存储的实际上就是最终要得到的 fiberRoot 对象，值是 new FiberRootNode
2. 创建 rootFiber
  - 即 id 为 root 的那个 div 所对应的 fiber 对象
3. 关联 fiberRoot 和 rootFiber
  - 为 fiberRoot 添加 current 属性 值为 rootFiber
  - 为 rootFiber 添加 stateNode 属性 值为 fiberRoot
4. 给 rootFiber 添加任务队列属性
  - 调用 initializeUpdateQueue 方法给 fiber 对象初始化 updateQueue，添加一系列默认值

###### 1.8.1 相关源码

- 文件位置: packages/react-reconciler/src/ReactFiberRoot.js

```js
// 创建根节点对应的 fiber 对象
export function createFiberRoot(
  containerInfo: any,
  tag: RootTag,
  hydrate: boolean,
  hydrationCallbacks: null | SuspenseHydrationCallbacks,
): FiberRoot {
  // 创建 FiberRoot
  const root: FiberRoot = (new FiberRootNode(containerInfo, tag, hydrate): any);
  // 创建根节点对应的 rootFiber
  const uninitializedFiber = createHostRootFiber(tag);
  // 为 fiberRoot 添加 current 属性 值为 rootFiber
  root.current = uninitializedFiber;
  // 为 rootFiber 添加 stateNode 属性 值为 fiberRoot
  uninitializedFiber.stateNode = root;
  // 为 fiber 对象添加 updateQueue 属性, 初始化 updateQueue 对象
  // updateQueue 用于存放 Update 对象
  // Update 对象用于记录组件状态的改变
  initializeUpdateQueue(uninitializedFiber);
  // 返回 root
  return root;
}
```

##### 1.9 FiberRootNode

- FiberRootNode 构造函数中，只是为 fiberNode 对象初始化一些默认的属性

###### 1.9.1 相关源码

- 文件位置: packages/react-reconciler/src/ReactFiberRoot.js

```js
function FiberRootNode(containerInfo, tag, hydrate) {
  this.tag = tag;
  this.current = null;
  this.containerInfo = containerInfo;
  this.pendingChildren = null;
  this.pingCache = null;
  this.finishedExpirationTime = NoWork;
  this.finishedWork = null;
  this.timeoutHandle = noTimeout;
  this.context = null;
  this.pendingContext = null;
  this.hydrate = hydrate;
  this.callbackNode = null;
  this.callbackPriority = NoPriority;
  this.firstPendingTime = NoWork;
  this.firstSuspendedTime = NoWork;
  this.lastSuspendedTime = NoWork;
  this.nextKnownPendingLevel = NoWork;
  this.lastPingedTime = NoWork;
  this.lastExpiredTime = NoWork;
  if (enableSchedulerTracing) {
    this.interactionThreadID = unstable_getThreadID();
    this.memoizedInteractions = new Set();
    this.pendingInteractionMap = new Map();
  }
  if (enableSuspenseCallback) {
    this.hydrationCallbacks = null;
  }
}
```

##### 1.10 initializeUpdateQueue

- 实际上就是一个对象，有一些默认属性及默认值
- 找到 rootFiber，给 rootFiber 添加 updateQueue 属性，属性值就是这个对象

###### 1.10.1 相关源码

- 文件位置: packages/react-reconciler/src/ReactFiberRoot.js

```js
export function initializeUpdateQueue<State>(fiber: Fiber): void {
  const queue: UpdateQueue<State> = {
    baseState: fiber.memoizedState,
    baseQueue: null,
    shared: {
      pending: null,
    },
    effects: null,
  };
  fiber.updateQueue = queue;
}
```

#### 3. 总结

> [!important]
> legacyRenderSubtreeIntoContainer 在初始化 fiberRoot 的过程中主要做了以下事情
> 1. 清空 container 的内容
>   - 如果不是服务端渲染，则不需要复用 container 内部的 DOM，直接清空 container 的内容
> 2. 创建 fiberRoot 和 rootFiber
>   - legacyRenderSubtreeIntoContainer 方法中调用 legacyCreateRootFromDOMContainer
>   - 最终在 createFiberRoot 方法中创建了 fiberRoot 和 rootFiber，并进行了关联（current 和 stateNode）
>   - 还为 rootFiber 添加了一个属性 updateQueue，存储了初始化的任务队列
> 3. 将包裹的 fiberRoot（属性名是 _internalRoot）的对象存储到 container 的 _reactRootContainer 属性上，作为判断是否是初始渲染的依据

### legacyRenderSubtreeIntoContainer 更改 callback 函数内部的 this 指向

#### 1. 相关源码

```js
// 截取自 legacyRenderSubtreeIntoContainer 方法
/**
 * 改变 callback 函数中的 this 指向
 * 使其指向 render 方法第一个参数的真实 DOM 对象
 */
// 如果 callback 参数是函数类型
if (typeof callback === 'function') {
  // 使用 originalCallback 存储 callback 函数
  const originalCallback = callback;
  // 为 callback 参数重新赋值
  callback = function () {
    // 获取 render 方法第一个参数的真实 DOM 对象
    // 实际上就是 id="root" 的 div 的子元素
    // rootFiber.child.stateNode
    // rootFiber 就是 id="root" 的 div
    const instance = getPublicRootInstance(fiberRoot);
    // 调用原始 callback 函数并改变函数内部 this 指向
    originalCallback.call(instance);
  };
}
```

#### 2. 具体分析

- render 方法的第三个参数用于在构建完 fiberRoot 后执行的回调函数
- legacyRenderSubtreeIntoContainer 中进行了判断，如果 callback 有值，则更改 callback 函数内部的 this 指向，指向 render 方法第一个参数对应的实例对象（stateNode）

> [!warning]
> 如何进行判断的
> 1. typeof 判断是否传递 callback
> 2. 用 originalCallback 变量存储 callback
> 3. 给 callback 重新赋值为一个新的函数，调用 getPublicRootInstance 方法获取 render 方法第一个参数所对应的实例对象
> 4. 用 originalCallback 调用原有的 callback，并将 this 指向这个实例对象

##### 2.1 getPublicRootInstance

- 获取 container 的第一个子元素

###### 2.1.1 相关源码

- 文件位置: packages/react-reconciler/src/ReactFiberReconciler.js

```js
/**
 * 获取 container 的第一个子元素的实例对象
 */
export function getPublicRootInstance(
  // FiberRoot
  container: OpaqueRoot,
): React$Component<any, any> | PublicInstance | null {
  // 获取 rootFiber
  const containerFiber = container.current;
  // 如果 rootFiber 没有子元素
  // 指的就是 id="root" 的 div 没有子元素
  if (!containerFiber.child) {
    // 返回 null
    return null;
  }
  // 匹配子元素的类型
  switch (containerFiber.child.tag) {
    // 普通
    case HostComponent:
      return getPublicInstance(containerFiber.child.stateNode);
    default:
      // 返回子元素的真实 DOM 对象
      return containerFiber.child.stateNode;
  }
}
```

###### 2.1.2 具体分析

- 如果是普通元素，则指向元素的 DOM 对象
- 如果是类组件，则指向组件的实例对象
- 如果是函数组件，则为 null，因为函数组件没有实例对象

```js
ReactDOM.render(<div>普通元素</div>, document.getElementById("root"), function () {
  console.log(this) // DOM 对象
})
```
```js
class App extends React.Component {
  render(){
    return <div>类组件</div>
  }
}
ReactDOM.render(<App />, document.getElementById("root"), function () {
  console.log(this) // App 的实例对象
})
```
```js
function App(props) {
  return <div>函数组件</div>
}
ReactDOM.render(<App />, document.getElementById("root"), function () {
  console.log(this) // null
})
```

##### 2.2 getPublicInstance

- 接收什么就返回什么

###### 2.2.1 相关源码

- 文件位置: packages/react-dom/src/client/ReactDOMHostConfig.js

```js
export function getPublicInstance(instance: Instance): * {
  return instance;
}
```

### legacyRenderSubtreeIntoContainer 非批量更新

#### 1. 相关源码

```js
// 截取自 legacyRenderSubtreeIntoContainer 方法
// 初始化渲染不执行批量更新
// 因为批量更新是异步的是可以被打断的, 但是初始化渲染应该尽快完成不能被打断
// 所以不执行批量更新
unbatchedUpdates(() => {
  updateContainer(children, fiberRoot, parentComponent, callback);
});
```

#### 2. 具体分析

> [!info]
> 批量更新：当多次调用 setState 方法时，会把多次的状态存储到更新队列中，最后将更新队列中的内容一次性的更新完成<br>
> 批量更新是异步的，可以被打断的

> [!warning]
> React 中规定，初始化渲染不执行批量更新，因为初始化渲染需要尽量快速的完成，任务是不可以被打断的

### legacyRenderSubtreeIntoContainer 返回实例对象

- legacyRenderSubtreeIntoContainer 最后返回了 render 方法第一个参数所对应的实例对象，这也是 render 方法最后返回的对象

```js
// 截取自 legacyRenderSubtreeIntoContainer 方法
// 返回 render 方法第一个参数的真实 DOM 对象作为 render 方法的返回值
// 就是说渲染谁 返回谁的真实 DOM 对象
return getPublicRootInstance(fiberRoot);
```

### legacyRenderSubtreeIntoContainer 总结

> [!important]
> legacyRenderSubtreeIntoContainer 方法最核心的内容就是创建 fiberRoot 和 rootFiber
> 1. 首先判断 container 下是否包含 _reactRootContainer 属性
>   - 如果没有，则表示是初始化渲染
>     - 调用方法创建 fiberRoot 对象，将包裹 fiberRoot 的对象存储到这个属性
>   - 如果有，则表示是更新操作
> 2. 接着将 render 方法的第三个参数（回调函数）的 this 指向 render 方法的第一个参数所对应的实例对象（stateNode）
>   - 如果是普通元素，则是 DOM 对象
>   - 如果是类组件，则是组件实例对象
>   - 如果是函数组件，则为 null
> 3. 接着使用非批量更新的方式，执行更新操作 undateContainer
> 4. 最后返回 render 方法第一个参数对应的实例对象

### 创建任务并存放于任务队列

- legacyRenderSubtreeIntoContainer 方法初始化的 fiberRoot 对象，是属于 current Fiber 树中的 fiberRoot 对象

#### 1. updateContainer

> updateContainer 方法最核心的任务是创建一个任务对象

- 当前进行的是初始化渲染，updateContainer 会把初始化渲染当作一个任务去执行
- 当创建好这个任务，会把任务放到任务队列中
- 接着就是等待浏览器有空闲时间的时候，执行这个任务

##### 1.1 相关源码

- 文件位置: packages/react-reconciler/src/ReactFiberReconciler.js

```js
/**
 * 计算任务的过期时间
 * 再根据任务过期时间创建 Update 任务
 */
export function updateContainer(
	// element 要渲染的 ReactElement
  element: ReactNodeList,
  // container Fiber Root 对象
  container: OpaqueRoot,
  // parentComponent 父组件 初始渲染为 null
  parentComponent: ?React$Component<any, any>,
  // ReactElement 渲染完成执行的回调函数
  callback: ?Function,
): ExpirationTime {  
  // container 获取 rootFiber
  const current = container.current;
  // 获取当前距离 react 应用初始化的时间 1073741805
  const currentTime = requestCurrentTimeForUpdate();
  // 异步加载设置
  const suspenseConfig = requestCurrentSuspenseConfig();

  // 计算过期时间
  // 为防止任务因为优先级的原因一直被打断而未能执行
  // react 会设置一个过期时间, 当时间到了过期时间的时候
  // 如果任务还未执行的话, react 将会强制执行该任务
  // 初始化渲染时, 任务同步执行不涉及被打断的问题 1073741823
  const expirationTime = computeExpirationForFiber(
    currentTime,
    current,
    suspenseConfig,
  );
  // 设置FiberRoot.context, 首次执行返回一个emptyContext, 是一个 {}
  const context = getContextForSubtree(parentComponent);
  // 初始渲染时 Fiber Root 对象中的 context 属性值为 null
  // 所以会进入到 if 中
  if (container.context === null) {
    // 初始渲染时将 context 属性值设置为 {}
    container.context = context;
  } else {
    container.pendingContext = context;
  }
  // 创建一个待执行任务
  const update = createUpdate(expirationTime, suspenseConfig);
  // 将要更新的内容挂载到更新对象中的 payload 中
  // 将要更新的组件存储在 payload 对象中, 方便后期获取
  update.payload = {element};
  // 判断 callback 是否存在
  callback = callback === undefined ? null : callback;
  // 如果 callback 存在
  if (callback !== null) {
    // 将 callback 挂载到 update 对象中
    // 其实就是一层层传递 方便 ReactElement 元素渲染完成调用
    // 回调函数执行完成后会被清除 可以在代码的后面加上 return 进行验证
    update.callback = callback;
  }
  // 将 update 对象加入到当前 Fiber 的更新队列当中 (updateQueue)
  enqueueUpdate(current, update);
  // 调度和更新 current 对象
  scheduleWork(current, expirationTime);
  // 返回过期时间
  return expirationTime;
}
```

##### 1.2 具体分析

> [!info]
> updateContainer 接收四个参数
> - 第一个参数 element，表示要渲染的 React 元素
> - 第二个参数 container，表示 fiberRoot 对象
> - 第三个参数 parentComponent，表示父组件，初始渲染为 null
> - 第四个参数 callback，表示渲染完成后要执行的回调函数

- 计算任务过期时间「如果超过过期时间任务还没有执行完，就强制执行任务」
  - 使用三个常量 current, currentTime, suspenseConfig 计算过期时间
    - current 获取 rootFiber
    - currentTime 计算当前距离 react 应用初始化的时间
    - suspenseConfig 异步加载设置
  - 初始化渲染是同步任务，过期时间固定为 1073741823 表示同步任务
- 设置 fiberRoot 的 context 属性
  - 初始化渲染时返回一个 emptyContext，是空对象 {}，赋值给 fiberRoot 的 context 属性

###### 1.2.1 核心代码

```js
// 创建一个待执行任务
const update = createUpdate(expirationTime, suspenseConfig);
// 将要更新的内容挂载到更新对象中的 payload 中
// 将要更新的组件存储在 payload 对象中, 方便后期获取
update.payload = {element};
// 判断 callback 是否存在
callback = callback === undefined ? null : callback;
// 如果 callback 存在
if (callback !== null) {
  // 将 callback 挂载到 update 对象中
  // 其实就是一层层传递 方便 ReactElement 元素渲染完成调用
  // 回调函数执行完成后会被清除 可以在代码的后面加上 return 进行验证
  update.callback = callback;
}
// 将 update 对象加入到当前 Fiber 的更新队列当中 (updateQueue)
// 待执行的任务都会被存储在 fiber.updateQueue.shared.pending 中
enqueueUpdate(current, update);
// 调度和更新 current 对象
scheduleWork(current, expirationTime);
```

###### 1.2.2 createUpdate 创建任务

1. 调用 createUpdate 方法，传递过期时间以及异步相关的配置，创建一个待执行任务
2. 把要执行的任务内容放到 payload 对象中
3. 判断 callback 是否为 undefined，callback 存在，挂载到 update 对象中，一层层传递，方便 React 元素渲染完成后调用这个 callback

> [!warning]
> createUpdate 方法内部仅仅创建一个对象，返回一个对象

- 文件位置 packages\react-reconciler\src\ReactUpdateQueue.js

```js
export function createUpdate(
  expirationTime: ExpirationTime,
  suspenseConfig: null | SuspenseConfig,
): Update<*> {
  let update: Update<*> = {
    expirationTime,
    suspenseConfig,

    tag: UpdateState,
    payload: null,
    callback: null,

    next: (null: any),
  };
  update.next = update;
  if (__DEV__) {
    update.priority = getCurrentPriorityLevel();
  }
  return update;
}
```

###### 1.2.3 enqueueUpdate 加入任务队列

> 将创建出来的任务放到 fiber 对象中的 updateQueue 属性中<br>
> updateQueue 就是任务队列，update 就是任务

- 任务队列中的 shared.pending 属性存储待执行任务，它是一个单向链表结构，它存储一个待执行任务对象，这个任务对象的 next 属性存储下一个任务，以此串联
- 文件位置 packages/react-reconciler/src/ReactUpdateQueue.js
```js
// 将任务(Update)存放于任务队列(updateQueue)中
// 创建单向链表结构存放 update, next 用来串联 update
export function enqueueUpdate<State>(fiber: Fiber, update: Update<State>) {
  // 获取当前 Fiber 的 更新队列
  const updateQueue = fiber.updateQueue;
  // 如果更新队列不存在 就返回 null
  if (updateQueue === null) {
    // 仅发生在 fiber 已经被卸载
    return;
  }
  // 获取待执行的 Update 任务
  // 初始渲染时没有待执行的任务
  const sharedQueue = updateQueue.shared;
  const pending = sharedQueue.pending;
  // 如果没有待执行的 Update 任务
  if (pending === null) {
    // 这是第一次更新, 创建一个循环列表.
    update.next = update;
  } else {
    update.next = pending.next;
    pending.next = update;
  }
  // 将 Update 任务存储在 pending 属性中
  sharedQueue.pending = update;
}
```

###### 1.2.4 scheduleWork / scheduleUpdateOnFiber 判断任务性质

> scheduleWork 是另一个方法 scheduleUpdateOnFiber 的别名<br>
> 核心是判断当前任务是否是同步任务，如果是同步任务，就进入到同步任务执行的入口方法当中，代表任务正式开始执行

- 文件位置 packages\react-reconciler\src\ReactFiberWorkLoop.js
```js
/**
 * 判断任务是否为同步 调用同步任务入口
 */
export function scheduleUpdateOnFiber(
  fiber: Fiber,
  expirationTime: ExpirationTime,
) {n
  /**
   * fiber: 初始化渲染时为 rootFiber, 即 <div id="root"></div> 对应的 Fiber 对象
   * expirationTime: 任务过期时间 => 同步任务固定为 1073741823
   */
  /**
   * 判断是否是无限循环的 update 如果是就报错
   * 在 componentWillUpdate 或者 componentDidUpdate 生命周期函数中重复调用
   * setState 方法时, 可能会发生这种情况, React 限制了嵌套更新的数量以防止无限循环
   * 限制的嵌套更新数量为 50, 可通过 NESTED_UPDATE_LIMIT 全局变量获取
   */
  checkForNestedUpdates();
  // 开发环境下执行的代码 忽略
  warnAboutRenderPhaseUpdatesInDEV(fiber);
  // 遍历更新子节点的过期时间 返回 FiberRoot
  const root = markUpdateTimeFromFiberToRoot(fiber, expirationTime);
  if (root === null) {
    // 开发环境下执行 忽略
    warnAboutUpdateOnUnmountedFiberInDEV(fiber);
    return;
  }
  // 判断是否有高优先级任务打断当前正在执行的任务
  // 初始渲染时内部判断条件不成立 内部代码没有得到执行
  checkForInterruption(fiber, expirationTime);

  // 报告调度更新, 实际什么也没做，忽略
  recordScheduleUpdate();

  // 获取当前调度任务的优先级 数值类型 90-99 数值越大 优先级越高
  // 初始渲染时优先级为 97 表示普通优先级任务。
  // 这个变量在初始渲染时并没有用到，忽略
  const priorityLevel = getCurrentPriorityLevel();
  // 判断任务是否是同步任务 Sync的值为: 1073741823
  if (expirationTime === Sync) {
    if (
      // 检查是否处于非批量更新模式
      (executionContext & LegacyUnbatchedContext) !== NoContext &&
      // 检查是否没有处于正在进行渲染的任务
      (executionContext & (RenderContext | CommitContext)) === NoContext
    ) {
      // 在根上注册待处理的交互, 以避免丢失跟踪的交互数据
      // 初始渲染时内部条件判断不成立, 内部代码没有得到执行
      schedulePendingInteractions(root, expirationTime);
      // 同步任务入口点
      performSyncWorkOnRoot(root);
    } else {
      ensureRootIsScheduled(root);
      schedulePendingInteractions(root, expirationTime);
      if (executionContext === NoContext) {
        // Flush the synchronous work now, unless we're already working or inside
        // a batch. This is intentionally inside scheduleUpdateOnFiber instead of
        // scheduleCallbackForFiber to preserve the ability to schedule a callback
        // without immediately flushing it. We only do this for user-initiated
        // updates, to preserve historical behavior of legacy mode.
        flushSyncCallbackQueue();
      }
    }
  } else {
    ensureRootIsScheduled(root);
    schedulePendingInteractions(root, expirationTime);
  }
  // 初始渲染不执行
  if (
    (executionContext & DiscreteEventContext) !== NoContext &&
    // Only updates at user-blocking priority or greater are considered
    // discrete, even inside a discrete event.
    (priorityLevel === UserBlockingPriority ||
      priorityLevel === ImmediatePriority)
  ) {
    // This is the result of a discrete event. Track the lowest priority
    // discrete update per root so we can flush them early, if needed.
    if (rootsWithPendingDiscreteUpdates === null) {
      rootsWithPendingDiscreteUpdates = new Map([[root, expirationTime]]);
    } else {
      const lastDiscreteTime = rootsWithPendingDiscreteUpdates.get(root);
      if (lastDiscreteTime === undefined || lastDiscreteTime > expirationTime) {
        rootsWithPendingDiscreteUpdates.set(root, expirationTime);
      }
    }
  }
}
export const scheduleWork = scheduleUpdateOnFiber;
```

**checkForNestedUpdates 检查是否有嵌套的更新**

- checkForNestedUpdates 方法用于检查是否有嵌套的更新
  - 即在任务开始之前，检查这个任务是否是无限循环的任务
  - 如果是，就报一个错误去限制执行这样一个无限循环的任务
- 通过比对记录的嵌套更新数量是否超过上限（50）来判断是否是无限循环

> [!warning]
> 在 componentWillUpdate 或者 componentDidUpdate 生命周期函数中重复调用 setState 方法时, 可能会发生这种情况

```js
function checkForNestedUpdates() {
  // NESTED_UPDATE_LIMIT => 50
  if (nestedUpdateCount > NESTED_UPDATE_LIMIT) {
    nestedUpdateCount = 0;
    rootWithNestedUpdates = null;
    invariant(
      false,
      'Maximum update depth exceeded. This can happen when a component ' +
        'repeatedly calls setState inside componentWillUpdate or ' +
        'componentDidUpdate. React limits the number of nested updates to ' +
        'prevent infinite loops.',
    );
  }
}
```

**markUpdateTimeFromFiberToRoot**

- markUpdateTimeFromFiberToRoot用于更新子节点的过期时间，主要是返回了 fiberRoot

**getCurrentPriorityLevel 获取任务的优先级**

- getCurrentPriorityLevel 用于获取任务的优先级数值
- 在初始渲染时，任务优先级为 97，代表普通优先级任务，不过初始渲染的时候不会用到这个优先级

```js
// packages\react-reconciler\src\SchedulerWithReactIntegration.js
export function getCurrentPriorityLevel(): ReactPriorityLevel {
  switch (Scheduler_getCurrentPriorityLevel()) {
    // 99 立即执行的任务
    case Scheduler_ImmediatePriority:
      return ImmediatePriority;
    // 98 用户交互任务
    case Scheduler_UserBlockingPriority:
      return UserBlockingPriority;
    // 97 普通优先级
    case Scheduler_NormalPriority:
      return NormalPriority;
    // 96 低优先级任务
    case Scheduler_LowPriority:
      return LowPriority;
    // 95 闲时任务
    case Scheduler_IdlePriority:
      return IdlePriority;
    default:
      // 缺少优先级
      invariant(false, 'Unknown priority level.');
  }
}
```

> [!important]
> 判断任务是否是同步任务
> 1. 判断过期时间是否和 Sync 相等，Sync 是一个常量数值，和同步任务的数值是相同的
> 2. 任务执行前的检查
>   - 是否处于非批量更新模式，初始化渲染是非批量的，同步的，不可以被打断的
>   - 是否有正在处于进行渲染的任务，初始化渲染没有任务正在执行
> 3. 执行同步任务入口点，performSyncWorkOnRoot，任务开始执行

**scheduleWork / scheduleUpdateOnFiber 总结**
- 初始渲染时 scheduleUpdateOnFiber 的主要内容就是判断是否是同步任务
  1. 判断是否是无限循环，如果是则报错
  2. 使用过期时间判断是否是同步任务
  3. 如果是同步任务就调用同步任务入口方法

##### 1.3 总结

> [!important]
> updateContainer 中主要内容：
> 1. 计算过期时间，初始化渲染是同步执行，所以是一个固定的时间
> 2. 设置 fiberRoot 的 context 属性，初始化渲染时是一个空对象 {}
> 3. 创建一个待执行任务
>   - 将要更新的内容挂载到这个任务对象的 payload属性上
>   - 将回调函数挂载到这个任务对象的 callback 属性上
> 4. 将任务加入任务队列 updataQueue.shared.pending
> 5. 最后调度这个任务(scheduleWork)

### render 阶段，构建 workInProgress Fiber 树中的 rootFiber

> 之前通过判断当前任务如果是同步任务就会调用 performSyncWorkOnRoot 同步任务入口方法<br>
> 一旦调用这个方法，就说明正式进入 render 阶段了<br>
> 在 render 阶段，就要在 workInProgress Fiber 树中为每一个元素构建 fiber 对象

#### 1. performSyncWorkOnRoot

> [!important]
> performSyncWorkOnRoot 方法中最核心的就是
> 1. 调用 prepareFreshStack 方法构建 workInProgress Fiber 树及 rootFiber
> 2. 当构建完 rootFiber 就调用 workLoopSync 构建其它 React 元素对应的 Fiber 对象
>   - 该方法执行结束，就代表 workInProgress Fiber 树中的所有节点都构建完成
> 3. 当构建完所有节点，就调用 finishSyncRender
>   - 结束同步渲染阶段
>   - 进入 commit 阶段做真实的 DOM 操作

- 文件位置 packages\react-reconciler\src\ReactFiberWorkLoop.js

```js
// 进入 render 阶段, 构建 workInProgress Fiber 树
function performSyncWorkOnRoot(root) {
  // 参数 root 为 Current Fiber 树中的 fiberRoot 对象

  // 检查是否有过期的还没有执行的任务
  // 如果没有过期的任务 值为 0
  // 初始化渲染没有过期的任务待执行
  const lastExpiredTime = root.lastExpiredTime;
  // NoWork 值为 0
  // 如果有过期的任务 将过期时间设置为 lastExpiredTime 否则将过期时间设置为 Sync
  // 初始渲染过期时间被设置成了 Sync
  const expirationTime = lastExpiredTime !== NoWork ? lastExpiredTime : Sync;

  invariant(
    (executionContext & (RenderContext | CommitContext)) === NoContext,
    'Should not already be working.',
  );

  // 处理 useEffect
  flushPassiveEffects();

  // 如果 root 和 workInProgressRoot（workInProgress Fiber 树中的 fiberRoot） 不相等
  // 说明 workInProgressRoot 不存在, 说明还没有构建 workInProgress Fiber 树
  // workInProgressRoot 为全局变量 默认值为 null, 初始渲染时值为 null
  // expirationTime => 1073741823
  // renderExpirationTime => 0
  // true
  if (root !== workInProgressRoot || expirationTime !== renderExpirationTime) {
    // 构建 workInProgressFiber 树及 rootFiber
    prepareFreshStack(root, expirationTime);
    // 初始渲染不执行 内部条件判断不成立
    startWorkOnPendingInteractions(root, expirationTime);
  }
  // workInProgress 如果不为 null
  if (workInProgress !== null) {
    const prevExecutionContext = executionContext;
    executionContext |= RenderContext;
    const prevDispatcher = pushDispatcher(root);
    const prevInteractions = pushInteractions(root);
    startWorkLoopTimer(workInProgress);
    do {
      try {
        // 以同步的方式开始构建 Fiber 对象
        workLoopSync();
        break;
      } catch (thrownValue) {
        handleError(root, thrownValue);
      }
    } while (true);

    resetContextDependencies();
    executionContext = prevExecutionContext;
    popDispatcher(prevDispatcher);
    if (enableSchedulerTracing) {
      popInteractions(((prevInteractions: any): Set<Interaction>));
    }
    // 初始渲染 不执行
    if (workInProgressRootExitStatus === RootFatalErrored) {
      const fatalError = workInProgressRootFatalError;
      stopInterruptedWorkLoopTimer();
      prepareFreshStack(root, expirationTime);
      markRootSuspendedAtTime(root, expirationTime);
      ensureRootIsScheduled(root);
      throw fatalError;
    }

    if (workInProgress !== null) {
      // 这是一个同步渲染, 所以我们应该完成整棵树
      // 无法提交不完整的 root, 此错误可能是由于React中的错误所致. 请提出问题.
      invariant(
        false,
        'Cannot commit an incomplete root. This error is likely caused by a ' +
          'bug in React. Please file an issue.',
      );
    } else {
      // We now have a consistent tree. Because this is a sync render, we
      // will commit it even if something suspended.
      stopFinishedWorkLoopTimer();
      // 将构建好的新 Fiber 对象存储在 finishedWork 属性中
      // 提交阶段使用
      root.finishedWork = (root.current.alternate: any);
      root.finishedExpirationTime = expirationTime;
      // 结束 render 阶段
      // 进入 commit 阶段
      finishSyncRender(root);
    }

    // Before exiting, make sure there's a callback scheduled for the next
    // pending level.
    ensureRootIsScheduled(root);
  }

  return null;
}
```

##### 1.1 prepareFreshStack

> prepareFreshStack 中构建 workInProgressFiber 树及 rootFiber

> [!warning]
> 主要关注向 fiberRoot 中添加的属性 finishedWork，它表示 render 阶段执行完成后构建的待提交的 fiber 对象
> - 也就是说在 commit 阶段，要处理的就是 root.finishedWork 中存储的 fiber 对象
> - 它表示 render 阶段执行完成后的工作成果

- 文件位置 packages\react-reconciler\src\ReactFiberWorkLoop.js

```js
/**
 * 构建 workInProgressFiber 树及 rootFiber
 */
function prepareFreshStack(root, expirationTime) {
  // 为 FiberRoot 对象添加 finishedWork 属性
  // finishedWork 表示 render 阶段执行完成后构建的待提交的 Fiber 对象
  root.finishedWork = null;
  // 初始化 finishedExpirationTime 值为 0
  root.finishedExpirationTime = NoWork;

  const timeoutHandle = root.timeoutHandle;
  // 初始化渲染不执行 timeoutHandle => -1 noTimeout => -1
  if (timeoutHandle !== noTimeout) {
    // The root previous suspended and scheduled a timeout to commit a fallback
    // state. Now that we have additional work, cancel the timeout.
    root.timeoutHandle = noTimeout;
    // $FlowFixMe Complains noTimeout is not a TimeoutID, despite the check above
    cancelTimeout(timeoutHandle);
  }

  // 初始化渲染不执行 workInProgress 全局变量 初始化为 null
  // false
  if (workInProgress !== null) {
    let interruptedWork = workInProgress.return;
    while (interruptedWork !== null) {
      unwindInterruptedWork(interruptedWork);
      interruptedWork = interruptedWork.return;
    }
  }
  // 建构 workInProgress Fiber 树的 fiberRoot 对象
  workInProgressRoot = root;
  // 构建 workInProgress Fiber 树中的 rootFiber
  // workInProgress 就是每次为 React 元素构建的 fiber 对象
  // 初始渲染时就是 workInProgress Fiber 树中的 rootFiber
  workInProgress = createWorkInProgress(root.current, null);
  renderExpirationTime = expirationTime;
  workInProgressRootExitStatus = RootIncomplete;
  workInProgressRootFatalError = null;
  workInProgressRootLatestProcessedExpirationTime = Sync;
  workInProgressRootLatestSuspenseTimeout = Sync;
  workInProgressRootCanSuspendUsingConfig = null;
  workInProgressRootNextUnprocessedUpdateTime = NoWork;
  workInProgressRootHasPendingPing = false;
  // true
  if (enableSchedulerTracing) {
    spawnedWorkDuringRender = null;
  }
}
```

##### 1.2 createWorkInProgress

- createWorkInProgress 接收的第一个参数 current 表示 Current Fiber 树中的 fiber 对象，初始渲染时就是 rootFiber
- current.alternate 表示 WorkInProgress Fiber 树中对应的 fiber 对象，初始渲染时不存在

> [!info]
> createWorkInProgress 方法主要内容
> 1. 判断 WorkInProgress Fiber 树中是否有对应的 fiber 对象
>   - 如果没有则调用 createFiber 创建一个 fiber 对象
    - createFiber 方法主要接收几个不可复用的属性
> 2. 复用 Current Fiber 树中的信息设置 fiber 对象的属性，并且将两个 Fiber 树中的 fiber 对象进行关联（通过 alternate）
> 3. 返回这个创建好的 workInProgress 的 fiber 对象

- 文件位置 packages\react-reconciler\src\ReactFiber.js

```js
// 构建 workInProgress Fiber 树中的 rootFiber
// 构建完成后会替换 current fiber
// 初始渲染 pendingProps 为 null
export function createWorkInProgress(current: Fiber, pendingProps: any): Fiber {
  // current: current Fiber 中的 rootFiber
  // 获取 current Fiber 对应的 workInProgress Fiber
  let workInProgress = current.alternate;
  // 如果 workInProgress 不存在
  if (workInProgress === null) {
    // 创建 fiber 对象
    workInProgress = createFiber(
      current.tag,
      pendingProps,
      current.key,
      current.mode,
    );
    // 属性复用
    workInProgress.elementType = current.elementType;
    workInProgress.type = current.type;
    workInProgress.stateNode = current.stateNode;

    // 使用 alternate 存储 current
    workInProgress.alternate = current;
    // 使用 alternate 存储 workInProgress
    current.alternate = workInProgress;
  } else {
    workInProgress.pendingProps = pendingProps;

    // We already have an alternate.
    // Reset the effect tag.
    workInProgress.effectTag = NoEffect;

    // The effect list is no longer valid.
    workInProgress.nextEffect = null;
    workInProgress.firstEffect = null;
    workInProgress.lastEffect = null;

    if (enableProfilerTimer) {
      // We intentionally reset, rather than copy, actualDuration & actualStartTime.
      // This prevents time from endlessly accumulating in new commits.
      // This has the downside of resetting values for different priority renders,
      // But works for yielding (the common case) and should support resuming.
      workInProgress.actualDuration = 0;
      workInProgress.actualStartTime = -1;
    }
  }

  workInProgress.childExpirationTime = current.childExpirationTime;
  workInProgress.expirationTime = current.expirationTime;
  workInProgress.child = current.child;
  workInProgress.memoizedProps = current.memoizedProps;
  workInProgress.memoizedState = current.memoizedState;
  workInProgress.updateQueue = current.updateQueue;

  // Clone the dependencies object. This is mutated during the render phase, so
  // it cannot be shared with the current fiber.
  const currentDependencies = current.dependencies;
  workInProgress.dependencies =
    currentDependencies === null
      ? null
      : {
          expirationTime: currentDependencies.expirationTime,
          firstContext: currentDependencies.firstContext,
          responders: currentDependencies.responders,
        };

  // These will be overridden during the parent's reconciliation
  workInProgress.sibling = current.sibling;
  workInProgress.index = current.index;
  workInProgress.ref = current.ref;

  if (enableProfilerTimer) {
    workInProgress.selfBaseDuration = current.selfBaseDuration;
    workInProgress.treeBaseDuration = current.treeBaseDuration;
  }

  return workInProgress;
}
```

##### 1.3 总结

> **<font color=red>当调用 performSyncWorkOnRoot 方法就表示正式进入 render 阶段，构建 workInProgress Fiber 树</font>**

- 在构建 workInProgress Fiber 树的时候
  - 首先构建里面的 rootFiber
  - 然后再构建里面的每个 React 元素对应的 fiber 对象
- performSyncWorkOnRoot 方法
  1. 首先判断是否有过期的未执行的任务，初始渲染阶段没有
  2. 然后判断全局变量 workInProgressRoot 是否有值以此判断是否需要构建 workInProgress Fiber 树
    - 它表示 workInProgress Fiber 树的 fiberRoot，初始渲染时为空
  3. 接着调用 prepareFreshStack 构建 workInProgress Fiber 树
    - 首先给为 Current Fiber 的 fiberRoot（下称 currentRoot） 添加了一个 finishedWork 属性
      - 它存储 render 阶段的工作成果（待提交的 fiber 对象）
    - 然后将 currentRoot 赋值给 workInProgressRoot
    - 然后构建 workInProgress Fiber 树的 rootFiber（下称 workInProgressRootFiber），通过 createFiber 初始化一个 fiber 对象并设置一些属性的值
      - 创建时指定一些属性
      - 其它属性复用 current Fiber 树的 rootfiber 对象（下称 currentRootFiber）中的属性
      - 然后将 currentRootFiber 和 workInProgressRootFiber 通过 alternate 属性进行关联
      - 并最终返回这个创建好的对象，它会被存储到全局变量 workInProgress 中

### render 阶段，workLoopSync 解析

> workInProgress Fiber 树中的 rootFiber 构建完成后，接下来要构建它的子级 fiber 对象了

- 这个子级 fiber 对象就是 render 方法的第一个参数，它在代码走到 workLoopSync 方法时开始被构建
- workLoopSync 就是开启一个循环，以同步的方式开始构建 fiber 对象

#### 1. workLoopSync

> workLoopSync 仅仅开启了一个 while 循环，用于构建 rootFiber 对象的所有子级 fiber 对象

- 文件位置 packages\react-reconciler\src\ReactFiberWorkLoop.js

```js
function workLoopSync() {
  // workInProgress 是一个 fiber 对象
  // 它的值不为 null 意味着该 fiber 对象上仍然有更新要执行
  // while 方法支撑 render 阶段 所有 fiber 节点的构建
  while (workInProgress !== null) {
    workInProgress = performUnitOfWork(workInProgress);
  }
}
```

##### 1.1 performUnitOfWork

> performUnitOfWork 方法用于构建一个 fiber 对象的子级所对应的的 fiber 对象，并返回这个子级的子级，即不断构建 fiber 对象的子级<br>
> 当循环走完，代表所有元素都构建完毕

- 文件位置 packages\react-reconciler\src\ReactFiberWorkLoop.js

```js
// 构建 Fiber 对象
function performUnitOfWork(unitOfWork: Fiber): Fiber | null {
  // unitOfWork => workInProgress Fiber 树中的 rootFiber
  // current => currentFiber 树中的 rootFiber
  const current = unitOfWork.alternate;
  startWorkTimer(unitOfWork);
  // 开发环境执行 忽略
  setCurrentDebugFiberInDEV(unitOfWork);
  // 存储下一个要构建的子级 Fiber 对象
  let next;
  // 初始渲染 不执行
  // false
  if (enableProfilerTimer && (unitOfWork.mode & ProfileMode) !== NoMode) {
    startProfilerTimer(unitOfWork);
    next = beginWork(current, unitOfWork, renderExpirationTime);
    stopProfilerTimerIfRunningAndRecordDelta(unitOfWork, true);
  } else {
    // beginWork: 从父到子, 构建 Fiber 节点对象
    // 返回值 next 为当前节点的子节点
    next = beginWork(current, unitOfWork, renderExpirationTime);
  }
  // 开发环境执行 忽略
  resetCurrentDebugFiberInDEV();
  // 为旧的 props 属性赋值
  // 此次更新后 pendingProps 变为 memoizedProps
  unitOfWork.memoizedProps = unitOfWork.pendingProps;
  // 如果子节点不存在说明当前节点向下遍历子节点已经到底了
  // 继续向上返回 遇到兄弟节点 构建兄弟节点的子 Fiber 对象 直到返回到根 Fiber 对象
  if (next === null) {
    // 从子到父, 构建其余节点 Fiber 对象
    next = completeUnitOfWork(unitOfWork);
  }

  ReactCurrentOwner.current = null;
  return next;
}
```

> [!warning]
> 该方法中重点关注两个方法
> - beginWork：从父到子，构建子级节点 fiber 对象
> - completeUnitOfWork：从子到父，构建其余节点的 fiber 对象

> [!tip]
> 在 React 15 中使用递归的方式完成 fiber 节点的构建，在 React 16 中使用模拟递归的方式完成 fiber 节点的构建

> [!warning]
> 如何模拟的呢
> - beginWork 就类似递归中的递阶段（向下走），completeUnitOfWork 就类似归阶段（往回走）

###### 1.1.1 beginWork

> [!info]
> beginWork 方法在初始渲染时主要看 switch(workInProgress.tag) 的内容：
> - 首次进入的时候 current 是 rootFiber，workInProgress.tag 的值为 3，代表 HostRoot
> - 普通的 React 元素值为 5，代表 HostComponent
> - class 组件值为 1，代表ClassComponent
> - 函数组件在第一次渲染的时候为 2，代表 IndeterminateComponent，第二次渲染的时候（即下次更新时）才为 0，代表 FunctionComponent

- 文件位置 packages\react-reconciler\src\ReactFiberBeginWork.js
```js
// 从父到子, 构建 Fiber 节点对象
function beginWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderExpirationTime: ExpirationTime,
): Fiber | null {
  // 1073741823
  const updateExpirationTime = workInProgress.expirationTime;

  // 判断是否有旧的 Fiber 对象
  // 初始渲染时 只有 rootFiber 节点存在 current
  if (current !== null) {
    /* 暂不关心 */
  } else {
    didReceiveUpdate = false;
  }

  // NoWork 常量 值为0 清空过期时间
  workInProgress.expirationTime = NoWork;
  // 根据当前 Fiber 的类型决定如何构建起子级 Fiber 对象
  // 文件位置: shared/ReactWorkTags.js
  switch (workInProgress.tag) {
    // 2
    // 函数组件在第一次被渲染时使用
    case IndeterminateComponent: {
      return mountIndeterminateComponent(
        // 旧 Fiber
        current,
        // 新 Fiber
        workInProgress,
        // 新 Fiber 的 type 值 初始渲染时是App组件函数
        workInProgress.type,
        // 同步 整数最大值 1073741823
        renderExpirationTime,
      );
    }
    // 16
    case LazyComponent: {
      const elementType = workInProgress.elementType;
      return mountLazyComponent(
        current,
        workInProgress,
        elementType,
        updateExpirationTime,
        renderExpirationTime,
      );
    }
    // 0
    case FunctionComponent: {
      const Component = workInProgress.type;
      const unresolvedProps = workInProgress.pendingProps;
      const resolvedProps =
        workInProgress.elementType === Component
          ? unresolvedProps
          : resolveDefaultProps(Component, unresolvedProps);
      return updateFunctionComponent(
        current,
        workInProgress,
        Component,
        resolvedProps,
        renderExpirationTime,
      );
    }
    // 1
    case ClassComponent: {
      const Component = workInProgress.type;
      const unresolvedProps = workInProgress.pendingProps;
      const resolvedProps =
        workInProgress.elementType === Component
          ? unresolvedProps
          : resolveDefaultProps(Component, unresolvedProps);
      return updateClassComponent(
        current,
        workInProgress,
        Component,
        resolvedProps,
        renderExpirationTime,
      );
    }
    // 3
    case HostRoot:
      return updateHostRoot(current, workInProgress, renderExpirationTime);
    // 5
    case HostComponent:
      return updateHostComponent(current, workInProgress, renderExpirationTime);
    // 6
    case HostText:
      return updateHostText(current, workInProgress);
    // 13
    case SuspenseComponent:
      return updateSuspenseComponent(
        current,
        workInProgress,
        renderExpirationTime,
      );
    // 4
    case HostPortal:
      return updatePortalComponent(
        current,
        workInProgress,
        renderExpirationTime,
      );
    // 11
    case ForwardRef: {
      const type = workInProgress.type;
      const unresolvedProps = workInProgress.pendingProps;
      const resolvedProps =
        workInProgress.elementType === type
          ? unresolvedProps
          : resolveDefaultProps(type, unresolvedProps);
      return updateForwardRef(
        current,
        workInProgress,
        type,
        resolvedProps,
        renderExpirationTime,
      );
    }
    // 7
    case Fragment:
      return updateFragment(current, workInProgress, renderExpirationTime);
    // 8
    case Mode:
      return updateMode(current, workInProgress, renderExpirationTime);
    // 12
    case Profiler:
      return updateProfiler(current, workInProgress, renderExpirationTime);
    // 10
    case ContextProvider:
      return updateContextProvider(
        current,
        workInProgress,
        renderExpirationTime,
      );
    // 9
    case ContextConsumer:
      return updateContextConsumer(
        current,
        workInProgress,
        renderExpirationTime,
      );
    // 14
    case MemoComponent: {
      const type = workInProgress.type;
      const unresolvedProps = workInProgress.pendingProps;
      // Resolve outer props first, then resolve inner props.
      let resolvedProps = resolveDefaultProps(type, unresolvedProps);
      
      resolvedProps = resolveDefaultProps(type.type, resolvedProps);
      return updateMemoComponent(
        current,
        workInProgress,
        type,
        resolvedProps,
        updateExpirationTime,
        renderExpirationTime,
      );
    }
    // 15
    case SimpleMemoComponent: {
      return updateSimpleMemoComponent(
        current,
        workInProgress,
        workInProgress.type,
        workInProgress.pendingProps,
        updateExpirationTime,
        renderExpirationTime,
      );
    }
    // 17
    case IncompleteClassComponent: {
      const Component = workInProgress.type;
      const unresolvedProps = workInProgress.pendingProps;
      const resolvedProps =
        workInProgress.elementType === Component
          ? unresolvedProps
          : resolveDefaultProps(Component, unresolvedProps);
      return mountIncompleteClassComponent(
        current,
        workInProgress,
        Component,
        resolvedProps,
        renderExpirationTime,
      );
    }
    // 19
    case SuspenseListComponent: {
      return updateSuspenseListComponent(
        current,
        workInProgress,
        renderExpirationTime,
      );
    }
    // 20
    case FundamentalComponent: {
      if (enableFundamentalAPI) {
        return updateFundamentalComponent(
          current,
          workInProgress,
          renderExpirationTime,
        );
      }
      break;
    }
    // 21
    case ScopeComponent: {
      if (enableScopeAPI) {
        return updateScopeComponent(
          current,
          workInProgress,
          renderExpirationTime,
        );
      }
      break;
    }
    // 22
    case Block: {
      if (enableBlocksAPI) {
        const block = workInProgress.type;
        const props = workInProgress.pendingProps;
        return updateBlock(
          current,
          workInProgress,
          block,
          props,
          renderExpirationTime,
        );
      }
      break;
    }
  }
  invariant(
    false,
    'Unknown unit of work tag (%s). This error is likely caused by a bug in ' +
      'React. Please file an issue.',
    workInProgress.tag,
  );
}
```

**updateHostRoot**

1. 首先获取更新队列
2. 然后获取组件的一些信息（由于是初始化渲染，所以这些都是 null）
  - 新的 props 对象
  - 组件上一次更新后的 state
  - 上一次组件渲染的 children
3. 浅拷贝更新队列，防止引用属性互相影响
4. 获取要更新的 element，即 workInProgress 的子级
  - 之前 updateContainer 方法中把要更新的内容（element）存储到更新任务对象的 payload 上
  - 这里调用的 processUpdateQueue 方法处理更新队列，主要做了：
    1. 先通过 updateQueue.shared.pending 获取当前要执行的更新任务对象 update
    2. 然后获取 update.payload ，它是要更新的元素 element，即 rootFiber 的子级，并最终赋值到 workInProgress.memoizedState
  - 接着通过 workInProgress.memoizedState 获取 element
  - 使用这个 element 构建它的 fiber 对象，初始渲染时，就是 render 方法的第一个参数表示的 React 元素对象
5. 在经过一系列条件判断后，调用 reconcileChildren 构建 element 对应的 fiber 对象
6. 当构建完成后，会将这个 fiber 对象添加到 workInProgress.child 属性中，即 rootFiber 对象的子级
7. 最后返回 workInProgress.child，使得下次循环去构建 workInProgress.child 的子级节点的 fiber 对象

- 文件位置 packages\react-reconciler\src\ReactFiberBeginWork.js

```js
// 更新 hostRoot
// <div id="root"></div> 对应的 Fiber 对象
function updateHostRoot(current, workInProgress, renderExpirationTime) {
  pushHostRootContext(workInProgress);
  // 获取更新队列
  const updateQueue = workInProgress.updateQueue;

  invariant(
    current !== null && updateQueue !== null,
    'If the root does not have an updateQueue, we should have already ' +
      'bailed out. This error is likely caused by a bug in React. Please ' +
      'file an issue.',
  );

  // 获取新的 props 对象 null
  const nextProps = workInProgress.pendingProps;
  // 获取上一次渲染使用的 state null
  const prevState = workInProgress.memoizedState;
  // 获取上一次渲染使用的 children null
  const prevChildren = prevState !== null ? prevState.element : null;
  // 浅复制更新队列, 防止引用属性互相影响
  // workInProgress.updateQueue 浅拷贝 current.updateQueue
  cloneUpdateQueue(current, workInProgress);
  // 获取 updateQueue.payload 并赋值到 workInProgress.memoizedState
  // 要更新的内容就是 element 就是 rootFiber 的子元素
  processUpdateQueue(workInProgress, nextProps, null, renderExpirationTime);
  // 获取 element 所在对象
  const nextState = workInProgress.memoizedState;
  // 从对象中获取 element
  const nextChildren = nextState.element;
  // 在计算 state 后如果前后两个 Children 相同的情况
  // prevChildren => null
  // nextState => App
  // 初始渲染时为 false
  if (nextChildren === prevChildren) {
   /*...*/
  }
  // 获取 fiberRoot 对象
  const root: FiberRoot = workInProgress.stateNode;
  // 服务器端渲染走 if
  if (root.hydrate && enterHydrationState(workInProgress)) {
    /*...*/
  } else {
    // 客户端渲染走 else
    // 构建子节点 fiber 对象
    reconcileChildren(
      current,
      workInProgress,
      nextChildren,
      renderExpirationTime,
    );
    resetHydrationState();
  }

  // 返回子节点 fiber 对象
  return workInProgress.child;
}
```

**reconcileChildren**

- 构建子元素的 fiber 对象

```js
// 构建子级 Fiber 对象
export function reconcileChildren(
  // 旧 Fiber
  current: Fiber | null,
  // 父级 Fiber
  workInProgress: Fiber,
  // 子级 vdom 对象
  nextChildren: any,
  // 初始渲染 整型最大值 代表同步任务
  renderExpirationTime: ExpirationTime,
) {
  /**
   * 为什么要传递 current ?
   * 如果不是初始渲染的情况, 要进行新旧 Fiber 对比
   * 初始渲染时则用不到 current
   */
  // 如果就 Fiber 为 null 表示初始渲染
  if (current === null) {
    workInProgress.child = mountChildFibers(
      workInProgress,
      null,
      nextChildren,
      renderExpirationTime,
    );
  } else {
    // 否则就是更新
    // If the current child is the same as the work in progress, it means that
    // we haven't yet started any work on these children. Therefore, we use
    // the clone algorithm to create a copy of all the current children.

    // If we had any progressed work already, that is invalid at this point so
    // let's throw it out.
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current.child,
      nextChildren,
      renderExpirationTime,
    );
  }
}
```

**mountChildFibers**

- mountChildFibers 方法就是真正构建 nextChildren 所对应的 fiber 对象的方法
- 该方法是 ChildReconciler(false) 方法返回的结果

```js
/**
 * ChildReconciler 接收的参数：shouldTrackSideEffects 标识, 是否为每个 Fiber 对象添加 effectTag
 * true 添加 false 不添加
 * 对于初始渲染来说, 只有根组件需要添加, 其他元素不需要添加, 防止过多的 DOM 操作
 */
// 用于更新
export const reconcileChildFibers = ChildReconciler(true);
// 用于初始渲染
export const mountChildFibers = ChildReconciler(false);
```

- ChildReconciler 接收一个参数 shouldTrackSideEffects，表示是否为每个 fiber 对象添加 effectTag
- effectTag 标识当前的 fiber 对象对应的 DOM 对象要进行的操作
  1. 更新操作要为每个 fiber 对象添加 effectTag
    - 每构建一个 fiber 对象，都进行一次 DOM 操作
  2. 初始渲染只需要为根组件添加effectTag 属性，其它元素不需要添加
    - 这是为了防止过多的 DOM 操作
    - 初始渲染只需要在内存中构建 DOM 树
    - 构建完成后只需要把根组件插入到页面中，只有一次操作即可

**ChildReconciler**

- ChildReconciler 这个方法中定义了很多方法，但最终返回的是 reconcileChildFibers
- 文件位置 packages\react-reconciler\src\ReactChildFiber.js

```js
function ChildReconciler(shouldTrackSideEffects) {
  /* 其它 function 的定义 */
  function reconcileChildFibers(/*...*/) {/*...*/}
  return reconcileChildFibers;
}
```

**reconcileChildFibers**

```js
function reconcileChildFibers(
  // 父 Fiber 对象
  returnFiber: Fiber,
  // 旧的第一个子 Fiber 初始渲染 null
  currentFirstChild: Fiber | null,
  // 新的子 vdom 对象
  newChild: any,
  // 初始渲染 整型最大值 代表同步任务
  expirationTime: ExpirationTime,
): Fiber | null {
  // 这是入口方法, 根据 newChild 类型进行对应处理

  // 判断新的子 vdom 是否为占位组件 比如 <></>
  // false
  const isUnkeyedTopLevelFragment =
    typeof newChild === 'object' &&
    newChild !== null &&
    newChild.type === REACT_FRAGMENT_TYPE &&
    newChild.key === null;

  // 如果 newChild 为占位符, 使用 占位符组件的子元素作为 newChild
  if (isUnkeyedTopLevelFragment) {
    newChild = newChild.props.children;
  }

  // 检测 newChild 是否为对象类型
  const isObject = typeof newChild === 'object' && newChild !== null;

  // newChild 是单个对象的情况
  if (isObject) {
    // 匹配子元素的类型
    switch (newChild.$$typeof) {
      // 子元素为 ReactElement
      case REACT_ELEMENT_TYPE:
        // 为 Fiber 对象设置 effectTag 属性
        // 返回创建好的子 Fiber
        return placeSingleChild(
          // 处理单个 React Element 的情况
          // 内部会调用其他方法创建对应的 Fiber 对象
          reconcileSingleElement(
            returnFiber,
            currentFirstChild,
            newChild,
            expirationTime,
          ),
        );
      // 暂不关心
      case REACT_PORTAL_TYPE:
        return placeSingleChild(
          reconcileSinglePortal(
            returnFiber,
            currentFirstChild,
            newChild,
            expirationTime,
          ),
        );
    }
  }
  // 处理 children 为文本和数值的情况
  if (typeof newChild === 'string' || typeof newChild === 'number') {
    return placeSingleChild(
      reconcileSingleTextNode(
        returnFiber,
        currentFirstChild,
        // 如果 newChild 是数值, 转换为字符串
        '' + newChild,
        expirationTime,
      ),
    );
  }

  // children 是数组的情况
  if (isArray(newChild)) {
    // 返回创建好的子 Fiber
    return reconcileChildrenArray(
      returnFiber,
      currentFirstChild,
      newChild,
      expirationTime,
    );
  }

  if (getIteratorFn(newChild)) {
    return reconcileChildrenIterator(
      returnFiber,
      currentFirstChild,
      newChild,
      expirationTime,
    );
  }

  if (isObject) {
    throwOnInvalidObjectType(returnFiber, newChild);
  }

  if (typeof newChild === 'undefined' && !isUnkeyedTopLevelFragment) {
    // If the new child is undefined, and the return fiber is a composite
    // component, throw an error. If Fiber return types are disabled,
    // we already threw above.
    switch (returnFiber.tag) {
      case ClassComponent: {
        if (__DEV__) {
          const instance = returnFiber.stateNode;
          if (instance.render._isMockFunction) {
            // We allow auto-mocks to proceed as if they're returning null.
            break;
          }
        }
      }
      // Intentionally fall through to the next case, which handles both
      // functions and classes
      // eslint-disable-next-lined no-fallthrough
      case FunctionComponent: {
        const Component = returnFiber.type;
        invariant(
          false,
          '%s(...): Nothing was returned from render. This usually means a ' +
            'return statement is missing. Or, to render nothing, ' +
            'return null.',
          Component.displayName || Component.name || 'Component',
        );
      }
    }
  }

  // Remaining cases are all treated as empty.
  return deleteRemainingChildren(returnFiber, currentFirstChild);
}
```

- 首先判断是否是占位组件
  - 如果是占位组件则不需要处理它，而是处理它的子元素
- newChild 就是 createElement 中接收的子元素，它可以是：
  - 文本或数值
  - 对象：
    - 如果只有一个子元素，则是一个对象
      - 最终调用 reconcileSingleElement 创建 fiber 对象
    - 如果有多个子元素，则是一个数组

**reconcileSingleElement 处理子元素是单个对象的情况**

```js
// 处理子元素是单个对象的情况
function reconcileSingleElement(
  // 父 Fiber 对象
  returnFiber: Fiber,
  // 备份子 fiber
  currentFirstChild: Fiber | null,
  // 子 vdom 对象
  element: ReactElement,
  expirationTime: ExpirationTime,
): Fiber {
  const key = element.key;
  let child = currentFirstChild;
  // 初始渲染 currentFirstChild 为 null
  // false
  while (child !== null) {
    /*...*/
  }
  // 查看子 vdom 对象是否表示 fragment
  // false
  if (element.type === REACT_FRAGMENT_TYPE) {
    const created = createFiberFromFragment(
      element.props.children,
      returnFiber.mode,
      expirationTime,
      element.key,
    );
    created.return = returnFiber;
    return created;
  } else {
    // 根据 React Element 创建 Fiber 对象
    // 返回创建好的 Fiber 对象
    const created = createFiberFromElement(
      element,
      // 用来表示当前组件下的所有子组件要用处于何种渲染模式
      // 文件位置: ./ReactTypeOfMode.js
      // 0    同步渲染模式
      // 100  异步渲染模式
      returnFiber.mode,
      expirationTime,
    );
    // 添加 ref 属性 { current: DOM }
    created.ref = coerceRef(returnFiber, currentFirstChild, element);
    // 添加父级 Fiber 对象
    created.return = returnFiber;
    // 返回创建好的子 Fiber
    return created;
  }
}
```

- 初始渲染时 reconcileSingleElement 接收的 currentFirstChild 为空，不会进入 while 渲染
- 接着判断是否是 Fragment：
  - 如果是则调用 createFiberFromFragment 创建 fiber 对象
  - 如果不是，则调用 createFiberFromElement 创建 fiber 对象
    - 并设置了这个 fiber 的 ref 属性
- 在创建完 fiber 对象后还为它们添加父级 fiber 对象 return
- 并最终返回创建的这个 fiber 对象

**reconcileChildrenArray 处理子元素是数组的情况（多个子元素）**

- 该方法主要关注两点：
  - 子元素是数组，所以要循环获取数组中的每个子元素，去构建所有子元素的 fiber 对象
  - 构建子元素与子元素、父元素之间的关系：
    - 第一个子元素被设置为父元素的 child
    - 其它子元素是上一个子元素的兄弟节点 sibling

```js
// 处理子元素是数组的情况
function reconcileChildrenArray(
  // 父级 Fiber
  returnFiber: Fiber,
  currentFirstChild: Fiber | null,
  // 子级 vdom 数组
  newChildren: Array<*>,
  expirationTime: ExpirationTime,
): Fiber | null {
  /**
   * 存储第一个子节点 Fiber 对象
   * 方法返回的也是第一个子节点 Fiber 对象
   * 因为其他子节点 Fiber 对象都存储在上一个子 Fiber 节点对象的 sibling 属性中
   */
  let resultingFirstChild: Fiber | null = null;
  // 上一次创建的 Fiber 对象
  let previousNewFiber: Fiber | null = null;
  // 初始渲染没有旧的子级 所以为 null
  let oldFiber = currentFirstChild;

  let lastPlacedIndex = 0;
  let newIdx = 0;
  let nextOldFiber = null;
  // 初始渲染 oldFiber 为 null 循环不执行
  for (; oldFiber !== null && newIdx < newChildren.length; newIdx++) {
    /*...*/
  }
  // 初始渲染不执行
  if (newIdx === newChildren.length) {
    /*...*/
  }

  // oldFiber 为空 说明是初始渲染
  if (oldFiber === null) {
    // 遍历子 vdom 对象
    for (; newIdx < newChildren.length; newIdx++) {
      // 创建子 vdom 对应的 fiber 对象
      const newFiber = createChild(
        returnFiber,
        newChildren[newIdx],
        expirationTime,
      );
      // 如果 newFiber 为 null
      if (newFiber === null) {
        // 进入下次循环
        continue;
      }
      // 初始渲染时只为 newFiber 添加了 index 属性,
      // 其他事没干. lastPlacedIndex 被原封不动的返回了
      lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
      // 为当前节点设置下一个兄弟节点
      if (previousNewFiber === null) {
        // 存储第一个子 Fiber 发生在第一次循环时
        resultingFirstChild = newFiber;
      } else {
        // 为节点设置下一个兄弟 Fiber
        previousNewFiber.sibling = newFiber;
      }
      // 在循环的过程中更新上一个创建的Fiber 对象
      previousNewFiber = newFiber;
    }
    // 返回创建好的子 Fiber
    // 其他 Fiber 都作为 sibling 存在
    return resultingFirstChild;
  }
  // 下面的代码初始渲染不执行
  /*...*/
}
```

###### 1.1.2 子级 fiber 节点的构建流程总结

> [!important]
> 反向查看构建的子级 fiber 对象的走向
> 1. 首先在 reconcileChildren 中调用 mountChildFibers 方法，构建 workInProgress 的子级的 fiber 对象，然后存储到 workInProgress.child
> 2. workInProgress 又是 updateHostRoot 中调用 reconcileChildren 传入的，updateHostRoot 最终又返回了构建的子级 fiber 对象workInProgress.child
> 3. updateHostRoot 是 beginWork 中构建最外层元素的时候调用的，workInProgress 继续从这里传递
> 4. beginWork 是 performUnitOfWork 方法中从父到子构建子级的时候调用的，并传递了 workInProgress，将构建的子级 fiber 对象存储到 next
>   - 如果 next 不为空，则返回这个子级 fiber 对象
>   - 如果 next 为空，则表示当前构建的节点没有子级，于是调用 completeUnitOfWork 从子到父，构建它的兄弟节点
>   - 并最终返回这个 next
> 5. performUnitOfWork 是 workLoopSync的while 循环中调用的，每次都会将调用结果（即构建的子级 fiber 对象）更新到 workInProgress，进入下一次构建循环，再次调用 performUnitOfWork 构建子级的子级，如果workInProgress为空，则表示所有节点都构建完成

###### 1.1.3 completeUnitOfWork

- completeUnitOfWork，这是从子到父，构建其余节点的 fiber 对象，是递归的「归」阶段
- completeUnitOfWork 不仅仅是构建其余节点的 fiber 对象，它在从子级到父级的过程中会经过每一个 fiber 节点对象，主要完成的事情包括：
  1. 构建其余节点的 fiber 对象
  2. 为每个 fiber 节点对象构建对应的真实 DOM 对象，并添加到 stateNode 属性中
  3. 收集要执行 DOM 操作的 fiber 节点，组建 effect 链表结构
    - 过程中，不断收集当前 fiber 对象要执行 DOM 操作的子 fiber
    - 最后将所有要执行 DOM 操作的 fiber 节点对象都挂载到顶层 rootFiber 对象中

**completeUnitOfWork**

- 文件位置 packages\react-reconciler\src\ReactFiberWorkLoop.js

```js
/**
 * 1. 创建 Fiber 对象
 * 2. 创建每一个节点的真实 DOM 对象并将其添加到 stateNode 属性中
 * 3. 收集要执行 DOM 操作的 Fiber 节点, 组建 effect 链表结构
 */
function completeUnitOfWork(unitOfWork: Fiber): Fiber | null {
  // 为 workInProgress 全局变量重新赋值
  workInProgress = unitOfWork;
  do {
    // 获取备份节点
    // 初始化渲染 非根 Fiber 对象没有备份节点 所以 current 为 null
    const current = workInProgress.alternate;
    // 父级 Fiber 对象, 非根 Fiber 对象都有父级
    const returnFiber = workInProgress.return;
    // 判断传入的 Fiber 对象是否构建完成, 任务调度相关
    // & 是表示位的与运算, 把左右两边的数字转化为二进制
    // 然后每一位分别进行比较, 如果相等就为1, 不相等即为0
    // 此处应用"位与"运算符的目的是"清零"
    // true
    if ((workInProgress.effectTag & Incomplete) === NoEffect) {
      // 开发环境代码 忽略
      setCurrentDebugFiberInDEV(workInProgress);
      let next;
      // 如果不能使用分析器的 timer, 直接执行 completeWork
      // enableProfilerTimer => true
      // 但此处无论条件是否成立都会执行 completeWork
      if (
        !enableProfilerTimer ||
        (workInProgress.mode & ProfileMode) === NoMode
      ) {
        // 重点代码(二)
        // 创建节点真实 DOM 对象并将其添加到 stateNode 属性中
        next = completeWork(current, workInProgress, renderExpirationTime);
      } else {
        // 否则执行分析器timer, 并执行 completeWork
        startProfilerTimer(workInProgress);
        // 创建节点真实 DOM 对象并将其添加到 stateNode 属性中
        next = completeWork(current, workInProgress, renderExpirationTime);
        // Update render duration assuming we didn't error.
        stopProfilerTimerIfRunningAndRecordDelta(workInProgress, false);
      }
      stopWorkTimer(workInProgress);
      resetCurrentDebugFiberInDEV();
      resetChildExpirationTime(workInProgress);
      // 重点代码(一)
      // 如果子级存在
      if (next !== null) {
        // 返回子级 一直返回到 workLoopSync
        // 再重新执行 performUnitOfWork 构建子级 Fiber 节点对象
        return next;
      }

      // 构建 effect 链表结构
      // 如果不是根 Fiber 就是 true 否则就是 false
      // 将子树和此 Fiber 的所有 effect 附加到父级的 effect 列表中
      if (
        // 如果父 Fiber 存在 并且
        returnFiber !== null &&
        // 父 Fiber 对象中的 effectTag 为 0
        (returnFiber.effectTag & Incomplete) === NoEffect
      ) {
        // 将子树和此 Fiber 的所有副作用附加到父级的 effect 列表上

        // 以下两个判断的作用是搜集子 Fiber的 effect 到父 Fiber
        if (returnFiber.firstEffect === null) {
          // first
          returnFiber.firstEffect = workInProgress.firstEffect;
        }

        if (workInProgress.lastEffect !== null) {
          if (returnFiber.lastEffect !== null) {
            // next
            returnFiber.lastEffect.nextEffect = workInProgress.firstEffect;
          }
          // last
          returnFiber.lastEffect = workInProgress.lastEffect;
        }

        // 获取副作用标记
        // 初始渲染时除[根组件]以外的 Fiber, effectTag 值都为 0, 即不需要执行任何真实DOM操作
        // 根组件的 effectTag 值为 3, 即需要将此节点对应的真实DOM对象添加到页面中
        const effectTag = workInProgress.effectTag;

        // 创建 effect 列表时跳过 NoWork(0) 和 PerformedWork(1) 标记
        // PerformedWork 由 React DevTools 读取, 不提交
        // 初始渲染时 只有遍历到了根组件 判断条件才能成立, 将 effect 链表添加到 rootFiber
        // 初始渲染 FiberRoot 对象中的 firstEffect 和 lastEffect 都是 App 组件
        // 因为当所有节点在内存中构建完成后, 只需要一次将所有 DOM 添加到页面中
        if (effectTag > PerformedWork) {
          // false
          if (returnFiber.lastEffect !== null) {
            returnFiber.lastEffect.nextEffect = workInProgress;
          } else {
            // 为 fiberRoot 添加 firstEffect
            returnFiber.firstEffect = workInProgress;
          }
          // 为 fiberRoot 添加 lastEffect
          returnFiber.lastEffect = workInProgress;
        }
      }
    } else {
      // 初始渲染不执行
      // This fiber did not complete because something threw. Pop values off
      // the stack without entering the complete phase. If this is a boundary,
      // capture values if possible.
      const next = unwindWork(workInProgress, renderExpirationTime);

      // Because this fiber did not complete, don't reset its expiration time.

      if (
        enableProfilerTimer &&
        (workInProgress.mode & ProfileMode) !== NoMode
      ) {
        // Record the render duration for the fiber that errored.
        stopProfilerTimerIfRunningAndRecordDelta(workInProgress, false);

        // Include the time spent working on failed children before continuing.
        let actualDuration = workInProgress.actualDuration;
        let child = workInProgress.child;
        while (child !== null) {
          actualDuration += child.actualDuration;
          child = child.sibling;
        }
        workInProgress.actualDuration = actualDuration;
      }

      if (next !== null) {
        // If completing this work spawned new work, do that next. We'll come
        // back here again.
        // Since we're restarting, remove anything that is not a host effect
        // from the effect tag.
        // TODO: The name stopFailedWorkTimer is misleading because Suspense
        // also captures and restarts.
        stopFailedWorkTimer(workInProgress);
        next.effectTag &= HostEffectMask;
        return next;
      }
      stopWorkTimer(workInProgress);

      if (returnFiber !== null) {
        // Mark the parent fiber as incomplete and clear its effect list.
        returnFiber.firstEffect = returnFiber.lastEffect = null;
        returnFiber.effectTag |= Incomplete;
      }
    }
    // 获取下一个同级 Fiber 对象
    const siblingFiber = workInProgress.sibling;
    // 如果下一个同级 Fiber 对象存在
    if (siblingFiber !== null) {
      // 返回下一个同级 Fiber 对象
      return siblingFiber;
    }
    // 否则退回父级
    workInProgress = returnFiber;
  } while (workInProgress !== null);

  // 当执行到这里的时候, 说明遍历到了 root 节点, 已完成遍历
  // 更新 workInProgressRootExitStatus 的状态为 已完成
  if (workInProgressRootExitStatus === RootIncomplete) {
    workInProgressRootExitStatus = RootCompleted;
  }
  return null;
}
```

**从子到父的流程**

> [!important]
> 该方法整体就是一个 `do...while` 循环
> - 在循环中首先判断是否有子级
>   - 如果有子级，就返回子级所对应的 fiber 对象，去构建子级的子级
>   - 如果没有子级，就会判断是否有同级
>     - 如果有同级，就返回同级，去构建同级的子级
>     - 如果没有同级，就会返回父级，判断父级是否有同级
>       - 如果父级有同级，就返回父级的同级，去构建它的子级
>       - 如果父级没有同级，返回父级的父级，依次向上直到 rootFiber

- 相关代码：

```js
function completeUnitOfWork(unitOfWork: Fiber): Fiber | null {
  // 为 workInProgress 全局变量重新赋值
  workInProgress = unitOfWork;
  do {
    /* if_else start*/
    // 如果子级存在
    if (next !== null) {
      // 返回子级 一直返回到 workLoopSync
      // 再重新执行 performUnitOfWork 构建子级 Fiber 节点对象
      return next;
    }
    /* if_else end*/
    
    // 获取下一个同级 Fiber 对象
    const siblingFiber = workInProgress.sibling;
    // 如果下一个同级 Fiber 对象存在
    if (siblingFiber !== null) {
      // 返回下一个同级 Fiber 对象
      return siblingFiber;
    }
    
    // 否则退回父级
    workInProgress = returnFiber;
  } while (workInProgress !== null);
}
```

**调用 completeWork 创建节点真实 DOM 对象并将其添加到 stateNode 属性中**

```js
// 创建节点真实 DOM 对象并将其添加到 stateNode 属性中
next = completeWork(current, workInProgress, renderExpirationTime);
```

- completeWork 内部就是一个 switch，匹配当前节点的类型 tag
- 因为并不是所有的 fiber 节点，都能创建对应的 DOM 对象，例如最先判断的一些类型，直接返回 null
  - ClassComponent 类组件
  - HostRoot root 节点
  - HostComponent 普通的 React 元素
  - 等

> [!warning]
> 解析下普通 React 元素的处理：
> 1. 最终会调用 createInstance方法，创建当前节点的实例对象，即真实的 DOM 对象
> 2. 然后调用 appendAllChildren 构建当前节点所有子级的真实 DOM 对象，追加到当前节点中
> 3. 当构建完 DOM 对象后，将当前节点的 DOM 对象添加到 fiber 对象的 stateNode 属性中

- 文件位置 packages\react-reconciler\src\ReactFiberCompleteWork.js

```js
// 
function completeWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderExpirationTime: ExpirationTime,
): Fiber | null {
  // 获取待更新 props
  const newProps = workInProgress.pendingProps;
  switch (workInProgress.tag) {
    case IndeterminateComponent:
    case LazyComponent:
    case SimpleMemoComponent:
    // 0
    case FunctionComponent:
    case ForwardRef:
    case Fragment:
    case Mode:
    case Profiler:
    case ContextConsumer:
    case MemoComponent:
      return null;
    case ClassComponent:/*...*/
    // 3
    case HostRoot:/*...*/
    // 5
    case HostComponent: {
      popHostContext(workInProgress);
      // 获取 rootDOM 节点 <div id="root"></div>
      const rootContainerInstance = getRootHostContainer();
      // 节点的具体的类型 div span ...
      const type = workInProgress.type;
      // 初始渲染不执行 current = null
      if (current !== null && workInProgress.stateNode != null) {
        /*...*/
      } else {
        /*...*/
        // 服务器渲染相关 初始渲染为不执行
        // false
        if (wasHydrated) {
          /*...*/
        } else {
          // 创建节点实例对象 <div></div> <span></span>
          let instance = createInstance(
            type,
            newProps,
            rootContainerInstance,
            currentHostContext,
            workInProgress,
          );
          /**
           * 将所有的子级追加到父级中
           * instance 为父级
           * workInProgress.child 为子级
           */
          appendAllChildren(instance, workInProgress, false, false);

          // 为 Fiber 对象添加 stateNode 属性
          workInProgress.stateNode = instance;
          // 初始渲染不执行
          // false
          if (enableDeprecatedFlareAPI) {
            const listeners = newProps.DEPRECATED_flareListeners;
            if (listeners != null) {
              updateDeprecatedEventListeners(
                listeners,
                workInProgress,
                rootContainerInstance,
              );
            }
          }

          /*...*/
        }
        // 处理 ref DOM 引用
        if (workInProgress.ref !== null) {
          // If there is a ref on a host node we need to schedule a callback
          markRef(workInProgress);
        }
      }
      return null;
    }
    // 6
    case HostText:/*...*/
    case SuspenseComponent:/*...*/
    case HostPortal:/*...*/
    case ContextProvider:/*...*/
    case IncompleteClassComponent:/*...*/
    case SuspenseListComponent:/*...*/
    case FundamentalComponent:/*...*/
    case ScopeComponent:/*...*/
    case Block:/*...*/
  }
}
```

**appendAllChildren**

- 获取当前节点的子级节点，进入 while 循环
- 判断是否是普通元素或文本节点
  - 如果是，调用 appendInitialChild 将子级追加到父级中
  - 如果不是，则将其视为组件，获取组件的第一个子元素，进入下一个循环
    - 组件本身不能转换为真实 DOM 元素
- 子级追加到父级后，判断是否有兄弟节点
  - 如果有，给兄弟节点指定父节点 return，并获取兄弟节点，进入下一个循环
  - 如果没有，则判断是否有父级，或父级为最初传入的节点
    - 如果满足条件，则表示已将所有子级追加到父级中
    - 如果不满足，则可能是组件，获取当前节点的父节点，继续判断它的兄弟节点
- 文件位置 packages\react-reconciler\src\ReactFiberCompleteWork.js

```js
// 
// 将所有子级追到到父级中
appendAllChildren = function (
parent: Instance,
 workInProgress: Fiber,
 needsVisibilityToggle: boolean,
 isHidden: boolean,
) {
  // 获取子级
  let node = workInProgress.child;
  // 如果子级不为空 执行循环
  while (node !== null) {
    // 如果 node 是普通 ReactElement 或者为文本
    if (node.tag === HostComponent || node.tag === HostText) {
      // 将子级追加到父级中
      appendInitialChild(parent, node.stateNode);
    } else if (enableFundamentalAPI && node.tag === FundamentalComponent) {
      appendInitialChild(parent, node.stateNode.instance);
    } else if (node.tag === HostPortal) {
      // If we have a portal child, then we don't want to traverse
      // down its children. Instead, we'll get insertions from each child in
      // the portal directly.
    } else if (node.child !== null) {
      // 如果 node 不是普通 ReactElement 又不是文本
      // 将 node 视为组件, 组件本身不能转换为真实 DOM 元素
      // 获取到组件的第一个子元素, 继续执行循环
      node.child.return = node;
      node = node.child;
      continue;
    }
    // 如果 node 和 workInProgress 是同一个节点
    // 说明 node 已经退回到父级 终止循环
    // 说明此时所有子级都已经追加到父级中了
    if (node === workInProgress) {
      return;
    }
    // 处理子级节点的兄弟节点
    while (node.sibling === null) {
      // 如果节点没有父级或者节点的父级是自己, 退出循环
      // 说明此时所有子级都已经追加到父级中了
      if (node.return === null || node.return === workInProgress) {
        return;
      }
      // 更新 node
      node = node.return;
    }
    // 更新父级 方便回退
    node.sibling.return = node.return;
    // 将 node 更新为下一个兄弟节点
    node = node.sibling;
  }
};
```

**收集所有要执行 DOM 操作的 fiber 节点对象**

- React 是使用一个链表结构收集所有要执行 DOM 操作的 fiber 节点对象的
  - firstEffect 存储第一个要执行的操作
  - lastEffect 存储最后一个要执行的操作
  - nextEffect 存储下一个要执行的操作
    - 存储在 lastEffect 下

> firstEffect 和 lastEffect 如何定义的为作解析

```js
// 将子树和此 Fiber 的所有副作用附加到父级的 effect 列表上

// 以下两个判断的作用是搜集子 Fiber的 effect 到父 Fiber
if (returnFiber.firstEffect === null) {
  // first
  returnFiber.firstEffect = workInProgress.firstEffect;
}

if (workInProgress.lastEffect !== null) {
  if (returnFiber.lastEffect !== null) {
    // next
    returnFiber.lastEffect.nextEffect = workInProgress.firstEffect;
  }
  // last
  returnFiber.lastEffect = workInProgress.lastEffect;
}
```

## commit 阶段

> [!warning]
> 什么时候从 render 阶段进入 commit 阶段
> - 重新回到 performSyncWorkOnRoot 方法中，该方法中通过调用 workLoopSync 方法，循环构建每一个 React 元素所对应的 fiber 对象，当构建完成就会进入 commit 阶段

- 实际就是下面这段代码，文件位置 packages\react-reconciler\src\ReactFiberWorkLoop.js

```js
// 将构建好的新 Fiber 对象存储在 finishedWork 属性中
// 提交阶段使用
root.finishedWork = (root.current.alternate: any);
root.finishedExpirationTime = expirationTime;
// 结束 render 阶段
// 进入 commit 阶段
finishSyncRender(root);
```

- root.finishedWork 是待提交 fiber 对象，实际上就是 render 阶段的工作成果：
  - root.current 就是 rootFiber
  - root.current.alternate 就是 workInProgress Fiber 树
- 然后调用 finishSyncRender 方法结束 render 阶段

### finishSyncRender 方法

- 首先清空全局变量 workInProgress，释放内存
  - 因为已经将它存储到 root.finishedWork 中了
- 然后真正进入 commit 阶段

```js
function finishSyncRender(root) {
  // 销毁 workInProgress Fiber 树
  // 因为待提交 Fiber 对象已经被存储在了 root.finishedWork 中
  workInProgressRoot = null;
  // 进入 commit 阶段
  commitRoot(root);
}
```

#### 1. commitRoot

> 该方法的内容就是更改任务的优先级，以最高优先级执行 commit 阶段

- 创建的任务的默认的优先级是 97（普通优先级）
- 在 commit 阶段不允许被打断（无论是初始渲染还是更新），所以要将任务的优先级设置为最高级 99
  1. 首先获取任务的优先级 renderPriorityLevel
  2. 然后更改任务的优先级 runWithPriority
    - 实际上使用最高优先级 ImmediatePriority 去执行 commit
    - commit 实际执行的方法是 commitRootImpl

```js
function commitRoot(root) {
  // 获取任务优先级 97 => 普通优先级
  const renderPriorityLevel = getCurrentPriorityLevel();
  // 使用最高优先级执行当前任务, 因为 commit 阶段不可以被打断
  // ImmediatePriority, 优先级为 99, 最高优先级
  runWithPriority(
    ImmediatePriority,
    commitRootImpl.bind(null, root, renderPriorityLevel),
  );
  return null;
}
```

#### 2. commit 阶段

> commit 阶段实际执行的是 commitRootImpl 方法，主要关心方法中的三个 while 循环，它代表着 commit 阶段的三个子阶段

> [!important]
> commit 阶段可以分为三个子阶段：
> 1. before mutation 阶段（执行 DOM 操作前）
>   - 执行方法 commitBeforeMutationEffects
>   - 调用类组件的生命周期函数
> 2. mutation 阶段（执行 DOM 操作）
>   - 执行方法 commitMutationEffects
> 3. layout 阶段（执行 DOM 操作后）
>   - 执行方法commitLayoutEffects
>   - 调用类组件的生命周期函数和函数组件的钩子函数

##### 2.1 commitRootImpl

- 文件位置 packages\react-reconciler\src\ReactFiberWorkLoop.js

```js
function commitRootImpl(root, renderPriorityLevel) {
  /*...*/
  // 获取待提交 Fiber 对象 rootFiber
  const finishedWork = root.finishedWork;
  /*...*/

  // 如果没有任务要执行
  if (finishedWork === null) {
    // 阻止程序继续向下执行
    return null;
  }
  // 重置为默认值
  root.finishedWork = null;
  root.finishedExpirationTime = NoWork;
  /*...*/
  
  // true
  if (firstEffect !== null) {
    /*...*/
    // commit 第一个子阶段
    nextEffect = firstEffect;
    // 处理类组件的 getSnapShotBeforeUpdate 生命周期函数
    do {
      if (__DEV__) {
        /*...*/
      } else {
        try {
          commitBeforeMutationEffects();
        } catch (error) {
          invariant(nextEffect !== null, 'Should be working on an effect.');
          captureCommitPhaseError(nextEffect, error);
          nextEffect = nextEffect.nextEffect;
        }
      }
    } while (nextEffect !== null);
    /*...*/
    // commit 第二个子阶段
    nextEffect = firstEffect;
    do {
      if (__DEV__) {
        /*...*/
      } else {
        try {
          commitMutationEffects(root, renderPriorityLevel);
        } catch (error) {
          invariant(nextEffect !== null, 'Should be working on an effect.');
          captureCommitPhaseError(nextEffect, error);
          nextEffect = nextEffect.nextEffect;
        }
      }
    } while (nextEffect !== null);
    /*...*/
    // commit 第三个子阶段
    nextEffect = firstEffect;
    do {
      if (__DEV__) {
        /*...*/
      } else {
        try {
          commitLayoutEffects(root, expirationTime);
        } catch (error) {
          invariant(nextEffect !== null, 'Should be working on an effect.');
          captureCommitPhaseError(nextEffect, error);
          nextEffect = nextEffect.nextEffect;
        }
      }
    } while (nextEffect !== null);
    /*...*/
    
    // 重置 nextEffect
    nextEffect = null;
    
    /*...*/
  } else {/*...*/}
  
  /*...*/
}
```

##### 2.2 commit 第一个子阶段

- 在第一个子阶段最主要的就是调用了类组件的 getSnapshotBeforeUpdate 生命周期函数

> [!warning]
> getSnapshotBeforeUpdate 生命周期函数只在更新阶段被执行，初始渲染时不会执行

###### 2.2.1 commitBeforeMutationEffects

- 文件位置 packages\react-reconciler\src\ReactFiberWorkLoop.js

```js
// commit 阶段的第一个子阶段
// 调用类组件的 getSnapshotBeforeUpdate 生命周期函数
function commitBeforeMutationEffects() {
  // 循环 effect 链
  while (nextEffect !== null) {
    // nextEffect 是 effect 链上从 firstEffect 到 lastEffect
    // 的每一个需要commit的 fiber 对象

    // 初始化渲染第一个 nextEffect 为 App 组件
    // effectTag => 3
    const effectTag = nextEffect.effectTag;
    // console.log(effectTag);
    // nextEffect = null;
    // return;

    // 如果 fiber 对象中里有 Snapshot 这个 effectTag 的话
    // Snapshot 和更新有关系 初始化渲染 不执行
    if ((effectTag & Snapshot) !== NoEffect) {
      // 开发环境执行 忽略
      setCurrentDebugFiberInDEV(nextEffect);
      // 计 effect 的数 忽略
      recordEffect();
      // 获取当前 fiber 节点
      const current = nextEffect.alternate;
      // 当 nextEffect 上有 Snapshot 这个 effectTag 时
      // 执行以下方法, 主要是类组件调用 getSnapshotBeforeUpdate 生命周期函数
      commitBeforeMutationEffectOnFiber(current, nextEffect);
      // 开发环境执行 忽略
      resetCurrentDebugFiberInDEV();
    }
    // 调度 useEffect
    // 初始化渲染 目前没有 不执行
    // false
    if ((effectTag & Passive) !== NoEffect) {
      // If there are passive effects, schedule a callback to flush at
      // the earliest opportunity.
      if (!rootDoesHavePassiveEffects) {
        rootDoesHavePassiveEffects = true;
        scheduleCallback(NormalPriority, () => {
          // 触发useEffect
          flushPassiveEffects();
          return null;
        });
      }
    }
    nextEffect = nextEffect.nextEffect;
  }
}
```

###### 2.2.2 commitBeforeMutationEffectOnFiber

- commitBeforeMutationLifeCycles 方法中只使用了 switch 匹配了类组件 tag = ClassComponent：
  - 获取旧的 props、旧的 state 以及组件实例对象
  - 然后调用实例对象的 getSnapshotBeforeUpdate 方法
  - 接着将快照存储在实例对象的 __reactInternalSnapshotBeforeUpdate 属性上
    - 用于在执行 componentDidUpdate 生命周期函数时作为第三个参数（快照）传入

```js
function commitBeforeMutationLifeCycles(
  current: Fiber | null,
  finishedWork: Fiber,
): void {
  switch (finishedWork.tag) {
    case FunctionComponent:
    case ForwardRef:
    case SimpleMemoComponent:
    case Block: {
      return;
    }
    // 如果该 fiber 类型是 ClassComponent
    case ClassComponent: {
      if (finishedWork.effectTag & Snapshot) {
        if (current !== null) {
          // 旧的 props
          const prevProps = current.memoizedProps;
          // 旧的 state
          const prevState = current.memoizedState;
          startPhaseTimer(finishedWork, 'getSnapshotBeforeUpdate');
          // 获取 classComponent 组件的实例对象
          const instance = finishedWork.stateNode;
          // 执行 getSnapshotBeforeUpdate 生命周期函数
          // 在组件更新前捕获一些 DOM 信息
          // 返回自定义的值或 null, 统称为 snapshot
          const snapshot = instance.getSnapshotBeforeUpdate(
            finishedWork.elementType === finishedWork.type
              ? prevProps
              : resolveDefaultProps(finishedWork.type, prevProps),
            prevState,
          );
          // 将 snapshot 赋值到 __reactInternalSnapshotBeforeUpdate 属性上
          instance.__reactInternalSnapshotBeforeUpdate = snapshot;
          stopPhaseTimer();
        }
      }
      return;
    }
    case HostRoot:
    case HostComponent:
    case HostText:
    case HostPortal:
    case IncompleteClassComponent:
      // Nothing to do for these component types
      return;
  }
  invariant(
    false,
    'This unit of work tag should not have side-effects. This error is ' +
      'likely caused by a bug in React. Please file an issue.',
  );
}
```

##### 2.3 commit 第二个子阶段

###### 2.3.1 commitMutationEffects

> 该阶段所做的就是根据 effectTag 属性执行 DOM 操作

1. 首先获取 fiber 节点对象的 effectTag
2. 然后进行匹配
  - Placement 插入节点操作
  - PlacementAndUpdate 插入并更新 DOM
  - Hydrating 服务器端渲染
  - Update 更新 DOM
  - Deletion 删除 DOM
3. 插入操作执行完将 effectTag 重置为 1，即 PerformedWork 表示 DOM 操作已经执行完成

- 当前是初始化渲染，会调用 commitPlacement

```js
// commit 阶段的第二个子阶段
// 根据 effectTag 执行 DOM 操作
function commitMutationEffects(root: FiberRoot, renderPriorityLevel) {
  // 循环 effect 链
  while (nextEffect !== null) {
    // 开发环境执行 忽略
    setCurrentDebugFiberInDEV(nextEffect);
    // 获取 effectTag
    // 初始渲染第一次循环为 App 组件
    // 即将根组件及内部所有内容一次性添加到页面中
    const effectTag = nextEffect.effectTag;

    // 如果有文本节点, 将 value 置为''
    if (effectTag & ContentReset) {
      commitResetTextContent(nextEffect);
    }
    // 更新 ref
    if (effectTag & Ref) {
      const current = nextEffect.alternate;
      if (current !== null) {
        commitDetachRef(current);
      }
    }

    // 根据 effectTag 分别处理
    let primaryEffectTag =
      effectTag & (Placement | Update | Deletion | Hydrating);
    // 匹配 effectTag
    // 初始渲染 primaryEffectTag 为 2 匹配到 Placement
    switch (primaryEffectTag) {
      // 针对该节点及子节点进行插入操作
      case Placement: {
        commitPlacement(nextEffect);
        // effectTag 从 3 变为 1
        // 从 effect 标签中清除 "placement" 重置 effectTag 值
        // 以便我们知道在调用诸如componentDidMount之类的任何生命周期之前已将其插入。
        nextEffect.effectTag &= ~Placement;
        break;
      }
      // 插入并更新 DOM
      case PlacementAndUpdate: {
        // 插入
        commitPlacement(nextEffect);
        // Clear the "placement" from effect tag so that we know that this is
        // inserted, before any life-cycles like componentDidMount gets called.
        nextEffect.effectTag &= ~Placement;

        // 更新
        const current = nextEffect.alternate;
        commitWork(current, nextEffect);
        break;
      }
      // 服务器端渲染
      case Hydrating: {
        nextEffect.effectTag &= ~Hydrating;
        break;
      }
      // 服务器端渲染
      case HydratingAndUpdate: {
        nextEffect.effectTag &= ~Hydrating;

        // Update
        const current = nextEffect.alternate;
        commitWork(current, nextEffect);
        break;
      }
      // 更新 DOM
      case Update: {
        const current = nextEffect.alternate;
        commitWork(current, nextEffect);
        break;
      }
      // 删除 DOM
      case Deletion: {
        commitDeletion(root, nextEffect, renderPriorityLevel);
        break;
      }
    }

    // TODO: Only record a mutation effect if primaryEffectTag is non-zero.
    recordEffect();

    resetCurrentDebugFiberInDEV();
    nextEffect = nextEffect.nextEffect;
  }
}
```

###### 2.3.2 commitPlacement

1. 首先获取非组件级的父级 fiber 对象
  - 因为组件本身不能插入 DOM 节点
2. 根据父级节点的类型 parentFiber.tag获取父级真实 DOM 节点对象
  - 不同类型获取的方式不同
3. 获取当前节点的兄弟节点
  - 根据是否有兄弟节点决定插入 DOM 的方式
    - 有兄弟节点：insertBefore
    - 没有兄弟节点：appendChild
4. 判断是否是渲染容器，调用对应的方法追加节点

- 文件位置 packages\react-reconciler\src\ReactFiberCommitWork.js

```js
// 挂载 DOM 元素
function commitPlacement(finishedWork: Fiber): void {
  // finishedWork 初始化渲染时为根组件 Fiber 对象

  if (!supportsMutation) {
    return;
  }
  // 获取非组件父级 Fiber 对象
  // 初始渲染时为 <div id="root"></div>
  const parentFiber = getHostParentFiber(finishedWork);

  // 存储真正的父级 DOM 节点对象
  let parent;
  // 是否为渲染容器
  // 渲染容器和普通react元素的主要区别在于是否需要特殊处理注释节点
  let isContainer;
  // 获取父级 DOM 节点对象
  // 但是初始渲染时 rootFiber 对象中的 stateNode 存储的是 FiberRoot
  const parentStateNode = parentFiber.stateNode;
  // 判断父节点的类型
  // 初始渲染时是 hostRoot 3
  switch (parentFiber.tag) {
    case HostComponent:
      parent = parentStateNode;
      isContainer = false;
      break;
    case HostRoot:
      // 获取真正的 DOM 节点对象
      // <div id="root"></div>
      parent = parentStateNode.containerInfo;
      // 是 container 容器
      isContainer = true;
      break;
    case HostPortal:
      parent = parentStateNode.containerInfo;
      isContainer = true;
      break;
    case FundamentalComponent:
      if (enableFundamentalAPI) {
        parent = parentStateNode.instance;
        isContainer = false;
      }
    // eslint-disable-next-line-no-fallthrough
    default:
      invariant(
        false,
        'Invalid host parent fiber. This error is likely caused by a bug ' +
          'in React. Please file an issue.',
      );
  }
  // 如果父节点是文本节点的话
  if (parentFiber.effectTag & ContentReset) {
    // 在进行任何插入操作前, 需要先将 value 置为 ''
    resetTextContent(parent);
    // 清除 ContentReset 这个 effectTag
    parentFiber.effectTag &= ~ContentReset;
  }

  // 查看当前节点是否有下一个兄弟节点
  // 有, 执行 insertBefore
  // 没有, 执行 appendChild
  const before = getHostSibling(finishedWork);
  // 渲染容器
  if (isContainer) {
    // 向父节点中追加节点 或者 将子节点插入到 before 节点的前面
    insertOrAppendPlacementNodeIntoContainer(finishedWork, before, parent);
  } else {
    // 非渲染容器
    // 向父节点中追加节点 或者 将子节点插入到 before 节点的前面
    insertOrAppendPlacementNode(finishedWork, before, parent);
  }
}
```

###### 2.3.3 getHostParentFiber

```js
// 获取 HostRootFiber 对象
function getHostParentFiber(fiber: Fiber): Fiber {
  // 获取当前 Fiber 父级
  let parent = fiber.return;
  // 查看父级是否为 null
  while (parent !== null) {
    // 查看父级是否为 hostRoot
    if (isHostParent(parent)) {
      // 返回
      return parent;
    }
    // 继续向上查找
    parent = parent.return;
  }
  invariant(
    false,
    'Expected to find a host parent. This error is likely caused by a bug ' +
      'in React. Please file an issue.',
  );
}
```

###### 2.3.4 insertOrAppendPlacementNodeIntoContainer

- 判断节点的类型：
  - 如果是普通元素或文本，则根据 before 调用对应的方法
  - 如果是组件，则获取组件的子级，再次调用 insertOrAppendPlacementNodeIntoContainer，并处理兄弟节点

```js
// 向容器中追加 | 插入到某一个节点的前面
function insertOrAppendPlacementNodeIntoContainer(
  node: Fiber,
  before: ?Instance,
  parent: Container,
): void {
  const {tag} = node;
  // 如果待插入的节点是一个 DOM 元素或者文本的话
  // 比如 组件fiber => false div => true
  const isHost = tag === HostComponent || tag === HostText;

  if (isHost || (enableFundamentalAPI && tag === FundamentalComponent)) {
    // 获取 DOM 节点
    const stateNode = isHost ? node.stateNode : node.stateNode.instance;
    // 如果 before 存在
    if (before) {
      // 插入到 before 前面
      insertInContainerBefore(parent, stateNode, before);
    } else {
      // 追加到父容器中
      appendChildToContainer(parent, stateNode);
    }
  } else if (tag === HostPortal) {
    // If the insertion itself is a portal, then we don't want to traverse
    // down its children. Instead, we'll get insertions from each child in
    // the portal directly.
  } else {
    // 如果是组件节点, 比如 ClassComponent, 则找它的第一个子节点(DOM 元素)
    // 进行插入操作
    const child = node.child;
    if (child !== null) {
      // 向父级中追加子节点或者将子节点插入到 before 的前面
      insertOrAppendPlacementNodeIntoContainer(child, before, parent);
      // 获取下一个兄弟节点
      let sibling = child.sibling;
      // 如果兄弟节点存在
      while (sibling !== null) {
        // 向父级中追加子节点或者将子节点插入到 before 的前面
        insertOrAppendPlacementNodeIntoContainer(sibling, before, parent);
        // 同步兄弟节点
        sibling = sibling.sibling;
      }
    }
  }
}
```

###### 2.3.5 insertInContainerBefore

- 判断父容器是否是注释节点
  - 如果是则找到注释节点的父级
- 使用 insertBefore 插入节点
- 文件位置 packages\react-dom\src\client\ReactDOMHostConfig.js

```js
export function insertInContainerBefore(
  container: Container,
  child: Instance | TextInstance,
  beforeChild: Instance | TextInstance | SuspenseInstance,
): void {
  // 如果父容器是注释节点
  if (container.nodeType === COMMENT_NODE) {
    // 找到注释节点的父级节点 因为注释节点没法调用 insertBefore
    (container.parentNode: any).insertBefore(child, beforeChild);
  } else {
    // 将 child 插入到 beforeChild 的前面
    container.insertBefore(child, beforeChild);
  }
}
```

###### 2.3.6 appendChildToContainer

- 判断父容器是否是注释节点
  - 如果是，获取注释节点的父级，调用 insertBefore 插入节点
  - 如果不是，调用 appendChild 插入节点

```js
export function appendChildToContainer(
  container: Container,
  child: Instance | TextInstance,
): void {
  let parentNode;
  // 监测 container 是否注释节点
  if (container.nodeType === COMMENT_NODE) {
    // 获取父级的父级
    parentNode = (container.parentNode: any);
    // 将子级节点插入到注释节点的前面
    parentNode.insertBefore(child, container);
  } else {
    // 直接将 child 插入到父级中
    parentNode = container;
    parentNode.appendChild(child);
  }

  const reactRootContainer = container._reactRootContainer;
  if (
    (reactRootContainer === null || reactRootContainer === undefined) &&
    parentNode.onclick === null
  ) {
    // TODO: This cast may not be sound for SVG, MathML or custom elements.
    trapClickOnNonInteractiveElement(((parentNode: any): HTMLElement));
  }
}
```

##### 2.4 commit 第三个子阶段

- 进入到第三个子阶段，就代表 DOM 操作已经执行完成
- 该阶段要做的就是执行类组件的生命周期函数和函数组件的钩子函数(例如 useEffect)

###### 2.4.1 commitLayoutEffects

```js
// commit 阶段的第三个子阶段
function commitLayoutEffects(
  root: FiberRoot,
  committedExpirationTime: ExpirationTime,
) {
  while (nextEffect !== null) {
    setCurrentDebugFiberInDEV(nextEffect);
    // 此时 effectTag 已经被重置为 1, 表示 DOM 操作已经完成
    const effectTag = nextEffect.effectTag;
    // 调用生命周期函数和钩子函数
    // 前提是类组件中调用了生命周期函数
    // 或者函数组件中调用了 useEffect
    if (effectTag & (Update | Callback)) {
      recordEffect();
      const current = nextEffect.alternate;
      // 类组件处理生命周期函数
      // 函数组件处理钩子函数
      commitLayoutEffectOnFiber(
        root,
        current,
        nextEffect,
        committedExpirationTime,
      );
    }
    // 赋值ref
    // false
    if (effectTag & Ref) {
      recordEffect();
      commitAttachRef(nextEffect);
    }

    resetCurrentDebugFiberInDEV();
    // 更新循环条件
    nextEffect = nextEffect.nextEffect;
  }
}
```

###### 2.4.2 commitLayoutEffectOnFiber

> 该方法通过匹配 tag 属性，判断要执行的内容，主要区分函数组件 FunctionComponent 和类组件 ClassComponent

- 类组件：
  - 获取组件实例对象
  - 判断如果是初始渲染阶段，调用 componentDidMount
  - 如果是更新节点，调用 componentDidUpdate 并将快照 instance.__reactInternalSnapshotBeforeUpdate 传递进去
  - 然后获取任务队列，执行 render 方法的第三个参数，即渲染完成后要执行的回调函数
- 文件位置 packages\react-reconciler\src\ReactFiberCommitWork.js
```js
function commitLifeCycles(
  finishedRoot: FiberRoot,
  current: Fiber | null,
  finishedWork: Fiber,
  committedExpirationTime: ExpirationTime,
): void {
  switch (finishedWork.tag) {
    case FunctionComponent:
    case ForwardRef:
    case SimpleMemoComponent:
    case Block: {
      // At this point layout effects have already been destroyed (during mutation phase).
      // This is done to prevent sibling component effects from interfering with each other,
      // e.g. a destroy function in one component should never override a ref set
      // by a create function in another component during the same commit.
      commitHookEffectListMount(HookLayout | HookHasEffect, finishedWork);

      if (runAllPassiveEffectDestroysBeforeCreates) {
        schedulePassiveEffects(finishedWork);
      }
      return;
    }
    case ClassComponent: {
      // 获取类组件实例对象
      const instance = finishedWork.stateNode;
      // 如果在类组件中存在生命周期函数判断条件就会成立
      if (finishedWork.effectTag & Update) {
        // 初始渲染阶段
        if (current === null) {
          startPhaseTimer(finishedWork, 'componentDidMount');
          
          // 调用 componentDidMount 生命周期函数
          instance.componentDidMount();
          stopPhaseTimer();
        } else {
          // 更新阶段
          // 获取旧的 props
          const prevProps =
            finishedWork.elementType === finishedWork.type
              ? current.memoizedProps
              : resolveDefaultProps(finishedWork.type, current.memoizedProps);
          // 获取旧的 state
          const prevState = current.memoizedState;
          startPhaseTimer(finishedWork, 'componentDidUpdate');
          
          // 调用 componentDidUpdate 生命周期函数
          // instance.__reactInternalSnapshotBeforeUpdate 快照
          // getSnapShotBeforeUpdate 方法的返回值
          instance.componentDidUpdate(
            prevProps,
            prevState,
            instance.__reactInternalSnapshotBeforeUpdate,
          );
          stopPhaseTimer();
        }
      }
      // 获取任务队列
      const updateQueue = finishedWork.updateQueue;
      // 如果任务队列存在
      if (updateQueue !== null) {
        /**
         * 调用 ReactElement 渲染完成之后的回调函数
         * 即 render 方法的第三个参数
         */
        commitUpdateQueue(finishedWork, updateQueue, instance);
      }
      return;
    }
    case HostRoot: /*...*/
    case HostComponent: /*...*/
    case Profiler:/*...*/
    case SuspenseComponent: /*...*/
    case SuspenseListComponent:
    case IncompleteClassComponent:
    case FundamentalComponent:
    case ScopeComponent:
      return;
  }
  invariant(
    false,
    'This unit of work tag should not have side-effects. This error is ' +
      'likely caused by a bug in React. Please file an issue.',
  );
}
```

###### 2.4.3 commitUpdateQueue

- 文件位置 packages\react-reconciler\src\ReactUpdateQueue.js

```js
// packages\react-reconciler\src\ReactUpdateQueue.js
/**
 * 执行渲染完成之后的回调函数
 */
export function commitUpdateQueue<State>(
  finishedWork: Fiber,
  finishedQueue: UpdateQueue<State>,
  instance: any,
): void {
  // effects 为数组, 存储任务对象 (Update 对象)
  // 但前提是在调用 render 方法时传递了回调函数, 就是 render 方法的第三个参数
  // 如果没有传递， effects 就是 null
  const effects = finishedQueue.effects;
  // 重置 finishedQueue.effects 数组
  finishedQueue.effects = null;
  // 如果传递了 render 方法的第三个参数, effect 数组就不会为 null
  if (effects !== null) {
    // 遍历 effect 数组
    for (let i = 0; i < effects.length; i++) {
      // 获取数组中的第 i 个需要执行的 effect
      const effect = effects[i];
      // 获取 callback 回调函数
      const callback = effect.callback;
      // 如果回调函数不为 null
      if (callback !== null) {
        // 清空 effect 中的 callback
        effect.callback = null;
        // 执行回调函数, 并将 this 指向组件实例对象
        callCallback(callback, instance);
      }
    }
  }
}
```

###### 2.4.4 commitHookEffectListMount 调用函数组件的钩子函数

- 以 useEffect 钩子函数为例，在第三个子阶段实际上是调用 useEffect 接收的第一个参数，一个回调函数
- 函数组件会执行 commitHookEffectListMount 方法
  - 要执行的钩子函数都被存储到任务队列的 lastEffect 中
  - 通过 lastEffect.next 获取当前要使用的 fiber 对象，并存储到 next 中，next 包含几个参数：
    - create：存储 useEffect 的第一个参数（回调函数）
    - deps：存储 useEffect 的第二个参数
    - destroy：存储 useEffect 第一个参数返回的函数（清理函数）
      - 在调用 create 的结果存储到 destroy
      - 在组件卸载的时候调用 destroy
- 文件位置 packages\react-reconciler\src\ReactFiberCommitWork.js
```js
/**
 * useEffect 回调函数调用
 */
function commitHookEffectListMount(tag: number, finishedWork: Fiber) {
  // 获取任务队列
  const updateQueue: FunctionComponentUpdateQueue | null = (finishedWork.updateQueue: any);
  // 获取 lastEffect
  let lastEffect = updateQueue !== null ? updateQueue.lastEffect : null;
  // 如果 lastEffect 不为 null
  if (lastEffect !== null) {
    // 获取要执行的副作用
    const firstEffect = lastEffect.next;
    let effect = firstEffect;
    // 通过遍历的方式调用 useEffect 中的回调函数
    // 在组件中定义了调用了几次 useEffect 遍历就会执行几次
    do {
      if ((effect.tag & tag) === tag) {
        // Mount
        const create = effect.create;
        // create 就是 useEffect 方法的第一个参数
        // 返回值就是清理函数
        effect.destroy = create();
      }
      // 更新循环条件
      effect = effect.next;
    } while (effect !== firstEffect);
  }
}
```
