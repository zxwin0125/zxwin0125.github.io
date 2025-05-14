---
article: false
title: 那些年常考的前端算法
date: 2021-05-03
order: 4
---

在上一讲中，我们全面梳理了重要的数据结构，并用 JavaScript 对各种数据结构进行了实现和方法模拟。数据结构常与算法一起出现，两者相互依存密不可分。这一讲，我们来研究一下「那些年常考的前端算法」。

主要内容如下：

我们将通过三讲的内容来剖析算法问题。本讲先「轻松」一下，主要介绍前端和算法的关系，以及算法中的一些基本概念。

## 前端和算法

前端和算法有什么关系呢？我想先纠正两个常见的错误认知。

### 关于算法的误解
+ 前端没有算法？

「前端没有算法」这种说法往往出自算法岗甚至后端读者，这种认知是错误的。前端不仅有算法，而且算法在前端开发中占据的地位也越来越重要。我们常提到的 Virtual dom diff、webpack 实现、React fiber、React hooks、响应式编程、浏览器引擎工作方式等都有算法的影子。在业务代码中，哪怕写一个抽奖游戏，写一个混淆函数都离不开算法。

+ 算法重要不重要？

有读者认为，前端中算法只是提供了一些偏底层的能力和实现支持，我在业务开发中真正使用到算法的场景也很有限。事实上，不仅单纯的前端业务，哪怕对于后端业务来说，真正让你「徒手」实现一段算法的场景也不算多。但是据此得出算法不重要的说法还是太片面了。为什么高阶面试中总会问到算法呢？因为算法很好地反应了候选者编程思维和计算机素养；另一方面，如果我们想进阶，算法也是必须要攻克的一道难关。

### 前端和算法简单举例

我就先举一个例子作为引子，一起先热热身，看看算法应用在前端开发中的一个小细节。

想必不少读者写过「抽奖」代码，或者「老虎机」转盘。其中可能会涉及到一个问题，就是：

「如何将一个 JavaScript 数组打乱顺序？」

事实上乱序一个数组不仅仅是前端课题，那么这个问题在前端的背景下，有哪些特点呢？可能有读者首先想到使用数组的 sort API，再结合 Math.random 实现：

```jsx
[12,4,16,3].sort(function() {
   return .5 - Math.random();
})
```

这样的思路非常自然，但也许你不知道：这不是真正意义上的完全乱序。

为此我们进行验证，对数组

```bash
let letters = ['A','B','C','D','E','F','G','H','I','J']
```

使用 array.sort 方法进行了 10000 次乱序处理，并对乱序之后得到的新数组中，每一个字母出现的位置进行统计，并可视化输出：

   


不管点击按钮几次，你都会发现整体乱序之后的结果绝对不是「完全随机」。

比如，A 元素大概率出现在数组的头部，J 元素大概率出现在数组的尾部，所有元素大概率停留在自己初始位置。

这是为什么呢？

究其原因，在 Chrome v8 引擎源码中，可以清晰看到：

v8 在处理 sort 方法时，使用了插入排序和快排两种方案。当目标数组长度小于 10（不同版本有差别）时，使用插入排序；反之，使用快排。

其实不管用什么排序方法，大多数排序算法的时间复杂度介于 O(n) 到 O(n2) 之间，元素之间的比较次数通常情况下要远小于 n(n-1)/2，也就意味着有一些元素之间根本就没机会相比较（也就没有了随机交换的可能），这些 sort 随机排序的算法自然也不能真正随机。

通俗地说，其实我们使用 array.sort 进行乱序，理想的方案或者说纯乱序的方案是：数组中每两个元素都要进行比较，这个比较有 50% 的交换位置概率。如此一来，总共比较次数一定为 n(n-1)。

而在 sort 排序算法中，大多数情况都不会满足这样的条件，因此当然不是完全随机的结果了。

那为了满足乱序一个数组的需求，我们应该怎么做呢？

Fisher–Yates shuffle 洗牌算法——会是一个更好的选择。这里，我们简单借助图形来理解，非常简单直观。接下来就会明白为什么这是理论上的完全乱序（图片来源于网络）。

首先我们有一个已经排好序的数组：

   


Step1：

这一步需要做的就是，从数组末尾开始，选取最后一个元素。

   


在数组一共 9 个位置中，随机产生一个位置，该位置元素与最后一个元素进行交换。

   


Step2：

在上一步中，我们已经把数组末尾元素进行随机置换。

接下来，对数组倒数第二个元素动手。在除去已经排好的最后一个元素位置以外的 8 个位置中，随机产生一个位置，该位置元素与倒数第二个元素进行交换。

   


Step3：

理解了前两步，接下来就是依次进行，如此简单。

   


明白了原理，代码实现也很简单：

```php
Array.prototype.shuffle = function() {
   var array = this;
   var m = array.length,
       t, i;
   while (m) {
       i = Math.floor(Math.random() * m--);
       t = array[m];
       array[m] = array[i];
       array[i] = t;
   }
   return array;
}
```

## 算法的基本概念

在具体讲解各种算法前，我们有必要先掌握基本概念。搞定算法，需要读者优先了解数据结构以及各种结构的相关方法，这些内容上一讲中已经进行了梳理。另外一个重要概念就是算法复杂度了，它是评估一个算法优秀程度的重要考证。我们常说的时间复杂度和空间复杂度该如何理解呢？

### 时间复杂度

我们先看一下时间复杂度的概念：

一个算法的时间复杂度反映了程序运行从开始到结束所需要的时间。把算法中基本操作重复执行的次数（频度）作为算法的时间复杂度。

但是时间复杂度的计算既可以「有理可依」，又可以靠「主观感觉」。通常我们认为：

+ 没有循环语句，时间复杂度记作 O(1)，我们称为常数阶；
+ 只有一重循环，那么算法的基本操作的执行频度与问题规模 n 呈线性增大关系，记作 O（n），也叫线性阶。

那么如何让时间复杂度的计算「有理可依」呢？来看几个原则：

+ 只看循环次数最多的代码
+ 加法法则：总复杂度等于量级最大的那段代码的复杂度
+ 乘法法则：嵌套代码的复杂度等于嵌套内外复杂度的乘积

我们来逐一分析：

```jsx
const cal = n => {
  let sum = 0
  let i = 1
  for (; i <= n; ++i) {
    sum = sum + i
  }
  return sum
}
```

执行次数最多的是 for 循环及里面的代码，执行了 n 次，应该「只看循环次数最多的代码」原则，因此时间复杂度为 O(n)。

```jsx
const cal = n => {
  let sum1 = 0
  let p = 1

  for (; p < 100; ++p) {
    sum1= sum1 + p
  }

  let sum2 = 0
  let q = 1
  for (; q < n; ++q) {
    sum2 = sum2 + q
  }

  let sum3 = 0
  let i = 1
  let j = 1
  for (; i <= n; ++i) {
    j = 1
    for (; j <= n; ++j) {
      sum3 = sum3 +  i * j
    }
  }

  return sum1 + sum2 + sum3
}
```

上述代码分别对 sum1、sum2、sum3 求和：

+ 对于 sum1 求和，循环 100 次，常数执行时间，时间复杂度为 O(1)；
+ 对于 sum2 求和，循环规模为 n，时间复杂度为 O(n)；
+ 对于 sum3 求和，两层循环，时间复杂度为 O(n²)。

因此 O(1) + O(n) + O(n²)，取三段代码的最大量级，上面例子最终的时间复杂度为 O(n²)。

对于代码：

```jsx
const cal = n => {
  let ret = 0
  let i = 1
  for (; i < n; ++i) {
    ret = ret + f(i); // 注意  f(i)
  }
}

const f = n => {
 let sum = 0
 let i = 1
 for (; i < n; ++i) {
   sum = sum + i
 }
 return sum
}
```

方法 cal 循环里面调用 f 方法，而 f 方法里面也有循环，这时应用第三个原则——乘法原则，得到时间复杂度 O(n²)。

最后我们再看一个对数阶的概念：

```jsx
const aFun = n => {
 let i = 1;
 while (i <= n)  {
    i = i * 2
 }
 return i
}

const cal = n => {
  let sum = 0
  for (let i = 1; i <= n; ++i) {
    sum = sum + aFun(n)
  }
  return sum
}
```

这里的不同之处是 aFun 每次循环，i = i * 2，那么自然不再是全遍历。想想高中学过的等比数列：

```plain
2^0 * 2^1 * 2^2 * 2^k * 2^x = n
```

因此，我们只要知道 x 值是多少，就知道这行代码执行的次数了，通过 2x = n 求解 x，数学中求解得 x = log2n 。即上面代码的时间复杂度为 O(log2n)。

但是不知道读者有没有发现：不管是以 2 为底，还是以 K 为底，我们似乎都把所有对数阶的时间复杂度都记为 O(logn)。这又是为什么呢？

事实上，基本的数学概念告诉我们：对数之间是可以互相转换的，log3n = log32 log2n，因此 O(log3n) = O(C log2n)，其中 C=log32 是一个常量。所以全部以 2 为底，并没有什么问题。

总之，需要读者准确理解：由于时间复杂度描述的是算法执行时间与数据规模的增长变化趋势，因而常量、低阶、系数实际上对这种增长趋势不产生决定性影响，所以在做时间复杂度分析时忽略这些项。

最好、最坏时间复杂度，平均时间复杂度，均摊时间复杂度  
我们来看一段代码：

```jsx
const find = (array, x) => {
   let pos = -1
   let len = array.length
   for (let i = 0 ; i < n; ++i) {
       if (array[i] === x) {
           pos = i
       }
   }
   return pos
}
```

上面的代码有一层循环，循环规模和 n 成线性关系。因此时间复杂度为 O(n)，我们改动代码为：

```jsx
const find = (array, x) => {
   let pos = -1
   let len = array.length
   for (let i = 0 ; i < n; ++i) {
       if (array[i] === x) {
           pos = i
           return pos
       }
   }
  
}
```

在找到第一个匹配元素后，循环终止，那么时间复杂度就不一定是 O(n) 了，因此就有了最好时间复杂度、最坏时间复杂度的区别。针对上述代码最好时间复杂度就是 O(1)、最坏时间复杂度还是 O(n)。

最好时间复杂度、最坏时间复杂度其实都是极端情况，我们可以从统计学角度给出一个平均时间复杂度。在上述代码中，平均时间复杂度的计算方式应该是：

```plain
(1/(n+1)) * 1 + (1/(n+1)) * 2 + ... + (1/(n+1)) * n + (1/(n+1)) * n
```

得到结果为：`n(n+3)/2(n+1)`

因为变量 x 出现在数组中的位置分别有 0 —— n－1 种情况，对应需要遍历的次数；除此之外，还有变量 x 不出现在数组中，这种情况仍然后遍历完数组。

上述结果简化之后仍然得到 O(n)。

我们再来看一段代码：

```jsx
let array = new Array(n)
let count = 0
function insert(val) {
   let len = array.length
   if (count === len) {
       let sum = 0
       for (let i = 0; i < len; i++) {
           sum = sum + array[i]
       }
       array[0] = sum
       count = 1
   }
   array[count] = val
   ++count
}
```

这段代码逻辑很简单：我们实现了一个往数组中插入数据的功能。但是多了些判断：当数组满了之后，即 count === len 时，采用 for 循环对数组进行求和，求和完毕之后：先清空数组，然后将求和之后的结果放到数组的第一个位置，最后再将新的数据插入。

这是一段非常典型的代码，我们来看它的时间复杂度：

+ 最好时间复杂度  
数组中有空闲，count !== len，直接执行插入操作，复杂度为 O(1)。
+ 最好时间复杂度  
数组已满，count === len，需要先遍历一遍再求和，复杂度为 O(n)。
+ 平均时间复杂度  
假设数组长度为 n，数组空闲时，复杂度为 O(1)；数组已满，复杂度为 O(n)。采用平均加权方式：`(1/(n+1)) * 1 + (1/(n+1)) * 1 + ... + (1/(n+1)) * n`  
公式求和仍为 O(1)，主观上想：我们的操作是在进行了 n 个 O(1) 的插入操作后，此时数组满了，执行一次 O(n) 的求和和清空操作。这样一来，其实前面的 n 个 O (1) 和最后的 1 个 O(n) 其实是可以抵消掉的，这是一种均摊时间复杂度的概念。

这种均摊的概念是有实际应用场景的。例如，C++ 里的 vector 动态数组的自动扩容机制，每次往 vector 里 push 值的时候会判断当前 size 是否等于 capacity，一旦元素超过容器限制，则再申请扩大一倍的内存空间，把原来 vector 里的值复制到新的空间里，触发扩容的这次 push 操作的时间复杂度是 O(n)，但均摊到前面 n 个元素后，可以认为时间复杂度是 O(1) 常数。

## 最后总结一下，常见时间复杂度：

+ O(1)：基本运算 +、-、*、/、%、寻址
+ O(logn)：二分查找，跟分治（Divide & Conquer）相关的基本上都是 logn
+ O(n)：线性查找
+ O(nlogn)：归并排序，快速排序的期望复杂度，基于比较排序的算法下界
+ O(n²)：冒泡排序，插入排序，朴素最近点对
+ O(n³)：Floyd 最短路，普通矩阵乘法
+ O(2ⁿ)：枚举全部子集
+ O(n!)：枚举全排列
+ O(logn) 近似于是常数的时间复杂度，当 n 为 ![](https://cdn.nlark.com/yuque/0/2024/svg/22361634/1726448636325-78215adc-9c60-400b-a579-83e74c3101ba.svg) 的规模时 logn 也只是 32 而已； 对于顺序执行的语句或者算法，总的时间复杂度等于其中最大的时间复杂度。例如，O(n²) + O(n) 可直接记做 O(n²)。

### 空间复杂度

空间复杂度表示算法的存储空间与数据规模之间的增长关系。常见的空间复杂度：O(1)、O(n)、O(n²)，像 O(logn)、O(nlogn) 这样的对数阶复杂度平时都用不到。有的题目在空间上要求 in-place（原地），是指使用 O(1) 空间，在输入的空间上进行原地操作，比如字符串反转。但 in-place 又不完全等同于常数的空间复杂度，比如数组的快排认为是 in-place 交换，但其递归产生的堆栈的空间是可以不考虑的，因此 in-place 相对 O(1) 空间的要求会更宽松一点。

对于时间复杂度和空间复杂度，开发者应该有所取舍。在设计算法时，可以考虑「牺牲空间复杂度，换取时间复杂度的优化」，反之依然。空间复杂度我们不再过多介绍。

## 总结

本讲我们介绍了算法的基本概念，重点就是时间复杂度和空间复杂度分析，同时剖出了一个「乱序数组」算法进行热身。算法的大门才刚刚打开，请读者继续保持学习。

上一讲我们剖析了算法的一些基本概念。这一讲将围绕 v8 引申出的算法进行分析，同时做一些常见、典型考题。主要内容如下：

## v8 sort 排序的奥秘和演进

前一讲，我带大家分析了「如何将一个 JavaScript 数组打乱顺序？」，其中提到了 sort 这个 API，具体有这样的一段描述：

v8 在处理 sort 方法时，使用了插入排序和快排两种方案。当目标数组长度小于 10（不同版本有差别）时，使用插入排序；反之，使用快排。

如果细心的读者可能会到 v8 源代码中找寻相关的算法逻辑，那么你一定会大失所望。因为根本找不到 10 这样的常量，更没有插入排序和快排两种方案的切换，甚至连实现的预言都不是 JavaScript 或者 C++，这是为什么呢？

原来，在新的 v8 版本中（具体 V8 6.9）已经使用了一种名叫 Torque 的开发语言重构，并在 7.0 改进了 sort 算法。也就是说，现在社区上几乎所有的 V8 排序源码分析都已经过时了。

Torque 是 v8 团队专门为了开发 v8 引擎而开发的语言，他的后缀名是 tq。作为一种高级语言，Torque 依靠 CodeStubAssembler 编译器来转换为汇编代码。

在新的版本中，v8 也采用了一种名叫 Timsort 的全新算法，这套算法最开始于 2002 被 Tim Peters 在 Python 语言中使用。

从这个演进过程中，我们分为三大块来看。

## 快排和插入排序

排序算法多种多样，社区上的分析也比较多。这里我们挑选 v8 sort 排序中「露脸」的快速排序和插入排序进行讲解。

不知道读者是否有这样的困扰：我们看一遍算法，理解了，可是过两天又完全记不得具体讲了什么。针对于此，我们应该结合算法的特点，加以应用，才能深入记忆。排序算法同样如此，对于每一种算法，我们应该先记住其思想，再记住其实现。不过要知道：「排序没有想象中那么简单」。

### 快速排序

快速排序的特点就是分治。如何体现分治策略呢？我们首先在数组中选取一个基准点，叫做 pivot，根据这个基准点：把比基准点小的数组值放在基准点左边，把比基准点大的数组值放在基准点右边。这样一来，基于基准点，左边分区的值都小于基准点，右边分区的值都大于基准点，然后针对左边分区和右边分区进行同样的操作，直到最后排序完成。

最简单的实现：

```javascript
const quickSort = array => {
 if (array.length < 2) {
   return array.slice()
 }

 // 随机找到 pivot
 let pivot = array[Math.floor(Math.random() * array.length)]

 let left = []
 let middle = []
 let right = []

 for (let i = 0; i < array.length; i++) {
   var value = array[i]
   if (value < pivot) {
     left.push(value)
   }

   if (value === pivot) {
     middle.push(value)
   }

   if (value > pivot) {
     right.push(value)
   }
 }

 // 递归进行
 return quickSort(left).concat(middle, quickSort(right))
}
```

这种实现方法有不少优化点，其中之一就是我们可以在原数组上进行操作，而不产生一个新的数组：

```javascript
const quickSort = (array, start, end) => {
 start = start === undefined ? 0 : start
 end = end === undefined ? arr.length - 1 : end;

 if (start >= end) {
   return
 }

 let value = array[start]

 let i = start
 let j = end

 while (i < j) {
   // 找出右边第一个小于参照数的下标并记录
   while (i < j && array[j] >= value) {
     j--
   }

   if (i < j) {
     arr[i++] = arr[j]
   }

   // 找出左边第一个大于参照数的下标，并记录
   while (i < j && array[i] < value) {
     i++
   }

   if (i < j) {
     arr[j--] = arr[i]
   }
 }

 arr[i] = value

 quickSort(array, start, i - 1)
 quickSort(array, i + 1, end)
}
```

调用方式：

```jsx
let arr = [0, 12, 43, 45, 88, 1, 69]
quickSort(arr, 0, arr.length - 1)
console.log(arr)
```

我们该如何理解 in place 的快排算法呢？

首先使用双指针，指针开始遍历，当右边发现一个小于参照数（即 array[start]）的时候，就将该值赋值给起始位置。赋值完之后，那么右边这个位置就空闲了。这时在左边发现比参照数大的值时，就赋值给这个刚刚空闲出来的右边位置。以此类推，直到 i 不再小于 j。经过这一轮操作之后，所有比参照数小的都到了数组的左边，所有比参照数大的都到了数组右边，而数组中间被赋值为参照数。

我们再来分析另外一个优化点。之前的课程中提到了尾递归调用优化，那么上面的快排能否使用尾递归进行优化呢？

我们进行观察，上面的实现最后两行：

```javascript
quickSort(array, start, i - 1)
quickSort(array, i + 1, end)
```

如果能形成以下的形式：

```javascript
return quickSort()
```

那么就实现了尾递归调用优化。为此，我们需要一个 stack 来进行参数信息的传递：

```javascript
const quickSort = (array, stack) => {
 let start = stack[0]
 let end = stack[1]

 let value = array[start]

 let i = start
 let j = end

 while (i < j) {
   while (i < j && array[j] >= value) {
     j--
   }
   if (i < j) {
     array[i++] = array[j]
   }

   while (i < j && array[i] < value) {
     i++
   }

   if (i < j) {
     array[j--] = array[i]
   }
 }

 arr[i] = value

 // 移除已经使用完的下标
 stack.shift()
 stack.shift()

 // 存入新的下标
 if (i + 1 < end) {
   stack.unshift(i + 1, end)
 }
 if (start < i - 1) {
   stack.unshift(start, i - 1)
 }

 if (stack.length == 0) {
   return;
 }

 return quickSort(array, stack)
}
```

最后，关于快速排序的优化点还有一个最重要的方向就是对 pivot 元素的选取。通过上面的分析，我们发现快速排序的算法核心在于选择一个 pivot，将经过比较交换的数组按基准分解为两个数区进行后续递归。

那么试想，如果我们对一个已经有序的数组进行排序，恰好每次选择 pivot 时总是选择第一个或者最后一个元素，那么每次都会有一个数区是空的，递归的层数将达到 n，最后导致算法的时间复杂度退化为 O(n²)。因此 pivot 的选择非常重要。

在早期 v8 使用快速排序时，采用了三数取中（median-of-three）的 pivot 优化方案：除了头尾两个元素再额外选择一个元素参与基准元素的竞争。具体 v8 源代码为：

```jsx
var GetThirdIndex = function(a, from, to) {
   var t_array = new InternalArray();
   // Use both 'from' and 'to' to determine the pivot candidates.
   var increment = 200 + ((to - from) & 15);
   var j = 0;
   from += 1;
   to -= 1;
   for (var i = from; i < to; i += increment) {
       t_array[j] = [i, a[i]];
       j++;
   }
   t_array.sort(function(a, b) {
       return comparefn(a[1], b[1]);
   });
   var third_index = t_array[t_array.length >> 1][0];
   return third_index;
};

var QuickSort = function QuickSort(a, from, to) {
   ......
   while (true) {
       ......
       if (to - from > 1000) {
           third_index = GetThirdIndex(a, from, to);
       } else {
           third_index = from + ((to - from) >> 1);
       }
   }
   ......
};
```

由此看出，这所谓的第三个竞争元素产生方式为：

+ 当数组长度小于等于 1000 时，选择折半位置的元素作为目标元素
+ 当数组长度超过 1000 时，每隔 200-215 个（非固定，跟着数组长度而变化）左右的值，去选择一个元素来先确定一批候选元素。接着在这批候选元素中进行一次排序，将所得的中位值作为目标元素

三数取中（median-of-three）当中，最后选取的是三个元素的中位值作为 pivot。

### 插入排序

插入排序我们还是从特点入手：它先将待排序序列的第一个元素看做一个有序序列，当然了，就一个元素，那么它一定是有序的；而把第二个元素到最后一个元素当成是未排序序列；对于未排序的序列进行遍历，将扫描到的每个元素插入有序序列的适当位置，保证有序序列依然有序，那么直到所有数据都完成，我们也就完成了排序。

如果待插入的元素与有序序列中的某个元素相等，那么我们统一先将待插入元素插入到相等元素的后面。

我们的实现：

```javascript
const insertsSort = array => {
   const length = arr.length
   let preIndex
   let current

   for (let i = 1; i < length; i++) {
       preIndex = i - 1
       current = array[i]

       while (preIndex >= 0 && array[preIndex] > current) {
           array[preIndex + 1] = array[preIndex]
           preIndex--
       }

       array[preIndex + 1] = current
   }
   return array
}
```

那么上述实现的插入排序有优化空间吗？

这是一定的，优化空间主要有这么几个方向：

+ 在遍历未排序序列时，将当前元素插入到有序序列过程中，可以使用二分法减少查找次数（因为是向有序序列插入）
+ 使用链表，将有序数组转为链表这种数据结构，那么插入操作的时间复杂度为 O(1)，查找复杂度变为 O(n)
+ 使用排序二叉树，将有序数组转为排序二叉树结构，然后中序遍历该二叉树，不过这种方式需要额外空间。

采用二分法的优化实现：

```javascript
const insertSort = array => array.reduce(insert, [])

const insert = (sortedArray, value) => {
 const length = sortedArray.length

 if (length === 0) {
   sortedArray.push(value)
   return sortedArray
 }

 let i = 0
 let j = length
 let mid

 // 先判断是否为极端值
 if (value < sortedArray[i]) {
   // 直接插入到数组的最头
   return sortedArray.unshift(value), sortedArray
 }
 if (value >= sortedArray[length - 1]) {
      // 直接插入到数组的最尾
   return sortedArray.push(value), sortedArray
 }

 // 开始二分查找
 while (i < j) {
   mid = ((j + i) / 2) | 0

   if (i == mid) {
     break
   }

   if (value  < sortedArray[mid]) {
     j = mid
   }

   if (value === sortedArray[mid]) {
     i = mid
     break
   }

   if (value > sortedArray[mid]) {
     i = mid
   }
 }

 let midArray = [value]
 let lastArray = sortedArray.slice(i + 1)

 sortedArray = sortedArray
   .slice(0, i + 1)
   .concat(midArray)
   .concat(lastArray)

 return sortedArray
}
```

到此我们介绍完了两种排序方法。事实上，光排序就是一门很深的学问，也涉及到了算法和数据结构的方方面面，我们将继续通过排序，了解更多算法内容。

## 排序的稳定性

事实上，除了 v8 引擎，其他引擎也有不同的 sort 排序规则。比如 SpiderMoney 早期内部实现了归并排序，Chakra 的数组排序算法实现的也是快速排序。Firefox（Firebird）最初版本实现的数组排序算法是堆排序，这也是一种不稳定的排序算法，Mozilla 开发组内部针对这个问题进行了一系列讨论之后，Firefox3 将归并排序作为了数组排序的新实现。

我们知道，快速排序是一种不稳定的排序算法，而归并排序是一种稳定的排序算法。什么是排序的稳定性呢？

简单说，就是能保证排序前 2 个相等的数其在序列的前后位置顺序和排序后它们两个的前后位置顺序相同。形式化一下，如果 array[i] = array[j]，array[i] 原来在位置前，排序后 array[i] 还是要在 array[j] 位置前。

在很多情况下，不稳定的排序也不会造成影响。但是在一些场景中，可能就会「有毒」。比如对于一个数组对象，场景是：

某市的机动车牌照拍卖系统，最终中标的规则为：按价格进行倒排序；相同价格则按照竞标顺位（即价格提交时间）进行正排序。

如果采用不稳定排序，那么结果就有可能不符合预期。  
那么如果一些浏览器引擎实现的排序采用了不稳定排序算法应该怎么办呢？方案：

将待排序数组进行预处理，为每个待排序的对象增加自然序属性，不与对象的其他属性冲突即可。自定义排序比较方法 compareFn，总是将自然序作为前置判断相等时的第二判断维度。

示例代码：

```jsx
const HELPER = Symbol('helper')

const getComparer = compare =>
  (left, right) => {
       let result = compare(left, right)

       return result === 0 ? left[HELPER] - right[HELPER] : result
   }

const sort = (array, compare) => {
   array = array.map(
       (item, index) => {
           if (typeof item === 'object') {
               item[HELPER] = index
           }

           return item
       }
   );

   return array.sort(getComparer(compare))
}
```

近些年来，随着浏览器计算能力的进一步提升，项目正在往富客户端应用方向转变，前端在项目中扮演的角色也越来越重要。算法意识是一个不得忽视的话题。

## Timsort 实现

好了，我们再把话题收回来。那么 v8 采用的 Timsort 算法到底是什么呢？Timsort 结合了归并排序和插入排序，效率更高。Pyhton 自从 2.3 版，Java SE7 和 Android 以来也一直采用 Timsort 算法排序。

我们看一下 JSE7 中对 Timsort 的描述：

A stable, adaptive, iterative mergesort that requires far fewer than n lg(n) comparisons when running on partially sorted arrays, while offering performance comparable to a traditional mergesort when run on random arrays. Like all proper mergesorts, this sort is stable and runs O(n log n) time (worst case). In the worst case, this sort requires temporary storage space for n/2 object references; in the best case, it requires only a small constant amount of space.

Timsort 是稳定且自适应的算法。如果需要排序的数组中存在部分已经排序好的区间，它的时间复杂度会小于 nlogn，它的最坏时间复杂度是 O(nlogn）。在最坏情况下，Timsort 算法需要的临时空间是 n/2，在最好情况下，它只需要一个很小的常量存储空间。

Timsort 算法为了减少对升序部分的回溯和对降序部分的性能倒退，将输入按其升序和降序特点进行了分区。

那么具体的过程：排序输入的单位不是一个个单独的数字，而是一个个分区。其中每一个分区叫一个 run。针对这些 run 序列，每次拿一个 run 出来按规则进行合并。每次合并会将两个 run 合并成一个 run。合并的结果保存到栈中。合并直到消耗掉所有的 run，这时将栈上剩余的 run 合并到只剩一个 run 为止。这时这个仅剩的 run 便是排好序的结果。

这样一来 Timsort 的具体实施规则就是：

+ 如果数组长度小于某个值，直接用二分插入排序算法
+ 找到各个 run，并入栈
+ 按规则合并 run

理解 run 将会是关键，请看图：

  


具体实现我参考部分 [timsort](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2Fbellbind%2Fstepbystep-timsort) 内容：

```jsx
Array.prototype.timsort = function(comp) {
   var global_a = this
   var MIN_MERGE = 32;
   var MIN_GALLOP = 7
   var runBase = [];
   var runLen = [];
   var stackSize = 0;
   var compare = comp;
   sort(this, 0, this.length, compare);

   function sort(a, lo, hi, compare) {
       if (typeof compare != "function") {
           throw new Error("Compare is not a function.");
           return
       }
       stackSize = 0;
       runBase = [];
       runLen = [];
       rangeCheck(a.length, lo, hi);
       var nRemaining = hi - lo;
       if (nRemaining < 2) return;
       if (nRemaining < MIN_MERGE) {
           var initRunLen = countRunAndMakeAscending(a, lo, hi, compare);
           binarySort(a, lo, hi, lo + initRunLen, compare);
           return
       }
       var ts = [];
       var minRun = minRunLength(nRemaining);
       do {
           var runLenVar = countRunAndMakeAscending(a, lo, hi, compare);
           if (runLenVar < minRun) {
               var force = nRemaining <= minRun ? nRemaining : minRun;
               binarySort(a, lo, lo + force, lo + runLenVar, compare);
               runLenVar = force
           }
           pushRun(lo, runLenVar);
           mergeCollapse();
           lo += runLenVar;
           nRemaining -= runLenVar
       } while (nRemaining != 0);
       mergeForceCollapse()
   }

   function binarySort(a, lo, hi, start, compare) {
       if (start == lo) start++;
       for (; start < hi; start++) {
           var pivot = a[start];
           var left = lo;
           var right = start;
           while (left < right) {
               var mid = (left + right) >>> 1;
               if (compare(pivot, a[mid]) < 0) right = mid;
               else left = mid + 1
           }
           var n = start - left;
           switch (n) {
               case 2:
                   a[left + 2] = a[left + 1];
               case 1:
                   a[left + 1] = a[left];
                   break;
               default:
                   arraycopy(a, left, a, left + 1, n)
           }
           a[left] = pivot
       }
   }

   function countRunAndMakeAscending(a, lo, hi, compare) {
       var runHi = lo + 1;
       if (compare(a[runHi++], a[lo]) < 0) {
           while (runHi < hi && compare(a[runHi], a[runHi - 1]) < 0) {
               runHi++
           }
           reverseRange(a, lo, runHi)
       } else {
           while (runHi < hi && compare(a[runHi], a[runHi - 1]) >= 0) {
               runHi++
           }
       }
       return runHi - lo
   }

   function reverseRange(a, lo, hi) {
       hi--;
       while (lo < hi) {
           var t = a[lo];
           a[lo++] = a[hi];
           a[hi--] = t
       }
   }

   function minRunLength(n) {
       var r = 0;
       return n + 1
   }

   function pushRun(runBaseArg, runLenArg) {
       runBase[stackSize] = runBaseArg;
       runLen[stackSize] = runLenArg;
       stackSize++
   }

   function mergeCollapse() {
       while (stackSize > 1) {
           var n = stackSize - 2;
           if (n > 0 && runLen[n - 1] <= runLen[n] + runLen[n + 1]) {
               if (runLen[n - 1] < runLen[n + 1]) n--;
               mergeAt(n)
           } else if (runLen[n] <= runLen[n + 1]) {
               mergeAt(n)
           } else {
               break
           }
       }
   }

   function mergeForceCollapse() {
       while (stackSize > 1) {
           var n = stackSize - 2;
           if (n > 0 && runLen[n - 1] < runLen[n + 1]) n--;
           mergeAt(n)
       }
   }

   function mergeAt(i) {
       var base1 = runBase[i];
       var len1 = runLen[i];
       var base2 = runBase[i + 1];
       var len2 = runLen[i + 1];
       runLen[i] = len1 + len2;
       if (i == stackSize - 3) {
           runBase[i + 1] = runBase[i + 2];
           runLen[i + 1] = runLen[i + 2]
       }
       stackSize--;
       var k = gallopRight(global_a[base2], global_a, base1, len1, 0, compare);
       base1 += k;
       len1 -= k;
       if (len1 == 0) return;
       len2 = gallopLeft(global_a[base1 + len1 - 1], global_a, base2, len2, len2 - 1, compare);
       if (len2 == 0) return;
       if (len1 <= len2) mergeLo(base1, len1, base2, len2);
       else mergeHi(base1, len1, base2, len2)
   }

   function gallopLeft(key, a, base, len, hint, compare) {
       var lastOfs = 0;
       var ofs = 1;
       if (compare(key, a[base + hint]) > 0) {
           var maxOfs = len - hint;
           while (ofs < maxOfs && compare(key, a[base + hint + ofs]) > 0) {
               lastOfs = ofs;
               ofs = (ofs << 1) + 1;
               if (ofs <= 0) ofs = maxOfs
           }
           if (ofs > maxOfs) ofs = maxOfs;
           lastOfs += hint;
           ofs += hint
       } else {
           var maxOfs = hint + 1;
           while (ofs < maxOfs && compare(key, a[base + hint - ofs]) <= 0) {
               lastOfs = ofs;
               ofs = (ofs << 1) + 1;
               if (ofs <= 0) ofs = maxOfs
           }
           if (ofs > maxOfs) ofs = maxOfs;
           var tmp = lastOfs;
           lastOfs = hint - ofs;
           ofs = hint - tmp
       }
       lastOfs++;
       while (lastOfs < ofs) {
           var m = lastOfs + ((ofs - lastOfs) >>> 1);
           if (compare(key, a[base + m]) > 0) lastOfs = m + 1;
           else ofs = m
       }
       return ofs
   }

   function gallopRight(key, a, base, len, hint, compare) {
       var ofs = 1;
       var lastOfs = 0;
       if (compare(key, a[base + hint]) < 0) {
           var maxOfs = hint + 1;
           while (ofs < maxOfs && compare(key, a[base + hint - ofs]) < 0) {
               lastOfs = ofs;
               ofs = (ofs << 1) + 1;
               if (ofs <= 0) ofs = maxOfs
           }
           if (ofs > maxOfs) ofs = maxOfs;
           var tmp = lastOfs;
           lastOfs = hint - ofs;
           ofs = hint - tmp
       } else {
           var maxOfs = len - hint;
           while (ofs < maxOfs && compare(key, a[base + hint + ofs]) >= 0) {
               lastOfs = ofs;
               ofs = (ofs << 1) + 1;
               if (ofs <= 0) ofs = maxOfs
           }
           if (ofs > maxOfs) ofs = maxOfs;
           lastOfs += hint;
           ofs += hint
       }
       lastOfs++;
       while (lastOfs < ofs) {
           var m = lastOfs + ((ofs - lastOfs) >>> 1);
           if (compare(key, a[base + m]) < 0) ofs = m;
           else lastOfs = m + 1
       }
       return ofs
   }

   function mergeLo(base1, len1, base2, len2) {
       var a = global_a;
       var tmp = a.slice(base1, base1 + len1);
       var cursor1 = 0;
       var cursor2 = base2;
       var dest = base1;
       a[dest++] = a[cursor2++];
       if (--len2 == 0) {
           arraycopy(tmp, cursor1, a, dest, len1);
           return
       }
       if (len1 == 1) {
           arraycopy(a, cursor2, a, dest, len2);
           a[dest + len2] = tmp[cursor1];
           return
       }
       var c = compare;
       var minGallop = MIN_GALLOP;
       outer: while (true) {
           var count1 = 0;
           var count2 = 0;
           do {
               if (compare(a[cursor2], tmp[cursor1]) < 0) {
                   a[dest++] = a[cursor2++];
                   count2++;
                   count1 = 0;
                   if (--len2 == 0) break outer
               } else {
                   a[dest++] = tmp[cursor1++];
                   count1++;
                   count2 = 0;
                   if (--len1 == 1) break outer
               }
           } while ((count1 | count2) < minGallop);
           do {
               count1 = gallopRight(a[cursor2], tmp, cursor1, len1, 0, c);
               if (count1 != 0) {
                   arraycopy(tmp, cursor1, a, dest, count1);
                   dest += count1;
                   cursor1 += count1;
                   len1 -= count1;
                   if (len1 <= 1) break outer
               }
               a[dest++] = a[cursor2++];
               if (--len2 == 0) break outer;
               count2 = gallopLeft(tmp[cursor1], a, cursor2, len2, 0, c);
               if (count2 != 0) {
                   arraycopy(a, cursor2, a, dest, count2);
                   dest += count2;
                   cursor2 += count2;
                   len2 -= count2;
                   if (len2 == 0) break outer
               }
               a[dest++] = tmp[cursor1++];
               if (--len1 == 1) break outer;
               minGallop--
           } while (count1 >= MIN_GALLOP | count2 >= MIN_GALLOP);
           if (minGallop < 0) minGallop = 0;
           minGallop += 2
       }
       this.minGallop = minGallop < 1 ? 1 : minGallop;
       if (len1 == 1) {
           arraycopy(a, cursor2, a, dest, len2);
           a[dest + len2] = tmp[cursor1]
       } else if (len1 == 0) {
           throw new Error("IllegalArgumentException. Comparison method violates its general contract!");
       } else {
           arraycopy(tmp, cursor1, a, dest, len1)
       }
   }

   function mergeHi(base1, len1, base2, len2) {
       var a = global_a;
       var tmp = a.slice(base2, base2 + len2);
       var cursor1 = base1 + len1 - 1;
       var cursor2 = len2 - 1;
       var dest = base2 + len2 - 1;
       a[dest--] = a[cursor1--];
       if (--len1 == 0) {
           arraycopy(tmp, 0, a, dest - (len2 - 1), len2);
           return
       }
       if (len2 == 1) {
           dest -= len1;
           cursor1 -= len1;
           arraycopy(a, cursor1 + 1, a, dest + 1, len1);
           a[dest] = tmp[cursor2];
           return
       }
       var c = compare;
       var minGallop = MIN_GALLOP;
       outer: while (true) {
           var count1 = 0;
           var count2 = 0;
           do {
               if (compare(tmp[cursor2], a[cursor1]) < 0) {
                   a[dest--] = a[cursor1--];
                   count1++;
                   count2 = 0;
                   if (--len1 == 0) break outer
               } else {
                   a[dest--] = tmp[cursor2--];
                   count2++;
                   count1 = 0;
                   if (--len2 == 1) break outer
               }
           } while ((count1 | count2) < minGallop);
           do {
               count1 = len1 - gallopRight(tmp[cursor2], a, base1, len1, len1 - 1, c);
               if (count1 != 0) {
                   dest -= count1;
                   cursor1 -= count1;
                   len1 -= count1;
                   arraycopy(a, cursor1 + 1, a, dest + 1, count1);
                   if (len1 == 0) break outer
               }
               a[dest--] = tmp[cursor2--];
               if (--len2 == 1) break outer;
               count2 = len2 - gallopLeft(a[cursor1], tmp, 0, len2, len2 - 1, c);
               if (count2 != 0) {
                   dest -= count2;
                   cursor2 -= count2;
                   len2 -= count2;
                   arraycopy(tmp, cursor2 + 1, a, dest + 1, count2);
                   if (len2 <= 1) break outer
               }
               a[dest--] = a[cursor1--];
               if (--len1 == 0) break outer;
               minGallop--
           } while (count1 >= MIN_GALLOP | count2 >= MIN_GALLOP);
           if (minGallop < 0) minGallop = 0;
           minGallop += 2
       }
       this.minGallop = minGallop < 1 ? 1 : minGallop;
       if (len2 == 1) {
           dest -= len1;
           cursor1 -= len1;
           arraycopy(a, cursor1 + 1, a, dest + 1, len1);
           a[dest] = tmp[cursor2]
       } else if (len2 == 0) {
           throw new Error("IllegalArgumentException. Comparison method violates its general contract!");
       } else {
           arraycopy(tmp, 0, a, dest - (len2 - 1), len2)
       }
   }

   function rangeCheck(arrayLen, fromIndex, toIndex) {
       if (fromIndex > toIndex) throw new Error("IllegalArgument fromIndex(" + fromIndex + ") > toIndex(" + toIndex + ")");
       if (fromIndex < 0) throw new Error("ArrayIndexOutOfBounds " + fromIndex);
       if (toIndex > arrayLen) throw new Error("ArrayIndexOutOfBounds " + toIndex);
   }
}
```

具体操作较为复杂，这里建议大家更多的了解这个知识点，而具体实现一般不作要求。

我们来看一下 v8 在采用 Timsort 之后，得到的一些 benchmark：

更多内容，可以参考 v8 官方博客：[Getting things sorted in V8](https://links.jianshu.com/go?to=https%3A%2F%2Fv8.dev%2Fblog%2Farray-sort)

## 实战例题

从这里开始，我们来「刷」一些实战例题。

### 交换星号

题目：一个字符串中只包含 和数字，请把 号都放开头。

思路：使用两个指针，从后往前扫字符串，遇到数字则赋值给后面的指针，继续往后扫，遇到 * 则不处理。

```jsx
onst isNumeric = n => !isNaN(parseFloat(n)) && isFinite(n);

/**
* @param {string}
* @return {string}
*/
const solution = s => {
   const n = s.length
   let a = s.split('')
   let j = n - 1

   for (let i = n - 1; i >= 0; --i)
       if (isNumeric(a[i])) a[j--] = a[i]

   for (; j >= 0; --j) a[j] = '*'
   return a.join('')
}
```

这样一来，我们逆序操作数组，遇见数字则向后置，遍历完一遍后，所有的数字都已经在后边了，同时把前边的数组项用 * 填充。

### Longest Substring Without Repeating Characters

题意：给定一个字符串，返回它最长的不包含重复的子串长度。例如，输入 abcabcbb 输出 3（对应 abc）。

思路：

+ 暴力枚举起点和终点，并判断重复，时间复杂度是 O(n²)；
+ 通过双指针、滑动窗口，动态维护窗口 [i..j)，使窗口内字符不重复。

我们看第二种思路解法，保证窗口 [i..j) 之间没有重复字符：

+ 首先 i, j 两个指针均指向字符串头部，如果没有重复字符，则 j 不断向右滑动，直到出现重复字符；
+ 如果出现了重复的字符，重复字符出现在第 str[j] 处，这时候开始移动指针 i，找到另一个重复的字读出现在 str[i] 处，那么能保证 [0, i] 以及 [i, j] 子字符串是不重复的，更新临时结果为 Math.max(result, j - i)。  
时间复杂度 O(n)

### 时间复杂度 O(n)

实现：

```rust
const lengthOfLongestSubstring = str => {
   let result = 0
   let len = str.length

   // 记录当前区间内出现的字符
   let mapping = {}

   for (let i = 0, j = 0; ; ++i) {

       // j 右移的过程
       while (j < len && !mapping[str[j]])
           mapping[str[j++]] = true
       result = Math.max(result, j - i)

       if (j >= len)
           break;

       // 出现了重复字符，i 开始进行右移的过程，同时将移出的字符在 mapping 中重置
       while (str[i] != str[j])
           mapping[str[i++]] = false
       mapping[str[i]] = false

   }

   return result
};
```

举这个例子的目的是为了展示滑动窗口的思想，通过滑动窗口一般能实现 O(n) 的时间复杂度和 O(1) 的空间复杂度。

## 总结

这一讲我们主要介绍了几种排序算法和最先进的 Timsort，相信凭借这些内容，在前端排序上你可以「鄙视」面试官了。当然算法的坑还是很深的，我们要保持好的心态。最后部分介绍了两个算法题，算是抛砖引玉，下一讲，让我们针对算法面试，刷一刷算法

前面课程，我们总结了前端和算法的关系，在上一讲中，也已经通过两道题目开启了「刷算法」的热身。算法是面试中必不可少的部分，尤其对于高阶职位来说，算法题目是面试环节的「最难」和「最关键」的环节。

算法说难也不难，我们大可不必「谈虎色变」，有策略地「刷算法题」将会使你更有信心。我认为在课程中一味地「秀算法」，找最高深最偏的算法分析没有任何意义。这里我总结出一些经典的算法题目，我常用来考察候选者以及我作为面试者遇到的一些题目来讲解。

主要内容如下：

  


## 爬楼梯

题目：假设我们需要爬一个楼梯，这个楼梯一共有 N 阶，可以一步跨越 1 个或者 2 个台阶，那么爬完楼梯一共有多少种方式？

示例：输入 2（标注 N = 2，一共是 2 级台阶）；

输出：2 （爬完一共两种方法：一次跨两阶 + 分两次走完，一次走一阶）

示例：输入 3；输出 3（1 阶 + 1 阶 + 1 阶；1 阶 + 2 阶；2 阶 + 1 阶）

思路：最直接的想法其实类似 Fibonacci 数列，使用递归比较简单。比如我们爬 N 个台阶，其实就是爬 N － 1 个台阶的方法数 + 爬 N － 2 个台阶的方法数。

解法：

```javascript
const climbing = n => {
   if (n == 1) return 1
   if (n == 2) return 2
   return climbing(n - 1) + climbing(n - 2)
}
```

我们来分析一下时间复杂度：递归方法的时间复杂度是高度为 n−1 的不完全二叉树节点数，因此近似为 O(2^n)，具体数学公式不再展开。

我们来尝试进行优化。实际上，上述的计算过程肯定都包含了不少重复计算，比如 climbing(N) + climbing(N － 1) 后会计算 climbing(N － 1) + climbing(N － 2)，而实际上 climbing(N － 1) 只需要计算一次就可以了。

优化方案：

```javascript
const climbing = n => {
   let array = []
   const step = n => {
       if (n == 1) return 1
       if (n == 2) return 2
       if (array[n] > 0) return array[n]

       array[n] = step(n - 1) + step(n - 2)
       return array[n]
   }
   return step(n)
}
```

我们使用了一个数组 array 来储存计算结果，时间复杂度为 O(n)。

另外一个优化方向是：所有递归都可以用循环来代替。

```javascript
const climbing = n => {
   if (n == 1) return 1
   if (n == 2) return 2

   let array = []
   array[1] = 1
   array[2] = 2

   for (let i = 3; i<= n; i++) {
       array[i] = array[i - 1] + array[i - 2]
   }
   return array[n]
}
```

时间复杂度仍然为 O(n)，但是我们优化了内存的开销。

因此这道题看似「困难」，其实就是一个 Fibonacci 数列。很多算法题目都是类似的，也许第一次读题会觉得没有思路，但是隐藏在题目后边的解决方案，其实就是我们常见的知识。

## Combination Sum

这个算法，让我们来聚焦「回溯」这两个字，题目出处 [Combination Sum](https://links.jianshu.com/go?to=https%3A%2F%2Fjuejin.im%2Fpost%2F5d1ca2c5e51d4550bf1ae8cd)。

题目：给定一组不含重复数字的非负数组和一个非负目标数字，在数组中找出所有数加起来等于给定的目标数字的组合。

示例：输入

```javascript
const array = [2, 3, 6, 7]
const target = 7
```

输出：

```json
[
 [7],
 [2,2,3]
]
```

我们直接来看优化后的思想：回溯解决问题的套路就是先用「笨办法」，遍历所有的情况来找出问题的解，在这个遍历过程当中，以深度优先的方式搜索解空间，并且在搜索过程中用剪枝函数避免无效搜索。

回到这个问题，我们先通过图来遍历所有情况：

  


对于这个题目，事实上我们思考，数组 [2, 2, 3] 和 [2, 3, 2] 实际是重复的，因此可以删除掉重复的项，优化递归树为：

  


我们该如何用代码描述上述过程呢？这时候需要一个临时数组 tmpArray，进入递归前 push 一个结果，

最终答案：

```jsx
const find = (array, target) => {
   let result = []

   const dfs = (index, sum, tmpArray)  => {
       if (sum === target) {
           result.push(tmpArray.slice())
       }

       if (sum > target) {
           return
       }

       for (let i = index; i < array.length; i++) {
           tmpArray.push(array[i])

           dfs(i, sum + array[i], tmpArray)

           tmpArray.pop()
       }
   }

   dfs(0, 0, [])

   return result    
}
```

如果读者存在理解问题，建议打断点调试一下。回溯是一个非常常见的思想，这也是一个典型的回溯常考题目。

另外，该题有另一个变种：

从一个数组中找出 N 个数，其和为 M 的所有可能。

这里我们指定数组元素个数的和，需要这个和为指定值。

举例：从数组 [1, 2, 3, 4] 中选取 2 个元素，求和为 5 的所有可能。答案是两组组合: [1, 4] 和 [2, 3]。

这里我们介绍一种借助「二进制」实现的解法，可以用 0 和 1 来表示数组中相应的元素是否被选中。因此，对于一个长度为 4 的数组来说：

+ 0000 表示没有选择数组中的任何元素
+ 0100 表示选择了数组中第 1 位元素

以此类推，数组长度为 4，那么上述情况一共有 16 种可能（Math.pow(length, 2)）。

而这道题目中，只需要选择指定数组元素个数的和，还是对于数组长度为 4 的情况：只需要考虑 0011 等 1 的个数累加为 0 case，而不需要考虑类似 0111 这样的 case。

针对符合个数的所有情况，我们进行数组项目的求和，判断是否等于指定值的情况即可：

```jsx
const find = (array, target, sum) => {
 const len = array.length
 let result = []

 for (let i = 0; i < Math.pow(2, len); i++) {
   if (getCount(i) == target) {
     let s = 0
     let temp = []
     for (let j = 0; j < len; j++) {
       if (i & 1 << (len - 1 -j)) {
         s += array[j]
         temp.push(array[j])
       }
     }
     if (s == sum) {
       result.push(temp)
     }
   }
 }
 return result
}

function getCount(i) {
 let count = 0;
 while (i) {
  if (i & 1){
   ++count
  }
  i >>= 1
 }
 return count
}
```

## remove duplicates from sorted array

题目：对一个给定一个排序数组去重，同时返回去重后数组的新长度。

难点：这道题并不困难，但是需要临时加一些条件，即需要原地操作，在使用 O(1) 额外空间的条件下完成。

示例：  
输入：

```javascript
let array = [0,0,1,1,1,2,2,3,3,4]
```

输出：

```javascript
console.log(removeDuplicates(array))
// 5

console.log(array)
// 0, 1, 2, 3, 4
```

这道题既然规定 in-place 的操作，那么可以考虑算法中的另一个重要思想：双指针。

  


### 使用快慢指针：

+ 开始时，快指针和慢指针都指向数组中的第一项
+ 如果快指针和慢指针指的数字相同，则快指针向前走一步
+ 如果快指针和慢指针指的数字不同，则两个指针都向前走一步，同时快指针指向的数字赋值给慢指针指向的数字
+ 当快指针走完整个数组后，慢指针当前的坐标加 1 就是数组中不同数字的个数

代码很简单：

```javascript
const removeDuplicates = array => {
   const length = array.length

   let slowPointer = 0

   for (let fastPointer = 0; fastPointer < length; fastPointer ++) {
       if (array[slowPointer] !== array[fastPointer]) {
           slowPointer++
           array[slowPointer] = array[fastPointer]
       }
   }
}
```

这道题目如果不要求 O(n) 的时间复杂度， O(1) 的空间复杂度，那么会非常简单。如果进行空间复杂度要求，尤其是 in-place 操作，开发者往往可以考虑双指针的思路。

## 求众数

这也是一道简单的题目，关键点在于如何优化。

题目：给定一个大小为 N 的数组，找到其中的众数。众数是指在数组中出现次数大于 N/2 的元素。

可能大家都会想到使用一个额外的空间，记录元素出现的次数，我们往往用一个 map 就可以轻易地实现。那优化点在哪里呢？答案就是投票算法。

```swift
const find = array => {
   let count = 1
   let result = array[0]

   for (let i = 0; i < array.lenght; i++) {
       if (count === 0) result = array[i]

       if (array[i] === result) {
           count++
       }
       else {
           count--
       }
   }

   return result
}
```

## 有效括号

有效括号这个题目和前端息息相关，在之前课程模版解析时，其实都需要类似的算法进行模版的分析，进而实现数据的绑定。我们来看题目：

```javascript
举例：输入 "()"

输出：true

举例：输入 "()[]{}"

输出：true

举例：输入 "{[]}"

输出：false

举例：输入 "([)]"

输出：false
```

这道题目的解法非常典型，就是借助栈实现，将这些括号自右向左看做栈结构。我们把成对的括号分为左括号和右括号，需要左括号和右括号一一匹配，通过一个 Object 来维护关系：

```javascript
let obj = {
   "]": "[",
   "}": "{",
   ")": "(",
}
```

如果编译器中在解析时，遇见左括号，我们就入栈；如果是右括号，就取出栈顶元素检查是否匹配。如果匹配，就出栈；否则，就返回 false。

```javascript
const isValid = str => {
   let stack = []
   var obj = {
       "]": "[",
       "}": "{",
       ")": "(",
   }

   for (let i = 0; i < str.length; i++) {
       if(str[i] === "[" || str[i] === "{" || str[i] === "(") {
           stack.push(str[i])
       }
       else {
           let key = stack.pop()
           if(obj[key] !== str[i]) {
               return false
           }
       }
   }

   if (!stack.length) {
       return true
   }

   return false
};
```

## LRU 缓存算法

看了这么多小算法题目，我们来换一个口味，现在看一个算法的实际应用。

LRU（Least Recently Used）算法是缓存淘汰算法的一种。简单地说，由于内存空间有限，需要根据某种策略淘汰不那么重要的数据，用以释放内存。LRU 的策略是最早操作过的数据放最后，最晚操作过的放开始，按操作时间逆序，如果达到上限，则淘汰末尾的项。

整个 LRU 算法有一定的复杂度，并且需要很多功能扩展。因此在生产环境中建议直接使用成熟的库，比如 npm 搜索 lru-cache。

这里我们尝试实现一个微型体统级别的 LRU 算法：

运用你所掌握的数据结构，设计和实现一个 LRU（最近最少使用）缓存机制。它应该支持以下操作：获取数据 get 和 写入数据 put 。

获取数据 get(key) － 如果密钥 (key) 存在于缓存中，则获取密钥的值（总是正数），否则返回 －1。

写入数据 put(key, value) － 如果密钥不存在，则写入其数据值。当缓存容量达到上限时，它应该在写入新数据之前删除最近最少使用的数据值，从而为新的数据值留出空间。

我们先来整体思考：尽量满足 O(1) 的时间复杂度中完成获取和写入的操作，那么可以使用一个 Object 来进行存储，如果 key 不是简单类型，可以使用 Map 实现：

```jsx
const LRUCache = function(capacity) {
 // ...
 this.map = {};
 // ...
};
```

在这个算法中，最复杂的应该是淘汰策略，淘汰数据的时间复杂度必须是 O(1) 的话，我们一定需要额外的数据结构来完成 O(1) 的淘汰策略。那应该用什么样的数据结构呢？答案是双向链表。

链表在插入与删除操作上，都是 O(1) 时间的复杂度，唯一有问题的查找元素过程比较麻烦，是 O(n)。但是这里我们不需要使用双向链表实现查找逻辑，因为 map 已经很好的弥补了缺陷。

赘述一下：**我们在写入值的时候，判断缓存容量是否已经达到上限，如果缓存容量达到上限时，应该删除最近最少使用的数据值，从而为以后的新的数据值留出空间。**

结合链表的话，我们将刚刚写入的目标值设置为链表的首项，超过限制，就删除链表的尾项。

最终实现：

```javascript
const LRUCache = function(capacity) {
 this.map = {}
 this.size = 0
 this.maxSize = capacity

 // 链表初始化，初始化只有一个头和尾
 this.head = {
   prev: null,
   next: null
 }
 this.tail = {
   prev: this.head,
   next: null
 }

 this.head.next = this.tail
};

LRUCache.prototype.get = function(key) {
 if (this.map[key]) {
   const node = this.extractNode(this.map[key])

   // 最新访问，将该节点放到链表的头部
   this.insertNodeToHead(node)

   return this.map[key].val
 }
 else {
   return -1
 }
}

LRUCache.prototype.put = function(key, value) {
 let node

 if (this.map[key]) {
   // 该项已经存在，更新值
   node = this.extractNode(this.map[key])
   node.val = value
 }
 else {
   // 如该项不存在，新创造节点
   node = {
     prev: null,
     next: null,
     val: value,
     key,
   }

   this.map[key] = node
   this.size++
 }

 // 最新写入，将该节点放到链表的头部
 this.insertNodeToHead(node)

 // 判断长度是否已经到达上限
 if (this.size > this.maxSize) {
   const nodeToDelete = this.tail.prev
   const keyToDelete = nodeToDelete.key
   this.extractNode(nodeToDelete)
   this.size--
   delete this.map[keyToDelete]
 }
};

// 插入节点到链表首项
LRUCache.prototype.insertNodeToHead = function(node) {
 const head = this.head
 const lastFirstNode = this.head.next

 node.prev = head
 head.next = node
 node.next = lastFirstNode
 lastFirstNode.prev = node

 return node
}

// 从链表中抽取节点
LRUCache.prototype.extractNode = function(node) {
 const beforeNode = node.prev
 const afterNode = node.next

 beforeNode.next = afterNode
 afterNode.prev = beforeNode

 node.prev = null
 node.next = null

 return node
}
```

## 链表相关题目

在之前的课程中，我们介绍了链表这种数据结构。链表应用非常广泛，这里来熟悉两个常见的对链表的操作算法。

### 反转链表

题目：对一个单链表进行反转

输入：1→2→3→4→5→NULL

输出：5→4→3→2→1→NULL

最直观的解法是使用三个指针，把头节点变成尾节点点，进行遍历：下一个节点 拼接到当前节点的头部，以此类推。这种方法的实现我们不再手写，而是重点关注一下递归解法。

递归解法就要先判断递归终止条件，当下一个节点为 null，找到尾节点时，将其返回。我们从后往前进行：

```jsx
const reverseList = head => {
  // 到了尾节点，则返回尾节点
  if (head == null || head.next == null) {
      return head
  }
  else {
      let newhead = reverseList(head.next)
      // 将当前节点的一下节点的 next 指向，指向为当前节点
      head.next.next = head
      // 暂时情况当前节点的 next 指向
      head.next = null

      return newhead
  }
}
```

### 删除链表的倒数第 N 个节点

题目：给定一个链表，删除链表的倒数第 n 个节点，并且返回链表的头结点。

输入：1→2→3→4→5，和 n = 2

输出：1→2→3→5

这道题目的关键是如何优雅地找到倒数第 N 个节点。

我们当然可以使用两次循环，第一次循环得到整个链表的长度 L，那么需要删除的节点就位于 L - N + 1 位置处，第二次遍历到相关位置进行操作即可。

这道题其实是可以用一次遍历来解决的。我们需要使用双指针，快指针 fast 先前进 N，找到需要删除的节点；然后慢指针 slow 从 head 开始，和快指针 fast 一起前进，直到 fast 走到末尾。 此时 slow 的下一个节点就是要删除的节点，也就是倒数第 N 个节点。需要注意的是，如果快指针移动 N 步之后，已经到了尾部，那说明需要删除的就是头节点。

```jsx
const removeNthFromEnd = (head, n) => {
   if (head === null) {
       return head
   }

   if (n === 0) {
       return head
   }

   let fast = head
   let slow = head

   // 快指针前进 N 步
   while (n > 0) {
       fast = fast.next
       n--
   }

   // 快指针移动 N 步之后，已经到了尾部，那说明需要删除的就是头节点
   if (fast === null) {
       return head.next
   }

   while (fast.next != null ){
       fast = fast.next
       slow = slow.next
   }

   slow.next=slow.next.next
   return head
}
```

这两道关于链表的题目都重点考察了对你链表结构的理解，其中是用到了多个指针，这也是解决链表题目的关键。

## 算法学习

本节课内容到这里，我们只是列举了一些算法题目，也算不上「题海战术」，但问题都比较典型。可是面对这些相对零散的内容，我们应该如何入手学习呢？只是一味的刷题，似乎效率低下而无趣。

我认为对于算法的学习，需要做到「分门别类」，按照不同类别的算法思想，遵循循序渐进的进步路线，才会「越来越有感觉」。我把算法的一些基础思想进行了归并：

+ 枚举
+ 模拟
+ 递归/分治
+ 贪心
+ 排序
+ 二分
+ 倍增
+ 构造
+ 前缀和/差分

我们来简单总结一下这些算法基础思想。

### 枚举

枚举是基于已有知识来猜测，印证答案的一种问题求解策略。当拿到一道题目时，枚举这种「暴力解法」最容易想到。这其中重点是：

+ 建立简洁的数学模型
+ 想清楚枚举哪些要素
+ 尝试减少枚举空间

举个例子：

一个数组中的数互不相同，求其中和为 0 的数对的个数

最笨的方法：

```cpp
for (int i = 0; i < n; ++i)
 for (int j = 0; j < n; ++j)
   if (a[i] + a[j] == 0) ++ans;
```

我们来看看如何操作进行优化。如果 (a, b) 是答案，那么 (b, a) 也是答案，因此对于这种情况只需统计一种顺序之后的答案，最后再乘 2 就好了。

```cpp
for (int i = 0; i < n; ++i)
 for (int j = 0; j < i; ++j)
   if (a[i] + a[j] == 0) ++ans;
```

如此一来，就减少了 j 的枚举范围，减少了这段代码的时间开销。然而这还不是最优解。

我们思考：两个数是否都一定要枚举出来呢？其实枚举第一个数之后，题目的条件已经帮我们确定了其他的要素（另一个数），如果能找到一种方法直接判断题目要求的那个数是否存在，就可以省掉枚举后一个数的时间了。代码实现很简单，我们就不动手实现了。

### 模拟

模拟。顾名思义，就是用计算机来模拟题目中要求的操作，我们只需要按照题面的意思来写就可以了。模拟题目通常具有码量大、操作多、思路繁复的特点。

这种题目往往考察开发者的「逻辑转化为代码」的能力。一道典型题目是：[魔兽世界](https://links.jianshu.com/go?to=http%3A%2F%2Fbailian.openjudge.cn%2Fpractice%2F3750%2F)。

### 递归 & 分治

递归的基本思想是某个函数直接或者间接地调用自身，这样就把原问题的求解转换为许多性质相同但是规模更小的子问题。

递归和枚举的区别在于：枚举是横向地把问题划分，然后依次求解子问题，而递归是把问题逐级分解，是纵向的拆分。比如请尝试回答这几个问题：

孙悟空身上有多少根毛？答：一根毛加剩下的毛。 你今年几岁？答：去年的岁数加一岁，1999 年我出生。

递归代码最重要的两个特征：结束条件和自我调用。

```go
int func(传入数值) {
 if (终止条件) return 最小子问题解;
 return func(缩小规模);
}
```

写递归的技巧，「明白一个函数的作用并相信它能完成这个任务，千万不要试图跳进细节」。 千万不要跳进这个函数里面企图探究更多细节，否则就会陷入无穷的细节无法自拔，人脑能压几个栈啊。

先举个最简单的例子：遍历二叉树。

```cpp
void traverse(TreeNode* root) {
 if (root == nullptr) return;
 traverse(root->left);
 traverse(root->right);
}
```

这几行代码就足以遍历任何一棵二叉树了。对于递归函数 traverse(root) ，我们只要相信：给它一个根节点 root，它就能遍历这棵树，因为写这个函数不就是为了这个目的吗？

那么遍历一棵 N 叉数呢？

```cpp
void traverse(TreeNode* root) {
 if (root == nullptr) return;
 for (child : root->children) traverse(child);
}
```

总之，还是那句话：给它一个根节点 root，它就能遍历这棵树，不管你是几个叉。

典型题目：

给一棵二叉树，和一个目标值，节点上的值有正有负，返回树中和等于目标值的路径条数

这道题目解法很多，也比较典型。这里我们只谈思想，具体实现就不展开。

分治算法可以分三步走：分解 -> 解决 -> 合并。

+ 分解原问题为结构相同的子问题
+ 分解到某个容易求解的边界之后，进行递归求解
+ 将子问题的解合并成原问题的解

归并排序是最典型的分治算法。

```cpp
void mergeSort(一个数组) {
 if (可以很容易处理) return
 mergeSort(左半个数组)
 mergeSort(右半个数组)
 merge(左半个数组, 右半个数组)
}
```

分治算法的套路就是前面说的三步走：分解 -> 解决 -> 合并：先左右分解，再处理合并，回溯就是在退栈，就相当于后序遍历了。至于 merge 函数，相当于两个有序链表的合并。

LeetCode 有[递归专题练习](https://links.jianshu.com/go?to=https%3A%2F%2Fleetcode.com%2Fexplore%2Flearn%2Fcard%2Frecursion-i%2F) LeetCode 上有[分治算法的专项练习](https://links.jianshu.com/go?to=https%3A%2F%2Fleetcode-cn.com%2Ftag%2Fdivide-and-conquer%2F%3Futm_source%3DLCUS%26utm_medium%3Dip_redirect_o_uns%26utm_campaign%3Dtransfer2china)

### 贪心

贪心算法顾名思义就是只看眼前，并不考虑以后可能造成的影响。可想而知，并不是所有的时候贪心法都能获得最优解。

最常见的贪心有两种。一种是：「将 XXX 按照某某顺序排序，然后按某种顺序（例如从小到大）处理」。另一种是：「我们每次都取 XXX 中最大/小的东西，并更新 XXX」，有时「XXX 中最大/小的东西」可以优化，比如用优先队列维护。这两种方式分别对应了离线的情况以及在线的情况。

相关题目：

+ [工作调度 Work Scheduling](https://links.jianshu.com/go?to=https%3A%2F%2Fwww.luogu.org%2Fproblem%2FP2949)
+ [修理牛棚 Barn Repair](https://links.jianshu.com/go?to=https%3A%2F%2Fwww.luogu.org%2Fproblem%2FP1209)
+ [皇后游戏](https://links.jianshu.com/go?to=https%3A%2F%2Fwww.luogu.org%2Fproblem%2FP2123)

### 二分

以二分搜索为例，它是用来在一个有序数组中查找某一元素的算法。它每次考察数组当前部分的中间元素，如果中间元素刚好是要找的，就结束搜索过程；如果中间元素小于所查找的值，那么左侧的只会更小，不会有所查找的元素，只需要到右侧去找就好了；如果中间元素大于所查找的值，同理，右侧的只会更大而不会有所查找的元素，所以只需要到左侧去找。

在二分搜索过程中，每次都把查询的区间减半，因此对于一个长度为 n 的数组，至多会进行 log(n) 次查找。

一定需要注意的是，这里的有序是广义的有序，如果一个数组中的左侧或者右侧都满足某一种条件，而另一侧都不满足这种条件，也可以看作是一种有序。

二分法把一个寻找极值的问题转化成一个判定的问题（用二分搜索来找这个极值）。类比枚举法，我们当时是枚举答案的可能情况，现在由于单调性，我们不再需要一个个枚举，利用二分的思路，就可以用更优的方法解决「最大值最小」、「最小值最大」。这种解法也成为是「二分答案」，常见于解题报告中。

比如：[砍树问题](https://links.jianshu.com/go?to=https%3A%2F%2Fwww.luogu.org%2Fproblem%2FP1873)，我们可以在 1 到 1000000000（10 亿）中枚举答案，但是这种朴素写法肯定拿不到满分，因为从 1 跑到 10 亿太耗时间。我们可以对答案进行 1 到 10 亿的二分，其中，每次都对其进行检查可行性（一般都是使用贪心法）。

依照此思想，我们还有三分法等展开算法。

### 倍增

倍增法，通过字面意思来看就是翻倍。这个方法在很多算法中均有应用，其中最常用的就是 RMQ 问题和求 LCA。

RMQ 是英文 Range Maximum/Minimum Query 的缩写，表示区间最大（最小）值。解决 RMQ 问题的主要方法有两种，分别是 ST 表和线段树，具体请参见 ST 表和 线段树内容。

### 构造

构造针对的问题的答案往往具有某种规律性，使得在问题规模迅速增大的时候，仍然有机会比较容易地得到答案。

这种思想我们接触的比较少，主要体现了数学解题方法啊。比较典型的有：

+ [Luogu P3599 Koishi Loves Construction](https://links.jianshu.com/go?to=https%3A%2F%2Fwww.luogu.org%2Fproblemnew%2Fshow%2FP3599)
+ [Vladik and fractions](https://links.jianshu.com/go?to=http%3A%2F%2Fcodeforces.com%2Fproblemset%2Fproblem%2F743%2FC)
+ [AtCoder Grand Contest 032 B](https://links.jianshu.com/go?to=https%3A%2F%2Fatcoder.jp%2Fcontests%2Fagc032%2Ftasks%2Fagc032_b)

这里我们不再介绍，感兴趣的同学可以进行研究。

前缀和 & 差分  
前缀和是一种重要的预处理，能大大降低查询的时间复杂度。我们可以简单理解为「数列的前 n 项的和」。其实前缀和几乎都是基于容斥原理。

比如这道题目：

有 N 个的正整数放到数组 A 里，现在要求一个新的数组 B，新数组的第 i 个数 B[i]是原数组 A 第 0 到第 i 个数的和。

对于这道题，我们有两种做法：

+ 把对数组 A 的累加依次放入数组 B 中。
+ 递推： B[i] = B[i-1] + A[i]

我们看第二种方法采用前缀和的思想，无疑更加优秀。

其他相关题目：

+ [前缀和](https://links.jianshu.com/go?to=https%3A%2F%2Fwww.luogu.org%2Fproblem%2FU53525)
+ [前缀和的逆](https://links.jianshu.com/go?to=https%3A%2F%2Fwww.luogu.org%2Fproblem%2FU69096)
+ [最大の和](https://links.jianshu.com/go?to=https%3A%2F%2Fwww.luogu.org%2Fproblem%2FAT2412)
+ [Subsequences Summing to Sevens](https://links.jianshu.com/go?to=https%3A%2F%2Fwww.luogu.org%2Fproblem%2FP3131)

更复杂些，可以延伸出：基于 DP 计算高维前缀和，树上前缀和。

最后，差分是一种和前缀和相对的策略。这种策略是求相邻两数的差。相关题目：

+ [树状数组 3 ：区间修改，区间查询](https://links.jianshu.com/go?to=https%3A%2F%2Floj.ac%2Fproblem%2F132)
+ [地毯](https://links.jianshu.com/go?to=https%3A%2F%2Fwww.luogu.org%2Fproblem%2FP3397)
+ [最大流](https://links.jianshu.com/go?to=https%3A%2F%2Fwww.luogu.org%2Fproblem%2FP3128)

### 思想归并

我列举了 9 中算法基本思想，并配上多到典型题目。实际上，读者可以根据自身情况酌情进行了解，在解题外更重要的是体会这些算法思想。比如我留一个小作业：在这三节课中所有讲到的算法中，你能按照这 9 种思想进行归类么？

请动手尝试，我认为我们可以有解不出来的题目，但是对于算法思想的理解至关重要。

### 总结

到此我们关于算法的三节课就结束了。整体来说，算法需要应试。算法就像弹簧一样，只要你有信心，态度正确，不畏难，一定就可以攻克它。

从今天起，下一个决心，制定一个计划，通过不断练习，提升自己解算法题的能力。当然学习数据结构和算法不仅仅对面试有帮助，对于程序的强健性、稳定性、性能来说，算法虽然只是细节，但却是最重要的一部分之一。比如 AVL 或者 B+ 树，可能除了在学校的大作业，一辈子也不会有机会实现一个出来，但你学会了分析和比较类似算法的能力, 有了搜索树的知识，你才能真正理解为什么 InnoDB 索引要用 B+ 树，你才能明白 like "abc%" 会不会使用索引，而不是人云亦云、知其然不知其所以然。

这一节课我挑选的典型算法都不算困难，但都能体现算法的思想闪光点，适合类推。但实话说，这节课的内容相对零散，算法的思想却是可以归类的，也留给大家一个作业，将上述算法进行思想归类，并在每个归类下再找一道题目进行扩充。这样的学习方法一定会让你有所收获，在全部课程结束后，我也会和大家针对这个「作业」，进行交流，也分享出我的更多算法心得。




