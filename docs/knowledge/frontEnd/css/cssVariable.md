---
title: CSS 变量和主题切换优雅实现
date: 2024-08-12
category:
  - CSS3
tag:
	- CSS Variable
order: 3
---

- CSS 变量或者 CSS 自定义属性一直以来是一个值得关注的方向
- 我们前端没必要去「叫嚣」 CSS - HTML 是否图灵完备，但是 CSS 变量时代确实已经到来
> [!warning]
> 注意这里所说的不是 CSS 预处理器（类似 Less，Sass）中的变量，而是实实在在的原生支持特性

### 什么是 CSS 变量

- 什么是 CSS 变量呢？直接来看实例，有代码：

```css
body {
  background: white;
  color: #555;
}

a, a:link {
  color: #639A67;
}
a:hover {
  color: #205D67;
}
```

- 如果借助 CSS 变量，定义：

```css
:root {
  --bg: white;
  --text-color: #555;
  --link-color: #639A67;
  --link-hover: #205D67;
}
```

- 之后，上述代码可以直接简化为：

```css
body {
  background: var(--bg);
  color: var(--text-color);
}

a, a:link {
  color: var(--link-color);
}
a:hover {
  color: var(--link-hover);
}
```

- 这个很好理解，**在任何语言中，变量是个好东西：它可以降低维护成本，甚至实现更好的性能**
- CSS 变量语法也很简单：使用`--变量名`的方式定义变量，使用`var(--变量名)`的方式消费变量
- 更多 CSS 变量的基础内容可以访问：[使用 CSS 变量](https://developer.mozilla.org/zh-%20CN/docs/Web/CSS/Using_CSS_custom_properties)
- 值得一提的是，CSS 变量的兼容性「出乎意料」的好：

![示意图](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/CSS/08.png =500x)

- 我就在自己的项目中大范围使用了 CSS 变量，在 html 根节点下，定义 :root ：

![示意图](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/CSS/09.png =500x)

- 除了简单应用变量，我们能玩出哪些更高级的用法呢？

### 使用 CSS 变量实现主题切换

- 一键切换主题，以往实现方式较为复杂，借助 CSS 变量，一切变得容易起来
- 仍然以开头：

```css
:root {
  --bg: white;
  --text-color: #555;
  --link-color: #639A67;
  --link-hover: #205D67;
}
```

- 为例，再定义一个 .pink-theme 对应粉色主题：

```css
.pink-theme {
  --bg: hotpink;
  --text-color: white;
  --link-color: #B793E6;
  --link-hover: #3532A7;
}
```

- 这样一来，在切换主题时，就变得和 toggle class 一样简单

```javascript
const toggleBtn = document.querySelector('.toggle-theme')

toggleBtn.addEventListener('click', e => {
  e.preventDefault()

  if (document.body.classList.contains('pink-theme')) {
    // 当前主题为粉色主题，需要移除 pink-theme class
    document.body.classList.remove('pink-theme')

    toggle.innerText = '切换正常主题色'
  } else {
    document.body.classList.add('pink-theme')
    toggle.innerText = '切换为粉色少女主题'
  }
})
```

- 同时，利用 localStorage 实现主题的保存：

```javascript
const toggleBtn = document.querySelector('.toggle-theme')

if (localStorage.getItem('pinkTheme')) {
  document.body.classList.add('pink-theme')
  toggle.innerText = '切换为粉色少女主题'
}

toggleBtn.addEventListener('click', e => {
  e.preventDefault()

  if (document.body.classList.contains('pink-theme')) {
    // 当前主题为粉色主题，需要移除 pink-theme class
    document.body.classList.remove('pink-theme')

    toggle.innerText = '切换正常主题色'
    localStorage.removeItem('pinkTheme')
  } else {
    document.body.classList.add('pink-theme')
    toggle.innerText = '切换为粉色少女主题'
    localStorage.setItem('pinkTheme', true)
  }
})
```

- 非常的简单直观，我认为这将会成为 CSS 发展的一个不可避免的趋势