# CSS 最佳实践

## 除了常规 CSS，还有哪些样式体系方案

除了常规的 CSS，还有许多样式体系方案和工具可以使用，我们可以在不同场景下选择合适方案

### 1. CSS 预处理器

#### 核心概念

- 变量：定义可复用的值（如颜色、字体大小）
- 嵌套规则：支持结构化的书写方式，体现层级关系
- 混合器（Mixin）：复用样式片段
- 继承（Extend）：共享规则而不复制代码
- 运算：可直接在 CSS 中进行数学计算

#### 优点

- 强大的工具和功能提升 CSS 开发效率
- 代码更模块化、易维护
- 提供逻辑控制（如条件、循环）

#### 缺点

- 需要编译，增加了开发流程的复杂性
- 较低的性能优势（生成的 CSS 可能冗杂）

#### 代表

Sass、Less、Stylus

### 2. CSS-in-JS

#### 核心概念

- 样式与组件绑定，直接用 JavaScript 来编写 CSS
- 样式动态化：可以根据组件的状态动态生成 CSS
- 支持模块化和作用域隔离，无需担心样式冲突

#### 优点

- 与 React 等框架无缝集成
- 动态样式管理更简单
- 避免全局样式污染

#### 缺点

- 运行时性能开销稍大（动态生成 CSS）
- 可能不适合大型项目中的复杂样式
- 学习成本高，需熟悉 JS 与 CSS 的结合方式

#### 代表

Styled-components、Emotion、JSS

### 3. CSS 模块化（CSS Modules）

#### 核心概念

- 自动生成唯一的类名，避免全局样式冲突
- 样式按需加载，按模块分离，提升可维护性

#### 优点

- 与现代工具（Webpack）无缝配合
- 易于维护且避免了命名冲突
- 性能优于 CSS-in-JS，因为 CSS 模块在构建时静态生成

#### 缺点

- 需要构建工具支持
- 动态样式支持不如 CSS-in-JS 灵活

### 4. Atomic CSS / Utility-First CSS

#### 核心概念

- 提供大量小型、单一功能的类名（例如 flex、mt-4、text-center）
- 通过组合这些类名来构建页面，而不是定义特定样式

#### 优点

- 快速开发，无需写自定义 CSS 规则
- 样式统一，减少样式冗余和重复定义
- 强大的社区和生态支持（Tailwind CSS）

#### 缺点

- 学习成本较高（需要记忆大量类名）
- HTML 文件中类名过多，可读性较差
- 定制复杂页面时可能反而不如自定义 CSS 高效

#### 代表

Tailwind CSS、Bootstrap Utilities

### 5. PostCSS

#### 核心概念

- CSS 的工具平台，通过插件链实现功能扩展（如自动前缀、变量、嵌套）

#### 优点

- 灵活性强，可定制插件链
- 与现代构建工具无缝集成

#### 缺点

- 需学习插件配置，复杂度高

### 6. BEM（Block, Element, Modifier）命名规范

#### 核心概念

- 基于类名的命名约定，分为 Block（模块）、Element（模块内部元素）、Modifier（模块的变体）
- 示例：button__icon-large

#### 优点

- 命名规范清晰，适合团队协作
- 全局样式冲突可能性低
- 不依赖工具链，简单直接

#### 缺点

- 类名较长，增加代码冗长
- 无法动态生成样式，灵活性不如 CSS-in-JS

### 7. 面向对象的 CSS（OOCSS）

#### 核心概念

- 样式分为结构“腔”和“皮肤”，分别管理内容和外观
- 注重重用和组合，通过抽象样式减少冗余
- 提升样式复用性，降低维护成本

#### 优点

- 更符合开发者逻辑思维

#### 缺点

- 初期规划耗时较多，需要一定经验
- 可能增加 HTML 的复杂性（需要多类名组合）

### 8. Functional CSS

#### 核心概念

- 将样式归纳为具体功能块，极度简化的类名代表单一功能
- 类似 Atomic CSS，但更注重功能抽象化

#### 优点

- 类似于 Tailwind，降低 CSS 开发量
- 功能解耦清晰，易于理解和维护

#### 缺点

- 可读性可能较差
- 高度依赖文档，需记忆

#### 代表

Tachyons

### 9. Scoped CSS

#### 核心概念

- 样式作用域限制在所在组件内
- 使用技术如 Vue 的 scoped 属性或 Web Component 的 Shadow DOM 来实现隔离


#### 优点

- 样式属性强，不受外部影响
- 代码组织性和清晰性

#### 缺点

- 需工具链支持
- 可能增加样式复杂性，某些全局样式难以覆盖

#### 代表

Vue scoped、Shadow DOM

### 10. Design Tokens

#### 核心概念

- 使用一组通用的变量（颜色、间距、字体等）在多个平台之间共享样式


#### 优点

- 适合跨平台项目（Web、移动）
- 加速开发成果一致

#### 缺点

- 初期实施成本较高
- 动态性和灵活性较低

#### 代表

- Salesforce Lightning Design System 

## CSS、CSS-in-JS、Tailwind CSS 的使用技巧与方案价值体现

### CSS 使用技巧与价值体现

CSS 值得关注的技巧
- **变量复用**：通过`:root`定义全局变量，提升可维护性
- **BEM 命名规范**：使代码更清晰
- **Flex 布局**：快速实现响应式设计

#### 示例：一个按钮组件

**HTML 文件**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="stylesheet" href="styles.css">
    <title>CSS 示例</title>
</head>
<body>
    <div class="button-container">
        <button class="button button--primary">Primary Button</button>
        <button class="button button--secondary">Secondary Button</button>
    </div>
</body>
</html>
```

**CSS 文件**

```css
/* 定义全局变量 */
:root {
    --primary-color: #3498db;
    --secondary-color: #2ecc71;
    --button-padding: 10px 20px;
    --button-radius: 5px;
}

/* BEM 命名 */
.button {
    padding: var(--button-padding);
    border-radius: var(--button-radius);
    border: none;
    color: white;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.button--primary {
    background-color: var(--primary-color);
}

.button--primary:hover {
    background-color: darken(var(--primary-color), 10%);
}

.button--secondary {
    background-color: var(--secondary-color);
}

.button--secondary:hover {
    background-color: darken(var(--secondary-color), 10%);
}

/* 响应式技巧 */
@media (max-width: 600px) {
   .button {
        font-size: 14px;
    }
}
```

#### 方案价值体现

- 通过变量和 BEM 规范，增强了代码的模块化和复用性
- 响应式设计提升了适配能力

### CSS-in-JS 使用技巧与价值体现

CSS-in-JS 亮点
- **动态样式**：支持根据状态生成样式
- **样式隔离**：避免全局污染
- **嵌套规则**：便于层级关系定义

#### 示例：React + Styled-components

**安装依赖**

```bash
npm install styled-components
```

**React 代码**

```jsx
import React, { useState } from "react";
import styled from "styled-components";

// 动态样式
const Button = styled.button`
    padding: 10px 20px;
    border-radius: 5px;
    border: none;
    color: white;
    font-size: 16px;
    cursor: pointer;
    background-color: ${(props) => (props.primary? "#3498db" : "#2ecc71")};
    &:hover {
        background-color: ${(props) => (props.primary? "#2980b9" : "#27ae60")};
    }
`;

const App = () => {
    const [primary, setPrimary] = useState(true);

    return (
        <div>
            <Button primary={primary} onClick={() => setPrimary(!primary)}>
                {primary? "Primary Button" : "Secondary Button"}
            </Button>
        </div>
    );
};

export default App;
```

#### 方案价值体现

- 样式与组件绑定，减少上下文切换，易于理解
- 动态样式让交互更灵活（如`primary`属性）

### Tailwind CSS 使用技巧与价值体现

TailwindCSS 优势
- **原子化设计**：快速实现复杂布局
- **样式集中管理**：通过配置文件定制主题
- **快速迭代**：减少自定义 CSS 编写时间

#### 示例：按钮组件

**安装依赖**

```bash
npm install tailwindcss
npx tailwindcss init
```

**配置文件（tailwind.config.js）**

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["**/*.{html,js}"],
    theme: {
        extend: {
            colors: {
                primary: "#3498db",
                secondary: "#2ecc71"
            }
        }
    },
    plugins: []
};
```

**入口 css 样式**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**编译输出**
```bash
npx tailwind -i style.css -o output.css --watch
``` 

**HTML 文件**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link href="./output.css" rel="stylesheet">
</head>
<body>
    <h1 class="text-3xl font-bold underline text-primary">Hello world!</h1>
    <h2 class="text-2xl text-secondary">hello world</h2>
</body>
</html>
```

#### 方案价值体现

- 开箱即用的类名加快开发速度
- 配置灵活（如主题扩展）满足不同项目需求

### 总结

| 特性 | CSS | CSS-in-JS | TailwindCSS |
| --- | --- | --- | --- |
| 学习曲线 | 低 | 中 | 高 |
| 动态样式支持 | 弱 | 强 | 强 |
| 可维护性 | 高（配合 BEM 等） | 高（模块化、隔离） | 中（HTML 中类名较多） |
| 适合场景 | 静态页面、小型项目 | React 等现代框架 | 快速开发、设计系统 |

## 在项目架构初期，如何考虑选择合适的样式体系方案

### 样式体系选择的思考框架

> [!important]
> 在项目架构初期，选择样式体系时需要综合考虑以下因素
> - **项目特点**：团队规模、交付周期、性能要求
> - **技术适配性**：是否适合现有的技术栈和工具链
> - **团队能力**：成员对样式工具的熟悉程度
> - **未来扩展性**：是否支持模块化、响应式、动态样式等特性

### 样式方案技术评审

#### CSS 与 Module CSS 的基础与进阶

**核心概念**

1. 选择器与优先级计算规则
   - 理解层叠规则，避免优先级混乱

2. 常用布局方案
   - Flexbox：一维布局，适用于弹性盒子模型
   - Grid：二维布局，适合复杂页面设计
  
3. 动画与过渡
   - 利用`transition`和`@keyframes`实现交互效果

**高级技巧**

1. 使用变量与计算属性
   - CSS 变量（`--color-primary`）实现主题统一
   - 动态计算属性提升样式复用性

2. 高效媒体查询与响应式设计
   - 使用`@media`定义断点，适配不同屏幕

3. 命名规范对比
   - BEM 提高可读性，适合团队协作
   - 工具化命名（如原子类）更高效但可读性较低

**性能优化**

1. 避免重排与重绘
   - 减少`position: absolute`或`float`引发的复杂计算

2. 优化工具
   - 使用`contain`限制渲染范围
   - 利用`will-change`提前优化 GPU 加速

#### CSS-in-JS 的核心用法与优劣分析

**背景与发展**

1. 为什么需要 CSS-in-JS
   - 随着组件化的普及，CSS-in-JS 提供了动态、模块化的样式管理

2. 主流框架对比
   - **Styled-components**：直观、易用，性能较好
   - **Emotion**：灵活性高，支持 TypeScript
   - **JSS**：适合复杂定制场景

**核心特性**

1. 动态样式
   - 基于`props`或状态动态生成样式

2. 嵌套与继承
   - 模仿传统 CSS 的嵌套规则，简化代码结构

3. Scoped 样式
   - 避免全局污染，提升模块化

**最佳实践**

1. 性能控制
   - 避免频繁注入动态样式

2. 类型安全
   - 结合 TypeScript 定义样式属性

3. 主题系统
   - 实现基于主题的样式切换

**限制与挑战**

- 性能问题：大规模项目中可能引入注入开销
- 兼容性：与传统 CSS 或样式库结合需要额外适配

#### TailwindCSS 的核心用法与进阶

**核心理念**

- 原子化 CSS 通过预定义类名（如`bg-blue-500`）快速实现设计
- 减少自定义样式，提升生产效率

**基础使用**

1. 配置文件自定义
   - `tailwind.config.js`定义主题颜色、断点等

2. 常用类
   - 排版：`text-center`、`font-bold`
   - 间距：`p-4`、`m-2`
   - 颜色：`bg-red-500`、`text-gray-700`

**高级用法**

1. 动态样式构建
   - 使用`@apply`提取复用的样式逻辑

2. 复杂交互
   - 配置`variants`支持如`hover`、`focus`等状态样式

3. 性能优化
   - 利用 JIT 编译只生成使用的类

**在团队中的实践**

1. 结合设计系统
   - Tailwind 的类名可与组件库风格统一

2. 代码风格
   - 通过类名排序、工具链规范可提升可读性

### 样式方案评审流程

#### 样式评审的目标

1. 确保样式与设计一致性
2. 提高代码的复用性与维护性
3. 优化性能，避免冗余样式

#### 评审标准

1. 规范性
   - 是否符合团队样式规范？

2. 复用性与扩展性
   - 样式是否可适应不同场景？

3. 性能优化
   - 是否存在不必要的重排与重绘？

#### 流程细节

1. 自查
   - 使用 Stylelint 等工具辅助检查

2. 代码 Review
   - 团队协作评审，及时反馈

3. 回归测试
   - 通过工具或手动比对视觉效果

### 最佳实践

**样式体系设计**

1. 分层架构
   - Base Styles：全局样式基础
   - Components：组件样式
   - Utilities：工具类样式

2. 原子化样式与组件化结合
   - 小型工具类与可复用组件的均衡

**工具链与自动化**

1. 样式检查
   - 使用 Linter 确保规范

2. 性能优化
   - CSS 压缩与 Tree-shaking 减少文件大小

**跨端样式管理**
- 通过工具实现 PC、H5、小程序的样式复用
- 响应式布局通用解决方案（如 flex 和媒体查询）

**案例分享**
1. 字节内部的分层架构实践
2. Tailwind CSS 的高效应用场景

### 实战：制定团队样式方案

#### 问题分析

1. 项目特点
   - 小型项目适合原子化样式
   - 大型项目需要更多模块化和动态样式支持

2. 样式目标
   - 统一的风格，支持高效开发

#### 方案设计

1. 服务端渲染项目：CSS / Module CSS 定义全局规则

2. React SPA 项目：CSS-in-JS 管理复杂交互

3. 小型 POC 项目快速布局：Tailwind CSS 实现页面搭建

4. 工具链支持
   - PostCSS 处理自动前缀与变量
   - Stylelint 保证代码规范

#### 验证与迭代

1. 试点运行
   - 在小范围内测试新方案

2. 反馈优化
   - 根据团队反馈调整工具与规范