import { sidebar } from 'vuepress-theme-hope';

// 图标：https://theme-hope.vuejs.press/zh/guide/interface/icon.html#%E8%AE%BE%E7%BD%AE%E5%9B%BE%E6%A0%87
// https://fontawesome.com/search?m=free&o=r
export default sidebar({
	// '': [
	// 	'/DailyRoutine',
	// 	'/Fitness',
	// 	// 读书笔记架构更换到 docsify，不能使用相对链接
	// 	{
	// 		text: '读书笔记',
	// 		icon: 'fa6-brands:readme',
	// 		link: 'https://newzone.top/reading/',
	// 	},
	// 	// 指定显示页面
	// 	{
	// 		text: '🧰 应用手册',
	// 		icon: '',
	// 		prefix: '/apps/',
	// 		link: '',
	// 		collapsible: true,
	// 		children: [
	// 			'Applist.md',
	// 			'toolbox.md',
	// 			{
	// 				text: '其他',
	// 				icon: 'fa6-solid:code-compare',
	// 				collapsible: true,
	// 				children: ['design.md'],
	// 			},
	// 		],
	// 	},
	// 	{
	// 		text: '🌐 页面开发',
	// 		icon: '',
	// 		prefix: '/web/',
	// 		link: '',
	// 		collapsible: true,
	// 		children: 'structure',
	// 	},
	// 	{
	// 		text: '🏗️ 网站部署',
	// 		icon: '',
	// 		prefix: '/deploy/',
	// 		link: '',
	// 		collapsible: true,
	// 		children: [
	// 			'Static.md',
	// 			'CloudServices.md',
	// 			'VPS.md',
	// 			{
	// 				text: '部署工具',
	// 				icon: 'fa6-brands:windows',
	// 				collapsible: true,
	// 				children: ['GitHub.md', 'Cloudflare.md', 'MySQL.md', 'DNS.md'],
	// 			},
	// 		],
	// 	},
	// 	{
	// 		text: '🔡 代码编程',
	// 		icon: '',
	// 		prefix: '/code/',
	// 		collapsible: true,
	// 		children: [
	// 			'README.md',
	// 			{
	// 				text: 'Basic',
	// 				icon: 'fa6-solid:cube',
	// 				collapsible: true,
	// 				children: ['Markdown.md', 'Electron.md', 'AutoHotkey.md', 'Regex.md'],
	// 			},
	// 			{
	// 				text: 'FrondEnd',
	// 				icon: 'fa6-solid:object-group',
	// 				collapsible: true,
	// 				children: ['Vue.md', 'HTML.md', 'Javascript.md', 'Python.md'],
	// 			},
	// 		],
	// 	},
	// 	{
	// 		text: '🛖 生活记录',
	// 		icon: '',
	// 		prefix: '/family/',
	// 		collapsible: true,
	// 		children: 'structure',
	// 	},
	// 	// {
	// 	// 	text: '博客文章',
	// 	// 	icon: 'fa6-solid:feather-pointed',
	// 	// 	prefix: '/_posts/',
	// 	// 	link: '/blog',
	// 	// 	collapsible: true,
	// 	// 	children: 'structure',
	// 	// },
	// ],
	// 专题区（独立侧边栏）
	// '/apps/topic/': 'structure',
	'/knowledge/frontEnd/': [
		{
			text: 'HTML',
			icon: 'https://s21.ax1x.com/2024/09/19/pAKWX7V.png',
			prefix: 'html/',
			collapsible: true,
			children: [
				'html5Tag.md',
				'htmlSemanticization.md',
				'html5Mobile.md',
				{
					text: 'Web components',
					icon: '',
					prefix: 'webComponents/',
					collapsible: true,
					children: ['webComponents'],
				},
			],
		},
		{
			text: 'CSS',
			icon: 'https://s21.ax1x.com/2024/09/19/pAKWvkT.png',
			prefix: 'css/',
			collapsible: true,
			children: 'structure',
		},
		{
			text: 'JavaScript',
			icon: 'https://s21.ax1x.com/2024/09/19/pAKfpp4.png',
			prefix: 'javascript/',
			collapsible: true,
			children: 'structure',
		},
		{
			text: '前端框架',
			icon: 'https://s21.ax1x.com/2024/09/19/pAKWxtU.png',
			prefix: 'frame/',
			collapsible: true,
			children: [
				'frameAnalogy.md',
				{
					text: '学一学 React',
					prefix: 'react/',
					collapsible: true,
					children: 'structure',
				},
				{
					text: '学一学 Vue',
					prefix: 'vue/',
					collapsible: true,
					children: 'structure',
				},
				// 'frameIsomorphic.md',
				'frameStudy.md'
			],
		},
		{
			text: '前端工程化',
			icon: 'screwdriver-wrench',
			prefix: 'engineering/',
			collapsible: true,
			children: [
				'index.md',
				'scaffoldingTool.md',
				{
					text: '关于自动化构建',
					prefix: 'automatedConstruction/',
					collapsible: true,
					children: 'structure',
				},
				{
					text: '深入浅出模块化',
					prefix: 'module/',
					collapsible: true,
					children: 'structure',
				},
				'codeSpecification.md',
				// 'projectOrganizationDesign.md',
				'webpack.md',
			],
		},
		{
			text: '前端性能优化',
			icon: 'bug-slash',
			prefix: 'performanceOptimization/',
			collapsible: true,
			children: [
				// 'monitorAndError.md',
				// 'problems.md',
				'reactFrame.md'
			],
		},
		{
			text: '前端编程思维和算法',
			icon: 'brain',
			prefix: 'programmingThinkingAndAlgorithms/',
			collapsible: true,
			children: [
				'designPattern.md',
				// 'dataStructure.md',
				// 'function.md',
				// 'algorithms.md',
				// 'wx.md'
			],
		},
	],
  '/knowledge/interview/': [
    {
			text: 'CSS',
			icon: 'https://s21.ax1x.com/2024/09/19/pAKWvkT.png',
			prefix: 'css/',
			collapsible: true,
			children: 'structure',
		},
		{
			text: 'DOM',
			icon: 'https://s21.ax1x.com/2024/09/19/pAKWvkT.png',
			prefix: 'dom/',
			collapsible: true,
			children: 'structure',
		},
		{
			text: 'Web API',
			icon: 'https://s21.ax1x.com/2024/09/19/pAKWvkT.png',
			prefix: 'webAPI/',
			collapsible: true,
			children: 'structure',
		},
		{
			text: 'JavaScript',
			icon: 'https://s21.ax1x.com/2024/09/19/pAKWvkT.png',
			prefix: 'javascript/',
			collapsible: true,
			children: 'structure',
		},
  ],
	'/project/': 'structure',
	'/work/': 'structure',
	'/manage/': 'structure',
});
