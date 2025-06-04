import { type DefaultTheme } from 'vitepress'
import { createLink } from '../utils/tools'

const FrontEndBasePath = '/knowledge/frontEnd/'
const SolutionBasePath = '/knowledge/solution/'
const WorkBasePath = '/work/'
const ManageBasePath = '/manage/'
const BooksBasePath = '/read/books/'
const WeeksBasePath = '/read/weeks/'
export const sidebar = {
  [FrontEndBasePath]: { base: FrontEndBasePath, items: frontEnd() },
  [SolutionBasePath]: { base: SolutionBasePath, items: solution() },
  [WorkBasePath]: { base: WorkBasePath, items: work() },
  [ManageBasePath]: { base: ManageBasePath, items: manage() },
  [BooksBasePath]: { base: BooksBasePath, items: books() },
  [WeeksBasePath]: { base: WeeksBasePath, items: weeks() }
}

function frontEnd(): DefaultTheme.SidebarItem[] {
  const htmlBase = createLink(FrontEndBasePath, 'html')
  const cssBase = createLink(FrontEndBasePath, 'css')
  const javascriptBase = createLink(FrontEndBasePath, 'javascript')
  const frameBase = createLink(FrontEndBasePath, 'frame')
  const engineering = createLink(FrontEndBasePath, 'engineering')
  const architecture = createLink(engineering, 'architecture')
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
          link: '03_H5Mobile.md'
        },
        {
          text: 'Web Components',
          base: createLink(htmlBase, 'webComponents/'),
          items: [
            {
              text: '不可忽视的 Web Components',
              link: '01_WebComponents.md'
            }
          ]
        }
      ]
    },
    {
      text: 'CSS',
      base: `${cssBase}/`,
      collapsed: true,
      items: [
        {
          text: '多种方式实现居中',
          link: '01_cssCenter.md'
        },
        {
          text: 'BFC 背后的布局问题',
          link: '02_bfc.md'
        },
        {
          text: 'CSS Modules 理论和实战',
          link: '03_cssModules.md'
        },
        {
          text: 'CSS 变量和主题切换优雅实现',
          link: '04_cssVariable.md'
        },
        {
          text: '响应式布局和 Bootstrap 的实现分析',
          link: '05_responsiveLayout.md'
        },
        {
          text: 'CSS 最佳实践',
          link: '06_cssBestPractice.md'
        }
      ]
    },
    {
      text: 'JavaScript',
      base: `${javascriptBase}/`,
      collapsed: true,
      items: [
        {
          text: 'this 到底指向谁呢？',
          link: '01_this.md'
        }
      ]
    },
    // {
    // 	text: '前端框架',
    // 	base: `${frameBase}/`,
    // 	collapsed: true,
    // 	items: [
    // 		{
    // 			text: '触类旁通各种框架',
    // 			link: '01_frameAnalogy.md',
    // 		},
    // 		{
    // 			text: 'React',
    // 			base: createLink(frameBase, 'react/'),
    // 			collapsed: true,
    // 			items: [
    // 				{
    // 					text: '基础回顾',
    // 					link: '01_reactBasics.md',
    // 				},
    // 			]
    // 		}
    // 	],
    // }
    {
      text: '前端工程化',
      base: `${engineering}/`,
      collapsed: true,
      items: [
        {
          text: '工程规范',
          base: createLink(engineering, 'specification/'),
          collapsed: true,
          items: [
            {
              text: '基于 ESLint 9 前端工程规范化最佳实践',
              link: '01_eslint.md'
            }
          ]
        },
        {
          text: '工程架构',
          base: createLink(engineering, 'architecture/'),
          collapsed: true,
          items: [
            {
              text: 'monorepo 架构',
              // base: createLink(architecture, 'monorepo/'),
              collapsed: true,
              items: [
                {
                  text: '基于 pnpm monorepo 项目工程化设计',
                  link: '01_pnpm & monorepo.md'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}

function solution(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Cursor 通用解决方案',
      link: '01_cursor.md'
    }
  ]
}

function work(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '如何做好项目 1 号位',
      link: '01_bitOne.md'
    }
  ]
}

function manage(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '新晋主管需要做什么',
      link: '01_needTodo.md'
    }
  ]
}

function books(): DefaultTheme.SidebarItem[] {
  const refactoringBase = createLink(BooksBasePath, 'refactoring')
  return [
    {
      text: '《重构，改善既有代码的设计》',
      base: `${refactoringBase}/`,
      collapsed: false,
      items: [
        {
          text: '序言',
          link: '00_preface.md'
        }
      ]
    }
  ]
}

function weeks(): DefaultTheme.SidebarItem[] {
  const monthFor202506 = createLink(WeeksBasePath, '202506')
  return [
    {
      text: '25年6月',
      base: `${monthFor202506}/`,
      collapsed: true,
      items: [
        {
          text: '第一周',
          link: '01_week.md'
        }
      ]
    }
  ]
}
