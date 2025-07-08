---
title: this 到底指向谁呢？
description: this 到底指向谁呢？
keywords: JavaScript, this 指向
---

# this 到底指向谁呢？

> [!tip] 用一句话总结 this 的指向，你会怎么说？注意只用一句话
> 我之前会这样回答：this 的指向是在调用的时候确定的，也就是说谁调用了 this，this 就指向谁

这么说没啥大问题，但是也不全面，如果面试官要求用更加规范的语言进行总结，那这时候该怎么回答好？

> 我觉得还是要回到 JavaScript 中一个最基本的概念来分析，那就是 **<font color=red>执行上下文</font>**

> [!important] 实际上
> 在 JavaScript 中，调用函数的时候，就会创建出一个新的属于函数本身的执行上下文，而在执行上下文创建的时候，确定了 this 的指向
>
> 所以，<font color=red>this 的指向，是在调用函数时根据执行上下文所动态确定的</font>

## 具体分析下 this 的规则

### 1. 全局环境下的 this

> <font color=red>在浏览器全局环境中调用函数，如果是非严格模式，this 指向 window，如果是 use strict 严格模式，this 指向 undefined</font>

示例

```js
function f1() {
  console.log(this)
}
function f2() {
  'use strict'
  console.log(this)
}
f1() // window
f2() // undefined
```

把示例变种一下

- fn 函数在 foo 对象中被引用，把 fn 函数再赋值给 fn1，并执行 fn1

```js
const foo = {
  bar: 10,
  fn: function () {
    console.log(this) // window
    console.log(this.bar) // undefined
  }
}
var fn1 = foo.fn
fn1()
```

> [!tip] 解析
> 虽然 fn 赋值给了 fn1，但是 fn1 的执行仍然是在 window 的全局环境中，所以实际上的执行是以下这样的：

```js
console.log(window)
console.log(window.bar)
```

再变种一下

- 直接调用 foo 对象中引用的 fn 函数

```js
const foo = {
  bar: 10,
  fn: function () {
    console.log(this) // { bar: 10, fn: ƒ }
    console.log(this.bar) // 10
  }
}
foo.fn()
```

> [!tip] 解析
> 这个时候是 foo 对象调用的 fn 函数，fn 函数里的 this 指向的是最后调用它的 foo 对象
>
> <font color=red>在调用函数时，如果函数里的 this 是被上一级的对象所调用的，那这个 this 指向的就是上一级的那个对象，否则指向全局环境</font>

### 2. 上下文对象调用中的 this

如果有更复杂的嵌套关系呢，这时候 this 又指向谁呢？

示例

```js
const person = {
  name: 'zxwin',
  brother: {
    name: 'Mike',
    fn: function () {
      return this.name
    }
  }
}
console.log(person.brother.fn()) // Mike
```

像以上这种嵌套关系，this 指向的是最后调用它的那个对象，即 brother 这个对象，所以输出 Mike

进阶一下

```js
const o1 = {
  text: 'o1',
  fn: function () {
    return this.text
  }
}

const o2 = {
  text: 'o2',
  fn: function () {
    return o1.fn()
  }
}

const o3 = {
  text: 'o3',
  fn: function () {
    // 将 o1.fn 方法的引用赋值给局部变量 fn
    // 此时 fn 是一个独立函数，脱离了对象绑定，不再关联 o1 对象，也不关联 o3 对象
    var fn = o1.fn
    // 独立函数调用，默认绑定，this 指向全局对象或严格模式下的 undefined
    return fn()
  }
}

console.log(o1.fn()) // o1
console.log(o2.fn()) // o1
console.log(o3.fn()) // undefined
```

> [!tip] 解析
>
> - 第一个 console，fn 函数是作为 o1 对象的方法被调用的，fn 函数里面的 this 指向 fn 函数的上一级 o1 对象，也就是 o1.text，输出 'o1'
> - 第二个 console，o2 对象里的 fn 函数最终还是调用 o1 对象里的 fn 函数，this 指向的还是 o1 对象，也就是 o1.text，输出 'o1'

> [!important] 重点解析
> 第三个 console，在 o3 对象的 fn 函数里进行 var fn = o1.fn 赋值操作
>
> - 赋值之后，fn 只是对 o1 对象里的 fn 函数的引用，不和任何对象进行绑定了，fn 是独立函数
> - return fn() 是直接调用 fn 这个独立函数，那在严格模式下，this 指向 undefined，非严格模式，指向全局对象，如果在浏览器中，就是 window
> - 所以 this.text 相当于 window.text，返回 undefined

> [!warning] 为啥 fn 是独立函数？
>
> - 在 JavaScript 中，函数本质上都是独立的，不会永久的绑定到任何特定的对象
> - 当执行 var fn = o1.fn 时，只是复制了这个函数引用，而不是连同它的上下文一起复制，不会自动携带 o1 的绑定
> - 而 o1.fn() 里的 fn 是作为方法调用，里面的语法 obj.method() 会隐式设置 this 的绑定，所以这里 this 会自动绑定到 o1

<font color=red>如果需要让 o2.fn() 输出 o2，该怎么做呢？</font>

- 最简单的方式就是用 bind/call/apply 对 this 的指向进行显示绑定

```js
const o2 = {
  text: 'o2',
  fn: function () {
    return o1.fn.call(this) // 显式绑定 this 到当前对象
  }
}
```

<font color=red>如果不能使用 bind/call/apply，还有别的方法吗？</font>

- 可以这样写

```js
const o1 = {
  text: 'o1',
  fn: function () {
    return this.text
  }
}

const o2 = {
  text: 'o2',
  // o2.fn 引用了 o1 的 fn 函数，但是并没有把这个函数作为方法去执行
  fn: o1.fn
}

// 当执行 o2 对象里的 fn 函数，这个时候，fn 就作为 o2 对象的方法调用
// 会将 this 隐式绑定到调用 fn 方法的 o2 对象上
o2.fn()
```

还是那个结论

- <font color=red>this 指向最后调用它的对象</font>，在 o2 对象中，提前进行 fn 函数的赋值操作，把 fn 函数挂载到 o2 对象上，这样在 fn 执行的时候，this 就会隐式绑定到 o2 对象上

### 3. bind / call / apply 改变 this 指向

> 通常 bind / call / apply 是用来改变 this 指向的，那 <font color=red>bind / call / apply 三个方法的区别是啥呢？</font>

> [!important] 区别
>
> - call / apply 是直接执行这个函数的调用，它们两个的区别主要体现在参数的设定方式
> - bind 不会执行这个函数，而是返回一个新的函数，这个新的函数已经自动绑定了新的 this 指向，我们只需要手动调用新的函数就行了

**示例**

```js
const target = {}
fn.call(target, 'arg1', 'arg2')

// 相当于：
const target = {}
fn.apply(target, ['arg1', 'arg2'])

// 相当于：
const target = {}
fn.bind(target, 'arg1', 'arg2')()
```

**实战例题**

```js
const foo = {
  name: 'zx',
  logName: function () {
    console.log(this.name)
  }
}

const bar = {
  name: 'mike'
}

console.log(foo.logName.call(bar)) // mike
console.log(foo.logName.bind(bar)()) // mike（注意需要加 () 执行）
```

这里使用了 call 方法将 logName 函数的 this 显式绑定到了 bar 对象，所以 this.name 访问的是 bar.name，输出 "mike"，bind 同理

### 4. 构造函数和 this

先看下示例

```js
function Foo() {
  this.bar = 'zx'
}
const instance = new Foo()
console.log(instance.bar) // zx
```

通过上面的例子发现，<font color=red>构造函数内部的 this 是指向新创建的实例对象的</font>

那这是为啥呢，是不是这个 new 操作符在调用构造函数的时候，做了特殊什么处理？

- 创建一个新的空对象，将这个新对象的原型 `__proto__` 指向构造函数的原型对象 `prototype`
- 将构造函数的 this 指向这个新对象，为这个对象添加属性、方法等，最终返回新对象

用代码来表示就是这样的

```js
var obj = {}
obj.__proto__ = Foo.prototype
Foo.call(obj)
```

> [!warning] 注意
> 如果在构造函数中出现了显式 return 的情况，那么需要分情况讨论了

示例一

- 最终会输出 undefined，因为此时的 instance 返回的是空对象 obj

```js
function Foo() {
  this.user = 'zx'
  const obj = {}
  return obj
}
const instance = new Foo()
console.log(instance.user) // undefined
```

示例二

```js
function Foo() {
  this.user = 'zx'
  return 1
}
const instance = new Foo()
console.log(instance.user) // zx
```

也就是说此时 instance 是返回的目标对象实例 this

> [!important] 结论
>
> - 如果构造函数中显式返回一个值，且返回的是一个对象，那么 this 就指向这个返回的对象
> - 如果返回的不是一个对象，那么 this 仍然指向实例

### 5. 箭头函数中的 this 指向

> [!important] 结论
> 箭头函数使用 this 不适用以上标准规则，而是根据外层（函数或者全局）上下文来决定

```js
const foo = {
  fn: function () {
    setTimeout(function () {
      console.log(this)
    })
  }
}
console.log(foo.fn())
```

这道题中，this 出现在 setTimeout() 中的匿名函数里，因此 this 指向 window 对象

如果需要 this 指向 foo 这个 object 对象，可以巧用箭头函数解决：

```js
const foo = {
  fn: function () {
    setTimeout(() => {
      console.log(this)
    })
  }
}
console.log(foo.fn())

// {fn: ƒ}
```

单纯箭头函数中的 this 非常简单，但是综合所有情况，结合 this 的优先级考察，这时候 this 指向并不好确定

### 6. this 优先级相关

通过 call、apply、bind、new 对 this 绑定的情况称为显式绑定，根据调用关系确定的 this 指向称为隐式绑定

<font color=red>那么显式绑定和隐式绑定谁的优先级更高呢？</font>

请看例题：

```js
function foo(a) {
  console.log(this.a)
}

const obj1 = {
  a: 1,
  foo: foo
}

const obj2 = {
  a: 2,
  foo: foo
}

obj1.foo.call(obj2) // 2
obj2.foo.call(obj1) // 1
```

输出分别为 2、1，也就是说 call、apply 的显式绑定一般来说优先级更高

```js
function foo(a) {
  this.a = a
}

const obj1 = {}

var bar = foo.bind(obj1)
bar(2)
console.log(obj1.a) // {a: 2}
```

上述代码通过 bind，将 bar 函数中的 this 绑定为 obj1 对象

执行 bar(2) 后，obj1.a 值为 2，即经过 bar(2) 执行后，obj1 对象为：`{ a: 2 }`

当再使用 bar 作为构造函数时，将会输出 3

```js
var baz = new bar(3)
console.log(baz.a) // 3
```

bar 函数本身是通过 bind 方法构造的函数，其内部已经对将 this 绑定为 obj1，它再作为构造函数，通过 new 调用时，返回的实例已经与 obj1 解绑

> [!tip] 也就是说
> <font color=red>new 绑定修改了 bind 绑定中的 this，因此 new 绑定的优先级比显式 bind 绑定更高</font>

再看：

```js
function foo() {
  return a => {
    console.log(this.a)
  }
}

const obj1 = {
  a: 2
}

const obj2 = {
  a: 3
}

const bar = foo.call(obj1)
console.log(bar.call(obj2)) // 2
// 由于箭头函数在定义时捕获了其外层的 this
// 而 foo 函数在调用时 this 被绑定为 obj1，因此箭头函数 bar 中的 this 永远指向 obj1
// 即使在调用 bar.call(obj2) 时试图改变 this 为 obj2，箭头函数内的 this 不受影响，仍然是 obj1
```

将会输出 2

由于 foo() 的 this 绑定到 obj1，bar（引用箭头函数）的 this 也会绑定到 obj1，箭头函数的绑定无法被修改

如果将 foo 完全写成箭头函数的形式，将会输出 123

```js
var a = 123
const foo = () => a => {
  console.log(this.a)
}

const obj1 = {
  a: 2
}

const obj2 = {
  a: 3
}

var bar = foo.call(obj1)
console.log(bar.call(obj2))
```

这里仅仅将上述代码的第一处变量 a 的赋值改为：

```js
const a = 123
const foo = () => a => {
  console.log(this.a)
}

const obj1 = {
  a: 2
}

const obj2 = {
  a: 3
}

var bar = foo.call(obj1)
console.log(bar.call(obj2)) // undefined
```

答案将会输出为 undefined

- 原因是因为使用 const 声明的变量不会挂载到 window 全局对象当中
- 因此 this 指向 window 时，自然也找不到 a 变量了

### 开放例题分析

> 事实上，this 的指向涉及的规范繁多，优先级也较为混乱，其中，最典型的一道题目为：<font color=red>实现一个 bind 函数</font>

```js
Function.prototype.bind =
  Function.prototype.bind ||
  function (context) {
    var me = this
    var args = Array.prototype.slice.call(arguments, 1)
    return function bound() {
      var innerArgs = Array.prototype.slice.call(arguments)
      var finalArgs = args.concat(innerArgs)
      return me.apply(context, finalArgs)
    }
  }
```

这样的实现已经非常不错了，但是，就如同之前 this 优先级分析所示：<font color=red>bind 返回的函数如果作为构造函数，搭配 new 关键字出现的话，绑定 this 就需要'被忽略'</font>

为了实现这样的规则，开发者就应该需要考虑如何区分这两种调用方式，<font color=red>具体来讲 bound 函数中就要进行 this instanceof 的判断</font>

另外一个细节是，函数具有 length 属性，表示形参的个数

- 上述实现方式形参的个数显然会失真
- 代码的实现就需要对 length 属性进行还原
