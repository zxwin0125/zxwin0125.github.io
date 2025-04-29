import { hopeTheme } from 'vuepress-theme-hope';
import navbar from '../.vuepress/navbar.js';
import sidebar from '../.vuepress/sidebar.js';

export default hopeTheme({
	// 主题选项：https://theme-hope.vuejs.press/zh/config/theme/layout.html
	hostname: 'https://www.zxwin0125.top',
	author: {
		name: '三金',
		url: 'https://www.zxwin0125.top',
	},
	license: 'CC BY-NC-ND 4.0', // 网站文章的版权声明
	favicon: '/favicon.ico',
	// logo: "/logo.svg",
	navbar: navbar,
	sidebar: sidebar,
	iconAssets: 'fontawesome',
	hotReload: true, // 开发模式下是否启动热更新，显示所有更改并重新渲染
	// 主题功能选项：https://theme-hope.vuejs.press/zh/config/theme/feature.html
	blog: {
		name: '三金',
		avatar: '/avatar_self.jpg',
		description: '所谓真正的宝物，是可以赌上人生，忘我投入的东西',
		medias: {
			GitHub: 'https://github.com/zxwin0125',
			Wechat:
				'https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/image/Wechat.jpg',
		},
		articleInfo: ['Category', 'Date', 'Tag', 'ReadingTime', 'PageView'],
	},
  // 导航栏布局
  navbarLayout: {
    start: ['Brand'],
    center: ['Links'],
    end: ['Repo', 'Outlook', 'Search'],
  },
  breadcrumb: false, // 是否全局启用路径导航
  // 页面布局 Frontmatter 配置：https://theme-hope.vuejs.press/zh/config/frontmatter/layout.html#pageinfo
	pageInfo: ['Category', 'Tag', 'ReadingTime', 'Word', 'PageView'],
  // 页面元数据：贡献者，最后修改时间，编辑链接
  contributors: false,
  lastUpdated: true,
  editLink: false,
  darkmode: 'switch', // 深色模式配置
  fullscreen: true, // 全屏按钮
	displayFooter: true, // 页脚，支持使用 HTMLString 以显示备案信息等

	// 默认为 GitHub. 同时也可以是一个完整的 URL
	repo: 'rockbenben/LearnData',
	// 自定义仓库链接文字。默认从 `repo` 中自动推断为 "GitHub" / "GitLab" / "Gitee" / "Bitbucket" 其中之一，或是 "Source"。
	repoLabel: 'GitHub',
	// 是否在导航栏内显示仓库链接，默认为 `true`
	repoDisplay: true,
	// 文档存放路径
	docsDir: 'docs',

	
	// 是否在向下滚动时自动隐藏导航栏
	// navbarAutoHide: "always",

	// 侧边栏排序规则
	// sidebarSorter: ['readme', 'order', 'title'],

	// 隐藏打印按钮
	// print: false,

	plugins: {
		blog: {
			excerpt: true,
			excerptLength: 100
		},
    // 禁用不需要的配置
		// https://plugin-md-enhance.vuejs.press/zh/guide/
		mdEnhance: {
			sub: true, // 上下角标
			sup: true,
			tasklist: true, // 任务列表
			include: true, //导入文件
			component: true, // 使用 component 代码块来在 Markdown 中添加组件
			footnote: true,
			// tabs: true, // 选项卡
			attrs: true, // 使用特殊标记为 Markdown 元素添加属性
			mark: true, // 使用 == == 进行标记。请注意两边需要有空格。
			align: true, // 启用自定义对齐
			// codetabs: true, // 代码块分组
			// demo: true, //代码演示
		},
    markdownImage: {
			// mark: true, // 启用图片标记
			lazyload: true, // 启用图片懒加载
			size: true, // 启用图片大小
			figure: true, // 启用图片 figure
		},
		markdownHint: {
			alert: true, // GFM 警告
			hint: true, // 提示容器
		},
		searchPro: {
			// 索引全部内容
			indexContent: true,
		},
		// 评论配置（仅做样例，记得更换）
		comment: {
			// Waline
			provider: 'Waline',
			serverURL: 'https://zx-blog-waline.vercel.app/',
			pageview: true,

			// Giscus
			// provider: "Giscus",
			// repo: "zxwin0125/zxwin0125.github.io",
			// repoId: "R_kgDOMu6eGg",
			// category: "General",
			// categoryId: "DIC_kwDOMu6eGs4Ci1Of",
		},
    copyright: {
      global: true,
      disableCopy: true,
      disableSelection: true,
    },
    copyCode: false,
		// 组件库
		components: {
			components: ['Badge', 'BiliBili', 'CodePen', 'VidStack'],
		},
	},
});
