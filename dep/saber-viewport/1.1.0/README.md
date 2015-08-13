saber-viewport
===

移动端页面视口管理，提供页面转场功能

## Installation

通过 [edp](https://github.com/ecomfe/edp) 引入模块：

```sh
edp import saber-viewport
```

## Usage

```js
var viewport = require('saber-viewport');
var page;

// 引入转场效果
require('saber-viewport/transition/fadeInOut');

// 初始化视口
viewport.init('viewport');

// 加载页面
page = viewport.load(url);

// 渲染页面
...

// 使用淡入淡出效果转场页面
page.enter('fadeInOut');
```

### About Bar

移动页面顶部或者底部一般都有navigation bar、toolbar之类的，这些部件在页面转场时通常不变化或者特殊变化，通过添加`data-viewport-bar`与`data-name`自定义dom属性来支持。

比如现在有三个页面A、B、C，顶部都有navigation bar，前两页面bar样式相同，最后一个页面为详情页面，bar上添加了“返回”按钮，大体就如下这般：

```html
<!-- page A -->
<body>
    <div class="nav" data-viewport-bar="navigation" data-name="main">
        ...
    </div>
</body>

<!-- page B -->
<body>
    <div class="nav" data-viewport-bar="navigation" data-name="main">
        ...
    </div>
</body>

<!-- page C -->
<body>
    <div class="nav" data-viewport-bar="navigation" data-name="detail">
        ...
        <a>返回</a>
    </div>
</body>
```

通过`data-viewport-bar`分类页面中不同类型的bar，bar的转场切换只会在同类tab之间进行。`data-name`表示bar的名称，名称相同的bar转场时不会有变化，而类型相同名称不同的bar之前会有转场效果。

示例中从A切换到B时顶部导航条不会有变化（`data-name`相同），而从B切换到C时顶部导航条会进行转场效果（`data-name`不同）。

__注__：`saber-viewport`并不控制bar在页面中的位置、样式，这些还是由页面控制。

### About Fixed

转场操作时`position:fixed`的元素会影响转场效果（特别是在使用`transform`进行转场时，参考[webkit-css-transform3d-position-fixed-issue](http://stackoverflow.com/questions/15194313/webkit-css-transform3d-position-fixed-issue), [The Transform Rendering Model](http://www.w3.org/TR/css3-transforms/#transform-rendering)），`saber-viewport`支持使用`data-viewport-fixed`标注`fixed`元素，在转场时进行自动处理，比如：

```html
<div class="search" data-viewport-fixed><input type="text"><a class="search-btn">Search</a></div>
```

已经被`data-viewport-bar`标记的`fixed`元素不再需要重复标记`data-viewport-fixed`


## API

* [Methods](#methods)
* [Classes](#classes)

### Methods

#### init(ele[, options])

初始化视口

* **ele** `{HTMLElement}` 视图主元素或者元素id
* **options** `{Object=}` 全局配置参数
    * **transition** `{boolean|string=}` 转场效果，`boolean`参数表示是否启用转场效果，`string`参数表示具体的转场效果，目前支持`slide`滑动转场，`fadeInOut`淡入淡出转场，默认为`true`，表示启动转场效果，但不指定默认的转场效果
    * **duration** `{number=}` 转场动画时长，单位为秒，默认为`0.3`
    * **timing** `{string=}` 转场缓动效果，取值请参考CSS3中的[transition-timing-function](http://www.w3.org/TR/css3-transitions/#transition-timing-function-property)，默认为`'ease'`
    * **transform** `{boolean=}` 是否使用[css transform](http://www.w3.org/TR/css-transforms/)进行转场设置，默认为`true`
    * **mask** `{boolean=}` 转场动画进行时使用全局遮罩浮层，防止由于页面操作意外终止转场动画，默认为`true`
    * **resetScroll** `{boolean=}` 转场是否启用页面scroll修正，默认为`true`

#### load(url[, options])

创建新页面的容器，返回[Page](doc/page.md)对象。页面的具体渲染需要通过`Page.main`属性获取容器元素后自行完成

* **url** `{string}` 页面的URL，用于页面标示
* **options** `{Object=}` 选项参数
    * **cache** `{boolean=}` 是否缓存page 默认`false`
    * **noCache** `{boolean=}` 是否不启用缓存 默认`false`
* _return_ `{Page}` [Page](doc/page.md)对象

#### front(url[, options])

初始化首屏页面，如果初始化成功则返回[Page](doc/page.md)对象，否则返回`undefined`

* **url** `{string}` 页面的URL，用于页面标示
* **options** `{Object=}` 选项参数
    * **cache** `{boolean=}` 是否缓存page 默认`false`
* _return_ `{?Page}` [Page](doc/page.md)对象

### Classes

* [Page](doc/page.md) 页面对象
