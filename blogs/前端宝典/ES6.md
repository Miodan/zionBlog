---
title: ES6
date: 2022-01-01
tags:
 - JS
categories:
 - 前端
---

## 1. ES6新特性

- 声明变量：let,const

- 模板字面量
- 解构赋值
- for...of和for...in
- 展开运算符
- 箭头函数
- Symbol
- class类
- Promise
- proxy, reflect
- Module
- Set和Map

## 2. let const var 的区别

1. **作用域**，使用 var 声明的变量，其作用域为该语句所在的函数内；使用 let、const 声明的变量，其作用域为该语句所在的代码块内。
2. **变量提升**，var 声明的变量会变量提升，let、const 不会。
3. **给全局添加属性**，var 在全局作用域声明的变量会称为全局对象的属性。
4. **重复声明**，var 允许变量重复声明，后面的同名变量会覆盖前面的；let、const 不会。
5. **暂时性死区**，在 let、const 声明的变量语句前，该变量不可用；var 声明的变量可以。
6. **初始值设置**，var 和 let 在声明变量的时候可以不设置初始值，const 必须设置。
7. **指针指向**，var 和 let 声明的是变量，所存储的值可以修改；const 声明的是常量，存储的地址值不可以修改，但是地址值指向的具体数据可以修改。



## 3. const 对象的属性可以修改吗？

const保证的并不是变量的值不能改动，而是**变量指向的那个内存地址不能改动**。对于基本类型的数据（数值、字符串、布尔值），其值就保存在变量指向的那个内存地址，因此等同于常量。

但对于引用类型的数据（主要是对象和数组）来说，变量指向数据的内存地址，保存的只是一个指针，**const只能保证这个指针是固定不变的，至于它指向的数据结构是不是可变的，就完全不能控制了**。



## 4. 如果 new 一个箭头函数会怎么样？

箭头函数是ES6中的提出来的，它**没有prototype**，也**没有自己的this指向**，**更不可以使用arguments参数**，所以不能New一个箭头函数。



**在调用 new 的过程中会发生以上四件事情：**

1. 首先创建了一个新的空对象
2. 设置原型，将对象的原型设置为函数的 prototype 对象
3. 让函数的 this 指向这个对象，执行构造函数的代码（为这个新对象添加属性）
4. 判断函数的返回值类型，如果是值类型，返回创建的对象。如果是引用类型，就返回这个引用类型的对象。



所以，上面的第二、三步，箭头函数都是没有办法执行的。



## 5. 箭头函数与普通函数的区别

1. **箭头函数比普通函数更加简洁**

   1. 如果没有参数，就直接写一个空括号即可

   2. 如果只有一个参数，可以省去参数的括号

   3. 如果有多个参数，用逗号分割

   4. 如果函数体的返回值只有一句，可以省略大括号如果函数体不需要返回值，且只有一句话，可以给这个语句前面加一个void关键字。最常见的就是调用一个函数

      ```js
      let fn = () => void doesNotReturn();
      ```

2. **箭头函数没有自己的 this**

   箭头函数不会创建自己的this， 所以它没有自己的this，它只会在自己作用域的上一层继承this。所以**箭头函数中this的指向在它在定义时已经确定了，之后不会改变。**

3. **箭头函数继承来的 this 永远不会改变**

   ```js
   var id = 'GLOBAL';
   var obj = {
     id: 'OBJ',
     a: function(){
       console.log(this.id);
     },
     b: () => {
       console.log(this.id);
     }
   };
   obj.a();    // 'OBJ'
   obj.b();    // 'GLOBAL'
   new obj.a()  // undefined
   new obj.b()  // Uncaught TypeError: obj.b is not a constructor
   ```

   对象obj的方法b是使用箭头函数定义的，这个函数中的this就永远指向它定义时所处的全局执行环境中的this，即便这个函数是作为对象obj的方法调用，this依旧指向Window对象。需要注意，定义对象的大括号`{}`是无法形成一个单独的执行环境的，它依旧是处于全局执行环境中。

4. **call()、apply()、bind()等方法不能改变箭头函数中this的指向**

   ```js
   var id = 'Global';
   let fun1 = () => {
       console.log(this.id)
   };
   fun1();                     // 'Global'
   fun1.call({id: 'Obj'});     // 'Global'
   fun1.apply({id: 'Obj'});    // 'Global'
   fun1.bind({id: 'Obj'})();   // 'Global'
   ```

5. **箭头函数不能作为构造函数使用**

   构造函数在new的步骤在上面已经说过了，实际上第二步就是将函数中的this指向该对象。 但是由于箭头函数时没有自己的this的，且this指向外层的执行环境，且不能改变指向，所以不能当做构造函数使用。

6. **箭头函数没有自己的arguments**

   箭头函数没有自己的arguments对象。在箭头函数中访问arguments实际上获得的是它外层函数的arguments值。

7. **箭头函数没有prototype**

8. **箭头函数不能用作Generator函数，不能使用yeild关键字**



## 6. 箭头函数的 this 指向哪里？

箭头函数不同于传统JavaScript中的函数，**箭头函数并没有属于⾃⼰的this，它所谓的this是捕获其所在上下⽂的 this 值，作为⾃⼰的 this 值**，并且由于没有属于⾃⼰的this，所以是不会被new调⽤的，这个所谓的this也不会被改变。

可以⽤Babel理解⼀下箭头函数: 

```js
// ES6 
const obj = { 
  getArrow() { 
    return () => { 
      console.log(this === obj); 
    }; 
  } 
}
```

转化后：

```js
// ES5，由 Babel 转译
var obj = { 
   getArrow: function getArrow() { 
     var _this = this; 
     return function () { 
        console.log(_this === obj); 
     }; 
   } 
};
```



## 7. Proxy 可以实现什么功能？

在 Vue3.0 中通过 `Proxy` 来替换原本的 `Object.defineProperty` 来实现数据响应式。



Proxy 是 ES6 中新增的功能，它可以用来自定义对象中的操作。

```js
let p = new Proxy(target, handler)
```

`target` 代表需要添加代理的对象，`handler` 用来自定义对象中的操作，比如可以用来自定义 `set` 或者 `get` 函数。



下面来通过 `Proxy` 来实现一个数据响应式：

```js
let onWatch = (obj, setBind, getLogger) => {
  let handler = {
    get(target, property, receiver) {
      getLogger(target, property)
      return Reflect.get(target, property, receiver)
    },
    set(target, property, value, receiver) {
      setBind(value, property)
      return Reflect.set(target, property, value)
    }
  }
  return new Proxy(obj, handler)
}
let obj = { a: 1 }
let p = onWatch(
  obj,
  (v, property) => {
    console.log(`监听到属性${property}改变为${v}`)
  },
  (target, property) => {
    console.log(`'${property}' = ${target[property]}`)
  }
)
p.a = 2 // 监听到属性a改变
p.a // 'a' = 2
```

在上述代码中，通过自定义 `set` 和 `get` 函数的方式，在原本的逻辑中插入了我们的函数逻辑，实现了在对对象任何属性进行读写时发出通知。



当然这是简单版的响应式实现，如果需要实现一个 Vue 中的响应式，需要在 `get` 中收集依赖，在 `set` 派发更新，之所以 Vue3.0 要使用 `Proxy` 替换原本的 API 原因在于 `Proxy` 无需一层层递归为每个属性添加代理，一次即可完成以上操作，性能上更好，并且原本的实现有一些数据更新不能监听到，但是 `Proxy` 可以完美监听到任何方式的数据改变，唯一缺陷就是浏览器的兼容性不好。

## 8. 对对象与数组解构的理解

在解构数组时，以**元素的位置为匹配条件**来提取想要的数据的：

```js
const [a, b, c] = [1, 2, 3]
```

最终，a、b、c分别被赋予了数组第0、1、2个索引位的值：

<img src="https://636c-cloud1-7g4dud13a1b0dc04-1305490742.tcb.qcloud.la/image-20210825145812072.png?sign=fbbaa9dd1b1116a09e0ec798173fda30&t=1641026261" />

数组里的0、1、2索引位的元素值，精准地被映射到了左侧的第0、1、2个变量里去，这就是数组解构的工作模式。还可以通过给左侧变量数组设置空占位的方式，实现对数组中某几个元素的精准提取：

```js
const [a,,c] = [1,2,3]
```

通过把中间位留空，可以顺利地把数组第一位和最后一位的值赋给 a、c 两个变量：

<img src="https://636c-cloud1-7g4dud13a1b0dc04-1305490742.tcb.qcloud.la/image-20210825145832136.png?sign=1fc451541949bf6245581d474bc42692&t=1641026282" />

**2）对象的解构**

对象解构比数组结构稍微复杂一些，也更显强大。在**解构对象时，是以属性的名称为匹配条件**，来提取想要的数据的。现在定义一个对象：

```js
const stu = {
  name: 'Bob',
  age: 24
}
```

假如想要解构它的两个自有属性，可以这样：

```js
const { name, age } = stu
```

这样就得到了 name 和 age 两个和 stu 平级的变量：

<img src="https://636c-cloud1-7g4dud13a1b0dc04-1305490742.tcb.qcloud.la/image-20210825145900756.png?sign=2aa0c13bf1537e5e993be53f73b0a2c8&t=1641026298" alt="image-20210825145900756" style="zoom:33%;" />

注意，对象解构严格以属性名作为定位依据，所以就算调换了 name 和 age 的位置，结果也是一样的：

```js
const { age, name } = stu
```



## 9. 如何提取高度嵌套的对象里的指定属性？

有时会遇到一些嵌套程度非常深的对象：

```js
const school = {
   classes: {
      stu: {
         name: 'Bob',
         age: 24,
      }
   }
}
```

像此处的 name 这个变量，嵌套了四层，此时如果仍然尝试老方法来提取它：

```js
const { name } = school
```

显然是不奏效的，因为 school 这个对象本身是没有 name 这个属性的，name 位于 school 对象的“儿子的儿子”对象里面。要想把 name 提取出来，一种比较笨的方法是逐层解构：

```js
const { classes } = school
const { stu } = classes
const { name } = stu
name // 'Bob'
```

但是还有一种更标准的做法，可以用一行代码来解决这个问题：

```js
const { classes: { stu: { name } }} = school
       
console.log(name)  // 'Bob'
```

可以在解构出来的变量名右侧，通过**冒号+{目标属性名}**这种形式，进一步解构它，一直解构到拿到目标数据为止。



## 10. 对 rest 参数的理解

扩展运算符被用在函数形参上时，**它还可以把一个分离的参数序列整合成一个数组**：

```js
function mutiple(...args) {
  let result = 1;
  for (var val of args) {
    result *= val;
  }
  return result;
}
mutiple(1, 2, 3, 4) // 24
```

这里，传入 mutiple 的是四个分离的参数，但是如果在 mutiple 函数里尝试输出 args 的值，会发现它是一个数组：

```js
function mutiple(...args) {
  console.log(args)
}
mutiple(1, 2, 3, 4) // [1, 2, 3, 4]
```

这就是 … rest运算符的又一层威力了，它可以把函数的多个入参收敛进一个数组里。这一点**经常用于获取函数的多余参数，或者像上面这样处理函数参数个数不确定的情况。**



## 11. ES6中模板语法与字符串处理

ES6 提出了“模板语法”的概念。在 ES6 以前，拼接字符串是很麻烦的事情：

```js
var name = 'css'   
var career = 'coder' 
var hobby = ['coding', 'writing']
var finalString = 'my name is ' + name + ', I work as a ' + career + ', I love ' + hobby[0] + ' and ' + hobby[1]
```

仅仅几个变量，写了这么多加号，还要时刻小心里面的空格和标点符号有没有跟错地方。但是有了模板字符串，拼接难度直线下降：

```js
var name = 'css'   
var career = 'coder' 
var hobby = ['coding', 'writing']
var finalString = `my name is ${name}, I work as a ${career} I love ${hobby[0]} and ${hobby[1]}`
```

字符串不仅更容易拼了，也更易读了，代码整体的质量都变高了。这就是模板字符串的**第一个优势——允许用${}的方式嵌入变量**。但这还不是问题的关键，模板字符串的关键优势有两个：

- **在模板字符串中，空格、缩进、换行都会被保留**
- **模板字符串完全支持“运算”式的表达式，可以在${}里完成一些计算**



基于第一点，可以在模板字符串里无障碍地直接写 html 代码：

```js
let list = `
    <ul>
        <li>列表项1</li>
        <li>列表项2</li>
    </ul>
`;
console.log(message); // 正确输出，不存在报错
```

基于第二点，可以把一些简单的计算和调用丢进 ${} 来做：

```js
function add(a, b) {
  const finalString = `${a} + ${b} = ${a+b}`
  console.log(finalString)
}
add(1, 2) // 输出 '1 + 2 = 3'
```

除了模板语法外， ES6中还新增了一系列的字符串方法用于提升开发效率：

- **存在性判定**：在过去，当判断一个字符/字符串是否在某字符串中时，只能用 indexOf > -1 来做。现在 ES6 提供了三个方法：includes、startsWith、endsWith，它们都会返回一个布尔值来告诉你是否存在。

  - **includes**：判断字符串与子串的包含关系：

  ```js
  const son = 'haha' 
  const father = 'xixi haha hehe'
  father.includes(son) // true
  ```

  - **startsWith**：判断字符串是否以某个/某串字符开头：

  ```js
  const father = 'xixi haha hehe'
  father.startsWith('haha') // false
  father.startsWith('xixi') // true
  ```

  - **endsWith**：判断字符串是否以某个/某串字符结尾：

  ```js
  const father = 'xixi haha hehe'
    father.endsWith('hehe') // true
  ```

- **自动重复**：可以使用 repeat 方法来使同一个字符串输出多次（被连续复制多次）：

```js
const sourceCode = 'repeat for 3 times;'
const repeated = sourceCode.repeat(3) 
console.log(repeated) // repeat for 3 times;repeat for 3 times;repeat for 3 times;
```





## 12. 扩展运算符的作用以及使用场景

**（1）对象扩展运算符**

对象的扩展运算符(...)用于取出参数对象中的所有可遍历属性，拷贝到当前对象之中。

```js
let bar = { a: 1, b: 2 };
let baz = { ...bar }; // { a: 1, b: 2 }
```

上述方法实际上等价于:

```js
let bar = { a: 1, b: 2 };
let baz = Object.assign({}, bar); // { a: 1, b: 2 }
```

`Object.assign`方法用于对象的合并，将源对象`（source）`的所有可枚举属性，复制到目标对象`（target）`。`Object.assign`方法的第一个参数是目标对象，后面的参数都是源对象。(**如果目标对象与源对象有同名属性，或多个源对象有同名属性，则后面的属性会覆盖前面的属性**)。



同样，如果用户自定义的属性，放在扩展运算符后面，则扩展运算符内部的同名属性会被覆盖掉。

```js
let bar = {a: 1, b: 2};
let baz = {...bar, ...{a:2, b: 4}};  // {a: 2, b: 4}
```

利用上述特性就可以很方便的修改对象的部分属性。在`redux`中的`reducer`函数规定必须是**一个纯函数**，`reducer`中的`state`对象要求不能直接修改，可以通过扩展运算符把修改路径的对象都复制一遍，然后产生一个新的对象返回。



需要注意：**扩展运算符对对象实例的拷贝属于浅拷贝**。



**（2）数组扩展运算符**

数组的扩展运算符可以将一个数组转为用逗号分隔的参数序列，且每次只能展开一层数组。

```js
console.log(...[1, 2, 3])
// 1 2 3
console.log(...[1, [2, 3, 4], 5])
// 1 [2, 3, 4] 5
```

下面是数组的扩展运算符的应用：

- **将数组转换为参数序列**

```js
function add(x, y) {
  return x + y;
}
const numbers = [1, 2];
add(...numbers) // 3
```

- **复制数组**

```js
const arr1 = [1, 2];
const arr2 = [...arr1];
```

- **合并数组**

如果想在数组内合并数组，可以这样：

```js
const arr1 = ['two', 'three'];
const arr2 = ['one', ...arr1, 'four', 'five'];
// ["one", "two", "three", "four", "five"]
```

- **扩展运算符与解构赋值结合起来，用于生成数组**

```js
const [first, ...rest] = [1, 2, 3, 4, 5];
first // 1
rest  // [2, 3, 4, 5]
```

需要注意：**如果将扩展运算符用于数组赋值，只能放在参数的最后一位，否则会报错。**

```js
const [...rest, last] = [1, 2, 3, 4, 5];         // 报错
const [first, ...rest, last] = [1, 2, 3, 4, 5];  // 报错
```

- **将字符串转为真正的数组**

```js
[...'hello']    // [ "h", "e", "l", "l", "o" ]
```

- **任何 Iterator 接口的对象，都可以用扩展运算符转为真正的数组**

比较常见的应用是可以将某些数据结构转为数组：

```js
// arguments对象
function foo() {
  const args = [...arguments];
}
```

用于替换`es5`中的`Array.prototype.slice.call(arguments)`写法。

- **使用`Math`函数获取数组中特定的值**

```js
const numbers = [9, 4, 7, 1];
Math.min(...numbers); // 1
Math.max(...numbers); // 9
```



## 13. 为什么需要 Reflect

- Proxy和Reflect的方法名完全相同，使用时更加直观易懂

- Reflect可以保证正确的上下文调用，如：

  ```javascript
  //一般情况，可以不使用Reflect而使用传统方法
  let hero = {
      name: '张三',
  }
  let handler = {
      get(target, name) {
          return target[name];
          // return Reflect.get(target, name);
      },
      has(target, name) {
          return name in target;
          // return Reflect.has(target, name);
      }
  }
  let heroProxy = new Proxy(hero, handler);
  
  console.log(heroProxy.name); // => 张三
  console.log('name' in heroProxy); // => true
  
  //特殊情况，如果使用传统方法
  let user = {
      _name: "张三",
      get name() {
          return this._name;
      }
  };
  
  let userProxy = new Proxy(user, {
      get(target, prop, receiver) {
          return target[prop];
      }
  });
  
  let admin = {
      __proto__: userProxy,
      _name: "李四"
  };
  
  // 期待 『李四』，却输出了 『张三
  console.log(admin.name); // => 张三
  
  admin.__proto__ = new Proxy(user, {
      get(target, prop, receiver) {
          return Reflect.get(target, prop, receiver)
      }
  });
  
  console.log(admin.name); // => 李四
  ```



## 14. Symbol 类型的注意点？ 

1. Symbol 函数前不能使用 new 命令，否则会报错。 

2. **Symbol()** 函数可以接受一个字符串作为参数，表示对 Symbol 实例的描述，返回一个独一无二的Symbol实例，如：

   ```javascript
   //s1与s2不相等，都是唯一的
   let s1 = Symbol('a')
   let s2 = Symbol('a')
   ```

3. Symbol 作为属性名，该属性不会出现在 for...in、for...of 循环中，也不会被 Object.keys()、Object.getOwnPropertyNames()、JSON.stringify() 返 回。 

4. Object.getOwnPropertySymbols 方法返回一个数组，成员是当前对象 的所有用作属性名的 Symbol 值。 

5. **Symbol.for()** 接受一个字符串作为参数，然后搜索从运行时的 symbol 注册表中找到对应的 symbol，如果找到了，则返回它，否则，新建一个与该键关联的 symbol，并放入symbol 注册表中。注意，**Symbol()函数创建的Symbol实例不会放入注册表中。**

6. **Symbol.keyFor()**方法返回一个已登记的 Symbol 类型值的 key。 没有登记则返回undefined



## 15. map和Object的区别

|          | Map                                                 | Object                                                       |
| -------- | --------------------------------------------------- | ------------------------------------------------------------ |
| 意外的键 | Map默认情况不包含任何键，只包含显式插入的键。       | Object 有一个原型, 原型链上的键名有可能和自己在对象上的设置的键名产生冲突。 |
| 键的类型 | Map的键可以是任意值，包括函数、对象或任意基本类型。 | Object 的键必须是 String 或是Symbol。                        |
| 键的顺序 | Map 中的 key 是无序的，只能通过迭代器进行遍历       | Object 的键是有序的                                          |
| Size     | Map 的键值对个数可以轻易地通过size 属性获取         | Object 的键值对个数只能手动计算                              |
| 性能     | 在频繁增删键值对的场景下表现更好。                  | 在频繁添加和删除键值对的场景下未作出优化。                   |

## 16. map和weakMap的区别

**（1）Map**

**map本质上就是键值对的集合**，但是普通的Object中的键值对中的键只能是字符串。而ES6提供的Map数据结构类似于对象，**但是它的键不限制范围，可以是任意类型**，是一种更加完善的Hash结构。如果Map的键是一个原始数据类型，只要两个键严格相同，就视为是同一个键。



**实际上Map是一个数组，它的每一个数据也都是一个数组**，其形式如下：

```js
const map = [
     ["name","张三"],
     ["age",18],
]
```

Map数据结构有以下操作方法：

- **size**： `map.size` 返回Map结构的成员总数。
- **set(key,value)**：设置键名key对应的键值value，然后返回整个Map结构，如果key已经有值，则键值会被更新，否则就新生成该键。（因为返回的是当前Map对象，所以可以链式调用）
- **get(key)**：该方法读取key对应的键值，如果找不到key，返回undefined。
- **has(key)**：该方法返回一个布尔值，表示某个键是否在当前Map对象中。
- **delete(key)**：该方法删除某个键，返回true，如果删除失败，返回false。
- **clear()**：map.clear()清除所有成员，没有返回值。



Map结构原生提供是三个遍历器生成函数和一个遍历方法

- keys()：返回键名的遍历器。
- values()：返回键值的遍历器。
- entries()：返回所有成员的遍历器。
- forEach()：遍历Map的所有成员。

```js
const map = new Map([
     ["foo",1],
     ["bar",2],
])
for(let key of map.keys()){
    console.log(key);  // foo bar
}
for(let value of map.values()){
     console.log(value); // 1 2
}
for(let items of map.entries()){
    console.log(items);  // ["foo",1]  ["bar",2]
}
map.forEach( (value,key,map) => {
     console.log(key,value); // foo 1    bar 2
})
```

**（2）WeakMap**

WeakMap 对象也是一组键值对的集合，其中的键是弱引用的。**其键必须是对象**，原始数据类型不能作为key值，而值可以是任意的。



该对象也有以下几种方法：

- **set(key,value)**：设置键名key对应的键值value，然后返回整个Map结构，如果key已经有值，则键值会被更新，否则就新生成该键。（因为返回的是当前Map对象，所以可以链式调用）
- **get(key)**：该方法读取key对应的键值，如果找不到key，返回undefined。
- **has(key)**：该方法返回一个布尔值，表示某个键是否在当前Map对象中。
- **delete(key)**：该方法删除某个键，返回true，如果删除失败，返回false。

其clear()方法已经被弃用，所以可以通过创建一个空的WeakMap并替换原对象来实现清除。



WeakMap的设计目的在于，有时想在某个对象上面存放一些数据，但是这会形成对于这个对象的引用。一旦不再需要这两个对象，就必须手动删除这个引用，否则垃圾回收机制就不会释放对象占用的内存。



而WeakMap的**键名所引用的对象都是弱引用**，即垃圾回收机制不将该引用考虑在内。因此，只要所引用的对象的其他引用都被清除，垃圾回收机制就会释放该对象所占用的内存。也就是说，一旦不再需要，WeakMap 里面的**键名对象和所对应的键值对会自动消失，不用手动删除引用**。



**总结：**

- Map 数据结构。它类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键。
- WeakMap 结构与 Map 结构类似，也是用于生成键值对的集合。但是 WeakMap 只接受对象作为键名（ null 除外），不接受其他类型的值作为键名。而且 WeakMap 的键名所指向的对象，不计入垃圾回收机制。



## 17. for...in 和 for...of 的区别

for…of 是ES6新增的遍历方式，允许遍历一个含有iterator接口的数据结构（数组、对象等）并且返回各项的值，和ES3中的for…in的区别如下

- for…in 获取的是对象的键名，for…of 遍历获取的是对象的键值；
- for… in 会遍历对象的整个原型链，性能非常差不推荐使用，而 for … of 只遍历当前对象不会遍历原型链；
- 对于数组的遍历，for…in 会返回数组中所有可枚举的属性(包括原型链上可枚举的属性)，for…of 只返回数组的下标对应的属性值；



**总结：**for...in 循环主要是为了遍历对象而生，不适用于遍历数组；for...of 循环可以用来遍历数组、类数组对象，字符串、Set、Map 以及 Generator 对象。



## 18. 如何使用 for...of 遍历对象

 `ES6` 中提供了 `for-of`，可以很方便的遍历数组和类数组，但是却不能遍历对象，这是为什么，与 `for-in` 仅仅相差一个单词，用途也是遍历，为什么却不能使用在对象上？

查资料后得知，原来 `ES6` 中引入了 `Iterator`，只有提供了 `Iterator` 接口的数据类型才可以使用 `for-of` 来循环遍历，而 `Array`、`Set`、`Map`、某些类数组如 `arguments` 等数据类型都默认提供了 `Iterator` 接口，所以它们可以使用 `for-of` 来进行遍历

那么原因清楚了，该怎么解决呢？能不能为对象已经其它的一些数据类型提供 `Iterator` 接口呢

答案是可以的，`ES6` 同时提供了 `Symbol.iterator` 属性，只要一个数据结构有这个属性，就会被视为有 `Iterator` 接口，接着就是如何实现这个接口了，如下就是一个最简实现：

```js
newObj[Symbol.iterator] = function* (){
    let keys = Object.keys( this )
        ;
    
    for(let i = 0, l = keys.length; i < l; i++){
        yield {
            key: keys[i]
            , value: this[keys[i]]
        };
    }
}

for(let {key, value} of newObj){
    console.log(key, value );
}
// 输出结果
// e 5
// f 6
```



## 19. **keys，values，entries**

ES6 提供三个新的方法 —— entries()，keys()和values() —— 用于遍历数组。它们都返回一个遍历器对象，可以用for...of循环进行遍历，唯一的区别是keys()是对键名的遍历、values()是对键值的遍历，entries()是对键值对的遍历

```js
for (let index of ['a', 'b'].keys()) {
console.log(index);
}
// 0
// 1
for (let elem of ['a', 'b'].values()) {
console.log(elem);
}
// 'a'
// 'b'
for (let [index, elem] of ['a', 'b'].entries()) {
console.log(index, elem);
}
// 0 "a"
// 1 "b"
```



## 20. import和export

### import的方式

```javascript
import a from './module.js'

import {a} from './module.js'

import deflt, {a} from './module.js'

import * as a from './module.js'
```

### export的方式

```javascript
export const a = 1 //export后面是一个表达式

export function b(){} //export后面是一个函数声明语句

export default {c: 1} //export default

export {a} from './module.js'
```

### import到底import了谁

其实就是个连线题。一个模块export的对象有两种，一种是通过export default导出的，另一种是通过export导出的。通过export default导出的可以用以下方式接收：

```js
import defaultObj from 'module'
```

通过export导出的对象有以下两种接收方式：

```javascript
// 导出
export const a = 1;

// 导入时

// 方式一
import * as md from 'module'

// md 拿到了所有用export方式导出的对象，这些对象都作为md的属性

md.a // 1

// 方式2，直接对*解构
import {a} from 'module'
```

![uploading-image-350111.png](https://img2018.cnblogs.com/blog/1016471/201902/1016471-20190219153003591-470047644.png)

### 使用 as 重命名

有时候，模块里的变量名和本地的变量名可能会出现命名冲突，这时可以使用 as 关键字起个别名。可以给默认导出的default变量，导出的某一个模块变量，或者给*这个命名空间直接命名

```js
import * as name from "module-name";
import defaultExport, * as name from "module-name";
import { export1 , export2 as alias2 , [...] } from "module-name";
```

从上面的例子中可以看出，可以对`*`进行解构
