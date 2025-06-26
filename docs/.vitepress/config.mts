import { defineConfig } from 'vitepress'
import { basename } from 'node:path'
import { head, nav, sidebar, algolia } from './configs'

const APP_BASE_PATH = basename(process.env.APP_BASE_PATH || '')

export default defineConfig({
  base: APP_BASE_PATH ? `/${APP_BASE_PATH}/` : '/',
  lang: 'zh-CN',
  title: '三金砚语',
  description: '三金的学习沉淀，包含前端基础知识、工作技能、团队管理经验、书籍周刊等',
  head,
  lastUpdated: true,
  cleanUrls: true,
  ignoreDeadLinks: 'localhostLinks',

  markdown: {
    image: {
      lazyLoading: true
    }
  },

  themeConfig: {
    i18nRouting: false,
    logo: '/logo.png',
    siteTitle: '三金砚语',
    // 导航栏
    nav,
    // 侧边栏
    sidebar,
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
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    },

    search: {
      provider: 'algolia',
      options: algolia
    },
    
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',

    comment: {
      repo: 'zxwin0125/zxwin0125.github.io',
      repoId: 'R_kgDONRCdfA=',
      category: 'Announcements',
      categoryId: 'DIC_kwDONRCdfM4Cr-ru',
    },
  },

  sitemap: {
    hostname: 'https://www.zxwin0125.top/',
  },
})
