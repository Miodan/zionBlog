---
title: CSS
date: 2022-01-01
tags:
 - CSS
categories:
 - 前端
---

## CSS应用题

### 元素宽度不确定，实现固定宽高比

使用子元素的内边距撑开元素，这是因为子元素的内边距设置为百分比时是以父元素的宽度为基准的。

```html
<div class="container">
    <div class="padding"></div>
    <div class="content"></div>
</div>

<style>
    .container{
        background-color: black;
        width: 200px;
        overflow: hidden;
    }
    .container .padding{
        height: 0px;
        padding-top: 56.25%;
    }
    .container .content{
        position: absolute;
    }
</style>
```

优点：容易理解

缺点：增加了一个div节点用于撑开父元素（不利于后期维护），且需要再嵌套一层绝对定位元素用于处理容器内的内容。



使用伪元素margin-top/margin-bottom撑开父元素



用CSS变量实现

```html
<div class="container">
    <div class="content"></div>
</div>

<style>
    .container{
        --ratio: 9 / 16;
        --widthSize: 200px;
        width: var(--widthSize);
        height: calc(var(--widthSize) * var(--ratio));
        background-color: black;
    }
</style>
```

优点：无需使用子元素，利于维护



用CSS新属性aspect-ratio

```html
<div class="container">
    <div class="content"></div>
</div>

<style>
    .container{
        width: 200px;
        aspect-ratio: 16 / 9;
        background-color: black;
        /*这里不同于使用CSS变量实现，如果不加上该属性，那么当子元素超出时，容器高度将被撑开*/
        overflow: hidden; 
    }
</style>
```

优点：容易理解，代码量少

缺点：由于是新属性，兼容性还有待提高





### 消除浮动

不清除浮动会发生高度塌陷：浮动元素父元素高度自适应（父元素不写高度时，子元素写了浮动后，父元素会发生高度塌陷），所以清除浮动是为了不让父元素发生高度塌陷。

- clear清除浮动（添加空div法）在浮动元素下方添加空div,并给该元素写css样式：

  ```css
  {
      clear:both;
      height:0;
      overflow:hidden;
  }
  ```

- 给浮动元素父级设置高度（这个很好理解，清除浮动本质是为了让父元素有高度）

- 父级同时浮动（需要给父级同级元素添加浮动）

- 父级设置成inline-block，其margin: 0 auto居中方式失效

- 设置父级的overflow属性不为 visible 的其他值（scroll、hidden、auto）

- 万能清除法 after伪类 清浮动（现在主流方法，推荐使用） 

  ```css
  .float_div::after{
    content:" ";
    clear:both;
    display:block;
    height:0;
    overflow:hidden;
    visibility:hidden;
  }
  ```

从上面我们可以看出，除了使用到`clear:both`的方法都与BFC容器有很大的关系，也就是说，本质上我们是父元素成为一个BFC从而清除浮动的。



### CSS文本溢出省略号？

```css
/*单行溢出*/
div{
    white-space: nowrap; /* 强制文本不换行 */
    overflow: hidden; /* 隐藏溢出内容 */
    text-overflow: ellipsis; /* 对溢出的文本用 ellipsis 省略号代替。 */
}

/*多行溢出*/
div{
    display: -webkit-box; /* 将对象作为弹性伸缩盒子模型显示 */
    -webkit-box-orient: vertical /* 使文本垂直（纵向）排列每一行，也就是文字是从左到右，从上到下 */
    /* 限制文本的行数 or 列数，取决于-webkit-box-orient的属性值 */
    -webkit-line-clamp: 2; 
    
    overflow: hidden; /* 隐藏溢出内容 */
    text-overflow: ellipsis; /* 对溢出的文本用 ellipsis 省略号代替。 */
}
```



### 写出三栏布局，左右固定宽度，中间自适应

#### 浮动

实现原理：`left`和`right`由于声明了`float`属性，因此都变成了BFC，而`center`由于声明了`overflow: hidden`，因此也为BFC；众所周知，BFC相互之间是独立、隔离的，因此实现了三栏布局。

```html
<section class="layout float">
    <style media="screen">
        .layout.float .left {
            float: left;
            width: 300px;
            background: red;
        }
        .layout.float .right {
            float: right;
            width: 300px;
            background: blue;
        }
        .layout.float .center {
            background: gold;
            overflow: hidden;
        }
    </style>
    <article class="left-right-center">
        <div class="left"></div>
        <div class="right"></div>
        <div class="center"></div>
    </article>
</section>
```

#### 绝对定位

实现原理：通过定位实现了`left、right、center`三个元素在空间上的分隔，而这三个元素由于设置了`position:absolute`，因此都为BFC容器，实现了其内容的隔离。

```html
<style media="screen">
    .left-center-right > div {
        position: absolute;
    }
    .left {
        left: 0;
        width: 300px;
        background: red;
    }
    .right {
        right: 0;
        width: 300px;
        background: blue;
    }
    .center {
        left: 300px;
        right: 300px;
        background: gold;
    }
</style>
<article class="left-center-right">
    <div class="left"></div>
    <div class="center">绝对定位---center部分</div>
    <div class="right"></div>
</article>
```

#### Flex

```html
<section class="layout flex">
    <style media="screen">
        .layout.flex {
            margin-top: 200px;
        }
        .layout.flex .left-center-right {
            display: flex;
        }
        .layout.flex .left {
            width: 300px;
            background: red;
        }
        .layout.flex .right {
            width: 300px;
            background: blue;
        }
        .layout.flex .center {
            flex: 1;
            background: gold;
        }
    </style>
    <article class="left-center-right">
        <div class="left"></div>
        <div class="center">flex布局---center部分</div>
        <div class="right"></div>
    </article>
</section>
```

#### Grid

```html
<section class="layout grid">
    <style media="screen">
        .layout.grid .left-center-right {
            display: grid;
            width: 100%;
            grid-template-rows: 100px;
            grid-template-columns: 300px auto 300px;
        }
        .layout.grid .left {
            background: red;
        }
        .layout.grid .right {
            background: blue;
        }
        .layout.grid .center {
            background: gold;
        }
    </style>
    <article class="left-center-right">
        <div class="left"></div>
        <div class="center">Grid布局---center部分</div>
        <div class="right"></div>
    </article>
</section>
```

#### 表格布局

```html
<section class="layout table">
    <style media="screen">
        .layout.table .left-center-right {
            display: table;
            width: 100%;
            height: 100px;
        }
        .layout.table .left {
            display: table-cell;
            width: 300px;
            background: red;
        }
        .layout.table .right {
            display: table-cell;
            width: 300px;
            background: blue;
        }
        .layout.table .center {
            display: table-cell;
            background: gold;
        }
    </style>
    <article class="left-center-right">
        <div class="left"></div>
        <div class="center">表格布局---center部分</div>
        <div class="right"></div>
    </article>
</section>
```

#### 5种方案的优缺点

|          | 优点                 | 缺点                                   |
| -------- | -------------------- | -------------------------------------- |
| 浮动     | 兼容性好             | 清除浮动（脱离文档流，会带来很多问题） |
| 绝对定位 | 快捷                 | 脱离文档流                             |
| Flexbox  | 最全面，移动端很普及 | 兼容性                                 |
| 表格布局 | 兼容性好             | 单元格高度随着调整                     |
| Grid     | 替代栅格系统         | 兼容性                                 |

#### 假如高度未知，哪个方案失效

* 浮动、绝对定位、Grid均会失效
* flex、表格布局可以



### 如何实现一个元素水平垂直居中？

- 方法1 已知元素宽高：父元素相对定位，子元素绝对定位。设置子元素`left` `top` `right` `bottom`都为`0`, 外边距设置为`auto`;

```css
.parent {
  position: relative;
  width:  300px;
  height: 300px;
}
.child {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100px;
  height: 100px;
  margin: auto;
}
```

- 方法2 已知子元素宽高：父元素相对定位，子元素绝对定位。设置子元素`left` `top` 都为`50%`, `margin-left``margin-top`外边距设置为**负的宽高的一半**;

```css
.child {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 100px;
  height: 100px;
  margin-top: -50px;
  margin-left: -50px;
}
```

- 方法3 未知元素宽高：父元素相对定位，子元素绝对定位。设置子元素的`left` `right` 都为`50%`，通过css平移属性向左和向上平移平移自身宽高的一半`transform: translate(-50%, -50%);`

```css
.child {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 100px;
  height: 100px;
  transform: translate(-50%, -50%);
}
```

- 方法4 通过弹性盒属性设置在主轴和侧轴上居中对齐

```css
.parent {
  display: flex;
  align-items: center;
  justify-content: center;
}
```

- 方法5 兼容IE8可以使用table相关属性

```css
.parent {
  display: table;
  text-align: center;
  width: 300px;
  height: 300px;
  border: 1px solid #ccc;
}
.parent .child {
  display: table-cell;
  vertical-align: middle;
}
.parent .child span {
  /* span会水平垂直巨中 */
}
```

- 方法6 通过最新的网格布局来实现

```css
.parent {
  display: grid;
  align-items: center;
  justify-content: center;
}
```

- 方法7 单行文字，设置行高等于自身高度，文本设置居中

```css
.parent {
  height: 22px;
  line-height: 22px;
  text-align: center;
}
```



### 如何使用css实现等宽布局？

```css
.parent {
  display: flex;
}
.child {
  flex: 1;
}
```



### 如何实现满屏品字布局？

```html
<style>
    html,body{
        height: 100%;
        padding: 0;
        margin: 0;
    }
    .main{
        margin: 0 auto;
        width: 700px;
        height: 50%;
        background-color: red;
    }
    .nav{
        height: 50%;
    }
    .frist, .two{
        display: inline-block;
        height: 100%;
        width: 50%;
        background-color: blue;
    }
    .two{
        float: left;
        background-color: yellow;
    }
</style>
<div class="main"></div>
<div class="nav">
    <div class="frist"></div>
    <div class="two"></div>
</div>
```

![](https://files.catbox.moe/dzv6c2.png)



### 实现一个扇形

用CSS实现扇形的思路和三角形基本一致，就是多了一个圆角的样式，实现一个90°的扇形：

```
div{
    border: 100px solid transparent;
    width: 0;
    heigt: 0;
    border-radius: 100px;
    border-top-color: red;
}
```

![](https://files.catbox.moe/qikz0z.png)



### 画一条0.5px的线

- **采用transform: scale()的方式**，该方法用来定义元素的2D 缩放转换：

```css
transform: scale(0.5,0.5);
```

- **采用meta viewport的方式**

```html
<meta name="viewport" content="width=device-width, initial-scale=0.5, minimum-scale=0.5, maximum-scale=0.5"/>
```

这样就能缩放到原来的0.5倍，如果是1px那么就会变成0.5px。viewport只针对于移动端，只在移动端上才能看到效果



### 怎么让 Chrome 支持小于 12px 的文字？

- 使用Webkit的内核的私有CSS属性来解决`-webkit-text-size-adjust:none`，设置后字体大小就不受限制了。但是chrome更新到27版本之后就不可以用了。
- css3 的 transform 属性，设置值为 scale(x, y) 定义 2D 缩放转换。



## CSS冷门八股

### 解决 img 图片自带边距的问题

（1）转化成（行级）块元素

```css
 display : block;
```

（2）浮动，浮动后的元素默认可以转化为块元素（可以随意设置宽高属性）

```css
float : left;
```

（3）给 img 定义 vertical-align（消除底部边距）

```css
img{    
    border: 0;    
    vertical-align: bottom;
}
```

（4）将其父容器的font-size 设为 0；

（5）给父标签设置与图片相同的高度



### li 与 li 之间有看不见的空白间隔是什么原因引起的？有什么解决办法？

浏览器的默认行为是把 inline 元素间的空白字符（空格换行 tab）渲染成一个空格，也就是`<li>`换行后会产生换行字符，而它会变成一个空格，当然空格就占用一个字符的宽度。

解决方案：

方法一：既然是因为 `<li>` 换行导致的，那就可以将 `<li>` 代码全部写在一排，如下

``` html
<div class="wrap">
    <h3>li标签空白测试</h3>
    <ul>
        <li class="part1"></li><li class="part2"></li><li class="part3"></li><li class="part4"></li>
    </ul>
</div>
```

方法二：我们为了代码美观以及方便修改，很多时候我们不可能将 `<li>` 全部写在一排，那怎么办？既然是空格占一个字符的宽度，那我们索性就将 `<ul>` 内的字符尺寸直接设为 0，将下面样式放入样式表，问题解决。

``` css
.wrap ul {
    font-size: 0px;
}
```

但随着而来的就是 `<ul>` 中的其他文字就不见了，因为其尺寸被设为 0px 了，我们只好将他们重新设定字符尺寸。



### css sprite（雪碧图）是什么, 有什么优缺点？

概念：将多个小图片拼接到一个图片中。通过 background-position 和元素尺寸调节需要显示的背景图案。

优点：

* 减少 HTTP 请求数，极大地提高页面加载速度。
* 增加图片信息重复度，提高压缩比，减少图片大小。
* 更换风格方便，只需在一张或几张图片上修改颜色或样式即可实现。

缺点：

* 图片合并麻烦。
* 维护麻烦，修改一个图片可能需要从新布局整个图片，样式。



### css sprite和 base64 如何选择？

base64 适用场景：
应用于小的图片几 k 的，太大的图片会转换后的大小太大，得不偿失。
用于一些 css sprites 不利处理的小图片，如一些可以通过 background-repeat 平铺来做成背景的图片



### 如果设计中使用了非标准的字体，你该如何去实现？

使用 `@font-face` 并为不同的 `font-weight` 定义 `font-family` 。



### 在网页中的应该使用奇数还是偶数的字体？为什么呢？

参考答案：应该使用偶数字体

1\. 比例关系

相对来说偶数字号比较容易和页面中其他部分的字号构成一个比例关系。如我使用 14px 的字体作为正文字号，那么其他部分的字体（如标题）就可以使用 14×1. 5 =21px 的字体，或者在一些地方使用到了 14×0. 5=7px 的 padding 或者 margin，如果你是在用 sass 或者 less 编写 css，这时候用处就凸显出来了。

2\. UI 设计师的缘故

大多数设计师用的软件如 ps 提供的字号是偶数，自然到了   前端那边也是用的是偶数。

3\. 浏览器缘故

其一是低版本的浏览器 ie6 会把奇数字体强制转化为偶数，即 13px 渲染为 14px。

其二是为了平分字体。偶数宽的汉字，如 12px 的汉子，去掉 1 像素的字体间距，填充了的字体像素宽度其实就是 11px，这样的汉字中竖线左右是平分的，如“中”子，左右就是 5px 了。

4\. 系统差别

Windows 自带的点阵宋体（中易宋体）从 Vista 开始只提供 12、14、16 px 这三个大小的点阵，而 13、15、17 px 时用的是小一号的点阵（即每个字占的空间大了 1 px，但点阵没变），于是略显稀疏。

而在 Linux 和其他手持设备上，奇数偶数的渲染效果其实相差不大。



### CSS中使用列布局是什么？

CSS列布局帮助你分割文本变为列，例如考虑下面的杂志新闻在一个大的文本中，但是我们需要在他们之间使用边界划分为3列，这里HTML5的列布局就有所帮助了

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/27/16a5d9ddd53f7691~tplv-t2oaga2asx-watermark.awebp)

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/4/27/16a5d9eadc51d9bd~tplv-t2oaga2asx-watermark.awebp)



### 如何修改 chrome 记住密码后自动填充表单的黄色背景？

```css
input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px 颜色 inset;
    border: 1px solid #CCC!important;
}
```



### 除了 screen，你还能说出一个 @media 属性的例子吗？

* all

  适用于所有设备。

* print

  为了加载合适的文档到当前使用的可视窗口. 需要提前咨询 paged media（媒体屏幕尺寸）, 以满足个别设备网页尺寸不匹配等问题。

* screen

  主要适用于彩色的电脑屏幕

* speech

  speech 这个合成器. 注意: CSS2 已经有一个相似的媒体类型叫 aural



### 让页面里的字体变清晰，变细用 CSS 怎么做？

`-webkit-font-smoothing: antialiased;` 



### font-style 属性的值为 oblique 时是什么意思？

Oblique是让没有斜体属性的文字倾斜



### 无依赖绝对定位是什么？

```
没有设置left/top/right/bottom属性值的绝对定位称为“无依赖绝对定位”。
无依赖绝对定位其定位的位置和没有设置position:absolute时候的位置相关。
```

### 隐藏元素的方法有哪些

- **display: none**：渲染树不会包含该渲染对象，因此该元素不会在页面中占据位置，也不会响应绑定的监听事件。
- **visibility: hidden**：元素在页面中仍占据空间，但是不会响应绑定的监听事件。
- **opacity: 0**：将元素的透明度设置为 0，以此来实现元素的隐藏。元素在页面中仍然占据空间，并且能够响应元素绑定的监听事件。
- **position: absolute**：通过使用绝对定位将元素移除可视区域内，以此来实现元素的隐藏。
- **z-index: 负值**：来使其他元素遮盖住该元素，以此来实现隐藏。
- **clip/clip-path** ：使用元素裁剪的方法来实现元素的隐藏，这种方法下，元素仍在页面中占据位置，但是不会响应绑定的监听事件。
- **transform: scale(0,0)**：将元素缩放为 0，来实现元素的隐藏。这种方法下，元素仍在页面中占据位置，但是不会响应绑定的监听事件。



## CSS高频八股

### 讲讲BFC

**什么是BFC**

BFC（Block Formatting Context）格式化上下文，是 Web 页面中盒模型布局的 CSS 渲染模式，指一个独立的渲染区域或者说是一个隔离的独立容器。

**形成 BFC 的条件:**

- 浮动元素，float 除 none 以外的值
- 绝对定位元素，position（absolute，fixed）
- display 为以下其中之一的值 inline-block，table-cell，table-caption
- overflow 除了 visible 以外的值（hidden，auto，scroll）
- HTML 就是一个 BFC

**BFC 的特性：**

- 内部的 Box 会在垂直方向上一个接一个的放置。
- 垂直方向上的距离由 margin 决定
- bfc 的区域不会与 float 的元素区域重叠。
- 计算 bfc 的高度时，浮动元素也参与计算
- bfc 就是页面上的一个独立容器，容器里面的子元素不会影响外面元素。



### CSS的属性值 auto?

#### width

- 对于width来说，当子元素设置为 `width: auto`时，子元素的 `margin-left + margin-right + border-left + border-right + padding-left + padding-right + content-width` 对等于父元素的`content-width`
- 当子元素设置为 `width:100%`时，将根据子元素的盒模型来调整：
  - 子元素为`padding-box`时，子元素的`content-width`等于父元素的`content-width`
  - 子元素为`border-box`时，子元素的`border-left + border-right + padding-left + padding-right + content-width`等于父元素的`content-width`

#### height

- 对于height来说，当子元素设置为`height:auto`时，其高度由其内容撑开，与父元素无关。
- 当子元素设置为`height:100%`，其表现与设置为`width:100%`一致。

#### margin

子元素为非绝对定位元素时：

- margin的auto值只对 `margin-left`和`margin-right`有效，对`margin-top`和`margin-bottom`无效，相当于没有设置。
- 当只设置 `margin-left: auto`时，子元素的右侧贴近父元素`content`的右侧
- 当只设置`margin-right: auto`时，子元素的左侧贴近父元素`content`的左侧
- 当同时设置`margin-left: auto`、`margin-right: auto`时，子元素相当于父元素的`content`居中

子元素为绝对定位元素时（absolute、fixed）,为`absolute`时父元素指代最近的不为static的上级元素、为`fixed`时父元素指代body

- 当设置 `margin-left:auto`时，只有同时设置`left: 0`时才能生效；`margin-right`、`margin-top`、`margin-bottom`也类似，因此进行如下设置时，子元素相对于父元素（padding + content的区域）水平垂直居中。

  ```css
  .child{
      left: 0;
      right: 0;
      top: 0;
      right: 0;
      margin: auto;
  }
  ```

**注意：当子元素不是绝对定位时，margin: auto 相对于父元素 content进行定位，当子元素为绝对定位元素时，margin: auto 相对于父元素 padding + content 进行定位。**

#### flex

`flex:auto`等价于`flex: 1 1 auto`，也就是`fkex-grow: 1; flex-shrink: 1; flex-basis: auto;`

#### overflow

当元素设置`overflow:auto`时，当元素内容超出元素的高度和宽度时会显示滚动条。

`overflow:auto`与`overflow:scroll`的区别是：

- `overflow:scroll`无论元素内容是否超出元素的高度和宽度时都会显示纵向滚动条和横向滚动条
- `overflow:auto`只在元素内容超出元素的高度时显示纵向滚动条，元素内容超出元素宽度时显示横向滚动条。

#### left、right、top、bottom

当元素为**非绝对定位**元素时 `left、right、top、bottom`这些定位的`auto`值都无效，但当元素为**绝对定位**（absolute、fixed）时，这些属性则有各种的表现形式：

- `left:auto`：`left`属性的值相当于**父元素**的`padding-left`值，也就是元素的左侧会贴在父元素`content`的左侧
- `top:auto`：`top`属性的值相当于**父元素**的`padding-top`值，也就是元素的上侧会贴在父元素`content`的上侧
- `right:auto`：`right`属性的值为元素`padding-box`的右侧到父元素的`padding-box`下侧的距离
- `bottom:auto`：`bottom`属性的值为元素`padding-box`的下侧到父元素的`padding-box`下侧的距离

left、right、top、bottom的优先级：

- 当同时设置了`left`和`right`时，`left`优先设置，有一种情况例外：当`left:auto`且`right`属性为具体数值（如`right:10px`），以right为优先、同理，`top`和`bottom`也是一样。

**注意：当父元素设置 `direction: rtl`时，上述的`left`和`right`的表现形式和优先级逆转。**



### 重置CSS 和 标准化CSS 的区别是什么？你会选择哪种方式，为什么？

参考答案：

* **重置（Resetting）**： 重置意味着除去所有的浏览器默认样式。对于页面所有的元素，像 `margin` 、 `padding` 、 `font-size` 这些样式全部置成一样。你将必须重新定义各种元素的样式。
* **标准化（Normalizing）**： 标准化没有去掉所有的默认样式，而是保留了有用的一部分，同时还纠正了一些常见错误。

当需要实现非常个性化的网页设计时，我会选择重置的方式，因为我要写很多自定义的样式以满足设计需求，这时候就不再需要标准化的默认样式了。



### 设置元素浮动后，该元素的 display 值是什么？

自动变成 `display:block`



### 使用 clear 属性清除浮动的原理？

使用clear属性清除浮动，其语法如下：

```css
clear: none|left|right|both
```

如果单看字面意思，clear:left 是“清除左浮动”，clear:right 是“清除右浮动”，实际上，这种解释是有问题的，因为浮动一直还在，并没有清除。

官方对clear属性解释：“**元素盒子的边不能和前面的浮动元素相邻**”，对元素设置clear属性是为了避免浮动元素对该元素的影响，而不是清除掉浮动。

还需要注意 clear 属性指的是元素盒子的边不能和前面的浮动元素相邻，注意这里“**前面的**”3个字，也就是clear属性对“后面的”浮动元素是不闻不问的。考虑到float属性要么是left，要么是right，不可能同时存在，同时由于clear属性对“后面的”浮动元素不闻不问，因此，当clear:left有效的时候，clear:right必定无效，也就是此时clear:left等同于设置clear:both；同样地，clear:right如果有效也是等同于设置clear:both。由此可见，clear:left和clear:right这两个声明就没有任何使用的价值，至少在CSS世界中是如此，直接使用clear:both吧。

![1638669840611](C:\Users\HZR\OneDrive\图片\1638669840611.png)

### 行内元素和块级元素的具体区别是什么?

**块级元素( block )特性：**

总是独占一行，表现为另起一行开始，而且其后的元素也必须另起一行显示（浮动元素除外）；

宽度(width)、高度(height)、内边距(padding)和外边距(margin)都可控制；

![img](https://iknow-pic.cdn.bcebos.com/6a600c338744ebf8a67ad383d4f9d72a6059a707?x-bce-process%3Dimage%2Fresize%2Cm_lfit%2Cw_600%2Ch_800%2Climit_1%2Fquality%2Cq_85%2Fformat%2Cf_jpg)

**内联元素(inline)特性：**

和相邻的内联元素在同一行;

宽度(width)、高度(height)、内边距的top/bottom(padding-top/padding-bottom)和外边距的top/bottom(margin-top/margin-bottom)都不可改变（也就是padding和margin的left和right是可以设置的）。

![img](https://iknow-pic.cdn.bcebos.com/42a98226cffc1e17fb093a8d4790f603728de9dc?x-bce-process%3Dimage%2Fresize%2Cm_lfit%2Cw_600%2Ch_800%2Climit_1%2Fquality%2Cq_85%2Fformat%2Cf_jpg)



**行内块元素（inline-block）（拥有内在尺寸，可设置高宽，但不会自动换行）**

如：img、input



### 元素竖向的百分比设定是相对于容器的高度吗？

当按百分比设定一个元素的宽度时，它是相对于父容器的宽度计算的，但是，对于一些表示竖向距离的属性，例如 padding-top , padding-bottom , margin-top , margin-bottom 等，当按百分比设定它们时，依据的也是父容器的宽度，而不是高度。



### rgba() 和 opacity 的透明效果有什么不同？

rgba()和opacity都能实现透明效果，但最大的不同是opacity作用于元素，以及元素内的所有内容的透明度，而rgba()只作用于元素的颜色或其背景色。（设置rgba透明的元素的子元素不会继承透明效果！）





### px、em、rem的区别及使用场景

**三者的区别：**

- px是固定的像素，一旦设置了就无法因为适应页面大小而改变。
- em和rem相对于px更具有灵活性，他们是相对长度单位，其长度不是固定的，更适用于响应式布局。
- em的值相对于其父元素字体的大小，这样就会存在一个问题，进行任何元素设置，都有可能需要知道他父元素字体的大小。而rem是相对于根元素字体，这样就意味着，只需要在根元素确定一个参考值。

**使用场景：**

- 对于只需要适配少部分移动设备，且分辨率对页面影响不大的，使用px即可 。
- 对于需要适配各种移动设备，使用rem，例如需要适配iPhone和iPad等分辨率差别比较挺大的设备。



### position 的不同值分别是相对于什么定位的？

* absolute : 生成绝对定位的元素， 相对于最近一级的定位不是 static 的父元素来进行定位。
* fixed （老 IE 不支持）生成绝对定位的元素，通常相对于浏览器窗口或 frame 进行定位。
* relative 生成相对定位的元素，相对于其在普通流中的位置进行定位。
* static 默认值。没有定位，元素出现在正常的流中
* sticky 生成粘性定位的元素，元素始终被限制在最近块级父元素的区域中，当未超出父元素区域时，显示效果相当于fixed。

 <img src="https://z3.ax1x.com/2021/11/21/Ivi34J.gif" alt="Ivi34J.gif" style="zoom:50%;" />

### 如何解决不同浏览器的样式兼容性问题？

* 在确定问题原因和有问题的浏览器后，使用单独的样式表，仅供出现问题的浏览器加载。这种方法需要使用服务器端渲染。
* 使用已经处理好此类问题的库，比如 Bootstrap。
* 使用 `autoprefixer` 自动生成 CSS 属性前缀。
* 使用 Reset CSS 或 Normalize. css。



### 什么情况下，用 translate() 而不用绝对定位？什么时候下相反？

`translate()` 是 `transform` 的一个值。改变 `transform` 或 `opacity` 不会触发浏览器重新布局（reflow）或重绘（repaint），只会触发复合（compositions）。而改变绝对定位会触发重新布局，进而触发重绘和复合。 

当使用 `translate()` 时，元素仍然占据其原始空间（有点像 `position：relative` ），这与改变绝对定位不同。



### 请阐述  z-index  属性，并说明如何形成层叠上下文（stacking context)

CSS 中的 `z-index` 属性控制重叠元素的垂直叠加顺序。 `z-index` 只能影响 `position` 值不是 `static` 的元素。

没有定义 `z-index` 的值时，元素按照它们出现在 DOM 中的顺序堆叠（层级越低，出现位置越靠上）。非静态定位的元素（及其子元素）将始终覆盖静态定位（static）的元素，而不管 HTML 层次结构如何。

层叠上下文是包含一组图层的元素。 在一组层叠上下文中，其子元素的 `z-index` 值是相对于该父元素而不是 document root 设置的。每个层叠上下文完全独立于它的兄弟元素。如果元素 B 位于元素 A 之上，则即使元素 A 的子元素 C 具有比元素 B 更高的 `z-index` 值，元素 C 也永远不会在元素 B 之上。

每个层叠上下文是自包含的：当元素的内容发生层叠后，整个该元素将会在父层叠上下文中按顺序进行层叠。少数 CSS 属性会触发一个新的层叠上下文，例如 `opacity` 小于 1， `filter` 不是 `none` ， `transform` 不是 `none` 。



### CSS渲染层？

#### 什么是渲染层？

处于相同坐标空间（z轴空间）的渲染对象，都将归并到同一个渲染层中，因此根据层叠上下文，不同坐标空间的的渲染对象将形成多个渲染层，以体现它们的层叠关系。所以，对于满足形成层叠上下文条件的渲染对象，浏览器会自动为其创建新的渲染层。能够导致浏览器为其创建新的渲染层的，包括以下几类常见的情况：

- 根元素 document
- 有明确的定位属性（relative、fixed、sticky、absolute）
- opacity < 1
- 有 CSS filter 属性
- 有 CSS mask 属性
- 有 CSS mix-blend-mode 属性且值不为 normal
- 有 CSS transform 属性且值不为 none
- backface-visibility 属性为 hidden
- 有 CSS reflection 属性
- 有 CSS column-count 属性且值不为 auto或者有 CSS column-width 属性且值不为 auto
- 当前有对于 opacity、transform、fliter、backdrop-filter 应用动画
- overflow 不为 visible

#### 合成层

满足某些特殊条件的渲染层，会被浏览器自动提升为合成层。合成层拥有单独的 GraphicsLayer，而其他不是合成层的渲染层，则和其第一个拥有 GraphicsLayer 的父层共用一个。

那么一个渲染层满足哪些特殊条件时，才能被提升为合成层呢？这里列举了一些常见的情况：

- 3D transforms：translate3d、translateZ 等
- video、canvas、iframe 等元素
- 通过 Element.animate() 实现的 opacity 动画转换
- 通过 СSS 动画实现的 opacity 动画转换
- position: fixed
- 具有 will-change 属性
- 对 opacity、transform、fliter、backdropfilter 应用了 animation 或者 transition

我们可以使用`will-change`属性或者`transform: translateZ(0)`将 CPU 消耗高的渲染元素提升为一个新的合成层，从而开启 GPU 加速的。

这里值得注意的是，不少人会将这些合成层的条件和渲染层产生的条件混淆，这两种条件发生在两个不同的层处理环节，是完全不一样的。

每一个GraphicsLayer 处理自己所属的合成层（可能有多个渲染层），GraphicsLayer拥有一个图形上下文（GraphicsContext），GraphicsContext 会负责输出该层（合成层）的位图。存储在共享内存中的位图将作为纹理上传到 GPU，最后由 GPU 将多个位图（多个合成层）进行合成，然后绘制到屏幕上，此时，我们的页面也就展现到了屏幕上。

**总结：一个渲染层的内容发生了变化，会引起该渲染层所属的合成层的重绘或重排（有些操作不会引起重排），而一个合成层的内容的任何改变，都不会引起其他合成层的重绘和重排**

#### 优化建议

一些交互复杂的玩法页面，存在持续变化位置的 animation 元素，我们最好是使用 transform 来实现而不是通过改变 left/top 的方式。这样做的原因是：如果使用 left/top 来实现位置变化，animation 节点和 Document 将被放到了同一个 GraphicsLayer 中进行渲染，持续的动画效果将导致整个 Document 不断地执行重绘，而使用 transform 的话，能够让 animation 节点被放置到一个独立合成层中进行渲染绘制，动画发生时不会影响到其它层。并且另一方面，动画会完全运行在 GPU 上，相比起 CPU 处理图层后再发送给显卡进行显示绘制来说，这样的动画往往更加流畅。

来源文章：https://juejin.cn/post/6844903966573068301



### z-index属性在什么情况下会失效？

通常 z-index 的使用是在有两个重叠的标签，在一定的情况下控制其中一个在另一个的上方或者下方出现。z-index值越大就越是在上层。z-index元素的position属性需要是relative，absolute或是fixed。

**z-index属性在下列情况下会失效：**

- 父元素position为relative时，子元素的z-index失效。解决：父元素position改为absolute或static；
- 元素 position 属性为 static 。解决：设置该元素的position属性为relative，absolute或是fixed中的一种；
- 元素在设置z-index的同时还设置了float浮动。解决：float去除，改为display：inline-block；



### CSS3中有哪些新特性

- 新增各种CSS选择器 （: not(.input)：所有 class 不是“input”的节点）
- 圆角 （border-radius:8px）
- 多列布局 （multi-column layout）
- 阴影和反射 （Shadow、reflect）
- 文字特效 （text-shadow）
- 文字渲染 （Text-decoration）
- 线性渐变 （gradient）
- 旋转 （transform）
- 增加了旋转,缩放,定位,倾斜,动画,多背景



### 替换元素的概念及计算规则

通过修改某个属性值呈现的内容就可以被替换的元素就称为“替换元素”。

如`img、input、textarea、select`等元素，img 元素修改 src属性可以替换显示内容，同样，input元素修改 type 属性也可以改变显示内容。

替换元素除了内容可替换这一特性以外，还有以下特性：

- **内容的外观不受页面上的CSS的影响**：用专业的话讲就是在样式表现在CSS作用域之外。如何更改替换元素本身的外观需要类似appearance属性，或者浏览器自身暴露的一些样式接口。
- **有自己的尺寸**：在Web中，很多替换元素在没有明确尺寸设定的情况下，其默认的尺寸（不包括边框）是300像素×150像素，如
- **在很多CSS属性上有自己的一套表现规则**：比较具有代表性的就是vertical-align属性，对于替换元素和非替换元素，vertical-align属性值的解释是不一样的。比方说vertical-align的默认值的baseline，很简单的属性值，基线之意，被定义为字符x的下边缘，而替换元素的基线却被硬生生定义成了元素的下边缘。
- **所有的替换元素都是内联水平元素**：也就是替换元素和替换元素、替换元素和文字都是可以在一行显示的。但是，替换元素默认的display值却是不一样的，有的是inline，有的是inline-block。

替换元素的尺寸从内而外分为三类：

- **固有尺寸：** 指的是替换内容原本的尺寸。例如，图片、视频作为一个独立文件存在的时候，都是有着自己的宽度和高度的。
- **HTML尺寸：** 只能通过HTML原生属性改变，这些HTML原生属性包括的width和height属性、的size属性。
- **CSS尺寸：** 特指可以通过CSS的width和height或者max-width/min-width和max-height/min-height设置的尺寸，对应盒尺寸中的content box。



这三层结构的计算规则具体如下：

（1）如果没有CSS尺寸和HTML尺寸，则使用固有尺寸作为最终的宽高。

（2）如果没有CSS尺寸，则使用HTML尺寸作为最终的宽高。

（3）如果有CSS尺寸，则最终尺寸由CSS属性决定。

（4）如果“固有尺寸”含有固有的宽高比例，同时仅设置了宽度或仅设置了高度，则元素依然按照固有的宽高比例显示。

（5）如果上面的条件都不符合，则最终宽度表现为300像素，高度为150像素。

（6）内联替换元素和块级替换元素使用上面同一套尺寸计算规则。



### 如何判断元素是否到达可视区域 

以图片显示为例：

- `window.innerHeight` 是浏览器可视区的高度；
- `window.pageYOffset`是浏览器滚动的过的距离；
- `imgs.offsetTop` 是元素顶部距离文档顶部的高度
- 内容达到显示区域的条件：`img.offsetTop < window.innerHeight + window.pageYOffset`



### line-height 的理解及其赋值方式

**（1）line-height的概念：**

- line-height 指一行文本（包括文字、行内元素、行内块元素）的高度，包含了字间距，实际上是下一行基线到上一行基线距离；
- 如果一个标签没有定义 height 属性，那么其最终表现的高度由 line-height 决定；
- 一个容器没有设置高度，那么撑开容器高度的是 line-height，而不是容器内的文本内容；
- 把 line-height 值设置为 height 一样大小的值可以实现单行文字的垂直居中；
- line-height 和 height 都能撑开一个高度；

**（2）line-height 的赋值方式：**

- 带单位：px 是固定值，而 em 会参考父元素 font-size 值计算自身的行高
- 纯数字：会把比例传递给后代。例如，父级行高为 1.5，子元素字体为 18px，则子元素行高为 1.5 * 18 = 27px
- 百分比：将计算后的值传递给后代



### display:inline-block 什么时候会显示间隙？

**原因：**换行或空格会占据一定的位置

**解决**：

水平间隙时：父元素设置`letter-spacing: -4px`或`word-spacing:-4px`
垂直间隙时：子元素间设置 负值margin，如：`margin: -2px 0`
上述两种情况通用：父元素设置 `font-size:0`



### 知道外边距重叠问题吗？如何解决？

**问题描述：**

两个块级元素的上外边距和下外边距可能会合并（折叠）为一个外边距，其大小会取其中外边距值大的那个，这种行为就是外边距折叠。需要注意的是，**浮动的元素和绝对定位**这种脱离文档流的元素的外边距不会折叠。重叠只会出现在**垂直方向**。

**计算原则：**

折叠合并后外边距的计算原则如下：

- 如果两者都是正数，那么就取最大者
- 如果是一正一负，就会正值减去负值的绝对值
- 两个都是负值时，用0减去两个中绝对值大的那个

**解决办法：**

对于折叠的情况，主要有两种：**兄弟之间重叠**和**父子之间重叠**

（1）兄弟之间重叠

- 底部元素变为行内盒子：`display: inline-block`
- 底部元素设置浮动：`float`
- 底部元素的position的值为`absolute/fixed`

（2）父子之间重叠

- 父元素加入：`overflow: hidden`
- 父元素添加透明边框：`border:1px solid transparent`
- 子元素变为行内盒子：`display: inline-block`
- 子元素加入浮动属性或定位



#### 什么是包含块，对于包含块的理解?

包含块（containing block）就是元素用来计算和定位的一个框。

（1）根元素（很多场景下可以看成是`<html>`）被称为“初始包含块”，其尺寸等同于浏览器可视窗口的大小。

（2）对于其他元素，如果该元素的position是relative或者static，则“包含块”由其最近的块级祖先元素的content box
边界形成。

（3）如果元素position:fixed，则“包含块”是“初始包含块”。

（4）如果元素position:absolute，则“包含块”由最近的position不为static的祖先元素建立，具体方式如下：

如果该祖先元素是纯inline元素，则规则略复杂：
•假设给内联元素的前后各生成一个宽度为0的内联盒子（inline box），则这两个内联盒子的padding box外面的包
围盒就是内联元素的“包含块”；
•如果该内联元素被跨行分割了，那么“包含块”是未定义的，也就是CSS2.1规范并没有明确定义，浏览器自行发挥
否则，“包含块”由该祖先的padding box边界形成。

如果没有符合条件的祖先元素，则“包含块”是“初始包含块”。

简单描述：默认情况下包含块就是离当前元素最近的块级祖先元素；
		对于开启了绝对定位的元素来说，包含块是离它最近的开启了定位（且position不为static）的祖先元素，
		如果所有的祖先元素都没有开启定位，则其包含块就是初始包含块。



### display、float、position的关系

（1）首先判断display属性是否为none，如果为none，则position和float属性的值不影响元素最后的表现。

（2）然后判断position的值是否为absolute或者fixed，如果是，则float属性失效，并且display的值应该被设置为table或者block，具体转换需要看初始转换值。

（3）如果position的值不为absolute或者fixed，则判断float属性的值是否为none，如果不是，则display的值则按上面的规则转换。注意，如果position的值为relative并且float属性的值存在，则relative相对于浮动后的最终位置定位。

（4）如果float的值为none，则判断元素是否为根元素，如果是根元素则display属性按照上面的规则转换，如果不是，则保持指定的display属性值不变。

总的来说，可以把它看作是一个类似优先级的机制：

`display:none` >>`position: absolute | fixed` >> `float: !none` >>  `element === root`  >> `display: other value` 





## CSS响应式布局

### flex布局

- **flex-flow**: flex-direction 和 flex-wrap 的简写。

  - **flex-direction**：指定了flex容器的主轴方向

    `row`(默认) | `column` | `row-reverse` | `column-reverse`

    ```
    row、row-reverse：主轴为x轴，子元素横向排列
    column、column-reverse：主轴为y轴，子元素纵向排列
    ```

  - **flex-wrap**：指定容器空间不够时的换行策略。

    `nowrap`（默认） | `wrap` | `wrap-reverse`

- **flex**：flex-grow、flex-shrink和flex-basis的简写。 

  - **flex-grow**：定义子元素`在主轴上`的`放大比例`，默认为0，即如果存在剩余空间，也不放大。

    ```
    某个子元素的分得的额外空间 = (容器剩余空间 / 所有子元素flex-grow属性值的和) * 该子元素flex-grow的属性值
    ```

  - **flex-shrink**：定义了子元素的缩小比例，默认为1，即如果空间不足，该子元素将缩小。

    ```
    设: 有 n 个子元素，空间分别为 W1、W2、W3 ··· Wn，flex-shrink的值分别为 S1、S2、S3 ··· S4，容器空间为 T
    
    则:
    某个子元素k的缩小的空间 = (sum(W1 ~ Wn) - T) * (Wk * Sk / sum(W1 * S1 ~ Wn * Sn))
    ```

  - **flex-basis**：定义了在分配多余空间之前，子元素占据的主轴空间。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为`auto`。当设定为长度值时分以下情况：

    ```
    当flex-direction为 row 或 row-reverse时，等同于 width
    当flex-direction为 column 或 column-reverse时，等同于 height
    ```

- **justify-content、justify-self**：定义了如何分配父容器主轴方向的子元素之间及其周围的空间。

  ![img](https://www.ruanyifeng.com/blogimg/asset/2015/bg2015071010.png)

- **align-items、align-self**：定义子元素在交叉轴上如何对齐。

  ![img](https://www.ruanyifeng.com/blogimg/asset/2015/bg2015071011.png)

- **align-content**：多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用。

  ![img](https://www.ruanyifeng.com/blogimg/asset/2015/bg2015071012.png)

### grid布局

详细教程：https://www.jianshu.com/p/3762f214cd6f

```html
<div class="container">
  <div class="header">header</div>
  <div class="side-bar">side-bar</div>
  <div class="footer">footer</div>
  <div class="content">content</div>
</div>

<style>
    .container{
        display: grid;
        height: 600px;
        width: 1000px;
        /** 将容器分为由 10 * 6 的网格 */
        grid-template-rows: repeat(6, 1fr);
        grid-template-columns: repeat(10, 1fr);
        
        grid-template-areas: 
            "hd hd hd hd hd hd hd hd hd hd"
            "sb sb ct ct ct ct ct ct ct ct"
            "sb sb ct ct ct ct ct ct ct ct"
            "sb sb ct ct ct ct ct ct ct ct"
            "sb sb ct ct ct ct ct ct ct ct"
            "ft ft ft ft ft ft ft ft ft ft";
    }
    
    .header{
        background-color: red;
        /** 第一种，使用名称*/
        grid-area: hd;
        
        /**第二、三、四种作用原理相同*/
        /** 第二种，指定坐标，四个值分别为左上角x,y坐标，右下角y,x坐标*/
        grid-area: 1 / 1 / 2 / 11;
        
        /** 第三种*/
        grid-column: 1 / 11;
        grid-row: 1 / 2;
        
        /**第四种*/
        grid-column-start: 1;
        grid-column-end: 11;
        grid-row-start: 1;
        grid-row-end: 2;
    }
    
    .side-bar{
        background-color: green;
        grid-area: sb;
    }
    
    .footer{
        background-color: yellow;
        grid-area: ft;
    }
    
    .content{
        background-color: blue;
        grid-area: ct;
    }
</style>
```

![](https://files.catbox.moe/4rf4tk.png)





## CSS动画

### transition

**示例**

```html
<div id="box"></div>

<style>
    #box {
        height: 100px;
        width: 100px;
        background: green;
        transition: transform 1s ease-in 1s;
    }

    #box:hover {
        transform: rotate(180deg) scale(.5, .5);
    }
</style>
```

![image](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/6/3/163c42601ede4b6e~tplv-t2oaga2asx-watermark.awebp)



**属性**

`transition: property | duration | timing-function | delay`

| 值                         | 描述                              |
| -------------------------- | --------------------------------- |
| transition-property        | 规定设置过渡效果的 CSS 属性的名称 |
| transition-duration        | 规定完成过渡效果需要多少秒或毫秒  |
| transition-timing-function | 规定速度效果的贝塞尔曲线          |
| transition-delay           | 定义过渡效果的延迟时间            |



### animation、keyframes

animation和keyframes总是一起出现，keyframes用来描述一个动画，animation用来定义如何使用一个动画

**示例**

```html
<div class="box"></div>

<style>
    .box {
        height: 100px;
        width: 100px;
        border: 15px solid black;
        animation: changebox 1s ease-in-out 1s infinite alternate running forwards;
    }

    .box:hover {
        animation-play-state: paused;
    }

    @keyframes changebox {
        10% {
            background: red;
        }
        50% {
            width: 80px;
        }
        70% {
            border: 15px solid yellow;
        }
        100% {
            width: 180px;
            height: 180px;
        }
    }
</style>
```

![image](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/6/3/163c4261137cc7df~tplv-t2oaga2asx-watermark.awebp)

**属性**

`animation: name | duration | timing-function | delay | iteration-count | direction | play-state | fill-mode`

| 值              | 描述                                                         |
| --------------- | ------------------------------------------------------------ |
| name            | 用来调用@keyframes定义好的动画，与@keyframes定义的动画名称一致 |
| duration        | 指定元素播放动画所持续的时间                                 |
| timing-function | 规定速度效果的速度曲线，是针对每一个小动画所在时间范围的变换速率 |
| delay           | 定义在浏览器开始执行动画之前等待的时间，值整个animation执行之前等待的时间 |
| iteration-count | 定义动画的播放次数，可选具体次数或者无限(infinite)           |
| direction       | 设置动画播放方向：normal(按时间轴顺序),reverse(时间轴反方向运行),alternate(轮流，即来回往复进行),alternate-reverse(动画先反运行再正方向运行，并持续交替运行) |
| play-state      | 控制元素动画的播放状态，通过此来控制动画的暂停和继续，两个值：running(继续)，paused(暂停) |
| fill-mode       | 控制动画结束后元素的样式，有四个值：none(回到动画没开始时的状态)，forwards(动画结束后动画停留在结束状态)，backwords(动画回到第一帧的状态)，both(根据animation-direction轮流应用forwards和backwards规则)，注意与iteration-count不要冲突(动画执行无限次) |





## CSS选择器

### CSS选择器的权重和优先级

**权重**

- 从0开始，一个行内样式+1000，一个id选择器+100，一个属性选择器、class或者伪类+10，一个元素选择器，或者伪元素+1，通配符+0

**优先级**

- 权重相同，写在后面的覆盖前面的
- 使用 `!important` 达到最大优先级，都使用 `!important` 时，权重大的优先级高
- !Important>内联样式(写在标签中的样式)>id>类=伪类选择器=属性选择器>伪元素=类型选择器(元素选择器)



### 浏览器是怎样解析CSS选择器的？

**CSS选择器的解析是从右向左解析的，为了避免对所有元素进行遍历**。因为如果从左向右的匹配，发现不符合规则，需要进行回溯，会损失很多性能。若从右向左匹配，先找到所有的最右节点，对于每一个节点，向上寻找其父节点直到找到根元素或满足条件的匹配规则，则结束这个分支的遍历。两种匹配规则的性能差别很大，是因为从右向左的匹配在第一步就筛选掉了大量的不符合条件的最右节点（叶子节点），而从左向右的匹配规则的性能都浪费在了失败的查找上面。



### CSS选择器有哪些？

#### 直接选择器

##### 通配符选择器

```css
*{
    margin:0;
    padding:0;
}
```

##### 标签选择器

```css
p{}
```

##### 类选择器

```css
.warning{}
```

##### ID选择器

```css
#warning{}
```



##### 属性选取器

**[attribute]**

```css
/* 选择所有具有 foo 属性的元素 */
[foo]{}
```

**[attribute=value]**

```css
/* 选择 foo 属性值为 abc 的元素*/
[foo=abc]{}
```

**[attribute~=value]、[attribute*=value]**

```css
/**
	e1: foo = "abc def"
	e2: foo = "abcdef"
*/

/* 选择 foo 属性值中带有 abc 这个单词的元素，可以选中 e1 */
[foo~=abc]{}

/* 选择 foo 属性值中带有 abc 的元素，可以选中 e1, e2*/
[foo*=abc]{}
```

**[attribute^=value]、[attribute|=value]、[attribute$=value]**

```css
/* 选择 foo 属性值以 abc 开头的元素*/
[foo^=abc]{}

/* 选择 foo 属性值以 abc 开头的元素，且与后面部分只能用连字符连接
如：foo = "abc"、foo = "abc-def"、foo = "abc-def-ghi"
*/
[foo|=abc]{}

/* 选择 foo 属性值以 abc 结尾的元素*/
[foo$=abc]{}
```



#### 文档结构选择器

##### 后代选择器

```css
/* 选择 ul 元素内的所有 li 元素 */
ul li{}
```

##### 子选择器 

```css
/* 选择 父元素为 li、爷元素为 ul 的 p 元素 */ 
ul>li>p{}
```

##### 相邻兄弟选择器

```css
/* 选择紧邻在 h1 元素后的 p 元素，注意只选择一个 */
h1+p{}
```

##### 一般兄弟选择器

```css
/* 选择前面有 h1 元素后的 p 元素，注意可选择多个 */ 
h1~p{}
```



#### 伪类选择器

##### :root 根元素伪类

```css
/* 一般情况下相当于 html 元素 */
:root{
    background-color:red;
}
```



##### 子元素相关伪类

**:nth-child(n)、:nth-last-child(n) 、:first-child、:last-child**

```css
/* 选中div元素的第一个子节点 */
div :nth-child(1){
    color:red;
}

/* 选中div元素的最后一个子节点 */
div :nth-last-child(1){
    color:red;
}

/* 选中div元素的第一个子节点 */
div :first-child{
    color:red;
}

/* 选中div元素的最后一个子节点 */
div :last-child{
    color:red;
}
```

**:nth-of-type(n) 、:nth-last-of-type(n)、:first-of-type、:last-of-type**

```css
/* 选中div元素的第二个子节点，且该子节点的类型为 p */
div p:nth-of-type(2){
    color: red;
}

/* 选中div元素的倒数第二个子节点，且该子节点的类型为 p */
div p:nth-last-of-type(2){
    color: red;
}

/* 选中div元素的第一个 p 子节点 */
div p:first-of-type{
    color: red;
}

/* 选中div元素的最后一个 p 子节点 */
div p:last-of-type{
    color: red;
}
```

**:only-child**

```css
/* 选中div元素的唯一一个子元素 */
div :only-child{}
```

**:empty**

```css
/* 选中没有子元素的div元素 */
div :empty{}
```

**:only-of-type**

```css
/* 选中div的唯一一个 p 子元素*/
div p:only-of-type{}
```



##### 元素状态相关选择器

**:link、:active、:hover、:visited、:focus、:enable、:disabled、:checked、:not()**

```css
/* 选择地址未被访问过的 a 标签，通过 a 标签的 href 属性和浏览器历史记录的匹配结果实现，而且是响应式的 */
a:link{}

/* 选择正在处于激活状态的 a 标签 */
a:active{}

/* 选择处于鼠标指针位置上的 a 标签 */
a:hover{}

/* 选择地址已被访问过的 a 标签，与 :link 刚好互斥 */
a:visited{}

/* 选择获得焦点的 input 元素 */
input:focus{}

/* 选择处于启用状态的 input 元素，即未使用 disabled 属性的 input 元素 */
input:enabled{}

/* 选择处于禁用状态的 input 元素，即使用了 disabled 属性的 input 元素 */
input:disabled{}

/* 选择每一个选中的 input[type="radio"]、input[type="checkbox"]和 option */
*:checked{}

/* 反向选择 */
:not(selector)
```



#### 伪元素选择器

注意，伪类选择器是一个冒号、伪元素选择器是两个冒号

**::first-line、::first-letter、::selection**

```css
/* 选中所有 p 元素的第一行文字 */
p::first-line{}

/* 选中所有 p 元素的第一个字母 */
p::first-letter{}

/* 选中所有 p 元素的被选择的文字 */
p::selection{}
```

**::before、::after**

```css
/* 在 p 元素前插入元素 */
p::before{
    content: 'hello'
}

/* 在 p 元素后插入元素 */
p::after{
    content: '。'
}
```



## CSS浏览器相关

### 标准盒模型和怪异（IE）盒模型

![https://img4.sycdn.imooc.com/5b73f51e00015f7907740523.jpg](https://img4.sycdn.imooc.com/5b73f51e00015f7907740523.jpg)

![https://img1.sycdn.imooc.com/5b73f53f0001a7ec07610507.jpg](https://img1.sycdn.imooc.com/5b73f53f0001a7ec07610507.jpg)

可使用box-sizing: content-box | border-box 来进行切换，非IE浏览器默认为标准盒模型



### 主流浏览器内核私有属性css前缀是什么？

- mozilla 内核 （firefox,flock 等）    -moz
- webkit  内核 （safari,chrome 等）   -webkit
- opera   内核 （opera 浏览器）        -o
- trident 内核 （ie 浏览器）           -ms



### CSS引入的方式有哪些？使用Link和@import有什么区别？

1. link 属于 XHTML 标签，除了加载 CSS 外，还能用于定义RSS，定义 rel 连接属性等作用，无兼容性，支持使用javascript改变样式；而@import是CSS提供的，只能用于加载CSS，不支持使用 javascript 改变样式；
2. 页面被加载的时，link 会被同时加载，而@import 引用的CSS会等到页面加载完再加载；
3. import是CSS2.1 提出的，CSS2.1以下浏览器不支持，只在IE5以上才能被识别，而link是XHTML标签，无兼容问题。



### 浏览器的渲染原理？

- 首先解析收到的文档，根据文档定义构建一棵 DOM 树，DOM 树是由 DOM 元素及属性节点组成的
- 然后对 CSS 进行解析，生成 CSSOM 规则树。
- 根据 DOM 树和 CSSOM 规则树构建渲染树。渲染树的节点被称为渲染对象，渲染对象是一个包含有颜色和大小等属性的矩形，渲染对象和 DOM 元素相对应，但这种对应关系不是一对一的，不可见的 DOM 元素不会被插入渲染树。还有一些 DOM元素对应几个可见对象，它们一般是一些具有复杂结构的元素，无法用一个矩形来描述。
- 当渲染对象被创建并添加到树中，它们并没有位置和大小，所以当浏览器生成渲染树以后，就会根据渲染树来进行布局（也可以叫做回流）。这一阶段浏览器要做的事情是要弄清楚各个节点在页面中的确切位置和大小。通常这一行为也被称为“自动重排”。
- 布局阶段结束后是绘制阶段，遍历渲染树并调用渲染对象的 paint 方法将它们的内容显示在屏幕上，绘制使用 UI 基础组件。



### 回流和重绘

在讨论回流与重绘之前，我们要知道：

1. 浏览器使用流式布局模型 (Flow Based Layout)。
2. 浏览器会把`HTML`解析成`DOM`，把`CSS`解析成`CSSOM`，`DOM`和`CSSOM`合并就产生了`Render Tree`。
3. 有了`RenderTree`，我们就知道了所有节点的样式，然后计算他们在页面上的大小和位置，最后把节点绘制到页面上。
4. 由于浏览器使用流式布局，对`Render Tree`的计算通常只需要遍历一次就可以完成，但`table`及其内部元素除外，他们可能需要多次计算，通常要花3倍于同等元素的时间，这也是为什么要避免使用`table`布局的原因之一。

#### 回流

当`Render Tree`中部分或全部元素的尺寸、结构、或某些属性发生改变时，浏览器重新渲染部分或全部文档的过程称为**回流**。

会导致回流的操作：

- 页面首次渲染
- 浏览器窗口大小发生改变
- 元素尺寸或位置发生改变
- 元素内容变化（文字数量或图片大小等等）
- 元素字体大小变化
- 添加或者删除**可见**的`DOM`元素
- 激活`CSS`伪类（例如：`:hover`）
- 查询某些属性或调用某些方法

#### 重绘

当页面中元素样式的改变并不影响它在文档流中的位置时（例如：`color`、`background-color`、`visibility`等），浏览器会将新样式赋予给元素并重新绘制它，这个过程称为**重绘**。

#### 浏览器优化

浏览器对回流和重绘做了以下的优化：

浏览器会维护一个队列，把所有引起回流和重绘的操作放入队列中，如果队列中的任务数量或者时间间隔达到一个阈值的，浏览器就会将队列清空，进行一次批处理，这样可以把多次回流和重绘变成一次。

当访问以下属性或方法时，浏览器会立刻清空队列：

- `clientWidth`、`clientHeight`、`clientTop`、`clientLeft`
- `offsetWidth`、`offsetHeight`、`offsetTop`、`offsetLeft`
- `scrollWidth`、`scrollHeight`、`scrollTop`、`scrollLeft`
- `width`、`height`
- `getComputedStyle()`
- `getBoundingClientRect()`

因为队列中可能会有影响到这些属性或方法返回值的操作，即使你希望获取的信息与队列中操作引发的改变无关，浏览器也会强行清空队列，确保你拿到的值是最精确的。



#### 代码优化

**CSS**

- 避免使用`table`布局。
- 尽可能在`DOM`树的最末端改变`class`。
- 避免设置多层内联样式。
- 将动画效果应用到`position`属性为`absolute`或`fixed`的元素上。
- 避免使用`CSS`表达式（例如：`calc()`）。

**JavaScript**

- 避免频繁操作样式，最好一次性重写`style`属性，或者将样式列表定义为`class`并一次性更改`class`属性。
- 避免频繁操作`DOM`，创建一个`documentFragment`，在它上面应用所有`DOM操作`，最后再把它添加到文档中。
- 也可以先为元素设置`display: none`，操作结束后再把它显示出来。因为在`display`属性为`none`的元素上进行的`DOM`操作不会引发回流和重绘。
- 避免频繁读取会引发回流/重绘的属性，如果确实需要多次使用，就用一个变量缓存起来。
- 对具有复杂动画的元素使用绝对定位，使它脱离文档流，否则会引起父元素及后续元素频繁回流。



## CSS预处理器

### 对 CSS 工程化的理解

CSS 工程化是为了解决以下问题：

1. **宏观设计**：CSS 代码如何组织、如何拆分、模块结构怎样设计？
2. **编码优化**：怎样写出更好的 CSS？
3. **构建**：如何处理我的 CSS，才能让它的打包结果最优？
4. **可维护性**：代码写完了，如何最小化它后续的变更成本？如何确保任何一个同事都能轻松接手？

以下三个方向都是时下比较流行的、普适性非常好的 CSS 工程化实践：

- 预处理器：Less、 Sass 等；
- 重要的工程化插件： PostCss；
- Webpack loader 等 。

基于这三个方向，可以衍生出一些具有典型意义的子问题，这里我们逐个来看：

**（1）预处理器：为什么要用预处理器？它的出现是为了解决什么问题？**

预处理器，其实就是 CSS 世界的“轮子”。预处理器支持我们写一种类似 CSS、但实际并不是 CSS 的语言，然后把它编译成 CSS 代码：

![image](https://cdn.nlark.com/yuque/0/2021/jpeg/1500604/1615998492170-c294084b-84d5-4537-87bb-b32da4bf0cd6.jpeg)

那为什么写 CSS 代码写得好好的，偏偏要转去写“类 CSS”呢？这就和本来用 JS 也可以实现所有功能，但最后却写 React 的 jsx 或者 Vue 的模板语法一样——为了爽！要想知道有了预处理器有多爽，首先要知道的是传统 CSS 有多不爽。随着前端业务复杂度的提高，前端工程中对 CSS 提出了以下的诉求：

1. 宏观设计上：我们希望能优化 CSS 文件的目录结构，对现有的 CSS 文件实现复用；
2. 编码优化上：我们希望能写出结构清晰、简明易懂的 CSS，需要它具有一目了然的嵌套层级关系，而不是无差别的一铺到底写法；我们希望它具有变量特征、计算能力、循环能力等等更强的可编程性，这样我们可以少写一些无用的代码；
3. 可维护性上：更强的可编程性意味着更优质的代码结构，实现复用意味着更简单的目录结构和更强的拓展能力，这两点如果能做到，自然会带来更强的可维护性。

这三点是传统 CSS 所做不到的，也正是预处理器所解决掉的问题。预处理器普遍会具备这样的特性：

- 嵌套代码的能力，通过嵌套来反映不同 css 属性之间的层级关系 ；
- 支持定义 css 变量；
- 提供计算函数；
- 允许对代码片段进行 extend 和 mixin；
- 支持循环语句的使用；
- 支持将 CSS 文件模块化，实现复用。

**（2）PostCss：PostCss 是如何工作的？我们在什么场景下会使用 PostCss？**

PostCss 仍然是一个对 CSS 进行解析和处理的工具，它会对 CSS 做这样的事情：

![img](https://cdn.nlark.com/yuque/0/2021/jpeg/1500604/1615998491947-34e3237c-e54f-4b1a-8aeb-3c38655e1cb0.jpeg?x-oss-process=image%2Fresize%2Cw_1038)

它和预处理器的不同就在于，预处理器处理的是 类CSS，而 PostCss 处理的就是 CSS 本身。Babel 可以将高版本的 JS 代码转换为低版本的 JS 代码。PostCss 做的是类似的事情：它可以编译尚未被浏览器广泛支持的先进的 CSS 语法，还可以自动为一些需要额外兼容的语法增加前缀。更强的是，由于 PostCss 有着强大的插件机制，支持各种各样的扩展，极大地强化了 CSS 的能力。

PostCss 在业务中的使用场景非常多：

- 提高 CSS 代码的可读性：PostCss 其实可以做类似预处理器能做的工作；
- 当我们的 CSS 代码需要适配低版本浏览器时，PostCss 的 [Autoprefixer](https://github.com/postcss/autoprefixer) 插件可以帮助我们自动增加浏览器前缀；
- 允许我们编写面向未来的 CSS：PostCss 能够帮助我们编译 CSS next 代码；

**（3）Webpack 能处理 CSS 吗？如何实现？**

Webpack 能处理 CSS 吗：

- **Webpack 在裸奔的状态下，是不能处理 CSS 的**，Webpack 本身是一个面向 JavaScript 且只能处理 JavaScript 代码的模块化打包工具；
- Webpack 在 loader 的辅助下，是可以处理 CSS 的。

如何用 Webpack 实现对 CSS 的处理：

- Webpack 中操作 CSS 需要使用的两个关键的 loader：css-loader 和 style-loader
- 注意，答出“用什么”有时候可能还不够，面试官会怀疑你是不是在背答案，所以你还需要了解每个 loader 都做了什么事情：

- - css-loader：导入 CSS 模块，对 CSS 代码进行编译处理；
  - style-loader：创建style标签，把 CSS 内容写入标签。

在实际使用中，**css-loader 的执行顺序一定要安排在 style-loader 的前面**。因为只有完成了编译过程，才可以对 css 代码进行插入；若提前插入了未编译的代码，那么 webpack 是无法理解这坨东西的，它会无情报错。

### 使用 CSS 预处理的优缺点分别是什么？

优点：

* 提高 CSS 可维护性。
* 易于编写嵌套选择器。
* 引入变量，增添主题功能。可以在不同的项目中共享主题文件。
* 通过混合（Mixins）生成重复的 CSS。
* 将代码分割成多个文件。不进行预处理的 CSS，虽然也可以分割成多个文件，但需要建立多个 HTTP 请求加载这些文件。

缺点：

* 需要预处理工具。
* 重新编译的时间可能会很慢。

### Less

#### 变量

1. **值变量**

   ```less
   /* Less */
   @color: #999;
   @bgColor: skyblue;//不要添加引号
   @width: 50%;
   #wrap {
     color: @color;
     background: @bgColor;
     width: @width;
   }
   
   /* 生成后的 CSS */
   #wrap {
     color: #999;
     background: skyblue;
     width: 50%;
   }
   ```

   以 `@` 开头 定义变量，并且使用时 直接 键入 `@`名称。

   在平时工作中，我们就可以把 常用的变量 封装到一个文件中，这样利于代码组织维护。

   ```less
   @lightPrimaryColor: #c5cae9;
   @textPrimaryColor: #fff;
   @accentColor: rgb(99, 137, 185);
   @primaryTextColor: #646464;
   @secondaryTextColor: #000;
   @dividerColor: #b6b6b6;
   @borderColor: #dadada;
   ```

2. **选择器变量**

   让 选择器 变成 动态

   ```less
   /* Less */
   @mySelector: #wrap;
   @Wrap: wrap;
   @{mySelector}{ //变量名 必须使用大括号包裹
     color: #999;
     width: 50%;
   }
   .@{Wrap}{
     color:#ccc;
   }
   #@{Wrap}{
     color:#666;
   }
   
   /* 生成的 CSS */
   #wrap{
     color: #999;
     width: 50%;
   }
   .wrap{
     color:#ccc;
   }
   #wrap{
     color:#666;
   }
   ```

3. **属性变量**

   可减少代码书写量

   ```less
   /* Less */
   @borderStyle: border-style;
   @Soild:solid;
   #wrap{
     @{borderStyle}: @Soild;//变量名 必须使用大括号包裹
   }
   
   /* 生成的 CSS */
   #wrap{
     border-style:solid;
   }
   ```

4. **url 变量**

   项目结构改变时，修改其变量即可。

   ```less
   /* Less */
   @images: "../img";//需要加引号
   body {
     background: url("@{images}/dog.png");//变量名 必须使用大括号包裹
   }
   
   /* 生成的 CSS */
   body {
     background: url("../img/dog.png");
   }
   ```

5. **声明变量**

   有点类似于 下面的 混合方法

   - 结构: @name: { 属性: 值 ;};
   - 使用：@name();

   ```less
   /* Less */
   @background: {background:red;};
   #main{
       @background();
   }
   @Rules:{
       width: 200px;
       height: 200px;
       border: solid 1px red;
   };
   #con{
     @Rules();
   }
   
   /* 生成的 CSS */
   #main{
     background:red;
   }
   #con{
     width: 200px;
     height: 200px;
     border: solid 1px red;
   }
   ```

6. **变量运算**

   不得不提的是，Less 的变量运算完全超出我的期望，十分强大。

   - 加减法时 以第一个数据的单位为基准
   - 乘除法时 注意单位一定要统一

   ```less
   /* Less */
   @width:300px;
   @color:#222;
   #wrap{
     width:@width-20;
     height:@width-20*5;
     margin:(@width-20)*5;
     color:@color*2;
     background-color:@color + #111;
   }
   
   /* 生成的 CSS */
   #wrap{
     width:280px;
     height:200px;
     margin:1400px;
     color:#444;
     background-color:#333;
   }
   ```

7. **变量作用域**

   一句话理解就是：**就近原则**

   ```less
   /* Less */
   @var: @a;
   @a: 100%;
   #wrap {
     width: @var;
     @a: 9%;
   }
   
   /* 生成的 CSS */
   #wrap {
     width: 9%;
   }
   ```

8. **用变量去定义变量**

   ```less
   /* Less */
   @fnord:  "I am fnord.";
   @var:    "fnord";
   #wrap::after{
     content: @@var; //将@var替换为其值 content:@fnord;
   }
   /* 生成的 CSS */
   #wrap::after{
     content: "I am fnord.";
   }
   ```

#### 嵌套

1. **& 的妙用**

   & ：代表的上一层选择器的名字，此例便是`header`。

   ```less
   /* Less */
   #header{
     &:after{
       content:"Less is more!";
     }
     .title{
       font-weight:bold;
     }
     &_content{//理解方式：直接把 & 替换成 #header
       margin:20px;
     }
   }
   /* 生成的 CSS */
   #header::after{
     content:"Less is more!";
   }
   #header .title{ //嵌套了
     font-weight:bold;
   }
   #header_content{//没有嵌套！
       margin:20px;
   }
   ```

2. **媒体查询**

   在以往的工作中，我们使用 媒体查询，都要把一个元素 分开写

   ```less
   #wrap{
     width:500px;
   }
   @media screen and (max-width:768px){
     #wrap{
       width:100px;
     }
   }
   ```

   Less 提供了一个十分便捷的方式

   ```less
   /* Less */
   #main{
       //something...
   
       @media screen{
           @media (max-width:768px){
             width:100px;
           }
       }
       @media tv {
         width:2000px;
       }
   }
   /* 生成的 CSS */
   @media screen and (max-width:768px){
     #main{
         width:100px; 
     }
   }
   @media tv{
     #main{
       width:2000px;
     }
   }
   ```

   唯一的缺点就是 每一个元素都会编译出自己 `@media` 声明，并不会合并。

3. **实战技巧**

   可以借助 Less 在元素中，去定义自己的私有样式。

   ```less
   /* Less */
   #main{
     // something..
     &.show{
       display:block;
     }
   }
   .show{
     display:none;
   }
   ```

   ```less
   const main = document.getElementById("main");
   main.classList.add("show");
   ```

   结果：

   ```less
   #main.show{
     display:block;
   }
   .show{
     display:none; //会被覆盖。
   }
   ```

#### 混合方法

1. **无参数方法**

   方法犹如 声明的集合，使用时 直接键入名称即可。

   ```less
   /* Less */
   .card { // 等价于 .card()
       background: #f6f6f6;
       -webkit-box-shadow: 0 1px 2px rgba(151, 151, 151, .58);
       box-shadow: 0 1px 2px rgba(151, 151, 151, .58);
   }
   #wrap{
     .card;//等价于.card();
   }
   /* 生成的 CSS */
   #wrap{
     background: #f6f6f6;
     -webkit-box-shadow: 0 1px 2px rgba(151, 151, 151, .58);
     box-shadow: 0 1px 2px rgba(151, 151, 151, .58);
   }
   ```

   其中 `.card` 与 `.card()` 是等价的。 个人建议，为了避免 代码混淆，应写成 :

   ```less
   .card(){
     //something...
   }
   #wrap{
     .card();
   }
   ```

   要点：

   - `.` 与 `#` 皆可作为 方法前缀。
   - 方法后写不写 `()` 看个人习惯。

2. **默认参数方法**

   - Less 可以使用默认参数，如果 没有传参数，那么将使用默认参数。
   - `@arguments` 犹如 JS 中的 `arguments` 指代的是 全部参数。
   - 传的参数中 必须带着单位。

   ```less
   /* Less */
   .border(@a:10px,@b:50px,@c:30px,@color:#000){
       border:solid 1px @color;
       box-shadow: @arguments;//指代的是 全部参数
   }
   #main{
       .border(0px,5px,30px,red);//必须带着单位
   }
   #wrap{
       .border(0px);
   }
   #content{
     .border;//等价于 .border()
   }
   
   /* 生成的 CSS */
   #main{
       border:solid 1px red;
       box-shadow:0px,5px,30px,red;
   }
   #wrap{
       border:solid 1px #000;
       box-shadow: 0px 50px 30px #000;
   }
   #content{
       border:solid 1px #000;
       box-shadow: 10px 50px 30px #000;
   }
   ```

3. **方法的匹配模式**

   与 面向对象中的多态 很相似

   ```less
   /* Less */
   .triangle(top,@width:20px,@color:#000){
       border-color:transparent  transparent @color transparent ;
   }
   .triangle(right,@width:20px,@color:#000){
       border-color:transparent @color transparent  transparent ;
   }
   
   .triangle(bottom,@width:20px,@color:#000){
       border-color:@color transparent  transparent  transparent ;
   }
   .triangle(left,@width:20px,@color:#000){
       border-color:transparent  transparent  transparent @color;
   }
   .triangle(@_,@width:20px,@color:#000){
       border-style: solid;
       border-width: @width;
   }
   #main{
       .triangle(left, 50px, #999)
   }
   /* 生成的 CSS */
   #main{
     border-color:transparent  transparent  transparent #999;
     border-style: solid;
     border-width: 50px;
   }
   ```

   要点

   - 第一个参数 `left` 要会找到方法中匹配程度最高的，如果匹配程度相同，将全部选择，并存在着样式覆盖替换。
   - 如果匹配的参数 是变量，则将会匹配，如 `@_` 。

4. **方法的命名空间**

   让方法更加规范

   ```less
   /* Less */
   #card(){
       background: #723232;
       .d(@w:300px){
           width: @w;
           
           #a(@h:300px){
               height: @h;//可以使用上一层传进来的方法
           }
       }
   }
   #wrap{
       #card > .d > #a(100px); // 父元素不能加 括号
   }
   #main{
       #card .d();
   }
   #con{
       //不得单独使用命名空间的方法
       //.d() 如果前面没有引入命名空间 #card ，将会报错
       
       #card; // 等价于 #card();
       .d(20px); //必须先引入 #card
   }
   /* 生成的 CSS */
   #wrap{
     height:100px;
   }
   #main{
     width:300px;
   }
   #con{
     width:20px;
   }
   ```

   要点

   - 在 CSS 中`>` 选择器，选择的是 儿子元素，就是 必须与父元素 有直接血源的元素。
   - 在引入命令空间时，如使用 `>` 选择器，父元素不能加 括号。
   - 不得单独使用命名空间的方法 必须先引入命名空间，才能使用 其中方法。
   - 子方法 可以使用上一层传进来的方法

5. **方法的条件筛选**

   Less 没有 if else，可是它有 `when`

   ```less
   /* Less */
   #card{
       
       // and 运算符 ，相当于 与运算 &&，必须条件全部符合才会执行
       .border(@width,@color,@style) when (@width>100px) and(@color=#999){
           border:@style @color @width;
       }
   
       // not 运算符，相当于 非运算 !，条件为 不符合才会执行
       .background(@color) when not (@color>=#222){
           background:@color;
       }
   
       // , 逗号分隔符：相当于 或运算 ||，只要有一个符合条件就会执行
       .font(@size:20px) when (@size>50px) , (@size<100px){
           font-size: @size;
       }
   }
   #main{
       #card>.border(200px,#999,solid);
       #card .background(#111);
       #card > .font(40px);
   }
   /* 生成后的 CSS */
   #main{
     border:solid #999 200px;
     background:#111;
     font-size:40px;
   }
   ```

   要点

   - 比较运算有： > >= = =< <。
   - = 代表的是等于
   - 除去关键字 true 以外的值都被视为 false：

1. **数量不定的参数**

   如果你希望你的方法接受数量不定的参数，你可以使用... ，犹如 ES6 的扩展运算符。

   ```less
   /* Less */
   .boxShadow(...){
       box-shadow: @arguments;
   }
   .textShadow(@a,...){
       text-shadow: @arguments;
   }
   #main{
       .boxShadow(1px,4px,30px,red);
       .textShadow(1px,4px,30px,red);
   }
   
   /* 生成后的 CSS */
   #main{
     box-shadow: 1px 4px 30px red;
     text-shadow: 1px 4px 30px red;
   }
   ```

2. **方法使用important！**

   使用方法 非常简单，在方法名后 加上关键字即可。

   ```less
   /* Less */
   .border{
       border: solid 1px red;
       margin: 50px;
   }
   #main{
       .border() !important;
   }
   /* 生成后的 CSS */
   #main {
       border: solid 1px red !important;
       margin: 50px !important;
   }
   ```

3. **循环方法**

   Less 并没有提供 for 循环功能，但这也难不倒 聪明的程序员，使用递归去实现。 下面是官网中的一个 Demo，模拟了生成栅格系统。

   ```less
   /* Less */
   .generate-columns(4);
   
   .generate-columns(@n, @i: 1) when (@i =< @n) {
     .column-@{i} {
       width: (@i * 100% / @n);
     }
     .generate-columns(@n, (@i + 1));
   }
   /* 生成后的 CSS */
   .column-1 {
     width: 25%;
   }
   .column-2 {
     width: 50%;
   }
   .column-3 {
     width: 75%;
   }
   .column-4 {
     width: 100%;
   }
   ```

4. **属性拼接方法**

   `+_` 代表的是 空格；`+` 代表的是 逗号。

   - 逗号

   ```less
   /* Less */
   .boxShadow() {
       box-shadow+: inset 0 0 10px #555;
   }
   .main {
     .boxShadow();
     box-shadow+: 0 0 20px black;
   }
   /* 生成后的 CSS */
   .main {
     box-shadow: inset 0 0 10px #555, 0 0 20px black;
   }
   ```

   - 空格

   ```less
   /* Less */
   .Animation() {
     transform+_: scale(2);
   }
   .main {
     .Animation();
     transform+_: rotate(15deg);
   }
   
   /* 生成的 CSS */
   .main {
     transform: scale(2) rotate(15deg);
   }
   ```

5. **实战技巧**

   下面是官网中的一个非常赞的 Demo

   ```less
   /* Less */
   .average(@x, @y) {
     @average: ((@x + @y) / 2);
   }
   
   div {
     .average(16px, 50px); // 调用 方法
     padding: @average;    // 使用返回值
   }
   
   /* 生成的 CSS */
   div {
     padding: 33px;
   }
   ```

可以说 Less 是一门优雅编程语言。

#### 继承

extend 是 Less 的一个伪类。它可继承 所匹配声明中的全部样式。

1. **extend 关键字的使用**

   ```less
   /* Less */
   .animation{
       transition: all .3s ease-out;
       .hide{
         transform:scale(0);
       }
   }
   #main{
       &:extend(.animation);
   }
   #con{
       &:extend(.animation .hide);
   }
   
   /* 生成后的 CSS */
   .animation,#main{
     transition: all .3s ease-out;
   }
   .animation .hide , #con{
       transform:scale(0);
   }
   ```

2. **all 全局搜索替换**

   使用选择器匹配到的 全部声明。

   ```less
   /* Less */
   #main{
     width: 200px;
   }
   #main {
     &:after {
       content:"Less is good!";
     }
   }
   #wrap:extend(#main all) {}
   
   /* 生成的 CSS */
   #main,#wrap{
     width: 200px;
   }
   #main:after, #wrap:after {
       content: "Less is good!";
   }
   ```

3. **减少代码的重复性**

   从表面 看来，extend 与 方法 最大的差别，就是 extend 是同个选择器共用同一个声明，而 方法 是使用自己的声明，这无疑 增加了代码的重复性。

   方法示例 与上面的 extend 进行对比：

   ```less
   /* Less */
   .Method{
     width: 200px;
     &:after {
         content:"Less is good!";
     }
   }
   #main{
     .Method;
   }
   #wrap{
     .Method;
   }
   
   /* 生成的 CSS */
   #main{
     width: 200px;
     &:after{
       content:"Less is good!";
     }  
   }
   #wrap{
     width: 200px;
     &:after{
       content:"Less is good!";
     }  
   }
   ```

4. **要点**

   *翻译官网*

   - 选择器和扩展之间 是允许有空格的：pre:hover :extend(div pre).
   - 可以有多个扩展: pre:hover:extend(div pre):extend(.bucket tr) - 注意这与 pre:hover:extend(div pre, .bucket tr)一样。
   - 这是不可以的，扩展必须在最后 : pre:hover:extend(div pre).nth-child(odd)。
   - 如果一个规则集包含多个选择器，所有选择器都可以使用extend关键字。

   ### 导入

   1. 导入 less 文件 可省略后缀

   ```less
   import "main"; 
   //等价于
   import "main.less";
   ```

   1. `@import` 的位置可随意放置

   ```less
   #main{
     font-size:15px;
   }
   @import "style";
   ```

5. **reference**

   Less 中 最强大的特性 使用 引入的 Less 文件，但不会 编译它。

   ```less
   /* Less */
   @import (reference) "bootstrap.less"; 
   
   #wrap:extend(.navbar all){}
   ```

   翻译官网：

   > 使用@import (reference)导入外部文件，但不会添加 把导入的文件 编译到最终输出中，只引用。

6. **once**

   > @import语句的默认行为。这表明相同的文件只会被导入一次，而随后的导入文件的重复代码都不会解析。

   ```less
   @import (once) "foo.less";
   @import (once) "foo.less"; // this statement will be ignored
   
   ```

7. **multiple**

   > 使用@import (multiple)允许导入多个同名文件。

   ```less
   /* Less */
   
   // file: foo.less
   .a {
     color: green;
   }
   // file: main.less
   @import (multiple) "foo.less";
   @import (multiple) "foo.less";
   
   /* 生成后的 CSS */
   .a {
     color: green;
   }
   .a {
     color: green;
   }
   ```

#### 函数

1. **判断类型**

   - isnumber

   > 判断给定的值 是否 是一个数字。

   ```less
   isnumber(#ff0);     // false
   isnumber(blue);     // false
   isnumber("string"); // false
   isnumber(1234);     // true
   isnumber(56px);     // true
   isnumber(7.8%);     // true
   isnumber(keyword);  // false
   isnumber(url(...)); // false
   ```

   - iscolor

   > 判断给定的值 是否 是一个颜色。

   - isurl

   > 判断给定的值 是否 是一个 url 。

2. **颜色操作**

   - saturate

   > 增加一定数值的颜色饱和度。

   - lighten

   > 增加一定数值的颜色亮度。

   - darken

   > 降低一定数值的颜色亮度。

   - fade

   > 给颜色设定一定数值的透明度。

   - mix

   > 根据比例混合两种颜色。

3. **数学函数**

   - ceil

   > 向上取整。

   - floor

   > 向下取整。

   - percentage

   > 将浮点数转换为百分比字符串。

   - round

   > 四舍五入。

   - sqrt

   > 计算一个数的平方根。

   - abs

   > 计算数字的绝对值，原样保持单位。

   - pow

   > 计算一个数的乘方。

#### 其他

1. **注释**

   - /* */ CSS原生注释，会被编译在 CSS 文件中。
   - /  / Less提供的一种注释，不会被编译在 CSS 文件中。

2. **避免编译**

   ```less
   /* Less */
   #main{
     width:~'calc(300px-30px)';
   }
   
   /* 生成后的 CSS */
   #main{
     width:calc(300px-30px);
   }
   ```

   结构： `~' 值 '`

3. **变量拼串**

   在平时工作中，这种需求 太常见了。 在下面例子中， 实现了不同的 transtion-delay、animation、@keyframes

   ```less
   .judge(@i) when(@i=1){
     @size:15px;
   }
   .judge(@i) when(@i>1){
     @size:16px;
   }
   .loopAnimation(@i) when (@i<16) {
     
     .circle:nth-child(@{i}){
         .judeg(@i);
         border-radius:@size @size 0 0;
         animation: ~"circle-@{i}" @duration infinite @ease;
         transition-delay:~"@{i}ms";
     }
     @keyframes ~"circle-@{i}" {
         // do something...
     }
     .loopAnimation(@i + 1);
   }
   ```

   结构： `~"字符@{变量}字符"`;

4. **使用 JS**

   因为 Less 是由 JS 编写，所以 Less 有一得天独厚的特性：代码中使用 Javascript 。

   ```less
   /* Less */
   @content:`"aaa".toUpperCase()`;
   #randomColor{
     @randomColor: ~"rgb(`Math.round(Math.random() * 256)`,`Math.round(Math.random() * 256)`,`Math.round(Math.random() * 256)`)";
   }
   #wrap{
     width: ~"`Math.round(Math.random() * 100)`px";
     &:after{
         content:@content;
     }
     height: ~"`window.innerHeight`px";
     alert:~"`alert(1)`";
     #randomColor();
     background-color: @randomColor;
   }
   /* 生成后的 CSS */
   
   // 弹出 1
   #wrap{
     width: 随机值（0~100）px;
     height: 743px;//由电脑而异
     background: 随机颜色;
   }
   #wrap::after{
     content:"AAA";
   }
   ```
