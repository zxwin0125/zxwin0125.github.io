<!-- - 前端规范化的考虑，以及最终结果产出
- ESLint9 从零到一，从基础 js 到 ts 再到框架的完整体系
- ESLint9 完备体系的微内核/插件化设计思想浅析
- 前端工具链畅想，基于 oxc 新生代体系架构与建设 -->

<!-- - 理解项目规范化在团队合作中的作用和价值。
- 熟悉 ESLint 9 在 JavaScript 项目中的基本使用和配置方式。
- 掌握 ESLint 核心规则的含义及其在实际项目中的应用。
- 深入了解 ESLint 在自动化、CI/CD 流程中的应用，以确保高效的代码管理和团队协作。 -->

# 基于 ESLint 9 前端工程规范化最佳实践

## 项目里有考虑过规范化相关内容吗？除了 ESLint 还有没有什么其他方案？

### 怎么理解项目规范化？

项目规范化就是在团队开发过程中，按照一样的技术、编码风格、目录结构和代码质量标准

规范化的核心目标
- 尽可能提高项目的可维护性、一致性和可读性
- 尽可能减少团队成员之间因为代码风格或规则不统一而产生的沟通成本

提升代码质量的同时，有助于减少项目的复杂性，提升协作效率

### 规范化的层面

项目规范化不仅仅体现在代码层面，还包括多个方面

- **文件结构**：合理的项目目录和文件组织方式，确保每个模块都能快速定位

- **命名规则**：统一的变量、函数、文件命名规范，确保代码清晰，容易理解

- **提交规范**：代码提交时的格式要求，包括提交信息的规范化，以便团队成员快速了解每次提交的目的和内容

### JavaScript 代码规范化

#### 什么是 ESLint？

> [!info]
> ESLint 是一款 JavaScript 和 TypeScript 的代码质量检查工具，帮助开发者确保代码在语法、逻辑、风格等方面符合既定的规则
> 
> 它为项目提供灵活的配置，适应不同团队的需求

#### 为什么要使用 ESLint？

ESLint 主要作用是及时发现潜在的代码错误，提升代码质量

通过对代码风格的统一，ESLint 还能够减少团队成员之间的沟通成本和开发冲突

#### ESLint 的核心原理

ESLint 通过抽象语法树（AST）分析代码

它将代码转换为一个树状结构，通过分析树的节点，识别出不符合规则的部分

这种基于结构化数据的检查方式使得 ESLint 能够精确地检查代码的各个细节

### ESLint 规则约定

#### 规则的三种级别

- **off**：关闭规则，ESLint 不会进行任何检查

- **warn**：警告级别，违反规则时会显示警告，但不会阻止代码运行
  
- **error**：错误级别，违反规则时会报错，常用于团队必须遵循的规范

#### 核心规则讲解

- **语法检查**：确保代码符合语法规范，如禁止使用未定义的变量或重复声明变量

- **风格一致性**：确保代码风格统一，如强制使用分号、统一的空格和缩进规则

- **最佳实践**：如禁止使用`eval()`函数，避免原型污染等，以减少潜在的安全隐患

#### 常用规则的意义

例如，`no-unused-vars`规则能够帮助减少冗余代码，而`eqeqeq`规则要求使用全等运算符（===）来避免隐式类型转换问题

根据项目的实际需求，可以进一步定制 ESLint 规则

### 团队协作与代码风格统一

#### ESLint 与 Prettier 的集成

ESLint 专注于代码的语法和逻辑检查，而 Prettier 专注于代码的格式化

通过将 ESLint 和 Prettier 结合使用，团队可以确保代码在功能和风格上的一致性，从而减少不必要的团队冲突

#### 代码风格统一的益处

通过自动化的代码风格统一，团队成员无需为代码格式进行争论，PR 审查更加高效，开发者可以将精力集中在业务逻辑和架构优化上

### 实际项目中的 ESLint 实践

#### 规则集选择

在实际项目中，团队可以根据项目规模和成员数量选择合适的规则集

对于大型项目，可以使用像 Airbnb 这样的严格规则集，而小型项目可以使用 ESLint 推荐的灵活配置

#### 大型团队的 ESLint 配置技巧

在大型项目中，可能涉及多个子项目或模块

通过`overrides`选项，可以为不同模块配置不同的规则

例如，可以为后端模块允许`console.log`，而前端模块则禁用此规则，确保一致性

### 自动化与 ESLint 的集成

#### Git Hooks

通过 husky 和 lint-staged，可以在每次 Git 提交之前检查代码，确保不符合规范的代码不会被提交

这为团队提供了一道额外的质量保障

#### CI/CD 集成

在 CI/CD 流程中集成 ESLint，确保每次代码合并时都能符合项目规范，从而有效减少代码审查的复杂度和时间成本

#### 自动化的价值

自动化 ESLint 检查不仅减少了人为疏忽的可能性，还提高了项目的一致性，避免了代码风格和逻辑不统一的问题

### 团队项目规范化推进细节

#### 最佳实践

在项目中逐步引入 ESLint 规范，从宽松到严格的过渡，避免团队成员产生抵触情绪

建议先让团队熟悉核心规则，再逐步加强规则的严格程度

#### 常见问题和解决方法

例如，团队成员对代码风格存在分歧时，可以利用 Prettier 和 ESLint 来统一风格，从而减少人为的干预和摩擦

### 其他代码质量检查工具与方案

#### oxlint

oxlint 是一种用于 JavaScript 和 TypeScript 项目的静态代码分析工具，旨在提高代码质量和一致性

它类似于 ESLint，但在某些功能和配置上有所不同

oxlint 以轻量级、高效和高自定义为特点，适合那些需要细致控制和优化的项目

**特点与优势**

- **高效**：相比一些更为复杂的工具，oxlint 更加轻量，运行速度较快

- **简化配置**：提供了简洁的配置方式，使得项目能够快速上手

- **细致的规则管理**：支持对不同模块和文件进行单独配置，避免一刀切的规则

- **集成能力**：与其他工具如 Prettier、Husky、CI/CD 管道等有很好的兼容性，能够实现自动化代码检查

**使用场景**

- 适合中小型项目，尤其是在需要快速定制规则或快速集成的环境中，oxlint 提供了一个灵活且高效的解决方案

#### Prettier

Prettier 主要侧重于代码格式化，而非语法和逻辑检查

它是一个用于自动化代码格式化的工具，支持多种编程语言，包括 JavaScript、TypeScript、HTML、CSS 等

Prettier 可以与 ESLint 集成，确保代码风格的一致性，并避免手动修复格式问题

**特点与优势**

- **自动化格式化**：可以自动调整代码格式，确保符合统一的风格标准

- **支持多种语言**：不仅支持 JavaScript 和 TypeScript，还支持 HTML、CSS、JSON、Markdown 等多种语言的格式化

- **无配置化**：默认配置即可使用，不需要繁琐的设置

**使用场景**

- Prettier 适合与 ESLint 一起使用，专注于代码的格式化部分，减轻了团队在格式统一上的负担

## 有了解过前端编码规范化吗，团队中都有过哪些尝试，ESLint9 或者 oxclint 有深入实践经验吗？

在开发过程中，尤其是前端开发，代码风格和质量的统一性对团队协作和代码维护至关重要

为了提高代码的一致性、可读性，减少错误，并且在后期维护中更高效，我们团队引入了编码规范化的实践

最常用的工具之一就是 ESLint，它帮助我们实现了代码规范的自动化检查，并对不同项目类型（如 JS、TS、Vue）提供了定制化的配置

团队内部普遍认同通过统一的编码规范和代码质量检查工具提升项目的可维护性和稳定性

我们选择了 ESLint 作为代码质量检测工具，它支持 JavaScript、TypeScript 及 Vue 等多种开发环境

以下是我们在不同项目中的实际配置与实践经验

### JS 项目的 ESLint 配置

#### 基础配置

在 JS 项目中，基础配置主要用于检查常见的代码问题

通过 ESLint，我们能够发现如未定义变量、未使用变量等问题，从而提前规避错误，提升代码质量

以下是我们为 JS 项目配置的基础 ESLint 规则

```javascript
export default {
    rules: {
        "no-console": "error", // 禁止使用 console，避免在生产环境中输出调试信息
        "no-unused-vars": "error", // 禁止未使用的变量，确保代码中所有声明的变量都有实际用途
        "no-sparse-arrays": "error", // 避免稀疏数组，防止潜在问题
        "no-undef": "error", // 禁止使用未定义的变量
        "no-unreachable": "error", // 避免无法到达的代码
        "no-dupe-keys": "error", // 禁止对象字面量中的重复键
    },
};
```
#### 核心规则介绍

- **"no-console"**：禁止使用`console`，避免在生产代码中出现调试信息

- **"no-unused-vars"**：禁止未使用的变量，确保所有声明的变量都有实际用途

- **"no-sparse-arrays"**：避免稀疏数组，防止不必要的空元素

- **"no-undef"**：禁止使用未定义的变量

- **"no-unreachable"**：避免无效或无法到达的代码段，保持代码清晰

- **"no-dupe-keys"**：禁止在对象字面量中使用重复的键

#### 规则集简化

```javascript
import js from "@eslint/js";
export default [js.configs.recommended];
```

通过简化配置，我们能快速应用基础规则，提升代码的一致性

### TS 项目的 ESLint 配置

将 JS 项目迁移到 TypeScript 项目时，我们遇到了一些问题，主要是 ESLint 默认规则无法完全适应 TypeScript 的类型系统

为了解决这一问题，我们引入了 @typescript-eslint/parser 解析 TypeScript 代码，并扩展了规则集

#### TS 项目配置

```javascript
import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
export default [
    {
        ignores: ["eslint.config.js"],
        files: ["src/**/*.ts"],
        rules: {
            "no-console": "error",
            "no-unused-vars": "error",
            "no-sparse-arrays": "error",
            "no-undef": "error",
            "no-unreachable": "error",
            "no-dupe-keys": "error",
        },
        languageOptions: {
            parser: tsParser,
        },
    },
];
```
#### 配置要点

- **引入 TypeScript Parser**：我们使用 @typescript-eslint/parser 来支持 TypeScript 语法和类型检查

- **扩展基础规则**：继承了 JS 项目的规则，并加入了 TypeScript 特有的规则（如类型定义的强制规则等）

- **忽略 ESLint 配置文件**：通过`ignores`忽略 ESLint 配置文件，避免循环解析问题

#### 实践经验

通过 ESLint 和 TypeScript 的结合，我们不仅能检查基础语法错误，还能利用 TypeScript 的类型系统发现潜在类型错误

例如，声明未使用的接口或类型时，会立即提示，从而帮助我们保持清晰的类型结构

### Vue 项目的 ESLint 配置

在迁移到 Vue 项目时，.vue 文件的特殊格式使得标准的 JS 和 TS 配置无法完全适用

因此，我们引入了 vue-eslint-parser 解析 Vue 文件，并结合 @typescript-eslint/parser 来处理其中的 TypeScript 代码

#### Vue 项目配置

```javascript
import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import vueEslintParser from "vue-eslint-parser";
export default [
    {
        ignores: ["eslint.config.js"],
        files: ["src/**/*.vue"],
        rules: {
            "no-console": "error",
            "no-unused-vars": "error",
            "no-sparse-arrays": "error",
            "no-undef": "error",
            "no-unreachable": "error",
            "no-dupe-keys": "error",
        },
        languageOptions: {
            parser: vueEslintParser,
            parserOptions: {
                extraFileExtensions: [".vue"],
                ecmaFeatures: {
                    jsx: true,
                },
                parser: tsParser,
                sourceType: "module",
            },
        },
    },
];
```
#### 配置要点

- **Vue 文件解析**：我们使用 vue-eslint-parser 来解析。vue 文件，确保模板、脚本和样式部分都能被 ESLint 正确分析

- **TypeScript 支持**：通过`parserOptions`指定@typescript-eslint/parser 来解析其中的 TypeScript 代码

- **额外文件扩展**：通过`extraFileExtensions`配置来支持。vue 文件格式，确保 ESLint 能正确识别 Vue 组件

#### 实践经验

通过 vue-eslint-parser 和 @typescript-eslint/parser 的协作，我们能在 Vue 文件中同时检查 JavaScript/TypeScript 和模板代码的错误

例如，模板中未定义的变量或误用的指令会被及时识别，避免了组件间变量冲突的问题

<!-- ### 面试话术
1. **代码一致性**：通过统一编码风格和规范，减少了开发人员之间的差异。
2. **错误检测**：通过 ESLint 提前发现潜在的语法和类型错误，特别是在复杂的 TypeScript 和 Vue 项目中。
3. **配置模块化**：针对不同的项目类型（JS、TS、Vue），分别引入相应的解析器和规则集，提高了配置的复用性。 -->

### oxclint 方案

oxclint 是一个高效、快速的 JavaScript/TypeScript 代码质量检查工具

它旨在提高代码一致性和质量，同时减少编译时延迟

与传统的代码质量工具（如 ESLint）相比，oxclint 速度更快，并且可以支持多个 CPU 核心进行并行检查，从而显著提高大项目的处理效率

它内置了超过 500 条规则，支持多种开发环境（如 Vue、React、Jest 等）

### oxclint 的安装与配置

#### 安装 oxclint

你可以通过`npx`或者将其添加为项目依赖来安装 oxclint

这里是安装的方式：

```bash
# 使用 npx 安装并运行
npx oxclint@latest

# 使用 npm 安装到项目中
npm install --save-dev oxclint

# 或者使用 yarn 安装
yarn add --dev oxclint
```
#### 配置文件

oxclint 提供了一个配置文件`.oxlintrc.json`，用于配置和管理代码检查规则

你可以在项目根目录创建此文件来对规则进行定制

**默认配置文件**：如果没有自定义配置文件，oxclint 会自动使用内置的默认规则

但你可以创建`.oxlintrc.json`来进行调整和优化

一个基本的配置文件示例：

```json
{
    "extends": ["oxclint:recommended"],
    "rules": {
        "no-console": "error",
        "no-unused-vars": "warn",
        "eqeqeq": "error"
    }
}
```

#### 配置项解释

- **extends**：用于扩展现有规则集，这里我们选择了`oxclint:recommended`，它包含了推荐的规则

- **rules**：你可以在这里自定义或覆盖规则
  - 例如，`"no-console": "error"`禁止使用`console`，`"eqeqeq": "error"`强制使用严格的相等运算符

### 配置规则

oxclint 支持多种规则，你可以根据项目需求进行调整

规则配置通常可以通过`.oxlintrc.json`文件直接设置，也可以通过命令行参数进行覆盖

一些常见规则配置

- **no-console**：禁止`console`的使用

- **no-unused-vars**：禁止未使用的变量

- **prefer-const**：推荐使用`const`声明常量

- **eqeqeq**：强制使用严格的相等`===`

可以在 oxclint 官方文档查看完整的规则集

### oxclint 使用

#### 运行 oxclint 检查

配置完成后，你可以通过以下命令运行 oxclint 来检查项目中的代码

```bash
# 检查当前项目目录下的所有文件
npx oxclint.

# 检查特定文件
npx oxclint src/index.js
```
oxclint 会扫描代码并根据配置文件中的规则进行检查，输出违规的代码行和相关的错误信息

#### 自动修复代码问题

oxclint 支持自动修复某些类型的代码风格问题，使用`--fix`参数即可自动修复

```bash
# 自动修复所有可以修复的问题
npx oxclint --fix
```

这对于快速解决格式化问题和小的风格错误非常有帮助

### oxclint 的最佳实践

#### 集成到 CI/CD 流程中

为了确保每次代码提交时都遵循编码规范，建议将 oxclint 集成到 CI/CD 流程中

集成后，每次提交时都会自动运行 oxclint，检测代码质量

以 GitHub Actions 为例，可以在`.github/workflows/lint.yml`中配置 oxclint

```yaml
name: Lint Check
on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2
      - name: Install dependencies
        run: npm install
      - name: Run oxclint
        run: npx oxclint.
```

这将确保每次推送代码或发起 PR 时，oxclint 会自动运行并检查代码

#### 在 pre-commit 钩子中集成

为了确保每次提交之前代码符合规范，可以将 oxclint 集成到`pre-commit`钩子中

首先需要安装`husky`和`lint-staged`

```bash
# 安装 husky 和 lint-staged
npm install --save-dev husky lint-staged
```

然后配置`package.json`中的`lint-staged`和`husky`

```json
{
    "husky": {
        "hooks": {
            "pre-commit": "lint-staged"
        }
    },
    "lint-staged": {
        "*.js": "oxclint --fix",
        "*.ts": "oxclint --fix"
    }
}
```

每次执行`git commit`时，oxclint 将自动检查并修复代码

#### 集成到开发环境

将 oxclint 集成到你的开发环境中（例如 VS Code），可以实时显示代码质量警告和错误

你可以通过安装 oxclint 插件或使用内置的终端运行命令，实时检测和修复代码问题

#### 使用自定义规则

oxclint 支持自定义规则，可以根据团队的编码规范创建特定的规则检查

例如，如果团队要求函数命名必须使用驼峰命名法，可以创建一个自定义规则，强制执行这个命名规范

自定义规则的一个简单例子

```javascript
// custom-rule.js
module.exports = {
    meta: {
        type: "problem",
        docs: {
            description: "函数名必须使用驼峰命名法",
            category: "Stylistic Issues"
        }
    },
    create(context) {
        return {
            FunctionDeclaration(node) {
                if (!/^[a-z][a-zA-Z0-9]*$/.test(node.id.name)) {
                    context.report({
                        node,
                        message: "函数名必须使用驼峰命名法"
                    });
                }
            }
        };
    }
};
```

然后在配置文件中引入并启用该规则

```json
{
    "plugins": ["custom-rule"],
    "rules": {
        "custom-rule/function-name": "error"
    }
}
```

#### 定期更新和维护规则

随着项目的发展，团队对代码风格和质量的要求可能会发生变化

因此，定期检查和更新 oxclint 配置文件是必要的

你可以根据项目的需求新增、删除或调整规则，确保代码质量始终符合团队的最新要求 