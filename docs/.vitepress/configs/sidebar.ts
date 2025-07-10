import type { DefaultTheme } from 'vitepress'
import * as sidebarRouter from '../../utils/sidebarRouter'

export const sidebar: DefaultTheme.Config['sidebar'] = {
  [sidebarRouter.FrontEnd]: { base: sidebarRouter.FrontEnd, items: frontEnd() },
  [sidebarRouter.Network]: { base: sidebarRouter.Network, items: network() },
  [sidebarRouter.Solution]: { base: sidebarRouter.Solution, items: solution() },
  [sidebarRouter.Work]: { base: sidebarRouter.Work, items: work() },
  [sidebarRouter.Manage]: { base: sidebarRouter.Manage, items: manage() },
  [sidebarRouter.Methodology]: { base: sidebarRouter.Methodology, items: methodology() },
  [sidebarRouter.Books]: { base: sidebarRouter.Books, items: books() },
  [sidebarRouter.Weeks]: { base: sidebarRouter.Weeks, items: weeks() }
}

function frontEnd(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'HTML 基础',
      base: sidebarRouter.HTML,
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
          base: sidebarRouter.WebComponents,
          collapsed: true,
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
      text: 'CSS 基础',
      base: sidebarRouter.CSS,
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
        }
      ]
    },
    {
      text: 'JavaScript 基础',
      base: sidebarRouter.JavaScript,
      collapsed: true,
      items: [
        {
          text: 'this 到底指向谁',
          link: '01_this.md'
        }
      ]
    },
    {
      text: 'JavaScript 进阶',
      base: sidebarRouter.JavaScriptAdvanced,
      collapsed: true,
      items: [
        {
          text: '如何设计一个前端插件系统',
          link: '01_pluginSystem.md'
        }
      ]
    },
    {
      text: '前端工程化',
      base: sidebarRouter.Engineering,
      collapsed: true,
      items: [
        {
          text: 'Git',
          base: sidebarRouter.Git,
          collapsed: true,
          items: [
            {
              text: '改变世界的一次代码提交',
              link: 'https://hutusi.com/articles/the-greatest-git-commit'
            }
          ]
        }
      ]
    }
  ]
}

function network(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'JSONP 原理和实现',
      link: '01_jsonp.md'
    },
    {
      text: '你的站点加载速度应该多快？',
      link: '02_loadSpeed.md'
    },
    {
      text: '浏览器',
      collapsed: true,
      items: [
        {
          text: '浏览器是如何调度进程和线程的？',
          link: 'https://mp.weixin.qq.com/s?__biz=Mzk0MDMwMzQyOA==&mid=2247490542&idx=1&sn=d2c25370f8d942b16749d9052872d7ea&source=41#wechat_redirect'
        },
        {
          text: '浏览器是如何工作的？',
          link: 'https://king-hcj.github.io/2020/10/05/google-v8/'
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
    },
    {
      text: '一文了解文件上传全过程',
      link: 'https://segmentfault.com/a/1190000037411957'
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

function methodology(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '注意力是你最稀缺的资源',
      link: '01_attention.md'
    }
  ]
}

function books(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '深入理解现代 JavaScript',
      base: sidebarRouter.Books,
      collapsed: false,
      link: 'deepUnderstandJS.md'
    },
    {
      text: '重构，改善既有代码的设计',
      base: sidebarRouter.Books,
      collapsed: false,
      link: 'refactorExistCode.md'
    }
  ]
}

function weeks(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '25年7月',
      base: sidebarRouter.Weeks + '202507/',
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
