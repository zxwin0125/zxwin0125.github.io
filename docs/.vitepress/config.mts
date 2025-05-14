import { defineConfig } from 'vitepress'

import nav from './nav.ts'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Blog of zxwin",
  description: "Blog of zxwin",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: nav(),

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
