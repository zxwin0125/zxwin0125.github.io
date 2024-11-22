---
title: 进击的 HTML5
date: 2024-08-12
category:
	- HTML5
order: 1
---

- HTML5 给开发者提供了哪些便利呢？简单列举有：
  - 用于绘画的 canvas 元素
  - 用于媒介播放的 video 和 audio 元素
  - 对本地离线存储更好的支持（localStorage、sessionStorage）
  - 新的语义化标签（article、footer、header、nav、section…)
  - 新的表单控件（calendar、date、time、email、url、search…)
> [!info]
> 除了这些常规的之外，还有以下一些可交互性标签

- 给汉字加拼音

```html
<ruby>
	前端开发核心知识进阶
	<rt> qianduankaifahexinzhishijinjie </rt>
</ruby>
```

![示意图](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/HTML/01.webp =600x)

- 展开收起组件

```html
<details>
	<summary>前端开发核心知识进阶</summary>
	前端领域，入门相对简单，可是想要「更上一层楼」却难上加难，也就是我们常说的「职业天花板较低」，
	君不见——市场上高级/资深前端工程师凤毛麟角。这当然未必完全是坏事，一旦突破瓶颈，在技能上脱颖而出，
	便是更广阔的空间。那么，如何从夯实基础到突破瓶颈？
</details>
```

![示意图](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/HTML/02.webp =600x)

- 原生进度条和度量，progress 标签显示进度：

![示意图](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/HTML/03.webp =600x)

> [!warning]
> 值得一提的是：progress 不适合用来表示度量衡，如果想表示度量衡，应该使用 meter 标签代替

- 以往要实现这样的内容，都必须依靠 JavaScript 实现，现在来看，HTML 也变得更加具有「可交互性」
