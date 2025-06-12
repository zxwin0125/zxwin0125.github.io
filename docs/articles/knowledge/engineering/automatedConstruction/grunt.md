---
title: Grunt
date: 2021-03-01
order: 2
---

## Grunt 基本使用

- 创建新项目

```bash
yarn init --yes
```

- 安装 grunt

```bash
yarn add grunt
```

- 项目根目录下添加一个 gruntfile.js 文件

> [!info]
> gruntfile.js 是 Grunt 的入口文件，用于定义一些需要 Grunt 自动执行的任务，需要导出一个函数，此函数接收一个 grunt 的对象类型的形参，grunt 对象中提供一些创建任务时会用到的 API

## Grunt 注册任务

- 调用 grunt 对象中的 registerTask 方法注册任务

```javascript
module.exports = grunt => {
  // registerTask 方法第一个参数指定任务名称，第二个参数可以指定任务函数，任务发生时自动执行的函数
  grunt.registerTask('foo', () => {
    console.log('hello grunt')
  })

  // registerTask 方法第二个参数是字符串时，这个字符串会成为这个任务的描述，会出现在 grunt 的帮助信息中
  grunt.registerTask('bar', '任务描述', () => {
    console.log('other task')
  })
}
```

- 如果任务名称是 default 时，这个任务是默认任务，运行时就不需要指定名称，grunt 自动执行 default

```javascript
module.exports = grunt => {
  // default 是默认任务名称
  // 通过 grunt 执行时可以省略
  grunt.registerTask('default', () => {
    console.log('default task')
  })
}
```

- 如果第二个参数是数组，可以指定此任务的映射任务，这样执行 default 就相当于执行对应的任务
- 这里映射的任务会按顺序依次执行，不会同时执行

```javascript
module.exports = grunt => {
  grunt.registerTask('default', ['foo', 'bar'])
}
```

- 也可以在任务函数中执行其他任务

```javascript
module.exports = grunt => {
  grunt.registerTask('run-other', () => {
    // foo 和 bar 会在当前任务执行完成过后自动依次执行
    grunt.task.run('foo', 'bar')
    console.log('current task runing~')
  })
}
```

- grunt 默认支持同步模式，若要支持异步模式，必须使用 this.async() 得到一个回调函数，异步操作完成后调用 done 回调函数

```javascript
module.exports = grunt => {
  // 由于函数体中需要使用 this，所以这里不能使用箭头函数
  grunt.registerTask('async-task', function () {
    const done = this.async()
    setTimeout(() => {
      console.log('async task working~')
      done()
    }, 1000)
  })
}
```

## Grunt 标记任务失败

- 如果在构建任务的逻辑代码中发生错误，例如需要的文件找不到了，那就可以把这个任务标记为一个失败任务
- 可以在函数体中通过 return false 来实现

```javascript
module.exports = grunt => {
  grunt.registerTask('bad', () => {
    console.log('bad working~')
    return false
  })
}
```

- 如果一个任务列表中的某个任务执行失败，则后续任务默认不会运行，除非 grunt 运行时指定 `--force` 参数强制执行

```javascript
module.exports = grunt => {
  grunt.registerTask('default', ['foo', 'bad', 'bar'])
}
```

- 异步函数中标记当前任务执行失败的方式是为回调函数指定一个 false 的实参

```javascript
module.exports = grunt => {
  grunt.registerTask('bad-async', function () {
    const done = this.async()
    setTimeout(() => {
      console.log('async task working~')
      done(false)
    }, 1000)
  })
}
```

## Grunt 的配置方法

- grunt 提供的 initConfig 方法去添加一些配置选项
- 例如使用 grunt 帮我们压缩文件时可以通过这种方式去配置需要压缩的文件路径

```javascript
module.exports = grunt => {
  grunt.initConfig({
    // 键一般对应任务的名称
    // 值可以是任意类型的数据
    foo: {
      bar: 'baz'
    }
  })

  grunt.registerTask('foo', () => {
    // 任务中可以使用 grunt.config() 获取配置
    console.log(grunt.config('foo'))
    // 如果属性值是对象的话，config 中可以使用点的方式定位对象中属性的值
    console.log(grunt.config('foo.bar'))
  })
}
```

## Grunt 多目标任务

- 除了普通的任务形式以外，Grunt 中还支持叫多目标模式的任务
- 可以理解为子任务概念，后续通过 Grunt 实现各种构建任务时非常有用

```javascript
module.exports = grunt => {
  // 多目标模式，可以让任务根据配置形成多个子任务

  // grunt.initConfig({
  //   build: {
  //     foo: 100,
  //     bar: '456'
  //   }
  // })

  // grunt.registerMultiTask('build', function () {
  //   console.log(`task: build, target: ${this.target}, data: ${this.data}`)
  // })

  grunt.initConfig({
    build: {
      // 会作为任务的配置(不会作为task )
      options: {
        msg: 'task options'
      },
      foo: {
        // 会合并任务配置中的 options，如果存在相同属性，会覆盖
        options: {
          msg: 'foo target options'
        }
      },
      bar: '456'
    }
  })

  grunt.registerMultiTask('build', function () {
    console.log(this.options())
  })
}
```

1. 多目标模式的任务需要通过 Grunt 的 registerMultiTask 方法去定义

- 参数1：任务名称
- 参数2：函数，仍然是任务执行中所需要做的事情

2. 需要为多目标任务配置不同的目标，通过 grunt.initConfig 方法 去配置

- 这个方法的参数对象中需要指定一个与任务名称同名的属性「build」 ，属性值也是对象，对象中每一个属性名就是 目标 build 的目标名称

3. `yarn grunt build` 后发现它执行了两个目标

- 运行其中一个的方式：`yarn grunt build:css`

4. 任务函数中可以通过 this 拿到当前任务目标的名称和配置数据 （this.target 和 this.data）
5. options 中的信息会作为任务的配置选项，它不会成为目标（ 任务函数中可以通过 this.option() 拿到 ）
6. 在目标中也可以配置 options，会覆盖父对象的 options

## Grunt 插件的使用

- 插件是 Grunt 的核心，因为很多构建任务都是通用的，社区中出现了很多插件，当中封装了一些通用的构建任务，一般构建过程都是由这些通用的构建任务组成的
- 基本步骤
  - npm 安装这个插件，再到 gruntfile.js 中去载入这个插件提供的任务，最后根据插件文档完成相关的配置选项

### grunt-contrib-clean

- 比如使用一下 grunt-contrib-clean 插件来尝试一下（清除我们在项目开发过程中产生的临时文件）：
  - 安装：`yarn add grunt-contrib-clean`
  - 使用 grunt.loadNpmTask 方法去加载一下这个插件中提供的一些任务
  - 绝大多下情况下，grunt 插件的命名规范都是 `grunt-contrib-< name>`,所以 grunt-contrib-clean 插件提供的任务名称就是 clean
  - 直接运行 yarn grunt clean 会报出错误，因为 clean 是一个多目标任务，需要通过 initConfig 添加配置选项去配置不同的目标

```javascript
module.exports = grunt => {
  grunt.initConfig({
    clean: {
      // temp: 'temp/app.js'
      // temp: 'temp/*.txt'
      temp: 'temp/**'
    }
  })

  grunt.loadNpmTasks('grunt-contrib-clean')
}
```

### grunt-sass 插件

- grunt-sass 是一个 npm 模块，它在内部通过 npm 形式依赖 sass，所以需要 sass 模块支持

```bash
yarn add grunt-sass sass --dev
```

```javascript
const sass = require('sass')
module.exports = grunt => {
  grunt.initConfig({
    sass: {
      main: {
        options: {
          sourceMap: true,
          implementation: sass
        },
        // 通过 files 属性指定输入输出的方式
        files: {
          'dist/css/main.css': 'src/sass/main.scss'
        }
      }
    }
  })

  grunt.loadNpmTasks('grunt-sass')
}
```

### grunt-babel 插件

- grunt 也需要依赖 babel 的核心模块和预设，有了这三个模块后就可以在 gruntfile.js 中使用 babel 的一些任务了

```bash
yarn add grunt-babel @babel-core @babel-preset-env --dev
```

```javascript
module.exports = grunt => {
  grunt.initConfig({
    babel: {
      main: {
        // 设置 babel 转换时候的 preset
        // babel 作为 ECMAScript 最新特性的转换，支持转换部分特性，preset 意思是我们需要转换哪些特性，它把一系列的特性打包形成 preset
        // env 默认根据最新的 es 特性做转换
        options: {
          sourceMap: true,
          presets: ['@babel/preset-env']
        },
        files: {
          'dist/js/app.js': 'src/js/app.js'
        }
      }
    }
  })
  grunt.loadNpmTasks('grunt-babel')
}
```

### grunt-contrib-watch 插件

- 当文件修改成后自动编译

```javascript
module.exports = grunt => {
  grunt.initConfig({
    watch: {
      js: {
        files: ['src/js/*.js'], // 监控哪些文件的变化
        tasks: ['babel'] // 文件的变化后需要执行什么任务
      },
      css: {
        files: ['src/sass/*.scss'],
        tasks: ['sass']
      }
    }
  })
  grunt.loadNpmTasks('grunt-watch')

  // watch 启动后并不会直接执行 sass、babel 任务，只是会监视文件，当文件发生变化后才会去执行对应的任务
  // 需要做一层映射
  grunt.registerTask('default', ['sass', 'babel', 'watch'])
}
```

### load-grunt-tasks 插件

- 自动加载所有的 grunt 插件中的任务

```javascript
const loadGruntTasks = require('load-grunt-tasks')

module.exports = (grunt) => {
  ...
  // grunt.loadNpmTasks('grunt-sass')
  loadGruntTasks(grunt) // 自动加载所有的 grunt 插件中的任务
}
```
