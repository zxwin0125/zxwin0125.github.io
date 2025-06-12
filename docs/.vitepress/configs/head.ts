import type { HeadConfig } from 'vitepress'

export const head: HeadConfig[] = [
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
