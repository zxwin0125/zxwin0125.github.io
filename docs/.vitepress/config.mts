import { defineConfig } from 'vitepress'

import nav from './nav.ts'
import { sidebar } from './sidebar.ts'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Blog of zxwin",
  description: "Blog of zxwin",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: nav(),

    sidebar: sidebar,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/zxwin0125' }
    ]
  }
})
