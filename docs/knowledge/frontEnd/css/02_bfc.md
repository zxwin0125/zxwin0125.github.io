# BFC 背后的布局问题

BFC 是前端面试中的一个超级热点，今日头条某部门曾经就问过

- 请解释一下 **<font color=red>BFC 是什么？</font>** 回答这个问题并不困难，但是可以继续追问
  - **<font color=red>BFC 会引起哪些布局现象？</font>**

## BFC 是什么

简单来说，BFC 就是

> [!tip]
> BFC 是 Block Formatting Context 的简写，可以直接翻译成「**<font color=red>块级格式化上下文</font>**」
>
> **<font color=red>它会创建一个特殊的区域，在这个区域中，只有 `block box` 参与布局</font>**
>
> 而 BFC 的一套特点和规则就规定了在这个特殊的区域中
>
> - 如何进行布局
> - 如何进行定位
> - 区域内元素的相互关系和相互作用
> - 并且这个特殊的区域不受外界影响

上面提到了 `block box` 的概念，**<font color=red>`block box` 是指 `display` 属性为 `block`、`list-item`、`table` 的元素</font>**

> [!warning]
> 还有其他哪些 `box` 类型呢？
>
> - 相应地，**<font color=red>有 `inline box`，它是指 `display` 属性为 `inline`、`inline-block`、`inline-table` 的元素</font>**

## 如何形成 BFC

那么 **<font color=red>什么样的情况会创建一个 BFC 呢？</font>** MDN 总结如下

> [!important]
>
> - 根元素或其他包含它的元素
> - 浮动元素（元素的 `float` 不是 `none`）
> - 绝对定位元素（元素具有 `position` 为 `absolute` 或 `fixed`）
> - 内联块（元素具有 `display: inline-block`）
> - 表格单元格（元素具有 `display: table-cell`，HTML 表格单元格默认属性）
> - 表格标题（元素具有 `display: table-caption`, HTML 表格标题默认属性）
> - 具有 `overflow` 且值不是 `visible` 的块元素
> - `display: flow-root` 的元素
> - `column-span: all` 的元素

## BFC 决定了什么

上面谈到了 BFC 的一套规则，那么这些 **<font color=red>规则都有哪些呢？</font>**

> [!important]
>
> - 内部的 `box` 将会独占宽度，且在垂直方向，一个接一个排列
> - `box` 垂直方向的间距由 `margin` 属性决定，但是同一个 BFC 的两个相邻 `box` 的 `margin` 会出现边距折叠现象
> - 每个 `box` 水平方向上左边缘，与 BFC 左边缘相对齐，即使存在浮动也是如此
> - BFC 区域不会与浮动元素重叠，而是会依次排列
> - BFC 区域内是一个独立的渲染容器，容器内元素和 BFC 区域外元素不会形成任何干扰
> - 浮动元素的高度也参与到 BFC 高度的计算当中

从这些规则中，至少能总结出一些 **<font color=red>关键要点</font>**，比如

- 边距折叠
- 清除浮动
- 自适应多栏布局

理解了 BFC，这些常见、常考知识点都可以融会贯通，具体来看下下面的场景

## BFC 实战应用

### 例题 1

给出如下代码：

```html
<style>
  body {
    width: 600px;
    position: relative;
  }

  .left {
    width: 80px;
    height: 150px;
    float: left;
    background: blue;
  }

  .right {
    height: 200px;
    background: red;
  }
</style>
<body>
  <div class="left"></div>
  <div class="right"></div>
</body>
```

得到布局如图：

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/img/CSS/01.png)

请在不修改已有内容情况下，加入样式，实现自适应（`.left` 宽度固定，`.right` 占满剩下宽度）两栏布局

- 根据 BFC 布局规则
  - 「**<font color=red>每个 `box` 水平方向上左边缘，与 BFC 左边缘相对齐，即使存在浮动也是如此</font>**」
  - 因此 `.left` 和 `.right` 的左边相接触，出现如此布局结果并不意外
- 同时，再想想 BFC 布局规则
  - 「**<font color=red>BFC 区域不会与浮动元素重叠，而是会依次排列</font>**」
  - 因此可以使 `.right` 形成 BFC，来实现自适应两栏布局

于是添加

```css
.right {
  overflow: hidden;
}
```

就可以得到

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/img/CSS/02.png)

当然，这种布局可以用更先进的 `flex` 或者 `grid` 手段解决，但是对于 BFC 这些 CSS 基础知识，同样要做到了然于胸

### 例题 2

看代码

```html
<style>
  .root {
    border: 5px solid blue;
    width: 300px;
  }

  .child {
    border: 5px solid red;
    width: 100px;
    height: 100px;
    float: left;
  }
</style>
<div class="root">
  <div class="child child1"></div>
  <div class="child child2"></div>
</div>
```

首先来回答第一个问：`.root` 的高度是多少？

事实上，因为 `.child` 为浮动元素，因此造成了「**<font color=red>高度塌陷</font>**」现象，`.root` 的高度为 0

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/img/CSS/03.png){width=400 height=400}

那么如何解决「高度塌陷」问题呢？

- 想想 BFC 规则
  - 「**<font color=red>浮动元素的高度也参与到 BFC 高度的计算当中</font>**」
  - 因此使 `.root` 形成 BFC，就能解决问题

```css
.root {
  overflow: hidden;
}
```

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/img/CSS/04.png){width=400 height=400}

此时高度已经被撑开了

### 例题 3

代码

```html
<style>
  p {
    color: blue;
    background: red;
    width: 400px;
    line-height: 100px;
    text-align: center;
    margin: 40px;
  }
</style>
<body>
  <p>paragraph 1</p>
  <p>paragraph 2</p>
</body>
```

首先回答问题：两段之间的垂直距离为多少？

- 想想 BFC 规则
  - 「**<font color=red>`box` 垂直方向的间距由 `margin` 属性决定，但是同一个 BFC 的两个相邻 `box` 的 `margin` 会出现边距折叠现象</font>**」
  - 事实上，因为边距折叠现象，答案为 `40px`
- 那么如何解决这个问题呢？
  - 最简单地，可以在 `p` 标签再包裹一个元素，并触发该元素形成一个 BFC
  - 那么这两个 `p` 标签，不再属于同一个 BFC，从而解决问题

```html
<style>
  p {
    color: blue;
    background: red;
    width: 400px;
    line-height: 100px;
    text-align: center;
    margin: 40px;
  }

  .wraper {
    overflow: hidden;
  }
</style>

<body>
  <p>paragraph 1</p>
  <div class="wraper">
    <p>paragraph 2</p>
  </div>
</body>
```

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/img/CSS/05.png){width=400 height=400}

总结：通过分析 BFC 是什么、如何形成、布局规则，融会贯通了 CSS 当中很多关键问题

也许不少开发者能够解决「边距折叠」、「多栏自适应」、「高度塌陷」等问题，但是并不能说出解决问题的原理
