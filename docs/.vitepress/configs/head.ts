import type { HeadConfig } from 'vitepress'

export const head: HeadConfig[] = [
  ['meta', { name: 'algolia-site-verification', content: '8DA7E00850D0F56D' }],
  ['meta', { name: 'description', content: '关于前端技术的博客' }],
  ['link', { rel: 'icon', href: '/favicon.png' }],
  [
    'script',
    {
      defer: 'true',
      src: '/stats/script.js',
      'data-website-id': '4c0f1225-4719-4a92-9163-6c1109f06c5a'
    }
  ]
]
