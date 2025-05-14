---
title: Vue 组件间通信方式
order: 1
---

## 组件内状态管理流程

- Vue 中最核心的两个功能
  - 数据驱动
  - 组件化

> 使用基于组件化的开发，可以提高开发效率，带来更好的可维护性

- 组件的基本结构

```js
new Vue({
  // state
  data() {
    return {
      count: 0
    }
  },
  // view
  template: `
    <div>{{ count }}</div>
  `,
  // actions
  methods: {
    increment() {
      this.coun t++
    }
  }
})
```

> [!info]
> 单个组件内的状态管理
> - 每个组件内部都有自己的数据、模板、方法
>   - 数据可以称之为状态，每个组件内部都可以管理自己的内部状态
>   - 模板可以称之为视图，每个组件都有自己的视图
> - 把状态绑定到视图上呈现给用户，当用户和视图交互的时候，可能会更改状态
>   - 比如用户点击按钮的时候，让 count 的值发生变化
> - 当状态发生变化后，会自动更新到视图，更改状态的部分，可以叫做 action，也就是行为

> [!warning]
> 实际开发的过程中，可能多个组件都要共享状态<br>
> 状态管理其实就是通过状态集中管理和分发，解决多个组件共享状态的问题

## 状态管理的组成

> [!info]
> - state 状态
>   - 驱动应用的数据源
> - view 视图
>   - 通过把状态绑定到视图呈现给用户
> - actions 行为
>   - 用户和视图交互改变状态的方式

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Frame/Vue/33.png)

- 箭头是数据的流向，此处数据的流向是单向的
- 数据绑定到视图展示给用户，当用户和视图交互通过 actions 更改数据后，再把更改后的数据重新绑定到视图
- 单项的数据流程特别的清晰，但是多个组件共享数据的时候，会破坏这种简单的结构

## 组件间的通信方式

> 在大多数场景下，组件都并不是孤立存在的，而且多数情况下，组件都需要相互协作，共同构成一个复杂的业务功能

- 在 Vue 中，不同的组件关系提供了不同的通信规则
  - 父子组件传值
  - 不相关组件传值

![](https://cdn.jsdelivr.net/gh/zxwin0125/image-repo/img/Frame/Vue/34.png)

### 1. 父子组件传值

#### 1.1 父组件给子组件传值

- 子组件中通过 props 接收父组件传递的数据
- 父组件中调用子组件的时候，通过相应属性进行传值

```vue
<!-- child -->
<template>
  <div>
    <h1>Props Down Child</h1>
    <h2>{{ title }}</h2>
  </div>
</template>

<script>
export default {
  // props 有两种用法，数组或者对象，如果想约定传值的类型，可以使用对象的形式
  // props: ['title'],
  props: {
    title: String
  }
}
</script>
```

```vue
<!-- parent -->
<template>
  <div>
    <h1>Props Down Parent</h1>
    <child title="My journey with Vue"></child>
  </div>
</template>

<script>
import child from './01-Child'
export default {
  components: {
    child
  }
}
</script>
```

#### 1.2 子组件给父组件传值

- 在子组件中使用 `$emit` 发布一个自定义事件
- 在父组件中使用 v-on 监听这个自定义事件

```vue
<!-- child -->
<template>
  <div>
    <h1 :style="{ fontSize: fontSize + 'em' }">Props Down Child</h1>
    <button @click="handler">文字增大</button>
  </div>
</template>

<script>
export default {
  props: {
    fontSize: Number
  },
  methods: {
    handler () {
      // this 是当前子组件对象，也就是由子组件触发的自定义事件，当注册事件的时候也要给子组件来注册该事件
      this.$emit('enlargeText', 0.1) // 通过自定义事件把数据传递给父组件
    }
  }
}
</script>
```

```vue
<!-- parent -->
<template>
  <div>
    <h1 :style="{ fontSize: hFontSize + 'em'}">Event Up Parent</h1>

    这里的文字不需要变化

    <child :fontSize="hFontSize" v-on:enlargeText="enlargeText"></child>
    <child :fontSize="hFontSize" v-on:enlargeText="enlargeText"></child>
    <!-- 这个子组件在行内获取自定义事件传递数据的时候，直接通过 $event 来获取这个值 -->
    <child :fontSize="hFontSize" v-on:enlargeText="hFontSize += $event"></child>
  </div>
</template>

<script>
import child from './02-Child'
export default {
  components: {
    child
  },
  data () {
    return {
      hFontSize: 1
    }
  },
  methods: {
    // 因为在触发事件的时候传递了一个参数，所以这里的事件处理函数接收了该参数，也就是子组件把值传递给了父组件
    enlargeText (size) {
      this.hFontSize += size
    }
  }
}
</script>
```

> [!important]
> 子传父的核心是
> - 通过子组件触发事件的时候，携带参数
> - 然后在父组件中注册子组件内部触发的事件，并接收传递的数据，完成子向父的传值

> [!warning]
> 在注册事件的时候，行内可以通过 `$event` 来获取事件传递的参数，在事件处理函数中是不能这么使用的

### 2. 不相关组件传值

- 不相关组件的通信也是使用自定义事件的方式
- 但是和子给父传值不同的是，因为没有父子关系，所以不能再由子组件触发事件传值，所以这里需要使用 event bus

```js
import Vue from 'vue'
export default new Vue()
```

```vue
<!-- sibling01 -->
<template>
  <div>
    <h1>Event Bus Sibling01</h1>
    <div class="number" @click="sub">-</div>
    <input type="text" style="width: 30px; text-align: center" :value="value">
    <div class="number" @click="add">+</div>
  </div>
</template>

<script>
import bus from './eventbus'

export default {
  props: {
    num: Number
  },
  created () {
    this.value = this.num
  },
  data () {
    return {
      value: -1
    }
  },
  methods: {
    sub () {
      if (this.value > 1) {
        this.value--
        bus.$emit('numchange', this.value)
      }
    },
    add () {
      this.value++
      bus.$emit('numchange', this.value)
    }
  }
}
</script>

<style>
.number {
  display: inline-block;
  cursor: pointer;
  width: 20px;
  text-align: center;
}
</style>
```

```vue
<!-- sibling02 -->
<template>
  <div>
    <h1>Event Bus Sibling02</h1>

    <div>{{ msg }}</div>
  </div>
</template>

<script>
import bus from './eventbus'
export default {
  data () {
    return {
      msg: ''
    }
  },
  created () {
    bus.$on('numchange', (value) => {
      this.msg = `您选择了${value}件商品`
    })
  }
}
</script>
```

- 创建一个公共的 Vue 实例作为事件总线或者事件中心
- 核心还是使用自定义事件传递数据




### 3. 通过 ref 获取子组件

- 组件的通信方式还有很多
  - $root
  - $parent
  - $children
  - $refs

#### 3.1 ref 两个作用

- 在普通的 HTML 标签上使用 ref，获取到的是 DOM 对象
- 在组件的标签上使用 ref，获取到的就是组件对象

```vue
<!-- child -->
<template>
  <div>
    <h1>ref Child</h1>
    <input ref="input" type="text" v-model="value">
  </div>
</template>

<script>
export default {
  data () {
    return {
      value: ''
    }
  },
  methods: {
    focus () {
      this.$refs.input.focus()
    }
  }
}
</script>
```

```vue
<!-- parent -->
<template>
  <div>
    <h1>ref Parent</h1>

    <child ref="c"></child>
  </div>
</template>

<script>
import child from './04-Child'
export default {
  components: {
    child
  },
  mounted () {
    this.$refs.c.focus()
    this.$refs.c.value = 'hello input'
  }
}
</script>
```

> [!warning]
> 注意这种方式不在万不得已的情况下不要使用<br>
> 如果滥用这种方式的话，会导致数据管理的混乱