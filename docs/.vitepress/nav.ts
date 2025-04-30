

// export const navbar = [
// 	{ text: '主页', link: '/blog' },
// 	// {
// 	// 	text: '知识体系',
// 	// 	icon: 'sitemap',
// 	// 	prefix: '/knowledge/',
// 	// 	children: [
// 	// 		{
// 	// 			text: '前端',
// 	// 			icon: 'code',
// 	// 			link: 'frontEnd/html/html5Tag',
// 	// 		},
// 	// 		{
// 	// 			text: '解决方案',
// 	// 			icon: 'code',
// 	// 			link: 'solution/01_cursor',
// 	// 		},
// 	// 		// {
// 	// 		// 	text: '服务端',
// 	// 		// 	icon: 'server',
// 	// 		// 	link: 'serverSide/index',
// 	// 		// },
// 	// 		// {
// 	// 		// 	text: '客户端',
// 	// 		// 	icon: 'mobile',
// 	// 		// 	link: 'clientSide/index',
// 	// 		// },
// 	// 		// {
// 	// 		// 	text: '数据库',
// 	// 		// 	icon: 'database',
// 	// 		// 	link: 'dataBase/index',
// 	// 		// },
// 	// 		// {
// 	// 		// 	text: '系统',
// 	// 		// 	icon: 'computer',
// 	// 		// 	link: 'os/index',
// 	// 		// },
// 	// 		// {
// 	// 		// 	text: 'Mac相关',
// 	// 		// 	icon: 'laptop',
// 	// 		// 	link: 'mac/index',
// 	// 		// },
// 	// 		// {
// 	// 		// 	text: '工具相关',
// 	// 		// 	icon: 'toolbox',
// 	// 		// 	link: 'tool/index',
// 	// 		// },
// 	// 		// {
// 	// 		// 	text: '面试',
// 	// 		// 	icon: 'splotch',
// 	// 		// 	link: 'interview/css/index',
// 	// 		// },
// 	// 	],
// 	// },
// 	// { text: '项目相关', icon: 'diagram-project', link: '/project/index' },
// 	// { text: '工作技能', icon: 'laptop-code', link: '/work/bitOne' },
// 	// {
// 	// 	text: '学会管理',
// 	// 	icon: 'users-gear',
// 	// 	link: '/manage/index',
// 	// },
// 	// {
// 	//   text: "应用",
// 	//   icon: "fa6-solid:bars-staggered",
// 	//   prefix: "/",
// 	//   children: [
// 	//     "apps/Applist",
// 	//     {
// 	//       text: "常用扩展",
// 	//       icon: "fa6-brands:chrome",
// 	//       link: "apps/Chrome",
// 	//     },
// 	//     {
// 	//       text: "服务/专题",
// 	//       icon: "",
// 	//       prefix: "",
// 	//       children: [
// 	//         {
// 	//           text: "专题示例",
// 	//           icon: "fa6-solid:dice-d20",
// 	//           link: "apps/topic/",
// 	//         },
// 	//       ],
// 	//     },
// 	//   ],
// 	// },
// 	// {
// 	//   text: "生活",
// 	//   icon: "fa6-solid:bed-pulse",
// 	//   prefix: "/family/",
// 	//   children: ["Diet", "Coupon"],
// 	// },
// 	// {
// 	//   text: "工具",
// 	//   icon: "fa6-solid:toolbox",
// 	//   children: [
// 	//     {
// 	//       text: "ChatGPT SC",
// 	//       icon: "fa6-solid:bolt",
// 	//       link: "https://www.aishort.top/",
// 	//     },
// 	//     { text: "IMGPrompt", icon: "fa6-solid:image", link: "https://prompt.newzone.top/" },
// 	//     { text: "多语言翻译", icon: "fa6-solid:language", link: "https://tools.newzone.top/json-translate" },
// 	//     {
// 	//       text: "工具收藏",
// 	//       icon: "fa6-solid:bars",
// 	//       link: "https://nav.newzone.top/",
// 	//     },
// 	//   ],
// 	// },
// ];

import { type DefaultTheme } from 'vitepress'

export default function nav(): DefaultTheme.NavItem[] {
	return [
		{
			text: '主页',
			link: '/blog',
		},
		{
			text: '知识体系',
			items: [
				{
					text: '前端',
					link: '/knowledge/frontEnd/html/01_H5Tag',
				},
				{
					text: '解决方案',
					link: '/knowledge/solution/01_cursor',
				},
			]
		},
	];
}
