---
title: 异步不可怕「死记硬背」- 实践拿下
date: 2024-08-05
category:
  - JavaScript
order: 4
---

- **<font color=red>理论方面</font>**

  - JavaScript 是单线程的，那它又是如何实现异步的呢？
  - 在这个环节中，浏览器或 NodeJS 又起到了什么样的作用？
  - 什么是宏任务，什么是微任务？

- **<font color=red>实践上</font>**

  - 从 callback 到 promise，从 generator 到 async/await，到底应该如何更优雅地实现异步操作？

- 相关知识点如下：

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/img/JavaScript/21.png =700x)

- 异步流程初体验

> [!info]
> 先从一个需求开始，来实现一个「运动路径动画」流程：
>
> - 移动页面上元素 target（document.querySelectorAll('#man')[0]）
> - 先从原点出发，向左移动 20px，之后再向上移动 50px，最后再次向左移动 30px，请把运动动画实现出来

- 将移动的过程封装成一个 walk 函数，该函数要接受以下三个参数
  - direction：字符串，表示移动方向，这里简化为「left」、「top」两种枚举，表示移动方向
  - distance：整型，可正或可负，表示移动距离
  - callback：动作执行后回调
- 通过 distance 的正负值，可以实现四个方向的移动

## 回调方案

- 因为每一个任务都是相互联系的：
  - 当前任务结束之后，将会马上进入下一个流程，如何将这些流程串联起来呢？
  - 采用最简单的 callback 实现，明确指示下一个任务

```javascript
const target = document.querySelectorAll('#man')[0]
target.style.cssText = `
  position: absolute;
  left: 0px;
  top: 0px
`

const walk = (direction, distance, callback) => {
  setTimeout(() => {
    let currentLeft = parseInt(target.style.left, 10)
    let currentTop = parseInt(target.style.top, 10)

    const shouldFinish =
      (direction === 'left' && currentLeft === -distance) || (direction === 'top' && currentTop === -distance)

    if (shouldFinish) {
      // 任务执行结束，执行下一个回调
      callback && callback()
    } else {
      if (direction === 'left') {
        currentLeft--
        target.style.left = `${currentLeft}px`
      } else if (direction === 'top') {
        currentTop--
        target.style.top = `${currentTop}px`
      }

      walk(direction, distance, callback)
    }
  }, 20)
}

walk('left', 20, () => {
  walk('top', 50, () => {
    walk('left', 30, Function.prototype)
  })
})
```

- 为了简化问题，将目标元素的定位进行了初始化设定：

```css
position: absolute;
left: 0px;
top: 0px;
```

- 且不再考虑边界 case（如移除屏幕外等）
- 为了能够展现出动画，将 walk 函数的执行逻辑包裹在 20 毫秒的定时器当中，每次执行一像素的运动时，都会有一个停留定格
- 这样的实现完全面向过程，代码比较「丑」，只需体会使用回调来解决异步任务的处理方案
- 也要发现：

```javascript
walk('left', 20, () => {
  walk('top', 50, () => {
    walk('left', 30, Function.prototype)
  })
})
```

- 这样的回调嵌套很不优雅，有几次位移任务，就会嵌套几层，是名副其实的回调地狱

## Promise 方案

- 再来看一下如何用 Promise 解决问题：

```javascript
const target = document.querySelectorAll('#man')[0]
target.style.cssText = `
  position: absolute;
  left: 500px;
  top: 500px
`

const walk = (direction, distance) =>
  new Promise((resolve, reject) => {
    const innerWalk = () => {
      setTimeout(() => {
        let currentLeft = parseInt(target.style.left, 10)
        let currentTop = parseInt(target.style.top, 10)

        const shouldFinish =
          (direction === 'left' && currentLeft === -distance) || (direction === 'top' && currentTop === -distance)

        if (shouldFinish) {
          // 任务执行结束
          resolve()
        } else {
          if (direction === 'left') {
            currentLeft--
            target.style.left = `${currentLeft}px`
          } else if (direction === 'top') {
            currentTop--
            target.style.top = `${currentTop}px`
          }

          innerWalk()
        }
      }, 20)
    }
    innerWalk()
  })

walk('left', 20)
  .then(() => walk('top', 50))
  .then(() => walk('left', 30))
```

> [!warning]
> 几个注意点：
>
> - walk 函数不再嵌套调用，不再执行 callback，而是函数整体返回一个 promise，以利于后续任务的控制和执行
> - 设置 innerWalk 进行每一像素的递归调用
> - 在当前任务结束时（shouldFinish 为 true），resolve 当前 promise

- 对比上述实现，发现使用 promise 的解决方案明显更加清晰、易读

## generator 方案

- ES Next 中生成器其实并不是天生为解决异步而生的，但是它又天生非常适合解决异步问题
- 用 generator 方案解决异步任务也同样优秀：

```javascript
const target = document.querySelectorAll('#man')[0];
target.style.cssText = `
  position: absolute;
  left: 0px;
  top: 0px
`;

const walk = (direction, distance) =>
  new Promise((resolve, reject) => {
    const innerWalk = () => {
      setTimeout(() => {
        let currentLeft = parseInt(target.style.left, 10);
        let currentTop = parseInt(target.style.top, 10);

        const shouldFinish =
          (direction === 'left' && currentLeft === -distance) ||
          (direction === 'top' && currentTop === -distance);

        if (shouldFinish) {
          // 任务执行结束
          resolve();
        } else {
          if (direction === 'left') {
            currentLeft--;
            target.style.left = `${currentLeft}px`;
          } else if (direction === 'top') {
            currentTop--;
            target.style.top = `${currentTop}px`;
          }

          innerWalk();
        }
      }, 20);
    };
    innerWalk();
  });

function- taskGenerator() {
  yield walk('left', 20);
  yield walk('top', 50);
  yield walk('left', 30);
}
const gen = taskGenerator();

// 定义了一个 taskGenerator 生成器函数，并实例化出 gen，手动执行：
gen.next() //将会向左偏移 20 像素

// 再次手动执行：
gen.next() // 将会向上偏移 50 像素

// 再次手动执行：
gen.next() //将会向左偏移 30 像素
```

- 整个过程掌控感十足，唯一的不便之处就是需要反复手动执行 gen.next()
- 为此社区上早有方案，kj 大神的 [<co 库](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2Ftj%2Fco)，能够自动包裹 generator 并执行，源码实现并不复杂，推荐给大家阅读
- 但是在新时代里，作为 generator 的语法糖，async/await 也许将会是「更优雅、更终极」解决方案

## async/await 方案

- 基于以上基础，改造成 async/await 方案也并不困难
- 直接看代码：

```javascript
const target = document.querySelectorAll('#man')[0]
target.style.cssText = `
  position: absolute;
  left: 0px;
  top: 0px
`

const walk = (direction, distance) =>
  new Promise((resolve, reject) => {
    const innerWalk = () => {
      setTimeout(() => {
        let currentLeft = parseInt(target.style.left, 10)
        let currentTop = parseInt(target.style.top, 10)

        const shouldFinish =
          (direction === 'left' && currentLeft === -distance) || (direction === 'top' && currentTop === -distance)

        if (shouldFinish) {
          // 任务执行结束
          resolve()
        } else {
          if (direction === 'left') {
            currentLeft--
            target.style.left = `${currentLeft}px`
          } else if (direction === 'top') {
            currentTop--
            target.style.top = `${currentTop}px`
          }

          innerWalk()
        }
      }, 20)
    }
    innerWalk()
  })

const task = async function () {
  await walk('left', 20)
  await walk('top', 50)
  await walk('left', 30)
}

task() // 只需要直接执行 task() 即可
```

- 通过对比 generator 和 async/await 这两种方式，应该准确认识到，**<font color=red>async/await 就是 generator 的语法糖，它能够自动执行生成器函数，更加方便地实现异步流程</font>**

## 红绿灯任务控制

> [!info]
> 再来看一道比较典型的问题
>
> - 红灯 3s 亮一次，绿灯 1s 亮一次，黄灯 2s 亮一次
> - 如何让三个灯不断交替重复亮灯？

- 三个亮灯函数已经存在：

```javascript
function red() {
  console.log('red')
}
function green() {
  console.log('green')
}
function yellow() {
  console.log('yellow')
}
```

- 这道题更复杂的地方在于需要「交替重复」亮灯，而不是「移动完了」就结束的一锤子买卖

#### 从 callback 方案入手

```javascript
const task = (timer, light, callback) => {
  setTimeout(() => {
    if (light === 'red') {
      red()
    } else if (light === 'green') {
      green()
    } else if (light === 'yellow') {
      yellow()
    }
    callback()
  }, timer)
}

task(3000, 'red', () => {
  task(1000, 'green', () => {
    task(2000, 'yellow', Function.prototype)
  })
})
```

- 这里存在一个明显的 bug：
  - 代码只是完成了一次流程，执行后红黄绿灯分别只亮一次
  - 该如何让它交替重复进行呢？
- 上面提到过递归，那么该递归谁呢？
  - 当然是递归亮灯的一个周期：

```javascript
const step = () => {
  task(3000, 'red', () => {
    task(1000, 'green', () => {
      task(2000, 'yellow', step)
    })
  })
}

step()
```

- **<font color=red>注意看黄灯亮的回调里，又再次调用了 step 方法</font>**以完成循环亮灯

#### 用 promise 实现

```javascript
const task = (timer, light) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (light === 'red') {
        red()
      } else if (light === 'green') {
        green()
      } else if (light === 'yellow') {
        yellow()
      }
      resolve()
    }, timer)
  })

const step = () => {
  task(3000, 'red')
    .then(() => task(1000, 'green'))
    .then(() => task(2000, 'yellow'))
    .then(step)
}

step()
```

- 将回调移除，在一次亮灯结束后，resolve 当前 promise，并依然使用递归进行

#### async/await 的实现

```javascript
const taskRunner = async () => {
  await task(3000, 'red')
  await task(1000, 'green')
  await task(2000, 'yellow')
  taskRunner()
}

taskRunner()
```

- 还是 async/await 的方案更加舒服
- 可见，熟悉 Promise 是基础，是理解 async/await 的必要知识，学习 async/await 代表了学习「最先进的生产力」

## 复杂的真实场景案例

- 下面将一步一步制造一个较为复杂的场景，贴近真实环境，在实战中将异步操作用到极致
- **<font color=red>请求图片进行预先加载</font>**
  - 假设预先有 urlIds 数组，数组的每一项都可以按照规则拼接成一个完整的图片地址
  - 根据这个数组，依次请求图片进行预加载
- 这个比较简单，先实现一个请求图片的方法：

```javascript
const loadImg = urlId => {
  const url = `https://www.image.com/${urlId}`

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onerror = function () {
      reject(urlId)
    }

    img.onload = function () {
      resolve(urlId)
    }
    img.src = url
  })
}
```

- 该方法进行 promise 化（promisify），在图片成功加载时进行 resolve，加载失败时 reject
- 依次请求图片：

```javascript
const urlIds = [1, 2, 3, 4, 5]
urlIds.reduce((prevPromise, urlId) => {
  return prevPromise.then(() => loadImg(urlId))
}, Promise.resolve())
```

- 使用了数组 reduce 方法，当然也可以面向过程实现：

```javascript
const loadImgOneByOne = index => {
  const length = urlIds.length

  loadImg(urlIds[index]).then(() => {
    if (index === length - 1) {
      return
    } else {
      loadImgOneByOne(++index)
    }
  })
}
loadImgOneByOne(0)
```

- 当然也可以采用 async/await 实现：

```javascript
const loadImgOneByOne = async () => {
  for (i of urlIds) {
    await loadImg(urlIds[i])
  }
}
loadImgOneByOne()
```

- 上述代码的请求都是依次执行的，只有成功加载完第一张图片，才继续进行下一张图片的加载
- 如果要求提高效率，将所有图片的请求一次性发出，该如何做呢？

```javascript
const urlIds = [1, 2, 3, 4, 5]

const promiseArray = urlIds.map(urlId => loadImg(urlId))

Promise.all(promiseArray)
  .then(() => {
    console.log('finish load all')
  })
  .catch(() => {
    console.log('promise all catch')
  })
```

- 继续提出需求，希望控制最大并发数为 3，最多 3 个请求一起发出，剩下 2 个一起发出，这就需要实现一个 loadByLimit 方法，实现可以考虑使用 Promise.race API：

```javascript
const loadByLimit = (urlIds, loadImg, limit) => {
  const urlIdsCopy = […urlIds]

  if (urlIdsCopy.length <= limit) {
    // 如果数组长度小于最大并发数，直接全部请求
    const promiseArray = urlIds.map(urlId => loadImg(urlId))
    return Promise.all(promiseArray)
  }

  // 注意 splice 方法会改变 urlIdsCopy 数组
  const promiseArray = urlIdsCopy.splice(0, limit).map(urlId => loadImg(urlId))

  urlIdsCopy.reduce(
    (prevPromise, urlId) =>
      prevPromise
      .then(() => Promise.race(promiseArray))
      .catch(error => {console.log(error)})
      .then(resolvedId => {
        // 将 resolvedId 剔除出 promiseArray 数组
        // 这里的删除只是伪代码，具体删除情况要看后端 Api 返回结果
        let resolvedIdPostion = promiseArray.findIndex(id => resolvedId === id)
        promiseArray.splice(resolvedIdPostion, 1)
        promiseArray.push(loadImg(urlId))
      }),
    Promise.resolve()
  )
  .then(() => Promise.all(promiseArray))
}
```

- 代码解读：Promise.race 接受一个 promise 数组，并返回这个数组中第一个 resolve 的 promise 的返回值
- 在有 Promise.race 返回后，不断地将已经 resolve 的 promise 从 promise 数组（promiseArray）中剔除，再添加进新的 promise 进入 promiseArray，重复执行，始终保持当前并发请求数小于等于 limit 值
- 到此为止，已经掌握了比较基本的操作
- **<font color=red>再来看一个更加复杂的问题，这个问题出自阿里某部门 P7- 的面试题</font>**

## 改编自阿里某部门的面试题

- 假设现在后端有一个服务，支持批量返回书籍信息，它接受一个数组作为请求数据，数组储存了需要获取书目信息的书目 id，这个服务 fetchBooksInfo 大概是这个样子：

```javascript
const fetchBooksInfo = bookIdList => {
  // ...
  return [
    {
      id: 123
      // ...
    },
    {
      id: 456
      // ...
    }
    // ...
  ]
}
```

- fetchBooksInfo 已经给出，**<font color=red>但是这个接口最多只支持 100 个 id 的查询</font>**
- 现在需要开发者实现 getBooksInfo 方法，该方法：
  - 支持调用单个书目信息：

```javascript
getBooksInfo(123).then(data => {
  console.log(data.id)
}) // 123
```

- 短时间（100 毫秒）内多次连续调用，只发送一个请求，且获得各个书目信息：

```javascript
getBooksInfo(123).then(data => {
  console.log(data.id)
}) // 123
getBooksInfo(456).then(data => {
  console.log(data.id)
}) // 456
```

- **<font color=red>注意这里必须只发送一个请求，也就是说调用了一次 fetchBooksInfo</font>**
  - 要考虑服务端出错的情况，比如批量接口请求 [123, 446] 书目信息，但是服务端只返回了书目 123 的信息
  - 此时应该进行合理的错误处理
  - 对 id 重复进行处理
- **<font color=red>将思路清理一下</font>**
  - 100 毫秒内的连续请求，要求进行合并，只触发一次网络请求
  - 因此需要一个 bookIdListToFetch 数组，并设置 100 毫秒的定时
  - 在 100 毫秒以内，将所有的书目 id push 到 bookIdListToFetch 中，bookIdListToFetch 长度为 100 时，进行 clearTimeout，并调用 fetchBooksInfo 发送请求
  - 因为服务端可能出错，返回的批量接口结果可能缺少某个书目信息
  - 需要对相关的调用进行抛错，比如 100 毫秒内连续调用：

```javascript
getBooksInfo(123).then(data => {
  console.log(data.id)
}) // 123
getBooksInfo(456).then(data => {
  console.log(data.id)
}) // 456
```

- 要归并只调用一次 fetchBooksInfo：

```javascript
fetchBooksInfo(123, 456)
```

- 如果返回有问题，只返回了：

```javascript
;[
  {
    id: 123
    //...
  }
]
```

- 没有返回 id 为 456 的书信息，需要捕获错误：

```javascript
getBooksInfo(456)
  .then(data => {
    console.log(data.id)
  })
  .catch(error => {
    console.log(error)
  })
```

- 这样一来，要对每一个 getBooksInfo 对应的 promise 实例的 reject 和 resolve 方法进行存储，存储在内存 promiseMap 中，以便在合适的时机进行 reject 或 resolve 对应的 promise 实例
- 请看代码（对边界 case 的处理省略），加入了关键注释：

```javascript
// 储存将要请求的 id 数组
let bookIdListToFetch = []

// 储存每个 id 请求 promise 实例的 resolve 和 reject
// key 为 bookId，value 为 resolve 和 reject 方法，如：
// { 123: [{resolve, reject}]}
// 这里之所以使用数组存储 {resolve, reject}，是因为可能存在重复请求同一个 bookId 的情况。其实这里进行了滤重，没有必要用数组。在需要支持重复的场景下，记得要用数组存储
let promiseMap = {}

// 用于数组去重
const getUniqueArray = array => Array.from(new Set(array))

// 定时器 id
let timer

const getBooksInfo = bookId => new promise((resolve, reject) => {
  promiseMap[bookId] = promiseMap[bookId] || []
  promiseMap[bookId].push({
    resolve,
    reject
  })

  const clearTask = () => {
    // 清空任务和存储
    bookIdListToFetch = []
    promiseMap = {}
  }

  if (bookIdListToFetch.length === 0) {
    bookIdListToFetch.push(bookId)

    timer = setTimeout(() => {
      handleFetch(bookIdListToFetch, promiseMap)

      clearTask()
    }, 100)
  }
  else {
    bookIdListToFetch.push(bookId)

    bookIdListToFetch = getUniqueArray(bookIdListToFetch)

    if (bookIdListToFetch.length >= 100) {
      clearTimeout(timer)

      handleFetch(bookIdListToFetch, promiseMap)

      clearTask()
    }
  }
})

const handleFetch = (list, map) => {
  fetchBooksInfo(list).then(resultArray => {
    const resultIdArray = resultArray.map(item => item.id)

    // 处理存在的 bookId
    resultArray.forEach(data => promiseMap[data.id].forEach(item => {
        item.resolve(data)
    }))

    // 处理失败没拿到的 bookId
    let rejectIdArray ＝ []
    bookIdListToFetch.forEach(id => {
      // 返回的数组中，不含有某项 bookId，表示请求失败
      if (!resultIdArray.includes(id)) {
        rejectIdArray.push(id)
      }
    })

    // 对请求失败的数组进行 reject
    rejectIdArray.forEach(id => promiseMap[id].forEach(item => {
      item.reject()
    }))
  }, error => {
    console.log(error)
  })
}
```

> [!important]
>
> - 做出这道题的关键是：
>   - 准确理解题意，因为这个题目完全贴近实际场景需求，准确把控出题者的意图是第一步
>   - 对 Promise 熟练掌握
>   - 进行 setTimeout 合并 100 毫秒内的请求
>   - 存储每个 bookId 的请求 promise 实例，存储该 promise 实例的 resolve 和 reject 方法，以便在批量数据返回时进行对应处理
> - 错误处理

- 了解了如何优雅地处理复杂异步任务
- 回归理论，研究「同步异步」到底是个什么样的概念
- 从例题入手，梳理一下相关面试考点
  - 这些题目有一个共同特点，判断输入输出的顺序
  - 这是一类面试的「必考题」，考察点围绕着 JavaScript 和浏览器引擎交织的异步行为，包括 eventloop、宏任务、微任务等

## setTimeout 相关考察

- 观察以下代码：

```javascript
setTimeout(() => {
  console.log('setTimeout block')
}, 100)

while (true) {}

console.log('end here')
```

- 将不会有任何输出
- 原因很简单，因为 while 循环会一直循环代码块，因此主线程将会被占用
- 但是：

```javascript
setTimeout(() => {
  while (true) {}
}, 0)

console.log('end here')
```

- 会打印出：end here
- 这段代码执行后，如果再执行任何语句，都不会再得到响应
- 由此可以延伸出：**<font color=red>JavaScript 中，所有任务分为同步任务和异步任务</font>**
  - 同步任务是指：当前主线程将要消化执行的任务，这些任务一起形成执行栈（execution context stack）
  - 异步任务是指：不进入主线程，而是进入任务队列（task queue），即不会马上进行的任务

> **<font color=red>当同步任务全都被消化，主线程空闲时，即上面提到的执行栈 execution context stack 为空时，将会执行任务队列中的任务，即异步任务</font>**
> 这样的机制保证了： **<font color=red>虽然 JavaScript 是单线程的，但是对于一些耗时的任务，可以将其丢入任务队列当中，这样一来，也就不会阻碍其他同步代码的执行，等到异步任务完成之后，再去进行相关逻辑的操作</font>**

- 回到例题，程序遇见 setTimeout 时，会将其内容放入任务队列（task queue）当中，继续执行同步任务，直到 while 循环，因为写死了一个循环条件，导致主线程同步任务被阻塞，主线程永远不会空闲
- 因此 console.log('end here') 代码不会执行，更没有可能在同步任务结束后，执行任务队列当中的 console.log('setTimeout block')
- 如果稍做更改：

```javascript
const t1 = new Date()
setTimeout(() => {
  const t3 = new Date()
  console.log('setTimeout block')
  console.log('t3 - t1 =', t3 - t1)
}, 100)

let t2 = new Date()

while (t2 - t1 < 200) {
  t2 = new Date()
}

console.log('end here')
```

- 输出：

```javascript
end here
setTimeout block
t3 - t1 = 200
```

- 即便 setTimeout 定时器的定时为 100 毫秒，但是同步任务中 while 循环将执行 200 毫秒，计时到时后仍然会先执行主线程中的同步任务，只有当同步任务全部执行完毕，end here 输出，才会开始执行任务队列当中的任务
- 此时 t3 和 t1 的时间差为 200 毫秒，而不是定时器设定的 100 毫秒
- 上面两个例题比较简单，关于 setTimeout 最容易被忽视的其实是一个非常小的细节
- 请看题目：

```javascript
setTimeout(() => {
  console.log('here 100')
}, 100)

setTimeout(() => {
  console.log('here 2')
}, 0)
```

- 这个题目并没有陷阱
- 因为第二个 setTimeout 将更快到时，所以先输出 here 2，再在 100 毫秒左右，输出 here 100
- 但是如果：

```javascript
setTimeout(() => {
  console.log('here 1')
}, 1)

setTimeout(() => {
  console.log('here 2')
}, 0)
```

- 按道理，也应该是第二个 setTimeout 将更快到时，先输出 here 2，再输出 here 1
- 但是在 Chrome 中运行结果相反，事实上针对这两个 setTimeout，谁先进入任务队列，谁先执行并不会严格按照 1 毫秒和 0 毫秒的区分
- 表面上看，1 毫秒和 0 毫秒的延迟完全是等价的，这就有点类似「最小延迟时间」这个概念
- 直观上看，最小延迟时间是 1 毫秒，在 1 毫秒以内的定时，都以最小延迟时间处理
- 此时，在代码顺序上谁靠前，谁就先会在主线程空闲时优先被执行
- 值得一提的是，MDN 上给出的最小延时概念是 4 毫秒，可以参考 [最小延迟时间](https://developer.mozilla.org/zh-%20CN/docs/Web/API/Window/setTimeout)，另外，setTimeout 也有「最大延时」的概念
- 这都依赖于规范的制定和浏览器引擎的实现

## 宏任务 VS 微任务

- 在介绍宏任务和微任务之前，先看一下 Promise 相关输出情况：

```javascript
console.log('start here')

new Promise((resolve, reject) => {
  console.log('first promise constructor')
  resolve()
})
  .then(() => {
    console.log('first promise then')
    return new Promise((resolve, reject) => {
      console.log('second promise')
      resolve()
    }).then(() => {
      console.log('second promise then')
    })
  })
  .then(() => {
    console.log('another first promise then')
  })

console.log('end here')
```

- 来分析一下：
  - 首先输出 start here 没有问题
  - 接着到了一个 Promise 构造函数中，同步代码执行，输出 first promise constructor，同时将第一处 promise then 完成处理函数逻辑放入任务队列
  - 继续执行同步代码，输出 end here
  - 同步代码全部执行完毕，执行任务队列中的逻辑，输出 first promise then 以及 second promise
  - 当在 then 方法中返回一个 Promise 时（第 9 行），第一个 promise 的第二个完成处理函数（第 17 行）会置于返回的这个新 Promise 的 then 方法（第 13 行）后
  - 此时将返回的这个新 Promise 的 then 方法放到任务队列中，由于主线程并没有其他任务，转而执行第二个 then 任务，输出 second promise then
  - 最后输出 another first promise then
- 事实上，Promise 完成处理函数也会被放到任务队列当中
- 但是这个「任务队列」和前面所提的 setTimeout 相关的的任务队列又有所不同

> 任务队列中的异步任务其实又分为：**<font color=red>宏任务（macrotask）与微任务（microtask）</font>** ，也就是说宏任务和微任务虽然都是异步任务，都在任务队列中，但是他们也是在两个不同的队列中

- **<font color=red>那宏任务和微任务如何区分呢？</font>**
- 一般地宏任务包括：
  - setTimeout
  - setInterval
  - I/O
  - 事件
  - postMessage
  - setImmediate (Node.js，浏览器端该 API 已经废弃)
  - requestAnimationFrame
  - UI 渲染
- 微任务包括：
  - Promise.then
  - MutationObserver
  - process.nextTick (Node.js)
- **<font color=red>那么当代码中同时存在宏任务和微任务时，谁的优先级更高，先执行谁呢？</font>**请看代码：

```javascript
console.log('start here')

const foo = () =>
  new Promise((resolve, reject) => {
    console.log('first promise constructor')

    let promise1 = new Promise((resolve, reject) => {
      console.log('second promise constructor')

      setTimeout(() => {
        console.log('setTimeout here')
        resolve()
      }, 0)

      resolve('promise1')
    })

    resolve('promise0')

    promise1.then(arg => {
      console.log(arg)
    })
  })

foo().then(arg => {
  console.log(arg)
})

console.log('end here')
```

- 这是一个更加复杂的例子，一步一步分析
  - 首先输出同步内容：start here，执行 foo 函数，同步输出 first promise constructor，
  - 继续执行 foo 函数，遇见 promise1，执行 promise1 构造函数，同步输出 second promise constructor，以及 end here。同时按照顺序：setTimeout 回调进入任务队列（宏任务），promise1 的完成处理函数（第 18 行）进入任务队列（微任务），第一个（匿名） promise 的完成处理函数（第 23 行）进入任务队列（微任务）
  - 虽然 setTimeout 回调率先进入任务队列，但是优先执行微任务，按照微任务顺序，先输出 promise1（promise1 结果），再输出 promise0（第一个匿名 promise 结果）
  - 此时所有微任务都处理完毕，执行宏任务，输出 setTimeout 回调内容 setTimeout here
- 由上分析得知，每次主线程执行栈为空的时候，引擎会优先处理微任务队列，处理完微任务队列里的所有任务，再去处理宏任务
- 如同：

```javascript
console.log('start here')

setTimeout(() => {
  console.log('setTimeout')
}, 0)

new Promise((resolve, reject) => {
  resolve('promise result')
}).then(value => {
  console.log(value)
})

console.log('end here')
```

- 输出：

```javascript
start here
end here
promise result
setTimeout
```

## 也谈头条那道「网红题」

- 综合上述所有知识，最后再来看一到头条的题目
- 题目：

```javascript
async function async1() {
  console.log('async1 start')
  await async2()
  console.log('async1 end')
}

async function async2() {
  console.log('async2')
}

console.log('script start')

setTimeout(function () {
  console.log('setTimeout')
}, 0)

async1()

new Promise(function (resolve) {
  console.log('promise1')
  resolve()
}).then(function () {
  console.log('promise2')
})

console.log('script end')
```

> [!important]
> 这里需明白：
>
> - async 声明的函数，其返回值必定是 promise 对象，如果没有显式返回 promise 对象，也会用 Promise.resolve() 对结果进行包装，保证返回值为 promise 类型
> - await 会先执行其右侧表达逻辑（从右向左执行），并让出主线程，跳出 async 函数，而去继续执行 async 函数外的同步代码
> - 如果 await 右侧表达逻辑是个 promise，让出主线程，继续执行 async 函数外的同步代码，等待同步任务结束后，且该 promise 被 resolve 时，继续执行 await 后面的逻辑
> - 如果 await 右侧表达逻辑不是 promise 类型，那么仍然异步处理，将其理解包装为 promise， async 函数之外的同步代码执行完毕之后，会回到 async 函数内部，继续执行 await 之后的逻辑

- 因此来分析：
  - 首先执行同步代码，输出 script start，并向下执行，遇见 setTimeout，将其回调放入宏任务当中
  - 继续执行同步代码逻辑，遇见 async1()，执行 async1 内同步代码，输出 async1 start，继续下后执行到 await async2()，执行 async2 函数
  - async2 函数内并没有 await，按顺序执行，同步输出 async2，按照 async 函数规则，async2 函数仍然返回一个 promise，作为 async1 函数中的 await 表达式的值，相当于：

```javascript
Promise.resolve().then(() => {})
```

- 同时 async1 函数让出主线程，中断在 await 一行
  - 回到 async1 函数外，继续执行，输出 Promise 构造函数内 promise1，同时将这个 promise 的执行完成逻辑放到微任务当中
  - 执行完最后一行代码，输出 script end
  - 此时同步代码全部执行完毕，回到 async1 函数中断处，优先执行微任务

```javascript
Promise.resolve().then(() => {})
```

- 其实什么也没做，但这时候 await 中断失效，继续执行 async1 函数，输出 async1 end
  - 这时候检查微任务，输出 promise2
  - 这时候微任务全部执行完毕，检查宏任务，输出 setTimeout
- 这时候，将代码重新拷贝，加上注释，再来回顾一下：

```javascript
async function async1() {
  console.log('async1 start') // step 4: 直接打印同步代码 async1 start
  await async2() // step 5: 遇见 await，首先执行其右侧逻辑，并在这里中断 async1 函数
  console.log('async1 end') // step 11: 再次回到 async1 函数，await 中断过后，打印代码 async1 end
}

async function async2() {
  console.log('async2') // step 6: 直接打印同步代码 async2，并返回一个 resolve 值为 undefined 的 promise
}

console.log('script start') // step 1: 直接打印同步代码 script start

// step 2: 将 setTimeout 回调放到宏任务中，此时 macroTasks: [setTimeout]
setTimeout(function () {
  console.log('setTimeout') // step 13: 开始执行宏任务，输出 setTimeout
}, 0)

async1() // step 3: 执行 async1

// step 7: async1 函数已经中断，继续执行到这里
new Promise(function (resolve) {
  console.log('promise1') // step 8: 直接打印同步代码 promise1
  resolve()
}).then(function () {
  // step 9: 将 then 逻辑放到微任务当中
  console.log('promise2') // step 12: 开始执行微任务，输出 promise2
})

console.log('script end') // step 10: 直接打印同步代码 script end，并回到 async1 函数中继续执行
```

- 至此，理解到这里就可以了
- 作为一个附加内容，其实在上面这道题目中，关于 promise2 和 async1 end 输出先后问题，是有一定争议的
- 比如在 Node10 版本前后，结果不一致
- 关于这个争论，和 NodeJS 以及 V8 实现有关，相关文章：[《Faster async functions and promises》](https://link.juejin.im/?target=https%3A%2F%2Fv8.dev%2Fblog%2Ffast-%20async)，以及相关 [ECMA pull request](https://link.juejin.im/?target=https%3A%2F%2Fgithub.com%2Ftc39%2Fecma262%2Fpull%2F1250)

## 总结

- 异步任务的处理，因其重要性，始终在前端开发中是一个不可忽视的考察点，又因其复杂性而考点灵活多变
- 需要开发者熟悉各种异步方案，同时每一种异步方案都是相辅相成的
  - 如果你没有完全理解 callback，那你也许就很难理解 promise
  - 如果 promise 没有熟练掌握，那么 generator 和 async/await 更无从谈起
