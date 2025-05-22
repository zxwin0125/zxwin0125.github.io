import { defineConfig } from 'vitepress'

import nav from './nav.ts'
import { sidebar } from './sidebar.ts'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Blog of zxwin",
  description: "Blog of zxwin",
  themeConfig: {
    logo: '',
    siteTitle: 'Blog of zxwin',
    // 导航栏
    nav: nav(),
    // 侧边栏
    sidebar: sidebar,
    // 大纲容器位置
    aside: true,
    // 大纲容器配置
    outline: {
      label: '目录大纲',
      level: [2, 4]
    },
    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/zxwin0125' }
    ],
    footer: {
      message: 'Released under the CC BY-NC-ND 4.0 License.',
      copyright: 'Copyright © 2024-present zxwin_0125@163.com'
    },
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    },
    // algolia
    // carbonAds
    docFooter: {
      prev: '上一页',
      next: '下一页'
    }
  }
})
