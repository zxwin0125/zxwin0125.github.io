import { defineConfig } from 'vitepress'

import nav from './nav.ts';
import { sidebar } from './sidebar.ts';
// import searchOptions from './searchOptions.ts';


// import { sidebar } from './sidebar.ts';

export default defineConfig({
  lang: 'zh-Hans',
  title: 'VitePress',
  description: 'Vite & Vue powered static site generator.',
  themeConfig: {
    nav: nav(),
    sidebar: sidebar,

    // search: { options: searchOptions() },
  },
});
