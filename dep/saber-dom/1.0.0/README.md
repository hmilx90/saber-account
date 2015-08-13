saber-dom [![Build Status](https://travis-ci.org/ecomfe/saber-dom.png)](https://travis-ci.org/ecomfe/saber-dom)
===

一个适用于移动端，静态函数风格的DOM工具库。

## Installation

通过 [edp](https://github.com/ecomfe/edp) 引入模块：

```sh
edp import saber-dom
```

## Usage

```js
var dom = require('saber-dom');

var el = dom.g('element-id');
var title = dom.query('.element-class');
var list = dom.queryAll('.list-item');

dom.addClass(el, 'el-class-name');
```

## API

* [selector](./doc/selector.md)
* [css](./doc/css.md)
* [traversal](./doc/traversal.md)
* [data](./doc/data.md)
