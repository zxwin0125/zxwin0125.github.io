---
title: 创建 React 元素
order: 2
---

> JSX 被 Babel 编译为 React.createElement 方法的调用，createElement 方法在调用后返回的就是 ReactElement，就是 virtualDOM

## createElement

- 文件位置：packages/react/src/ReactElement.js

### 1. 分析

> [!info]
> createElement 接收的参数：
> - **<font color=red>type</font>** - 元素类型：`<div>`、`<span>` or `<app>` 组件
> - **<font color=red>config</font>** - 配置属性，包含：
>   - 普通元素属性：props
>   - 特殊属性：React 内部为了实现某些功能而存在的属性：ref、key、self、source
>   - 如果元素没有属性，值为 null
> - **<font color=red>children 及后面接收的参数</font>** - 表示元素的元素
>   - 子元素会作为参数从第三个参数开始传入
>   - 所以方法内使用 arguments 获取所有子元素（第三个及之后的参数）

> [!important]
> createElement 方法中一共做了4件事：
> 1. **<font color=red>分离 props 属性和特殊属性</font>**
>   - 首先判断 config 是否不为 null
>   - 如果不为 null，则首先分别提取特殊属性 ref、key、self、source
>   - 然后遍历 config，将普通元素属性全部提取到一个变量 props 中
> 2. **<font color=red>将子元素挂载到 props.children 中</font>**
>   - 子元素就是第三个及之后的参数
>   - 如果子元素是多个，props.children 是数组
>   - 如果子元素是一个，props.children 是对象
> 3. **<font color=red>为 props 属性赋默认值(defaultProps)</font>**
>   - 这里其实处理的是组件，因为普通元素的 type 为字符串，组件的 type 为组件构造函数，所以只有组件才会有 defaultProps
>   - 如果有 defaultProps 则遍历属性，如果属性未赋值，则将默认值赋给它
> 4. **<font color=red>创建并返回 ReactElement</font>**
>   - 最后通过调用 ReactElement 方法，创建 ReactElement 并返回

### 2. React 检测开发者是否错误的使用了 props 属性

- createElement 方法在开发环境中 React 会检测开发者，是否在组件内部通过 props 对象获取 key 或 ref 属性
- 这两个属性是 React 内部使用的属性，这种用法是不正确的，React 检测到这种行为会在控制台发出错误提示

```js
function App(props) {
  console.log(props.key) // 报错
  return <div>App works</div>
}

React.render(<App/>, document.getElementById('root'))
```

> [!important]
> 检测过程
> 1. 首先判断是否是开发环境
> 2. 然后判断是否有 key 或者 ref 属性
> 3. 如果有：
>   - 获取组件的名字，因为要在报错时提示时哪个组件进行了错误操作：
>     - 如果是组件，则获取它的 displayName 或 name，如果未命名，则为 Unknown
>     - 如果是普通元素，则为它的 tag 名，也就是 type 的值
>   - 然后调用对应的方法，这些方法的内容就是：
>     - 为 props 对象添加 key 或 ref 属性
>     - 定义它们的 getter 方法，当触发时，也就是通过 props 对象获取 key 或 ref 时报错
>       - 方法中使用了全局变量，保证报错只执行一次

```js
/**
 * 在开发环境中 React 会检测开发者是否在组件内部
 * 通过 props 对象获取 key 属性或者 ref 属性
 * 如果开发者调用了 在控制台中报错误提示
 */

// 如果处于开发环境
if (__DEV__) {
  // 元素具有 key 属性或者 ref 属性
  if (key || ref) {
    // 看一下 type 属性中存储的是否是函数 如果是函数就表示当前元素是组件
    // 如果元素不是组件 就直接返回元素类型字符串
    // displayName 用于在报错过程中显示是哪一个组件报错了
    // 如果开发者显式定义了 displayName 属性 就显示开发者定义的
    // 否者就显示组件名称 如果组件也没有名称 就显示 'Unknown'
    const displayName =
      typeof type === 'function'
        ? type.displayName || type.name || 'Unknown'
        : type;
    // 如果 key 属性存在
    if (key) {
      // 为 props 对象添加key 属性
      // 并指定当通过 props 对象获取 key 属性时报错
      defineKeyPropWarningGetter(props, displayName);
    }
    // 如果 ref 属性存在
    if (ref) {
      // 为 props 对象添加 ref 属性
      // 并指定当通过 props 对象获取 ref 属性时报错
      defineRefPropWarningGetter(props, displayName);
    }
  }
}
```
```js
/**
 *  指定当通过 props 对象获取 key 属性时报错
 *  props        组件中的 props 对象
 *  displayName  组件名称标识
 */

function defineKeyPropWarningGetter(props, displayName) {
  // 通过 props 对象获取 key 属性报错
  const warnAboutAccessingKey = function () {
    // 在开发环境中
    if (__DEV__) {
      // specialPropKeyWarningShown 控制错误只输出一次的变量
      if (!specialPropKeyWarningShown) {
        // 通过 specialPropKeyWarningShown 变量锁住判断条件
        specialPropKeyWarningShown = true;
        // 指定报错信息和组件名称
        console.error(
          '%s: `key` is not a prop. Trying to access it will result ' +
            'in `undefined` being returned. If you need to access the same ' +
            'value within the child component, you should pass it as a different ' +
            'prop. (https://reactjs.org/link/special-props)',
          displayName,
        );
      }
    }
  };
  warnAboutAccessingKey.isReactWarning = true;
  // 为 props 对象添加 key 属性
  Object.defineProperty(props, 'key', {
    // 当获取 key 属性时调用 warnAboutAccessingKey 方法进行报错
    get: warnAboutAccessingKey,
    configurable: true,
  });
}
```

### 3. isValidElement 验证有效 React 元素

- isValidElement 方法用于验证是否是有效的 React 元素
- 其中最主要的判断依据就是是否设置了正确的 `$$typeof` 属性，每个创建的 React 元素都包含这个属性，表示能够转换成真实 DOM 的 React 元素
- `$$typeof` 的值是十六进制数值或者 Symbol 值(如果浏览器支持 Symbol)

```js
/**
 * 验证 object 参数是否是 ReactElement. 返回布尔值
 * 验证成功的条件:
 * object 是对象
 * object 不为 null
 * object 对象中的 $$typeof 属性值为 REACT_ELEMENT_TYPE
 */
export function isValidElement(object) {
  return (
    typeof object === 'object' &&
    object !== null &&
    object.$$typeof === REACT_ELEMENT_TYPE
  );
}
```
```js
// packages\shared\ReactSymbols.js
// 定义 REACT_ELEMENT_TYPE 的地方
export const REACT_ELEMENT_TYPE = hasSymbol
  ? Symbol.for('react.element')
  : 0xeac7;
```

### 4. 相关源码

#### 4.1 createElement

```js
/**
 * 创建 React Element
 * type      元素类型
 * config    配置属性
 * children  子元素
 * 1. 分离 props 属性和特殊属性
 * 2. 将子元素挂载到 props.children 中
 * 3. 为 props 属性赋默认值 (defaultProps)
 * 4. 创建并返回 ReactElement
 */
export function createElement(type, config, children) {
  /**
   * propName -> 属性名称
   * 用于后面的 for 循环，避免后面两次循环遍历属性时，每次循环都重新声明一次，稍微提高了一些性能
   */
  let propName;

  /**
   * 存储 React Element 中的普通元素属性 即不包含 key ref self source
   */
  const props = {};

  /**
   * 待提取属性
   * React 内部为了实现某些功能而存在的属性
   */
  let key = null;
  let ref = null;
  let self = null;
  let source = null;

  // 如果 config 不为 null
  if (config != null) {
    // 如果 config 对象中有合法的 ref 属性
    if (hasValidRef(config)) {
      // 将 config.ref 属性提取到 ref 变量中
      ref = config.ref;
      // 在开发环境中
      if (__DEV__) {
        // 如果 ref 属性的值被设置成了字符串形式就报一个提示
        // 说明此用法在将来的版本中会被删除
        warnIfStringRefCannotBeAutoConverted(config);
      }
    }
    // 如果在 config 对象中拥有合法的 key 属性
    if (hasValidKey(config)) {
      // 将 config.key 属性中的值提取到 key 变量中，转化为字符串类型
      key = '' + config.key;
    }

    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source;
    // 遍历 config 对象
    for (propName in config) {
      // 如果当前遍历到的属性是对象自身属性
      // 并且在 RESERVED_PROPS 对象中不存在该属性
      if (
        hasOwnProperty.call(config, propName) &&
        !RESERVED_PROPS.hasOwnProperty(propName)
      ) {
        // 将满足条件的属性添加到 props 对象中 (普通属性)
        props[propName] = config[propName];
      }
    }
  }

  /**
   * 将第三个及之后的参数挂载到 props.children 属性中
   * 如果子元素是多个 props.children 是数组
   * 如果子元素是一个 props.children 是对象
   */

  // 由于从第三个参数开始及以后都表示子元素
  // 所以减去前两个参数的结果就是子元素的数量
  const childrenLength = arguments.length - 2;
  // 如果子元素的数量是 1
  if (childrenLength === 1) {
    // 直接将子元素挂载到到 props.children 属性上
    // 此时 children 是对象类型
    props.children = children;
    // 如果子元素的数量大于 1
  } else if (childrenLength > 1) {
    // 创建数组, 数组中元素的数量等于子元素的数量
    const childArray = Array(childrenLength);
    // 开启循环 循环次匹配子元素的数量
    for (let i = 0; i < childrenLength; i++) {
      // 将子元素添加到 childArray 数组中
      // i + 2 的原因是实参集合的前两个参数不是子元素
      childArray[i] = arguments[i + 2];
    }
    // 如果是开发环境
    if (__DEV__) {
      // 如果 Object 对象中存在 freeze 方法
      if (Object.freeze) {
        // 调用 freeze 方法 冻结 childArray 数组
        // 防止 React 核心对象被修改 冻结对象提高性能
        Object.freeze(childArray);
      }
    }
    // 将子元素数组挂载到 props.children 属性中
    props.children = childArray;
  }

  /**
   * 如果当前处理是组件
   * 看组件身上是否有 defaultProps 属性
   * 这个属性中存储的是 props 对象中属性的默认值
   * 遍历 defaultProps 对象 查看对应的 props 属性的值是否为 undefined
   * 如果为undefined 就将默认值赋值给对应的 props 属性值
   */

  // 将 type 属性值视为函数 查看其中是否具有 defaultProps 属性
  if (type && type.defaultProps) {
    // 将 type 函数下的 defaultProps 属性赋值给 defaultProps 变量
    const defaultProps = type.defaultProps;
    // 遍历 defaultProps 对象中的属性 将属性名称赋值给 propName 变量
    for (propName in defaultProps) {
      // 如果 props 对象中的该属性的值为 undefined
      if (props[propName] === undefined) {
        // 将 defaultProps 对象中的对应属性的值赋值给 props 对象中的对应属性的值
        props[propName] = defaultProps[propName];
      }
    }
  }

  /**
   * 在开发环境中 如果元素的 key 属性 或者 ref 属性存在
   * 监测开发者是否在组件内部通过 props 对象获取了 key 属性或者 ref 属性
   * 如果获取了 就报错
   */

  // 如果处于开发环境
  if (__DEV__) {
    // 元素具有 key 属性或者 ref 属性
    if (key || ref) {
      // 看一下 type 属性中存储的是否是函数 如果是函数就表示当前元素是组件
      // 如果元素不是组件 就直接返回元素类型字符串
      // displayName 用于在报错过程中显示是哪一个组件报错了
      // 如果开发者显式定义了 displayName 属性 就显示开发者定义的
      // 否者就显示组件名称 如果组件也没有名称 就显示 'Unknown'
      const displayName =
        typeof type === 'function'
          ? type.displayName || type.name || 'Unknown'
          : type;
      // 如果 key 属性存在
      if (key) {
        // 为 props 对象添加key 属性
        // 并指定当通过 props 对象获取 key 属性时报错
        defineKeyPropWarningGetter(props, displayName);
      }
      // 如果 ref 属性存在
      if (ref) {
        // 为 props 对象添加 ref 属性
        // 并指定当通过 props 对象获取 ref 属性时报错
        defineRefPropWarningGetter(props, displayName);
      }
    }
  }
  // 返回 ReactElement
  return ReactElement(
    type,
    key,
    ref,
    self,
    source,
    // 在 Virtual DOM 中用于识别自定义组件
    ReactCurrentOwner.current,
    props,
  );
}
```

#### 4.2 ReactElement

- 文件位置：packages/react/src/ReactElement.js
- ReactElement 方法其实就是声明创建了一个对象，并返回，这个对象就是 JSX 转换后的元素对象

```js
/**
 * 接收参数 返回 ReactElement
 */
const ReactElement = function (type, key, ref, self, source, owner, props) {
  const element = {
    /**
     * 组件的类型, 十六进制数值或者 Symbol 值
     * React 在最终在渲染 DOM 的时候, 需要确保元素的类型是 REACT_ELEMENT_TYPE
     * 需要此属性作为判断的依据
     */
    $$typeof: REACT_ELEMENT_TYPE,

    /**
     * 元素具体的类型值 如果是元素节点 type 属性中存储的就是 div span 等等
     * 如果元素是组件 type 属性中存储的就是组件的构造函数
     */
    type: type,
    /**
     * 元素的唯一标识
     * 用作内部 vdom 比对 提升 DOM 操作性能
     */
    key: key,
    /**
     * 存储元素 DOM 对象或者组件 实例对象
     */
    ref: ref,
    /**
     * 存储向组件内部传递的数据
     */
    props: props,

    /**
     * 记录当前元素所属组件 (记录当前元素是哪个组件创建的)
     */
    _owner: owner,
  };
  // 返回 ReactElement
  return element;
};
```

#### 4.3 hasValidRef

- 文件位置：packages/react/src/ReactElement.js

```js
/**
 * 查看参数对象中是否有合法的 ref 属性
 * 返回布尔值
 */
function hasValidRef(config) {
  return config.ref !== undefined;
}
```

#### 4.4 hasValidKey

- 文件位置：packages/react/src/ReactElement.js

```js
/**
 * 查看参数对象中是否有合法的 key 属性
 * 返回布尔值
 */
function hasValidKey(config) {
  return config.key !== undefined;
}
```

#### 4.5 isValidElement

- 文件位置：packages/react/src/ReactElement.js

```js
/**
 * 验证 object 参数是否是 ReactElement. 返回布尔值
 * 验证成功的条件:
 * object 是对象
 * object 不为null
 * object对象中的 $$typeof 属性值为 REACT_ELEMENT_TYPE
 */
export function isValidElement(object) {
  return (
    typeof object === 'object' &&
    object !== null &&
    object.$$typeof === REACT_ELEMENT_TYPE
  );
}
```

#### 4.6 defineKeyPropWarningGetter

- 文件位置：packages/react/src/ReactElement.js

```js
/**
 *  指定当通过 props 对象获取 key 属性时报错
 *  props        组件中的 props 对象
 *  displayName  组件名称标识
 */
function defineKeyPropWarningGetter(props, displayName) {
  // 通过 props 对象获取 key 属性报错
  const warnAboutAccessingKey = function () {
    // 在开发环境中
    if (__DEV__) {
      // specialPropKeyWarningShown 控制错误只输出一次的变量
      if (!specialPropKeyWarningShown) {
        // 通过 specialPropKeyWarningShown 变量锁住判断条件
        specialPropKeyWarningShown = true;
        // 指定报错信息和组件名称
        console.error(
          '%s: `key` is not a prop. Trying to access it will result ' +
            'in `undefined` being returned. If you need to access the same ' +
            'value within the child component, you should pass it as a different ' +
            'prop. (https://reactjs.org/link/special-props)',
          displayName,
        );
      }
    }
  };
  warnAboutAccessingKey.isReactWarning = true;
  // 为 props 对象添加 key 属性
  Object.defineProperty(props, 'key', {
    // 当获取 key 属性时调用 warnAboutAccessingKey 方法进行报错
    get: warnAboutAccessingKey,
    configurable: true,
  });
}
```

#### 4.7 defineRefPropWarningGetter

- 文件位置：packages/react/src/ReactElement.js

```js
/**
 *  指定当通过 props 对象获取 ref 属性时报错
 *  props        组件中的 props 对象
 *  displayName  组件名称标识
 */
function defineRefPropWarningGetter(props, displayName) {
  // 通过 props 对象获取 ref 属性报错
  const warnAboutAccessingRef = function () {
    if (__DEV__) {
      // specialPropRefWarningShown 控制错误只输出一次的变量
      if (!specialPropRefWarningShown) {
        // 通过 specialPropRefWarningShown 变量锁住判断条件
        specialPropRefWarningShown = true;
        // 指定报错信息和组件名称
        console.error(
          '%s: `ref` is not a prop. Trying to access it will result ' +
            'in `undefined` being returned. If you need to access the same ' +
            'value within the child component, you should pass it as a different ' +
            'prop. (https://reactjs.org/link/special-props)',
          displayName,
        );
      }
    }
  };

  warnAboutAccessingRef.isReactWarning = true;
  // 为 props 对象添加 key 属性
  Object.defineProperty(props, 'ref', {
    get: warnAboutAccessingRef,
    configurable: true,
  });
}
```
