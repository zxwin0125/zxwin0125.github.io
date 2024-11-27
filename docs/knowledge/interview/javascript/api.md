---
title: JavaScript 面试重点 —— API
category:
	- 面试
tag:
	- JavaScript
---

### JS 中基本数据类型有哪些

> 题目：JS 中基础数据类型有哪些

- 七种，文档见 [基本数据类型 - MDN](https://developer.mozilla.org/zh-CN/docs/Glossary/Primitive)
  - number
  - bigint: 这个常常会忽略，最新加入的
  - string
  - undefined
  - null
  - symbol
  - bool

### 类数组转化为数组

> 题目：js 中如何把类数组转化为数组

```javascript
Array.from(arrayLike);
Array.apply(null, arrayLike);
Array.prototype.concat.apply([], arrayLike);
```

### 可选链操作符，如何访问数组与函数

> 题目：js 中什么是可选链操作符，如何访问数组

- 文档见 [可选链操作符 - MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Optional_chaining)
- ?. 操作符，可以嵌套获取对象的属性值
- 通过获取对象属性获得的值可能是 undefined 或 null 时，可选链操作符提供了一种方法来简化被连接对象的值访问

```javascript
const o = {}
 
// 添加可选链之前
o && o.a && o.a.b && o.a.b.c && o.a.b.c.d
 
// 添加可选链之后
o?.a?.b?.c?.d
```

### 什么是 Iterable 对象，与 Array 有什么区别

> 题目：什么是 Iterable 对象，与 Array 有什么区别

- 实现了 [Symbol.iterator] 属性的对象即是 Iterable 对象，然后可以使用操作符 for...of 进行迭代

```javascript
> l = [1, 2, 3, 4]
< (4) [1, 2, 3, 4]
> l[Symbol.iterator]
< ƒ values() { [native code] }
```

### 解构赋值以下对象，他们的值是多少

> 题目：解构赋值对象，他们的值是多少

```javascript
const {a: aa, b } = {a: 3, b: 4}
```

- 分别打印 a、aa、b，他们的值是多少

```javascript
const { a: aa, b } = { a: 3, b: 4 };
// 其中 a 报错、aa 为3, b 为 4
```

### Map 与 WeakMap 有何区别

> 题目：Map 与 WeakMap 有何区别

- Map: 可使用任何数据类型作为 key，但因其在内部实现原理中需要维护两个数组，存储 key/value，因此垃圾回收机制无法回收
- WeakMap: 只能使用引用数据类型作为 key，弱引用，不在内部维护两个数组，可被垃圾回收，但因此无法被遍历！即没有与枚举相关的 API，如 keys、values、entries 等

### 如何判断某一个值是数组

> 题目：如何判断某一个值是数组

```javascript
const isArray = Array.isArray || list => ({}).toString.call(list) === '[object Array]'
```

### 简述 Object.defineProperty

> 题目：简述 Object.defineProperty

- 与直接为一个对象的属性赋值(o.a = 3)不同，Object.defineProperty 可更为精确，拥有更多选项地为对象属性赋值
- 属性描述符拥有两种: 数据描述符与存取描述符

### Object.keys 与 Object.getOwnPropertyNames() 有何区别

> 题目：Object.keys 与 Object.getOwnPropertyNames() 有何区别

- Object.keys: 列出可枚举的属性值
- Object.getOwnPropertyNames: 列出所有属性值(包括可枚举与不可枚举)
- 同时 Object.defineProperty 中的选项 enumerable 可定义属性是否可枚举

### 如何创建一个数组大小为100，每个值都为0的数组

> 题目：如何创建一个数组大小为100，每个值都为0的数组

```javascript
// 方法一:
Array(100).fill(0);
 
// 方法二:
// 注: 如果直接使用 map，会出现稀疏数组
Array.from(Array(100), (x) => 0);
 
// 方法二变体:
Array.from({ length: 100 }, (x) => 0);
```

