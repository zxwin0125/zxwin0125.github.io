import { type DefaultTheme } from 'vitepress'

export default function nav(): DefaultTheme.NavItem[] {
	return [
		{
			text: '主页',
			link: '/README',
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
		{
			text: '工作技能',
			link: '/work/01_bitOne',
		},
		{
			text: '学会管理',
			link: '/manage/01_needTodo',
		}
	];
}
