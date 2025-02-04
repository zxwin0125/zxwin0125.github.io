---
title: Prettier
order: 4
---

## Prettier 介绍

- Prettier 是近两年来使用频率特别高的一款通用的前端代码格式化工具
- 几乎能够去完成所有类型代码文件的格式化工作
- 通过使用 Prettier 可以很容易地去落实前端项目当中的规范化标准，而且使用也是非常简单

## Prettier 使用

- 安装

```bash
npm i prettier -D
```

- 检查某个文件并输出检查结果

```bash
npx prettier style.css
```

- 检查并格式化某个文件

```bash
npx prettier style.css --write
```

- 检查并格式化项目所有文件

```bash
npx prettier . --write
```
