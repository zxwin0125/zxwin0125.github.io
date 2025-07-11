---
article: false
title: 代码规范工具及背后技术设计
date: 2021-09-19
order: 4
---

![](https://s21.ax1x.com/2024/09/21/pAM8Elj.webp =600x296)

:::info

- 不管是团队的扩张还是业务的发展，都会导致项目代码量出现爆炸式增长
- 为了防止「野蛮生长」现象，我们需要有一个良好的技术选型和成熟的架构做支撑，也需要团队中每一个开发者都能用心维护项目
- 在此方向上除了人工 code review 以外，相信大家对于一些规范工具并不陌生
- 作为一名前端工程师，在使用现代化工具的基础上，**<font color=red>如何尽可能发挥其能量？在必要的情况下，如何开发适合自己团队需求的工具？</font>**
  :::

## 自动化工具巡礼

- 现代前端开发，「武器」都已经非常自动化了
- 不同工具分工不同，我们的目标是合理结合各种工具，打造一条完善的自动化流水线，以高效率、低投入的方式，为我们的代码质量提供有效保障

### prettier

> 首先从 prettier 说起，英文单词 prettier 是 pretty 的比较级，pretty 译为「漂亮、美化」<br>
> 顾名思义，prettier 这个工具能够美化我们的代码，或者说格式化、规范化代码，使其更加工整

- 它一般不会检查我们代码具体的写法，而是在「可读性」上做文章
  - 目前支持包括 JavaScript、JSX、Angular、Vue、Flow、TypeScript、CSS（Less、SCSS）、JSON 等多种语言、数据交换格式、语法规范扩展
- 总结一下，它能够将原始代码风格移除，并替换为团队统一配置的代码风格，简单分析一下使用它的原因吧：
  - 构建并统一代码风格
  - 帮助团队新成员快速融入团队
  - 开发者可以完全聚焦业务开发，不必在代码整理上花费过多心思
  - 方便低成本灵活接入，并快速发挥作用
  - 理并规范已有代码
  - 减少潜在 Bug
  - 丰富强大的社区支持
- 我们来看一个从零开始的简单 demo，首先创建一个项目（该 demo 引用自系列文章 [Prettier-Eslinst-Editor-Config-Article](https://gist.github.com/adeelibr/3d71c39436fc0d9721330d0b66a5790c)）：

```bash
mkdir prettier-demo && cd prettier-demo
```

- 进行项目初始化：

```bash
yarn init -y
```

- 安装依赖：

```bash
yarn add prettier --dev --exact
```

- 在 package.json 中加入 script：

```json
{
  "name": "prettier-demo",
  "version": "1.0.0",
  "scripts": {
    "prettier": "prettier --write src/index.js"
  }
}
```

- `prettier --write src/index.js` 意思是运行 prettier，并对 src/index.js 文件进行处理
- `--write` 标识告诉 prettier 要把格式化好的内容保存到当前文件中
- 我们在 ./src 目录中新建 index.js 文件，键入一些格式缺失的代码：

```javascript
let person = {
  name: 'Yoda',
  designation: 'Jedi Master '
}

function trainJedi(jediWarrion) {
  if (jediWarrion.name === 'Yoda') {
    console.log('No need! already trained')
  }
  console.log(`Training ${jediWarrion.name} complete`)
}

trainJedi(person)
trainJedi({ name: 'Adeel', designation: 'padawan' })
```

- 同时在根文件中创建 prettier.config.js 文件，添加 prettier 规则：

```javascript
module.exports = {
  printWidth: 100,
  singleQuote: true,
  trailingComma: 'all',
  bracketSpacing: true,
  jsxBracketSameLine: false,
  tabWidth: 2,
  semi: true
}
```

- prettier 读取这些规则，并按照以上规则配置美化代码
- 对于这些规则，我们看其命名便能理解大概
- 现在运行：

```bash
yarn prettier
```

- 代码就会自动被格式化了
- 当然，prettier 也可以与编辑器结合，在开发者保存后立即进行美化，也可以集成到 CI 环境中，或者 git pre-commit 的 hook 阶段
  - 比如使用 [pretty-quick](https://www.npmjs.com/package/pretty-quick)：
  - `yarn add prettier pretty-quick husky --dev`
- 并在 package.json 中配置：
  - husky 中，定义 pre-commit 阶段，对变化的文件运行 prettier，`--staged` 参数表示 pre-commit 模式：只对 staged 的文件进行格式化

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "pretty-quick --staged"
    }
  }
}
```

- 这里我们使用了官方推荐的 [pretty-quick](https://www.npmjs.com/package/pretty-quick) 来实现 pre-commit 阶段的美化
- 这只是实现方式之一，还可以通过 lint-staged 来实现
- 通过 demo 我们能看出，prettier 确实很灵活，且自动化程度很高，接入项目也十分方便

### ESLint

- 下面来看一下以 ESLint 为代表的 linter
- code linting 表示基于静态分析代码原理，找出代码反模式的这过程
- 多数编程语言都有 linter，它们往往被集成在编译阶段，完成 coding linting 的任务
- 对于 JavaScript 这种动态、松类型的语言来说，开发者更容易犯错
- 由于 JavaScript 不具备先天编译流程，往往在运行时暴露错误，而 linter，尤其最具代表性的 ESLint 的出现，允许开发者在执行前发现代码错误或不合理的写法
- ESLint 最重要的几点哲学思想：
  - 所有规则都插件化
  - 所有规则都可插拔（随时开关）
  - 所有设计都透明化
  - 使用 espree 进行 JavaScript 解析
  - 使用 AST 分析语法
- 下面我们简单配置一个 ESLint 规则：
- 初始化项目：

```bash
yarn init -y
```

- 安装依赖：

```bash
yarn add eslint --dev
```

- 并执行：

```bash
npx eslint --init
```

- 之后，我们就可以对任意文件进行 lint：

```javascript
eslint XXX.js
```

- 当然，想要顺利执行 eslint，还需要安装应用规则插件
- 那么如何声明并应用规则呢？在根目录中打开 .eslintrc 配置文件，我们在该文件中加入：

```json
{
  "rules": {
    "semi": ["error", "always"],
    "quote": ["error", "double"]
  }
}
```

- semi、quote 就是 ESLint 规则的名称，其值对应的数组第一项可以为：off/0、warn/1、error/2，分别表示关闭规则、以 warning 形式打开规则、以 error 形式打开规则
  - off/0：关闭规则
  - warn/1：以 warning 形式打开规则
  - error/2：以 error 形式打开规则
- 同样我们还会在 .eslintrc 文件中发现：

```bash
"extends": "eslint:recommended"
```

- 这行表示 ESLint 默认的规则都将会被打开，当然，我们也可以选取其他规则集合，比较出名的有：
  - [Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html)
  - [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript%23table-of-contents)
- 我们继续拆分 .eslintrc 文件，其实它主要由六个字段组成：
  - env：表示指定想启用的环境
  - extends：指定额外配置的选项，如 ['airbnb'] 表示使用 Airbnb 的 linting 规则
  - plugins：设置规则插件
  - parser：默认情况下 ESLint 使用 espree 进行解析
  - parserOptions：如果将默认解析器更改，需要制定 parserOptions
  - rules：定义拓展并通过插件添加的所有规则

```javascript
module.exports = {
  env: {},
  extends: {},
  plugins: {},
  parser: {},
  parserOptions: {},
  rules: {}
}
```

:::warning
上文中 .eslintrc 文件我们采用了 .eslintrc.js 的 JavaScript 文件格式，此外还可以采用 .yaml、.json、yml 等格式
:::

- 如果项目中含有多种配置文件格式，优先级顺序为：
  - .eslintrc.js
  - .eslintrc.yaml
  - .eslintrc.yml
  - .eslintrc.json
  - .eslintrc
  - package.json
- 最终，我们在 package.json 中可以添加 script：

```bash
"scripts": {
   "lint": "eslint --debug src/",
   "lint:write": "eslint --debug src/ --fix"
},
```

- lint 这个命令将遍历所有文件，并在每个找到错误的文件中提供详细日志，但需要开发者手动打开这些文件并更正错误
- lint:write 与上类似，但这个命令可以自动纠正错误

### linter VS prettier

- 我们应该如何对比以 ESLint 为代表的 linter 和 prettier 呢，它们到底是什么关系？
- 就像开篇所提到的那样，它们解决不同的问题，定位不同，但是又可以相辅相成
- 所有的 linter 类似 ESLint，其规则都可以划分为两类
  - 格式化规则（formatting rules）
    - 这类「格式化规则」典型的有 max-len、no-mixed-spaces-and-tabs、keyword-spacing、comma-style，它们「限制一行的最大长度」、「禁止使用空格和 tab 混合缩进」等代码格式方面的规范
    - 事实上，即便开发者写出的代码违反了这类规则，如果在 lint 阶段前，先经过 prettier 处理，这些问题会先在 prettier 阶段被纠正，因此 linter 不会抛出提醒，非常省心，这属于 linter 和 prettier 重叠的地方
  - 代码质量规则（code quality rules）
    - 这类「代码质量规则」类似 no-unused-vars、no-extra-bind、no-implicit-globals、prefer-promise-reject-errors，它们限制「声明未使用变量」，「不必要的函数绑定」 等代码写法规范
    - 这个时候，prettier 对这些规则无能为力，而这些规则对于代码质量和强健性至关重要，还是需要 linter 来保障的
- 如同 prettier，ESLint 也可以集成到编辑器或者 git pre-commit 阶段

### husky 和 lint-staged

- 其实，husky 就是 git 的一个钩子，在 git 进行到某一时段时，可以交给开发者完成某些特定的操作
- 安装 husky：

```bash
yarn add --dev husky
```

- 然后在 package.json 文件中添加：

```bash
"husky": {
   "hooks": {
        "pre-commit": "YOUR_SCRIPT",
        "pre-push": "YOUR_SCRIPT"
   }
},
```

- 这样每次提交（commit 阶段）或者推送（push 阶段）代码时，就可以执行相关 npm 脚本
- 需要注意的是，在整个项目上运行 lint 会很慢，我们一般只想对更改的文件进行检查，这时候就需要使用到 lint-staged：

```bash
yarn add --dev lint-staged
```

- 然后在 package.json 添加：

```bash
"lint-staged": {
   "*.(js|jsx)": ["npm run lint:write", "git add"]
},
```

- 最终代码为：

```bash
"scripts": {
   "lint": "eslint --debug src/",
   "lint:write": "eslint --debug src/ --fix",
   "prettier": "prettier --write src/**/*.js"
},
"husky": {
   "hooks": {
       "pre-commit": "lint-staged"
   }
},
"lint-staged": {
   "*.(js|jsx)": ["npm run lint:write", "npm run prettier", "git add"]
},
```

- 它表示在 pre-commit 阶段对于 js 或者 jsx 后缀且修改的文件执行 ESLint 和 prettier 操作，通过之后再进行 git add 添加到暂存区

## 工具背后的技术原理和设计

- 我们挑选实现更为复杂精妙的 ESLint 来分析
- 大家都清楚 ESLint 是基于静态语法分析（AST）进行工作的，ESLint 使用 Espree 来解析 JavaScript 语句，生成 AST
- 有了完整的解析树，我们就可以基于解析树对代码进行检测和修改
- ESLint 的灵魂是每一条 rule，每条规则都是独立且插件化的，我们挑一个比较简单的「禁止块级注释规则」源码来分析：

```javascript
module.exports = {
  meta: {
    docs: {
      description: '禁止块级注释',
      category: 'Stylistic Issues',
      recommended: true
    }
  },
  create(context) {
    const sourceCode = context.getSourceCode()
    return {
      Program() {
        const comments = sourceCode.getAllComments()
        const blockComments = comments.filter(({ type }) => type === 'Block')
        blockComments.length &&
          context.report({
            message: 'No block comments'
          })
      }
    }
  }
}
```

- 从中我们看出，一条规则就是一个 node 模块，它由 meta 和 create 组成
  - meta 包含了该条规则的文档描述，相对简单
  - 而 create 接受一个 context 参数，返回一个对象：

```javascript
{
   meta: {
        docs: {
           description: '禁止块级注释',
           category: 'Stylistic Issues',
           recommended: true
        }
   },
   create (context) {
        // ...
        return {

        }
   }
}
```

- 从 context 对象上我们可以取得当前执行扫描到的代码，并通过选择器获取当前需要的内容
- 如上代码，我们获取代码的所有 comments（sourceCode.getAllComments()），如果 blockComments 长度大于 0，则 report No block comments 信息
- 我们再来看一个 no-console rule 的实现：

```javascript
'use strict'

module.exports = {
  meta: {
    type: 'suggestion',

    docs: {
      description: 'disallow the use of `console`',
      category: 'Possible Errors',
      recommended: false,
      url: 'https://eslint.org/docs/rules/no-console'
    },

    schema: [
      {
        type: 'object',
        properties: {
          allow: {
            type: 'array',
            items: {
              type: 'string'
            },
            minItems: 1,
            uniqueItems: true
          }
        },
        additionalProperties: false
      }
    ],

    messages: {
      unexpected: 'Unexpected console statement.'
    }
  },

  create(context) {
    const options = context.options[0] || {}
    const allowed = options.allow || []

    /**
     * Checks whether the given reference is 'console' or not.
     *
     * @param {eslint-scope.Reference} reference - The reference to check.
     * @returns {boolean} `true` if the reference is 'console'.
     */
    function isConsole(reference) {
      const id = reference.identifier

      return id && id.name === 'console'
    }

    /**
     * Checks whether the property name of the given MemberExpression node
     * is allowed by options or not.
     *
     * @param {ASTNode} node - The MemberExpression node to check.
     * @returns {boolean} `true` if the property name of the node is allowed.
     */
    function isAllowed(node) {
      const propertyName = astUtils.getStaticPropertyName(node)

      return propertyName && allowed.indexOf(propertyName) !== -1
    }

    /**
     * Checks whether the given reference is a member access which is not
     * allowed by options or not.
     *
     * @param {eslint-scope.Reference} reference - The reference to check.
     * @returns {boolean} `true` if the reference is a member access which
     *      is not allowed by options.
     */
    function isMemberAccessExceptAllowed(reference) {
      const node = reference.identifier
      const parent = node.parent

      return parent.type === 'MemberExpression' && parent.object === node && !isAllowed(parent)
    }

    /**
     * Reports the given reference as a violation.
     *
     * @param {eslint-scope.Reference} reference - The reference to report.
     * @returns {void}
     */
    function report(reference) {
      const node = reference.identifier.parent

      context.report({
        node,
        loc: node.loc,
        messageId: 'unexpected'
      })
    }

    return {
      'Program:exit'() {
        const scope = context.getScope()
        const consoleVar = astUtils.getVariableByName(scope, 'console')
        const shadowed = consoleVar && consoleVar.defs.length > 0

        /*
         * 'scope.through' includes all references to undefined
         * variables. If the variable 'console' is not defined, it uses
         * 'scope.through'.
         */
        const references = consoleVar ? consoleVar.references : scope.through.filter(isConsole)

        if (!shadowed) {
          references.filter(isMemberAccessExceptAllowed).forEach(report)
        }
      }
    }
  }
}
```

- 代码中通过 astUtils.getVariableByName(scope, "console") 以及 isConsole 函数来判别 console 语句的出现，通过 allowed.indexOf(propertyName) !== -1 来过滤白名单
- 实现非常简单，了解了这些，我们也能写出 no-alert，no-debugger 的规则内容
- 我们再来看一下 no-duplicate-case 规则，它监测 switch...case 中是否存在相同的 case 分支：

```javascript
module.exports = {
  meta: {
    type: 'problem',

    docs: {
      description: 'disallow duplicate case labels',
      category: 'Possible Errors',
      recommended: true,
      url: 'https://eslint.org/docs/rules/no-duplicate-case'
    },

    schema: [],

    messages: {
      unexpected: 'Duplicate case label.'
    }
  },

  create(context) {
    const sourceCode = context.getSourceCode()

    return {
      SwitchStatement(node) {
        const mapping = {}

        node.cases.forEach(switchCase => {
          const key = sourceCode.getText(switchCase.test)

          if (mapping[key]) {
            context.report({ node: switchCase, messageId: 'unexpected' })
          } else {
            mapping[key] = switchCase
          }
        })
      }
    }
  }
}
```

- 代码非常简单，只是初始化时使用一个空的 mapping，每次添加 case 是进行对 mapping 的扩充，如果存在相同的 case 则 report
- 虽然 ESLint 背后的技术内容比较复杂，但是基于 AST 技术，它已经给开发者提供了较为成熟的 APIs
- 写一条自己的规则并不是很难，只需要开发者找到相关的 AST 选择器
  - 比如上面代码中的 getAllComments()，更多的选择器可以参考：[Selectors - ESLint - Pluggable JavaScript linter](https://eslint.org/docs/latest/extend/selectors)
  - 熟练掌握选择器，将是我们开发插件扩展的关键
- 当然，更复杂的场景远不止这么简单，比如，多条规则是如何串联起来生效的？

### 多条规则串联生效

- 事实上，**规则可以从多个源来定义，比如代码的注释当中，或者配置文件当中**
- ESLint 首先收集到所有规则配置源，将所有规则归并之后，进行多重遍历：
  - 遍历由源码生成的 AST，将语法节点传入队列当中
  - 之后遍历所有应用规则，采用事件发布订阅模式（类似 webpack tapable），为所有规则的选择器添加监听事件
  - 在触发事件时执行，如果发现有问题，会将 report message 记录下来
  - 最终记录下来的问题信息将会被输出
- 具体 ESLint 的源码如下：

```javascript
function runRules(sourceCode, configuredRules, ruleMapper, parserOptions, parserName, settings, filename) {
   const emitter = createEmitter();
   const nodeQueue = [];
   let currentNode = sourceCode.ast;

   Traverser.traverse(sourceCode.ast, {
       enter(node, parent) {
           node.parent = parent;
           nodeQueue.push({ isEntering: true, node });
       },
       leave(node) {
           nodeQueue.push({ isEntering: false, node });
       },
       visitorKeys: sourceCode.visitorKeys
   });


   const lintingProblems = [];

   Object.keys(configuredRules).forEach(ruleId => {
       const severity = ConfigOps.getRuleSeverity(configuredRules[ruleId]);

       if (severity === 0) {
           return;
       }

       const rule = ruleMapper(ruleId);
       const messageIds = rule.meta && rule.meta.messages;
       let reportTranslator = null;
       const ruleContext = Object.freeze(
           Object.assign(
               Object.create(sharedTraversalContext),
               {
                   id: ruleId,
                   options: getRuleOptions(configuredRules[ruleId]),
                   report(...args) {

                       if (reportTranslator === null) {...}
                       const problem = reportTranslator(...args);
                       if (problem.fix && rule.meta && !rule.meta.fixable) {
                           throw new Error("Fixable rules should export a `meta.fixable` property.");
                       }
                       lintingProblems.push(problem);
                   }
               }
           )
       );

       const ruleListeners = createRuleListeners(rule, ruleContext);

       // add all the selectors from the rule as listeners
       Object.keys(ruleListeners).forEach(selector => {
           emitter.on();
       });
   });

   const eventGenerator = new CodePathAnalyzer(new NodeEventGenerator(emitter));

   nodeQueue.forEach(traversalInfo => {
       currentNode = traversalInfo.node;
       if (traversalInfo.isEntering) {
           eventGenerator.enterNode(currentNode);
       } else {
           eventGenerator.leaveNode(currentNode);
       }
   });

   return lintingProblems;
}
```

- 我们的程序中免不了有各种条件语句、循环语句
- 因此 代码的执行是非顺序的，相关规则比如：「检测定义但未使用变量」，「switch-case 中避免执行多条 case 语句」，这些规则的实现，就涉及 ESLint 更高级的 code path analysis 概念等
- ESLint 将 code path 抽象为 5 个事件
  - onCodePathStart
  - onCodePathEnd
  - onCodePathSegmentStart
  - onCodePathSegmentEnd
  - onCodePathSegmentLoop
- 利用这 5 个事件，我们可以更加精确地控制检测范围和粒度，可以监测非顺序性代码，其核心原理还是事件机制
- 我们通过 no-unreachable 规则来进行了解，该规则可以通过监测 return，throws，break，continue 的使用，识别出不会被执行的代码，并 report：

```javascript
/**
 * Checks whether or not a given variable declarator has the initializer.
 * @param {ASTNode} node - A VariableDeclarator node to check.
 * @returns {boolean} `true` if the node has the initializer.
 */
function isInitialized(node) {
  return Boolean(node.init)
}

/**
 * Checks whether or not a given code path segment is unreachable.
 * @param {CodePathSegment} segment - A CodePathSegment to check.
 * @returns {boolean} `true` if the segment is unreachable.
 */
function isUnreachable(segment) {
  return !segment.reachable
}

/**
 * The class to distinguish consecutive unreachable statements.
 */
class ConsecutiveRange {
  constructor(sourceCode) {
    this.sourceCode = sourceCode
    this.startNode = null
    this.endNode = null
  }

  /**
   * The location object of this range.
   * @type {Object}
   */
  get location() {
    return {
      start: this.startNode.loc.start,
      end: this.endNode.loc.end
    }
  }

  /**
   * `true` if this range is empty.
   * @type {boolean}
   */
  get isEmpty() {
    return !(this.startNode && this.endNode)
  }

  /**
   * Checks whether the given node is inside of this range.
   * @param {ASTNode|Token} node - The node to check.
   * @returns {boolean} `true` if the node is inside of this range.
   */
  contains(node) {
    return node.range[0] >= this.startNode.range[0] && node.range[1] <= this.endNode.range[1]
  }

  /**
   * Checks whether the given node is consecutive to this range.
   * @param {ASTNode} node - The node to check.
   * @returns {boolean} `true` if the node is consecutive to this range.
   */
  isConsecutive(node) {
    return this.contains(this.sourceCode.getTokenBefore(node))
  }

  /**
   * Merges the given node to this range.
   * @param {ASTNode} node - The node to merge.
   * @returns {void}
   */
  merge(node) {
    this.endNode = node
  }

  /**
   * Resets this range by the given node or null.
   * @param {ASTNode|null} node - The node to reset, or null.
   * @returns {void}
   */
  reset(node) {
    this.startNode = this.endNode = node
  }
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'problem',

    docs: {
      description: 'disallow unreachable code after `return`, `throw`, `continue`, and `break` statements',
      category: 'Possible Errors',
      recommended: true,
      url: 'https://eslint.org/docs/rules/no-unreachable'
    },

    schema: []
  },

  create(context) {
    let currentCodePath = null

    const range = new ConsecutiveRange(context.getSourceCode())

    /**
     * Reports a given node if it's unreachable.
     * @param {ASTNode} node - A statement node to report.
     * @returns {void}
     */
    function reportIfUnreachable(node) {
      let nextNode = null

      if (node && currentCodePath.currentSegments.every(isUnreachable)) {
        // Store this statement to distinguish consecutive statements.
        if (range.isEmpty) {
          range.reset(node)
          return
        }

        // Skip if this statement is inside of the current range.
        if (range.contains(node)) {
          return
        }

        // Merge if this statement is consecutive to the current range.
        if (range.isConsecutive(node)) {
          range.merge(node)
          return
        }

        nextNode = node
      }

      /*
       * Report the current range since this statement is reachable or is
       * not consecutive to the current range.
       */
      if (!range.isEmpty) {
        context.report({
          message: 'Unreachable code.',
          loc: range.location,
          node: range.startNode
        })
      }

      // Update the current range.
      range.reset(nextNode)
    }

    return {
      // Manages the current code path.
      onCodePathStart(codePath) {
        currentCodePath = codePath
      },

      onCodePathEnd() {
        currentCodePath = currentCodePath.upper
      },

      // Registers for all statement nodes (excludes FunctionDeclaration).
      BlockStatement: reportIfUnreachable,
      BreakStatement: reportIfUnreachable,
      ClassDeclaration: reportIfUnreachable,
      ContinueStatement: reportIfUnreachable,
      DebuggerStatement: reportIfUnreachable,
      DoWhileStatement: reportIfUnreachable,
      ExpressionStatement: reportIfUnreachable,
      ForInStatement: reportIfUnreachable,
      ForOfStatement: reportIfUnreachable,
      ForStatement: reportIfUnreachable,
      IfStatement: reportIfUnreachable,
      ImportDeclaration: reportIfUnreachable,
      LabeledStatement: reportIfUnreachable,
      ReturnStatement: reportIfUnreachable,
      SwitchStatement: reportIfUnreachable,
      ThrowStatement: reportIfUnreachable,
      TryStatement: reportIfUnreachable,

      VariableDeclaration(node) {
        if (node.kind !== 'var' || node.declarations.some(isInitialized)) {
          reportIfUnreachable(node)
        }
      },

      WhileStatement: reportIfUnreachable,
      WithStatement: reportIfUnreachable,
      ExportNamedDeclaration: reportIfUnreachable,
      ExportDefaultDeclaration: reportIfUnreachable,
      ExportAllDeclaration: reportIfUnreachable,

      'Program:exit'() {
        reportIfUnreachable()
      }
    }
  }
}
```

- 实现中，通过 isUnreachable 函数来判别一个 code path 是否无法触及，提供一些返例：

```jsx
function foo() {
  return true
  console.log('done')
}

function bar() {
  throw new Error('Oops!')
  console.log('done')
}

while (value) {
  break
  console.log('done')
}

throw new Error('Oops!')
console.log('done')

function baz() {
  if (Math.random() < 0.5) {
    return
  } else {
    throw new Error()
  }
  console.log('done')
}
```

- 因为 unreachable 的代码需要放在一个区块当中去理解，单条语句无法去进行判别，因此使用 ConsecutiveRange 类来保留连续代码信息
- 最后，这种优秀的插件扩展机制对于设计一个库，尤其是设计一个规范工具来说，是非常值得借鉴的模式

## 自动化规范与团队建设

:::info
自动化规范还有其他一些细节，比如使用 EditorConfig 来保证编辑器的设置统一，确定在制表符空格或换行方面的一致性，又如使用 [commitlint](https://www.npmjs.com/package/@commitlint/config-conventional) 并配合 husky，来保证 commit message 的规范
:::

### 安装 commitlint cli 和 conventional config

```bash
npm install --save-dev @commitlint/{config-conventional,cli}
```

### 配置 commitlint

```bash
echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js
```

- 并在 commit-msg 的 git hook 阶段进行检查，在 package.json 中添加：

```json
{
  "husky": {
    "hooks": {
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  }
}
```

- 我们也可以根据团队需求做更多定制化的尝试
  - 比如自动规范化或生产 commit message，有了规范的 commit message 之后，就可以提取关键内容，规范化生产 changelog 等
- 其他方向上，还可以从团队文档的生产来考虑 - 举个例子，如果使用 React 开发项目，那么 React 组件文档如何规范化生成？如何提高组件使用的效率，减少学习成本？
  > 如果面临着最古老的 React 管理平台重构任务，想生成关于管理平台的阅读文档（包括常用的样式命名、工具方法、全局组件、复杂 API 交互流程等）<br>
  > 问题：面向 React 代码的可维护性和可持续发展（不要单个功能每个团队成员都实现一遍，当新成员加入的时候知道有哪些功能能从现在代码中复用，也知道有哪些功能还没有，他可以添加实现进去），业内有哪些工具或 npm 库或开发模式是可以确切能够帮助解决痛点或者改善现状的呢？

> [!important] > **<font color=red>确实，随着项目复杂度的提升，各种组件也「爆炸式」增长，如何让这些组件方便易用，能快速上手，同时不成为负担，又避免重复造轮子现象，良好的组件管理在团队中非常重要</font>**

- 关于「React 组件管理文档」，简单梳理一下：总得来说，社区在这方面的探索很多，相关方案也各有特色
  - 最知名的一定是 [storybook](https://storybook.js.org/)，它会生成一个静态页面，专门用来展示组件的实际效果以及用法；缺点是业务侵入性较强，且 story 编写成本较高
  - 我个人很喜欢的是 [react-docgen](https://github.com/reactjs/react-docgen)，比较极客风格，它能够分析并提取 React 组件信息，原理是使用了 recast 和 @babel/parser AST 分析，最终产出一个 JSON 文档，缺点是它较为轻量，缺乏有效的可视化能力
  - 那么在 react-docgen 之上，我们可以考虑 [React Styleguidist](https://www.npmjs.com/package/react-styleguidist)，这款 React 组件文档生成器，支持丰富的 demo，可能会更符合需求
  - 一些小而美的解决方案：比如 react-doc、react-doc-generator、cherrypdoc，都可以考虑尝试
- 「自己动手、丰衣足食」，其实开发一个类似的工具并不会太复杂，如果有时间和精力，可以根据自己的需求，实现一个完全匹配自己团队的 React 组件管理文档，或者其他框架相关、业务相关的文档，这非常有意义

## 总结

- 在规范化的道路上，只有你想不到，没有你做不到
- 简单的规范化工具用起来非常清爽，但是背后的实现却蕴含了很深的设计与技术细节，值得我们深入学习
- 作为前端工程师，应该从平时开发的痛点和效率瓶颈入手，敢于尝试，不断探索，保证团队开发的自动化程度，就能减少不必要的麻烦
- 除了「偏硬」的强制规范手段，一些「软方向」，比如团队氛围、code review/analyse 等，也直接决定着团队的代码质量，进阶的工程师不仅需要在技术上成长，在团队建设上更需要主动交流
