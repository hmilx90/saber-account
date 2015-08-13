#2.1.0 / 2015-07-15

* node 平台下不再默认开启 `keepAlive`
* [config](./README.md#configoptions) 方法，增加配置项 `agent`，针对 node 平台的请求管理对象配置

#2.0.0 / 2015-06-18

* 同构化，兼容 node 环境
* 增加 [config](./README.md#configoptions) 方法，可以进行全局配置

#1.0.0 / 2014-11-03

* 稳定API，发布`1.0.0`

#0.1.6 / 2014-09-23

* 使用`FormData`进行`POST`提交时不默认设置`Content-Type`

#0.1.5 / 2014-06-25

* `.get()`方法添加可选的第二个参数`query`，支持添加对象(`Object`)类型的查询条件，会自动完成URL参数序列化的操作
* `E-JSON`处理模块同样添加了全局事件
* 修正`POST`操作时不能正常序列化数组参数的问题

#0.1.3 / 2014-04-29

* 更新依赖

#0.1.2 / 2014-04-02

* `POST`请求增加默认的`Content-Type:application/x-www-form-urlencoded`
* 更新依赖
