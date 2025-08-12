import type { DefaultTheme } from 'vitepress'
import * as sidebarRouter from '../../utils/sidebarRouter'

export const sidebar: DefaultTheme.Config['sidebar'] = {
  [sidebarRouter.FrontEnd]: { base: sidebarRouter.FrontEnd, items: frontEnd() },
  [sidebarRouter.Server]: { base: sidebarRouter.Server, items: server() },
  [sidebarRouter.Network]: { base: sidebarRouter.Network, items: network() },
  [sidebarRouter.System]: { base: sidebarRouter.System, items: system() },
  [sidebarRouter.Solution]: { base: sidebarRouter.Solution, items: solution() },
  [sidebarRouter.Project]: { base: sidebarRouter.Project, items: project() },
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
        },
        {
          text: '你不应该错过的 CSS 新特性',
          link: 'https://juejin.im/post/6886258269137043464'
        },
        {
          text: 'CSS ::marker 让文字序号更有意思',
          link: 'https://segmentfault.com/a/1190000040175019'
        },
        {
          text: 'Facebook 重构：抛弃 Sass / Less ，迎接原子化 CSS 时代',
          link: 'https://juejin.cn/post/6917073600474415117'
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
        },
        {
          text: 'ECMAScript 2020 新增特性',
          link: 'https://juejin.im/post/6883306672064987149'
        },
        {
          text: 'JavaScript ES2021 Features You Need to Know',
          link: 'https://towardsdev.com/javascript-es2021-features-d864eccad081'
        }
      ]
    },
    {
      text: 'JavaScript 进阶',
      base: sidebarRouter.JavaScriptAdvanced,
      collapsed: true,
      items: [
        {
          text: 'JavaScript Debugger 原理揭秘',
          link: 'https://juejin.cn/post/6961790494514872333'
        },
        {
          text: '如何设计一个前端插件系统',
          link: '01_pluginSystem.md'
        },
        {
          text: 'JavaScript 中如何实现大文件并行下载？',
          link: 'https://juejin.cn/post/6954868879034155022'
        },
        {
          text: '解释 JavaScript 的内存管理',
          link: 'https://felixgerschau.com/javascript-memory-management'
        },
        {
          text: '一文带你了解如何排查内存泄漏导致的页面卡顿现象',
          link: 'https://juejin.cn/post/6947841638118998029'
        },
        {
          text: 'Introduction to Event Loop Utilization in Node.js',
          link: 'https://nodesource.com/blog/event-loop-utilization-nodejs'
        },
        {
          text: 'JavaScript 元编程',
          link: 'https://mp.weixin.qq.com/s/1E8d5jYb0sFGPRk3pMLaHA'
        },
        {
          text: '像玩 jQuery 一样玩 AST',
          link: 'https://juejin.cn/post/6923936548027105293'
        },
        {
          text: '你怎么还在说 webassembly？',
          link: 'https://mp.weixin.qq.com/s/GvknRowW4_n-dtmAr3_OAQ'
        },
        {
          text: '一文了解 AsyncHooks',
          link: 'https://mp.weixin.qq.com/s/08AVmJLMdMNm4yNWQwk-DA'
        },
        {
          text: '前端装逼技巧 108 式',
          link: 'https://segmentfault.com/a/1190000038251777'
        },
        {
          text: '精读《捕获所有异步 error》',
          link: 'https://segmentfault.com/a/1190000040634549'
        },
        {
          text: '一文打尽前端 Base64 编码知识',
          link: 'https://mp.weixin.qq.com/s/Xc4v21d5qcbpMcSZF-N6AQ'
        },
        {
          text: '实现无感刷新 token 我是这样做的',
          link: 'https://juejin.cn/post/6983582201690456071'
        },
        {
          text: '浏览器中的 ESM',
          link: 'https://mp.weixin.qq.com/s/6CpzQXkZd1AcX51A3CNWgA'
        }
      ]
    },
    {
      text: 'TypeScript 基础',
      base: sidebarRouter.TypeScript,
      collapsed: true,
      items: [
        {
          text: 'TypeScript 中提升幸福感的 10 个高级技巧',
          link: 'https://juejin.cn/post/6919478002925453320'
        }
      ]
    },
    {
      text: '框架',
      base: sidebarRouter.FrameWork,
      collapsed: true,
      items: [
        {
          text: 'React',
          base: sidebarRouter.React,
          collapsed: true,
          items: [
            {
              text: '从中断机制看 React Fiber 技术',
              link: 'https://juejin.cn/post/6943558431018057764'
            },
            {
              text: '一文吃透 react-hooks 原理',
              link: 'https://juejin.cn/post/6944863057000529933'
            },
            {
              text: '各流派 React 状态管理对比和原理实现',
              link: 'https://mp.weixin.qq.com/s/h8uRkY8wzzP-ajmEIHkzwQ'
            }
          ]
        }
      ]
    },
    {
      text: 'Node',
      base: sidebarRouter.Node,
      collapsed: true,
      items: [
        {
          text: 'node_modules 困境',
          link: 'https://juejin.cn/post/6914508615969669127'
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
            },
            {
              text: 'Git 飞行规则(Flight Rules)',
              link: 'https://github.com/k88hudson/git-flight-rules/blob/master/README_zh-CN.md'
            }
          ]
        },
        {
          text: '比 npm link 更好的调试方式',
          link: 'https://mp.weixin.qq.com/s/I4hhrgI3-Y18HD8zw_9g9w'
        },
        {
          text: '构建工具',
          base: sidebarRouter.BuildTools,
          collapsed: true,
          items: [
            {
              text: '聊聊 ESM、Bundle 、Bundleless 、Vite 、Snowpack',
              link: 'https://segmentfault.com/a/1190000025137845'
            },
            {
              text: 'vite——纵享丝滑开发体验',
              link: 'https://juejin.cn/post/6906674140792094727'
            },
            {
              text: '前端领域的转译打包工具链',
              link: 'https://juejin.cn/post/6956602138201948196'
            }
          ]
        },
        {
          text: '当我们聊前端部署时，我们在聊什么',
          link: 'https://juejin.cn/post/7017710911443959839'
        }
      ]
    },
    {
      text: '前端性能优化',
      base: sidebarRouter.PerformanceOptimization,
      collapsed: true,
      items: [
        {
          text: '从 Weex 到 Web，性能逆势如何破局？',
          link: 'https://juejin.cn/post/6907212467122733070'
        }
      ]
    },
    {
      text: '前端数据可视化',
      base: sidebarRouter.DataVisualization,
      collapsed: true,
      items: [
        {
          text: '企业级数据可视化应用有哪些机遇与挑战？',
          link: 'https://mp.weixin.qq.com/s/vvKPJZCZNs8VfM8A07x5SA'
        }
      ]
    },
    {
      text: '微前端',
      base: sidebarRouter.MicroFrontend,
      collapsed: true,
      items: [
        {
          text: '谈谈微前端领域的js沙箱实现机制',
          link: 'https://mp.weixin.qq.com/s/IJMgMO1IeYw2Io8MN7WZWQ'
        },
        {
          text: '字节跳动是如何落地微前端的',
          link: 'https://juejin.cn/post/7016911648656982024'
        }
      ]
    },
    {
      text: 'Serverless',
      base: sidebarRouter.Serverless,
      collapsed: true,
      items: [
        {
          text: '字节跳动基于 Serverless 的前端研发模式升级',
          link: 'https://mp.weixin.qq.com/s/J2fHm_mR7UE65q1vSQ9xpA'
        }
      ]
    }
  ]
}

function server(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '为什么要使用 Go 语言？Go 语言的优势在哪里？',
      link: 'https://www.zhihu.com/question/21409296'
    },
    {
      text: '掌握 Shell 编程，一篇就够了',
      link: 'https://zhuanlan.zhihu.com/p/102176365'
    },
    {
      text: '高频Linux命令大总结，可以记住',
      link: 'https://segmentfault.com/a/1190000040222932'
    },
    {
      text: '容器',
      base: sidebarRouter.Container,
      collapsed: true,
      items: [
        {
          text: 'Docker 常用命令',
          link: 'https://juejin.cn/post/6996126578048499743'
        },
        {
          text: '你该如何为 Kubernetes 定制特性',
          link: 'https://draveness.me//cloud-native-kubernetes-extension'
        },
        {
          text: '谈谈 Kubernetes 的问题和局限性',
          link: 'https://draveness.me//kuberentes-limitations'
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
      text: 'HTTPS 温故知新',
      link: 'https://mp.weixin.qq.com/s/i8qVR-b1MLQ_UI3NG7aPXw'
    },
    {
      text: '深入理解 web 协议：http 包体传输',
      link: 'https://mp.weixin.qq.com/s/q5Jr-FS-8XC1ojM1J50TWg'
    },
    {
      text: 'HTTP/3 原理实战',
      link: 'https://mp.weixin.qq.com/s/MHYMOYHqhrAbQ0xtTkV2ig'
    },
    {
      text: '计算机网络基础知识总结',
      link: 'https://juejin.im/post/6885468617580904455'
    },
    {
      text: '为什么 IPv6 难以取代 IPv4',
      link: 'https://draveness.me/whys-the-design-ipv6-replacing-ipv4/'
    },
    {
      text: '计算机教育中缺失的一课',
      link: 'https://missing-semester-cn.github.io/'
    },
    {
      text: '内存管理设计精要',
      link: 'https://draveness.me//system-design-memory-management'
    },
    {
      text: 'WebSocket 是什么原理？为什么可以实现持久连接？',
      link: 'https://www.zhihu.com/question/20215561'
    },
    {
      text: '浏览器',
      collapsed: true,
      items: [
        {
          text: '前端浏览器缓存知识梳理',
          link: 'https://juejin.cn/post/6947936223126093861'
        },
        {
          text: '浏览器是如何调度进程和线程的？',
          link: 'https://mp.weixin.qq.com/s?__biz=Mzk0MDMwMzQyOA==&mid=2247490542&idx=1&sn=d2c25370f8d942b16749d9052872d7ea&source=41#wechat_redirect'
        },
        {
          text: '浏览器是如何工作的？',
          link: 'https://king-hcj.github.io/2020/10/05/google-v8/'
        },
        {
          text: 'Useful DevTools Tips And Shortcuts(Chrome, Firefox, Edge)',
          link: 'https://www.smashingmagazine.com/2021/02/useful-chrome-firefox-devtools-tips-shortcuts/#top'
        },
        {
          text: '浏览器是如何校验证书的',
          link: 'https://cjting.me/2021/03/02/how-to-validate-tls-certificate/'
        },
        {
          text: '深入了解现代浏览器',
          link: 'https://mp.weixin.qq.com/s/XN9wUM-FdWbE1m66jkEgIg'
        },
        {
          text: 'WKWebView 加载生命周期与代理方法剖析',
          link: 'https://mp.weixin.qq.com/s/ZFui9IiMTWyLXGKZlbnzwQ'
        },
        {
          text: '走进 chrome 内心，了解 V8 引擎是如何工作的',
          link: 'https://segmentfault.com/a/1190000040331440'
        },
        {
          text: '实用 Chrome DevTool Tips',
          link: 'https://juejin.cn/post/6987752907579850765'
        },
        {
          text: 'Chrome 扩展如何影响浏览器性能的？',
          link: 'https://www.debugbear.com/blog/chrome-extension-performance-2021'
        },
        {
          text: '从前端视角看浏览器隐身模式下你是如何被追踪的',
          link: 'https://segmentfault.com/a/1190000040475726'
        },
        {
          text: '浏览器中的音视频知识总结',
          link: 'https://juejin.cn/post/7002288264413446157'
        }
      ]
    }
  ]
}

function system(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'M1 暴打 Intel？——这次的芯片有何不同',
      link: 'https://mp.weixin.qq.com/s/Krmx_mYpDdRGKzN3zs3mYw'
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
    },
    {
      text: '聊一聊二维码扫描登录原理',
      link: 'https://juejin.im/post/6844904111398191117'
    },
    {
      text: '如何搭建一套 “无痕埋点” 体系？',
      link: 'https://mp.weixin.qq.com/s/nJZk-0WtEW6C8mTeJCSUzQ'
    },
    {
      text: '前端水印实现方案',
      link: 'https://juejin.cn/post/6964357725652254734'
    },

    {
      text: '前端录制回放系统初体验',
      link: 'https://mp.weixin.qq.com/s/hmMnvwyLMzxkg0dqNNdI0Q'
    },
    {
      text: '软件工程的最大难题',
      link: 'http://www.ruanyifeng.com/blog/2021/05/scaling-problem.html'
    },
    {
      text: '你不可能知道的骨架屏玩法',
      link: 'https://juejin.cn/post/6994678354200756238'
    },
    {
      text: '关于鉴权，看懂这篇就够了',
      link: 'https://mp.weixin.qq.com/s/-Yf6a58H7WDB1luOORhDJw'
    }
  ]
}

function project(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '组件库按需加载原理分析',
      link: 'https://mp.weixin.qq.com/s/ty4IUtLlTgxdc8-7_UGyiQ'
    },
    {
      text: '手把手教你搭建一个无框架埋点体系',
      link: 'https://mp.weixin.qq.com/s/TcaOUBMBBEGQoQPAjYXb_Q'
    },
    {
      text: '一篇讲透自研的前端错误监控',
      link: 'https://juejin.cn/post/6987681953424080926'
    }
  ]
}

function work(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '如何做好项目 1 号位',
      link: '01_bitOne.md'
    },
    {
      text: '如何有效地进行代码 Review？',
      link: 'https://mp.weixin.qq.com/s/uFivYfX53s5zAe6hacznlg'
    },
    {
      text: '怎么让你的 Code Reviewer 喜欢上你',
      link: 'https://mtlynch.io/code-review-love/'
    },
    {
      text: '万字详文告诉你如何做 Code Review',
      link: 'https://mp.weixin.qq.com/s?__biz=MjM5ODYwMjI2MA==&mid=2649747120&idx=1&sn=b57e81735c6f6d5bdca31160792df547&scene=21#wechat_redirect'
    },
    {
      text: '万字详文阐释程序员修炼之道',
      link: 'https://mp.weixin.qq.com/s/XIwfj_AdZqX_vHM4VIq9EA'
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
    },
    {
      text: '程序员可能必读书单推荐',
      link: 'https://draveness.me//books-1'
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
        },
        {
          text: '第二周',
          link: '02_week.md'
        },
        {
          text: '第三周',
          link: '03_week.md'
        },
        {
          text: '第四周',
          link: '04_week.md'
        }
      ]
    }
  ]
}
