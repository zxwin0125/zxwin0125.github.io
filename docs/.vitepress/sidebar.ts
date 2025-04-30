// export default sidebar({
// 	// '': [
// 		// '/DailyRoutine',
// 		// '/Fitness',
// 		// 读书笔记架构更换到 docsify，不能使用相对链接
// 		// {
// 		// 	text: '读书笔记',
// 		// 	icon: 'fa6-brands:readme',
// 		// 	link: 'https://newzone.top/reading/',
// 		// },
// 		// 指定显示页面
// 		// {
// 		// 	text: '🧰 应用手册',
// 		// 	icon: '',
// 		// 	prefix: '/apps/',
// 		// 	link: '',
// 		// 	collapsible: true,
// 		// 	children: [
// 		// 		'Applist.md',
// 		// 		'toolbox.md',
// 		// 		{
// 		// 			text: '其他',
// 		// 			icon: 'fa6-solid:code-compare',
// 		// 			collapsible: true,
// 		// 			children: ['design.md'],
// 		// 		},
// 		// 	],
// 		// },
// 		// {
// 		// 	text: '🌐 页面开发',
// 		// 	icon: '',
// 		// 	prefix: '/web/',
// 		// 	link: '',
// 		// 	collapsible: true,
// 		// 	children: 'structure',
// 		// },
// 		// {
// 		// 	text: '🏗️ 网站部署',
// 		// 	icon: '',
// 		// 	prefix: '/deploy/',
// 		// 	link: '',
// 		// 	collapsible: true,
// 		// 	children: [
// 		// 		'Static.md',
// 		// 		'CloudServices.md',
// 		// 		'VPS.md',
// 		// 		{
// 		// 			text: '部署工具',
// 		// 			icon: 'fa6-brands:windows',
// 		// 			collapsible: true,
// 		// 			children: ['GitHub.md', 'Cloudflare.md', 'MySQL.md', 'DNS.md'],
// 		// 		},
// 		// 	],
// 		// },
// 		// {
// 		// 	text: '🔡 代码编程',
// 		// 	icon: '',
// 		// 	prefix: '/code/',
// 		// 	collapsible: true,
// 		// 	children: [
// 		// 		'README.md',
// 		// 		{
// 		// 			text: 'Basic',
// 		// 			icon: 'fa6-solid:cube',
// 		// 			collapsible: true,
// 		// 			children: ['Markdown.md', 'Electron.md', 'AutoHotkey.md', 'Regex.md'],
// 		// 		},
// 		// 		{
// 		// 			text: 'FrondEnd',
// 		// 			icon: 'fa6-solid:object-group',
// 		// 			collapsible: true,
// 		// 			children: ['Vue.md', 'HTML.md', 'Javascript.md', 'Python.md'],
// 		// 		},
// 		// 	],
// 		// },
// 		// {
// 		// 	text: '🛖 生活记录',
// 		// 	icon: '',
// 		// 	prefix: '/family/',
// 		// 	collapsible: true,
// 		// 	children: 'structure',
// 		// },
// 		// {
// 		// 	text: '博客文章',
// 		// 	icon: 'fa6-solid:feather-pointed',
// 		// 	prefix: '/_posts/',
// 		// 	link: '/blog',
// 		// 	collapsible: true,
// 		// 	children: 'structure',
// 		// },
// 	// ],
// 	// 专题区（独立侧边栏）
// 	// '/apps/topic/': 'structure',

// 	'/knowledge/frontEnd/': [
// 		{
// 			text: 'HTML',
// 			icon: 'https://s21.ax1x.com/2024/09/19/pAKWX7V.png',
// 			prefix: 'html/',
// 			collapsible: true,
// 			children: [
// 				'html5Tag.md',
// 				'htmlSemanticization.md',
// 				'html5Mobile.md',
// 				{
// 					text: 'Web components',
// 					icon: '',
// 					prefix: 'webComponents/',
// 					collapsible: true,
// 					children: ['webComponents'],
// 				},
// 			],
// 		},
// 		{
// 			text: 'CSS',
// 			icon: 'https://s21.ax1x.com/2024/09/19/pAKWvkT.png',
// 			prefix: 'css/',
// 			collapsible: true,
// 			children: [
// 				'01_cssCenter.md',
// 				'02_bfc.md',
// 				'03_cssModules.md',
// 				'04_cssVariable.md',
// 				'05_responsiveLayout.md',
// 			],
// 		},
// 		{
// 			text: 'JavaScript',
// 			icon: 'https://s21.ax1x.com/2024/09/19/pAKfpp4.png',
// 			prefix: 'javascript/',
// 			collapsible: true,
// 			children: [
// 				'01_this.md',
// 				'closure.md',
// 				'asynchronous.md',
// 				'promise.md',
// 				'objectPrototype.md',
// 				'es6Next.md',
// 				'other.md',
// 				{
// 					text: 'API',
// 					prefix: 'api/',
// 					collapsible: true,
// 					children: 'structure',
// 				}
// 			],
// 		},
// 		{
// 			text: '前端框架',
// 			icon: 'https://s21.ax1x.com/2024/09/19/pAKWxtU.png',
// 			prefix: 'frame/',
// 			collapsible: true,
// 			children: [
// 				'frameAnalogy.md',
// 				{
// 					text: '学一学 React',
// 					prefix: 'react/',
// 					collapsible: true,
// 					children: [
// 						'reactBasics.md',
// 						'reactJSX.md',
// 						'reactVirtualDomDiff.md',
// 						'reactFiber.md',
// 						{
// 							text: '核心源码分析',
// 							prefix: 'reactSourceCode/',
// 							collapsible: true,
// 							children: [
// 								'env.md',
// 								'createReactElement.md',
// 								'reactArchitecture.md',
// 								'reactRender.md'
// 							]
// 						},
// 						'reactHooks.md'
// 					],
// 				},
// 				{
// 					text: '学一学 Vue',
// 					prefix: 'vue/',
// 					collapsible: true,
// 					children: [
// 						'vueBasics.md',
// 						{
// 							text: '相关核心原理',
// 							prefix: 'vuePrinciple/',
// 							collapsible: true,
// 							children: 'structure',
// 						},
// 						{
// 							text: '核心源码分析',
// 							prefix: 'vueSourceCode/',
// 							collapsible: true,
// 							children: 'structure',
// 						},
// 						{
// 							text: 'Vuex 数据流管理',
// 							prefix: 'vuex/',
// 							collapsible: true,
// 							children: 'structure',
// 						}
// 					],
// 				},
// 				// 'frameIsomorphic.md',
// 				// 'frameStudy.md'
// 			],
// 		},
// 		{
// 			text: '前端工程化',
// 			icon: 'screwdriver-wrench',
// 			prefix: 'engineering/',
// 			collapsible: true,
// 			children: [
// 				'index.md',
// 				{
// 					text: '聊聊脚手架',
// 					prefix: 'scaffoldingTool/',
// 					collapsible: true,
// 					children: 'structure',
// 				},
// 				{
// 					text: '关于自动化构建',
// 					prefix: 'automatedConstruction/',
// 					collapsible: true,
// 					children: 'structure',
// 				},
// 				{
// 					text: '深入浅出模块化',
// 					prefix: 'module/',
// 					collapsible: true,
// 					children: 'structure',
// 				},
// 				{
// 					text: '打包工具有哪些',
// 					prefix: 'buildTool/',
// 					collapsible: true,
// 					children: [
// 						'index.md',
// 						{
// 							text: 'Webpack',
// 							prefix: 'webpack/',
// 							collapsible: true,
// 							children: [
// 								'introduce.md',
// 								'loader.md',
// 								'plugin.md',
// 								'experience.md',
// 								'prodOptimize.md'
// 							]
// 						},
// 						'rollup.md',
// 						'parcel.md'
// 						// 'gulpAndWebpack.md',
// 					],
// 				},
// 				{
// 					text: '规范化标准',
// 					prefix: 'normalize/',
// 					collapsible: true,
// 					children: 'structure',
// 				}
// 				// 'webpack.md',
// 				// 'codeSpecification.md',
// 				// 'projectOrganizationDesign.md',
// 			],
// 		},
// 		// {
// 		// 	text: '前端性能优化',
// 		// 	icon: 'bug-slash',
// 		// 	prefix: 'performanceOptimization/',
// 		// 	collapsible: true,
// 		// 	children: [
// 		// 		// 'monitorAndError.md',
// 		// 		'problems.md',
// 		// 		// 'reactFrame.md'
// 		// 	],
// 		// },
// 		// {
// 		// 	text: '前端编程思维和算法',
// 		// 	icon: 'brain',
// 		// 	prefix: 'programmingThinkingAndAlgorithms/',
// 		// 	collapsible: true,
// 		// 	children: [
// 		// 		'designPattern.md',
// 		// 		// 'dataStructure.md',
// 		// 		// 'function.md',
// 		// 		// 'algorithms.md',
// 		// 		// 'wx.md'
// 		// 	],
// 		// },
// 	],
//   '/knowledge/interview/': [
//     {
// 			text: 'CSS',
// 			icon: 'https://s21.ax1x.com/2024/09/19/pAKWvkT.png',
// 			prefix: 'css/',
// 			collapsible: true,
// 			children: 'structure',
// 		},
// 		{
// 			text: 'DOM',
// 			icon: 'https://s21.ax1x.com/2024/09/19/pAKWvkT.png',
// 			prefix: 'dom/',
// 			collapsible: true,
// 			children: 'structure',
// 		},
// 		{
// 			text: 'Web API',
// 			icon: 'https://s21.ax1x.com/2024/09/19/pAKWvkT.png',
// 			prefix: 'webAPI/',
// 			collapsible: true,
// 			children: 'structure',
// 		},
// 		{
// 			text: 'JavaScript',
// 			icon: 'https://s21.ax1x.com/2024/09/19/pAKWvkT.png',
// 			prefix: 'javascript/',
// 			collapsible: true,
// 			children: 'structure',
// 		},
//   ],
// 	'/project/': [
// 		// 'bill.md',
// 		// 'billReconfiguration.md'
// 	],
// 	'/work/': 'structure',
// 	// '/manage/': 'structure',
// });

import { type DefaultTheme } from 'vitepress'

const FrontEndBasePath = '/knowledge/frontEnd/'
const SolutionBasePath = '/knowledge/solution/'
const WorkBasePath = '/work/'
export const sidebar = {
	[FrontEndBasePath]: { base: FrontEndBasePath, items: frontEnd() },
	[SolutionBasePath]: { base: SolutionBasePath, items: solution() },
	[WorkBasePath]: { base: WorkBasePath, items: work() },
};

function frontEnd(): DefaultTheme.SidebarItem[] {
	const htmlBase = createLink(FrontEndBasePath, 'html')
	return [
		{
			text: 'HTML',
			base: `${htmlBase}/`,
			collapsed: false,
			items: [
				{
					text: '进击的 HTML5',
					link: '01_H5Tag.md'
				},
				{
					text: '如何理解 HTML5 语义化',
					link: '02_H5Semanticization.md'
				},
				{
					text: '移动端 H5 注意事项总结',
					link: '03_H5Mobile.md',
				},
				{
					text: 'Web Components',
					base: createLink(htmlBase, 'webComponents/'),
					items: [
						{
							text: '不可忽视的 Web Components',
							link: '01_WebComponents.md',
						}
					]
				}
			],
		},
	];
}

function solution(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: 'Cursor 通用解决方案',
			link: '01_cursor.md',
		},
	];
}

function work(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: '如何做好项目 1 号位',
			link: '01_bitOne.md',
		},
	];
}
function createLink(base: string, path: string): string {
  return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
}