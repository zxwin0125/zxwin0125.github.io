# 不可忽视的 Web Components

> [!tip]
> 作为「更高阶」的前端工程师，要时刻保持技术视野和信息广度
> 
> 事实上，Web Components 的概念在几年前也已经提出，但是貌似一直没有发展很火
> 
> 在框架带来的「组件化」、「生命周期化」这些统治级别的概念下，对比并结合 Web Components，这是可以深入研究的一个方向

总结一下 Web Components 的特殊点或者优点

## 原生规范，无需框架，但是继承且具备了框架的优点

在新的 Web Components 规范中，会发现组件生命周期的概念、slot 概念、模版概念（类比 JSX 或者 Vue template）

再结合本来就已经存在的组件化，shadow dom，扩展原生元素的能力，Web Components 还是具备了较好的发展前景

## 原生使用，无需编译

现有的一系列框架，不论是 Vue 还是 React，都需要进行编译，而 Web Components 因为原生，会得到浏览器的天然支持，自然就可以免去编译构建过程

## 真正的 CSS scope

Web Components 实现了真正的 CSS scope，做到了样式隔离

这一点可以对比 CSS Modules

真正的 CSS scope 对于项目的可维护性至关重要

> [!important]
> 真正的高级工程师，不仅仅要理解 this、熟练掌握各种基础，更要有技术嗅觉，对新的解决方案能够理解，并进行对比，面向「未来」编程

