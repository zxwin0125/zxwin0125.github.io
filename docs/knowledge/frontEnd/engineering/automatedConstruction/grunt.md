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