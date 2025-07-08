---
title: 如何设计一个前端插件系统
description: 如何设计一个前端插件系统
keywords: JavaScript, JavaScript Plugin, 插件
---

# 如何设计一个前端插件系统？

> 原文地址：https://css-tricks.com/designing-a-javascript-plugin-system/

WordPress 有 [插件](https://wordpress.org/plugins/)，jQuery 有 [插件](https://plugins.jquery.com/)，[Gatsby](https://www.gatsbyjs.com/)、[Eleventy](https://www.11ty.dev/docs/plugins/) 和 [Vue](https://css-tricks.com/getting-started-with-vue-plugins/) 也有插件

插件是库和框架的常见特性，原因也很充分：它们能让开发者以安全、可扩展的方式添加功能。这使得核心项目更有价值，还能建立社区——而且不会增加额外的维护负担。这可真是划算！

那么，如何着手构建一个插件系统呢？让我们通过用 JavaScript 构建一个自己的插件系统来回答这个问题。

> [!tip] 我这里使用了“插件”这个词
> 但这类东西有时也会被称为其他名称，比如“扩展程序”“附加组件”或者“模块”。不管你怎么称呼它们，其概念（以及带来的好处）是相同的。

## 让我们构建一个插件系统

让我们从一个名为「BetaCalc」的示例项目开始。BetaCalc 的目标是成为一个极简主义的 JavaScript 计算器，其他开发者可以在此基础上添加“按钮”。以下是一些基本代码，帮助我们开始：

```JavaScript
// The Calculator
const betaCalc = {
  currentValue: 0,

  setValue(newValue) {
    this.currentValue = newValue;
    console.log(this.currentValue);
  },

  plus(addend) {
    this.setValue(this.currentValue + addend);
  },

  minus(subtrahend) {
    this.setValue(this.currentValue - subtrahend);
  }
};

// Using the calculator
betaCalc.setValue(3); // => 3
betaCalc.plus(3);     // => 6
betaCalc.minus(2);    // => 4
```

我们将计算器定义为一个对象字面量，这样便于操作。该计算器的工作原理是通过 console.log 来输出其计算结果。

目前功能确实比较有限。我们有一个“setValue”方法，它能接收一个数字并将其显示在“屏幕上”。我们还有“加”和“减”方法，它们会对当前显示的数值进行运算。

是时候增加更多功能了。首先，让我们创建一个插件系统。

## 世界上最小的插件系统

首先，我们将创建一个注册方法，其他开发者可以使用该方法将插件注册到「BetaCalc」中。这个方法的任务很简单：获取外部插件，获取其执行函数，并将其附加到我们的计算器上作为新的方法：

```JavaScript
// The Calculator
const betaCalc = {
  // ...other calculator code up here

  register(plugin) {
    const { name, exec } = plugin;
    this[name] = exec;
  }
};
```

这里有一个示例插件，它为我们的计算器添加了一个“平方”按钮：

```JavaScript
// Define the plugin
const squaredPlugin = {
  name: 'squared',
  exec: function() {
    this.setValue(this.currentValue * this.currentValue)
  }
};

// Register the plugin
betaCalc.register(squaredPlugin);
```

在许多插件系统中，插件通常会包含两个部分：

- 要执行的代码
- 元数据（例如名称、描述、版本号、依赖项等）

在我们的插件中，exec 函数包含我们的代码，而名称则是我们的元数据。当插件注册时，exec 函数会直接附加到我们的 betaCalc 对象上，并作为其方法之一，从而使其能够访问 BetaCalc 的 this

所以现在，BetaCalc 有了一个新的“平方”按钮，可以直接点击使用：

```JavaScript
betaCalc.setValue(3); // => 3
betaCalc.plus(2);     // => 5
betaCalc.squared();   // => 25
betaCalc.squared();   // => 625
```

这个系统有很多值得称赞的地方。该插件是一个简单的对象字面量，可以传入我们的函数中。这意味着插件可以通过 npm 下载，并以 ES6 模块的形式导入。便捷的分发方式非常重要！

但我们的系统存在一些缺陷。

通过让插件能够访问 BetaCalc 的这些内容，它们就能获得对 BetaCalc 所有代码的读写权限。虽然这对于获取和设置当前值很有用，但同时也存在风险。如果一个插件要重新定义一个内部函数（比如 setValue），可能会给 BetaCalc 和其他插件带来意想不到的结果。这违反了 [开闭原则](https://en.wikipedia.org/wiki/Open%E2%80%93closed_principle)，该原则指出软件实体应该对扩展开放，对修改关闭。

此外，“平方”函数的工作方式会产生 [副作用](<https://en.wikipedia.org/wiki/Side_effect_(computer_science)>)。这在 JavaScript 中并不罕见，但感觉并不好——尤其是当其他插件也可能在干扰相同的内部状态时更是如此。采用更 [函数式](https://en.wikipedia.org/wiki/Functional_programming) 的编程方式将大大有助于使我们的系统更安全、更可预测。

## 更优的插件架构

让我们再探讨一下更优的插件架构。接下来的这个示例不仅改变了计算器本身，还改变了其插件接口：

```JavaScript
// The Calculator
const betaCalc = {
  currentValue: 0,

  setValue(value) {
    this.currentValue = value;
    console.log(this.currentValue);
  },

  core: {
    'plus': (currentVal, addend) => currentVal + addend,
    'minus': (currentVal, subtrahend) => currentVal - subtrahend
  },

  plugins: {},

  press(buttonName, newVal) {
    const func = this.core[buttonName] || this.plugins[buttonName];
    this.setValue(func(this.currentValue, newVal));
  },

  register(plugin) {
    const { name, exec } = plugin;
    this.plugins[name] = exec;
  }
};

// Our Plugin
const squaredPlugin = {
  name: 'squared',
  exec: function(currentValue) {
    return currentValue * currentValue;
  }
};

betaCalc.register(squaredPlugin);

// Using the calculator
betaCalc.setValue(3);      // => 3
betaCalc.press('plus', 2); // => 5
betaCalc.press('squared'); // => 25
betaCalc.press('squared'); // => 625
```

我们这里有一些显著的变化。

首先，我们将插件与“核心”计算方法（如加法和减法）分离开来，将它们放入单独的插件对象中。将我们的插件存储在插件对象中使我们的系统更加安全。现在，访问此插件的插件无法看到 BetaCalc 的属性——它们只能看到 betaCalc.plugins 的属性。

其次，我们采用了一种查找方法，即通过按钮名称来查找其功能，然后调用该功能。现在，当我们调用插件的“执行”函数时，会向其传递当前的计算器值（currentValue），并期望它返回新的计算器值。

从根本上说，这种新的打印方法将我们所有的计算器按键都转换成了 [纯函数](https://en.wikipedia.org/wiki/Pure_function)。这些按键接收一个值，执行一项操作，并返回结果。这具有诸多优点：

- 它简化了 API。
- 它使测试变得更容易（对 BetaCalc 以及插件本身而言皆是如此）。
- 它减少了我们系统的依赖性，使系统更加 [松耦合](https://en.wikipedia.org/wiki/Loose_coupling)。

这种新的架构比第一个示例更有限，但这是件好事。我们实际上为插件作者设置了防护栏，限制他们只能进行我们希望他们做出的那种改动。

实际上，这可能太过局限了！现在我们的计算器插件只能对当前值进行操作。如果插件开发者想要添加诸如“记忆”按钮或记录历史功能之类的高级功能，他们将无法实现。

或许这样也没问题。你赋予插件开发者的能力需要保持一种微妙的平衡。如果赋予他们的权力过大，可能会对你的项目稳定性造成影响。但如果赋予他们的权力过小，又会使他们难以解决自身的问题——在这种情况下，或许根本就不需要插件了。

## 我们还能做些什么呢？

我们还有很多其他办法可以用来改进我们的系统。

我们还可以添加错误处理功能，以便在插件作者未定义名称或未返回值的情况下向他们发出通知。要像质量保证开发人员那样思考，设想我们的系统可能会出现何种故障情况，这样我们就能提前做好应对这些情况的准备。

我们可以扩大插件的功能范围。目前，BetaCalc 插件只能添加一个按钮。但如果它还能为某些生命周期事件（比如计算器即将显示数值时）注册回调函数会怎样呢？或者如果它有一个专门的区域可以用于在多次交互中存储状态，那会怎样？这是否能开启一些新的应用场景呢？

我们还可以进一步扩展插件注册功能。如果一个插件能够以一些初始设置的形式进行注册会怎样？这是否能让插件更具灵活性呢？如果插件作者想要注册一整套按钮（比如“BetaCalc 统计包”）而不是单个按钮，那需要做哪些改动才能支持这种需求呢？

## 您的插件系统

BetaCalc 及其插件系统的设计初衷就是力求简洁。如果您的项目规模较大，那么您可能会需要探索其他类型的插件架构。

一个不错的入手点是去研究现有的项目，从中寻找成功的插件系统实例。对于 JavaScript 来说，这可能包括 [jQuery](https://learn.jquery.com/plugins/basic-plugin-creation/)、[Gatsby](https://www.gatsbyjs.com/)、[D3](https://github.com/d3/d3)、[CKEditor](https://ckeditor.com/docs/ckeditor4/latest/guide/plugin_sdk_intro.html) 等等。

您或许还应该熟悉各种 [JavaScript 设计模式](https://sparkbox.com/foundry/javascript_design_patterns)。（阿迪·奥斯米尼有一本关于此主题的书籍。） 每种模式都提供了不同的接口和耦合程度，这为您提供了许多良好的插件架构选择。了解这些选项有助于您更好地平衡所有使用您的项目的人员的需求。

除了这些模式本身之外，还有很多优秀的软件开发原则可以供您参考，以做出这类决策。我在此过程中已经提到了一些（比如开闭原则和松耦合），但其他相关的原则还包括 [迪米特法则](https://wiki.c2.com/?LawOfDemeter) 和 [依赖注入](https://www.martinfowler.com/articles/injection.html)。

我知道这听起来好像要求很高，但你必须做好充分的调研工作。要是因为你需要改变插件架构而让所有人重新编写插件，那将会是一件非常令人痛苦的事情。这会迅速导致大家失去信任，并且还会让未来的人们不敢再参与贡献了。

## 总结

从零开始编写一个出色的插件架构是件非常困难的事情！你需要综合考虑诸多因素，才能构建出一个能满足所有人需求的系统。它是否足够简单？是否足够强大？能否长期稳定运行？

不过，这值得付出努力。拥有一个良好的插件系统对所有人都有好处。开发者能够获得解决问题的自由。终端用户可以从中选择大量的可选功能。而且，您还能围绕您的项目建立起一个生态系统和社区。这是一个三赢的局面。
