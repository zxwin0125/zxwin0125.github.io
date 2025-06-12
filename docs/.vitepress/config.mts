import { defineConfig } from 'vitepress'
import { head, nav, sidebar } from './configs'

// import nav from './nav.ts'
// import { sidebar } from './sidebar.ts'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: '三金砚语',
  description: "三金的学习沉淀，包含前端基础知识、工作技能、团队管理经验、书籍周刊等",
  head: [
    ['link', { rel: 'icon', href: '/favicon.png' }],
    [
      'script',
      {
        defer: 'true',
        src: '/stats/script.js',
        'data-website-id': '4c0f1225-4719-4a92-9163-6c1109f06c5a'
      }
    ],
  ],
  themeConfig: {
    logo: '/logo.png',
    siteTitle: "三金砚语",
    // 导航栏
    nav,
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
    socialLinks: [{ icon: 'github', link: 'https://github.com/zxwin0125' }],
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
