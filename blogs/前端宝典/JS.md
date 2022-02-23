---
title: JavaScript
date: 2022-01-01
tags:
 - JS
categories:
 - 前端
---
## 1. JavaScript 有哪些数据类型，它们的区别？

JavaScript 是一门**弱类型/动态**语言。它变量的类型是**在程序运行过程中自动被确定**，这就意味着一个变量可以保存不同类型的数据。

8种数据类型：

- 6 种**原始类型**，使用 typeof 运算符检查:
  - [undefined](https://developer.mozilla.org/zh-CN/docs/Glossary/undefined)：`typeof instance === "undefined"`
  - [Boolean](https://developer.mozilla.org/zh-CN/docs/Glossary/Boolean)：`typeof instance === "boolean"`
  - [Number](https://developer.mozilla.org/zh-CN/docs/Glossary/Number)：`typeof instance === "number"`
  - [String](https://developer.mozilla.org/zh-CN/docs/Glossary/String)：`typeof instance === "string`
  - [BigInt](https://developer.mozilla.org/zh-CN/docs/Glossary/BigInt)：`typeof instance === "bigint"`
  - [Symbol](https://developer.mozilla.org/zh-CN/docs/Glossary/Symbol) ：`typeof instance === "symbol"`
- [null](https://developer.mozilla.org/zh-CN/docs/Glossary/Null)：`typeof instance === "object"`。
- [Object](https://developer.mozilla.org/zh-CN/docs/Glossary/Object)：`typeof instance === "object"`。任何 constructed 对象实例的特殊非数据结构类型，也用做数据结构：new [Object](https://developer.mozilla.org/zh-CN/docs/Glossary/Object)，new [Array](https://developer.mozilla.org/zh-CN/docs/Glossary/array)，new Map，new Set，new WeakMap，new WeakSet，new Date，和几乎所有通过 new keyword 创建的东西。

记住 `typeof` 操作符的**唯一目的**就是检查数据类型，如果我们希望检查任何从 Object 派生出来的结构类型，使用 `typeof` 是不起作用的，因为总是会得到 `"object"`。检查 Object 种类的合适方式是使用 instanceof 关键字。但即使这样也存在误差。

- **引用类型：**Object、Function
- **基本数据类型：**undefined（未定义）、null（空对象）、boolean、number、string、bigint、symbol

为何将数据类型**划分**为基本数据类型和引用数据类型？这是因为它们在内存中的**存储方式是不一样**的。 

- **基本数据类型**：占用空间小、空间大小固定，因此直接存放在**栈**中；
- **引用类型**：占用空间大、空间大小不固定，如果频繁创建则会造成性能问题，所以将实体数据放在**堆**中，**栈**只记录该实体数据的起始地址。



## 2. 数据类型检测的方式有哪些

1. **typeof**

   1. 能够正确判断基本数据类型
   2. 不易判断引用类型，数据、null、对象都会被判断为 object

2. **instanceof**

   1. 该运行原理为 **右操作数的 prototype 是否出现在左操作数的原型链上**。
   2. `instanceof` **只能正确判断引用数据类型**，不能判断基本数据类型，这是和 typeof 的区别。

3. **Object.prototype.toString.call()**

   1. 使用 Object 对象的原型方法 toString 方法来判断数据类型

   2. > 同样是检测对象 obj 调用 toString 方法，obj.toString() 的结果和Object.prototype.toString.call(obj) 的结果不一样，这是为什么？
      > 因为 数组、函数等都作为 Object 的实例，都重写了 toString 方法，因此先调用了被重写的 toString 方法，而重写的方法返回的不是具体类型。

4. **`constructor`**

   1. 有两个作用，一是判断数据的类型，二是对象实例通过 `constrcutor` 对象访问它的构造函数。

   2. 需要注意，如果创建一个对象来改变它的原型，`constructor`就不能用来判断数据类型了：

      ```js
      function Fn(){};
       
      Fn.prototype = new Array();
       
      var f = new Fn();
       
      console.log(f.constructor===Fn);    // false
      console.log(f.constructor===Array); // true
      ```

      

## 3. 判断数组的方式

1. Object.prototype.toString.call()
2. Array.isArray()
3. `arr.__proto__ === Array.prototype`
4. instanceof
5. Array.prototype.isPrototypeOf
6. constructor



## 4. typeof、 instanceof区别

`typeof` 一般被用于判断一个变量的类型，我们可以利用 `typeof` 来判断`number`，  `string`，  `object`，  `boolean`，  `function`， `undefined`，  `symbol` 这七种类型，在判断不是 object 类型的数据的时候，`typeof`能比较清楚的告诉我们具体是哪一类的类型。但对于object类型的数据则不能细致的具体到是哪一种 object， 比如

```javascript
let s = new String('abc');
typeof s === 'object'// true
s instanceof String // true
```

 `instanceof` 主要的作用就是判断一个实例是否属于某种类型，也可以判断一个实例是否是其父类型或者祖先类型的实例。 

A(变量) `instanceof` B（类型） 主要的实现原理就是在A的原型链向上查找 

```javascript
function _instanceof(left, right){
    let leftProto = left.__proto__
    let rightProto = right.prototyp
    if(leftProto === rightProto){
        return true
    }else if(leftProto === null){
        return false
    }else{
        return _instanceof(leftProto, right)
    }
}
```



## 5. null 和 undefined 的区别

首先，它们是 JS 的两种基本数据类型。

- **区别**：undefined 的含义是已声明但未定义（未赋值），null 的含义是空值，希望一个对象被人为的重置未空对象。
- undefined 在 js 中不是保留字，即可以使用 undefined 作为一个变量名，这是危险的做法。我们可以通过一些方法获取 undefined 值，如 void 0
- 当对这两种类型使用 typeof 进行判断时，Null 类型化会返回 “object”，这是一个历史遗留的问题。
- 当使用双等号对两种类型的值进行比较时会返回 true，使用三个等号时会返回 false。



## 6. typeof null 的结果是什么，为什么？

**结果是 **“object”

第一版的JavaScript是用32位比特来存储值的，且是通过值的低1位或3位（也就是**类型标记**）来识别类型的。其中**引用类型（object）的类型标记为 000，而 null 的低三位也是 000，所以误判 null 为 object**。



## 7. typeof NaN 的结果是什么

`typeof NaN`结果是“number”。

- NaN 表示“不是一个数字”，通常会在一个数字和其他运算过程中产生。

- NaN 和任何变量都不想等，包括 NaN 自己。

- 判断一个变量是不是 NaN 可以用 `isNaN()` 函数，ES6 中有更准确的方法 `Number.isNaN()

  

## 8. isNaN 和 Number.isNaN 函数的区别

- 函数 isNaN 接收参数后，**会尝试将这个参数转换为数值**，任何不能被转换为数值的的值（非数字值）都会返回 true，会影响 NaN 的判断。
- 函数 Number.isNaN 会首先判断传入参数是否为数字，如果是数字再继续判断是否为 NaN ，**不会进行数据类型的转换**，这种方法对于 NaN 的判断更为准确。



## 9. instanceof 操作符的实现原理及实现

**作用：**判断该实例是否属于某种类型

**实现原理：**查看右操作数的 prototype 是否在左操作数的原型链上

**实现：**

```js
function myInstanceof(instance, obj) {
    while(true) {
        if(!instance) return false;
        if(instance === obj.prototype) return true;
        instance = Object.getPrototypeOf(instance)
    }
}
```



## 10. 为什么 0.1+0.2 !== 0.3，如何让其相等

计算机是通过二进制数的方式存储数据的，所以计算 0.1 + 0.2 的时候，实际上计算的是两个数的二进制的和。0.1 和 0.2 转换成二进制是一串无限循环的二进制数，所以 JS 会对该二进制数进行截取，最后的结果转换成十进制数字是 `0.30000000000000004`。

**解决方法：**`(n1 + n2).toFixed(2)` 结果是 “0.30”



## 11. == 操作符的强制类型转换规则

1. 如果类型相同，调用 `===` 操作符

2. 如果类型不同，尝试类型转换

   - 1. 查看是否是 `undefined` 和 `null` 比较

     - ✅ 返回 `true`
     - ⬇️ 如果不是继续下一条规则

   - 1. 是否在比较 `string` 和 `number`

     - ✅ 如果是，那么将 `string` 转为 `number` 并回到最初重新比较 ♻️
     - ⬇️ 如果不是继续下一条规则

   - 1. 查看我们比较的项中是否有 `boolean`

     - ✅ 如果有，那么将 `boolean` 转为 `number` 并回到最初重新比较 ♻️
     - ⬇️ 如果不是继续下一条规则

   - 1. 查看是否有一项是 `object`

     - ✅ 如果有，那么将 `object` 转为其原始值 `primitive` 并回到最初重新比较 ♻️

     - ❌ 如果还不是，只能返回 `false` 了

       ![image-20210824232932567](https://636c-cloud1-7g4dud13a1b0dc04-1305490742.tcb.qcloud.la/image-20210824232932567.png?sign=77e4de22515b996bb0cd3348b34f59a3&t=1641025069)

## 12. 获取对象原始值

> 我们需要知道转换类型的这个方法在 JS 源代码中是 `ToPrimitive` 这个方法，该方法有一个可选参数 `PreferredType`，这个参数的作用是指定期望类型；如果第一个参数对应的对象可以被转换为不止一种类型，那么后者可以作为一种暗示，表示该对象应该转换为那种类型

- 默认情况下（期望类型默认为 `number`）
  - 调用 `valueOf` 方法：
    - ✅ 如果返回的是原始值，那么就用这个
    - ⬇️ 如果返回的不是原始值，那么跳到下一步
  - 调用 `toString` 方法：
    - ✅ 如果返回的是原始值，那么就用这个
    - ❌ 否则报错?
- 如果期望类型为 `string`：
  - 调用 `toString` 方法：
    - ✅ 如果返回的是原始值，那么就用这个
    - ⬇️ 如果返回的不是原始值，那么跳到下一步
  - 调用 `valueOf` 方法：
    - ✅ 如果返回的是原始值，那么就用这个
    - ❌ 否则报错?
- 如果对象是 Date 类型（期望类型为 `string`）：
  - 调用 `toString` 方法：
    - ✅ 如果返回的是原始值，那么就用这个
    - ⬇️ 如果返回的不是原始值，那么跳到下一步
  - 调用 `valueOf` 方法：
    - ✅ 如果返回的是原始值，那么就用这个
    - ❌ 否则报错?

简单的说就是默认调用 `valueOf` 方法，然后是 `toString` 方法；如果对象是 `Date` 类型或对象的期望类型为 `string`，那么先调用 `toString` 方法

例子：

![image-20210824232735702](https://636c-cloud1-7g4dud13a1b0dc04-1305490742.tcb.qcloud.la/image-20210824232735702.png?sign=1c16a4647e9966aaf25474670a8c6a36&t=1641025178)

普通的对象，首先调用 valueOf 方法，返回的结果并非原始值，那么会调用 toString 方法

![image-20210824232748839](https://636c-cloud1-7g4dud13a1b0dc04-1305490742.tcb.qcloud.la/image-20210824232748839.png?sign=6b707c64b8da6d68e323954c5c6616bf&t=1641025192)

假设我们重写 valueOf 方法，valueOf 和 toString 同时返回 string 原始值。使用 == 操作符可以看出，对象还是优先使用了 valueOf 方法返回的值

数组同理，首先默认调用 valueOf 方法，如不是原始值，则调用 toString 方法

![image-20210824232900614](https://636c-cloud1-7g4dud13a1b0dc04-1305490742.tcb.qcloud.la/image-20210824232900614.png?sign=975a1efa7cc2dafa9c387936cebd095a&t=1641025201)

再看看 Date 类型，他的期望类型是 string 因此首先调用的是 toString 方法，该方法返回一个原始值，那么就是用这个原始值



## 13. 其他类型转 number

下面我们来看看转换成 number 类型的规则：

1. `undefined` ➡ `NaN`。 如果是 undefined 则直接转换成 NaN
2. `null` ➡`0` 。如果是 null 则转换成 0
3. `boolean` ➡`0/1` 。如果是 boolean 则转换成 0 或 1
4. `string` ➡ `0/NaN/(parse to number)` 。如果是 string 则转换成对应的 number，空字符串转换为 0，无法转换的则为 NaN
5. `object` ： 首先获取原始值然后再转为 number
6. `Symbol` 类型的值不能转换为数字，会报错。



## 14. 其他类型转 string

1. `undefined` ➡`'undefined'`。
2. `null` ➡ `'null'`。
3. `number` ➡`'number'`。Number 类型的值直接转换，不过那些极小和极大的数字会使用指数形式。
4. `boolean` ➡ `'true'/'false'`
5. `object` ： 首先获取原始值，然后转为 string
6. `Symbol` 类型的值直接转换，但是只允许**显式强制类型转换**，使用隐式强制类型转换会产生错误。



## 15. 转为 boolean

❌下面这些在 JS 中都为 false除此之外的都是 true

1. `undefined`  ➡false
2. `null` ➡ false
3. `0` ➡ false
4. `""` ➡ false
5. `NaN` ➡ false
6. `false` ➡ false



## 16. || 和 && 操作符的返回值

|| 和 && 两个操作符首先会对第一个操作数执行条件判断，如果不是布尔值就先强制转换为布尔类型，然后再执行条件判断。

- 对于 || 来说，如果条件判断结果为 true 就返回第一个操作数的值，如果为 false 就返回第二个操作数的值。
- && 则相反，如果条件判断结果为 true 就返回第二个操作数的值，如果为 false 就返回第一个操作数的值。

|| 和 && 返回它们其中一个操作数的值，而非条件判断的结果



## 17. Object.is() 与比较操作符“\===”、“\==”的区别

- `==`两边的操作数如果类型不同，会进行类型转换，再进行比较；
- `===`如果类型不同，则直接返回 false、如果相同则进行值比较； 
- Object.is 类似于 `===`，但是在三等于号的基础，它多处理了一些特殊的情况，比如 -0 和 +0 不再相等，两个 NaN 是相等的。



## 18. 什么是 JavaScript 中的包装类型

**为了便于操作基本数据类型的值**，JavaScript 中的原始数据类型的值会在后台隐式地被包装为对象，从而引出了**基本包装类型（primitive wrapper type）**这个概念。

```javascript
var str = "hello world";
str.length;              // 11
str.toUpperCase();       // HELLO WORLD
```

我们看到的代码是上面的样子，其实后台会自动完成下列的处理：

- 执行到第二行时：
  - 创建 String 类型的一个实例；
  - 在实例上调用指定的**属性**；
  - 销毁这个实例；
- 执行到第三行时：
  - 创建 String 类型的一个实例；
  - 在实例上调用指定的**方法**；
  - 销毁这个实例；

**JavaScript也可以使用`Object`函数显式地将基本类型转换为包装类型：**

```js
var a = 'abc'
Object(a) // String {"abc"}
```

也可以使用`valueOf`方法将包装类型倒转成基本类型：

```js
var a = 'abc'
var b = Object(a)
var c = b.valueOf() // 'abc'
```



## 19. 引用类型与基本包装类型的区别

引用类型与基本包装类型的**主要区别就是对象的生存期。**

> 使用 `new` 操作符创建的引用类型的实例，在执行流离开当前作用域之前，会一直保存在**堆内存**中。而后台自动创建的基本包装类型的对象，则**只存在一行代码的执行瞬间，然后立即被销毁**。这意味着我们不能为基本类型的值添加属性和方法。



## 20.  JavaScript 中如何进行隐式类型转换？

首先要介绍`ToPrimitive`方法，这是 JavaScript 中每个值隐含的自带的方法，用来将值 （无论是基本类型值还是对象）转换为基本类型值。如果值为基本类型，则直接返回值本身；如果值为对象，其看起来大概是这样：

```js
/**
* @obj 需要转换的对象
* @type 期望的结果类型
*/
ToPrimitive(obj,type)
```

`type`的值为`number`或者`string`。

**（1）当`type`为`number`时规则如下：**

- 调用`obj`的`valueOf`方法，如果为原始值，则返回，否则下一步；
- 调用`obj`的`toString`方法，后续同上；
- 抛出`TypeError` 异常。

**（2）当`type`为`string`时规则如下：**

- 调用`obj`的`toString`方法，如果为原始值，则返回，否则下一步；
- 调用`obj`的`valueOf`方法，后续同上；
- 抛出`TypeError` 异常。

可以看出两者的主要区别在于调用`toString`和`valueOf`的先后顺序。默认情况下：

- 如果对象为 Date 对象，则`type`默认为`string`；
- 其他情况下，`type`默认为`number`。

总结上面的规则，对于 Date 以外的对象，转换为基本类型的大概规则可以概括为一个函数：

```js
var objToNumber = value => Number(value.valueOf().toString())
objToNumber([]) === 0
objToNumber({}) === NaN
```

而 JavaScript 中的隐式类型转换主要发生在`+、-、*、/`以及`==、>、<`这些运算符之间。而这些运算符只能操作基本类型值，所以在进行这些运算前的第一步就是将两边的值用`ToPrimitive`转换成基本类型，再进行操作。



以下是基本类型的值在不同操作符的情况下隐式转换的规则 （对于对象，其会被`ToPrimitive`转换成基本类型，所以最终还是要应用基本类型转换规则）：

1. +操作符`+`操作符的两边有至少一个`string`类型变量时，两边的变量都会被隐式转换为字符串；其他情况下两边的变量都会被转换为数字。

```js
1 + '23' // '123'
 1 + false // 1 
 1 + Symbol() // Uncaught TypeError: Cannot convert a Symbol value to a number
 '1' + false // '1false'
 false + true // 1
```

2. -、*、\操作符NaN也是一个数字

```js
1 * '23' // 23
 1 * false // 0
 1 / 'aa' // NaN
```

3. 对于**`==`**操作符

操作符两边的值都尽量转成`number`：

```js
3 == true // false, 3 转为number为3，true转为number为1
'0' == false //true, '0'转为number为0，false转为number为0
'0' == 0 // '0'转为number为0
```

4. 对于`<`和`>`比较符

如果两边都是字符串，则比较字母表顺序：

```js
'ca' < 'bd' // false
'a' < 'b' // true
```

其他情况下，转换为数字再比较：

```js
'12' < 13 // true
false > -1 // true
```

以上说的是基本类型的隐式转换，而对象会被`ToPrimitive`转换为基本类型再进行转换：

```js
var a = {}
a > 2 // false
```

其对比过程如下：

```js
a.valueOf() // {}, 上面提到过，ToPrimitive默认type为number，所以先valueOf，结果还是个对象，下一步
a.toString() // "[object Object]"，现在是一个字符串了
Number(a.toString()) // NaN，根据上面 < 和 > 操作符的规则，要转换成数字
NaN > 2 //false，得出比较结果
```

又比如：

```js
var a = {name:'Jack'}
var b = {age: 18}
a + b // "[object Object][object Object]"
```

运算过程如下：

```js
a.valueOf() // {}，上面提到过，ToPrimitive默认type为number，所以先valueOf，结果还是个对象，下一步
a.toString() // "[object Object]"
b.valueOf() // 同理
b.toString() // "[object Object]"
a + b // "[object Object][object Object]"
```



## 21. `+` 操作符什么时候用于字符串的拼接？

根据 ES5 规范，**如果某个操作数是字符串或者能够通过以下步骤转换为字符串的话，+ 将进行拼接操作**。如果其中一个操作数是对象（包括数组），则首先对其调用 ToPrimitive 抽象操作，该抽象操作再调用 [[DefaultValue]]，以数字作为上下文。如果不能转换为字符串，则会将其转换为数字类型来进行计算。

简单来说就是，如果 + 的其中一个操作数是字符串（或者通过以上步骤最终得到字符串），则执行字符串拼接，否则执行数字加法。

那么对于除了加法的运算符来说，只要其中一方是数字，那么另一方就会被转为数字。

**注意：**

为什么在不同环境 `{} + []` 下情况不同，有的是0，有的是“[object Object]"。因为有的环境把 {} 视为区块语句，而有的环境把 {} 视为字面量。



## 22. object.assign和扩展运算法是深拷贝还是浅拷贝，两者区别

扩展运算符：

```js
let outObj = {
  inObj: {a: 1, b: 2}
}
let newObj = {...outObj}
newObj.inObj.a = 2
console.log(outObj) // {inObj: {a: 2, b: 2}}
```

Object.assign():

```js
let outObj = {
  inObj: {a: 1, b: 2}
}
let newObj = Object.assign({}, outObj)
newObj.inObj.a = 2
console.log(outObj) // {inObj: {a: 2, b: 2}}
```



## 23. 函数this指向

有三种方式可以改变函数的this指向，分别是bind方法、apply方法和call方法

```javascript
function func(){
    console.log(this.name)
    console.log(argument)
}
//bind，调用bind方法不会执行原函数，而是会返回一个新函数
let newFunc = func.bind({name: 'john'})

//apply，第一个参数为函数的this指向，第二个参数是数组类型，作为原函数的参数列表
func.apply({name: 'judy'}, [1, 2])

//call，第一个参数为函数的this指向, 之后的参数作为参数列表传入原函数
func.call({name: 'jack'}, 1, 2)
```



## 24. 谈谈对于闭包的理解

闭包是由`函数`以及`声明该函数的词法环境`组合而成的。该环境包含了这个闭包创建时作用域内的任何局部变量（Chrome实测没有用到的外层变量会被回收，于MDN定义不符）

闭包的作用有：

- 实现私有变量，私有方法
- 实现函数柯里化



## 25. JavaScript 类数组对象的定义？

一个拥有 length 属性和若干索引属性的对象就可以被称为类数组对象，类数组对象和数组类似，但是不能调用数组的方法。常见的类数组对象有 arguments 和 DOM 方法的返回结果，函数也可以被看作是类数组对象，因为它含有 length 属性值，代表可接收的参数个数。

常见的类数组转换为数组的方法有这样几种：

（1）通过 call 调用数组的 slice 方法来实现转换

```
Array.prototype.slice.call(arrayLike);
```

（2）通过 call 调用数组的 splice 方法来实现转换

```
Array.prototype.splice.call(arrayLike, 0);
```

（3）通过 apply 调用数组的 concat 方法来实现转换

```
Array.prototype.concat.apply([], arrayLike);
```

（4）通过 Array.from 方法来实现转换

```
Array.from(arrayLike);
```

（5）使用ES6拓展运算符来实现转换

```javascript
const newArr = [...arrayLike]
```



## 26. 什么是尾调用，使用尾调用有什么好处？

尾调用指的是函数的最后一步调用另一个函数。代码执行是基于执行栈的，所以当在一个函数里调用另一个函数时，会保留当前的执行上下文，然后再新建另外一个执行上下文加入栈中。使用尾调用的话，因为已经是函数的最后一步，所以这时可以不必再保留当前的执行上下文，从而节省了内存，这就是尾调用优化。但是 ES6 的尾调用优化只在严格模式下开启，正常模式是无效的。



## 27. JS事件循环

JS是一种单线程的语言，所以它通过event loop机制实现了对异步任务和多线程。

1. 在主线程执行同步任务的时候，会形成一个执行栈；
2. 当主线程执行完执行栈中的同步任务，会先去执行微任务队列，执行过程中遇到微任务，直接放在队列的最后，直到执行完当前的微任务； 
3. 然后主线程去执行宏任务队列中的一个事件（如果最先来的事件还没返回结果，那就去看第二先来的事件是否准备就绪，如果准备就绪就先执行它，否则继续向下找）；在处理宏任务的过程中遇到微任务，会放入微任务队列中， 
4. 当该宏任务处理完成之后，会再去执行微任务队列中的事件，执行完成之后才会去宏任务队列中执行，这样就形成了EventLoop，重复这样的过程直到执行完所有的任务。

```javascript
console.log("script start")
setTimeout(() => {
    console.log("timeout1")
}, 0)

new Promise((resolve) => {
    console.log("promise start")
    resolve()
    console.log("promise end")
}).then(() => {
    console.log("then1")
    Promise.resolve().then(() => {
        console.log("then3")
    })
}).then(() => {
    console.log("then2")
})

async function func(){
    await Promise.resolve()
    console.log("async1")
}

func()

console.log("script end")

//打印顺序
//script start => promise start => promise end => script end => then1 => async1 => then3 => then2 => timeout1
```

- script脚本是一个宏任务，开始执行时打印 script start
- 执行settimeout函数，等待时间是0，立即将回调放入宏任务队列
- 执行Promise构造函数，传入构造函数的回调立即执行，打印promise start，然后修改状态为resolve, 继续打印promise end，返回一个状态为resolve的promise
- 执行第一个then，由于调用者的状态是resolve，将回调放入微任务队列，注意，回调仍为执行，因此第一个then返回的promsie状态为peddling，所以第二个then不能放入微任务队列
- 声明async函数并执行，由于await的表达式是一个状态resolve的promise，因此将一个回调放入微任务队列，该回调的作用是让async函数继续执行
- 打印script end，script脚本执行结束
- 此时微任务队列有两个任务，宏任务队列有一个任务
- 执行微任务队列的内容，第一个任务打印then1，然后又创建了一个resolve的promise，将then3的回调放入微任务队列，第一个任务执行完毕，第一个then的状态变为pedding，因此将then2的回调放入微任务队列
- 执行第二个微任务，使async函数继续执行，因此打印 async1
- 执行第三个微任务，打印then3
- 执行第四个微任务，打印then2
- 微任务队列已空，至此，第一个事件循环执行完毕，此时如果浏览器需要渲染界面的话，会先暂停JS的执行，运行GUI线程。
- 从宏任务队列中拿出一个任务执行，打印timeout1

从上面我们知道，在一个事件循环中先执行`一个`宏任务，然后执行微任务队列中的所有任务，执行过程中新添加进队列的微任务也会被执行，直到微任务队列为空。await后面的表达式完成后，在对应的微任务内所做的事就是恢复async函数的执行。



### 浏览器和Node 事件循环的区别？

浏览器和 Node v11以上是执行完一个宏任务就会去清空微任务队列；

Node v10及以下则是将同源的宏任务队列执行完毕后再去清空微任务队列；

**同源宏任务**

```javascript
let timer1 = setTimeout(() => {
    console.log('timer1')
    setTimeout(() => {
        console.log('timer3')
        setTimeout(() => {
            console.log('timer5')
        }, 0)
    }, 0)
}, 0)

let timer2 = setTimeout(() => {
    console.log('timer2')
    setTimeout(() => {
        console.log('timer4')
        setTimeout(() => {
            console.log('timer6')
        }, 0)
    }, 0)
}, 0)

//timer1和timer2是同源、timer3和timer4是同源、timer5和timer6是同y
//第一次循环执行timer1、timer2，第二次执行timer3、timer4 ······
```

另外,宏任务内若嵌套同源宏任务，仍会放进一个队列，但是执行将会放在下一次事件循环； 



## 28. JS脚本延迟加载的几种方式？

- **defer 属性**，表明脚本在执行时不会影响页面的构造。也就是说，脚本会被延迟到整个页面都解析完毕之后再执行（不影响下载行为）。支持 HTML5 的实现会忽略嵌入脚本设置的 defer属性。

- **async 属性**，与defer属性类似，都用于改变处理脚本的行为。不让页面等待脚本`下载和执行`(defer只限制执行，不限制下载)。

- **动态创建DOM方式**

  ```html
  <script type="text/javascript">  
     function downloadJSAtOnload() {  
         varelement = document.createElement("script");  
         element.src = "defer.js";  
         document.body.appendChild(element);  
     }  
     if (window.addEventListener)  
        window.addEventListener("load",downloadJSAtOnload, false);  
     else if (window.attachEvent)  
        window.attachEvent("onload",downloadJSAtOnload);  
     else 
        window.onload =downloadJSAtOnload;  
  </script> 
  ```

- **jQuery的getScript()**，

  ```javascript
  $.getScript("outer.js", function(){//回调函数，成功获取文件后执行的函数  
        console.log("脚本加载完成")  
  });
  ```

- **使用setTimeout延迟方法**

- **让JS最后加载**，把外部引入的 JS 文件放到页面底部，从而让 JS 最后执行，加快页面加载速度。



## 29. ajax、axios、fetch的区别

**（1）AJAX**

Ajax能在无需重新加载整个网页的情况下，通过在后台与服务器进行少量数据交换，在不重新加载整个网页的情况下，对网页的某部分进行更新。其缺点如下：

- 本身是针对MVC编程，不符合前端MVVM的浪潮
- 基于原生XHR开发，XHR本身的架构不清晰
- 不符合关注分离（Separation of Concerns）的原则
- 配置和调用方式非常混乱，而且基于事件的异步模型不友好。



**（2）Fetch**

fetch号称是AJAX的替代品，是在ES6出现的，使用了ES6中的promise对象。Fetch是基于promise设计的。Fetch的代码结构比起ajax简单多。**fetch不是ajax的进一步封装，而是原生js，没有使用XMLHttpRequest对象**。

fetch的优点：

- 语法简洁，更加语义化
- 基于标准 Promise 实现，支持 async/await
- 更加底层，提供的API丰富（request, response）
- 脱离了XHR，是ES规范里新的实现方式

fetch的缺点：

- fetch只对网络错误报错，对400，500都当做成功的请求，服务器返回 400，500 错误码时并不会 reject，只有网络错误这些导致请求不能完成时，fetch 才会被 reject。
- fetch不支持abort，不支持超时控制，使用setTimeout及Promise.reject的实现的超时控制并不能阻止请求过程继续在后台运行，造成了流量的浪费
- fetch没有办法原生监测请求的进度，而XHR可以

**（3）Axios**

Axios 是一种基于Promise封装的HTTP客户端，其特点如下：

- 浏览器端发起XMLHttpRequests请求
- node端发起http请求
- 支持Promise API
- 监听请求和返回
- 对请求和返回进行转化
- 取消请求
- 自动转换json数据
- 客户端支持抵御XSRF攻击



## 30. 观察者模式和订阅-发布模式的区别，各自适用于什么场景？

观察者模式中主体和观察者是`互相感知`的，发布-订阅模式是借助`第三方`来实现调度的，发布者和订阅者之间互不感知 

**适用场景**

发布-订阅模式适合更复杂的场景。

在「一对多」的场景下，发布者的某次更新只想通知它的部分订阅者？
在「多对一」或者「多对多」场景下。一个订阅者依赖于多个发布者，某个发布者更新后是否需要通知订阅者？还是等所有发布者都更新完毕再通知订阅者？

这些逻辑都可以放到ChangeManager里。





## 31. 数组有哪些原生方法？

- 数组和字符串的转换方法：toString()、toLocalString()、join() 其中 join() 方法可以指定转换为字符串时的分隔符。
- 数组尾部操作的方法 pop() 和 push()，push 方法可以传入多个参数。
- 数组首部操作的方法 shift() 和 unshift() 重排序的方法 reverse() 和 sort()，sort() 方法可以传入一个函数来进行比较，传入前后两个值，如果返回值为正数，则交换两个参数的位置。
- 数组连接的方法 concat() ，返回的是拼接好的数组，不影响原数组。
- 数组截取办法 slice()，用于截取数组中的一部分返回，不影响原数组。
- 数组插入方法 splice()，影响原数组查找特定项的索引的方法，indexOf() 和 lastIndexOf() 迭代方法 every()、some()、filter()、map() 和 forEach() 方法
- 数组归并方法 reduce() 和 reduceRight() 方法

## 32. 数组的遍历方法有哪些

| **方法**                  | **是否改变原数组** | **特点**                                                     |
| ------------------------- | ------------------ | ------------------------------------------------------------ |
| forEach()                 | 否                 | 数组方法，不改变原数组，没有返回值                           |
| map()                     | 否                 | 数组方法，不改变原数组，有返回值，可链式调用                 |
| filter()                  | 否                 | 数组方法，过滤数组，返回包含符合条件的元素的数组，可链式调用 |
| for...of                  | 否                 | for...of遍历具有Iterator迭代器的对象的属性，返回的是数组的元素、对象的属性值，不能遍历普通的obj对象，将异步循环变成同步循环 |
| every() 和 some()         | 否                 | 数组方法，some()只要有一个是true，便返回true；而every()只要有一个是false，便返回false. |
| find() 和 findIndex()     | 否                 | 数组方法，find()返回的是第一个符合条件的值；findIndex()返回的是第一个返回条件的值的索引值 |
| reduce() 和 reduceRight() | 否                 | 数组方法，reduce()对数组正序操作；reduceRight()对数组逆序操作 |



## 33. forEach 和 map 方法有什么区别

这方法都是用来遍历数组的，两者区别如下：

- forEach() 方法会针对每一个元素执行提供的函数，对数据的操作会**改变原数组，该方法没有返回值**；
- map() 方法**不会改变原数组的值，返回一个新数组**，新数组中的值为原数组调用函数处理之后的值；



## 34. VO AO GO

### 底层渲染过程

1) 在浏览器中打开页面，浏览器引擎会渲染相关代码（包含JS代码），换句话说，会把代码自上而下执行。
2) 浏览器想要执行代码，会提供一个供代码执行的环境，我们把这个环境叫做`ECStack`（Execution Context Stack）执行环境栈 =》 栈内存 Stack （栈内存作用：供代码自上而下执行）。
3) 最开始执行的是全局代码，所以会形成一个`EC`（GLOBAL）全局上下文，在栈内存中执行全局的代码。
4) 在全局的执行上下文中有一个`VO`（GLOBAL）全局变量对象，可以把接下来定义的变量和对应的值储存到这里面。

> **名词解释：**
>
> ECStack (Execution Context Stack) 执行环境栈，栈内存；
>
> EC (Execution Context) 执行上下文；
>
> AO (Active Object) 私有对象/活动性对象/执行期上下文，就是我们常说的 **作用域**。AO可以理解为VO的一个实例，也就是VO的一个构造函数，然后VO(Context) === AO，所以VO提供的是一个函数中所有变量数据的模板；
>
> VO  (Variable Object) 变量对象：存储当前上下文中的变量；
>
> GO (Global Object) 全局对象 。



### 堆栈定义

堆（heap）（引用类型）：一般由程序员分配释放，若程序员不释放，程序结束时可能由操作系统释放。

栈（stack）（基本类型）：由编译器自动分配释放，存放函数的参数值，局部变量等。

> 所谓栈堆内存，其实就是计算机内存中分配出来的一块空间，用来执行和存储代码的。



### 栈内存和堆内存的区别

栈内存：用来执行代码，存基本类型值的

堆内存：用来存引用类型值的



### 执行过程

#### 前言

研究以下代码如何执行

```js
var x = [12, 23]
function fn(y) {
	y[0] = 100;
	y = [100];
	y[1] = 200
}
fn(x)
console.log(x)
```



#### 1. ECStack、GO、EC、VO、AO

浏览器会在计算机内存分配一块内存，专门用来供代码执行的 **栈内存**，称作 **执行环境栈（ECStack）**同时会创建一个 **全局对象（G0）**，将内置的属性方法（`isNaN`、`setInterval`、`setTimeout`......）存放到一块单独的堆内存空间，并且使用 **window** 指向全局对象

在执行代码前，还需要创建一个 **全局执行上下文（EC(G)）**，创建完成后，进入到栈内存中去执行（进栈）；在当前全局执行上下文中，因为会创建很多变量并且赋值，所以会创建一个 **变量对象VO（Variable Object）**来进行保存，在函数私有上下文中的变量对象叫做 **活动对象AO（Activation Object）**。每个执行上下文都有一个单独的变量对象。

总结不常见的名词：

- 执行环境栈 ECStack（Execution Context Stack）：专门用来供代码执行的栈内存
- 全局对象GO（Global Object）：存放内置的属性方法，window指向
- 全局执行上下文EC(G) （Execution Context(G)）：页面加载后进栈、销毁后出栈
- 变量对象VO（Variable Object）：存放当前执行上下文中创建的变量和值
- 活动对象AO（Activation Object）：函数私有上下文中的变量对象

![didi](https://636c-cloud1-7g4dud13a1b0dc04-1305490742.tcb.qcloud.la/didi.gif?sign=6bf1b8c63e8a713055804522ee15c694&t=1641027680)

#### 2. 全局代码执行

当一切准备就绪，就开始从上到下执行代码。执行前还会设计变量提升的问题，这里不展开

```js
var x = [12, 23]
```

js在解析这段代码时，会按照以下3个步骤

- 先创建一个值[12, 23]
- 再创建一个变量x
- 最后将变量与值关联

当创建的值是引用类型时，会在堆内存中开辟新的内存空间用来保存值，创建完成后，会将堆内存地址（通常是16进制）保存到栈内存中；如果创建的值是基本类型时，会直接保存到栈内存中

![4e1b6d3897174cd38bbdb61c2aaaa310_tplv-k3u1fbpfcp-zoom-1](https://636c-cloud1-7g4dud13a1b0dc04-1305490742.tcb.qcloud.la/4e1b6d3897174cd38bbdb61c2aaaa310_tplv-k3u1fbpfcp-zoom-1.gif?sign=93d5cfbc7596e312dc51585e700f541e&t=1641027709)

继续向下执行

```js
function fn(y) {
    y[0] = 100
    y = [100]
    y[1] = 200
}
```

函数也是属于引用类型，也需要开辟堆内存空间进行保存，不同于数组和对象保存的是键值对，JS会将函数体通过字符串包裹进行保存，同时也会保存函数相关的属性，例如 **函数名 name:fn、形参个数length:1**等。同时，更重要的是，创建函数的时候，就定义了 **函数的作用域**，也就是 **等于当前创建函数的执行上下文**。在这个例子中，函数fn的作用域就是全局执行上下文，标识为 `[[scope]]:EC(G)`

![ad310ce9d16f41dea92186d788703feb_tplv-k3u1fbpfcp-zoom-1](https://636c-cloud1-7g4dud13a1b0dc04-1305490742.tcb.qcloud.la/ad310ce9d16f41dea92186d788703feb_tplv-k3u1fbpfcp-zoom-1.gif?sign=99143e631e57605d7adbbf932b380072&t=1641027755)

在函数创建好后，继续向下执行

```js
fn(x)
```

通过上面的动图了解到，fn和x都指向堆内存地址，所以，fn(x) 相当于 **AAAFFF000(AAAFFF111)**，在执行函数体代码之前，我们需要知道的是：

- **每次函数执行**，都会创建一个 **函数私有执行上下文**，创建完之后，需要进入到栈内存中去执行，此时，执行栈中的 **全局执行上下文就会被压入到栈底（压栈）**
- 同时，需要创建一个 **活动对象AO** 存放当前函数执行上下文中创建的变量和值等

![4ee58aabd027402f91c98c4ebc490c40_tplv-k3u1fbpfcp-zoom-1](https://636c-cloud1-7g4dud13a1b0dc04-1305490742.tcb.qcloud.la/4ee58aabd027402f91c98c4ebc490c40_tplv-k3u1fbpfcp-zoom-1.gif?sign=89fee0a65e6d3d2e60cb3f7dbdac1596&t=1641027734)

再完成函数执行上下文入栈后，接下来会做以下几件事

1. **初始化作用域链scopeChain**：作用域链通常标记为 **<当前执行上下文，函数创建时的作用域>**，而作用域链是为了函数执行过程中，当活动对象不存在某个变量时，会沿着作用域链向上找到
2. **初始化this指向**：本例子中，this等于window
3. **初始化实参集合arguments**
4. **形参赋值** y = x = AAAFFF111
5. **执行函数体** 紧接着就是执行函数体内容，在执行完后，当前函数的执行上下文就会出栈，退出执行栈，而被压入栈底的全局执行上下文又被推到了栈顶，此时会继续执行全局上下文中的代码

![624fc0122f3040d5adbcd0e6913a620d_tplv-k3u1fbpfcp-zoom-1](https://636c-cloud1-7g4dud13a1b0dc04-1305490742.tcb.qcloud.la/624fc0122f3040d5adbcd0e6913a620d_tplv-k3u1fbpfcp-zoom-1.gif?sign=fe5e8aba67b5fd13115dd1788d733051&t=1641027780)

至此，代码执行结束，最终输出的x是 [100, 23]



## 35. 对原型、原型链的理解

**对象的原型**是它构造函数的`prototype`所指向的原型对象。

由对象的原型、以及该对象的原型的原型，以此类推，组成的关系链叫做**原型链**。

![image-20210825234828887](https://636c-cloud1-7g4dud13a1b0dc04-1305490742.tcb.qcloud.la/image-20210825234828887.png?sign=dcbbb70405bb8a01648be6845a20b6da&t=1641027906)

**总结：**

- 一切对象都是继承自`Object`对象，`Object` 对象直接继承根源对象`null`
- 一切的函数对象（包括 `Object` 对象），都是继承自 `Function` 对象
- `Object` 对象直接继承自 `Function` 对象
- `Function`对象的`__proto__`会指向自己的原型对象，最终还是继承自`Object`对象



### 原型链的终点是什么？如何打印出原型链的终点？

由于 `Object `是构造函数，原型链终点是 `Object.prototype.__proto__`，而 `Object.prototype.__proto__=== null // true`，所以，**原型链的终点是`null`。**



### 如何获得对象非原型链上的属性？

使用后`hasOwnProperty()`方法来判断属性是否属于原型链的属性：

```js
function iterate(obj){
   var res=[];
   for(var key in obj){
        if(obj.hasOwnProperty(key))
           res.push(key+': '+obj[key]);
   }
   return res;
} 
```



## 36.执行上下文/作用域链/闭包

### 1. 对闭包的理解

- **理解1：一个函数和对其周围状态（词法环境）的引用捆绑在一起（或者说函数被引用包围），这样的组合就是闭包。**
- **理解2：闭包是指有权访问另一个函数作用域中变量的函数。**



**使用场景：**

1. 创建私有变量

2. 延长变量的生命周期

   > 一般函数的词法环境在函数返回后就被销毁，但是**闭包会保存对创建时所在词法环境的引用**，即便创建时所在的执行上下文被销毁，但创建时所在词法环境依然存在，以达到延长变量的生命周期的目的

在 JS 中，闭包存在的意义就是让我们可以间接访问函数内部的变量。经典面试题：循环中使用闭包解决 var 定义函数的问题

```js
for (var i = 1; i <= 5; i++) {
  setTimeout(function timer() {
    console.log(i)
  }, i * 1000)
}
```

首先因为 `setTimeout` 是个异步函数，所以会先把循环全部执行完毕，这时候 `i` 就是 6 了，所以会输出一堆 6。**解决办法有三种**：

- 第一种是使用闭包的方式

```js
for (var i = 1; i <= 5; i++) {
  ;(function(j) {
    setTimeout(function timer() {
      console.log(j)
    }, j * 1000)
  })(i)
}
```

在上述代码中，首先使用了**立即执行函数**将 `i` 传入函数内部，这个时候值就被固定在了参数 `j` 上面不会改变，当下次执行 `timer` 这个闭包的时候，就可以使用外部函数的变量 `j`，从而达到目的。

- 第二种就是使用 `setTimeout` 的**第三个参数**，这个参数会被当成 `timer` 函数的参数传入。

```js
for (var i = 1; i <= 5; i++) {
  setTimeout(
    function timer(j) {
      console.log(j)
    },
    i * 1000,
    i
  )
}
```

- 第三种就是使用 `let` 定义 `i` 了来解决问题了，这个也是最为推荐的方式

```js
for (let i = 1; i <= 5; i++) {
  setTimeout(function timer() {
    console.log(i)
  }, i * 1000)
}
```



### 2. 对作用域、作用域链的理解

#### 作用域

**作用域，**即变量（变量作用域又称为上下文）和函数生效（能被访问）的区域或集合。**换句话说，作用域决定了代码区块中变量和其他资源的可见性。**

**作用域最大的用处就是隔离变量，不同作用域下同名变量不会有冲突。**

**作用域一般分为三类：**

1. **全局作用域**

   任何不在函数中或是大括号中声明的变量，都是在全局作用域下，全局作用域下声明的变量可以在程序的任意位置访问

2. **函数作用域**

   函数作用域也叫局部作用域，如果一个变量是在函数内部声明的它就在一个函数作用域下面。这些变量只能在函数内部访问，不能在函数以外去访问

3. **块级作用域**

   ES6引入了`let`和`const`关键字,和`var`关键字不同，在大括号中使用`let`和`const`声明的变量存在于块级作用域中。在大括号之外不能访问这些变量



####  词法作用域

词法作用域，又叫静态作用域，**变量被创建时就确定好了**，而非执行阶段确定的。

因为 JavaScript 采用的是**词法作用域**，函数的作用域在**函数定义**的时候就决定了。

而与词法作用域相对的是**动态作用域**，函数的作用域是在**函数调用**的时候才决定的。

```js
var value = 1;

function foo() {
    console.log(value);
}

function bar() {
    var value = 2;
    foo();
}

bar();
```

假设JavaScript采用静态作用域，让我们分析下执行过程：

执行 foo 函数，先从 foo 函数内部查找是否有局部变量 value，如果没有，就根据书写的位置，查找上面一层的代码，也就是 value 等于 1，所以结果会打印 1。

假设JavaScript采用动态作用域，让我们分析下执行过程：

执行 foo 函数，依然是从 foo 函数内部查找是否有局部变量 value。如果没有，就从调用函数的作用域，也就是 bar 函数内部查找 value 变量，所以结果会打印 2。

前面我们已经说了，JavaScript采用的是静态作用域，所以这个例子的结果是 1。



#### 作用域链

在当前作用域中查找所需变量，但是该作用域没有这个变量，那这个变量就是**自由变量**。如果在自己作用域找不到该变量就去父级作用域查找，依次向上级作用域查找，直到访问到window对象就被终止，这一层层的关系就是**作用域链**。

作用域链的作用是**保证对执行环境有权访问的所有变量和函数的有序访问，通过作用域链，可以访问到外层环境的变量和函数。**

作用域链的本质上是一个指向变量对象的**指针列表**。变量对象是一个包含了执行环境中所有变量和函数的对象。作用域链的前端始终都是当前执行上下文的变量对象。全局执行上下文的变量对象（也就是全局对象）始终是作用域链的最后一个对象。

当查找一个变量时，如果当前执行环境中没有找到，可以沿着作用域链向后查找。



### 3. 对执行上下文的理解

**1. 执行上下文类型**

1. **全局执行上下文**

   任何不在函数内部的都是全局执行上下文，它首先会创建一个全局的window对象，并且设置this的值等于这个全局对象，一个程序中只有一个全局执行上下文。

2. **函数执行上下文**

   当一个函数被调用时，就会为该函数创建一个新的执行上下文，函数的上下文可以有任意多个。

3. **eval 函数执行上下文**

   执行在eval函数中的代码会有属于他自己的执行上下文，不过eval函数不常使用，不做介绍。



**2. 执行上下文栈**

JavaScript 引擎创建了执行上下文栈来管理执行上下文。**可以把执行上下文栈认为是一个存储函数调用的栈结构，遵循先进后出的原则**。

**步骤：**

当JavaScript执行代码时，首先遇到全局代码，会创建一个全局执行上下文并且压入执行栈中，每当遇到一个函数调用，就会为该函数创建一个新的执行上下文并压入栈顶，引擎会执行位于执行上下文栈顶的函数，当函数执行完成之后，执行上下文从栈中弹出，继续执行下一个上下文。当所有的代码都执行完毕之后，从栈中弹出全局执行上下文。



**3. 执行上下文的生命周期**

执行上下文的生命周期包括三个阶段：**创建阶段→执行阶段→回收阶段**



**创建阶段**

当函数被调用，但未执行任何其内部代码之前，会做以下三件事：

- 创建变量对象：首先初始化函数的参数arguments，提升函数声明和变量声明。

  - 用当前函数的**参数列表**（`arguments`）初始化一个 “变量对象” 并将当前执行上下文与之关联 ，函数代码块中声明的 **变量** 和 **函数** 将作为属性添加到这个变量对象上。**在这一阶段，会进行变量和函数的初始化声明，变量统一定义为 `undefined` 需要等到赋值时才会有确值，而函数则会直接定义**。

    > 有没有发现这段加粗的描述非常熟悉？没错，这个操作就是  **变量声明提升**（变量和函数声明都会提升，但是函数提升更靠前）。

- 创建作用域链（Scope Chain）：在执行期上下文的创建阶段，作用域链是在变量对象之后创建的。作用域链本身包含变量对象。作用域链用于解析变量。当被要求解析变量时，JavaScript 始终从代码嵌套的最内层开始，如果最内层没有找到变量，就会跳转到上一层父作用域中查找，直到找到该变量。

- 确定this指向

在一段 JS 脚本执行之前，要先解析代码（所以说 JS 是解释执行的脚本语言），解析的时候会先创建一个全局执行上下文环境，先把代码中即将执行的变量、函数声明都拿出来。变量先暂时赋值为undefined，函数则先声明好可使用。这一步做完了，然后再开始正式执行程序。

另外，一个函数在执行之前，也会创建一个函数执行上下文环境，跟全局上下文差不多，不过 函数执行上下文中会多出this arguments和函数的参数。

**执行阶段**

执行变量赋值、代码执行

**回收阶段**

执行上下文出栈等待虚拟机回收执行上下文



**简单来说执行上下文就是指：**

在执行一点JS代码之前，需要先解析代码。解析的时候会先创建一个全局执行上下文环境，先把代码中即将执行的变量、函数声明都拿出来（函数提升优先级比变量声明优先级高），变量先赋值为undefined，函数先声明好可使用。这一步执行完了，才开始正式的执行程序。



在一个函数执行之前，也会创建一个函数执行上下文环境，跟全局执行上下文类似，不过函数执行上下文会多出this、arguments和函数的参数。

- 全局上下文：变量定义，函数声明
- 函数上下文：变量定义，函数声明，`this`，`arguments`



## 37. this/call/apply/bind

### 1. 对 this 对象的理解

this 是执行上下文的一个属性，它指向最后一次调用这个方法的对象。在实际开发中，this 的指向可以通过四种调用模式来判断：

1. **函数调用模式**，当一个函数不是一个对象的属性时，直接作为函数来调用时，this 指向全局对象。
2. **方法调用模式，**如果一个函数作为一个对象的方法来调用时，this 指向这个对象。
3. **构造器调用模式，**如果一个函数用 new 调用时，函数执行前会新创建一个对象，this 指向这个新创建的对象。
4. **apply、call 和 bind 调用模式，**这三个方法显示指定调用函数 this 的指向。其中 apply 方法接收两个参数：一个是 this 绑定的对象，一个是参数数组。call 方法接收的参数，第一个是 this 绑定的对象，后面的其余参数是传入函数执行的参数。也就是说，在使用 call() 方法时，传递给函数的参数必须逐个列举出来。bind 方法通过传入一个对象，返回一个 this 绑定了传入对象的新函数。**这个函数的 this 指向除了使用 new 时会被改变，其他情况下都不会改变。**

这四种方式，使用构造器调用模式的优先级最高，然后是 apply、call 和 bind 调用模式，然后是方法调用模式，然后是函数调用模式。



### 2. call 和 apply 的区别

它们的作用一模一样，区别仅在于传入参数的形式的不同。

- apply 接受两个参数，第一个参数指定了函数体内 this 对象的指向，第二个参数为一个带下标的集合，这个集合可以为数组，也可以为类数组，apply 方法把这个集合中的元素作为参数传递给被调用的函数。
- call 传入的参数数量不固定，跟 apply 相同的是，第一个参数也是代表函数体内的 this 指向，从第二个参数开始往后，每个参数被依次传入函数。



### 3. call 和 bind 的区别

1. **返回值不同**，call 返回的是函数执行后的结果，bind 返回的是永久改变 this 指向的函数，而该函数有类似于柯里化的作用。
2. 调用绑定函数时作为 `this` 参数传递给目标函数的值。 如果使用`new`运算符构造绑定函数，则忽略第一个参数。



### 4. 实现 call、apply 以及 bind 函数

**call**

```js
Function.prototype.myCall = function (context = window, ...args) {
    const fn = Symbol() // 创建唯一的key值作为传入对象的方法名
    context[fn] = this // 将函数赋给传入对象作为它的属性
    const result = context[fn](...args) // 调用对象的方法
    delete context[fn] // 调用完毕删除属性
    return result // 返回结果
}
```

**apply**

```js
Function.prototype.myApply = function (context = window, args) {
    const fn = Symbol()
    context[fn] = this
    const result = context[fn](...args)
    delete context[fn]
    return result
}
```

**bind**

```js
Function.prototype.myBind = function (context = window, ...args) {
    // 创造唯一的key值  作为我们构造的context内部方法名
    let fn = Symbol();
    context[fn] = this;
    let _this = this;
    //  bind情况要复杂一点
    const result = function (...innerArgs) {
        // 第一种情况 :若是将 bind 绑定之后的函数当作构造函数，通过 new 操作符使用，则不绑定传入的 this，而是将 this 指向实例化出来的对象
        // 此时由于new操作符作用  this指向result实例对象  而result又继承自传入的_this 根据原型链知识可得出以下结论
        // this.__proto__ === result.prototype   //this instanceof result =>true
        // this.__proto__.__proto__ === result.prototype.__proto__ === _this.prototype; //this instanceof _this =>true
        if (this instanceof _this === true) {
            // 此时this指向指向result的实例  这时候不需要改变this指向
            this[fn] = _this;
            this[fn](...[...args, ...innerArgs]); //这里使用es6的方法让bind支持参数合并
            delete this[fn];
        } else {
            // 如果只是作为普通函数调用  那就很简单了 直接改变this指向为传入的context
            context[fn](...[...args, ...innerArgs]);
            delete context[fn];
        }
    };
    // 如果绑定的是构造函数 那么需要继承构造函数原型属性和方法
    // 实现继承的方式: 使用Object.create
    result.prototype = Object.create(this.prototype);
    return result;
}
```

**用法如下**

```js
function Person(name, age) {
  console.log(name); //'我是参数传进来的name'
  console.log(age); //'我是参数传进来的age'
  console.log(this); //构造函数this指向实例对象
}
// 构造函数原型的方法
Person.prototype.say = function() {
  console.log(123);
}
let obj = {
  objName: '我是obj传进来的name',
  objAge: '我是obj传进来的age'
}
// 普通函数
function normalFun(name, age) {
  console.log(name);   //'我是参数传进来的name'
  console.log(age);   //'我是参数传进来的age'
  console.log(this); //普通函数this指向绑定bind的第一个参数 也就是例子中的obj
  console.log(this.objName); //'我是obj传进来的name'
  console.log(this.objAge); //'我是obj传进来的age'
}

//先测试作为构造函数调用
let bindFun = Person.myBind(obj, '我是参数传进来的name')
let a = new bindFun('我是参数传进来的age')
a.say() //123

//再测试作为普通函数调用
let bindFun = normalFun.myBind(obj, '我是参数传进来的name')
 bindFun('我是参数传进来的age')
```



## 38. setTimeout、setInterval、requestAnimationFrame 各有什么特点？

与 setTimeout、setInterval 不同，requestAnimationFrame 不需要设置时间间隔，这有什么好处呢？

计时器一直是 JavaScript 动画的核心技术，而编写动画循环的核心是要知道延迟时间多长合适。一方面循环间隔必须足够短，这样才能让不同的动画效果显得平滑顺畅，另一方面循环间隔要足够的长，这样才能保证浏览器有能力渲染产生的变化。大多数电脑显示器的刷新频率是60Hz，大概相当于每秒重绘60次(16.7ms)。大多数浏览器都会对重绘操作加以限制，不会超出显示器的重绘频率。

而 setTimeout 和 setInterval 的缺点是他们都不够精确。它们内在的运行机制决定了时间间隔参数实际上只是指定了把动画代码添加到浏览器 UI 线程队列中等待执行的时间，如果队列中已经加入了其他任务，那么动画的执行要等前面的任务结束之后才会执行。

requestAnimationFrame采用的是系统时间间隔，保证了最佳绘制效率。不会因间隔时间过短，造成过度绘制，增加开销；也不会因时间间隔太长，造成动画卡顿。它能够让各种网页动画有一个统一的刷新机制，从而节省系统资源，提高系统性能，改善视觉效果。

**特点**

1. requestAnimationFrame 会把每一帧中的所有 DOM 操作集中起来，在一次重绘或回流中就完成，并且重绘或回流的时间间隔紧紧跟随浏览器的刷新频率。
2. 在隐藏或不可见的元素中，requsetAnimationFrame 将不会进行重绘或回流，这就意味着更少的 CPU、GPU 和内存使用量。
3. requestAnimationFrame 是浏览器专门提供的 api，在运行时浏览器会自动优化方法的调用，并且页面不是激活状态下，动画会暂停执行，有效节省 CPU 开销。



## 应用题

### 手写防抖、节流并说明区别

**防抖**

```javascript
// 防抖
function debounce(fn, delay = 300) {
  //默认300毫秒
  let timer;
  return function () {
    const args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args); // 改变this指向为调用debounce所指的对象
    }, delay);
  };
}

window.addEventListener(
  "scroll",
  debounce(() => {
    console.log(111);
  }, 1000)
);
```

**节流**

```javascript
// 设置一个标志
function throttle(fn, delay) {
  let flag = true;
  return () => {
    if (!flag) return;
    flag = false;
    fn();
    timer = setTimeout(() => {  
      flag = true;
    }, delay);
  };
}

window.addEventListener(
  "scroll",
  throttle(() => {
    console.log(111);
  }, 1000)
);
```

防抖和节流的区别：假设时间限度设为2s，每1s触发一次事件，如果使用防抖，那么回调永远不会被执行，而节流则会每2秒执行一次。



### 实现日期格式化函数

```javascript
dateFormat(new Date('2020-12-01'), 'yyyy/MM/dd') // 2020/12/01
dateFormat(new Date('2020-04-01'), 'yyyy/MM/dd') // 2020/04/01
dateFormat(new Date('2020-04-01'), 'yyyy年MM月dd日') // 2020年04月01日

//实现
const dateFormat = (dateInput, format)=>{
    var day = dateInput.getDate() 
    var month = dateInput.getMonth() + 1  
    var year = dateInput.getFullYear()   
    format = format.replace(/yyyy/, year)
    				.replace(/MM/,month)
    				.replace(/dd/,day)
    return format
}
```





### 将数字每千分位用逗号隔开

**数字有小数版本：**

```javascript
let format = n => {
    let num = n.toString() // 转成字符串
    let decimals = ''
        // 判断是否有小数
    num.indexOf('.') > -1 ? decimals = num.split('.')[1] : decimals
    let len = num.length
    if (len <= 3) {
        return num
    } else {
        let temp = ''
        let remainder = len % 3
        decimals ? temp = '.' + decimals : temp
        if (remainder > 0) { // 不是3的整数倍
            return num.slice(0, remainder) + ',' + num.slice(remainder, len).match(/\d{3}/g).join(',') + temp
        } else { // 是3的整数倍
            return num.slice(0, len).match(/\d{3}/g).join(',') + temp 
        }
    }
}
format(12323.33)  // '12,323.33'
```

**数字无小数版本：**

```javascript
let format = n => {
    let num = n.toString() 
    let len = num.length
    if (len <= 3) {
        return num
    } else {
        let remainder = len % 3
        if (remainder > 0) { // 不是3的整数倍
            return num.slice(0, remainder) + ',' + num.slice(remainder, len).match(/\d{3}/g).join(',') 
        } else { // 是3的整数倍
            return num.slice(0, len).match(/\d{3}/g).join(',') 
        }
    }
}
format(1232323)  // '1,232,323'
```



### 手写new

```javascript
function myNew (fn, ...args) {
  let instance = Object.create(fn.prototype);
  return fn.call(instance, ...args)
}
```



### 手写Promise.all

```javascript
Promise.prototype.all = function(promises){
    let resolveCount = 0
    let target = promises.length
    return new Promise((resolve, reject) => {
        let thenFunc = () => {
       		if(++resolveCount === target) resolve()
       	}
        promises.forEach(p => p.then(thenFunc))
    })
}
```



### 怎么使用 setTimeout 模拟 setInterval？为什么？

**原因**

setInterval 的作用是每隔一段指定时间执行一个函数，它的实现原理是每隔一段时间将事件加入事件队列中去，只有当当前的执行栈为空的时候， 才能去从事件队列中取出事件执行。所以可能会出现这样的情况，就是`当前执行栈执行的时间很长，导致事件队列里边积累多个定时器加入的事件，当执行栈结束的时候，这些事件会依次执行， 因此就不能到间隔一段时间执行的效果。 `

**模拟实现**

思路是使用递归函数，不断地去执行 setTimeout 从而达到 setInterval 的效果 

```javascript
function mySetInterval(fn, timeout) {
    // 控制器，控制定时器是否继续执行
    const timer = { 
        flag: true 
    }; 
    // 设置递归函数，模拟定时器执行。 
    function interval() { 
        if (timer.flag) {
            fn(); 
            setTimeout(interval, timeout); 
        } 
    } 
    // 启动定时器 
    setTimeout(interval, timeout); 
    // 返回控制器
    return timer;
} 
```



### 函数柯里化

柯里化是把接受多个参数的函数变换成接受一个单一参数的函数，并且返回接受余下的参数而且返回结果的新函数的技术。核心思想是把多参数传入的函数拆成单参数（或部分）函数，内部再返回调用下一个单参数（或部分）函数，依次处理剩余的参数。

```javascript
// 实现一个add方法，使计算结果能够满足如下预期：
add(1)(2)(3) //6
add(1, 2, 3)(4) // 10
add(1)(2)(3)(4)(5) // 15

function add(...args) {
    // 第一次执行时，定义一个数组专门用来存储所有的参数
    let _args = args

    // 在内部声明一个函数，利用闭包的特性保存_args并收集所有的参数值
    let _adder = function(...newArgs) {
        _args = [..._args, ...newArgs]
        return _adder;
    };

    // 利用toString隐式转换的特性，当最后执行时隐式转换，并计算最终的值返回
    _adder.toString = function () {
        return _args.reduce((a, b) => a + b);
    }
    return _adder;
}
```

```javascript
// 实现一个add方法，使计算结果能够满足如下预期：
let func = add(1)
func(2) //3
func(4) //5

function add(...args) {
    function toString(){
        return this._args.reduce((a, b) => a + b);
    }
    function generateAdder(...baseArgs){
        let adder = function(...newArgs){
            return generateAdder(...[...baseArgs,...newArgs])
        }
        adder._args = [...baseArgs]
        adder.toString = toString
        return adder
    }
    
    return generateAdder(...args);
}
```



### 数组扁平化

#### 递归解法

```javascript
function flat(baseArr){
    let res = []
    baseArr.forEach(item => {
        if(item instanceof Array){
            res = res.concat(flat(item))
        }else{
            res.push(item)
        }
    })
    return res
}
```

#### 非递归解法

```javascript
function flat(baseArr){
    for(let i = 0 ; i < baseArr.length ; i++){
        if(baseArr[i] instanceof Array){
            baseArr = baseArr.concat(baseArr[i])
            baseArr.splice(i--, 1)
        }
    }
    return baseArr
}
```



### 对象的深拷贝

#### 深度优先遍历解法

```javascript
function deepCopyDFS(obj){
    if(obj === null) return null
    let target = obj instanceof Array ? [] : {};
    let newObj = Object.assign(target, obj)
    for(key of Object.keys(obj)){
        if(obj[key] instanceof Object){
            obj[key] = deepCopyDFS(obj[key])
        }
    }
    return newObj
}
```

#### 广度优先遍历解法

```javascript
function getEmpty(obj){
    return obj instanceof Object ? obj instanceof Array ? [] : {} : obj
}

function deepCopyBFS(origin){
    if(!(origin instanceof Object) || origin === null) return origin
    let queue = [];
    let map = new Map(); // 记录出现过的对象，用于处理循环引用

    let target = getEmpty(obj)
    queue.push([origin, target]);

    while(queue.length){
        let [ori, tar] = queue.shift();
        for(let key in ori){
            // 处理循环引用
            if(map.get(ori[key])){
                tar[key] = map.get(ori[key]);
                continue;
            }

            tar[key] = getEmpty(ori[key]);
            //tar[key]为对象
            if(tar[key] !== ori[key]){
                queue.push([ori[key], tar[key]]);
                //键为原对象，值为拷贝后的对象
                map.set(ori[key], tar[key]);
            }
        }
    }
    return target;
}
```



打印等腰三角形星星

```javascript
function printStars(n) {
    for(let i = 0; i < n; i++) {
        let str = '';
        for(let j = 0; j < n - i; j++) {
            str += ' ';
        }
        for(let j = 0; j < 2 * i - 1; j++) {
            str += '*'
        }
        console.log(str);
    }
}

printStars(5)
/*
    *
   ***
  *****
 *******
*/
```

