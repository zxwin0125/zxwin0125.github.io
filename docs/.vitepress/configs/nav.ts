import type { DefaultTheme } from 'vitepress'

export const nav: DefaultTheme.Config['nav'] = [
  {
    text: '主页',
    link: '/README'
  },
  {
    text: '知识体系',
    items: [
      {
        text: '前端',
        link: '/articles/knowledge/frontEnd/html/01_H5Tag'
      },
      {
        text: '解决方案',
        link: '/articles/knowledge/solution/01_cursor'
      }
    ]
  },
  {
    text: '工作技能',
    link: '/articles/work/01_bitOne'
  },
  {
    text: '学会管理',
    link: '/articles/manage/01_needTodo'
  },
  {
    text: '读书角',
    items: [
      {
        text: '经典书籍',
        link: '/articles/read/books/deepUnderstandJS.md'
      },
      {
        text: '周刊',
        link: '/articles/read/weeks/202507/01_week/01_pluginSystem.md'
      }
    ]
  }
]
