---
title: HTML
date: 2022-01-01
tags:
 - HTML
categories:
 - 前端
---

## 1. src和href的区别

src和href都是**用来引用外部的资源**，它们的区别如下：

1. **引用资源类型的不同**
   1. src 表示对资源的引用；href 表示对超文本的引用。
2. **作用结果不同**
   1. src 会将下载来的资源替换当前的标签，嵌入到文档内
   2. href 会建立起当前文档和所指向网络资源的链接关系
3. **浏览器解析方式不同**
   1. 浏览器解析到 src 元素的时候，会暂停其他资源的处理和下载，直至将该资源加载、编译、执行完毕；当浏览器识别到 href 指向的文件时，会并行下载资源，不会停止对当前文档的处理。

## 2. link 和 @import 的区别

两者都是外部引用 CSS 的方式

1. **作用范围的区别**
   1. link 是 XHTML 标签，除了能够加载 CSS，还可以定义 RSS 等其他事务；而 @import 属于 CSS 范畴，只可以加载 CSS。
2. **加载顺序的区别**
   1. link 引用 CSS 时，在页面载入时同时加载；@import 需要页面完成加载以后再加载。
3. **兼容性的区别**
   1. link 是 XHTML 标签，无兼容问题；@import 则是在 CSS2.1 提出的，低版本浏览器不支持。
4. **使用 DOM 控制样式时的区别**
   1. link 支持使用 JavaScript 控制 DOM 改变样式；而 @import 不支持。

## 3. 对HTML语义化的理解

**语义化是指根据内容的结构化（内容语义化），选择合适的标签（代码语义化）**。通俗来讲就是用正确的标签做正确的事情。

语义化的优点如下：

- 对机器友好，带有语义的文字表现力丰富，更适合搜索引擎的爬虫爬取有效信息，有利于SEO。除此之外，语义类还支持读屏软件，根据文章可以自动生成目录；
- 对开发者友好，使用语义类标签增强了可读性，结构更加清晰，开发者能清晰的看出网页的结构，便于团队的开发与维护。
- 可访问性强（比如使用屏幕阅读器的用户）

常见的语义化标签：

```
<header></header>  头部

<nav></nav>  导航栏

<section></section>  区块（有语义化的div）

<main></main>  主要区域

<article></article>  主要内容

<aside></aside>  侧边栏

<footer></footer>  底部
```

## 4. Doctype 的作用

DOCTYPE（文档类型），向 HTML 文档添加`<!DOCTYPE>`声明，告知浏览器响应的文档类型。

`<!DOCTYPE>`声明必须位于 HTML 文档的第一行，在`<html>`之前。

`<!DOCTYPE>` 声明不是 HTML 标签；它是指示 web 浏览器关于页面使用哪个 HTML 版本进行编写的指令。



- **标准模式**：在该模式下，浏览器按照 **HTML 与 CSS 标准**（W3C）对文档进行解析和渲染。
- **怪异模式**：在该模式下，浏览器则按照**旧有的非标准**的实现方式对文档进行解析和渲染。
- 两个模式的**由来**，微软发布 IE5 时未遵循 W3C 标准，发布 IE6 时想可以正常展示 IE5 的页面，于是给 IE6 加入了“怪异模式”和“标准模式”两种渲染方式。



> ### HTML 4.01
>
> 在 HTML 4.01 中有三种  声明——Strict，Transitional， Frameset。
>
> 对于HTML 4.01，默认是“怪异模式”；对于新页面需要在页面顶部加以下指令（Strict）告诉浏览器使用“标准模式”。
>
> ```html
> <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
> ```
>
> ### HTML5
>
> 在HTML5规范里，对DOCTYPE声明做了简化，变成`<!DOCTYPE html>`告知浏览器当前页面使用的是HTML5规范，并且使用告诉浏览器使用“标准模式”。
>
> ```html
> <!DOCTYPE html>
> ```
>
> 对于**没有文档类型声明或者文档类型声明不正确**的文档，浏览器就会认为它是一个旧的HTML文档，就会使用怪异模式解析和渲染该文档



**HTML5 为什么只需要写 `<!DOCTYPE HTML>`，而不需要引入 DTD？**

> 答：HTML5只写 `<!DOCTYPE HTML>`，不需要引入DTD的原因是：HTML5不基于SGML



**DTD 是什么？**

> 答：DTD（ducoment type definition）文档类型定义，它定义 xml 或 html 文件中元素的属性和浏览器需要遵循的解析规则，它会影响浏览器的渲染模式。

## 5. script标签中defer和async的区别

如果没有defer或async属性，浏览器会立即加载并执行相应的脚本。它不会等待后续加载的文档元素，读取到就会开始加载和执行，这样就阻塞了后续文档的加载。

下图可以直观的看出三者之间的区别:

![image.png](https://cdn.nlark.com/yuque/0/2020/png/1500604/1603547262709-5029c4e4-42f5-4fd4-bcbb-c0e0e3a40f5a.png)

其中蓝色代表js脚本网络加载时间，红色代表js脚本执行时间，绿色代表html解析。

**defer 和 async属性都是去异步加载外部的JS脚本文件，它们都不会阻塞页面的解析**，其区别如下：

- **执行顺序：**多个带async属性的标签，不能保证加载的顺序；多个带defer属性的标签，按照加载顺序执行；
- **脚本是否并行执行：**async属性，表示**后续文档的加载和执行与js脚本的加载和执行是并行进行的**，即异步执行；defer属性，加载后续文档的过程和js脚本的加载(此时仅加载不执行)是并行进行的(异步)，js脚本需要等到文档所有元素解析完成之后才执行，DOMContentLoaded事件触发执行之前。

## 6. 常用的meta标签有哪些

`meta` 标签由 `name` 和 `content` 属性定义，**用来描述网页文档的属性**，比如网页的作者，网页描述，关键词等，除了HTTP标准固定了一些`name`作为大家使用的共识，开发者还可以自定义name。



常用的meta标签：

（1）`charset`，用来描述HTML文档的编码类型：

```
<meta charset="UTF-8" >
```

（2） `keywords`，页面关键词：

```
<meta name="keywords" content="关键词" />
```

（3）`description`，页面描述：

```
<meta name="description" content="页面描述内容" />
```

（4）`refresh`，页面重定向和刷新：

```
<meta http-equiv="refresh" content="0;url=" />
```

（5）`viewport`，适配移动端，可以控制视口的大小和比例：

```
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
```

其中，`content` 参数有以下几种：

- `width viewport` ：宽度(数值/device-width)
- `height viewport` ：高度(数值/device-height)
- `initial-scale` ：初始缩放比例
- `maximum-scale` ：最大缩放比例
- `minimum-scale` ：最小缩放比例
- `user-scalable` ：是否允许用户缩放(yes/no）

（6）搜索引擎索引方式：

```
<meta name="robots" content="index,follow" />
```

其中，`content` 参数有以下几种：

- `all`：文件将被检索，且页面上的链接可以被查询；
- `none`：文件将不被检索，且页面上的链接不可以被查询；
- `index`：文件将被检索；
- `follow`：页面上的链接可以被查询；
- `noindex`：文件将不被检索；
- `nofollow`：页面上的链接不可以被查询。

## 7. HTML5有哪些更新

### 1. 语义化标签

- header：定义文档的页眉（头部）；
- nav：定义导航链接的部分；
- footer：定义文档或节的页脚（底部）；
- article：定义文章内容；
- section：定义文档中的节（section、区段）；
- aside：定义其所处内容之外的内容（侧边）；

### 2. 媒体标签

（1） audio：音频

```
<audio src='' controls autoplay loop='true'></audio>
```

属性：

- controls 控制面板
- autoplay 自动播放
- loop=‘true’ 循环播放



（2）video视频

```
<video src='' poster='imgs/aa.jpg' controls></video>
```

属性：

- poster：指定视频还没有完全下载完毕，或者用户还没有点击播放前显示的封面。默认显示当前视频文件的第一针画面，当然通过poster也可以自己指定。
- controls 控制面板
- width
- height



（3）source标签

因为浏览器对视频格式支持程度不一样，为了能够兼容不同的浏览器，可以通过source来指定视频源。

```
<video>
    <source src='aa.flv' type='video/flv'></source>
    <source src='aa.mp4' type='video/mp4'></source>
</video>
```

### 3. 表单

**表单类型：**

- email ：能够验证当前输入的邮箱地址是否合法
- url ： 验证URL
- number ： 只能输入数字，其他输入不了，而且自带上下增大减小箭头，max属性可以设置为最大值，min可以设置为最小值，value为默认值。
- search ： 输入框后面会给提供一个小叉，可以删除输入的内容，更加人性化。
- range ： 可以提供给一个范围，其中可以设置max和min以及value，其中value属性可以设置为默认值
- color ： 提供了一个取色板
- time ： 时分秒
- data ： 日期选择年月日
- datatime ： 时间和日期(目前只有Safari支持)
- datatime-local ：日期时间控件
- week ：周控件
- month：月控件



**表单属性：**

- placeholder ：提示信息
- autofocus ：自动获取焦点
- autocomplete=“on” 或者 autocomplete=“off” 使用这个属性需要有两个前提：
  - 表单必须提交过
  - 必须有name属性。
- required：要求输入框不能为空，必须有值才能够提交。
- pattern=" " 里面写入想要的正则模式，例如手机号patte="^(+86)?\d{10}$"
- multiple：可以选择多个文件或者多个邮箱
- form=" form表单的ID"



**表单事件：**

- oninput 每当input里的输入框内容发生变化都会触发此事件。
- oninvalid 当验证不通过时触发此事件。

### 4. 进度条、度量器

- progress标签：用来表示任务的进度（IE、Safari不支持），max用来表示任务的进度，value表示已完成多少
- meter属性：用来显示剩余容量或剩余库存（IE、Safari不支持）

- - high/low：规定被视作高/低的范围
  - max/min：规定最大/小值
  - value：规定当前度量值

设置规则：min < low < high < max

### 5.DOM查询操作

- document.querySelector()
- document.querySelectorAll()

它们选择的对象可以是标签，可以是类(需要加点)，可以是ID(需要加#)

### 6. Web存储

HTML5 提供了两种在客户端存储数据的新方法：

- localStorage - 没有时间限制的数据存储
- sessionStorage - 针对一个 session 的数据存储

### 7. 其他

- 拖放：拖放是一种常见的特性，即抓取对象以后拖到另一个位置。设置元素可拖放：

```
<img draggable="true" />
```

- 画布（canvas ）： canvas 元素使用 JavaScript 在网页上绘制图像。画布是一个矩形区域，可以控制其每一像素。canvas 拥有多种绘制路径、矩形、圆形、字符以及添加图像的方法。

```
<canvas id="myCanvas" width="200" height="100"></canvas>
```

- SVG：SVG 指可伸缩矢量图形，用于定义用于网络的基于矢量的图形，使用 XML 格式定义图形，图像在放大或改变尺寸的情况下其图形质量不会有损失，它是万维网联盟的标准
- 地理定位：Geolocation（地理定位）用于定位用户的位置。‘



**总结：**

（1）新增语义化标签：nav、header、footer、aside、section、article

（2）音频、视频标签：audio、video

（3）数据存储：localStorage、sessionStorage

（4）canvas（画布）、Geolocation（地理定位）、websocket（通信协议）

（5）input标签新增属性：placeholder、autocomplete、autofocus、required

（6）history API：go、forward、back、pushstate

**移除的元素有：**

- 纯表现的元素：basefont，big，center，font, s，strike，tt，u;
- 对可用性产生负面影响的元素：frame，frameset，noframes；

## 8. img的srcset属性的作用？

1. **img 标签的 srcset 属性可以用来处理页面在不同像素密度终端设备上对图片的选择性展示**。

2. **当浏览器下载图片的时候，它是不知道图片的真实尺寸的**。因为浏览器下载 html 页面不久后，就会继续请求 css、js、img 等资源，但是这些资源请求没有先后之分，所以浏览器并不知道页面的布局，对图片的尺寸也一无所知，**浏览器唯一知道的是视图尺寸**，但这并不足以给浏览器选择最佳的图片源。

3. sizes 作用就在于告诉浏览器**根据屏幕尺寸和像素密度的计算值**从 srcset 中选择最佳的图片源。

4. ```html
   <img src="../static/images/128.png"
        srcset="../static/images/128.png 350w,
                ../static/images/256.png 750w,
                ../static/images/512.png 900w,
                ../static/images/1024.png 1000w"
   
        sizes="(max-width: 320px) 100px,
               (max-width: 450px) 200px,
               (max-width: 700px) 300px,
               (max-width: 800px) 400px,
               (max-width: 900px) 500px,
               1024px">
   ```

   1. max-width 是媒体情况，括号后面的 px 值是长度单位的值。
   2. **sizes 如何起作用？**首先浏览器会读取 sizes，然后根据媒体情况来选择，如果匹配到某个值，就根据这个值的长度单位乘以屏幕像素密度，最终得出来的值再与 srcset 的宽度描述匹配来选择图片。

## 9.  行内元素有哪些？块级元素有哪些？ 空(void)元素有那些？

- 行内元素有：`a b span img input select strong`；
- 块级元素有：`div ul ol li dl dt dd h1 h2 h3 h4 h5 h6 p`；

- 空元素，即没有内容的HTML元素。空元素是在开始标签中关闭的，也就是空元素没有闭合标签：

  - 常见的有：`<br>`、`<hr>`、`<img>`、`<input>`、`<link>`、`<meta>`；

  - 少见的有：`<area>`、`<base>`、`<col>`、`<colgroup>`、`<command>`、`<embed>`、`<keygen>`、`<param>`、`<source>`、`<track>`、`<wbr>`。

### 行内元素和块级元素的区别

- 行内元素不会占据整行，在一条直线上排列，都是同一行，水平方向排列

- 块级元素会占据一行，垂直方向排列

- 块级元素可以包含行内元素和块级元素；行内元素不能包含块级元素

- 行内元素与块级元素属性的不同，主要是盒模型属性上，行内元素设置width无效，height无效(可以设置line-height)，margin上下无效，padding上下无效

### img标签是行内元素，但它为什么可以设置宽高？

​	因为img标签是属于可替换元素，具有内置的宽高属性。



## 10. 元素的定义

> 从元素本身的特点来讲，可以分为不可替换元素和替换元素

### 不可替换元素

(X)html 的大多数元素是不可替换元素，即其内容直接表现给用户端(例如浏览器)

如：

```html
<h1>我是标题</h1>
```

### 可替换元素

浏览器根据元素的标签和属性，来决定元素的具体显示内容

例如浏览器会根据 `<img>`标签的src属性的值来读取图片信息并显示出来，而如果查看(X)HTML代码，则看不到图片的实际内容；又例如根据 `<input> `标签的type属性来决定是显示输入框，还是单选按钮等

(X)HTML中的 `<img>`、`<input>`、`<textarea>`、`<select>`、`<object> `都是替换元素。这些元素往往没有实际的内容，即是一个空元素

可替换元素的性质同设置了display:inline-block的元素一致

## 11. 说一下 web worker 

1. **web worker 的作用就是浏览器作为宿主环境给单线程的 JS 创造多线程运行环境**，允许主线程创建 worker 线程，分配任务给后者，主线程运行的同时 worker 线程也在运行，相互不干扰，在 worker 线程运行结束后把结果返回给主线程。这样做的好处是**主线程可以把计算密集型或高延迟的任务交给worker线程执行，这样主线程就会变得轻松，不会被阻塞或拖慢**。这并不意味着JS语言本身支持了多线程能力，而是浏览器作为宿主环境提供了JS一个多线程运行的环境。

   不过因为worker一旦新建，就会一直运行，不会被主线程的活动打断，这样有利于随时响应主线程的通性，但是也会造成资源的浪费，所以不应过度使用，用完注意关闭。或者说：如果worker无实例引用，该worker空闲后立即会被关闭；如果worker实列引用不为0，该worker空闲也不会被关闭。

   

   **限制**

   worker线程的使用有一些注意点

   1. **同源限制**
      worker线程执行的脚本文件必须和主线程的脚本文件同源，这是当然的了，总不能允许worker线程到别人电脑上到处读文件吧
   2. **文件限制**
      为了安全，worker线程无法读取本地文件，它所加载的脚本必须来自网络，且需要与主线程的脚本同源
   3. **DOM操作限制**
      worker线程在与主线程的window不同的另一个全局上下文中运行，其中无法读取主线程所在网页的DOM对象，也不能获取 `document`、`window`等对象，但是可以获取`navigator`、`location(只读)`、`XMLHttpRequest`、`setTimeout族`等浏览器API。
   4. **通信限制**
      worker线程与主线程不在同一个上下文，不能直接通信，需要通过`postMessage`方法来通信。
   5. **脚本限制**
      worker线程不能执行`alert`、`confirm`，但可以使用 `XMLHttpRequest` 对象发出ajax请求。



## 12. HTML5的离线储存怎么使用，它的工作原理是什么

离线存储指的是：在用户没有与因特网连接时，可以正常访问站点或应用，在用户与因特网连接时，更新用户机器上的缓存文件。

**原理：**HTML5的离线存储是基于一个新建的 `.appcache` 文件的缓存机制(不是存储技术)，通过这个文件上的解析清单离线存储资源，这些资源就会像cookie一样被存储了下来。之后当网络在处于离线状态下时，浏览器会通过被离线存储的数据进行页面展示

**使用方法：**

（1）创建一个和 html 同名的 manifest 文件，然后在页面头部加入 manifest 属性：

```
<html lang="en" manifest="index.manifest">
```

（2）在 `index.manifest` 文件中编写需要离线存储的资源：

```
#v0.11
CACHE:
js/app.js
css/style.css
NETWORK:
resourse/logo.png
FALLBACK:
offline.html
```

- **CACHE**: 表示需要离线存储的资源列表，由于包含 manifest 文件的页面将被自动离线存储，所以不需要把页面自身也列出来。
- **NETWORK**: 表示在它下面列出来的资源只有在在线的情况下才能访问，他们不会被离线存储，所以在离线情况下无法使用这些资源。不过，如果在 CACHE 和 NETWORK 中有一个相同的资源，那么这个资源还是会被离线存储，也就是说 CACHE 的优先级更高。
- **FALLBACK**: 表示如果访问第一个资源失败，那么就使用第二个资源来替换他，比如上面这个文件表示的就是如果访问根目录下任何一个资源失败了，那么就去访问 offline.html 。

（3）在离线状态时，操作 `window.applicationCache` 进行离线缓存的操作。

**如何更新缓存：**

 （1）更新 manifest 文件

 （2）通过 javascript 操作

 （3）清除浏览器缓存

**注意事项：**

 （1）浏览器对缓存数据的容量限制可能不太一样（某些浏览器设置的限制是每个站点 5MB）。

 （2）如果 manifest 文件，或者内部列举的某一个文件不能正常下载，整个更新过程都将失败，浏览器继续全部使用老的缓存。

 （3）引用 manifest 的 html 必须与 manifest 文件同源，在同一个域下。

 （4）FALLBACK 中的资源必须和 manifest 文件同源。

 （5）当一个资源被缓存后，该浏览器直接请求这个绝对路径也会访问缓存中的资源。

 （6）站点中的其他页面即使没有设置 manifest 属性，请求的资源如果在缓存中也从缓存中访问。

 （7）当 manifest 文件发生改变时，资源请求本身也会触发更新。

## 13. 浏览器是如何对 HTML5 的离线储存资源进行管理和加载？

- **在线的情况下**，浏览器发现 html 头部有 manifest 属性，它会请求 manifest 文件，如果是第一次访问页面 ，那么浏览器就会根据 manifest 文件的内容下载相应的资源并且进行离线存储。如果已经访问过页面并且资源已经进行离线存储了，那么浏览器就会使用离线的资源加载页面，然后浏览器会对比新的 manifest 文件与旧的 manifest 文件，如果文件没有发生改变，就不做任何操作，如果文件改变了，就会重新下载文件中的资源并进行离线存储。
- **离线的情况下**，浏览器会直接使用离线存储的资源。

## 14. title与h1的区别、b与strong的区别、i与em的区别？

- title属性没有明确意义只表示是个标题，H1则表示层次明确的标题，对页面信息的抓取有很大的影响
- strong标签有语义，是起到加重语气的效果，而b标签是没有的，b标签只是一个简单加粗标签。使用阅读设备阅读网络时：`<strong>`会重读，而`<B>`是展示强调内容。搜索引擎更侧重strong标签。
- **i内容展示为斜体，em表示强调的文本**

## 15. **iframe 的优点和缺点？**

iframe 元素会创建包含另外一个文档的内联框架（即行内框架）。

**优点：**

- 用来加载速度较慢的内容（如广告、图标）
- 可以使脚本可以并行下载
- 可以实现跨子域通信
- 如果有多个网页引用 iframe，那么只需要修改 iframe 的内容，就可以实现调用的每一个页面内容的更改，方便快捷
- iframe 能够原封不动地把嵌入的网页展现出来

**缺点：**

- iframe 会阻塞主页面的 onload 事件
- 代码复杂，无法被一些搜索引擎索识别
- 会产生很多页面，不容易管理
- 很多的移动设备（PDA 手机）无法完全显示框架，设备兼容性差

## 16. label 的作用是什么？如何使用？

**作用：**label 标签来定义表单控制间的关系，**当用户选择该标签时，浏览器会自动将焦点转到和标签相关的表单控件上**。

**两种用法：**一种是 id 绑定，一种是嵌套

```xml
<label for="Name">Number:</label>

<input type=“text“name="Name" id="Name"/>

<label>Date:<input type="text" name="B"/></label>
```

## 17. Canvas和SVG的区别

**（1）SVG：**

SVG可缩放矢量图形（Scalable Vector Graphics）是基于可扩展标记语言XML描述的2D图形的语言，SVG基于XML就意味着SVG DOM中的每个元素都是可用的，可以为某个元素附加Javascript事件处理器。在 SVG 中，每个被绘制的图形均被视为对象。如果 SVG 对象的属性发生变化，那么浏览器能够自动重现图形。

其特点如下：

- 不依赖分辨率
- 支持事件处理器
- 最适合带有大型渲染区域的应用程序（比如谷歌地图）
- 复杂度高会减慢渲染速度（任何过度使用 DOM 的应用都不快）
- 不适合游戏应用



**（2）Canvas：**

Canvas是画布，通过Javascript来绘制2D图形，是逐像素进行渲染的。其位置发生改变，就会重新进行绘制。

其特点如下：

- 依赖分辨率
- 不支持事件处理器
- 弱的文本渲染能力
- 能够以 .png 或 .jpg 格式保存结果图像
- 最适合图像密集型的游戏，其中的许多对象会被频繁重绘

注：矢量图，也称为面向对象的图像或绘图图像，在数学上定义为一系列由线连接的点。矢量文件中的图形元素称为对象。每个对象都是一个自成一体的实体，它具有颜色、形状、轮廓、大小和屏幕位置等属性。

## 18. 渐进增强和优雅降级

**（1）渐进增强（progressive enhancement）**：主要是针对低版本的浏览器进行页面重构，保证基本的功能情况下，再针对高级浏览器进行效果、交互等方面的改进和追加功能，以达到更好的用户体验。

**（2）优雅降级（graceful degradation）**： 一开始就构建完整的功能，然后再针对低版本的浏览器进行兼容。

**两者区别：**

- 优雅降级是从复杂的现状开始的，并试图减少用户体验的供给；而渐进增强是从一个非常基础的，能够起作用的版本开始的，并在此基础上不断扩充，以适应未来环境的需要；
- 降级（功能衰竭）意味着往回看，而渐进增强则意味着往前看，同时保证其根基处于安全地带。



## 19. 说一下 HTML5 drag API 

- dragstart：事件主体是被拖放元素，在开始拖放被拖放元素时触发。 
- darg：事件主体是被拖放元素，在正在拖放被拖放元素时触发。 
- dragenter：事件主体是目标元素，在被拖放元素进入某元素时触发。 
- dragover：事件主体是目标元素，在被拖放在某元素内移动时触发。 
- dragleave：事件主体是目标元素，在被拖放元素移出目标元素是触发。 
- drop：事件主体是目标元素，在目标元素完全接受被拖放元素时触发。 
- dragend：事件主体是被拖放元素，在整个拖放操作结束时触发。

## 20. documentFragment 是什么？用它跟直接操作 DOM 的区别是什么？

MDN中对`documentFragment`的解释：

> DocumentFragment，文档片段接口，一个没有父对象的最小文档对象。它被作为一个轻量版的 Document使用，就像标准的document一样，存储由节点（nodes）组成的文档结构。与document相比，最大的区别是DocumentFragment不是真实 DOM 树的一部分，它的变化不会触发 DOM 树的重新渲染，且不会导致性能等问题。

当我们把一个 DocumentFragment 节点插入文档树时，插入的不是 DocumentFragment 自身，而是它的所有子孙节点。在频繁的DOM操作时，我们就可以将DOM元素插入DocumentFragment，之后一次性的将DocumentFragment（包括了其所有的子孙节点）插入文档中。和直接操作DOM相比，将DocumentFragment 节点插入DOM树时，只会触发一次回流，这样就大大提高了页面的性能。

同时 DocumentFragment 也会被用来实现 WebComponent（原生组件）



## 21. 什么是文档的预解析（浏览器解析过程）

### 概念

**概念：**虽然在执行脚本的时构建 DOM 是不安全的，但是你仍然可以解析 HTML 来查看其他需要检索的资源。找到的文件会被添加到一个列表里并开始**在后台并行地下载**。当脚本执行完毕之后，这些文件很可能已经下载完成了。

**通俗地讲：就是提前下载 html 页面上声明了的脚本。**

下载是并行的，执行是先后的，以这种方式触发的下载请求称为“预测”，因为很可能脚本还会改变 html 结构，导致预测的浪费（即下载的脚本是无效的，并不会被执行），但这并不常见，所以预解析仍然可以带来很大的性能提升。

![image-20210824161905130](D:\笔记\自总\img\image-20210824161905130.png)

- 预加载的内容：
  - 脚本 `<script>`
  - 外部 CSS `<link>`
  - 来自 `<img>` 标签的图片
  - Firefox 预加载 video 元素 `poster` 属性
  - Chrome/Safari 预加载 `@import` 内联样式
- 预加载会受到浏览器并行下载文件的数量限制（HTTP 1.x），如 Chrome 浏览器最多只能并行下载6个文件。
- 预解析时，浏览器不会执行内联的 JS 代码块。
- 用 JS 加载不那么重要的内容来避免预解析，这里的意思是说，页面上某些不重要的脚本，相比于其他必需脚本来说，是应该 **迟下载，迟执行** 的，通过用 JS 动态加载它们，它们就不会一开始出现在 HTML 文档的 `<script>` 标签中，则浏览器的预解析不会处理它们（相对的就会更优先的解析必需脚本）



### 解析

首先我们需要了解浏览器正常的文档解析流程（Parsing）：

- 浏览器引擎的解析器会将 HTML 转换成 DOM（解析，DOM 的构建）

- 在解析 HTML 字符串的过程中，DOM 节点逐个被添加到树中

- 在 DOM 中，对象被关联在树中用户捕获标签之间的父子关系

- CSS 样式被映射到`CSSOM`上

  - CSS 规则会互相覆盖，所以浏览器引擎需要进行复杂计算，以确定 CSS 代码如何应用到 DOM

  - CSS 可能会阻塞解析：

    - 当解析器获取一个 `<script>` 标签时，DOM 将等待 JavaScript 执行完毕后继续构建；
    - 若有 CSS 样式表先于该标签，则该标签的 JavaScript 代码将等待 CSS 下载，解析，且 CSSOM 可以使用时，才会执行

  - CSS 会阻塞 DOM 的渲染：直到 DOM 和 CSSOM 准备好之前，浏览器什么都不会显示。

    - FOUC - Flash of Unstyled Content: 没有任何样式的页面突然变换成了有样式的。

      ![image-20210824162436361](D:\笔记\自总\img\image-20210824162436361.png)

推荐好文：

[更快构建DOM：预解析，异步，延迟，预加载](https://zhuanlan.zhihu.com/p/29992512)

[HTML - 预解析, async/defer 和 preload](https://afantasy.ninja/2018/01/13/speculative-parsing-async-defer-perload/)



## 22. CSS 如何阻塞文档解析

**css 是不会阻塞 DOM 解析，但是会阻塞页面渲染。**

如果不阻塞页面渲染的话，因为网络延迟等原因 css 较慢被浏览器接收，此时 DOM 已经解析完毕渲染到页面了，css 来到之后，浏览器又再一次渲染页面，这就需要渲染两次页面（即本来是绿色的突然就变成蓝色的），用户体验不佳，并且浪费渲染成本。**因此，css 自己不会阻塞文档解析，但是会阻塞页面渲染，以此来减少二次渲染，提高用户体验**。

------

**但是！！！**

如果将引入 css 的 `<link>` 标签和 `<script>` 脚本先后放在 `<head>` 里面，将会阻塞文档解析，直至 js 加载甚至执行完毕，而 js 又要等待 css 加载解析完毕。这就是 css 如何阻塞文档解析的方式。

👆 为什么会这样子呢？

答：如果脚本的内容是获取元素的样式，宽高等 CSS 控制属性，浏览器是需要计算的，也就是依赖于 CSS。浏览器也无法感知脚本内到底是什么，为避免样式获取，因而只好等前面所有的样式下载完后，再执行 js。

------

**浏览器遇到 `<script>` 脚本时，会先渲染页面，而渲染页面就需要先把脚本之前的 css 给解析完。**

由此可见，每次碰到`<script>`标签时，浏览器都会渲染一次页面。这是基于同样的理由，浏览器不知道脚本的内容，因而碰到脚本时，只好先渲染页面，确保脚本能获取到最新的`DOM`元素信息，尽管脚本可能不需要这些信息。 

### 小结

综上所述，我们得出这样的结论：

- `CSS` 不会阻塞 `DOM` 的解析，但会阻塞 `DOM` 渲染。
- `JS` 阻塞 `DOM` 解析，但浏览器会"偷看"`DOM`，预先下载相关资源。
- 浏览器遇到 `<script>`且没有`defer`或`async`属性的 标签时，会触发页面渲染，因而如果前面`CSS`资源尚未加载完毕时，浏览器会等待它加载完毕在执行脚本。

所以`<script>`最好放底部，`<link>`最好放头部，如果头部同时有`<script>`与`<link>`的情况下，最好将`<script>`放在`<link>`上面。

