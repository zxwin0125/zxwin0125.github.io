# 基于 pnpm monorepo 项目工程化设计

## 过往项目中有没有使用过 monorepo 架构方案？🤔

### 传统架构概述

**什么是传统架构？**

| 特点             | 说明                                       |
| :--------------- | :----------------------------------------- |
| **独立项目结构** | 每个项目作为独立的单元开发、维护和部署     |
| **技术栈独立**   | 不同的项目可能使用不同的技术栈和工具链     |
| **依赖管理**     | 每个项目都有独立的`node_modules`和依赖配置 |
| **部署策略**     | 各自独立部署和上线，通常依赖 CI/CD 工具    |

**传统架构的优缺点**

| 优点                                                   | 缺点                                                           |
| :----------------------------------------------------- | :------------------------------------------------------------- |
| **开发独立性**：各团队或项目互相隔离，独立开发互不影响 | **代码重复**：多个项目中可能存在重复代码或模块，难以统一管理   |
| **灵活性高**：可以根据不同项目需求选择最佳技术栈       | **依赖版本冲突**：多个项目维护相同依赖的不同版本，容易出现冲突 |
|                                                        | **协作成本高**：跨项目的联调和功能共享需要额外的沟通和管理     |
|                                                        | **构建效率低**：每个项目独立构建，导致时间浪费                 |

### pnpm monorepo 架构概述

**什么是 monorepo？**

| 特点               | 说明                                                                 |
| :----------------- | :------------------------------------------------------------------- |
| **单一代码仓库**   | 将多个相关项目（子包）集中在同一个代码仓库中进行管理                 |
| **统一管理依赖**   | 通过工具（如 pnpm、Lerna、Turborepo 等）实现依赖的统一安装和版本管理 |
| **共享代码**       | 通过工作空间或内部包机制共享公共模块                                 |
| **统一构建和发布** | 可以对多个子包进行一次性构建和发布                                   |

**为什么选择 pnpm？**

| 特点                  | 说明                                               |
| :-------------------- | :------------------------------------------------- |
| **链接机制高效**      | pnpm 使用符号链接代替直接安装，减少重复的依赖安装  |
| **更快的安装速度**    | pnpm 的缓存机制使得安装依赖速度更快                |
| **原生支持 monorepo** | 支持工作空间（workspaces）配置，方便子包间依赖管理 |
| **磁盘占用更少**      | 通过去重机制大幅减少磁盘使用量                     |

### 架构演进过程 🏃‍➡️

#### 从传统架构到 monorepo 架构的演进路径

**✅ 阶段 1：传统架构痛点**

- 多项目代码无法复用，公共模块需要手动同步

- 项目间依赖冲突和版本不一致问题频发

- CI/CD 管理复杂，每个项目需要单独的流水线

**✅ 阶段 2：引入 monorepo**

- 「代码集中化」将多个项目合并到一个仓库，统一管理

- 「工具引入」选择 pnpm 作为依赖管理工具，配置 workspaces

- 「公共模块抽离」提取项目中的重复模块，作为独立的子包管理

**✅ 阶段 3：优化和自动化**

- 「构建优化」使用 pnpm 的 `filter` 功能实现按需构建

- 「发布流程自动化」借助 CI/CD 流水线实现多包的自动发布（如使用 Changeset）

- 「监控和测试」对 monorepo 中的每个子包增加独立的测试和质量监控

##### 关键步骤

1️⃣ 项目迁移 —— 将现有独立项目整合到统一仓库

2️⃣ pnpm 配置

- 创建`pnpm-workspace.yaml`文件，指定工作空间路径
- 在每个子包中维护独立的`package.json`

3️⃣ 依赖管理 —— 使用`pnpm add`安装依赖，支持跨包共享

4️⃣ 统一脚本 —— 通过根目录的`package.json`统一管理构建、测试等脚本

5️⃣ 工具链引入 —— 集成 ESLint、Prettier、Husky 等工具，规范代码

### 基本原理 🔔

#### 工作空间（workspaces）

**定义**

- 通过`pnpm-workspace.yaml`文件指定多个子包路径，pnpm 会将这些子包识别为工作空间

**功能**

- 子包之间可以直接使用本地符号链接引用
- 所有依赖集中在根目录的`node_modules`，减少安装量

#### 依赖管理原理

> [!important] 去重机制
> pnpm 使用全局缓存存储依赖，避免重复安装

> [!important] 软链接机制
> 子包中依赖的模块通过软链接到根目录的`node_modules`，实现快速引用

> [!important] 版本一致性
> 根目录`package.json`的依赖可以强制统一子包依赖版本

#### 子包构建原理

> [!important] 局部构建
> pnpm 支持通过`--filter`参数选择性地构建特定子包，提升构建效率

> [!important] 缓存利用
> 借助 pnpm 和构建工具的缓存功能，避免重复打包

#### 子包发布原理（结合 NX 或 Turbo）

**发布工具**

- 通常结合 Changeset、Turbo 等工具进行版本管理和自动发布

**流程**

1️⃣ 识别子包改动

2️⃣ 自动生成变更日志

3️⃣ 按子包生成新版本号并发布到 npm

### pnpm monorepo 的优势

#### 优势对比

| 维度         | 传统架构                     | pnpm monorepo 架构         |
| ------------ | ---------------------------- | -------------------------- |
| 依赖管理     | 每个项目单独管理依赖         | 统一管理依赖，减少版本冲突 |
| 公共模块复用 | 需要手动同步和发布           | 子包间直接引用，快速共享   |
| 构建效率     | 每个项目单独构建，耗时长     | 按需构建，提升效率         |
| 磁盘占用     | 重复安装，磁盘占用高         | 去重机制，节省磁盘空间     |
| 协作成本     | 跨项目协作复杂，测试联调耗时 | 单仓库集中管理，便于协作   |

#### 适用场景

> [!tip] 多模块项目
> 如前端组件库、工具函数库

> [!tip] 微前端架构
> 多个前端项目整合为一个 monorepo

> [!tip] 复杂后端服务
> 多个微服务的统一管理和部署

> [!important] 总结
> 传统架构存在依赖管理困难、代码复用性低等问题，pnpm monorepo 架构通过统一管理依赖和代码，大幅提升开发效率和协作体验
>
> 架构迁移过程中需要注意工具链配置、依赖冲突解决以及构建和发布优化

## 系统工程化基于 monorepo 架构设计有什么实践经验

### 前端团队现状与挑战

在大型团队开发中，组件库、脚手架和业务系统是常见的核心模块，它们通常具有以下特点

- **组件库**：提供复用的 UI 组件或工具函数，用于加速业务开发

- **脚手架**：用于快速创建新项目或模块，标准化项目结构和配置

- **业务系统**：作为面向最终用户的核心系统，通常依赖组件库和脚手架

这些模块在分布式开发中存在以下问题

- **依赖管理困难**：组件库版本更新后，业务系统和脚手架的同步难以保证

- **重复构建**：不同模块需要独立构建，效率低下

- **版本冲突**：各模块依赖的库版本不一致，容易导致冲突

- **协作复杂**：跨模块调试和联调需要额外的时间成本

### 引入 monorepo 架构

**解决方案概述**

monorepo 是一种将多个相关项目存储在同一个代码仓库中的管理方式，结合 pnpm、turbo、tsup 和 vite 等工具，可以有效解决上述问题

- **统一依赖管理**：通过 pnpm 的 workspace 功能，所有子包共享依赖，避免版本冲突

- **高效构建与调试**：利用 turbo 按需构建，显著提升效率

- **模块化管理**：组件库、脚手架和业务系统通过清晰的分包结构实现独立开发与协作

**架构示意**

```
root
├── packages
│   ├── ui             # 组件库
│   ├── cli            # 脚手架
│   └── apps
│       └── business-system  # 业务系统
├── pnpm-workspace.yaml
└── turbo.json
```

### 依赖管理与 workspace 配置

**pnpm workspace 配置**

pnpm 的 workspace 提供了多项目依赖管理的能力，核心是通过`pnpm-workspace.yaml`管理子包

**配置步骤**

1️⃣ 在项目根目录创建`pnpm-workspace.yaml`文件

```yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

2️⃣ 每个子包拥有独立的`package.json`文件，例如

```json
{
  "name": "@zxwin/ui",
  "version": "1.0.0",
  "main": "dist/index.js",
  "dependencies": {}
}
```

3️⃣ 安装共享依赖

```bash
pnpm install
```

**子包依赖管理**

使用 pnpm 的工作空间机制添加依赖

```bash
pnpm add @zxwin/ui --filter @zxwin/business-system
```

子包之间的依赖通过符号链接实现本地引用，减少重复安装

### 子包构建方式选择

#### 组件库构建：tsup

Tsup 是一个零配置、高性能的打包工具，非常适合组件库的构建需求

**详细配置步骤**

1️⃣ 安装 tsup

```bash
pnpm add tsup -D
```

2️⃣ 在组件库子包的`package.json`中添加构建脚本

```json
{
  "scripts": {
    "build": "tsup src/index.ts --format esm,cjs --dts"
  }
}
```

3️⃣ 执行打包

```bash
pnpm build
```

#### 业务系统开发与构建：vite

vite 提供了极快的开发服务器和高效的构建能力，非常适合业务系统

**配置步骤**

1️⃣ 安装 vite

```bash
pnpm add vite -D
```

2️⃣ 创建`vite.config.ts`

```typescript
import { defineConfig } from 'vite'

export default defineConfig({
  root: './',
  server: {
    port: 3000
  },
  build: {
    outDir: 'dist'
  }
})
```

3️⃣ 启动开发服务器

```bash
pnpm dev
```

#### 脚手架构建：按需编译

脚手架工具通常只需打包核心逻辑，可以直接使用 tsup 或其他工具打包为 Node.js 可执行文件

### 基于 turbo 的流水线构建与启动

#### turbo 的任务管理

> turbo 是一个高效的任务运行器，适合 monorepo 场景下的任务编排

**配置步骤**

1️⃣ 创建`turbo.json`

```json
{
  "pipeline": {
    "build": {
      "outputs": ["dist/**"]
    },
    "dev": {},
    "test": {}
  }
}
```

2️⃣ 使用 turbo 执行任务

```bash
turbo run build
```

3️⃣ turbo 支持跳过未改动的子包任务，极大提升构建效率

#### 并行与依赖任务

配置任务的依赖关系，例如先构建组件库再启动业务系统

```json
{
  "pipeline": {
    "dev": {
      "dependsOn": ["build"]
    }
  }
}
```

### 工程化规范与代码质量保证

#### 统一代码规范

- ESLint：统一代码风格和语法检查

- Prettier：格式化代码，提高可读性

#### 提交规范

- Commitlint：规范提交信息

- 配置`commitlint.config.js`

```javascript
module.exports = { extends: ['@commitlint/config-conventional'] }
```

#### 自动化检查

- Husky：在 Git 钩子中集成自动检查

- 配置预提交检查脚本

```bash
npx husky add .husky/pre-commit "pnpm lint"
```

## 前端基于 monorepo 工程架构最佳实践

> 可以多阅读大厂开源项目，提升工程化架构设计思维

| 公司 | 项目/模块   | 地址                                                      | 简要说明                                  |
| ---- | ----------- | --------------------------------------------------------- | ----------------------------------------- |
| 阿里 | Ant Design  | [Ant Design](https://github.com/ant-design/ant-design)    | 企业级 UI 设计语言与 React 组件库         |
| 阿里 | ahooks      | [ahook](https://github.com/alibaba/hooks)                 | 高质量的 React Hooks 库                   |
| 阿里 | BizCharts   | [bizCharts](https://github.com/alibaba/BizCharts)         | 基于 G2 的 React 数据可视化库             |
| 阿里 | Umi         | [umi](https://github.com/umijs/umi)                       | 企业级 React 应用框架，支持插件化扩展     |
| 阿里 | Qiankun     | [qiankun](https://github.com/umijs/qiankun)               | 微前端框架，基于 single-spa 改进          |
| 字节 | Arco Design | [arco-design](https://github.com/arco-design/arco-design) | 企业级设计体系与组件库，支持 React 和 Vue |
| 字节 | Semi Design | [semi-design](https://github.com/DouyinFE/semi-design)    | 灵活且扩展性强的设计系统                  |
| 字节 | IconPark    | [icon-park](https://github.com/bytedance/iconpark)        | 可自定义多风格图标库                      |
| 字节 | VTable      | [VTable](https://github.com/VisActor/VTable)              | 面向大数据展示的可视化表格库              |
| 字节 | Garfish     | [garfish](https://github.com/web-infra-dev/garfish)       | 微前端框架，支持模块化加载与隔离          |
| 字节 | rsbuild     | [rsbuild](https://github.com/web-infra-dev/rsbuild)       | 高性能构建工具，类似 Vite 和 Esbuild      |

### Ant Design

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo@main/img/knowledge/frontEnd/engineering/architecture/monorepo/001.jpg)

- 使用`pnpm`管理多包依赖，统一版本，提升包的发布和构建效率
- 将核心组件库（`@ant-design/components`）、文档站点、工具包（如构建脚本、代码风格插件）等分离为多个包
- 通过严格的依赖关系定义和共享配置（如 ESLint、TSConfig），确保多包之间协作的可靠性
- 利用`lerna`或`changesets`实现变更记录自动生成，管理多个模块的版本发布

### ahooks

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo@main/img/knowledge/frontEnd/engineering/architecture/monorepo/002.jpg)

- Hooks 被拆分为多个功能模块（如`useRequest`、`useDrag`），用户可以按需安装
- 使用`pnpm + rollup`实现轻量化构建，避免重复依赖
- 文档和测试代码与核心代码模块化管理，方便开发和维护

### Umi

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo@main/img/knowledge/frontEnd/engineering/architecture/monorepo/003.jpg)

- 核心框架、插件系统、测试工具（如`umi-test`）分模块管理，保证功能解耦
- 通过`shared-utils`统一核心工具函数，降低重复实现
- 提供完善的脚手架工具，自动生成多模块依赖的开发环境

### Qiankun

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo@main/img/knowledge/frontEnd/engineering/architecture/monorepo/004.jpg)

- 核心库（`qiankun`）、测试工具、示例项目（examples）统一管理
- 使用`pnpm`的软链接功能，将本地开发包无缝集成到示例项目中，提升开发效率
- 通过持续集成工具（如 GitHub Actions）自动化测试所有子包，确保框架稳定性

### Arco Design

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo@main/img/knowledge/frontEnd/engineering/architecture/monorepo/005.jpg)

- 核心组件（React/Vue）、主题工具、图标库等分为多个子包，灵活组合
- 提供`@arco-dev/cli`，帮助开发者快速生成符合 monorepo 的项目结构
- 集成多种工具（如 Jest、Storybook），统一测试和文档开发流程

### Semi Design

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo@main/img/knowledge/frontEnd/engineering/architecture/monorepo/006.jpg)

- 使用 Rush 或`pnpm`管理模块依赖，避免团队协作中出现版本不一致的问题
- 将基础组件、业务组件、脚手架工具解耦，支持用户按需引用和定制
- 多包发布使用`changesets`自动生成变更日志，降低维护成本

### IconPark

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo@main/img/knowledge/frontEnd/engineering/architecture/monorepo/007.jpg)

- 图标库分为 SVG 核心包、React 包、Vue 包等多个模块，适配不同前端框架
- 使用`pnpm`的 workspace 特性，保持模块之间的依赖同步
- 提供一键脚手架工具，生成新的图标模块，方便社区贡献

### VTable

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo@main/img/knowledge/frontEnd/engineering/architecture/monorepo/008.jpg)

- 表格渲染核心与业务逻辑解耦，核心功能支持按需加载
- 使用`pnpm`和`eslint-config`等统一代码规范

### Garfish

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo@main/img/knowledge/frontEnd/engineering/architecture/monorepo/009.jpg)

- 核心库与插件模块化拆分，方便扩展
- 集成 Lerna 和 pnpm，提升依赖管理和构建速度

### rsbuild

![](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo@main/img/knowledge/frontEnd/engineering/architecture/monorepo/010.jpg)

- 子模块拆分为核心构建引擎、适配器、工具包，保持灵活性
- 利用 monorepo 管理开发环境依赖，统一使用 Rush 提升构建效率
