---
title: Webpack
date: 2022-01-01
tags:
 - Webpack
categories:
 - 前端
---

### CommonJS和ES6 Module

1. **动态和静态**
   CommonJS 与 ES6 Module最本质的区别在于前者对**模块依赖的解决**是“动态的”，而后者是“静 态的”。在这里“动态”的含义是，模块依赖关系的建立发生在代码运行阶段;而“静态”则是模块依赖关系的建立发生在代码编译阶段。

   ```javascript
   //CommonJS
   ...some script
   var name = require('./person.js').name
   
   //ES6 Module
   import {name} from './person.js' 
   ```

   我们可以看出，CommonJS可以在代码的任何位置引入模块，而ES6 Module只能在文件的开头导入模块。因此CommonJS的实际导入行为是发生在代码执行时的，因此是动态的，而ES6 Module则会在代码执行前就导入模块（代码编译阶段），因此是静态的。因此ES6 Module相比CommonJS有如下优点：

   - 死代码检测和排除。我们可以用静态分析工具检测出哪些模块没有被调用过。
     比如，在引入工具类库时，工程中往往只用到了其中一部分组件或接口，但有可能会将其代码完整地加载进来。未被调用到的模块代码永远不会被执行，也就成为了死代码。通过静态分析可以在打包时去掉这些未曾使用过的模块，以减小打包资源体积。
   - 模块变量类型检查。JavaScript属于动态类型语言，不会在代码执行前检查类型错误（比如对一个字符串类型的值进行函数调用)。ES6 Module的静态模块结构有助于确保模块之间传递的值或接口类型是正确的。
   - 编译器优化。在 CommonJS等动态模块系统中，无论采用哪种方式，本质上导入的都是一个对象，而ES6 Module支持直接导入变量，减少了引用层级，程序效率更高。
   
2. **拷贝与动态映射**

   在导入一个模块时，对于CommonJS来说获取的是一份**导出值的拷贝（浅拷贝）**；而在ES6Module中则是**值的动态映射**，并且这个映射是**只读**的。

   CommonJS中的值拷贝:

   ```javascript
   // calculator.js .
   var count = 0;
   module.exports = {
       count: count,
       add: function(a， b) {
           count += 1;
           return a + b;
       };
   }
   // index.js
   var count = require('./calculator.js') .count ; 
   var add = require('./calculator.js') .add;
   console. log(count); //0
   add(2，3) ;
   console. log (count); // 0 (calculator.js中变量值的改变不会对拷贝值造成影响)
   count += 1;
   console. log (count); // 1 (拷贝的值可以更改)
   ```

   ES6 Module的值动态映射：

   ```javascript
   // calculator.js .
   let count = 0;
   let add = function(a, b){
       count++;
       return a + b;
   }
   export{ count, add }
   // index.js
   import ( count， add ) from './calculator.js';
   console. log(count); // 0 (对calculator.js 中count 值的映射)
   add(2，3) ;
   console. log(count); // 1 (实时反映calculator.js中count值的变化)
   count += 1; //不可更改，会抛出SyntaxBrror: "count" is read-only
   ```

   上面的例子展示了ES6 Module中导入的变量其实是对原有值的动态映射。index.js
   中的count是对calculator.js中的count值的实时反映，当我们通过调用add函数更改了
   calculator.js中count值时，index.js 中count的值也随之变化。
   我们不可以对ES6 Module导入的变量进行更改，可以将这种映射关系理解为一面
   镜子，从镜子里我们可以实时观察到原有的事物，但是并不可以操纵镜子中的影像。	

3. **循环依赖**

   循环依赖是指模块A依赖于模块B，同时模块B依赖于模块A。一般来说工程中应该尽量避免循环依赖的产生，因为从软件设计的角度来说，单向的依赖关系更加清晰，而循环依赖则会带来一定的复杂度。

   CommonJS中循环依赖的例子:

   ```javascript
   // foo.js
   const bar = require('./bar.js');
   console.log('value of bar:', bar);
   module.exports = 'This is foo.js';
   // bar.js
   const foo = require('./foo.js');
   console.log('value of foo:'， foo);
   module.exports = 'This is bar.js';
   // index.js
   require('./foo.js');
   ```

   理想状态下我们希望在控制台上输出。

   ```javascript
   value of foo: This is foo.js
   value of bar: This is bar.js
   ```

   而当我们运行上面的代码时，实际输出却是:

   ```javascript
   value of foo: {}
   value of bar: This is bar.is
   ```

   为什么foo的值会是一个空对象呢?让我们从头梳理一下代码的实际执行顺序。

   1. index.js导入了foo.js， 此时开始执行foo.js中的代码。
   2. foo.js 的第一句导入了bar.js， 这时foo.js不会继续向下执行，而是进入了bar.js内部。
   3. 在bar.js中又对foo.js进行了require，这里产生了循环依赖。需要注意的是，执行权并不会再交回foo.js，而是**直接取其导出值**，也就是module.exports。 但由于foo.js未执行完毕，导出值在这时为默认的空对象，因此当bar.js执行到打印语句时，我们看到控制台中的value of foo就是一个空对象。

   我们再从Webpack的实现角度来看，将上面例子打包后，bundle.js 中有这样一段代码非常重要:

   ```javascript
   // The require function 
   function __webpack_require__(moduleId){
       if (installedModules[moduleId]) {
           return installedModules[moduleId].exports;
       };
       //创建模块，我们可以看见，模块的安装是先于模块的执行的
       var module = installedModules[moduleId] = {
           i: moduleId,
           l: false,
           exports: {}
       }
   }
   ```

   当index.js引用了foo.js之后，相当于执行了这个_\_webpack_require__ 函数, 初始化了一个module对象并放入installedModules中。当bar.js再次引用foo.js时，又执行了该函数，但这次是直接从installedModules里面取值，此时它的module.exports是一个空对象。这就解释了上面在第3步看到的现象。

   接下来让我们使用ES6 Module的方式重写上面的例子：

   ```javascript
   //foo.js
   import bar from ' ./bar.js';
   console.log('value of bar:', bar) ;
   export default 'This is foo.js';
   // bar.js
   import foo from ' ./foo.js' ;
   console.log{'value of foo:', foo);
   export default 'This is bar.js';
   // index.js
   import foo from ' ./foo.js';
               
   //执行结果如下:
   value of foo: undefined
   value of bar: This is bar.js
   ```

   很遗憾，在bar.js中同样无法得到foo.js正确的导出值，只不过和CommonJS默认导出一个个空对象不同，这里获取到的是undefined。
   上面我们谈到，在导入一个模块时，CommonJS获取到的是值的拷贝，ES6 Module则是动态映射，那么我们能否利用ES6Module的特性使其支持循环依赖呢?请看下面这个例子:

   ```javascript
   //index.js
   import foo from ' ./foo.js';
   foo('index.js'):
   // foo.js
   import bar from './bar.js';
   function foo(invoker) {
       console.log (invoker + ' invokes foo.js');
       bar('foo.js');
   }
   export default foo;
   // bar.js
   import foo from './foo.js'; //在这里时，foo还是没有值的
   let invoked = false;
   function bar(invoker) {
       if(!invoked) {
           invoked = true;
           console.log (invoker + ' invokes bar.js');
           foo('bar.js'); //执行到这里时，由于现在的执行权在index.js上，所以foo函数已成功导出，所以可以调用
       }
   }
   export default bar;
   
   //上面代码的执行结果如下:
   index.js invokes foo.js
   foo.js invokes bar.js
   bar.js invokes foo.js
   ```

   由上面的例子可以看出，ES6 Module的特性使其可以更好地支持循环依赖，只是需要由开发者来保证当导入的值被使用时已经设置好正确的导出值。



### 模块打包原理

面对工程中成百上千个模块，Webpack 究竟是如何将它们有序地组织在一起，并按照我们预想的顺序运行在浏览器上的呢？下面我们将从原理上进行探究:

```javascript
 // index.js
const calculator = require('./calculator.js'); 
const sum = calculator.add(2, 3); 
console.log('sum', sum);
// calculator.js
module.exports = { 
    add: function(a, b) { 
        return a + b;
    }
};
```

上面的代码经过Webpack打包后将会成为如下的形式（为了易读性这里只展示代码的大体结构）：

```javascript
// 立即执行匿名函数 
(function(modules) { 
    //模块缓存
    var installedModules = {}; 
    // 实现require
    function __webpack_require__(moduleId) { 
        ...
    } 
        // 执行入口模块的加载 
        return __webpack_require__(__webpack_require__.s = 0); 
})({
        // modules：以key-value的形式储存所有被打包的模块 
        0: function(module, exports, __webpack_require__) { 
            // 打包入口
            module.exports = __webpack_require__("3qiv"); 
        },
        "3qiv": function(module, exports, __webpack_require__) { 
            // index.js内容
        },
        jkzz: function(module, exports) { 
            // calculator.js 内容
        }
});
```

这是一个最简单的Webpack 打包结果（bundle），但已经可以清晰地展示出它是如何将具有依赖关系的模块串联在一起的。上面的 bundle 分为以下几个部分：
1. 最外层立即执行匿名函数。它用来包裹整个 bundle，并构成自身的作用域。 
2. installedModules 对象。每个模块只在第一次被加载的时候执行，之后其导出值就被存储到这个对象里面，当再次被加载的时候直接从这里取值，而不会重新执行。
3. _\_webpack_require__ 函数。对模块加载的实现，在浏览器中可以通过调用 _\_webpack_require__(module_id) 来完成模块导入。
4. modules 对象。工程中所有产生了依赖关系的模块都会以 key-value 的形式放在 这里。key 可以理解为一个模块的 id，由数字或者一个很短的 hash 字符串构成； value 则是由一个匿名函数包裹的模块实体，匿名函数的参数则赋予了每个模块导出和导入的能力。

接下来让我们看看一个 bundle 是如何在浏览器中执行的。 

1. 在最外层的匿名函数中会初始化浏览器执行环境，包括定义 installedModules 对
   象、_\_webpack_require__ 函数等，为模块的加载和执行做一些准备工作。
2. 加载入口模块。每个 bundle 都有且只有一个入口模块，在上面的示例中，
   index.js 是入口模块，在浏览器中会从它开始执行。
3. 执行模块代码。如果执行到了 module.exports 则记录下模块的导出值；如果中
   间遇到 require 函数（准确地说是 \_\_webpack_require\__），则会暂时交出执行权，进入 \_\_webpack_require__ 函数体内进行加载其他模块的逻辑。
4. 在 _\_webpack_require__ 中会判断即将加载的模块是否存在于 installedModules 中。如果存在则直接取值，否则回到第 3 步，执行该模块的代码来获取导出值。
5. 所有依赖的模块都已执行完毕，最后执行权又回到入口模块。当入口模块的代码执行到结尾，也就意味着整个 bundle 运行结束。 不难看出，第 3 步和第 4 步是一个递归的过程。Webpack 为每个模块创造了一个可以导出和导入模块的环境，但本质上并没有修改代码的执行逻辑，因此代码执行的顺序与模块加载的顺序是完全一致的，这就是Webpack 模块打包的奥秘。



### 资源输入输出

#### 资源处理流程

从上面我们已经了解到，Webpack 会从入口文件开始检索，并将具有依赖关系的模块生成一棵依赖树，最终得到一个chunk。由这个chunk得到的打包产物我们一般称之为bundle。entry、chunk、 bundle 的关系如图所示：

<img src="https://files.catbox.moe/c1b0di.png" style="zoom:100%;margin-left:0" />

#### 配置资源入口

##### 配置项

Webpack通过context和entry这两个配置项来共同决定入口文件的路径。在配置
入口时，实际上做了两件事:

- 确定入口模块位置（context + entry），告诉Webpack从哪里开始进行打包。
- 定义chunk name。 如果工程只有一个入口，那么默认其chunk name为“main"；如果工程有多个入口，我们需要为每个入口定义chunk name,来作为该chunk的唯一标识。

context可以理解为资源入口的路径前缀，在配置时要求必须使用绝对路径的形式。
请看下面两个例子：

```javascript
//以下两种配置达到的效果相同，入口都为<工程根路径>/src/scripts/index.js
module.exports = {
    context: path.join(__dirname, './src'), 
    entry: './scripts/index.js',
}; 
module.exports = {
	context: path.join(__dirname, './src/scripts'), 
    entry: './index.js',
};
```

配置 context 的主要目的是让 entry 的编写更加简洁，尤其是在多入口的情况下。 context 可以省略，默认值为当前工程的根目录。

entry 与 context 只能为字符串不同，entry 的配置可以有多种形式：字符串、数组、对象、 函数。可以根据不同的需求场景来选择。

1. 字符串类型入口，直接传入文件路径： 

  ```javascript
  module.exports = {
      entry: './src/index.js', 
      output: {
          filename: 'bundle.js', 
      }, 
      mode: 'development'
  }; 
  ```

2. 数组类型入口
    传入一个数组的作用是将多个资源预先合并，在打包时Webpack 会将数组中的最后一个元素作为实际的入口路径。如： 

  ```javascript
  module.exports = {
      entry: [
          'babel-polyfill', 
          './src/index.js'
      ]
  };
  
  上面的配置等同于：
  //webpack.config.js 
  module.exports = {
      entry: './src/index.js'
  }; 
  // index.js
  import 'babel-polyfill';
  ```

3. 对象类型入口如果想要定义**多入口** ， 则必须使用对象的形式。
   对象的属性名（key）是 chunk name，属性值（value）是入口路径。如：

   ```javascript
   module.exports = { 
       entry: {
           // chunk name为index，入口路径为./src/index.js 
           index: './src/index.js', 
           // chunk name为lib，入口路径为./src/lib.js 
           lib: './src/lib.js',
       }
   }; 
   
   //对象的属性值为字符串或数组。如：
   module.exports = { 
       entry: {
           index: ['babel-polyfill', './src/index.js'], 
           lib: './src/lib.js',
       } 
   }; 
   ```

   在使用字符串或数组定义单入口时，并没有办法更改 chunk name，只能为默认的 “main”。在使用对象来定义多入口时，则必须为每一个入口定义 chunk name。
   
4. 函数类型入口

   用函数定义入口时，只要返回上面介绍的任何配置形式即可，如：

   ```javascript
   // 返回一个字符串型的入口
   module.exports = {
       entry: () => './src/index.js', 
   };
   // 返回一个对象型的入口 
   module.exports = { 
       entry: () => ({
           index: ['babel-polyfill', './src/index.js'], 
           lib: './src/lib.js',
   	}), 
   };
   ```

   传入一个函数的优点在于我们可以在函数体里添加一些动态的逻辑来获取工程的入 口。另外，函数也支持返回一个 Promise 对象来进行异步操作。

   ```javascript
   module.exports = {
       entry: () => new Promise((resolve) => { 
           // 模拟异步操作 
           setTimeout(() => {
               resolve('./src/index.js'); 
           }, 1000); 
       }),
   };
   ```

##### 实例

**单页应用**

单页应用好处是只会产生一个 JS 文件，依赖关系清晰。即所有模块都打包到一起，当应用的规模上升到一定程度之后会导致产生的资源体积过大，降低用户的页面渲染速度，而且当代码发生一点改变并打包上传后，用户的缓存便失效而不得不重新下载整个资源，这对于页面的加载也是不利的。
解决单页应用所引发的性能问题可以使用vendor来分割业务代码和第三方依赖，如：

```javascript
module.exports = {
    context: path.join(__dirname, './src'),
   	entry: {
        app: './src/app.js',
        vendor: ['react', 'react-dom', 'react-router']
    }
};
```

通过这样的配置，app.js 产生的 bundle 将只包含业务模块，其依赖的第三方模块将会被抽取出来生成一个新的 bundle，由于 vendor 仅仅包含第三方模块，这部分不会经常变动，因此可以有效地利用客户端缓存，在用户后续请求页面时会加快整体的渲染速度。

**多页应用**

对于多页应用的场景，为了尽可能减小资源的体积，我们希望每个页面都只加载各自必要的逻辑，而不是将所有页面打包到同一个 bundle 中。因此每个页面都需要有一个独立的 bundle，这种情形我们使用多入口来实现。请看下面的例子：

```javascript
module.exports = { 
    entry: {
        pageA: './src/pageA.js', 
        pageB: './src/pageB.js', 
        pageC: './src/pageC.js',
    }, 
};
```

在上面的配置中，入口与页面是一一对应的关系，这样每个 HTML 只要引入各自的 JS 就可以加载其所需要的模块。另外，对于多页应用的场景，我们同样可以使用提取 vendor 的方法，将各个页面之间的公共模块进行打包。如：

```javascript
module.exports = { 
    entry: {
        pageA: './src/pageA.js', 
        pageB: './src/pageB.js', 
        pageC: './src/pageC.js', 
        vendor: ['react', 'react-dom'] ,
    }, 
};
```

可以看到，我们将 react 和 react-dom 打包进了 vendor，之后再配置 optimization.splitChunks，将它们从各个页面中提取出来，生成单独的 bundle 即可。



#### 配置资源出口

##### 配置项

接着我们来看资源输出相关的配置,所有与出口相关的配置都集中在 output 对象里。例如：

```javascript
const path = require ('path') ;
module.exports = {
    entry: './ src/app.js',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname,'assets' ) ,
        publicPath: '/dist/' ,
    }，
};
```

- filename：filename的作用是控制输出资源的文件名，其形式为字符串，默认为 "bundle.js"，webpack也支持动态生成输出资源的文件名，如：

  ```javascript
  module.exports = {
      entry : {
          app: './src/app.js',
          vendor: './src/vendor.js',
      },
      output : {
          filename: '[name].js' ,
      } ,
  };
  ```

  在资源输出时，上面配置的 filename中的[name]会被替换为chunk name，因此最后项目中实际生成的资源是vendor.js 与 app.js,
  除了[name]可以指代chunk name 以外，还有其他几种模板变量可以用于filename的配置中，如表所示：

  | 变量名称    | 功能描述                               |
  | ----------- | -------------------------------------- |
  | [hash]      | 指代webpack 此次打包所有资源生成的hash |
  | [chunkhash] | 指代当前chunk 内容的 hash              |
  | [id]        | 指代当前chunk 的id                     |
  | [query]     | 指代filename配置项中的query            |

- path：path 可以指定资源输出的位置，要求值必须为绝对路径，默认值为 "dist"目录。如:

  ```javascript
  const path = require( 'path ' );
  module.exports = {
      entry : './src/app.js',
      output : {
          filename : 'bundle.js',
          path: path.join(__dirname, 'dist' ),
      },
  };
  ```

- publicPath：publicPath是一个非常重要的配置项，并且容易与 path 相混淆。从功能上来说， path 用来指定资源的输出位置，而 publicPath 则用来指定资源的请求位置。让我们详细解释这两个定义：

  - 输出位置：打包完成后资源产生的目录，一般将其指定为工程中的 dist 目录。 
  - 请求位置：由 JS 或 CSS 所请求的间接资源路径。页面中的资源分为两种，一种是由 HTML 页面直接请求的，比如通过 script 标签加载的 JS；另一种是由 JS 或 CSS 请求的，如异步加载的 JS、从 CSS 请求的图片字体等。publicPath 的作用就是指定这部分间接资源的请求位置。

  ```javascript
  //若当前HTML地址为https://example.com/app/index.html,异步加载的资源名为0.chunk.js
  publicPath: "" // 实际路径https://example.com/app/0.chunk.js
  publicPath: "../assets/" // 实际路径https://example.com/aseets/0.chunk.js
  publicPath: "http://cdn.com/" // 实际路径http://cdn.com/0.chunk.js
  ```



##### 实例

**单入口应用**

对于单入口的场景来说，通常不必设置动态的 output.filename，直接指定输出的文件名即可。

**多入口应用**

在多入口的场景下，必然会需要模板变量来配置 filename。请看下面的例子： 

```javascript
const path = require('path'); 
module.exports = { 
    entry: {
        pageA: './src/pageA.js', 
        pageB: './src/pageB.js',
    }, 
    output: { 
        filename: '[name].js', 
    }, 
};
//最终输出两个文件 /dist/pageA.js 和 /dist/pageB.js，不过为了使客户端精确更新资源，一般需要使用[chunkhash]
```



### 预处理器

#### 使用

**loader的源码结构**

```javascript
module.exports = function loader(content,map, meta){
    var callback = this.async();
    var result = handler(content,map,meta);
    callback(
        null, //error
        result.content, //转换后的内容
        result.map, //转换后的source-map
        result.meta, //转换后的AST
    );
);
```

**引入loader**

```javascript
npm install css-loader

module.exports = {
    // ...
    module: {
        rules: [{
            test: /\.css$/ ,
            use: ['css-loader'],
        }],
    },
};
```

#### 配置项

- **exclude**、**include**

  exclude和 include同时存在时，**exclude 的优先级更高**。如：

  ```javascript
  module: {
      rules:[{
          test: /\.css$/,
          use: ['style-loader', 'css-loader"], 
          exclude: /node_modules/,
          include: /node_modules\/awesome-ui/ ,
      }],
  },
  ```

- **resource**、**issuer**

  resource 与 issuer可用于更加精确地确定模块规则的作用范围。在 Webpack 中，我们认为被加载模块是resource，而加载者是issuer。前面介绍的test、exclude、include本质上属于对resource的配置，而issuer的配置如下：

  ```javascript
  module: {
      rules:[
          {
              test: /\.css$/,
              use: ['style-loader', 'css-loader'],
              exclude: /node_modules/,
              //只有在 /src/pages/ 下的JS文件引用的CSS文件才能使这条规则失效
              issuer: {
                  test: /\.js$/,
                  include: /src\/pages/,
              },
          }
      ],
  },
  ```

- **enforce**

  Webpack中的 loader 按照执行顺序可分为pre、inline、normal、post 四种类型，上面我们直接定义的 loader 都属于normal类型，inline形式官方已经不推荐使用，而pre和post则需要使用enforce来指定。如：

  ```javascript
  //eslint-loader对所有js文件进行语法检测，pre则保证代码没有被其他loader修改过
  rules:[
      {
          test: /\.js$/,
          enforce: 'pre',
          use: 'eslint-loader',
      }
  ],
  ```



#### 常用loader

##### babel-loader

将ES6+的语法转化成ES5，使我们能在保证兼容性的同时使用最新的语法

**安装**

```shell
npm install babel-loader @babel/core @babel/preset-env
```

- babel-loader: 使Babel 与 Webpack 协同工作的模块。
- @babel/core: Babel编译器的核心模块。
- @babel/preset-env: Babel官方推荐的预置器，可根据用户设置目标环境。

**配置**

```javascript
rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
            loader: 'babel-loader',
            options: {
                cacheDirectory: true,
                presets: [[
                    'env', {
                        modules: false,
                    }
                ]],
            },
        },
	}],
```

- cacheDirectory配置项会启用缓存机制，防止对未改变的文件进行二次编译，从而加快打包的速度。cacheDirectory可以接收一个字符串来作为缓存路径，这个值也可以为true，此时其缓存目录会指向node_modules/.cache/babel-loader。
- 由于@babel/preset-env会将ES6 Module转化为CommonJS的形式，从而导致 Webpack 中的tree-shaking特性失效。将@babel/preset-env的modules配置项设置为false会禁用模块语句的转化，而将ES6Module的语法交给Webpack本身处理。
- babel-loader支持从**.babelrc**文件读取Babel配置，因此可以将presets和 plugins 从Webpack配置文件中提取出来，也能达到相同的效果。



##### ts-loader

ts-loader 与 babel-loader 的性质类似，它是用于连接Webpack 与 Typescript的模块。

**安装**

```shell
npm install ts-loader
```

**配置**

```javascript
rules:[
    {
        test: /\.ts$/,
        use: 'ts-loader',
    }
],
```

需要注意的是，Typescript本身的配置并不在 ts-loader中，而是必须要放在工程目录下的 tsconfig.json中。如：

```json
{
    "compileroptions": {
        "target": "es5",
        "sourceMap": true,
	},
}
```

通过Typescript和 ts-loader，我们可以实现代码类型检查。[配置文档](https://github.com/TypeStrong/ts-loader)



##### html-loader

html-loader 用于将HTML文件转化为字符串并进行格式化，这使得我们可以把一个HTML片段通过JS加载进来。

**安装**

```shell
npm install html-loader
```

**配置**

```javascript
rules: [
    {
        test: /\.html$/,
        use: 'html-loader',
	}
],
```

**使用实例**

```jsx
//header.html
<header>
	<h1>This is a Header.</h1>
</header>

//index.js
import headerHtml from './header.html';
//header.html将会转化为字符串，并通过document.write插人页面中。
document.write(headerHtml) ;
```



##### file-loader

file-loader用于打包文件类型的资源，并返回其publicPath。

**安装**

```shell
npm install file-loader
```

**配置**

```javascript
const path = require('path');
module.exports = {
    entry: './app.js',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.(png|jpg|gif)$/,
                use: 'file-loader', 
            }
        ],
    },
};
```

上面我们对png、jpg、gif 这类图片资源使用file-loader,然后就可以在JS中加载图片了，如：

```javascript
//index.js
import avatarImage from './avatar.jpg';
console.log (avatarImage); // c6f482ac9a1905e1d7d22caa909371fc.jpg

//webpack.config.js
output: {
    publicPath: './assets'
}
//index.js
import avatarImage from './avatar.jpg';
console.log (avatarImage); // ./assets/c6f482ac9a1905e1d7d22caa909371fc.jpg
```

使用Webpack打包完成后，dist 目录下会生成名为 `c6f482ac9al905e1d7d22caa909371fc.jpg`的图片文件。当配置中并没有指定output.publicPath时，打印的图片路径只是文件名，默认为文件的hash值加上文件后缀。



##### url-loader

url-loader与file-loader作用类似，唯一的不同在于用户可以设置一个文件大小的阈值，当大于该阈值时与file-loader一样返回publicPath, 而小于该阈值时则返回文件的base64形式编码。

**安装**

```shell
npm install url-loader
```

**配置**

```javascript
rules: [
    {
        test: /\.(png|jpg|gif)$/,
        use: {
            loader: 'url-loader',
            options: {
                limit: 10240,
                name: '[name].[ext]',
                publicPath: './assets-path/',
            },
        },
    }
]
```

**使用示例**

```javascript
import avatarImage from './avatar.jpg';
console.log (avatarImage); //data:image/jpeg;base64,/9j/2wCEAAgGBg.....
```

由于图片小于limit设置的大小，因此经过url-loader转化后得到的是base64形式的编码。



#### 自定义loader

- 创建  force-strict-loader 目录，执行 `npm init`

- 在目录下创建index.js，编写loader

  ```javascript
  module.export = function(content){
  	var strict = '\'use strict\';\n\n';
      return strict + content
  }
  ```

- 在自己的工程项目中安装 loader

  ```shell
  npm install <path-of-loader>/force-strict-loader
  ```

- 配置loader

  ```javascript
  module: {
      rules:[
          {
              test: /\.js$/,
              use: 'force-strict-loader'
          }
      ]
  }
  ```

配置完后，我们自定义的 `force-strict-loader` 就会对所有JS文件添加严格模式。

**启用缓存**

当文件输人和其依赖没有发生变化时，应该让loader直接使用缓存，而不是重复进行转换的工作。在Webpack中可以使用 this.cacheable 进行控制：

```javascript
// force-strict-loader/index.js
module.exports = function (content) {
    if (this.cacheable) {
        this.cacheable();
    }
    var strict = '\'use strict\';\n\n';
    return strict + content;
}
```

通过启用缓存可以加快Webpack打包速度，并且可保证相同的输人产生相同的输出。



**获取options**

loader的配置项可通过use.options传进来，如：

```javascript
rules: [
    {
        test: /\.js$/,
        use: {
            loader: 'force-strict-loader',
            options: {
                sourceMap: true,
            },
        },
    }
],
```

上面我们为force-strict-loader传人了一个配置项sourceMap，接下来我们要在loader中获取它。可以使用一个依赖库loader-utils提供的帮助函数获取：

```javascript
//在控制台执行以下命令:
npm install loader-utils

// force-strict-loader/index.js
var loaderUtils = require("loader-utils");
module.exports = function(content) {
    if (this.cacheable) {
        this.cacheable();
    }
    //获取和打印options 
    var options = loaderUtils.getOptions (this) || {};
    console.log('options', options);
    //处理content
    var strict = '\'use strict\';\n\n';
    return strict + content ;
}
```

**实现source-map**

```javascript
// force-strict-loader/index.js
var loaderUtils = require("loader-utils") ;
var SourceNode = require("source-map").SourceNode ;
var SourceMapConsumer = require("source-map").SourceMapConsumer;
module.exports = function(content, sourceMap) {
    var useStrictPrefix = '\'use strict\';\n\n';
    if (this.cacheable) {
        this.cacheable();
    }
    var options = loaderUtils.getoptions(this) || {};
    //支持sourceMap的版本
    if (options.sourceMap && sourceMap) {
        var currentRequest = loaderUtils.getCurrentRequest(this);
        var node = SourceNode.fromStringWithSourceMap(
            content,
            new SourceMapConsumer (sourceMap));
        
        node.prepend(useStrictPrefix);
        var result = node.toStringWithSourceMap({ file: currentRequest });
        var callback = this.async();
        callback (null, result.code, result.map.toJSON());
    }
    //不支持sourceMap的版本
    return useStrictPrefix + content;
}
```

- 首先，在loader函数的参数中我们获取到sourceMap对象，这是由Webpack或者上一个loader传递下来的，只有当它存在时我们的loader才能进行继续处理和向下传递。
- 之后我们通过 `source-map` 这个库来对map进行操作，包括接收和消费之前的文件内容和sourceMap，对内容节点进行修改，最后产生新的sourceMap。
- 在函数返回的时候要使用 this.async 获取 callback 函数（主要是为了一次性返回多个值）。callback函数的3个参数分别是`抛出的错误`、`处理后的源码`，`向下一级传递的sourceMap`。



### 样式处理

#### 分离样式文件

在Webpack中，我们通常会独立编写 js 文件和 css 文件，并在 js 中导入 css 模块，如：

```javascript
//index.css
body{
	margin: 0
}

//index.js
import './index.css'
```

同时，我们一般会在 webpack.config.js 中为 css 文件配置 `css-loader`和`style-loader`，如：

```javascript
//webpack.config.js
module.export = {
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    }
}
```

配置完后，loader处理原理大致为：

- css-loader将index.css的样式内容转化为字符串形式，并将其作为js模块的导出内容。
- style-loader 执行css-loader导出的 js 模块，获取到样式字符串，然后再以 `style标签`的形式拼接到文档中

style-loader的大致原理如下：

```javascript
module.exports = function (content) {
  // do nothing
};

//pitch函数的执行顺序与loader处理顺序相反
//执行顺序为 css-loader -> style-loader -> style-loader.pitch -> css-loader.pitch
//remainingRequest参数为loader链的剩余部分，在这是css-loader(css-loader.pitch未执行)
module.exports.pitch = function (remainingRequest) {
    
  //用'!!'前缀跳过配置中的loader，避免重复执行
  //用loaderUtils的stringifyRequest方法将request语句中的绝对路径转为相对路径
  //在这里requestPath为: '!!../node_modules/css-loader/index.js!src/index.css'
  //前面我们说到 loader的配置有字符串形式和数组形式，其实还有一种内联(inline)形式，就是     requestPath的这种表示形式
  const requestPath = loaderUtils.stringifyRequest(this, '!!' + remainingRequest);
    
  //用require语句获取css-loader返回的js模块的导出
  return `
    const content = require(${requestPath})
    const style = document.createElement('style');
    style.innerHTML = content;
    document.head.appendChild(style);
  `;
};
```

从上面我们可以看出，导入的 css 模块最终会以 style标签的形式存在于我们的HTML中，因此不利于客户端对于 css 的缓存，因此我们使用`extract-text-webpack-plugin`这个插件来完成功能。

**extract-text-webpack-plugin**

- 安装

  ```shell
  npm install extract-text-webpack-plugin
  ```

- 配置

  ```javascript
  const ExtractTextPlugin = require('extract-text-webpack-plugin');
  
  module.exports = {
      entry: './app.js',
      mode : 'development',
      module: {
          rules: [{
                  test: /\.css$/，
                  use: ExtractTextPlugin.extract({
                          fallback: 'style-loader', 
                          use:'css-loader',
                      })
          }],
  	},
      plugins: [
          newExtractTextPlugin('bundle.css')
      ],
  };
  ```

​		我们在配置文件中并没有直接传入loader，而是使用了插件的`extract`方法包了一层。内部的`fallback`属性指定提取失败所采用的 loader，`use`属性指定在提取样式之前采用哪些 loader 进行预处理。除此之外，还要在`plugins`配置中添加该插件，并传入提取后的资源文件名。
​       进行打包后，所有导入的 css 文件的内容都会被提取到一个名为 `bundle.css`的文件，我们可以直接在 html 中使用它，以达到优化缓存的目的。



#### 多入口样式文件处理

```javascript
//webpack.config.js
const ExtractTextPlugin = require ('extract-text-webpack-plugin');
module.exports = {
    entry: {
        foo: './src/scripts/foo.js',
        bar: './src/scripts/bar.js',
    },
    output: {
        filename: '[name].js',
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader',
                }),
            }
        ],
    },
    plugins:[new ExtractTextPlugin('[name].css')]
}
```

打包后会在 dist 目录下生成 `foo.js`, `bar.js`,`foo.css`, `bar.css`



#### mini-css-extract-plugin

`mini-css-extract-plugin`可以理解成`extract-text-webpack-plugin`的升级版，它拥有更丰富的特性和更好的性能。
`mini-css-extract-plugin`最重要的就是它支持按需加载CSS，举个例子, a.js通过`import`函数异步加载了b.js, b.js 里面加载了style.css, 那么style. css最终只能被同步加载。但是现在mini-css-extract-plugin会单独打包出一个
0.css (假设使用默认配置)，这个CSS文件将由a.js通过动态插入link 标签的方式加载。
请看下面的例子：

```javascript
// app.js
import './style.css';
import('./next-page.js');
document.write('app.js<br/>');

// next-page.js
import './next-page.css';
document.write('Next page.<br/>');

/* style.css */
body { background-color: #eee; }

/* next-page.css */
body { background-color: #999; }
```

在上面代码中，由于`next-page.js`是通过import函数`异步加载`而不是通过import关键字同步加载的，如果使用的是`extract-text-webpack-plugin`，那么我们在打包阶段只能将 `style.css `和`next-page.css`一起打包进 bundle.css 然后使用。但是如果使用的是`mini-css-extract-plugin`的话，只有 style.css 会被打包进 bundle.css，而 next-page.css 会被单独打包为 0.css（默认配置），然后在代码执行过程中，在 app.js 成功加载完 next-page.js 的同时，app.js 会将 0.css 通过 link标签的方式动态插入文档，这样就可以实现 css 的按需加载。

**配置**

```javascript
//webpack.config.js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
  entry: './app.js',
  output: {
    filename: '[name].js',
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
            },
          },
          'css-loader'
        ],
      }],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    })
  ]
};
```

在配置上mini-css-extract-plugin与extract-text-webpack-plugin 有以下几点不同: 

- loader 规则设置的形式不同，并且mini-css- extract-plugin支持配置publicPath，用来指定异步CSS的加载路径。
- 不需要设置fallback。
- 在plugins设置中，除了指定同步加载的CSS资源名( filename),还要指定异步加载的CSS资源名(chunkFilename)。



#### CSS Modules

CSS Modules是近年来比较流行的一种开发模式，其理念就是把Css模块化，让CSS也拥有模块的特点，具体如下：

- 每个CSS文件中的样式都拥有单独的作用域，不会和外界发生命名冲突。
- 对CSS进行依赖管理，可以通过相对路径引人CSS文件。
- 可以通过composes轻松复用其他CSS模块。

使用CSS Modules不需要额外安装模块，只要开启css-loader中的modules配置项即可：

```javascript
module: {
    rules: [
        {
            test: /\.css$/,
            use: {
                'style-loader',
                loader: 'css-loader',
                options: {
                    modules: true,
                    localIdentName: '[name]_.[local]_[hash:base64:5]'
                }
            }
        }
    ]
}
```

这里的localldentName配置项用于指明CSS代码中的类名会如何来编译。假设源码是下面的形式：

```css
/* style.css */
.title{
	color: #f938ab;    
}
```

`.title`经过编译后可能将成为`.style_ title_1CFy6`, 让我们依次对照上面的配置:

- [name]指代的是模块名，这里被替换为style。
- [local] 指代的是原本的选择器标识符，这里被替换为title。
- [hash:basc64:5]指代的是一个5位的hash值，这个hash值是根据模块名和标识符计算的，因此不同模块中相同的标识符也不会造成样式冲突。

在使用的过程中我们还要注意在JavaScript中引入CSS的方式。之前只是直接将CSS文件引入就可以了，但使用CSS Modules时CSS文件会导出一个对象，我们需要把这个对象中的属性添加到HTML标签上。请看下面的示例：

```javascript
import styles from './style.css';
document.write('<hl class="${styles.title)">My Webpack app.</h1>*');
```

最终这个HTML中的class才能与我们编译后的CSS类名匹配上。





### 代码分片

​		实现高性能应用其中重要的一点就是尽可能地让用户每次只加载必要的资源，优先级不太高的资源则采用延迟加载等技术渐进式地获取，这样可以保证页面的首屏速度。
​		代码分片( code splitting)是Webpack作为打包工具所特有的一项技术, 通过这项技术我们可以把代码按照特定的形式进行拆分，使用户不必一次全部加载，而是按需加载。
​		代码分片可以有效降低首屏加载资源的大小，但同时也会带来新的问题，比如我们应该对哪些模块进行分片、分片后的资源如何管理等，这些也是需要关注的。

#### 通过入口划分代码

在Webpack中每个人口(entry) 都将生成一个对应的资源文件，通过入口的配置我们可以进行一些简单有效的代码拆分。
对于Web应用来说通常会有一些库和工具是不常变动的，可以把它们放在一个单独的入口中，由该人口产生的资源不会经常更新，因此可以有效地利用客户端缓存，让
用户不必在每次请求页面时都重新加载。如:

```javascript
//webpack.config.js
entry: {
    app: './app.js',
    lib: ['lib-a', 'lib-b', 'lib-c']
}
//index.html
<script src="dist/lib.js"></script>
<script sre="dist/app.js"></script>
```

这种拆分方法主要适合于那些将接口绑定在全局对象上的库（如JQuery），因为业务代码中的模块无法直接引用库中的模块，二者属于不同的依赖树。
对于多页面应用来说，我们也可以利用入口划分的方式拆分代码。比如，为每一个页面创建一个入口，并放入只涉及该页面的代码，同时再创建一个入口来包含所有公共模块，并使每个页面都进行加载。但是这样仍会带来公共模块与业务模块处于不同依赖树的问题。另外，很多时候不是所有的页面都需要这些公共模块。比如A、B页面需要lib-a模块，C、D需要lib-b模块，通过手工的方式去配置和提取公共模块将会变得十分复杂，因此我们可以使用Webpack专门提供的插件来解决这个问题。



#### CommonsChunkPlugin

CommonsChunkPlugin是 Webpack 4之前内部自带的插件( Webpack 4之后替换为了SplitChunks)。它可以将多个Chunk 中公共的部分提取出来。公共模块的提取可以为项目带来几个收益：

- 开发过程中减少了重复模块打包，可以提升开发速度;
- 减小整体资源体积;
- 合理分片后的代码可以更有效地利用客户端缓存。

假设我们当前的项目中有foo.js和bar.js两个入口文件，并且都引入了react，下面是未使用CommonsChunkPlugin 的配置：

```javascript
//webpack.config.js
module.exports = {
    entry: {
        foo: './foo.js',
        bar: './bar.js'
    },
    output: {
        filename: "[name].js",
    }
} 
// foo .js
import React from 'react';
document.write('foo.js', React.version) ;
// bar.js
import React from 'react';
document.write('bar.js', React.version) ;
```

打包后会有两个资源文件 foo.js 和 bar.js，大小都为73.1KB。

使用CommonsChunkPlugin的配置如下：

```javascript
//webpack.config.js
const webpack = require('webpack');
module.exports = {
    entry: {
        foo: './foo.js',
        bar: '. /bar.js',
    },
    output: {
        filename: '[name].js'
    },
    plugins: [
        new webpack.optimize.commonsChunkPlugin ({
            name: 'commons',
            filename: 'commons.js'
        })
    ]
};
```

webpack打包后会有三个资源文件，分别是foo.js、bar.js和commons.js，foo.js和bar.js从73.1KB的大小将为不到1KB，而common.js的大小则为73KB。
最后，需要在页面中添加一个script标签来引入commons.js，并且注意，该JS一定要在其他JS之前引入。

#### 异步资源

ES6规定 import 只能出现在代码开头，而webpack提供了 import函数来异步加载模块，如：

```javascript
//ES6 Modules
import bar from './bar.js'
console.log(bar)

//webpack
document.getElementByTagName('body')[0].onclick = () => {
    import('./bar.js').then(b => console.log(bar))
}
```

webpack打包时将会为 bar.js 及其依赖树生成一个资源文件一般是0.js（有更多的异步资源的话序号依次递增），在点击页面时webpack会生成一个script标签（src属性为0.js）并插入到head标签中。

如果要指定异步资源的名称，需要用到webpack的特殊注释，如：

```javascript
document.getElementByTagName('body')[0].onclick = () => {
    import(/* webpackchunkName : "bar" */ './bar.js').then(b => console.log(bar))
}
```



### 代码压缩

压缩JavaScript

```javascript
// webpack version < 4
const webpack = require ('webpack');
module.exports = {
    entry: './app.js',
    output: {
        filename: 'bundle.js'
    } ,
    plugins: [new webpack.optimize.uglifyJsPlugin()]
};

// webpack >= 4
module.exports = {
    entry: './app.js ',
    output: {
        filename: 'bundle.js'
    },
    optimization: {
        minimize: true,
    },
};
```

压缩CSS

压缩CSS文件的前提是使用`extract-text-webpack-plugin`或`mini-css-extract-plugin`将样式提取出来，接着使用`optimize-css-assets-webpack-plugin`来进行压缩，这个插件本质上使用的是压缩器`cssnano`，当然我们也可以通过其配置进行切换。具体请看下面的例子:

```javascript
const ExtractTextPlugin = require( 'extract-text-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
module.exports = {
    // ...
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',use: 'css-loader',
                }) ,
            }
        ]
    },
    plugins: [new ExtractTextPlugin('style.css')],
    optimization: {
        minimizer : [new OptimizeCSSAssetsPlugin({
            //生效范围，只压缩匹配到的资源
            assetNameRegExp: /\.optimize\.css$/g,
            //压缩处理器，默认为cssnano
            cssProcessor: require('cssnano'),
            //压缩处理器的配置
            cssProcessorOptions: {
                discardcomments: { removeAll: true }
            },
            //是否展示log
            canPrint : true,
        })],
    }
}
```



### 打包优化

HappyPack是一个通过`多线程`来提升Webpack打包速度的工具。HappyPack 可以显著地缩短打包时间。首先让我们了解一下它是如何工作的：

```javascript
const HappyPack = require('happypack');
module.exports = {
    //...
    module: {
        rules: [
            {
                test : /\.js$/,
                exclude: /node_modules/ ,
                loader : 'happypack/loader?id=js'
            },
            {
                test : /\.ts$/,
                exclude: /node_modules/,
                loader: 'happypack/loader?id=ts',
            }
        ]
    },
    plugins: [
        new HappyPack({
            id: 'js',
            loaders: [{
                loader: 'babel-loader',
                options: {} //babel options
            } ],
        }),
        new HappyPack({
            id: 'ts',
            loaders: [{
                loader: 'ts-loader',
                options: {} //ts options
            }]
        })
    ]
};
```

在使用多个HappyPack loader的同时也就意味着要插入多个HappyPack的插件，每个插件加上 id 来作为标识。同时我们也可以为每个插件设置具体不同的配置项，如使用的线程数、是否开启 debug模式等。





# Webpack面试题

## source map是什么？生产环境怎么用？

`source map` 是将编译、打包、压缩后的代码映射回源代码的过程。打包压缩后的代码不具备良好的可读性，想要调试源码就需要 soucre map。

map文件只要不打开开发者工具，浏览器是不会加载的。

线上环境一般有三种处理方案：

- `hidden-source-map`：借助第三方错误监控平台 Sentry 使用
- `nosources-source-map`：只会显示具体行数以及查看源代码的错误栈。安全性比 sourcemap 高
- `sourcemap`：通过 nginx 设置将 .map 文件只对白名单开放(公司内网)

注意：避免在生产中使用 `inline-` 和 `eval-`，因为它们会增加 bundle 体积大小，并降低整体性能。



## Webpack 的热更新原理

`Webpack` 的热更新又称热替换（`Hot Module Replacement`），缩写为 `HMR`。 这个机制可以做到不用刷新浏览器而将新变更的模块替换掉旧的模块。

HMR相比于live-server的优势是可以保存状态。

HMR的核心就是客户端从服务端拉去更新后的文件，准确的说是 chunk diff (chunk 需要更新的部分)，实际上 WDS （webpack-dev-server）与浏览器之间维护了一个 `Websocket`，当本地资源发生变化时，WDS 会向浏览器推送更新，并带上构建时的 hash，让客户端与上一次资源进行对比。客户端对比出差异后会向 WDS 发起 `Ajax` 请求来获取更改内容(文件列表、hash)，这样客户端就可以再借助这些信息继续向 WDS 发起 `jsonp` 请求获取该chunk的增量更新。

后续的部分(拿到增量更新之后如何处理？哪些状态该保留？哪些又需要更新？)由 `HotModulePlugin` 来完成，提供了相关 API 以供开发者针对自身场景进行处理，像`react-hot-loader` 和 `vue-loader` 都是借助这些 API 实现 HMR。



## Webpack构建流程简单说一下

Webpack 的运行流程是一个串行的过程，从启动到结束会依次执行以下流程：

- `初始化参数`：从配置文件和 Shell 语句中读取与合并参数，得出最终的参数
- `开始编译`：用上一步得到的参数初始化 Compiler 对象，加载所有配置的插件，执行对象的 run 方法开始执行编译
- `确定入口`：根据配置中的 entry 找出所有的入口文件
- `编译模块`：从入口文件出发，调用所有配置的 Loader 对模块进行翻译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理
- `完成模块编译`：在经过第4步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系
- `输出资源`：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会
- `输出完成`：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统

在以上过程中，`Webpack` 会在特定的时间点广播出特定的事件，插件在监听到感兴趣的事件后会执行特定的逻辑，并且插件可以调用 Webpack 提供的 API 改变 Webpack 的运行结果。



## Loader和Plugin的区别？

`Loader` 本质就是一个函数，在该函数中对接收到的内容进行转换，返回转换后的结果。 因为 Webpack 只认识 JavaScript，所以 Loader 就成了翻译官，对其他类型的资源进行转译的预处理工作。

`Plugin` 就是插件，基于事件流框架 `Tapable`，插件可以扩展 Webpack 的功能，在 Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。

`Loader` 在 module.rules 中配置，作为模块的解析规则，类型为数组。每一项都是一个 Object，内部包含了 test(类型文件)、loader、options (参数)等属性。

`Plugin` 在 plugins 中单独配置，类型为数组，每一项是一个 Plugin 的实例，参数都通过构造函数传入。



## 常用的Loader

`babel-loader`: 用来处理ES6语法，将其编译为浏览器可以执行的js语法

​		babel-loader执行慢的解决办法：

​				①使用exclude排除node_modules，或者include想要转译的文件目录

​				②使用cacheDirectory选项开启缓存，将转译的结果缓存到文件系统中，将babel-loader提速至少两倍，默认使用的缓冲目录：node_modules/.cache/babel-loader

`vue-loader`: 解析和转换.vue文件。提取出其中的逻辑代码 script,样式代码style,以及HTML 模板template,再分别把他们交给对应的loader去处理。

`url-loader`: 将小于限制文件大小的文件转换为base64的文件存到bundle/imgs文件下(自己输出的文件夹路径)，但会让bundle变得庞大。

`image-webpack-loader`：可将大的图片进行压缩从而缩小打包体积。需要配合`file-loader`才能使用。`url-loader`包含`file-loader`，但是使用`url-loader`的时候也要安装`file-loader`

`sass-loader`：把scss转成css

`css-loader`：找出css中的依赖，压缩资源，处理css中的 @import 和 url 这样的外部资源，必须要配合`style-loader`

`style-loader`：把css转换成脚本加载的js代码，把样式插入到 DOM中，方法是在head中插入一个style标签，并把样式写入到这个标签的 innerHTML里

（多个loader配合使用时，处理顺序是：从下到上，从右到左）



常用的Plugin



