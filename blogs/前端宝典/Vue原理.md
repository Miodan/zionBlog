---
title: Vue原理
date: 2022-01-01
tags:
 - Vue
categories:
 - 前端
---
# 一、Vue 基础

## 1. 简述 Vue 的响应式原理

Vue.js 是采用**数据劫持**结合**观察者模式**的方式，通过`Object.defineProperty()`来劫持各个属性的setter，getter，在数据变动时发布消息给观察者，触发相应的监听回调，Vue相应系统有三大核心：`observe`,`dep`,`watcher`。主要分为以下几个步骤：

- `Observe`：当一个Vue实例创建时，`initData`阶段，vue会遍历data选项的属性（observe），用 Object.defineProperty 将它们转为 getter/setter并且在内部追踪相关依赖(dep)，在属性被访问和修改时通知变化。
- `Compile`：调用`compile`方法解析模版,当视图中有用到vue.data中数据的时候，会调用实例化`watcher`方法进行依赖收集
- `Watcher`：是`Observer`和`Compile`之间通信的桥梁，当视图中遇到绑定的数据时，在watcher方法中会获取这个数据，此时会触发observe中的getter方法。当属性变动 `dep.notice()` 通知时，调用自身的 `update` 方法，并触发 `Compile` 中绑定的回调。
- `Dep`：发布订阅模式,`observe`中数据的`getter`被触发时会收集依赖的watcher(dep.depend方法)
- 当有数据被改动时会触发`observe`中数据的`setter`，此时会调用`dep.notify`方法给所有订阅的`watcher`发通知（通过回调方式）进行视图更新，此时会进行`diff`流程。

![image-20210903205904601](https://636c-cloud1-7g4dud13a1b0dc04-1305490742.tcb.qcloud.la/image-20210903205904601.png?sign=68e06a1efa72b8180e662a780c780ae4&t=1641038473)

> **另外的理解：**
>
> 当一个 Vue 实例创建时，Vue会**遍历** data 中的属性，用 Object.defineProperty（vue3.0使用proxy ）将它们**转为** getter/setter，并且在<u>内部追踪相关依赖</u>，在属性被访问和修改时**通知**变化。 每个组件实例都有相应的 watcher 程序实例，它会在组件渲染的过程中把属性**记录**为依赖，之后当依赖项的setter被调用时，会通知watcher重新计算，从而致使它关联的组件得以更新。



## 2. 使用 Object.defineProperty() 进行数据劫持有什么缺点？

`Object.defineProperty` 缺点：

1. 无法监听数组的变化，因此 vue 中是在 `Array` 的方法上增加拦截器（对方法重写）【<u>这个不是 defineProperty 的缺点</u>，只是 vue 为了减少性能消耗才这样做的】
2. 只能劫持对象的属性，因此我们需要对每个对象的每个属性进行遍历，如果属性值是一个对象那么需要深度遍历。
3. 无法监听新增或者删除的属性，只能监听已经存在的响应式数据



**vue3 为什么要用 proxy？**

1. proxy 可以直接监听数组的变化；
2. proxy 可以监听对象而非属性，它在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写；
3. proxy 直接可以劫持整个对象，并返回一个新对象；
4. proxy 唯一的问题就是兼容性问题，因为 proxy 是 es6 语法，而且无法用 polyfill 实现。



## 3. MVVM、MVC、MVP 的区别

### MVC

MVC 通过分离 Model、View 和 Controller 的方式来组织代码结构。其中 view 负责用户界面的显示，model 负责存储数据，controller 负责业务逻辑。

![image-20210904133018067](https://636c-cloud1-7g4dud13a1b0dc04-1305490742.tcb.qcloud.la/image-20210904133018067.png?sign=972fea5688529390222b59d6f7995553&t=1641116836)

1. view 传送指令到  controller
2. controller 完成业务逻辑后，要求 model 改变状态
3. model 将新的数据发送到 view，用户得到反馈



### MVP

MVP 模式将 controller 改名为 Presenter，同时改变了通信方向。

![image-20210904133253293](https://636c-cloud1-7g4dud13a1b0dc04-1305490742.tcb.qcloud.la/image-20210904133253293.png?sign=72617d8127f5176a9d528cc807bddd4e&t=1641039547)

1. 各部分之间的通信，都是双向的。
2. view 与 model 不发生联系，都通过 presenter 传递（对 view 和 model 层进行解耦）。
3. view 非常薄，不部署任何业务逻辑，称为“被动视图”（Passive View），即没有任何主动性，而 Presenter 非常厚，所有逻辑都部署在那里。



### MVVM

MVVM 模式将 Presenter 改名为 ViewModel，基本上与 MVP 模式完全一致。**model** 代表数据模型，数据和业务逻辑都在 model 层中定义；**view** 代表 ui 视图，负责数据的展示；**viewmodel** 负责监听 model 中数据的改变并且控制视图的更新，处理用户交互操作。

![image-20210904140615710](https://636c-cloud1-7g4dud13a1b0dc04-1305490742.tcb.qcloud.la/image-20210904140615710.png?sign=9afa7fe9c04cefdd12dcb3e6e7abc320&t=1641039513)

唯一的区别是，它采用双向绑定（data-binding）：View的变动，自动反映在 ViewModel，反之亦然。这种模式**实现了 Model和View的数据自动同步**，因此开发者只需要专注于数据的维护操作即可，而不需要自己操作DOM。



**优点:**

- **低耦合**：`View`可以独立于`Model`变化和修改,一个`ViewModel`可以绑定到不同的`View`上,当`View`变化的时候`Model`可以不变,当`Model`变化的时候`View`也可以不变。
- **可重用性**：可以把一些视图逻辑放在一个`ViewModel`里面,让很多`View`重用这段视图逻辑。
- **独立开发**：开发人员可以专注于业务逻辑和数据的开发,设计人员可以专注于页面的设计。
- **可测试**：界面素来是比较难于测试的，而现在测试可以针对 `ViewModel` 来写。



**MVVM 和 MVC 的区别**

MVC和MVVM的区别并不是VM完全取代了C，ViewModel存在目的在于抽离Controller中展示的业务逻辑，而不是替代Controller，其它视图操作业务等还是应该放在Controller中实现。也就是说MVVM实现的是业务逻辑组件的重用。

- MVC中Controller演变成MVVM中的ViewModel
- MVVM通过数据来显示视图层而不是节点操作
- MVVM主要解决了MVC中大量的dom操作使页面渲染性能降低,加载速度变慢,影响用户体验



那么问题来了 为什么官方要说 Vue 没有完全遵循 MVVM 思想呢？

> 严格的 MVVM 要求 View 不能和 Model 直接通信，而 Vue 提供了$refs 这个属性，让 Model 可以直接操作 View，违反了这一规定，所以说 Vue 没有完全遵循 MVVM。



## 4. Computed 和 Watch 的区别

**computed**

1. 它<u>支持缓存</u>，只有依赖的数据发生了变化，才会重新计算
2. <u>不支持异步</u>，当Computed中有异步操作时，无法监听数据的变化
3. computed的值会<u>默认走缓存</u>，计算属性是基于它们的响应式依赖进行缓存的，也就是基于data声明过，或者父组件传递过来的props中的数据进行计算的。
4. 如果一个属性是由其他属性计算而来的，这个属性<u>依赖</u>其他的属性，一般会使用computed
5. 如果computed属性的属性值是函数，那么默认使用get方法，函数的返回值就是属性的属性值；在computed中，属性有一个get方法和一个set方法，当数据发生变化时，会调用set方法。

**watch：**

1. 它<u>不支持缓存</u>，数据变化时，它就会触发相应的操作
2. <u>支持异步</u>监听
3. 监听的函数接收两个参数，第一个参数是最新的值，第二个是变化之前的值
4. 当一个属性发生变化时，就需要<u>执行相应的操作</u>
5. 监听数据必须是data中声明的或者父组件传递过来的props中的数据，当发生变化时，会触发其他操作，函数有两个的参数：
   1. immediate：组件加载立即触发回调函数
   2. deep：深度监听，发现数据内部的变化，在复杂数据类型中使用，例如数组中的对象发生变化。需要注意的是，deep无法监听到数组和对象内部的变化。

当想要执行异步或者昂贵的操作以响应不断的变化时，就需要使用watch。



**总结：**

- computed 计算属性 : **依赖**其它属性值，并且 computed 的值有**缓存**，只有它依赖的属性值发生改变，下一次获取 computed 的值时才会重新计算 computed 的值。 
- watch 侦听器 : 更多的是**观察**的作用，**无缓存性**，类似于某些数据的监听回调，每当监听的数据变化时都会执行回调进行后续操作。 



- **总结：**

  - computed 计算属性 : **依赖**其它属性值，并且 computed 的值有**缓存**，只有它依赖的属性值发生改变，下一次获取 computed 的值时才会重新计算 computed 的值。 
  - watch 侦听器 : 更多的是**观察**的作用，**无缓存性**，类似于某些数据的监听回调，每当监听的数据变化时都会执行回调进行后续操作。
- 。 



### computed 设计思路

1. 他的值是一个函数的运行结果；

2. 函数里用到的所有属性都会引起计算属性的变化；

   > 计算属性仍然属性 Vue 响应式实现的一种，本质上还是一个 watcher，但是又似乎与之前的 watcher 实现有所不同，因为之前的 watcher 是只能监听一个属性；
   >
   > **思路**：watcher 第二个参数 exp 也可以传一个函数，然后运行这个函数并获取返回值，运行过程中，函数里所有的 this.xxx 属性都会触发 setter，这样一来就可以让多个 dep 都能收集到这个 watcher。

3. 计算属性不存在 data 选项中，需要单独进行初始化；

4. 计算属性只能取，不能存，也就是说计算属性的 setter 无效；

5. 计算属性是惰性的：计算属性依赖的其他属性发生变化时，计算属性不会立即重新计算，要等到对获取计算属性的值，也就是求值时才会重新计算；

6. 计算属性是缓存的：如果计算属性的依赖的其他属性没有发生变化，即使重新对计算属性求值，也不会重新计算计算属性。

   > **5 和 6 思路**：给 computed 相关的 watcher 打一个标记 this.lazy = true，代表这个是一个 lazy.watcher，当 dep 通知 watcher 进行更新时，如果是 lazy watcher，则只会给自己一个标记 this.dirty = true，等到对计算属性进行求值时，如果 watcher 的 dirty \=== true 则会对 watcher 进行求值，并且把得到的值保存在 watcher 实例上（watcher.value)，如果 watcher 的 dirty \=== false 则直接返回 watcher.value。



## 5. computed 和 methods 的区别

1. computed 是属性调用，而 methods 是函数调用；
2. computed 带有缓存功能，而 methods 不是；
3. computed 不支持异步
4. computed 是响应式的，methods 不是响应式的



## 6. slot 是什么？有什么作用？原理是什么？

**slot 是什么**

slot又名插槽，是Vue的内容分发机制，组件内部的模板引擎使用slot元素作为承载分发内容的出口。插槽slot是子组件的一个模板标签元素，而这一个标签元素是否显示，以及怎么显示是由父组件决定的。

slot又分三类，默认插槽，具名插槽和作用域插槽。

- 默认插槽：又名匿名查抄，当slot没有指定name属性值的时候一个默认显示插槽，一个组件内只有有一个匿名插槽。
- 具名插槽：带有具体名字的插槽，也就是带有name属性的slot，一个组件可以出现多个具名插槽。
- 作用域插槽：默认插槽、具名插槽的一个变体，可以是匿名插槽，也可以是具名插槽，该插槽的不同点是在子组件渲染作用域插槽时，可以将子组件内部的数据传递给父组件，让父组件根据子组件的传递过来的数据决定如何渲染该插槽。



**作用**

<u>通过插槽可以让用户可以拓展组件，去更好地复用组件和对其做定制化处理</u>

如果父组件在使用到一个复用组件的时候，获取这个组件在不同的地方有少量的更改，如果去重写组件是一件不明智的事情

通过`slot`插槽向组件内部指定位置传递内容，完成这个复用组件在不同场景的应用

比如布局组件、表格列、下拉选、弹框显示内容等



**原理**

`slot`本质上是返回`VNode`的函数，当子组件vm实例化时，获取到父组件传入的slot标签的内容，存放在`vm.$slot`中，默认插槽为`vm.$slot.default`，具名插槽为`vm.$slot.xxx`，xxx 为插槽名，当组件执行渲染函数时候，遇到slot标签，使用`$slot`中的内容进行替换，此时可以为插槽传递数据，若存在数据，则可称该插槽为作用域插槽。



## 7. 过滤器的作用，如何实现一个过滤器

### 概念

过滤器是将不必要的东西过滤掉。**实质**<u>不改变原始数据，只是对数据进行加工处理后返回过滤后的数据再进行调用处理</u>，我们也可以理解其为一个纯函数。

ps：Vue3 已经废弃 filter

> 原因可能是 vue3 要精简代码，而且 filter 功能重复，filter 能实现的功能，methods 和计算属性基本上也能够实现。



### 如何用

`vue`中的过滤器可以用在两个地方：双花括号插值和 `v-bind` 表达式，过滤器应该被添加在 `JavaScript`表达式的尾部，由“管道”符号指示：

```vue
<!-- 在双花括号中 -->
{{ message | capitalize }}

<!-- 在 `v-bind` 中 -->
<div v-bind:id="rawId | formatId"></div>
```



**本地过滤器**

```js
filters: {
  capitalize: function (value) {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
  }
}
```

**全局过滤器**

```js
Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

new Vue({
  // ...
})
```

注意：当全局过滤器和局部过滤器重名时，会采用局部过滤器

**过滤器可以串联：**

```vue
{{ message | filterA | filterB }}
```

**过滤器是 `JavaScript`函数，因此可以接收参数：**

```js
{{ message | filterA('arg1', arg2) }}
```



**小结**

1. 局部过滤器优先于全局过滤器被调用
2. 一个表达式可以使用多个过滤器。过滤器之间需要用管道符号 “|” 隔开。其执行顺序从左往右
3. 过滤器是 js 函数，可以接收多个参数



### 使用场景

1. 需要格式化数据的情况，比如需要处理时间、价格等数据格式的输出 / 显示。
2. 比如后端返回一个 **年月日的日期字符串**，前端需要展示为 **多少天前** 的数据格式，此时就可以用`fliters`过滤器来处理数据。



### 原理分析

1. 在编译阶段通过`parseFilters`将过滤器编译成函数调用（串联过滤器则是一个嵌套的函数调用，前一个过滤器执行的结果是后一个过滤器函数的参数）
2. 编译后通过调用`resolveFilter`函数找到对应过滤器并返回结果
3. 执行结果作为参数传递给`toString`函数，而`toString`执行后，其结果会保存在`Vnode`的`text`属性中，渲染到视图



## 8. 常见的事件修饰符及其作用

在`Vue`中，修饰符处理了<u>许多`DOM`事件的细节</u>，让我们不再需要花大量的时间去处理这些烦恼的事情，而能有更多的精力<u>专注于程序的逻辑处理</u>。

`vue`中修饰符分为以下五种：

- 表单修饰符
- 事件修饰符
- 鼠标按键修饰符
- 键值修饰符
- v-bind修饰符



### 修饰符的作用

1. **表单修饰符**

   1. lazy

      > 在我们填完信息，光标离开标签的时候，才会将值赋予给`value`，也就是在`change`事件之后再进行信息同步

      ```vue
      <input type="text" v-model.lazy="value">
      <p>{{value}}</p>
      ```

   2. trim

      > 自动过滤用户输入的首空格字符，而中间的空格不会过滤

      ```vue
      <input type="text" v-model.trim="value">
      ```

   3. number

      > 自动将用户的输入值转为数值类型，但如果这个值无法被`parseFloat`解析，则会返回原来的值

      ```vue
      <input v-model.number="age" type="number">
      ```

2. **事件修饰符**

   事件修饰符是对事件捕获以及目标进行了处理

   1. stop，阻止事件冒泡，相当于调用了 event.stopPropagation 方法

      ```vue
      <div @click="shout(2)">
        <button @click.stop="shout(1)">ok</button>
      </div>
      //只输出1
      ```

   2. prevent，阻止了事件的默认行为，相当于调用了`event.preventDefault`方法

      ```vue
      <form v-on:submit.prevent="onSubmit"></form>
      ```

   3. self，只当在 `event.target` 是当前元素自身时触发处理函数

      ```vue
      <div v-on:click.self="doThat">...</div>
      ```

   4. once，绑定了事件以后只能触发一次，第二次就不会触发

      ```vue
      <button @click.once="shout(1)">ok</button>
      ```

   5. capture，使事件触发从包含这个元素的顶层开始往下触发

      ```vue
      <div @click.capture="shout(1)">
          obj1
      <div @click.capture="shout(2)">
          obj2
      <div @click="shout(3)">
          obj3
      <div @click="shout(4)">
          obj4
      </div>
      </div>
      </div>
      </div>
      // 输出结构: 1 2 4 3 
      ```

   6. passive，在移动端，当我们在监听元素滚动事件的时候，会一直触发`onscroll`事件会让我们的网页变卡，因此我们使用这个修饰符的时候，相当于给`onscroll`事件整了一个`.lazy`修饰符

      ```vue
      <!-- 滚动事件的默认行为 (即滚动行为) 将会立即触发 -->
      <!-- 而不会等待 `onScroll` 完成  -->
      <!-- 这其中包含 `event.preventDefault()` 的情况 -->
      <div v-on:scroll.passive="onScroll">...</div>
      ```

      > 不要把 `.passive` 和 `.prevent` 一起使用,因为 `.prevent` 将会被忽略，同时浏览器可能会向你展示一个警告。
      >
      > `passive` 会告诉浏览器你不想阻止事件的默认行为

   7. native，让组件变成像`html`内置标签那样监听根元素的原生事件，否则组件上使用 `v-on` 只会监听自定义事件

      ```vue
      <my-component v-on:click.native="doSomething"></my-component>
      ```

      > 使用.native修饰符来操作普通HTML标签是会令事件失效的

3. **鼠标按钮修饰符**

   鼠标按钮修饰符针对的就是左键、右键、中键点击

   ```vue
   <button @click.left="shout(1)">ok</button>
   <button @click.right="shout(1)">ok</button>
   <button @click.middle="shout(1)">ok</button>
   ```

4. **键盘修饰符**

   键盘修饰符是用来修饰键盘事件（`onkeyup`，`onkeydown`）的，有如下：

   `keyCode`存在很多，但`vue`为我们提供了别名，分为以下两种：

   - 普通键（enter、tab、delete、space、esc、up...）
   - 系统修饰键（ctrl、alt、meta、shift...）

   ```vue
   // 只有按键为keyCode的时候才触发
   <input type="text" @keyup.keyCode="shout()">
   // 还可以通过以下方式自定义一些全局的键盘码别名
   Vue.config.keyCodes.f2 = 113
   ```

5. **v-bind 修饰符**

   v-bind修饰符主要是为属性进行操作

   1. sync，能对`props`进行一个双向绑定

      ```js
      //父组件
      <comp :myMessage.sync="bar"></comp> 
      //子组件
      this.$emit('update:myMessage',params);
      
      // 以上这种方法相当于以下的简写
      
      //父亲组件
      <comp :myMessage="bar" @update:myMessage="func"></comp>
      func(e){
       this.bar = e;
      }
      //子组件js
      func2(){
        this.$emit('update:myMessage',params);
      }
      ```

      使用`async`需要注意以下两点：

      - 使用`sync`的时候，子组件传递的事件名格式必须为`update:value`，其中`value`必须与子组件中`props`中声明的名称完全一致
      - 注意带有 `.sync` 修饰符的 `v-bind` 不能和表达式一起使用
      - 将 `v-bind.sync` 用在一个字面量的对象上，例如 `v-bind.sync=”{ title: doc.title }”`，是无法正常工作的

   2. props，设置自定义标签属性，避免暴露数据，防止污染HTML结构

      ```vue
      <input id="uid" title="title1" value="1" :index.prop="index">
      ```

   3. camel，将命名变为驼峰命名法，如将`view-Box`属性名转换为 `viewBox`

      ```vue
      <svg :viewBox="viewBox"></svg>
      ```



### 应用场景

根据每一个修饰符的功能，我们可以得到以下修饰符的应用场景：

- .stop：阻止事件冒泡
- .native：绑定原生事件
- .once：事件只执行一次
- .self ：将事件绑定在自身身上，相当于阻止事件冒泡
- .prevent：阻止默认事件
- .caption：用于事件捕获
- .once：只触发一次
- .keyCode：监听特定键盘按下
- .right：右键



## 9. v-if、v-show、v-html 的原理

- v-if 会调用 addIfCondition 方法，生成 vnode 的时候<u>会忽略对应节点</u>，render 的时候就不会渲染；
- v-show 会生成 vnode，render 的时候也<u>会渲染成真实节点</u>，只是在render 过程中会在节点的属性中<u>修改</u> show 属性值，也就是常说的display； 
- v-html 会<u>先移除节点下的所有节点，调用 html 方法，通过 addProp 添加 innerHTML 属性</u>，归根结底还是设置 innerHTML 为 v-html 的值。



## 10. v-if 和 v-show 的区别

- **控制手段**：`v-show`隐藏则是为该元素添加`css--display:none`，`dom`元素依旧还在。`v-if`显示隐藏是将`dom`元素整个添加或删除
- **编译过程**：`v-if`切换有一个局部编译/卸载的过程，切换过程中合适地销毁和重建内部的事件监听和子组件；`v-show`只是简单的基于css切换
- **编译条件**：`v-if`是真正的条件渲染，它会确保在切换过程中条件块内的事件监听器和子组件适当地被销毁和重建。只有渲染条件为假时，并不做操作，直到为真才渲染
  - `v-show` 由`false`变为`true`的时候不会触发组件的生命周期
  - `v-if`由`false`变为`true`的时候，触发组件的`beforeCreate`、`create`、`beforeMount`、`mounted`钩子，由`true`变为`false`的时候触发组件的`beforeDestory`、`destoryed`方法
- **性能消耗**：`v-if`有更高的切换消耗；`v-show`有更高的初始渲染消耗；
- **使用场景**：v-if适合在运行时条件很少改变；v-show适合频繁切换。



## 11. v-model 是如何实现的，语法糖实际是什么？

**语法糖：**它是一个对某种复杂功能代码的包装（或计算机语言中添加的某种语法），对外提供简单易用的使用方法，更方便程序员使用，增加代码的可读性，减少代码出错的机会。



**v-model** 其实是个语法糖，它实际上做了两步动作：

1. 绑定数据 value
2. 触发输入事件 input

```vue
<input :value="message" @input="message=$evnet.target.value"/>
```



## 12. v-model 可以被用在自定义组件上吗？如果可以，如何使用？

**可以**

```vue
<Child v-model="message" />
// 代码与下面等同
<Child :value="message" @input="message = $event.target.value"/>
```



## 13. data 为什么是一个函数而不是对象

1. **根实例对象 `data`** 可以是对象也可以是函数（根实例是单例），不会产生数据污染情况。
2. **组件实例对象 `data`** 必须为函数，**目的**是为了防止多个组件实例对象之间共用一个 `data`，产生数据污染。采用函数的形式，`initData `时会将其作为工厂函数都会返回全新 `data` 对象。
3. vue 组件主要是用来复用的，因此它可能有多个实例，如果 data 是对象，那么每个 vue 组件实例引用的都是同一个 data，造成一改全改的问题；而如果采用函数则回返回一个全新 data 形式，使每个实例对象的数据不会收到其他实例对象数据的污染。



## 14. 对 keep-alive 的理解，它是如何实现的，具体缓存的是什么？

keep-alive是vue中的内置组件，能在组件切换过程中**将状态保留在内存中，防止重复渲染DOM**。

keep-alive 包裹动态组件时，**会缓存不活动的组件实例，而不是销毁它们**。

keep-alive可以设置以下props属性：

- include - 字符串或正则表达式。只有名称匹配的组件会被缓存
- exclude - 字符串或正则表达式。任何名称匹配的组件都不会被缓存
- max - 数字。最多可以缓存多少组件实例

**基本用法**

```vue
<keep-alive>
  <component :is="view"></component>
</keep-alive>
```

设置了 keep-alive 缓存的组件，会多出两个生命周期钩子（activated与deactivated）：

- 首次进入组件时：beforeRouteEnter > beforeCreate > created> mounted > activated > … … > beforeRouteLeave > deactivated
- 再次进入组件时：beforeRouteEnter >activated > … … > beforeRouteLeave > deactivated



**keep-alive 的实现**

1. 获取 keep-alive 下第一个子组件的实例对象，通过他去获取这个组件的组件名
2. 通过当前组件名去匹配原来 include 和 exclude，判断当前组件是否需要缓存，不需要缓存，直接返回当前组件的实例vNode
3. 需要缓存，判断他当前是否在缓存数组里面：

- 存在，则将他原来位置上的 key 给移除，同时将这个组件的 key 放到数组最后面（LRU）
- 不存在，将组件 key 放入数组，然后判断当前 key数组是否超过 max 所设置的范围，超过，那么削减未使用时间最长的一个组件的 key 。最后将这个组件的 keepAlive 设置为 true



**缓存策略**

LRU（least recently used）最近使用最少算法。

![image-20210806135922048](https://636c-cloud1-7g4dud13a1b0dc04-1305490742.tcb.qcloud.la/image-20210806135922048.png?sign=0fe71e3e08fca48b6b21c3b772c73c84&t=1641039146)

LRU 的核心思想是如果数据**最近被访问过，那么将来被访问的几率也更高**，所以我们将命中缓存的组件 key 重新插入到 this.keys 的尾部，这样一来，this.keys 中越往头部的数据即将来被访问几率越低，所以当<u>缓存数量达到最大值时，我们就删除将来被访问几率最低的数据，即 this.keys 中第一个缓存的组件</u>。



## 15. $nextTick 原理及作用

### nextTick 是什么

官方对其的定义是

> 在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。

what？？

> Vue 在更新 DOM 时是异步执行的。当数据发生变化，Vue 将开启一个异步更新队列，视图需要等队列中所有数据完成之后，再统一进行更新。



**为什么要有 nextTick**

```vue
{{num}}
for(let i=0; i<100000; i++){
    num = i
}
```

如果没有 `nextTick` 更新机制，那么 `num` 每次更新值都会触发视图更新(上面这段代码也就是会更新10万次视图)，有了`nextTick`机制，只需要更新一次，所以`nextTick`本质是一种优化策略



**使用场景**

如果想要在修改数据后立刻得到更新后的`DOM`结构，可以使用`Vue.nextTick()`

第一个参数为：回调函数（可以获取最近的`DOM`结构）

第二个参数为：执行函数上下文

**全局 nextTick**

```js
// 修改数据
vm.message = '修改后的值'
// DOM 还没有更新
console.log(vm.$el.textContent) // 原始的值
Vue.nextTick(function () {
  // DOM 更新了
  console.log(vm.$el.textContent) // 修改后的值
})
```

**组件内 nextTick**

```js
this.message = '修改后的值'
console.log(this.$el.textContent) // => '原始的值'
this.$nextTick(function () {
    console.log(this.$el.textContent) // => '修改后的值'
})
```



**实现原理**

nextTick 中的回调是在下次 DOM 更新循环结束之后执行的延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。

**主要思路**就是采用微任务优先的方式调用异步方法去执行 nextTick 包装的方法

```js
let callbacks = [];
let pending = false;
function flushCallbacks() {
  pending = false; //把标志还原为false
  // 依次执行回调
  for (let i = 0; i < callbacks.length; i++) {
    callbacks[i]();
  }
}
let timerFunc; //定义异步方法  采用优雅降级
if (typeof Promise !== "undefined") {
  // 如果支持promise
  const p = Promise.resolve();
  timerFunc = () => {
    p.then(flushCallbacks);
  };
} else if (typeof MutationObserver !== "undefined") {
  // MutationObserver 主要是监听dom变化 也是一个异步方法
  let counter = 1;
  const observer = new MutationObserver(flushCallbacks);
  const textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true,
  });
  timerFunc = () => {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
} else if (typeof setImmediate !== "undefined") {
  // 如果前面都不支持 判断setImmediate
  timerFunc = () => {
    setImmediate(flushCallbacks);
  };
} else {
  // 最后降级采用setTimeout
  timerFunc = () => {
    setTimeout(flushCallbacks, 0);
  };
}

export function nextTick(cb) {
  // 除了渲染watcher  还有用户自己手动调用的nextTick 一起被收集到数组
  callbacks.push(cb);
  if (!pending) {
    // 如果多次调用nextTick  只会执行一次异步 等异步队列清空之后再把标志变为false
    pending = true;
    timerFunc();
  }
}
```

nextTick会有一个callbacks数组，存储一个个的任务，可以通过`Vue.prototype.$nextTick(job)`将一个任务加入到callbacks数组，而nextTick本身会被放入一个异步回调中，负责执行callbacks中的每一个回调函数。异步回调依照环境支持情况，按优先级和环境支持依次选择使用Promise, MutationObserver, setImmediate, setTimeout。



## 16. Vue 中给 data 中的对象属性添加一个新的属性时会发生什么？如何解决？

数据会更新，但是视图不会更新。因为一开始对象被设成了响应式，内部原有的数据改变会触发 getter 和 setter。而后来新加的属性却没有通过 `Object.defineProperty` 设置成响应式数据。

**解决方案：**

- Vue.set()

  - 通过`Vue.set`向响应式对象中添加一个`property`，并确保这个新 `property`同样是响应式的，且触发视图更新。
  - 适合<u>为对象添加少量的新属性</u>的情况。

- Object.assign()

  - 直接使用`Object.assign()`添加到对象的新属性不会触发更新。

    应创建一个新的对象，合并原对象和混入对象的属性

    ```js
    this.someObject = Object.assign({},this.someObject,{newProperty1:1,newProperty2:2 ...})
    ```

  - 适合<u>为新对象添加大量的新属性</u>的情况。

- $forcecUpdated()

  - 迫使`Vue` 实例重新渲染，仅仅影响实例本身和插入插槽内容的子组件，而不是所有子组件。

PS：`vue3`是用过`proxy`实现数据响应式的，直接动态添加新属性仍可以实现数据响应式。



## 17. Vue 中封装的数组方法有哪些，其如何实现页面更新

数组考虑性能原因没有用 defineProperty 对数组的每一项进行拦截，而是选择对 7 种数组（push,shift,pop,splice,unshift,sort,reverse）方法进行重写(AOP 切片思想)

所以在 Vue 中修改数组的索引和长度是无法监控到的。需要通过以上 7 种变异方法修改数组才会触发数组对应的 watcher 进行更新



相关代码如下

```javascript
// src/obserber/array.js
// 先保留数组原型
const arrayProto = Array.prototype;
// 然后将arrayMethods继承自数组原型
// 这里是面向切片编程思想（AOP）--不破坏封装的前提下，动态的扩展功能
export const arrayMethods = Object.create(arrayProto);
let methodsToPatch = [
  "push",
  "pop",
  "shift",
  "unshift",
  "splice",
  "reverse",
  "sort",
];
methodsToPatch.forEach((method) => {
  arrayMethods[method] = function (...args) {
    //   这里保留原型方法的执行结果
    const result = arrayProto[method].apply(this, args);
    // 这句话是关键
    // this代表的就是数据本身 比如数据是{a:[1,2,3]} 那么我们使用a.push(4)  this就是a  ob就是a.__ob__ 这个属性就是上段代码增加的 代表的是该数据已经被响应式观察过了指向Observer实例
    const ob = this.__ob__;

    // 这里的标志就是代表数组有新增操作
    let inserted;
    switch (method) {
      case "push":
      case "unshift":
        inserted = args;
        break;
      case "splice":
        inserted = args.slice(2);
      default:
        break;
    }
    // 如果有新增的元素 inserted是一个数组 调用Observer实例的observeArray对数组每一项进行观测
    if (inserted) ob.observeArray(inserted);
    // 之后咱们还可以在这里检测到数组改变了之后从而触发视图更新的操作--后续源码会揭晓
    return result;
  };
});
```



## 18. Vue 单页面与多页面应用的区别

**定义**

- **SPA单页面应用**（SinglePage Web Application），指只有一个主页面的应用（一个html页面），一开始只需要加载一次js、css的相关资源。所有内容都包含在主页面，对每一个功能模块组件化。单页应用跳转，就是切换相关组件，仅仅刷新局部资源。
- **MPA多页面应用**（MultiPage Application），指有多个独立页面的应用（多个html页面），每个页面必须重复加载js、css等相关资源。多页应用跳转，需要整页资源刷新。



**区别**

![image-20210905163654637](https://636c-cloud1-7g4dud13a1b0dc04-1305490742.tcb.qcloud.la/image-20210905163654637.png?sign=06783e0057677fc8c9725c0e36042bec&t=1641039217)



## 19. 对 SPA 单页面的理解，它的优缺点分别是什么？

SPA（ single-page application ）仅在 Web 页面初始化时加载相应的 HTML、JavaScript 和 CSS。一旦页面加载完成，SPA 不会因为用户的操作而进行页面的重新加载或跳转；取而代之的是利用路由机制实现 HTML 内容的变换，UI 与用户的交互，避免页面的重新加载。

**优点：**

- 用户体验好、快，内容的改变不需要重新加载整个页面，避免了不必要的跳转和重复渲染；
- 基于上面一点，SPA 相对对服务器压力小；
- 前后端职责分离，架构清晰，前端进行交互逻辑，后端负责数据处理；



**缺点：**

- 初次加载耗时多：为实现单页 Web 应用功能及显示效果，需要在加载页面的时候将 JavaScript、CSS 统一加载，部分页面按需加载；
- 前进后退路由管理：由于单页应用在一个页面中显示所有的内容，所以不能使用浏览器的前进后退功能，所有的页面切换需要自己建立堆栈管理；
- SEO 难度较大：由于所有的内容都在一个页面中动态替换显示，所以在 SEO 上其有着天然的弱势。



## 20. template 和 jsx 有什么区别

对于 runtime 来说，只需要保证组件存在 render 函数即可，而有了预编译之后，只需要保证构建过程中生成 render 函数就可以。在 webpack 中，使用`vue-loader`编译.vue文件，内部依赖的`vue-template-compiler`模块，在 webpack 构建过程中，将template预编译成 render 函数。与 react 类似，在添加了jsx的语法糖解析器`babel-plugin-transform-vue-jsx`之后，就可以直接手写render函数。



所以，template和jsx的都是render的一种表现形式，不同的是：JSX相对于template而言，具有更高的灵活性，在复杂的组件中，更具有优势，而 template 虽然显得有些呆滞。但是 template 在代码结构上更符合视图与逻辑分离的习惯，更简单、更直观、更好维护。



## 21. Vue template 到 render 的过程

Vue 的编译过程就是将 template 转化为 render 函数的过程 分为以下三步：

![image-20210905170007109](https://636c-cloud1-7g4dud13a1b0dc04-1305490742.tcb.qcloud.la/image-20210905170007109.png?sign=ab8f8ee410c16dc012d57233b50b75c6&t=1641039381)

```
第一步是将 模板字符串 解析为 AST（抽象语法树）（解析器）
第二步是对 AST 进行静态节点标记，主要用来做虚拟DOM的渲染优化（优化器）
第三步是 使用 AST 生成 render 函数代码字符串（代码生成器）
```

1. 调用parse方法将template转化为ast（抽象语法树, abstract syntax tree）
2. 对静态节点做优化。如果为静态节点，他们生成的DOM永远不会改变，这对运行时模板更新起到了极大的优化作用。
3. 生成渲染函数. 渲染的返回值是VNode，VNode是Vue的虚拟DOM节点，里面有（标签名，子节点，文本等等）

```js
export function compileToFunctions(template) {
  // 我们需要把html字符串变成render函数
  // 1.把html代码转成ast语法树  ast用来描述代码本身形成树结构 不仅可以描述html 也能描述css以及js语法
  // 很多库都运用到了ast 比如 webpack babel eslint等等
  let ast = parse(template);
  // 2.优化静态节点
  // 这个有兴趣的可以去看源码  不影响核心功能就不实现了
  //   if (options.optimize !== false) {
  //     optimize(ast, options);
  //   }
  // 3.通过ast 重新生成代码
  // 我们最后生成的代码需要和render函数一样
  // 类似_c('div',{id:"app"},_c('div',undefined,_v("hello"+_s(name)),_c('span',undefined,_v("world"))))
  // _c代表创建元素 _v代表创建文本 _s代表文Json.stringify--把对象解析成文本
  let code = generate(ast);
  //   使用with语法改变作用域为this  之后调用render函数可以使用call改变this 方便code里面的变量取值
  let renderFn = new Function(`with(this){return ${code}}`);
  return renderFn;
}
```

[模板编译略解](https://blog.csdn.net/yuan_me_da/article/details/103690161)



## 22. Vue data 中某一个属性的值发生改变后，视图会立即同步执行重新渲染吗？

<u>不会立即同步执行重新渲染。</u>

Vue 实现响应式并不是数据发生变化之后 DOM 立即变化，而是按一定的策略进行 DOM 的更新。

Vue 在更新 DOM 时是**异步**执行的。<u>只要侦听到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据变更。</u>

如果同一个 watcher 被多次触发，只会被推入到队列中一次。这种在缓冲时去除重复数据对于避免不必要的计算和 DOM 操作是非常重要的。

然后，在下一个的事件循环“tick”中，Vue 刷新队列并执行时机（已去重）工作。



## 23. 什么是 mixin

- Mixin 使我们能够为 Vue 组件编写可插拔和可重用的功能。
- 如果希望在多个组件之间重用一组组件选项，例如生命周期 hook、 方法等，则可以将其编写为 mixin，并在组件中简单的引用它。
- 然后将 mixin 的内容合并到组件中。如果你要在 mixin 中定义生命周期 hook，那么它在执行时将优化于组件自已的 hook。

### Vue.mixin 的使用场景和原理

在日常的开发中，我们经常会遇到在不同的组件中经常会需要用到一些相同或者相似的代码，这些代码的功能相对独立，可以通过 Vue 的 mixin 功能抽离公共的业务逻辑，原理类似“对象的继承”，当组件初始化时会调用 mergeOptions 方法进行合并，采用策略模式针对不同的属性进行合并。当组件和混入对象含有同名选项时，这些选项将以恰当的方式进行“合并”。

- 当混入生命周期时，混入的生命周期和原先存在的生命周期都会执行
- 当混入data、method时，采取混入的data和method不会覆盖原有的。

相关代码如下

```javascript
//全局混入
Vue.mixin({
  created: function () {
    var myOption = this.$options.myOption
    if (myOption) {
      console.log(myOption)
    }
  }
})

//基本混入
var mixin = {
  data: function () {
    return {
      message: 'hello',
      foo: 'abc'
    }
  }
}

//混入的使用
new Vue({
  mixins: [mixin],
  data: function () {
    return {
      message: 'goodbye',
      bar: 'def'
    }
  },
  created: function () {
    console.log(this.$data)
  }
})
```



## 24. extend 有什么作用

这个全局 API 很少用到，作用是扩展组件生成一个构造器，通常会与 `$mount` 一起使用。

它会返回一个**扩展实例构造器**，这个扩展实例构造器预设了一些属性和方法，最后通过 new 出一个组件实例并挂载到 dom 上。

```js
// 创建组件构造器
let Component = Vue.extend({
  template: '<div>test</div>'
})
// 挂载到 #app 上
new Component().$mount('#app')
// 除了上面的方式，还可以用来扩展已有的组件
let SuperComponent = Vue.extend(Component)
new SuperComponent({
    created() {
        console.log(1)
    }
})
new SuperComponent().$mount('#app')
```



### 实现思路

使用**原型继承**的方法返回了 Vue 的子类，并利用 mergeOptions 方法把传入组件的 options 和 父类的 options 合并。



## 25. mixin 和 mixins 的区别

`mixin` 用于**全局混入**，会影响到每个组件实例，通常插件都是这样做初始化的。

```js
Vue.mixin({
    beforeCreate() {
        // ...逻辑
        // 这种方式会影响到每个组件的 beforeCreate 钩子函数
    }
})
```

虽然文档不建议在应用中直接使用 `mixin`，但是如果不滥用的话也是很有帮助的，比如可以全局混入封装好的 `ajax` 或者一些工具函数等等。



`mixins` 应该是最常使用的扩展组件的方式了。如果多个组件中有相同的业务逻辑，就可以将这些逻辑剥离出来，通过 `mixins` 混入代码，比如上拉下拉加载数据这种逻辑等等。

另外需要注意的是 `mixins` 混入的钩子函数会先于组件内的钩子函数执行，并且在遇到同名选项的时候也会有选择性的进行合并。



## 26. 简述 mixin、extends 的覆盖逻辑

**minxin 和 extends**

mixin 和 extends均是用于合并、拓展组件的，两者均通过 mergeOptions 方法实现合并。

- mixins 接收一个混入对象的数组，其中混入对象可以像正常的实例对象一样包含实例选项，这些选项会被合并到最终的选项中。Mixin 钩子按照传入顺序依次调用，并在调用组件自身的钩子之前被调用。
  - 数据对象在内部会进行递归合并，并在发生冲突时以组件数据优先。
  - 同名钩子函数将合并为一个数组，因此都将被调用。另外，混入对象的钩子将在组件自身钩子**之前**调用。
  - 值为对象的选项，例如 `methods`、`components` 和 `directives`，将被合并为同一个对象。两个对象键名冲突时，取组件对象的键值对。

- extends 主要是为了便于扩展单文件组件，接收一个对象或构造函数。



## 27. 描述下 Vue 自定义指令

指令本质上是装饰器，是 vue 对 HTML 元素的扩展，给 HTML 元素增加自定义功能。vue 编译 DOM 时，会找到指令对象，执行指令的相关方法。

自定义指令有五个生命周期（也叫钩子函数），分别是 bind、inserted、update、componentUpdated、unbind

```txt
1. bind：只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。

2. inserted：被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。

3. update：被绑定于元素所在的模板更新时调用，而无论绑定值是否变化。通过比较更新前后的绑定值，可以忽略不必要的模板更新。

4. componentUpdated：被绑定元素所在模板完成一次更新周期时调用。

5. unbind：只调用一次，指令与元素解绑时调用。
```

**原理**

1.在生成 ast 语法树时，遇到指令会给当前元素添加 directives 属性

2.通过 genDirectives 生成指令代码

3.在 patch 前将指令的钩子提取到 cbs 中,在 patch 过程中调用对应的钩子

4.当执行指令对应钩子函数时，调用对应指令定义的方法



## 28. 子组件可以直接改变父组件的数据吗？

子组件不可以直接改变父组件的数据。这样做主要是为了维护父子组件的单向数据流。每次父级组件发生更新时，子组件中所有的 prop 都将会刷新为最新的值。如果这样做了，Vue 会在浏览器的控制台中发出警告。



Vue提倡单向数据流，即父级 props 的更新会流向子组件，但是反过来则不行。这是<u>为了防止意外的改变父组件状态，使得应用的数据流变得难以理解，导致数据流混乱</u>。如果破坏了单向数据流，当应用复杂时，debug 的成本会非常高。

只能通过 `$emit` 派发一个自定义事件，父组件接收到后，由父组件修改。



## 29. Vue 是如何收集依赖的？

在初始化 Vue 的每个组件时，会对组件的 data 进行初始化，就会将普通对象变成响应式对象，在这个过程中便会进行依赖收集的相关逻辑，如下所似乎：

```js
function defineReactive(obj, key, val) {
    const dep = new Dep();
    ...
    Object.defineProperty(obj, key, {
        ...
        get: function reactiveGetter() {
            if(Dep.target()) {
                dep.depend()
                ...
            }
                return val
        }
        ...
    })
}
```

以上只保留了关键代码，这段代码我们只需要关注 2 个地方，一个是 `const dep = new Dep()` 实例化一个 `Dep` 的实例，另一个是在 `get` 函数中通过 `dep.depend` 做依赖收集。

### Dep

Dep是整个依赖收集的核心，其关键代码如下：

```js
class Dep {
  static target;
  subs;

  constructor () {
    ...
    this.subs = [];
  }
  addSub (sub) {
    this.subs.push(sub)
  }
  removeSub (sub) {
    remove(this.sub, sub)
  }
  depend () {
    if(Dep.target){
      Dep.target.addDep(this)
    }
  }
  notify () {
    const subs = this.subds.slice();
    for(let i = 0;i < subs.length; i++){
      subs[i].update()
    }
  }
}
```

Dep 是一个 class ，其中有一个关键的静态属性 static，它指向了一个全局唯一 Watcher，保证了同一时间全局只有一个 watcher 被计算，另一个属性 subs 则是一个 Watcher 的数组，所以 Dep 实际上就是对 Watcher 的管理，再看看 Watcher 的相关代码∶



### Watcher

```js
class Watcher {
  getter;
  ...
  constructor (vm, expression){
    ...
    this.getter = expression;
    this.get();
  }
  get () {
    pushTarget(this); // 把 Dep.target 赋值为当前的渲染 watcher 并压栈
    value = this.getter.call(vm, vm) // 对应 updateComponent，先执行 vm._render() 方法，该方法会生成渲染的 VNode，并且这个过程中会对 vm 上的数据访问，这时候就触发了数据对象的 getter
    ...
    return value
  }
  addDep (dep){
        ...
    dep.addSub(this)
  }
  cleanupDeps () {
    let i = this.deps.length
    while (i--) {
      const dep = this.deps[i]
      if (!this.newDepIds.has(dep.id)) {
        dep.removeSub(this)
      }
    }
    let tmp = this.depIds
    this.depIds = this.newDepIds
    this.newDepIds = tmp
    this.newDepIds.clear()
    tmp = this.deps
    this.deps = this.newDeps
    this.newDeps = tmp
    this.newDeps.length = 0
  }
}
function pushTarget (_target) {
  Dep.target = _target
}
```

Watcher 是一个 class，它定义了一些方法，其中和依赖收集相关的主要有 get、addDep 等。其中，`this.deps` 和 `this.newDeps` 表示 `Watcher` 实例持有的 `Dep` 实例的数组；而 `this.depIds` 和 `this.newDepIds` 分别代表 `this.deps` 和 `this.newDeps` 的 `id`



### 过程

在实例化 Vue 时，依赖收集的相关过程如下∶

初 始 化 状 态 initState ， 这 中 间 便 会 通 过 defineReactive 将数据变成响应式对象，其中的 getter 部分便是用来依赖收集的。

初始化最终会走 mount 过程，其中会实例化 Watcher ，进入 Watcher 中，便会执行 this.get() 方法，

```js
updateComponent = () => {
  vm._update(vm._render())
}
new Watcher(vm, updateComponent)
```

get 方法中的 pushTarget 实际上就是把 Dep.target 赋值为当前的 watcher。

`this.getter.call（vm，vm）`，这里的 getter 会执行 `vm._render()` 方法，因为之前分析过这个方法会生成 渲染 VNode，并且在这个过程中会对 `vm` 上的数据访问，在这个过程中便会触发数据对象的 `getter`。

那么每个对象值的 getter 都持有一个 `dep`，在触发 getter 的时候会调用 `dep.depend()` 方法，也就会执行 `Dep.target.addDep(this)`。

刚才我们提到这个时候 `Dep.target` 已经被赋值为渲染 `watcher`，那么就执行到 `addDep` 方法：

这时候会做一些逻辑判断（保证同一数据不会被添加多次）后执行 `dep.addSub(this)`，那么就会执行 `this.subs.push(sub)`，也就是说把当前的 `watcher` 订阅到这个数据持有的 `dep` 的 `subs` 中，这个目的是为后续数据变化时候能通知到哪些 `subs` 做准备。

所以在 `vm._render()` 过程中，会触发所有数据的 getter，这样实际上已经完成了一个依赖收集的过程。

注意要考虑的情况：

1. 递归访问 value，触发它所有子项的 getter
2. 依赖清空

[好文推荐](https://ustbhuangyi.github.io/vue-analysis/v2/reactive/getters.html#%E8%BF%87%E7%A8%8B%E5%88%86%E6%9E%90)



## 30. Vue 的优点

- 易用： 简单，易学，上手快
- 灵活： （渐进式）不断繁荣的生态系统，可以在一个库和一套完整框架之间自如伸缩。
- 高效： 20kB min+gzip 运行大小；超快虚拟 DOM；最省心的优化
- 双向绑定：开发效率高
- 组件化：基于组件的代码共享
- Web项目工程化，增加可读性、可维护性



## 31. assets 和 static 的区别

**相同点：** `assets` 和 `static` 两个<u>都是存放静态资源文件</u>。项目中所需要的资源文件图片，字体图标，样式文件等都可以放在这两个文件下，这是相同点



**不相同点：**`assets` 中存放的静态资源文件在项目打包时，也就是运行 `npm run build` 时会将 `assets` 中放置的静态资源文件<u>进行打包上传</u>，所谓打包简单点可以理解为压缩体积，代码格式化。而压缩后的静态资源文件最终也都会放置在 `static` 文件中跟着 `index.html` 一同上传至服务器。`static` 中放置的静态资源文件就<u>不会要走打包压缩格式化等流程</u>，而是直接进入打包好的目录，直接上传至服务器。因为避免了压缩直接进行上传，在打包时会提高一定的效率，但是 `static` 中的资源文件由于没有进行压缩等操作，所以文件的体积也就相对于 `assets` 中打包后的文件提交较大点。在服务器中就会占据更大的空间。



**建议：** 将项目中 `template`需要的样式文件js文件等都可以放置在 `assets` 中，走打包这一流程。减少体积。而项目中引入的第三方的资源文件如`iconfoont.css` 等文件可以放置在 `static` 中，因为这些引入的第三方文件已经经过处理，不再需要处理，直接上传。



## 32. delete 和 Vue.delete 删除数组的区别

- `delete` 只是被删除的元素变成了 `empty/undefined` 其他的元素的键值还是不变，数组长度也不变。
- `Vue.delete` 直接删除了数组 改变了数组的键值。



## 33. Vue 如何监听对象或数组某个属性的变化

当在项目中直接设置数组的某一项的值，或者直接设置对象的某个属性值，这个时候，你会发现页面并没有更新。这是因为Object.defineProperty()限制，监听不到变化。



**解决方式**：

- this.$set(你要改变的数组/对象，你要改变的位置/key，你要改成什么value)

```
this.$set(this.arr, 0, "OBKoro1"); // 改变数组
this.$set(this.obj, "c", "OBKoro1"); // 改变对象
```

- 调用以下几个数组的方法

```
splice()、 push()、pop()、shift()、unshift()、sort()、reverse()
```

vue源码里缓存了array的原型链，然后重写了这几个方法，触发这几个方法的时候会observer数据，意思是使用这些方法不用再进行额外的操作，视图自动进行更新。 推荐使用splice方法会比较好自定义,因为splice可以在数组的任何位置进行删除/添加操作



vm.`$set` 的实现原理是：

- 如果目标是数组，直接使用数组的 splice 方法触发相应式；
- 如果目标是对象，会先判读属性是否存在、对象是否是响应式，最终如果要对属性进行响应式处理，则是通过调用 defineReactive 方法进行响应式处理（ defineReactive 方法就是 Vue 在初始化对象时，给对象属性采用 Object.defineProperty 动态添加 getter 和 setter 的功能所调用的方法）



## 34. 对 SSR 的理解

SSR 也就是服务端渲染，也就是将 Vue 在客户端把标签渲染成 HTML 的工作放在服务端完成，然后再把html直接返回给客户端



SSR 的优势：

- 更好的SEO
- 首屏加载速度更快



SSR的缺点：

- 开发条件会受到限制，服务器端渲染只支持beforeCreate和created两个钩子；
- 当需要一些外部扩展库时需要特殊处理，服务端渲染应用程序也需要处于Node.js的运行环境；
- 更多的服务端负载。



## 35. Vue 的性能优化有哪些

### 编码阶段

1. **避免响应所有数据**
   1. 不要将所有的数据都放到`data`中，`data`中的数据都会增加`getter`和`setter`，并且会收集`watcher`
2. **区分computed和watch使用场景**
   1. 当我们需要进行数值计算，并且依赖于其它数据时，应该使用`computed`，因为可以利用`computed`的缓存特性，避免每次获取值时，都要重新计算。当我们需要在数据变化时执行异步或开销较大的操作时，应该使用`watch`，使用`watch`选项允许我们执行异步操作，限制我们执行该操作的频率，并在我们得到最终结果前，设置中间状态。
3. **v-for 添加 key 且避免同时使用 v-if。**
   1. `v-for`遍历必须为`item`添加`key`，且尽量不要使用`index`而要使用唯一`id`去标识`item`，在列表数据进行遍历渲染时，设置**唯一`key`**值方便`Vue.js`内部机制精准找到该条列表数据，当`state`更新时，新的状态值和旧的状态值对比，较快地定位到`diff`。
   2. `v-for`遍历避免同时使用`v-if`，`v-for`比`v-if`优先级高，如果每一次都需要遍历整个数组，将会影响速度。
4. 如果需要使用 v-for，则给每项元素绑定事件时使用事件代理，
5. SPA 页面采用 keep-alive 缓存组件
6. 在更多的情况下，使用 v-if 替代 v-show
7. 对象层级不要过深，否则性能就会差
8. 防抖、节流
9. 第三方模块按需导入
10. 长列表滚动到可视区域动态加载
11. 图片懒加载
12. 使用路由懒加载、异步组件
13. 不需要响应式的数据不要放到 data 中（可以用 Object.freeze() 冻结数据）
14. 大数据列表和表格性能优化（虚拟列表/虚拟表格）
15. 防止内部泄漏，组件销毁后把全局变量和事件销毁



### SEO 优化

1. 预渲染
2. 服务端渲染 SSR



### 打包优化

1. 压缩代码
2. Tree Shaking/Scope Hoisting
3. 使用 cdn 加载第三方模块
4. 多线程打包 happypack
5. splitChunks 抽离公共文件
6. sourceMap 优化



### 用户体验

1. 骨架屏
2. PWA
3. 还可以使用缓存（客户端缓存、服务端缓存）优化、服务端开启 gzip 压缩等。



## 36. vue 初始化页面闪动问题

Vue. js提供了一个v-cloak指令，该指令一直保持在元素上，直到关联实例结束编译。当和CSS一起使用时，这个指令可以隐藏未编译的标签，直到实例编译结束。用法如下。

```html
[v-cloak]{ 
 display:none; 
} 
<div v-cloak>{{ title }}</div>
```

如果没有彻底解决，需要在根元素上加：这里默认vue实例绑定到类名为app的div上。

```html
<div class="app" style="display: none;" :style="{display: 'block'}">
	{{message}}
</div>
```

这样应该就可以了。

**原理：**

1. vue 在渲染之前，`style="display: none;"`让页面不显示
2. vue 渲染完成了，`:style="display: block;"`让页面显示



## 37. MVVM 的优缺点？

**优点:** 

- <u>分离视图（View）和模型（Model），降低代码耦合</u>，提⾼视图或者逻辑的重⽤性: ⽐如视图（View）可以独⽴于Model变化和修改，⼀个ViewModel可以绑定不同的"View"上，当View变化的时候Model不可以不变，当Model变化的时候View也可以不变。你可以把⼀些视图逻辑放在⼀个ViewModel⾥⾯，让很多view重⽤这段视图逻辑 
- <u>提⾼可测试性</u>: ViewModel的存在可以帮助开发者更好地编写测试代码 
- <u>⾃动更新dom</u>: 利⽤双向绑定,数据更新后视图⾃动更新,让开发者从繁琐的⼿动dom中解放 



**缺点:** 

- <u>Bug很难被调试</u>: 因为使⽤双向绑定的模式，当你看到界⾯异常了，有可能是你View的代码有Bug，也可能是Model的代码有问题。数据绑定使得⼀个位置的Bug被快速传递到别的位置，要定位原始出问题的地⽅就变得不那么容易了。另外，数据绑定的声明是指令式地写在View的模版当中的，这些内容是没办法去打断点debug的 
- ⼀个⼤的模块中model也会很⼤，虽然使⽤⽅便了也很容易保证了数据的⼀致性，当时⻓期持有，不释放内存就造成了<u>花费更多的内存</u> 
- 对于⼤型的图形应⽤程序，视图状态较多，<u>ViewModel的构建和维护的成本都会⽐较⾼</u>。



## 38. Vue.use 的实现原理

**参数**：`{Object | Function} plugin`

**作用**：该方法是用来安装vue插件，该方法内部会调用插件提供的install方法，并将vue实例传install方法。但是我们知道，同一个插件只会在项目中安装一次，所以，其内部还有的作用就是防止同一插件被安装多次。

**实现原理**：

```js
Vue.use = function (plugin) {
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    if (installedPlugins.indexOf(plugin) > -1) {
        return this
    }
 
    // additional parameters
    const args = toArray(arguments, 1)
    args.unshift(this)
    if (typeof plugin.install === 'function') {
        plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') {
        plugin.apply(null, args)
    }
    installedPlugins.push(plugin)
    return this
}
```

1. 声明一个插件数组，用来存放安装过的插件。
2. 查看将安装的插件是否存在于数组中，避免重复安装。
3. 将其他参数转化为一个参数数组，然后将 vue 实例放在参数数组的第一个位置，后续将参数数组传入到 install 方法中。
4. 判断 plugin 是什么类型
   1. 如果 plugin 是对象的话，就用它提供的 install 方法完成插件的安装
   2. 如果 plugin 是函数的话，就直接把它当作 install 方法来执行
5. 再将 plugin 压入到 installedPlugin 数组中，表示插件已经安装。
6. 最后返回 vue 实例。



## 39. Vue 的 set 方法原理

**Vue 有两种情况下修改数据是不会触发视图更新的。**

1. 在实例创建之后添加新的属性在实例上（给响应式对象新增属性）
2. 直接更改数组下标来修改数组的值

**Vue.set 或者说 $set 原理如下：**

因为响应式数据中，我们给对象和数组本身都增加了 `_ob_`  属性，代表的是 Observer 实例。当给对象新增不存在的属性，首先会把新的属性进行响应式跟踪，然后触发对象 `_ob_` 的 dep 收集到的 watcher 去更新；当修改数组索引时我们调用数组本身的 splice 方法去更新数组。



## 40. Vue 的内置指令

 ![内置指令.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0b46ec8b051246858211c4c7ec129fb3~tplv-k3u1fbpfcp-watermark.awebp)



## 41. Vue 事件绑定原理

原生事件绑定是通过 addEventListener 绑定给真实元素的，而Vue中的组件事件绑定是通过 Vue 自定义的$on 实现的。如果要在组件上使用原生事件，需要加 .native 修饰符（如 @focus.native），这样就相当于在父组件中把子组件当做普通 html 标签，然后加上原生事件。

$on、$emit 是基于发布订阅模式的，维护一个事件中心，on 的时候将事件按名称存在事件中心里，称之为订阅者，然后 emit 将对应的事件进行发布，去执行事件中心里的对应的监听器。



## 42. Vue中模板编译原理

参考答案：简单说，Vue的编译过程就是将template转化为render函数的过程。会经历以下阶段：

1. 生成AST树
2. 优化
3. codegen

* 首先解析模版，生成AST语法树(一种用JavaScript对象的形式来描述整个模板)。 使用大量的正则表达式对模板进行解析，遇到标签、文本的时候都会执行对应的钩子进行相关处理。
* Vue的数据是响应式的，但其实模板中并不是所有的数据都是响应式的。有一些数据首次渲染后就不会再变化，对应的DOM也不会变化。
* 那么优化过程就是深度遍历AST树，按照相关条件对树节点进行标记。这些被标记的节点(静态节点)我们就可以跳过对它们的比对，对运行时的模板起到很大的优化作用。
* 编译的最后一步是将优化后的AST树转换为可执行的代码。



## 43. 在组件中怎么访问到根实例？

```vue
this.$root
```



## 44. 组件中写 name 选项有哪些好处及作用？

**注意：**组件在全局用 `Vue.component()` 注册时，全局 ID 自动作为组件的 name。 

- 实现递归组件 ，即在 template 中使用自身
- 可以通过name属性实现缓存功能 (keep-alive的include和exclude属性)
- 便于进行调试， 在vue-devtools中，未命名组件将显示成`<AnonymousComponent>`，这很没有语义。通过提供 `name` 选项，可以获得更有语义信息的组件树。 



## 45. Vue中子组件为什么无法修改父组件的prop？

1. 因为vue是单项数据流，易于检测数据的流动，出现了错误可以更加迅速的定位到错误发生的位置;
2. 通过setter属性进行检测，修改值将会触发setter，从而触发警告。

```js
/* 摘自vue.js源码 src/core/instance/state.js */
 
function initProps (vm: Component, propsOptions: Object) {
  const propsData = vm.$options.propsData || {}
  const props = vm._props = {}
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  const keys = vm.$options._propKeys = []
  const isRoot = !vm.$parent
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false)
  }
  for (const key in propsOptions) {
    keys.push(key)
    const value = validateProp(key, propsOptions, propsData, vm)
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      const hyphenatedKey = hyphenate(key)
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          `"${hyphenatedKey}" is a reserved attribute and cannot be used as component prop.`,
          vm
        )
      }
      defineReactive(props, key, value, () => {
        if (!isRoot && !isUpdatingChildComponent) {
          warn(
            `Avoid mutating a prop directly since the value will be ` +
            `overwritten whenever the parent component re-renders. ` +
            `Instead, use a data or computed property based on the prop's ` +
            `value. Prop being mutated: "${key}"`,
            vm
          )
        }
      })
    } else {
      defineReactive(props, key, value)
    }
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, `_props`, key)
    }
  }
  toggleObserving(true)
}
```

​		在组件进行initProps方法的时候，会执行defineReactive方法，这个方法就是运行Object.defineProperty对传入的object绑定get/set，传入的第四个参数是触发set的回调。所以props被修改时，就会查看是不是根组件、是不是更新子组件，那说明是子组件在修改props，给出warn警告。

# 二、生命周期

Vue 实例有⼀个完整的⽣命周期，也就是从开始创建、初始化数据、编译模版、挂载Dom -> 渲染、更新 -> 渲染、卸载 等⼀系列过程，称这是Vue的⽣命周期。 

Vue生命周期总共可以分为8个阶段：创建前后, 载入前后,更新前后,销毁前销毁后，以及一些特殊场景的生命周期：

| 生命周期      | 描述                                                         |
| :------------ | :----------------------------------------------------------- |
| beforeCreate  | 组件实例被创建之初，el 和 数据对象都为 undefined，还未初始化 |
| created       | 组件实例已经完全创建，数据已经被初始化，并且初始化了 Vue 内部事件，但是 DOM 还未生成 |
| beforeMount   | 组件挂载之前，完成了模板的编译。把 data 对象里面的数据和 vue 的语法写的模板编译成了虚拟 DOM |
| mounted       | 组件挂载到实例上去之后，执行了 render 函数，将渲染出来的内容挂载到了 DOM 节点上 |
| beforeUpdate  | 组件数据发生变化，更新之前，会经历 DOM diff                  |
| updated       | 组件数据更新之后                                             |
| beforeDestroy | 组件实例销毁之前                                             |
| destroyed     | 组件实例销毁之后                                             |
| activated     | keep-alive 缓存的组件激活时                                  |
| deactivated   | keep-alive 缓存的组件停用时调用                              |
| errorCaptured | 捕获一个来自子孙组件的错误时被调用                           |

另外还有 `keep-alive` 独有的生命周期，分别为 `activated` 和 `deactivated` 。用 `keep-alive` 包裹的组件<u>在切换时不会进行销毁，而是缓存到内存中</u>并执行 `deactivated` 钩子函数，命中缓存渲染后会执行 `activated` 钩子函数。



## 1. Vue2.x和3.x的生命周期？

### **Vue2.x生命周期**

- beforeCreate： 在实例初始化之后，数据观测（data observe）和 event/watcher 事件配置之前被调用。在当前阶段 data、methods、computed 以及 watch 上的数据和方法都不能被访问。

- created： 实例已经创建完成之后被调用。在这一步，实例已经完成以下的配置：数据观测（data observe ），属性和方法的运算，watch/event 事件回调。这里没有 `$el`，如果非要想与 DOM 进行交互，可以通过`vm.$nextTick` 来访问 DOM。

- beforeMount： 在挂载开始之前被调用：相关的 render 函数首次被调用。

- mounted： 在挂载完成后发生，在当前阶段，真实的 Dom 挂载完毕，数据完成双向绑定，可以访问到 Dom节点。

- beforeUpdate： 数据更新时调用，发生在虚拟 DOM 重新渲染和打补丁 （patch）之前。可以在这个钩子中进一步地更改状态，这不会触发附加的重渲染过程。

- updated： 发生在更新完成之后，当前阶段组件 Dom 已经完成更新。要注意的是避免在此期间更新数据，因为这个可能导致无限循环的更新，该钩子在服务器渲染期间不被调用。

- beforeDestroy： 实例销毁之前调用。在这一步，实力仍然完全可用。我们可以在这时进行 善后收尾工作，比如清除定时器。

- destroyed：Vue实例销毁后调用。调用后，Vue实例指示的东西都会解绑定，所有的事件监听器会被移除，左右的子实例也会被销毁，该钩子在服务器端渲染不被调用。

- activated： keep-alive组件专属，组件被激活时调用

- deactivated： keep-alive组件专属，组件被销毁时调用

 

### **Vue3.x生命周期**

相比于Vue2：

beforeDestory => beforeUnmount，destoryed => unmounted

Vue3选项式API的生命周期和组合式API的映射：

**选项式 API 的生命周期选项和组合式 API 之间的映射**

- ~~`beforeCreate`~~ -> 使用 `setup()`
- ~~`created`~~ -> 使用 `setup()`
- `beforeMount` -> `onBeforeMount`
- `mounted` -> `onMounted`
- `beforeUpdate` -> `onBeforeUpdate`
- `updated` -> `onUpdated`
- `beforeUnmount` -> `onBeforeUnmount`
- `unmounted` -> `onUnmounted`
- `errorCaptured` -> `onErrorCaptured`
- `renderTracked` -> `onRenderTracked`
- `renderTriggered` -> `onRenderTriggered`
- `activated` -> `onActivated`
- `deactivated` -> `onDeactivated`

如果同时使用选项式API和组合式API生命周期，那么setup函数的执行时机处于`beforeCreate`之前。



## 2. Vue 子组件和父组件执行顺序

**加载渲染过程：**

1. 父组件 beforeCreate
2. 父组件 created
3. 父组件 beforeMount
4. 子组件 beforeCreate
5. 子组件 created
6. 子组件 beforeMount
7. 子组件 mounted
8. 父组件 mounted



**子更新过程：**

1. 父组件 beforeUpdate
2. 子组件 beforeUpdate
3. 子组件 updated
4. 父组件 updated



**销毁过程：**

1. 父组件 beforeDestory
2. 子组件 beforeDestroy
3. 子组件 destoryed
4. 父组件 destoryed



## 3. created 和 mounted 的区别

- created：<u>在模板渲染成 html 前调用</u>，即通常<u>初始化某些属性值</u>，然后再渲染成视图。
- mounted：<u>在模板渲染成 html 后调用</u>，通常是初始化页面完成后，再<u>对 html 的 dom 节点进行一些需要的操作</u>。



## 4. 一般在哪个生命周期请求异步数据

我们可以在钩子函数 created、beforeMount、mounted 中进行调用，因为在这三个钩子函数中，data 已经创建，可以将服务端端返回的数据进行赋值。

推荐在 created 钩子函数中调用异步请求，因为在 created 钩子函数中调用异步请求有以下优点：

- 能更快获取到服务端数据，减少页面加载时间，用户体验更好；
- SSR不支持 beforeMount 、mounted 钩子函数，放在 created 中有助于一致性。



## 5. keep-alive 中的生命周期有哪些

keep-alive是 Vue 提供的一个内置组件，用来<u>对组件进行缓存</u>——在组件切换过程中将状态保留在内存中，<u>防止重复渲染DOM</u>。



如果为一个组件包裹了 keep-alive，那么它会多出两个生命周期：deactivated、activated。同时，beforeDestroy 和 destroyed 就不会再被触发了，因为组件不会被真正销毁。



当组件被换掉时，会被缓存到内存中、触发 deactivated 生命周期；
当组件被切回来时，再去缓存里找这个组件、触发 activated钩子函数。



## 6. 生命周期钩子是如何实现的？

它的**核心实现**是利用**发布订阅模式**先把用户传入的生命周期钩子订阅好，然后在**创建组件实例的过程**会<u>依次执行对应的钩子方法</u>（发布）。



# 三、组件通信

组件间通信的分类可以分成以下:

- 父子组件之间的通信
- 兄弟组件之间的通信
- 祖孙与后代组件之间的通信
- 非关系组件之间的通信



vue 中5种常规的通信方案

1. 通过 props / $emit 传递
2. EventBus
3. 依赖注入（project / inject）
4. $parent / $children
5. attrs 与 listeners
6. Vuex



## 1. props / $emit

父组件通过 props 向子组件传递数据，子组件通过 $emit 向父组件传递

### 1. 父组件向子组件传值

- `props`只能是父组件向子组件进行传值，`props`使得父子组件之间形成了一个单向下行绑定。子组件的数据会随着父组件不断更新。
- `props` 可以显示定义一个或一个以上的数据，对于接收的数据，可以是各种数据类型，同样也可以传递一个函数。
- `props`属性名规则：若在`props`中使用驼峰形式，模板中需要使用短横线的形式

```vue
// 父组件
<template>
    <div id="father">
        <son :msg="msgData" :fn="myFunction"></son>
    </div>
</template>

<script>
import son from "./son.vue";
export default {
    name: father,
    data() {
        msgData: "父组件数据";
    },
    methods: {
        myFunction() {
            console.log("vue");
        }
    },
    components: {
        son
    }
};
</script>
```

```vue
// 子组件
<template>
    <div id="son">
        <p>{{msg}}</p>
        <button @click="fn">按钮</button>
    </div>
</template>
<script>
export default {
    name: "son",
    props: ["msg", "fn"]
};
</script>
```



### 2. 子组件向父组件传值

`$emit`绑定一个自定义事件，当这个事件被执行的时就会将参数传递给父组件，而父组件通过`v-on`监听并接收参数。

```vue
// 父组件
<template>
  <div class="section">
    <com-article :articles="articleList" @onEmitIndex="onEmitIndex"></com-article>
    <p>{{currentIndex}}</p>
  </div>
</template>

<script>
import comArticle from './test/article.vue'
export default {
  name: 'comArticle',
  components: { comArticle },
  data() {
    return {
      currentIndex: -1,
      articleList: ['红楼梦', '西游记', '三国演义']
    }
  },
  methods: {
    onEmitIndex(idx) {
      this.currentIndex = idx
    }
  }
}
</script>
```

```vue
//子组件
<template>
  <div>
    <div v-for="(item, index) in articles" :key="index" @click="emitIndex(index)">{{item}}</div>
  </div>
</template>

<script>
export default {
  props: ['articles'],
  methods: {
    emitIndex(index) {
      this.$emit('onEmitIndex', index) // 触发父组件的方法，并传递参数index
    }
  }
}
</script>
```



## 2. eventBus 事件总线（$emit / $on）

**这种方法通过一个空的 Vue 实例作为中央事件总线（事件中心），用它来触发事件和监听事件,巧妙而轻量地实现了任何组件间的通信，包括父子、兄弟、跨级**。当我们的项目比较大时，可以选择更好的状态管理解决方案 vuex。

步骤如下：

### 1. 创建事件中心管理组件之间的通信

```js
// event-but.js

import Vue from 'vue'
export const EventBus = new Vue()
```

### 2. 发送事件

假设有两个兄弟组件`firstCom`和`secondCom`：

```js
<template>
  <div>
    <first-com></first-com>
    <second-com></second-com>
  </div>
</template>

<script>
import firstCom from './firstCom.vue'
import secondCom from './secondCom.vue'
export default {
  components: { firstCom, secondCom }
}
</script>
```

在`firstCom`组件中发送事件：

```js
<template>
  <div>
    <button @click="add">加法</button>    
  </div>
</template>

<script>
import {EventBus} from './event-bus.js' // 引入事件中心

export default {
  data(){
    return{
      num:0
    }
  },
  methods:{
    add(){
      EventBus.$emit('addition', {
        num:this.num++
      })
    }
  }
}
</script>
```

### 3. 接收事件

在`secondCom`组件中发送事件：

```js
<template>
  <div>求和: {{count}}</div>
</template>

<script>
import { EventBus } from './event-bus.js'
export default {
  data() {
    return {
      count: 0
    }
  },
  mounted() {
    EventBus.$on('addition', param => {
      this.count = this.count + param.num;
    })
  }
}
</script>
```

在上述代码中，这就相当于将`num`值存贮在了事件总线中，在其他组件中可以直接访问。事件总线就相当于一个桥梁，不用组件通过它来通信。

虽然看起来比较简单，但是这种方法也有不变之处，如果项目过大，使用这种方式进行通信，后期维护起来会很困难。



## 3. 依赖注入（project / inject）

这种方式就是Vue中的**依赖注入**，该方法用于**父子组件之间的通信**。当然这里所说的父子不一定是真正的父子，也可以是祖孙组件，在层数很深的情况下，可以使用这种方法来进行传值。就不用一层一层的传递了。



`project / inject`是Vue提供的两个钩子，和`data`、`methods`是同级的。并且`project`的书写形式和`data`一样。

- `project` 钩子用来发送数据或方法
- `inject`钩子用来接收数据或方法



在父组件中：

```js
provide() {
 return {
    num: this.num
  };
}
```

在子组件中：

```js
inject: ['num']
```

还可以这样写，这样写就可以访问父组件中的所有属性：

```js
provide() {
 return {
    app: this
  };
}
data() {
 return {
    num: 1
  };
}

inject: ['app']
console.log(this.app.num)
```

**注意：** 依赖注入所提供的属性是**非响应式**的。

**provide 和 inject 绑定并不是可响应的。这是刻意为之的。然而，如果你传入了一个可监听的对象，那么其对象的属性还是可响应的**----vue 官方文档



#####  provide 与 inject 怎么实现数据响应式

一般来说，有两种办法：

- provide 祖先组件的实例，然后在子孙组件中注入依赖，这样就可以在子孙组件中直接修改祖先组件的实例的属性，不过这种方法有个缺点就是这个实例上挂载很多没有必要的东西比如 props，methods
- 使用 2.6 最新 API Vue.observable 优化响应式 provide(推荐)



## 4. ref / $refs

这种方式也是实现**父子组件**之间的通信。

`ref`： 这个属性用在子组件上，它的引用就指向了子组件的实例。可以通过实例来访问组件的数据和方法。

在子组件中：

```vue
export default {
  data () {
    return {
      name: 'JavaScript'
    }
  },
  methods: {
    sayHello () {
      console.log('hello')
    }
  }
}
```

在父组件中：

```vue
<template>
  <child ref="child"></component-a>
</template>
<script>
  import child from './child.vue'
  export default {
    components: { child },
    mounted () {
      console.log(this.$refs.child.name);  // JavaScript
      this.$refs.child.sayHello();  // hello
    }
  }
</script>
```



## 5. $parent / $children

- 使用`$parent`可以让组件访问父组件的实例（访问的是上一级父组件的属性和方法）
- 使用`$children`可以让组件访问子组件的实例，但是，`$children`并不能保证顺序，并且访问的数据也不是响应式的。



在子组件中：

```vue
<template>
  <div>
    <span>{{message}}</span>
    <p>获取父组件的值为:  {{parentVal}}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: 'Vue'
    }
  },
  computed:{
    parentVal(){
      return this.$parent.msg;
    }
  }
}
</script>
```

在父组件中：

```vue
// 父组件中
<template>
  <div class="hello_world">
    <div>{{msg}}</div>
    <child></child>
    <button @click="change">点击改变子组件值</button>
  </div>
</template>

<script>
import child from './child.vue'
export default {
  components: { child },
  data() {
    return {
      msg: 'Welcome'
    }
  },
  methods: {
    change() {
      // 获取到子组件
      this.$children[0].message = 'JavaScript'
    }
  }
}
</script>
```

在上面的代码中，子组件获取到了父组件的`parentVal`值，父组件改变了子组件中`message`的值。

**需要注意：**

- 通过`$parent`访问到的是上一级父组件的实例，可以使用`$root`来访问根组件的实例
- 在组件中使用`$children`拿到的是所有的子组件的实例，它是一个数组，并且是无序的
- 在根组件`#app`上拿`$parent`得到的是`new Vue()`的实例，在这实例上再拿`$parent`得到的是`undefined`，而在最底层的子组件拿`$children`是个空数组
- `$children` 的值是**数组**，而`$parent`是个**对象**



## 6. $attrs / $listeners

`$attrs`/`$listeners`

多级组件嵌套需要传递数据时，通常使用的方法是通过 vuex。但如果仅仅是传递数据，而不做中间处理，使用 vuex 处理，未免有点大材小用。为此 Vue2.4 版本提供了另一种方法----`$attrs`/`$listeners`

- `$attrs`：包含了父作用域中不被 prop 所识别 (且获取) 的特性绑定 (class 和 style 除外)。当一个组件没有声明任何 prop 时，这里会包含所有父作用域的绑定 (class 和 style 除外)，并且可以通过 v-bind="$attrs" 传入内部组件。通常配合 interitAttrs 选项一起使用。
- `$listeners`：包含了父作用域中的 (不含 .native 修饰器的) v-on 事件监听器。它可以通过 v-on="$listeners" 传入内部组件



## 7. vuex

vuex 是 vue 的状态管理器，存储的数据是响应式的。但是并不会保存起来，刷新之后就回到了初始状态，**具体做法应该在 vuex 里数据改变的时候把数据拷贝一份保存到 localStorage 里面，刷新之后，如果 localStorage 里有保存的数据，取出来再替换 store 里的 state。**

- `Vuex`作用相当于一个用来存储共享变量的容器
  ![image-20210907002226810](https://636c-cloud1-7g4dud13a1b0dc04-1305490742.tcb.qcloud.la/image-20210907002226810.png?sign=eb047f5940cf239492d33ffe9a428605&t=1641039748)
- `state`用来存放共享变量的地方
- `getter`，可以增加一个`getter`派生状态，(相当于`store`中的计算属性），用来获得共享变量的值
- `mutations`用来存放修改`state`的方法。
- `actions`也是用来存放修改state的方法，不过`action`是在`mutations`的基础上进行。常用来做一些异步操作



## 8. 总结

**（1）父子组件间通信**

- 子组件通过 props 属性来接受父组件的数据，然后父组件在子组件上注册监听事件，子组件通过 emit 触发事件来向父组件发送数据。
- 通过 ref 属性给子组件设置一个名字。父组件通过 $refs 组件名来获得子组件，子组件通过 $parent 获得父组件，这样也可以实现通信。
- 使用 provide/inject，在父组件中通过 provide提供变量，在子组件中通过 inject 来将变量注入到组件中。不论子组件有多深，只要调用了 inject 那么就可以注入 provide中的数据。

**（2）兄弟组件间通信**

- 使用 eventBus 的方法，它的本质是通过创建一个空的 Vue 实例来作为消息传递的对象，通信的组件引入这个实例，通信的组件通过在这个实例上监听和触发事件，来实现消息的传递。
- 通过 $parent/$refs 来获取到兄弟组件，也可以进行通信。

**（3）任意组件之间**

- 使用 eventBus ，其实就是创建一个事件中心，相当于中转站，可以用它来传递事件和接收事件。



如果业务逻辑复杂，很多组件之间需要同时处理一些公共的数据，这个时候采用上面这一些方法可能不利于项目的维护。这个时候可以使用 vuex ，vuex 的思想就是将这一些公共的数据抽离出来，将它作为一个全局的变量来管理，然后其他组件就可以对这个公共数据进行读写操作，这样达到了解耦的目的。



# 四、路由

## 1. Vue-Router 的懒加载如何实现

非懒加载：

```js
import List from '@/components/list.vue'
const router = new VueRouter({
    routes: [
        { path: '/list', components: List }
    ]
})
```

**方案一（常用）使用箭头函数 + import 动态加载**

```js
const List = () => import('@/components/list.vue')
const router = new VueRouter({
  routes: [
    { path: '/list', component: List }
  ]
})
```

**方案二：使用箭头函数 + require 动态加载**

```js
const router = new Router({
  routes: [
   {
     path: '/list',
     component: resolve => require(['@/components/list'], resolve)
   }
  ]
})
```

**方案三：使用webpack的require.ensure技术，也可以实现按需加载。 这种情况下，多个路由指定相同的chunkName，会合并打包成一个js文件。**

```js
// r就是resolve
const List = r => require.ensure([], () => r(require('@/components/list')), 'list');
// 路由也是正常的写法  这种是官方推荐的写的 按模块划分懒加载 
const router = new Router({
  routes: [
  {
    path: '/list',
    component: List,
    name: 'list'
  }
 ]
}))
```



## 2. 路由的 hash 和 history 模式的区别

Vue-Router有两种模式：**hash模式**和**history模式**。默认的路由模式是hash模式。

1. hash模式，带#。如：`http://localhost:8080/#/pageA`。改变hash，<u>浏览器本身不会有任何请求服务器动作的</u>，但是页面状态和 url 已经关联起来了。

   1. **原理**：通过 onhashchange 来监听 hash 的改变，window 则按规则加载相应的代码。

      ```js
      window.onhashchange = function(event){
          console.log(event.oldURL, event.newURL);
          let hash = location.hash.slice(1);
      }
      ```

2. history模式，不带#， 如：`http://localhost:8080/` 正常的而路径，并没有#。<u>基于HTML5的 pushState、replaceState 实现</u>，这两个方法应用于浏览器的历史记录栈，提供了对历史记录进行修改的功能（虽然修改了 url，但浏览器不会向后端发送请求）。

   1. 虽然history模式丢弃了丑陋的#。但是，它也有自己的缺点，就是在刷新页面的时候，如果没有相应的路由或资源，就会刷出404来。



调用 history.pushState() 相比于直接修改 hash，存在以下优势:

- pushState() 设置的新 URL 可以是与当前 URL 同源的任意 URL；而 hash 只可修改 # 后面的部分，因此只能设置与当前 URL 同文档的 URL；
- pushState() 设置的新 URL 可以与当前 URL 一模一样，这样也会把记录添加到栈中；而 hash 设置的新值必须与原来不一样才会触发动作将记录添加到栈中；
- pushState() 通过 stateObject 参数可以添加任意类型的数据到记录中；而 hash 只可添加短字符串；
- pushState() 可额外设置 title 属性供后续使用。
- hash模式下，仅hash符号之前的url会被包含在请求中，后端如果没有做到对路由的全覆盖，也不会返回404错误；history模式下，前端的url必须和实际向后端发起请求的url一致，如果没有对用的路由处理，将返回404错误。

hash模式和history模式都有各自的优势和缺陷，还是要根据实际情况选择性的使用。



## 3. 如何获取页面的 hash 变化

1. **监听 $route 的变化**

   ```vue
   // 监听,当路由发生变化的时候执行
   watch: {
     $route: {
       handler: function(val, oldVal){
         console.log(val);
       },
       // 深度观察监听
       deep: true
     }
   },
   ```

2. **window.location.hash 读取 # 值**

   window.location.hash 的值可读可写，读取来判断状态是否改变，写入时可以在不重载网页的前提下，添加一条历史访问记录。



## 4. $route 和 $router 的区别

- $route 是“路由信息对象”，包括 path，params，hash，query，fullPath，matched，name 等路由信息参数
- $router 是“路由实例”对象包括了路由的跳转方法，钩子函数等。



## 5. 如何定义动态路由？如何获取传递过来的动态参数？

### param 方式

- 配置路由格式：`/router/:id`
- 传递的方式：在path后面跟上对应的值
- 传递后形成的路径：`/router/123`

1）路由定义

```js
//在APP.vue中
<router-link :to="'/user/'+userId" replace>用户</router-link>    

//在index.js
const routes = [{
   path: '/user/:userid',
   component: User,
}]
```

2）路由跳转

```js
// 方法1：
<router-link :to="{ name: 'users', params: { uname: wade }}">按钮</router-link>

// 方法2：
this.$router.push({name:'users',params:{uname:wade}})

// 方法3：
this.$router.push('/user/' + wade)
```

3）参数获取

通过 `$route.params.userid` 获取传递的值



### query 方式

- 配置路由格式：`/router`，也就是普通配置
- 传递的方式：对象中使用query的key作为传递方式
- 传递后形成的路径：`/route?id=123`

1）路由定义

```js
//方式1：直接在router-link 标签上以对象的形式
<router-link :to="{path:'/profile',query:{name:'why',age:28,height:188}}">档案</router-link>

// 方式2：写成按钮以点击事件形式
<button @click='profileClick'>我的</button>    

profileClick(){
  this.$router.push({
    path: "/profile",
    query: {
        name: "kobi",
        age: "28",
        height: 198
    }
  });
}
```

2）跳转方法

```js
// 方法1：
<router-link :to="{ name: 'users', query: { uname: james }}">按钮</router-link>

// 方法2：
this.$router.push({ name: 'users', query:{ uname:james }})

// 方法3：
<router-link :to="{ path: '/user', query: { uname:james }}">按钮</router-link>

// 方法4：
this.$router.push({ path: '/user', query:{ uname:james }})

// 方法5：
this.$router.push('/user?uname=' + jsmes)
```

3）获取参数

```js
通过$route.query 获取传递的值
```

> 问题:vue-router 组件复用导致路由参数失效怎么办？

解决方法：

1.通过 watch 监听路由参数再发请求

```javascript
watch: { //通过watch来监听路由变化
 "$route": function(){
 this.getData(this.$route.params.xxx);
 }
}
```

2.用 :key 来阻止“复用”

```html
<router-view :key="$route.fullPath" />
```



## 6. Vue-router 路由钩子在生命周期的体现

### 1. Vue-Router导航守卫

有的时候，需要通过路由来进行一些操作，比如最常见的登录权限验证，当用户满足条件时，才让其进入导航，否则就取消跳转，并跳到登录页面让其登录。

为此有很多种方法可以植入路由的导航过程：<u>全局的</u>，单个<u>路由独享</u>的，或者<u>组件级</u>的

#### 全局路由钩子

`vue-router` 全局有三个路由钩子;

- `router.beforeEach` 全局前置守卫 进入路由之前
- `router.beforeResolve` 全局解析守卫（2.5.0+），在导航被确认前，且组件内守卫和异步路由组件解析完成之后调用
- `router.afterEach` 全局后置钩子 进入路由之后

**具体使用∶**

-  `beforeEach`（判断是否登录了，没登录就跳转到登录页）

```js
router.beforeEach((to, from, next) => {  
    let ifInfo = Vue.prototype.$common.getSession('userData');  // 判断是否登录的存储信息
    if (!ifInfo) { 
        // sessionStorage里没有储存user信息    
        if (to.path == '/') { 
            //如果是登录页面路径，就直接next()      
            next();    
        } else { 
            //不然就跳转到登录      
            Message.warning("请重新登录！");     
            window.location.href = Vue.prototype.$loginUrl; 
        }  
    } else {    
        return next();  
    }
})
```

- `afterEach` （跳转之后滚动条回到顶部）

```js
router.afterEach((to, from) => {  
    // 跳转之后滚动条回到顶部  
    window.scrollTo(0,0);
});
```



#### 单个路由独享钩子

**beforeEnter**

如果<u>不想全局配置守卫的话</u>，可以<u>为某些路由单独配置守卫</u>，有三个参数∶ `to、from、next`

```js
export default [    
    {        
        path: '/',        
        name: 'login',        
        component: login,        
        beforeEnter: (to, from, next) => {          
            console.log('即将进入登录页面')          
            next()        
        }    
    }
]
```



#### 路由组件钩子

`beforeRouteUpdate`、`beforeRouteEnter`、`beforeRouteLeave`

这三个钩子都有三个参数∶`to、from、next`

- `beforeRouteEnter`∶ 渲染组件对应路由被 confirm 前调用；**获取不到组件实例的`this`**；在组件 beforeCreated 之前调用；
- `beforeRouteUpdate`∶ 当前地址改变并且改**组件被复用时触发**，举例来说，带有动态参数的路径foo/∶id，在 /foo/1 和 /foo/2 之间跳转的时候，由于会渲染同样的 foo 组件，这个钩子在这种情况下就会被调用
- `beforeRouteLeave`∶ 离开组件被调用，可以访问到组件实例的 this

注意点，beforeRouteEnter组件内还访问不到this，因为该守卫执行前组件实例还没有被创建，需要传一个回调给 next来访问，例如：

```js
beforeRouteEnter(to, from, next) {      
    next(target => {        
        if (from.path == '/classProcess') {          
            target.isFromProcess = true        
        }      
    })    
}
```

### 2. Vue路由钩子在生命周期函数的体现

#### 完整的路由导航解析流程（不包括其他生命周期）

- 触发进入其他路由。
- 调用要离开路由的组件守卫 `beforeRouteLeave`
- 调用局前置守卫∶ `beforeEach`
- 在重用的组件里调用 `beforeRouteUpdate`
- 调用路由独享守卫 `beforeEnter`。
- 解析异步路由组件。
- 在将要进入的路由组件中调用 `beforeRouteEnter`
- 调用全局解析守卫 `beforeResolve`
- 导航被确认。
- 调用全局后置钩子的 `afterEach` 钩子。
- 触发DOM更新（mounted）。
- 执行 `beforeRouteEnter` 守卫中传给 `next` 的回调函数



#### 触发钩子的完整顺序

路由导航、keep-alive、和组件生命周期钩子结合起来的，触发顺序，假设是从 a 组件离开，第一次进入 b 组件∶

- beforeRouteLeave：路由组件的组件离开路由前钩子，可取消路由离开。
- beforeEach：路由全局前置守卫，可用于登录验证、全局路由loading等。
- beforeEnter：路由独享守卫
- beforeRouteEnter：路由组件的组件进入路由前钩子。
- beforeResolve：路由全局解析守卫
- afterEach：路由全局后置钩子
- beforeCreate：组件生命周期，不能访问tAis。
- created：组件生命周期，可以访问tAis，不能访问dom。
- beforeMount：组件生命周期
- deactivated：离开缓存组件 a，或者触发 a 的 beforeDestroy 和destroyed 组件销毁钩子。
- mounted：访问/操作dom。
- activated：进入缓存组件，进入a的嵌套子组件（如果有的话）。
- 执行 beforeRouteEnter 回调函数next。



#### 导航行为被触发到导航完成的整个过程

- 导航行为被触发，此时导航未被确认。
- 在失活的组件里调用离开守卫 beforeRouteLeave。
- 调用全局的 beforeEach守卫。
- 在重用的组件里调用 beforeRouteUpdate 守卫(2.2+)。
- 在路由配置里调用 beforeEnte。 
- 解析异步路由组件（如果有）。
- 在被激活的组件里调用 beforeRouteEnter。
- 调用全局的 beforeResolve 守卫（2.5+），标示解析阶段完成。
- 导航被确认。
- 调用全局的 afterEach 钩子。
- 非重用组件，开始组件实例的生命周期：beforeCreate & created、beforeMount & mounted
- 触发 DOM 更新。
- 用创建好的实例调用 beforeRouteEnter 守卫中传给 next 的回调函数。
- 导航完成



## 7. Vue-router 跳转和 location.href 有什么区别

1. vue-router 使用 pushState 进行路由更新，静态跳转，页面不会重新加载；location.href 会触发浏览器，页面重新加载一次。
2. vue-router 使用 diff 算法，实现按需加载，减少 dom 操作。
3. vue-router 是路由跳转或同一个页面跳转，location.href 是不同页面间跳转。
4. vue-router 是异步加载 this.$nextTick(() => {获取 url})，location.href 是同步加载。



## 8. params 和 query 的区别

**用法**：query要用path来引入，params要用name来引入，接收参数都是类似的，分别是 `this.$route.query.name` 和 `this.$route.params.name` 。

**url地址显示**：query更加类似于ajax中get传参，params则类似于post，说的再简单一点，前者在浏览器地址栏中显示参数，后者则不显示。

**注意**：query刷新不会丢失query里面的数据 params刷新会丢失 params里面的数据。



## 9. vue-router 导航守卫有哪些

- 全局前置/钩子：beforeEach、beforeResolve、afterEach
- 路由独享的守卫：beforeEnter
- 组件内的守卫：beforeRouteEnter、beforeRouteUpdate、beforeRouteLeave



## 10. 对前端路由的理解

在前端技术早期，一个 url 对应一个页面，如果要从 A 页面切换到 B 页面，那么必然伴随着页面的刷新。这个体验并不好，不过在最初也是无奈之举——用户只有在刷新页面的情况下，才可以重新去请求数据。



后来，改变发生了——Ajax 出现了，它允许人们在不刷新页面的情况下发起请求；与之共生的，还有“不刷新页面即可更新页面内容”这种需求。在这样的背景下，出现了 **SPA（单页面应用**）。



SPA极大地提升了用户体验，它允许页面在不刷新的情况下更新页面内容，使内容的切换更加流畅。但是在 SPA 诞生之初，人们并没有考虑到“定位”这个问题——在内容切换前后，页面的 URL 都是一样的，这就带来了两个问题：

- SPA 其实并不知道当前的页面“进展到了哪一步”。可能在一个站点下经过了反复的“前进”才终于唤出了某一块内容，但是此时只要刷新一下页面，一切就会被清零，必须重复之前的操作、才可以重新对内容进行定位——SPA 并不会“记住”你的操作。
- 由于有且仅有一个 URL 给页面做映射，这对 SEO 也不够友好，搜索引擎无法收集全面的信息



为了解决这个问题，前端路由出现了。



前端路由可以帮助我们在仅有一个页面的情况下，“记住”用户当前走到了哪一步——为 SPA 中的各个视图匹配一个唯一标识。这意味着用户前进、后退触发的新内容，都会映射到不同的 URL 上去。此时即便他刷新页面，因为当前的 URL 可以标识出他所处的位置，因此内容也不会丢失。



那么如何实现这个目的呢？首先要解决两个问题：

- 当用户刷新页面时，浏览器会默认根据当前 URL 对资源进行重新定位（发送请求）。这个动作对 SPA 是不必要的，因为我们的 SPA 作为单页面，无论如何也只会有一个资源与之对应。此时若走正常的请求-刷新流程，反而会使用户的前进后退操作无法被记录。
- 单页面应用对服务端来说，就是一个URL、一套资源，那么如何做到用“不同的URL”来映射不同的视图内容呢？



从这两个问题来看，服务端已经完全救不了这个场景了。所以要靠咱们前端自力更生，不然怎么叫“前端路由”呢？作为前端，可以提供这样的解决思路：

- 拦截用户的刷新操作，避免服务端盲目响应、返回不符合预期的资源内容。把刷新这个动作完全放到前端逻辑里消化掉。
- 感知 URL 的变化。这里不是说要改造 URL、凭空制造出 N 个 URL 来。而是说 URL 还是那个 URL，只不过我们可以给它做一些微小的处理——这些处理并不会影响 URL 本身的性质，不会影响服务器对它的识别，只有我们前端感知的到。一旦我们感知到了，我们就根据这些变化、用 JS 去给它生成不同的内容。



# 五、Vuex

## 1. Vuex 基本流程

Vuex是专门为Vuejs应用程序设计的**状态管理工具**。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。

![image-20210907155134365](https://636c-cloud1-7g4dud13a1b0dc04-1305490742.tcb.qcloud.la/image-20210907155134365.png?sign=6c53c0b700a3c91d152d050049222536&t=1641039765)

Vuex 为 Vue Components 建立起了一个完整的生态圈。

**核心流程中的主要功能：**

- Vue Components 是 vue 组件，组件会触发（dispatch）一些事件或动作，也就是图中的 Actions;
- 在组件中发出的动作，肯定是想获取或者改变数据的，但是在 vuex 中，数据是集中管理的，不能直接去更改数据，所以会把这个动作提交（Commit）到 Mutations 中;
- 然后 Mutations 就去改变（Mutate）State 中的数据;
- 当 State 中的数据被改变之后，就会重新渲染（Render）到 Vue Components 中去，组件展示更新后的数据，完成一个流程。



**各模块在核心流程中的主要功能：**

- `Vue Components`∶ Vue组件。HTML页面上，负责接收用户操作等交互行为，执行dispatch方法触发对应action进行回应。
- `dispatch`∶操作行为触发方法，是唯一能执行action的方法。
- `actions`∶ 操作行为处理模块。负责处理Vue Components接收到的所有交互行为。包含同步/异步操作，支持多个同名方法，按照注册的顺序依次触发。向后台API请求的操作就在这个模块中进行，包括触发其他action以及提交mutation的操作。该模块提供了Promise的封装，以支持action的链式触发。
- `commit`∶状态改变提交操作方法。对mutation进行提交，是唯一能执行mutation的方法。
- `mutations`∶状态改变操作方法。是Vuex修改state的唯一推荐方法，其他修改方式在严格模式下将会报错。该方法只能进行同步操作，且方法名只能全局唯一。操作之中会有一些hook暴露出来，以进行state的监控等。
- `state`∶ 页面状态管理容器对象。集中存储Vuecomponents中data对象的零散数据，全局唯一，以进行统一的状态管理。页面显示所需的数据从该对象中进行读取，利用Vue的细粒度数据响应机制来进行高效的状态更新。
- `getters`∶ state对象读取方法。图中没有单独列出该模块，应该被包含在了render中，Vue Components通过该方法读取全局state对象。



## 2. Vuex 的 action 和 mutation 的区别

mutation 中的操作是一系列的**同步函数**，用于修改 state 中的变量的的状态。当使用 vuex 时需要通过 commit 来提交需要操作的内容。mutation 非常类似于事件：每个 mutation 都有一个字符串的 事件类型 (type) 和 一个 回调函数 (handler)。这个回调函数就是实际进行状态更改的地方，并且它会接受 state 作为第一个参数：

```js
const store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    increment (state) {
      state.count++      // 变更状态
    }
  }
})
```

当触发一个类型为 increment 的 mutation 时，需要调用此函数：

```js
store.commit('increment')
```

而 Action 类似于 mutation，不同点在于：

- Action 可以**包含任意异步操作**。
- Action 提交的是 mutation，而<u>不是直接变更状态</u>。

```js
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  actions: {
    increment (context) {
      context.commit('increment')
    }
  }
})
```

Action 函数接受一个与 store 实例具有相同方法和属性的 context 对象，因此你可以调用 context.commit 提交一个 mutation，或者通过 context.state 和 context.getters 来获取 state 和 getters。

所以，两者的不同点如下：

- **Mutation 专注于修改 State**，理论上是修改 State 的唯一途径；**Action 专注于业务代码、异步请求**。
- Mutation：必须同步执行；Action：可以异步，但不能直接操作State。
- 在视图更新时，先触发 actions，actions 再触发 mutation
- mutation 的参数是 state，它包含 store中 的数据；store 的参数是context，它是 state 的父级，包含 state、getters。



## 3. Vuex 和 localStorage 的区别

1. **最重要的区别**
   1. vuex 存储在内存中
   2. localStorage 则以文件的方式存储在本地，只能存储字符串类型的数据，存储对象需要 JSON 的 stringfy 和 parse 方法进行处理。读取内存比读取硬盘速度要快
2. **应用场景**
   1. vuex 是一个专门为 vuejs 应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。vuex 用于组件之间传值。
   2. localStroage 是本地存储，是将数据存储到浏览器的方法，一般是在跨页面传递数据时使用。
   3. Vuex 能做到数据的响应式，localStorage 不能。
3. **永久性**
   1. 刷新页面时 vuex 存储的值会丢失，localStorage 不会。



## 4. Redux 和 Vuex 有什么区别，它们的共同思想

### Redux 和 Vuex 的区别

1. Vuex 改进了 Redux 中的 Action 和 Reducer 函数，以 mutations 变化函数取代 Reducer，无需 switch ，只需在对应的 mutation 函数里改变 state 值即可
2. Vuex 由于 Vue 自动重新渲染的特性，无需订阅重新渲染函数，只要生成新的 State 即可
3. Vuex 数据流的顺序是∶View 调用 store.commit 提交对应的请求到Store 中对应的 mutation 函数 -> store 改变（ vue 检测到数据变化自动渲染

通俗点理解就是，vuex 弱化 dispatch，通过 commit 进行 store 状态的一次更变；取消了action 概念，不必传入特定的 action 形式进行指定变更；弱化reducer，基于 commit 参数直接对数据进行转变，使得框架更加简易。



### 共同思想

1. 单一的数据源
2. 变化可以<u>预测</u>

**本质上**：redux 与 vuex 都是对 mvvm 思想的服务，将数据从视图中抽离的一种方案；

**形式上**：vuex 借鉴了 redux，将 store 作为全局的数据中心，进行 mode 管理。



## 5. 为什么要用 Vuex 或者 Redux

由于传参的方法对于<u>多层嵌套</u>的组件将会<u>非常繁琐</u>，并且对于兄弟组件间的状态传递无能为力。我们经常会采用父子组件直接引用或者通过事件来变更和同步状态的多份拷贝。以上的这些模式非常脆弱，通常会导致代码无法维护。

所以需要<u>把组件的共享状态抽取出来</u>，以一个全局单例模式管理。在这种模式下，组件树构成了一个巨大的"视图"，<u>不管在树的哪个位置，任何组件都能获取状态或者触发行为</u>。

另外，通过定义和隔离状态管理中的各种概念并强制遵守一定的规则，代码将会变得更结构化且易维护。



## 6. Vuex 有哪几种属性？

有五种，分别是 State、 Getter、Mutation 、Action、 Module

- State：定义了应用状态的数据结构，可以在这里设置默认的初始状态（数据源存放地）。
- Getter：允许组件从 Store 中获取数据，mapGetters 辅助函数仅仅是将 store 中的 getter 映射到局部计算属性。
- Mutation：是唯一更改 store 中状态的方法，且必须是同步函数。
- Action：用于提交 mutation，而不是直接变更状态，可以包含任意异步操作。
- Module：允许将单一的 Store 拆分为多个 store 且同时保存在单一的状态树中。



## 7. Vuex 和单纯的全局对象有什么区别？

1. vuex 用于做状态管理，主要是应用于 vue.js 中管理数据状态的一个库，通过创建一个集中的数据存储，供程序中所有组件访问，实现组件之间的传值。并且一个组件的数据变化会映射到使用这个数据的其他组件。
2. vuex 由统一的方法修改数据，全局变量可以任意修改。
3. 全局变量多了会造成命名污染，vuex 不会，同时解决了父组件与孙组件，以及兄弟组件之间通信的问题。

## 8. 为什么 Vuex 的 mutation 中不能做异步操作？

1. 因为更改state的函数必须是纯函数，纯函数既是统一输入就会统一输出，没有任何副作用；
2. 如果是异步则会引入额外的副作用，导致更改后的state不可预测；



## 9. Vuex 的严格模式是什么，有什么作用，如何开启？

在严格模式下，无论何时发生了状态变更且不是由mutation函数引起的，将会抛出错误。这能保证所有的状态变更都能被调试工具跟踪到。



在Vuex.Store 构造器选项中开启,如下

```JS
const store = new Vuex.Store({
    strict:true,
})
```



## 10. 如何在组件中批量使用 vuex 的 getter 属性

使用 mapGetters 辅助函数, 利用对象展开运算符将 getter 混入 computed 对象中

```js
import {mapGetters} from 'vuex'
export default{
    computed:{
        ...mapGetters(['total','discountTotal'])
    }
}
```



## 11. 如何在组件中重复使用 vuex 的 mutation

使用 mapMutations 辅助函数,在组件中这么使用

```js
import { mapMutations } from 'vuex'
methods:{
    ...mapMutations({
        setNumber:'SET_NUMBER',
    })
}
```

然后调用`this.setNumber(10)`相当调用 `this.$store.commit('SET_NUMBER',10)`



## 12. Vuex 页面刷新数据丢失怎么解决？

需要做 vuex 数据持久化 一般使用本地存储的方案来保存数据 可以自己设计存储方案 也可以使用第三方插件

推荐使用 vuex-persist 插件，它就是为 Vuex 持久化存储而生的一个插件。不需要你手动存取 storage ，而是直接将状态保存至 cookie 或者 localStorage 中



## 13. Vuex 为什么要分模块并且加命名空间

**模块**

​		由于使用单一状态树，应用的所有状态会集中到一个比较大的对象。当应用变得非常复杂时，store 对象就有可能变得相当臃肿（可读性和可维护性较差）。
​		为了解决以上问题，Vuex 允许我们将 store 分割成模块（module）。每个模块拥有自己的 state、mutation、action、getter、甚至是嵌套子模块。

```javascript
const moduleA = {
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: () => ({ ... }),
  mutations: { ... },
  actions: { ... }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> moduleA 的状态
store.state.b // -> moduleB 的状态
```

**命名空间**

​		默认情况下，模块内部的 action、mutation 和 getter 是注册在全局命名空间的——这样使得多个模块能够对同一 mutation 或 action 作出响应。如果希望你的模块具有更高的封装度和复用性，你可以通过添加 namespaced: true 的方式使其成为带命名空间的模块。当模块被注册后，它的所有 getter、action 及 mutation 都会自动根据模块注册的路径调整命名。

# 六、Vue3

## 1. vue3 有什么更新

- 响应式原理的改变 Vue3.x 使用 **Proxy** 取代 Vue2.x 版本的 Object.defineProperty
- 组件选项声明方式 Vue3.x 使用 Composition API，**setup** 是 Vue3.x 新增的一个选项， 他是组件内使用 Composition API 的入口。
- 模板语法变化 slot 具名插槽语法 自定义指令 v-model 升级
- 其它方面的更改
  - Suspense，允许在程序中等待异步组件时选然后备的内容
  - 支持 Fragment（**多个根节点**）
  - teleport，将插槽中的元素或组件传送到页面其他位置
  - 基于 treeshaking 优化，提供了更多的内置功能。



## 2. defineProperty 和 proxy 的区别

Vue 在实例初始化时遍历 data 中的所有属性，并使用 Object.defineProperty 把这些属性全部转化为 getter / setter。这样当追踪发生变化时，setter 会被自动调用。

> Object.defineProperty 是 ES5 中一个无法 shim 的特性，这也就是 Vue 不支持 IE8 以及更低版本浏览器的原因。

但是这样做有以下问题：

1. 添加或删除对象的属性时，Vue 检测不到。因为添加或删除的对象没有在初始化进行响应式处理，只能通过`$set` 来调用`Object.defineProperty()`处理。
2. 无法监控到数组下标和长度的变化。



Vue3 使用 Proxy 来监控数据的变化。Proxy 是 ES6 中提供的功能，其作用为：用于定义基本操作的自定义行为（如属性查找，赋值，枚举，函数调用等）。相对于`Object.defineProperty()`，其有以下**特点**：

1. Proxy **直接代理整个对象**而非对象属性，这样只需做一层代理就可以监听同级结构下的所有属性变化，<u>包括新增属性和删除属性</u>。
2. Proxy 可以监听数组的变化。



## 3. Vue3 为什么要用 Proxy

1. Object.defineProperty 只能遍历对象进行数据劫持，而 Proxy 直接可以劫持整个对象，并返回一个新对象，我们可以只操作新的对象达到响应式目的。
2. Proxy 可以直接监听整个数组的变化。
3. Proxy 有多达13种拦截方法，不限于 apply，ownKeys，deleteProperty，has 等等，这是 Object.defineProperty 不具备的（使得 Vue2 在实现响应式的时候需要实现其他辅助方法，eg：重写数组方法，增加额外的 set，delete 方法）
4. Proxy 不兼容 IE，也没有 polyfill，defineProperty 能支持到 IE9



## 4. Vue3 中的 Composition API

在 Vue2 中，代码是 Options API 风格的，也就是通过填充 (option) data、methods、computed 等属性来完成一个 Vue 组件。这种风格使得 Vue 相对于 React 极为容易上手，同时也造成了几个问题：

1. 由于 Options API 不够灵活的开发方式，使得Vue开发缺乏优雅的方法来在组件间共用代码。
2. Vue 组件过于依赖`this`上下文，Vue 背后的一些小技巧使得 Vue 组件的开发看起来与 JavaScript 的开发原则相悖，比如在`methods` 中的`this`竟然指向组件实例来不指向`methods`所在的对象。这也使得 TypeScript 在Vue2 中很不好用。

于是在 Vue3 中，舍弃了 Options API，转而投向 Composition API。Composition API本质上是将 Options API 背后的机制暴露给用户直接使用，这样用户就拥有了更多的灵活性，也使得 Vue3 更适合于 TypeScript 结合。



如下，是一个使用了 Vue Composition API 的 Vue3 组件：

```js
<template>
  <button @click="increment">
    Count: {{ count }}
  </button>
</template>
 
<script>
// Composition API 将组件属性暴露为函数，因此第一步是导入所需的函数
import { ref, computed, onMounted } from 'vue'
 
export default {
  setup() {
// 使用 ref 函数声明了称为 count 的响应属性，对应于Vue2中的data函数
    const count = ref(0)
 
// Vue2中需要在methods option中声明的函数，现在直接声明
    function increment() {
      count.value++
    }
 // 对应于Vue2中的mounted声明周期
    onMounted(() => console.log('component mounted!'))
 
    return {
      count,
      increment
    }
  }
}
</script>
```

显而易见，Vue Composition API 使得 Vue3 的开发风格更接近于原生 JavaScript，带给开发者更多地灵活性



## 5. Composition API与React Hook很像，区别是什么

从 React Hook 的实现角度看，React Hook 是根据 useState 调用的顺序来确定下一次重渲染时的 state 是来源于哪个 useState，所以出现了以下限制

- 不能在循环、条件、嵌套函数中调用 Hook
- 必须确保总是在你的React函数的顶层调用 Hook
- useEffect、useMemo 等函数必须手动确定依赖关系



而 Composition API 是基于 Vue 的响应式系统实现的，与 React Hook 的相比

- 声明在 setup 函数内，一次组件实例化只调用一次 setup，而 React Hook 每次重渲染都需要调用 Hook，使得 React 的 GC 比 Vue 更有压力，性能也相对于 Vue 来说也较慢
- Compositon API 的调用不需要顾虑调用顺序，也可以在循环、条件、嵌套函数中使用
- 响应式系统自动实现了依赖收集，进而组件的部分的性能优化由 Vue 内部自己完成，而 React Hook 需要手动传入依赖，而且必须必须保证依赖的顺序，让 useEffect、useMemo 等函数正确的捕获依赖变量，否则会由于依赖不正确使得组件性能下降。

虽然 Compositon API 看起来比 React Hook 好用，但是其设计思想也是借鉴 React Hook 的。



# 七、虚拟 DOM

## 1. 对虚拟 DOM 的理解

从本质上来说，Virtual DOM 是一个 JavaScript 对象，通过对象的方式来表示 DOM 结构。将页面的状态抽象为 JS 对象的形式，配合不同的渲染工具，使跨平台渲染成为可能。通过事务处理机制，将多次 DOM 修改的结果一次性的更新到页面上，从而有效减少页面渲染的次数，减少修改 DOM 的重排和重绘的次数，提高渲染性能。

虚拟 DOM 是对 DOM 的抽象，这个对象是对 DOM 的描述，这个对象是更加轻量级的对 DOM 的描述。他设计的最初目的，就是更好的跨平台，比如 Node.js 就没有 DOM ，如果想实现 SSR，那么，一个方式就是借助虚拟 DOM ，因为虚拟 DOM 本身就是 JS 对象。

在代码渲染到页面之前，vue 或者 rect 会把代码转换成一个对象（虚拟 DOM）。以对象的形式来描述真实的 DOM 结构，最终渲染到页面，在每次数据发生变化前，虚拟 DOM 都会缓存一份，变化之时现在的虚拟 DOM 会和缓存的虚拟 DOM 进行比较。

在 vue 或者 rect 内部封装了 diff 算法，通过这个算法，来进行比较，渲染时修改改变的变化，原先没有发生改变的通过原先的数据进行渲染。

另外，现代前端框架的一个基本要求就是无需手动操作 DOM ，一方面是因为手动操作 DOM 无法保证程序性能，多人协作的项目中如果 review 不严格，可能会有开发者写出性能较低的代码，另一方面更重要的是省略手动操作 DOM 可以大大提高开发效率。



## 2. 虚拟 DOM 的解析过程

虚拟DOM的解析过程：

- 首先对将要插入到文档中的 DOM 树结构进行分析，<u>使用 js 对象将其表示出来</u>，比如一个元素对象，包含 TagName、props 和 Children 这些属性。然后将这个 js 对象树给保存下来，最后再将 DOM 片段插入到文档中。
- 当页面的状态发生改变，需要对页面的 DOM 的结构进行调整的时候，首先根据变更的状态，重新构建起一棵对象树，然后<u>将这棵新的对象树和旧的对象树进行比较，记录下两棵树的的差异</u>。
- 最后将记录的有差异的地方应用到真正的 DOM 树中去，这样视图就更新了。



## 3. 为什么要用虚拟 DOM

**（1）保证性能下限，在不进行手动优化的情况下，提供过得去的性能**

看一下页面渲染的流程：**解析HTML -> 生成DOM** **->** **生成 CSSOM** **->** **Layout** **->** **Paint** **->** **Compiler**

下面对比一下修改DOM时真实DOM操作和Virtual DOM的过程，来看一下它们重排重绘的性能消耗∶

- 真实DOM∶ 生成HTML字符串＋重建所有的DOM元素
- 虚拟DOM∶ 生成vNode+ DOMDiff＋必要的dom更新



Virtual DOM的更新DOM的准备工作耗费更多的时间，也就是JS层面，相比于更多的DOM操作它的消费是极其便宜的。尤雨溪在社区论坛中说道∶ 框架给你的保证是，你不需要手动优化的情况下，依然可以给你提供过得去的性能。

**（2）跨平台**

Virtual DOM本质上是JavaScript的对象，它可以很方便的跨平台操作，比如服务端渲染、uniapp等。



## 4. 虚拟 DOM 真的比真实 DOM 性能好吗

- 首次渲染大量DOM时，由于多了一层虚拟DOM的计算，会比innerHTML插入慢。
- 正如它能保证性能下限，在真实DOM操作的时候进行针对性的优化时，还是更快的。



## 5. diff 算法原理

在新老虚拟DOM对比时：

- 首先，对比节点本身，判断是否为同一节点，如果不为相同节点，则删除该节点重新创建节点进行替换
- 如果为相同节点，进行 patchVnode，判断如何对该节点的子节点进行处理，先判断一方有子节点一方没有子节点的情况(如果新的children没有子节点，将旧的子节点移除)
- 比较如果都有子节点，则进行updateChildren，判断如何对这些新老节点的子节点进行操作（diff核心）。
- 匹配时，找到相同的子节点，递归比较子节点



在 diff 中，只对同层的子节点进行比较，放弃跨级的节点比较，使得时间复杂从O(n3)降低值O(n)，也就是说，只有当新旧 children 都为多个子节点时才需要用核心的 Diff 算法进行同层级比较。



## 6. Vue 中 key 的作用

vue 中 key 值的作用可以分为两种情况来考虑：

- **第一种情况是 v-if 中使用 key**。由于 Vue 会尽可能高效地渲染元素，通常会<u>复用已有元素</u>而不是从头开始渲染。因此当使用 v-if 来实现元素切换的时候，如果切换前后含有相同类型的元素，那么这个元素就会被复用。如果是相同的 input 元素，那么切换前后用户的输入不会被清除掉，这样是不符合需求的。因此可以<u>通过使用 key 来唯一的标识一个元素，这个情况下，使用 key 的元素不会被复用</u>。这个时候 **key 的作用是用来标识一个独立的元素**。
- **第二种情况是 v-for 中使用 key**。用 v-for 更新已渲染过的元素列表时，它默认使用“就地复用”的策略。如果数据项的顺序发生了改变，Vue 不会移动 DOM 元素来匹配数据项的顺序，而是简单复用此处的每个元素。因此通过为每个列表项提供一个 key 值，来以便 Vue 跟踪元素的身份，从而高效的实现复用。这个时候 key 的作用是为了高效的更新渲染虚拟 DOM。



key 是为 Vue 中 vnode 的唯一标记，通过这个 key，diff 操作可以更准确、更快速

- 更准确：因为带 key 就不是就地复用了，在 sameNode 函数 a.key === b.key 对比中可以<u>避免就地复用</u>的情况。所以会更加准确。
- 更快速：<u>利用 key 的唯一性生成 map 对象</u>来获取对应节点，比遍历方式更快



## 7. 为什么不建议用 index 作为 key

使用 index 作为 key 和没写基本上没区别，因为不管数组的顺序怎么颠倒，index 都是 0, 1, 2... 这样排列，导致 Vue 会复用错误的旧子节点，做很多额外的工作。
