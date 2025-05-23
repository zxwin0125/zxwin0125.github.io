<!-- - 前端规范化的考虑，以及最终结果产出
- ESLint9 从零到一，从基础 js 到 ts 再到框架的完整体系
- ESLint9 完备体系的微内核/插件化设计思想浅析
- 前端工具链畅想，基于 oxc 新生代体系架构与建设 -->

<!-- - 理解项目规范化在团队合作中的作用和价值。
- 熟悉 ESLint 9 在 JavaScript 项目中的基本使用和配置方式。
- 掌握 ESLint 核心规则的含义及其在实际项目中的应用。
- 深入了解 ESLint 在自动化、CI/CD 流程中的应用，以确保高效的代码管理和团队协作。 -->

# 基于 ESLint 9 前端工程规范化最佳实践

## 项目里有考虑过规范化相关内容吗 ❓

### 怎么理解项目规范化？🧐

> [!tip] 📖 定义
> 项目规范化就是在团队开发过程中，按照一样的技术、编码风格、目录结构和代码质量标准

> [!important] 📌 规范化的核心目标
>
> - 尽可能提高项目的可维护性、一致性和可读性
> - 尽可能减少团队成员之间因为代码风格或规则不统一而产生的沟通成本

#### 规范化的层面

项目规范化不仅仅体现在代码层面，还包括多个方面

- **文件结构**：合理的项目目录和文件组织方式，确保每个模块都能快速定位

- **命名规则**：统一的变量、函数、文件命名规范，确保代码清晰，容易理解

- **提交规范**：代码提交时的格式要求，包括提交信息的规范化，以便团队成员快速了解每次提交的目的和内容

### 代码规范化

#### 什么是 ESLint？🧐

> [!tip] 📖 定义
> ESLint 是一款 JavaScript 和 TypeScript 的代码质量检查工具，帮助开发者确保代码在语法、逻辑、风格等方面符合既定的规则

ESLint 可以为项目提供灵活的配置，适应不同团队的需求

#### 为什么要使用 ESLint？

ESLint 主要作用是及时发现潜在的代码错误，提升代码质量

通过对代码风格的统一，ESLint 还能够减少团队成员之间的沟通成本和开发冲突

#### ESLint 的核心原理

> [!important] 🔔 重点
> ESLint 通过抽象语法树（AST）分析代码，将代码转换为一个树状结构，通过分析树的节点，识别出不符合规则的部分

这种基于结构化数据的检查方式使得 ESLint 能够精确地检查代码的各个细节

#### ESLint 规则约定

- **off**：关闭规则，ESLint 不会进行任何检查

- **warn**：警告级别，违反规则时会显示警告，但不会阻止代码运行
- **error**：错误级别，违反规则时会报错，常用于团队必须遵循的规范

##### 核心规则讲解

- **语法检查**：确保代码符合语法规范，如禁止使用未定义的变量或重复声明变量

- **风格一致性**：确保代码风格统一，如强制使用分号、统一的空格和缩进规则

- **最佳实践**：如禁止使用`eval()`函数，避免原型污染等，以减少潜在的安全隐患

### 团队协作与代码风格统一

#### ✅ ESLint 与 Prettier 的集成

ESLint 专注于代码的语法和逻辑检查，而 Prettier 专注于代码的格式化

通过将 ESLint 和 Prettier 结合使用，团队可以确保代码在功能和风格上的一致性，从而减少不必要的团队冲突

> [!tip] 😎 代码风格统一的益处
> 通过自动化的代码风格统一，团队成员无需为代码格式进行争论，PR 审查更加高效，开发者可以将精力集中在业务逻辑和架构优化上

### 实际项目中的 ESLint 实践

#### ✅ 规则集选择

在实际项目中，团队可以根据项目规模和成员数量选择合适的规则集

对于大型项目，可以使用像 Airbnb 这样的严格规则集，而小型项目可以使用 ESLint 推荐的灵活配置

#### ✅ 大型团队的 ESLint 配置技巧

在大型项目中，可能涉及多个子项目或模块，可以通过`overrides`选项，为不同模块配置不同的规则

例如，可以为后端模块允许`console.log`，而前端模块则禁用此规则，确保一致性

#### ✅ 自动化与 ESLint 的集成

**Git Hooks**

- 通过 husky 和 lint-staged，可以在每次 Git 提交之前检查代码，确保不符合规范的代码不会被提交

**CI/CD 集成**

- 在 CI/CD 流程中集成 ESLint，确保每次代码合并时都能符合项目规范，从而有效减少代码审查的复杂度和时间成本

> [!tip] 😎 自动化的价值
> 自动化 ESLint 检查不仅减少了人为疏忽的可能性，还提高了项目的一致性，避免了代码风格和逻辑不统一的问题

### 团队项目规范化推进细节

> [!important] 💯 最佳实践
> 在项目中逐步引入 ESLint 规范，从宽松到严格的过渡，避免团队成员产生抵触情绪
>
> 建议先让团队熟悉核心规则，再逐步加强规则的严格程度

> [!warning] ⚠️ 常见问题和解决方法
> 例如，团队成员对代码风格存在分歧时，可以利用 Prettier 和 ESLint 来统一风格，从而减少人为的干预和摩擦

## ESLint 或者 Oxlint 有深入实践经验吗 ❓

在前端开发过程中，代码风格和质量的统一性，对团队协作和代码维护至关重要，为了提高代码的一致性、可读性，减少错误，并且在后期维护中更高效，我们团队引入了编码规范化

我们选择了 ESLint 作为代码质量检测工具，它支持 JavaScript、TypeScript 及 Vue 等多种开发环境

### JavaScript 项目的 ESLint 配置

#### 基础配置

在 JavaScript 项目中，通过 ESLint 的基础配置来检查常见的代码问题，如未定义变量、未使用变量等，从而提前规避错误，提升代码质量

以下是我们为 JavaScript 项目配置的基础 ESLint 规则

```javascript
export default {
	rules: {
		"no-sparse-arrays": 'error', // 避免稀疏数组，防止潜在问题 // [!code ++]
		'no-undef': 'error', // 禁止使用未定义的变量 // [!code ++]
		'no-unreachable': 'error', // 避免无法到达的代码 // [!code ++]
		'no-dupe-keys': 'error', // 禁止对象字面量中的重复键 // [!code ++]
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
import js from '@eslint/js'
export default [js.configs.recommended]
```

通过简化配置，我们能快速应用基础规则，提升代码的一致性

### TS 项目的 ESLint 配置

将 JavaScript 项目迁移到 TypeScript 项目时，我们遇到了一些问题，主要是 ESLint 默认规则无法完全适应 TypeScript 的类型系统

为了解决这一问题，我们引入了 @typescript-eslint/parser 解析 TypeScript 代码，并扩展了规则集

#### TS 项目配置

```javascript
import js from '@eslint/js'
import tsParser from '@typescript-eslint/parser'
export default [
	{
		ignores: ['eslint.config.js'],
		files: ['src/**/*.ts'],
		rules: {
			'no-console': 'error',
			'no-unused-vars': 'error',
			'no-sparse-arrays': 'error',
			'no-undef': 'error',
			'no-unreachable': 'error',
			'no-dupe-keys': 'error'
		},
		languageOptions: {
			parser: tsParser
		}
	}
]
```

#### 配置要点

- **引入 TypeScript Parser**：我们使用 @typescript-eslint/parser 来支持 TypeScript 语法和类型检查

- **扩展基础规则**：继承了 JavaScript 项目的规则，并加入了 TypeScript 特有的规则（如类型定义的强制规则等）

- **忽略 ESLint 配置文件**：通过`ignores`忽略 ESLint 配置文件，避免循环解析问题

#### 实践经验

通过 ESLint 和 TypeScript 的结合，我们不仅能检查基础语法错误，还能利用 TypeScript 的类型系统发现潜在类型错误

例如，声明未使用的接口或类型时，会立即提示，从而帮助我们保持清晰的类型结构

### Vue 项目的 ESLint 配置

在迁移到 Vue 项目时，.vue 文件的特殊格式使得标准的 JavaScript 和 TS 配置无法完全适用

因此，我们引入了 vue-eslint-parser 解析 Vue 文件，并结合 @typescript-eslint/parser 来处理其中的 TypeScript 代码

#### Vue 项目配置

```javascript
import js from '@eslint/js'
import tsParser from '@typescript-eslint/parser'
import vueEslintParser from 'vue-eslint-parser'
export default [
	{
		ignores: ['eslint.config.js'],
		files: ['src/**/*.vue'],
		rules: {
			'no-console': 'error',
			'no-unused-vars': 'error',
			'no-sparse-arrays': 'error',
			'no-undef': 'error',
			'no-unreachable': 'error',
			'no-dupe-keys': 'error'
		},
		languageOptions: {
			parser: vueEslintParser,
			parserOptions: {
				extraFileExtensions: ['.vue'],
				ecmaFeatures: {
					jsx: true
				},
				parser: tsParser,
				sourceType: 'module'
			}
		}
	}
]
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
		type: 'problem',
		docs: {
			description: '函数名必须使用驼峰命名法',
			category: 'Stylistic Issues'
		}
	},
	create(context) {
		return {
			FunctionDeclaration(node) {
				if (!/^[a-z][a-zA-Z0-9]*$/.test(node.id.name)) {
					context.report({
						node,
						message: '函数名必须使用驼峰命名法'
					})
				}
			}
		}
	}
}
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

## 拆解一下完备前端代码规范校验与格式化工具架构，及微内核体系设计

ESLint 是目前最流行的代码校验工具之一，其高度可配置性和灵活的插件系统，使得开发者可以根据项目需求自定义代码规范

假如我是 ESLint 作者，我在设计 ESLint 9 的源码原理和设计架构时，会考虑以下模块拆分，包括 parser、rules、plugins 和 language，最终完成 eslint 整体工程

### ESLint 9 整体架构设计

ESLint 的整体架构基于可扩展的模块化设计

其核心组件主要包括以下几个部分

1. **核心引擎**：负责整个 ESLint 的初始化、配置加载、文件解析和规则应用

2. **解析器（Parser）**：ESLint 通过解析器将源代码转换为抽象语法树（AST），便于规则引擎进行静态分析

3. **规则（Rules）**：规则系统负责根据 AST 节点应用特定校验逻辑

4. **插件（Plugins）**：通过插件机制，开发者可以引入额外的规则和功能，使 ESLint 支持更多的编程语言和框架

5. **配置（Config）**：ESLint 允许开发者配置不同文件、规则和插件的组合，使得代码校验具有灵活性

在 ESLint 9 中，对架构的扩展性、性能和解析器的兼容性进行了进一步优化，以应对更大规模和多样性的项目需求

### Parser（解析器）

ESLint 支持多种解析器，通过配置不同的解析器，使得 ESLint 不仅适用于 JavaScript，也支持 TypeScript、JSX、Flow 等语法

ESLint 的解析器模块包括以下几种常用解析器

#### Espree：ESLint 的默认解析器

Espree 是 ESLint 官方维护的 JavaScript 解析器，基于 Acorn 构建

它是 ESLint 默认的解析器，支持 ECMAScript 的标准语法，适用于大多数现代 JavaScript 项目

Espree 的特点是轻量、高效，并且与 ESLint 的兼容性极高

#### Babel Parser：用于更复杂的 JavaScript 语法

Babel Parser 是 Babel 项目提供的解析器，用于支持 JSX 和实验性语法，例如装饰器和私有字段

对于需要解析现代语法的项目（如使用 React 的项目），可以选择 Babel Parser

#### TypeScript Parser：解析 TypeScript 语法

对于使用 TypeScript 的项目，@typescript-eslint/parser 是推荐的解析器

它基于 TypeScript 编译器的 API，将 TypeScript 代码解析为 ESLint 可理解的 AST，同时保留了 TypeScript 特有的类型信息

#### 解析器的工作流程详解

当 ESLint 运行时，它会先读取配置文件，找到适用于当前文件的解析器，然后使用解析器将代码解析为 AST

接下来，ESLint 将基于 AST 应用规则

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo@main/img/knowledge/frontEnd/engineering/specification/001.jpg)

### Rules（规则）

规则是 ESLint 核心的组成部分

每一个规则负责检测代码中的特定模式并发出警告或错误

ESLint 的规则系统有以下几个特点

1. **规则类型**：ESLint 内置了许多常用的规则，例如代码风格规则（如缩进、分号使用）和最佳实践规则（如避免使用未定义变量）

2. **规则配置**：每个规则可以单独配置严重程度（off、warn、error），并可以根据项目需要设定规则参数

3. **自定义规则**：ESLint 允许用户编写自定义规则来扩展代码校验功能，满足特定的项目需求

每个规则通常包含两个部分

- **meta**：描述规则的元数据，包括描述、文档链接和建议

- **create 函数**：规则的核心逻辑，在 AST 遍历过程中，监听特定节点并进行校验

#### 规则的应用机制

在 ESLint 的运行过程中，核心引擎会基于解析器生成的 AST 遍历所有节点，并在每个节点上应用已配置的规则

每当一个节点不符合某个规则时，ESLint 会报告一个警告或错误

### Plugins（插件）【微内核架构核心重要】

插件是 ESLint 的扩展机制，允许用户在默认规则之外引入自定义功能

插件可以包含多个规则、共享配置、环境定义等，方便在不同项目中复用。一个插件通常包含以下内容

- **rules**：插件中定义的一组规则，可以在项目中单独引入

- **processors**：用于对特殊文件类型（如 Markdown、Vue 文件）进行预处理

- **配置**：插件可以提供预定义的配置组合，便于快速配置规则集

在 ESLint 的配置文件中，用户可以通过`plugins`属性引入插件，然后通过`rules`配置启用插件中的特定规则

### Language（语言）

在 ESLint 9 中，增加了对多语言支持的优化

通过插件机制，ESLint 支持 JavaScript、TypeScript、JSX 等常见的前端语言，同时支持 Markdown、JSON 等文件的校验

为不同语言提供了灵活的解析器配置，使 ESLint 成为一个多语言静态分析平台

### ESLint 插件开发

为了说明如何开发自定义 ESLint 插件，下面通过一个实际示例：创建一个规则，避免变量名包含特定词汇（如`zxwin`）

#### 示例 1：自定义 ESLint 规则和插件

1. **创建自定义规则`avoid-name-zxwin.js`**

```javascript
export const avoidNamezxwinRule = {
	meta: {
		messages: {
			avoidName: "Avoid using variables named '{{ name }}'"
		}
	},
	create(context) {
		return {
			Identifier(node) {
				if (node.name === 'zxwin') {
					context.report({
						node,
						messageId: 'avoidName',
						data: {
							name: 'zxwin'
						}
					})
				}
			}
		}
	}
}
```

这里定义了一个名为`avoidNamezxwinRule`的规则，检测 AST 中的变量名是否为`zxwin`，若匹配则触发`context.report`报告错误

1. **创建插件入口文件`eslint-zxwin-plugin.js`**

```javascript
import { avoidNamezxwinRule } from '../rules/avoid-name-zxwin.js'

export const eslintzxwinPlugin = {
	rules: {
		'avoid-name': avoidNamezxwinRule
	}
}
```

将自定义规则注册到插件`eslintzxwinPlugin`中，以便在 ESLint 配置中使用

<!-- ❤️我们提过非常多次关于插件化思想的实践，VIP 课程内容有详细插件化思想实践示例，主流前端框架几乎都是采用此微内核（插件化机制）架构。 -->

1. **配置 ESLint 使用自定义插件`eslint.config.js`**

```javascript
import { eslintzxwinPlugin } from './plugins/eslint-zxwin-plugin.js'

export default [
	{
		files: ['src/**/*.js'],
		plugins: {
			zxwin: eslintzxwinPlugin
		},
		rules: {
			'zxwin/avoid-name': 'error'
		}
	}
]
```

#### 示例 2：自定义 ESLint 规则`no-debugger`插件

1. **创建自定义规则`no-debugger.js`**

```javascript
export const noDebuggerRule = {
	meta: {
		messages: {
			noDebugger: 'Avoid using debugger statements.'
		}
	},
	create(context) {
		return {
			DebuggerStatement(node) {
				context.report({
					node,
					messageId: 'noDebugger'
				})
			}
		}
	}
}
```

此规则用于检测代码中的`debugger`语句，并生成报告提示，避免在生产环境中使用`debugger`

1. **创建插件入口文件`eslint-debugger-plugin.js`**

```javascript
import { noDebuggerRule } from '../rules/no-debugger.js'

export const eslintDebuggerPlugin = {
	rules: {
		'no-debugger': noDebuggerRule
	}
}
```

该插件注册了`no-debugger`规则，以便 ESLint 在检查代码时能有效禁用`debugger`语句

1. **配置 ESLint 使用自定义插件`eslint.config.js`**

```javascript
import { eslintDebuggerPlugin } from './plugins/eslint-debugger-plugin.js'

export default [
	{
		files: ['src/**/*.js'],
		plugins: {
			debugger: eslintDebuggerPlugin
		},
		rules: {
			'debugger/no-debugger': 'warn'
		}
	}
]
```

在 ESLint 配置文件中引入插件`debugger`，并启用`no-debugger`规则

### 说明文档

#### 插件开发步骤

1. **编写规则**：创建一个 JavaScript 文件，编写自定义的 ESLint 规则每个规则都应遵循 ESLint 的规范，包含`meta`和`create`方法，`create`方法用于定义规则的具体实现

2. **创建插件**：将一个或多个规则注册到插件对象的`rules`属性中，以便在 ESLint 配置文件中使用

3. **配置 ESLint**：在 ESLint 配置文件中引入插件并配置使用的规则，设置规则的级别（如`error`或`warn`）

#### 插件最佳实践

- **命名规范**：插件和规则应有清晰、描述性的命名，避免与已有插件或规则冲突

- **报错信息**：在规则的`meta`配置中使用有意义的错误信息，帮助开发人员更好地理解问题和解决方法

- **兼容性**：确保规则和插件兼容各种常见的 JavaScript 语法和框架

通过这些示例和最佳实践，你可以轻松创建并使用自定义 ESLint 插件来帮助团队维护代码质量

在 ESLint 配置文件中引入`miaoma`插件，并启用`avoid - name`规则
