---
title: JavaScript 面试重点 —— 基础
category:
	- 面试
tag:
	- JavaScript
---

### 防抖和节流

> 题目：什么是防抖和节流，他们的应用场景有哪些

- 防抖
  - 防止抖动，单位时间内事件触发会被重置，避免事件被误伤触发多次
  - **代码实现重在清零 clearTimeout**
  - 防抖可以比作等电梯，只要有一个人进来，就需要再等一会儿
  - 业务场景有避免登录按钮多次点击的重复提交
- 节流
  - 控制流量，单位时间内事件只能触发一次，与服务器端的限流 (Rate Limit) 类似
  - **代码实现重在开锁关锁 timer=timeout; timer=null**
  - 节流可以比作过红绿灯，每等一个红灯时间就可以过一批

### typeof 与 instanceof 的区别

> 题目：typeof 与 instanceof 的区别

- typeof 用以判断基础数据类型 (null 除外)
- instanceOf 借助原型链判断复杂数据类型

### bind 与 call/apply 的区别是什么

> 题目：bind 与 call/apply 的区别是什么

- 他们都是绑定 this 的，但是
  - bind 返回函数
  - call/apply 直接执行函数

### 在 js 中如何实现继承

> 题目：在 js 中如何实现继承

- 有两种方法：
  - class/extends
  - function/new

### js 中在 new 的时候发生了什么

> 题目：js 中在 new 的时候发生了什么

1. 创建一个新的对象
2. this 指向实例，并且执行函数
3. 如果没有显式返回，则默认返回这个实例

### 以下输出顺序多少 (setTimeout 与 promise 顺序)

> 题目：以下输出顺序多少 (setTimeout 与 promise 顺序)

```javascript
setTimeout(() => console.log(0));
new Promise((resolve) => {
  console.log(1);
  resolve(2);
  console.log(3);
}).then((o) => console.log(o));
 
new Promise((resolve) => {
  console.log(4);
  resolve(5);
})
  .then((o) => console.log(o))
  .then(() => console.log(6));
```

- 1 => 3 => 4 => 2 => 5 => 6 => 0
- 第一次循环
  - 宏任务队列
    - [ console.log(1) 、console.log(3) 、console.log(4) ]
  - 微任务队列
    [ then((o) => console.log(o)) | [resolve(2)] 、then((o) => console.log(o)) | [resolve(5)] ]
  - 延时队列
    - [ setTimeout(() => console.log(0)) ]
  - 执行微任务队列
    - then((o) => console.log(o)) | [resolve(2)]、then((o) => console.log(o)) | [resolve(5)] 
    - 其中 then((o) => console.log(o)) | [resolve(5)] 执行完成后又向当前微任务队列中加入一个任务 then(() => console.log(6));
  - 执行微任务队列
    - [ then((o) => console.log(o)) | [resolve(2)]、then((o) => console.log(o)) | [resolve(5)] ]，其中这两个任务又分别陆续返回2个微任务
    - 因此当前微任务队列的执行顺序是
    1. [ then((o) => console.log(o)) | [resolve(2)]、then((o) => console.log(o)) | [resolve(5)] ]
    2. [ then(() => console.log(7))、then(() => console.log(6)) ]
- 第二次循环
  - 检查延时队列 setTimeout(() => console.log(0))
  - 打印console.log(0)

### 请简述一下 event loop

> 题目：请简述一下 event loop

- 因为JS是单线程的，单线程就意味着，所有任务需要排队，前一个任务结束，才会执行后一个任务
- 为了解决排除等待问题，JS的任务分为同步任务（synchronous）和异步任务（asynchronous）
- 所有同步任务都在主线程上执行，形成一个Stac）
- 异步任务（如果是WebAPI 则会进入WebAPI，例如ajax setTimeout）不进入主线程，而是进入另一 Callback Queue
- 同步任务顺序执行，只有执行栈中的同步任务执行完了，系统才回读取任务队列中可以执行的异步任务，才会把此异步任务从事件队列中放入执行栈中执行，如此循环，直至所有任务执行完毕
- 这就是EventLoop

### 简述 node/v8 中的垃圾回收机制

> 题目：简述 node/v8 中的垃圾回收机制

- v8 中的垃圾回收机制分为三种
  - Scavenge，工作在新生代，把 from space 中的存活对象移至 to space
  - Mark-Sweep，标记清除，新生代的某些对象由于过度活跃会被移至老生代，此时对老生代中活对象进行标记，并清理死对象
  - Mark-Compact，标记整理

### v8 是如何执行一段 JS 代码的

> 题目：v8 是如何执行一段 JS 代码的

- V8 引擎首先会将 JavaScript 源代码解析成抽象语法树(AST)
- 然后 V8 会将 AST 编译成字节码，V8 会对字节码进行即时编译(Just-In-Time compilation，简称 JIT)优化，生成高效的机器码
- 在执行过程中，V8 会根据代码的使用情况执行进一步的优化，例如内联函数、隐藏类优化等
- 执行优化后的机器码来运行 JavaScript 程序
- 参考几篇文章
  - [V8是如何执行JavaScript代码的？](https://zhuanlan.zhihu.com/p/96502646)
  - [[译]JavaScript是如何工作的：深入V8引擎&编写优化代码的5个技巧](https://zhuanlan.zhihu.com/p/57898561)
  - [JavaScript 引擎 V8 执行流程概述](https://zhuanlan.zhihu.com/p/111386872)

### 关于块级作用域，以下代码输出多少，在何时间输出

> 题目：关于块级作用域，以下代码输出多少，在何时间输出

```javascript
for (var i = 0; i < 5; i++) {
  setTimeout(() => console.log(i), 1000);
}
```

- 第一种使用var的方式:

```javascript
for (var i = 0; i < 5; i++) {
  setTimeout(() => console.log(i), 1000);
}
```

- 第二种使用var的方式:

```javascript
for (var i = 0; i < 5; i++) {
  setTimeout(console.log, 1000 * i, i);
}
```

- var 声明的变量是在函数作用域或者全局作用域的，在第一种方式中，由于setTimeout是异步执行，且它是从闭包中获取 i 变量，由于 i 是在函数/全局作用域中声明的，所以5次循环中 i 不断被赋值，最后 i 的值为5，执行的结果为连续的5个5
- 在第二种方式中，通过给setTimeout的回调函数传参的方式，保存了每次循环中 i 的值，因此执行结果符合预期
- let声明的变量是在块级作用域(花括号)中的，因此可以认为每次执行循环语句块中的 i 变量是互相独立的，所以执行结果也符合预期

### 什么是闭包，闭包的应用有哪些地方

> 题目：什么是闭包，闭包的应用有哪些地方

- 闭包是一个函数, 其可以记住并访问外部变量
- 在函数被创建时, 函数的隐藏属性 [[Environment]] 会记住函数被创建时的位置, 即当时的词法环境 Lexical Environment
- 这样, 无论在哪里调用函数, 都会去到 [[Environment]] 所引用的词法环境
- 当查找变量时, 先在词法环境内部查找, 当没有找到局部变量时, 前往当前词法环境所记录的外部词法环境查找
- 闭包应用：封装私有变量、处理回调函数

```javascript
// 封装私有变量
function Ninja() {
  // 私有变量
  let feints = 0;

  this.getFeints = () => {
    return feints;
  };
  this.feint = () => {
    feints++;
  };
}
const ninja1 = new Ninja();
const ninja2 = new Ninja(); // ninja1 和 ninja2 有自己的词法环境

console.log("Ninja", Ninja);

console.log("ninja1 not access feints", ninja1.feints === undefined); // true
console.log("get feints", ninja1.getFeints()); // 0
ninja1.feint(); // +1
console.log("get feints", ninja1.getFeints()); // 1
```

```javascript
// 处理回调函数
function fn() {
  // tick 在这里被修改
  // Interval 的回调函数, 通过闭包找到这里
  let tick = 0;
  console.log("tick init", tick);

  const timer = setInterval(() => {
    if (tick < 100) {
      tick += 1;
      console.log("tick change", tick);
    } else {
      clearInterval(timer);
      console.log("tick equal 100", tick === 100);
      console.log("access timer by closure", timer);
    }
  }, 10);
}
fn();
```

### 关于事件循环，一道异步代码执行输出顺序问题

> 题目：关于事件循环，一道异步代码执行输出顺序问题

```javascript
setTimeout(() => {
  console.log("A");
  Promise.resolve().then(() => {
    console.log("B");
  });
}, 1000);
 
Promise.resolve().then(() => {
  console.log("C");
});
 
new Promise((resolve) => {
  console.log("D");
  resolve("");
}).then(() => {
  console.log("E");
});
 
async function sum(a, b) {
  console.log("F");
}
 
async function asyncSum(a, b) {
  await Promise.resolve();
  console.log("G");
  return Promise.resolve(a + b);
}
 
sum(3, 4);
asyncSum(3, 4);
console.log("H");
```

- D F H C E G A B
- 代码块的执行顺序：
1. 同步代码块：
  - JavaScript 引擎会先执行所有同步代码
  - Promise.resolve() 是同步执行的，而 Promise.then() 回调是微任务（microtask）
2. 宏任务和微任务：
  - 宏任务（如 setTimeout）会被放入任务队列，等到主线程空闲时才会执行
  - 微任务（如 Promise.then() 的回调）会在当前的同步代码执行完后立即执行
- 逐步分析代码：
1. `Promise.resolve().then(() => { console.log(“C”); })`
  - Promise.resolve() 立即被执行，但 then() 回调被放入微任务队列
2. `new Promise((resolve) => { console.log(“D”); resolve(""); }).then(() => { console.log(“E”); })`
  - 构造函数中的代码是同步的，所以会立即执行，打印 "D"。
  - resolve("") 立即被调用，then() 回调被放入微任务队列。
3. `async function sum(a, b) { console.log(“F”); }`
  - 调用 sum(3, 4) 会立即执行函数中的同步代码，打印 "F"。
4. `async function asyncSum(a, b) { await Promise.resolve(); console.log(“G”); return Promise.resolve(a + b); }`
  - 调用 asyncSum(3, 4)，await Promise.resolve() 会让出执行线程，console.log("G") 会作为微任务被执行。
5. `console.log(“H”)`
  - 这是同步代码，立即执行，打印 "H"。
6. 微任务队列执行：
  - 微任务队列中的顺序是：console.log("C") -> console.log("E") -> console.log("G")。
7. setTimeout
  - 宏任务在 1000ms 后执行，setTimeout 回调会被放入任务队列，在执行时先打印 "A"，然后执行其中的微任务 Promise.resolve().then(() => { console.log("B"); })。
- 总结：
  - 同步代码先执行，打印 "D", "F", "H"。
  - 然后执行微任务，打印 "C", "E", "G"。
  - 最后，宏任务中的代码会在 1000ms 后执行，打印 "A"，随后执行其中的微任务，打印 "B"。

### 关于 Promise，判断以下代码的输出

> 题目：关于 Promise，判断以下代码的输出

```javascript
Promise.resolve()
  .then(() => {
    console.log(0);
    return Promise.resolve(4);
  })
  .then((res) => {
    console.log(res);
  });
 
Promise.resolve()
  .then(() => {
    console.log(1);
  })
  .then(() => {
    console.log(2);
  })
  .then(() => {
    console.log(3);
  })
  .then(() => {
    console.log(5);
  })
  .then(() => {
    console.log(6);
  });
```

- 0 1 2 3 4 5 6

### 为何 0.1 + 0.2 不等于 0.3，应如何做相等比较

> 题目：为何 0.1+0.2 不等于 0.3，应如何做相等比较

- 0.1，0.2 表示为二进制会有精度的损失，比较时可引入一个很小的数值 Number.EPSILON 容忍误差，其值为 2^-52

```javascript
function equal (a, b) {
  return Math.abs(a - b) < Number.EPSILON
}
```

### 关于 this 与包装对象，以下输出多少

> 题目：关于 this 与包装对象，以下输出多少

```javascript
function foo() {
  console.log(this);
}
 
foo.call(3);
```

### 关于类型转化，判断以下代码输出

> 题目：关于类型转化，判断以下代码输出

```javascript
Boolean(new Boolean(false));
Boolean(document.all);
 
[] == "";
[3] == 3;
[] == false;
42 == true;
```

### 关于暂时性死域，判断以下代码输出

> 题目：关于暂时性死域，判断以下代码输出

- 第一段代码如下

```javascript
var a = 3;
let a;
```

- 第二段代码如下

```javascript
var x = 3;
 
function foo (x=x) {
    // ..
}
 
foo()
```

### 关于词法作用域，判断以下代码输出

> 题目：关于词法作用域，判断以下代码输出

```javascript
var scope = "global scope";
function checkScope() {
  var scope = "local scope";
  function f() {
    return scope;
  }
  return f;
}
 
checkScope()();
```

### 关于 new，判断以下代码输出

> 题目：关于 new，判断以下代码输出

```javascript
function F () {
 this.a = 3;
 return {
   a: 4;
 }
}
 
const f = new F();
console.log(f.a);
```


