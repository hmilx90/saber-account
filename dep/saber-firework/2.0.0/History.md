# 2.0.0 / 2015-06-18

* 首屏页面支持 server 渲染，与 [rebas](https://github.com/ecomfe/rebas) 配合提供全新的同构体验～
* 拆分 `MVP` 的实现为独立的模块：[saber-mm](https://github.com/ecomfe/saber-mm)

# 1.0.0 / 2014-11-03

* 全局事件增加了`route`路由信息
* 支持Action的异步加载，具体请参考[路由配置信息](doc/route.md)
* 增加[delCachedAction()](README.md#delcachedactionpath)方法，用于清除缓存的Action
* `Action`添加了`refresh`流程，该流程是默认关闭的，启用后在只改变页面`query`的情况下会走页面的`refresh`流程
* `View`提供[afterrender](doc/view.md#afterrender)事件，方便在渲染结束后根据渲染参数进行些其它操作
* `View`添加[redirect](doc/view.md#redirecturl-query-options)方法，方便页面处理
* `redirect`支持的静默跳转，可以在不改变当前URL的情况下切换页面
* `etpl`升级至[3.0.0](https://github.com/ecomfe/etpl#documents)
* 出于消除重复历史记录的考虑，`filter`取消了`stop`参数，`action`的`leave`与`sleep`方法也不再提供能阻止页面离开的参数

# 0.4.2 / 2014-10-08

* 修复下一个页面加载失败可能导致当前页面不可用的问题

# 0.4.1 / 2014-07-01

* 修正单次禁用`action`缓存不彻底的问题

# 0.4.0 / 2014-06-26

* 添加`filter`功能，代码统计、权限验证神马的轻松搞定，欲知详情挫[这里](README.md#addfilterurl-fn)
* 添加全局的`beforetransition`事件，方便在页面开始加载后、转场动画开始前干些事儿
* 添加全局的`error`事件，页面加载失败时触发
* ~~在`action`的`leave`与`sleep`事件中可以通过新增的函数参数（`stop`）来阻止页面的切换，[示例在这里](doc/action.md#%E4%BA%8B%E4%BB%B6)~~
* 考虑网络情况，调整默认的页面加载超时时间为`1000`毫秒
* 更新依赖（[saber-router@0.2.4](https://github.com/ecomfe/saber-router/blob/develop/History.md#024--2014-06-25), [saber-viewport@0.2.11](https://github.com/ecomfe/saber-viewport/blob/develop/History.md#0211--2014-06-25), [saber-widget@0.3.0](https://github.com/ecomfe/saber-widget/blob/develop/History.md#030--2014-06-24)）

# 0.3.2 / 2014-06-24

* 支持单次`redirect`禁用`action`的缓存，详情请参考[action.redirect](doc/action.md#redirecturl-query-options)
* 更新依赖（[saber-router@0.2.3](https://github.com/ecomfe/saber-router/blob/master/History.md#023--2014-06-23), [saber-viewport@0.2.10](https://github.com/ecomfe/saber-viewport/blob/master/History.md#0210--2014-06-23), [saber-widget@0.2.3](https://github.com/ecomfe/saber-widget/blob/master/History.md#023--2014-06-23)）
* 修正转场动画进行同时时页面切换带来的问题

# 0.3.0 / 2014-06-16

* 添加`saber-widget`支持，各种`widget`放心用，清理工作框架会搞定
* 添加`addDomEvent`与`removeDomEvent`方法，替换原有的`attachEvent`与`detachEvent`，优化了事件处理函数的参数与`this`指针，具体请参考[文档](doc/view.md)
* 全局的`beforeload`与`afterload`事件调整事件参数，能获取到`action`对象，具体请参考[文档](README.md)

# 0.2.6 / 2014-04-30

* 更新依赖

# 0.2.4 / 2014-04-26

* `view`的`templateMainTarget`成为可选属性，模版引擎使用多例，不用关心模版`target`重复的问题
* 添加`index`与`path`全局配置，分别表示默认的`index`文件名称与默认路径
* 添加`constructor`属性支持，`action`、`view`与`model`可以更改实例继承关系
* 更新依赖(`saber-router`，`saber-lang`)

# 0.2.1 / 2014-04-20

* 更新依赖`saber-viewport`至`0.2.8`
* 添加全局配置项`timeout`，表示`Action`加载超时时间，如果超时则可以响应其它`Action`的切换请求，默认为`300ms`

# 0.2.0 / 2014-04-18

* 重构，开发更加便利，API已完全调整，详情请参考文档
