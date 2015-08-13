saber-ajax
===

![Bower version](https://img.shields.io/bower/v/saber-ajax.svg?style=flat-square) [![NPM version](https://img.shields.io/npm/v/saber-ajax.svg?style=flat-square)](https://npmjs.org/package/saber-ajax) [![Build Status](https://img.shields.io/travis/ecomfe/saber-ajax.svg?style=flat-square)](https://travis-ci.org/ecomfe/saber-ajax) [![License](https://img.shields.io/npm/l/saber-ajax.svg?style=flat-square)](./LICENSE) [![EFE Mobile Team](https://img.shields.io/badge/EFE-Mobile_Team-blue.svg?style=flat-square)](http://efe.baidu.com)

适用于移动端、[Promise](https://github.com/ecomfe/saber-promise) 风格的 ajax 封装，支持 [XMLHttpRequest2](http://www.w3.org/TR/XMLHttpRequest2/)，兼容 node 环境

<del>以<a href="http://baike.baidu.com/view/8420590.htm" target="_blank">吾王</a>之名~</del>

## Installation

通过 [edp](https://github.com/ecomfe/edp) 引入模块：

```sh
$ edp import saber-ajax
```

或者在 node 环境下使用 `npm` 引入模块：

```sh
$ npm install saber-ajax --save
```

## Usage

```js
var ajax = require('saber-ajax');

var request = ajax.get(url);

request.then(
    // 请求完成
    // data为responseText
    function (data) {
        renderData(data);
    },

    // 请求失败
    // error参数可能为以下四种情况
    // * 请求超时: 'timeout'
    // * 请求中止: 'abort'
    // * 未知错误: 'error'
    // * 其它情况: HTTP Status Code
    function (error) {
        showError(error);
    }
);

// 支持 ejson 格式的异步交互
ajax = require('saber-ajax').ejson;
```

## API

* [Methods](#methods)
* [Events](#events)
* [Classes](#classes)

### Methods

#### get(url[, query])

发起异步GET请求

* **url** `{string}` 请求地址
* **query** `{Object=}` 查询条件，会自动进行 `encodeURIComponent` 处理
* _return_ `{Requester}` 请求对象 [Requester](doc/requester.md)

#### post(url[, data])

发起异步POST请求

* **url** `{string}` 请求地址
* **data** `{Object|string=}` 请求数据，可选。使用 `{Object}` 类型时请注意：暂时只支持单一层级序列化，不支持多层级（比如 `{date: {begin: '2012', end: '2013'}}` ）
* _return_ `{Requester}` 请求对象 [Requester](doc/requester.md)

#### request(url[, options])

发起请求，如果不做设置默认为 `GET` 异步请求

* **url** `{string}` 请求地址
* **options** `{Object=}` 配置参数
    * **method** `{string=}` 请求方式，默认为 `'GET'`
    * **data** `{string|Object=}` 请求参数，支持 [FormData](http://www.w3.org/TR/XMLHttpRequest2/#interface-formdata)
    * **stringify** `{boolean=}` 是否自动序列化请求参数，默认为 `true`
    * **async** `{boolean=}` 是否异步请求，默认为 `true`，出于用户体验的考虑新版的浏览器在主线程中都不再支持发起同步请求，请慎重使用此参数
    * **headers** `{Object=}` 需要额外设置的请求头
    * **timeout** `{number=)` 请求超时时间，单位ms，**注意** 只有异步请求才有效
    * **username** `{string=}` 用户名
    * **password** `{string=}` 密码
    * **responseType** `{string=}` 返回的 [数据类型](http://www.w3.org/TR/XMLHttpRequest2/#xmlhttprequestresponsetype)，默认为空。`text` 与 `arraybuffer` 各浏览器的支持力度较好，其它选项使用前请多多思量~

#### config(options)

全局配置

* **options** `{Object}` 配置项
    * **host** `{string=}` host，默认为空
    * **prefix** `{string=}` 请求路径前缀，默认为空
    * **headers** `{Object=}` 请求头信息，默认为空
    * **agent** `{Object=}` 请求管理对象配置信息，只针对 node 平台配置有效，具体配置项请参考 [http.Agent 的初始化说明](https://nodejs.org/api/http.html#http_new_agent_options)

#### on(event, fn)

注册全局事件

* **event** `{string}` 事件名称，具体支持的事件[请参照事件说明](#events)
* **fn** `{Function}` 事件处理函数

可以通过注册全局事件配合 [requester.handleFail](#handlefail) 来提供默认的请求失败处理，比如：

```js
var ajax = require('saber-ajax');

// 注册全局失败事件
ajax.on('fail', function (req, error) {
    // 如果当前的失败请求没有被处理过
    // 则显示默认的错误提示
    if (!req.handleFail) {
        alert('亲~请求失败啦');
    }
});
```

### Events

#### success

全局请求成功事件，任意请求成功时触发

* **req** `{Requester}` 请求对象 [Requester](doc/requester.md)
* **data** `{*}` 请求返回的内容

#### fail

全局请求失败事件，任意请求失败时触发

* **req** `{Requester}` 请求对象 [Requester](doc/requester.md)
* **error** `{*}` 错误信息（参考 [request.then](#then-onfulfill-onreject-) 关于错误信息的描述）

### Classes

 * [Requester](doc/requester.md) 请求对象，`ajax.get`，`ajax.post`，`ajax.request` 等方法的返回参数，对异步请求对象的封装，实现了 [Promise](https://github.com/ecomfe/saber-promise) 接口
