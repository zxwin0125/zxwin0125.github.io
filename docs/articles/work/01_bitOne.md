---
title: 如何做好项目 1 号位
description: 作为业务 1 号位，需要做哪些？
keywords: 前端业务开发
---

# 如何做好项目 1 号位

> [!important]
> 不管名义上，你是不是 1 号位，先按照 1 号位会做的那些事情，去做，尽量多 cover 一些
>
> 不是因为别人让你当 1 号位，所以你是 1 号位，让别人从你所作所为感受到，你就是名副其实的 1 号位
>
> 在对应的节点，做对应的事情，关注投入产出，快准稳

## 需求阶段

### 需求评审

- 指定需求评审的 Deadline，让 PD 发会邀

- 评审时，先关注业务价值，业务目的，再看需求细节，关注投入产出比，不要 PD 说什么都做，能砍需求，也能加戏

- 知道主干逻辑，**<font color=red>并找到需求未提及的遗漏</font>**，如异常分支等，并逐条列出来确认，让 PD 补上

### 设计稿

- 指定视觉评审的 Deadline，让设计师发会邀

- 了解主视觉，评估工作量，**<font color=red>并找到稿子中的缺失</font>**，并逐条列出来确认，让设计补上

- **<font color=red>约定下一次设计稿的完整版交付时间</font>**

- 如有动画，约定静态图/粗稿动图的占坑时间（<50%的开发时间），和最终产物的交付时间（提测前）

> [!tip]
> 例如，开发耗时 6 天，则第 3 天前，提供静态图/占坑动画，第 5 天提供最终动画

- 好的设计稿案例：（状态齐全）

![An image](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/img/Work/01.png)

### 前端系分

- 整体 + 细节技术方案

- 接口的出入参格式

- 可配置的 json 的格式

- **<font size=4 color=red>高危：不见视觉稿，千万别系分评审，（不然你可能要加班熬）</font>**

> [!danger]
> 不要相信交互稿可以做系分，不要相信分批交付，除非你愿意加班，来填平这些 gap，来回返工改系分改方案

### 定排期

- 前后端测试 PM 一起，拉会，最好是给出结论再拉业务方同步，不然他们会边对排期，边压缩时间
- 排期尽量要预留 x1.5 的 buff，不要以为「这个改动很简单」，重要节点，在日历中列出来

  - 开发
  - 联调
  - 测分评审
  - :triangular_flag_on_post: 预发提测
  - 兼容性测试
  - 预发一轮业务验收（视觉验收、埋点验收），测试同学牵头
  - 代码 review 一轮、代码 review 二轮、发布计划 review、配置 review （技术视角）
  - 预发二轮业务验收 （如果是大项目的话），测试同学牵头
  - 压测
  - :triangular_flag_on_post: 灰度发布
  - :triangular_flag_on_post: 全量

![An image](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/img/Work/02.png)

## 开发阶段

- 代码每日（至少）一 commit

- 约定与后端的联调时间，提前 2 天，1 天提醒

> [!tip]
> 例如：9 天开发时间，6 天开发，3 天联调，周二周三分别提醒周四要联调，进度是否 ok
>
> 小技巧：如果条件允许，不要再倒数第 3 天 （第 7，8，9 天） 才联调，关注后端的工作量耗时，可以提前到第 6，7，8 天联调，比如先前后端联调框子，再各自安好，去调试细节，**<font color=red>先怼到 60% 完成度的状态，再慢慢雕花，做到 90% 完成度</font>**

- 提测准备
  - 自测截图留痕，提测文档 （需要的链接、二维码准备好）
  - 勾自测 case
  - 里程碑的事情，记得大群里同步 **<font color=red>@ 关键人员上下游，PD，运营，后端，测试，PM，主管，已提测</font>**

## 测试阶段

- 提测演示，投屏，展示功能、接口、重点关注，如何 mock 等

- 预发测试

- 兼容性测试

- 预发一轮验收

- 项目文案手册：如果涉及到多卡片，各个状态的文案

## 发布阶段

- 代码 review
- 配置 reivew

- 监控 review

- 发布计划 review

- 降级演练：主动降级，被动降级，动画降级

- 项目组成员：交叉 review

- 发布前的功能验收

- 埋点验收

- 灰度验收

- 主动同步进度

  - 把要做的事情，有条理的整理列出来
  - 信息互通，要让群成员知道，这件事情的「摘要进度」，知道有人在操作跟进中，不要等人问起才说

举例

![An image](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/img/Work/03.png)

![An image](https://cdn.jsdmirror.com/gh/zxwin0125/image-repo/img/Work/04.png)

## 上线阶段

- 看监控 （盯盘，不要出问题）

- 看数据、如何优化业务效果、如何优化下一次开发体验

- 项目总结：（好的 与 不好的）
