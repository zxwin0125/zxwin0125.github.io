---
title: CSS 面试重点
category:
	- 面试
tag:
	- CSS
---

### 盒模型

> 题目：简述 CSS 的盒模型

- CSS 的盒模型主要包括以下两种，可通过 **<font color=red>box-sizing</font>** 属性进行配置：
  - **content-box**：默认属性，width 只包含 content
  - **border-box**：width 包含 (content、padding、border)

### CSS specificity (权重)

> 题目：简述下 css specificity

- css specificity 即 css 中关于选择器的权重，以下三种类型的选择器依次下降

1. **id 选择器**，如 #app
2. **class、attribute 与 pseudo-classes 选择器**，如 .header、[type="radio"] 与 :hover
3. **type 标签选择器和伪元素选择器**，如 h1、p 和 ::before

> [!warning]
> 其中通配符选择器 *，组合选择器 + ~ >，否定伪类选择器 :not() 对优先级无影响<br>
> 另有**内联样式** `<div class="foo" style="color: red;"></div>` 及 **!important(最高)** 具有更高的权重

> [:not 的优先级影响](https://codepen.io/zxwin0125/pen/qBeeORa) 可以看出 :not 对选择器的优先级无任何影响<br>
> [CSS Specificity](https://codepen.io/zxwin0125/pen/rNXXOwa) 可以看出十几个 class 选择器也没有一个 id 选择器权重高

- 补充问题:
  - 100 个 class 选择器和 id 选择器那个比较高「id 选择器高」
  - 属性选择器和类选择器哪个权重较高「加上指定元素的属性选择器 > 类选择器 >属性选择器」
  - 通配符选择器和元素选择器哪个权重教高「元素选择器高」

### + 与 ~ 选择器有什么不同

- `+` 选择器匹配紧邻的兄弟元素
- `~` 选择器匹配随后的所有兄弟元素

### z-index 与层叠上下文

> 题目：如何更好地给元素设置 z-index

- 在给元素设置z-index时，有几点需要注意：

1. 确保元素的z-index值是唯一的，否则可能会出现元素重叠的问题
2. 尽量将具有高z-index值的元素放在较低z-index值的元素的上面，以确保元素的堆叠顺序正确
3. 避免在多个元素上同时使用z-index，因为这可能会导致元素重叠或显示不正确
4. 如果需要设置多个元素的z-index值，可以使用CSS的层叠上下文（z-index stacking context）来解决。层叠上下文可以将元素分组，使得每个组内的元素按照z-index值的大小进行堆叠

> 题目：z-index: 999 元素一定会置于 z-index: 0 元素之上吗

- z-index高数值不一定在低数值前面，因为有层叠上下文的概念
- 当处于两个兄弟层叠上下文时，子元素的层级显示不决定于自身的z-index，而取决于父级的z-index
- 代码见[z-index](https://codepen.io/zxwin0125/pen/mdNNejL)

### 水平垂直居中

> 题目: 如何实现一个元素的水平垂直居中<br>
> 代码见[水平垂直居中](https://codepen.io/zxwin0125/pen/zYggrzE)

- absolute/translate
```css
.item {
  position: absolute;
  left/top: 50%;
  transform: translate(50%);
}
```

- flex
```css
.item {
  justify-content: center;
  align-content: center;
}
```

- grid
```css
.item {
  place-items: center;
}
```

### 左侧固定、右侧自适应

> 题目: css 如何实现左侧固定300px，右侧自适应的布局<br>
> 代码见[CSS布局_左固右适应](https://codepen.io/zxwin0125/pen/mdNNVxY)

- flex
  - 左侧: flex-basis: 200px
  - 右侧: flex-grow: 1; flex-shrink: 0;
- grid
  - 父容器: grid-template-columns: 200px 1fr;

### 三栏均分布局

> 题目: 如何实现三列均分布局<br>
> 代码见[CSS布局_三均分](https://codepen.io/zxwin0125/pen/rNXXxvG)

- flex:
  - 方案一: flex: 1;
  - 方案二: flex-basis: calc(100% / 3)
- grid:
  - 父容器: grid-template-columns: 1fr 1fr 1fr

### 如何画一个正方形/长宽固定的长方形

> 问题：如何画一个正方形/长宽固定的长方形<br>
> 代码见[CSS属性_aspect-ratio](https://codepen.io/zxwin0125/pen/rNXXxvG)

- 过去的解决方案是使用 padding
  - 一个元素的 padding 如若设置为百分比，则代表的是以父元素宽度为基准，根据这个原理，可设置长宽比
  - 但实际上意义有限，毕竟你把 padding 给占了，content 无任何区域
- 现代化的解决方案是使用长宽比的 CSS 属性: aspect-ratio

### CSS 如何避免样式冲突

> 题目：写 CSS 时如何避免命名样式冲突

1. BEM 式: .home-page .home-page-btn
```css
.home-page {
  .home-page-btn {}
}
```
- BEM 有一个缺点，就是有些太长，可适当简化，只包裹该页面组件的根类名，但有可能增加样式冲突的风险
```css
.home-page {
  .btn {}
}
```

2. CSS Scoped

- scoped css 会对当前组件(scope)下所有元素生成唯一的属性或类名，对所有 CSS 规则将携带唯一属性实现作用域的命名保护

```css
// 手动写
.btn {}
 
// 编译后
.btn .jsx-1287234 {}
```

3. CSS Module

- module css 会对类名进行 hash 化

### CSS 变量

> 题目：有没有使用过 css variable，它解决了哪些问题

```css
:root{
  --bgcolor: #aaa;
  --color: #000;
}
```

### CSS 配置暗黑模式

> 题目：如何使用 CSS 实现网站的暗黑模式 (Dark Mode)

- 最简单来讲，可通过媒体查询 `@media (prefers-color-scheme: dark) `与 CSS 变量实现

```css
@media (prefers-color-scheme: dark) {
  :root{
  }
}
```