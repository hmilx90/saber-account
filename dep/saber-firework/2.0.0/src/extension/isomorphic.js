/**
 * @file 同构扩展
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {
    var globalConfig = require('../config');

    // 启动首评渲染
    globalConfig.isomorphic = true;

    // 设置路由器
    var router = require('saber-router');
    router.controller(require('saber-router/controller/popstate'));
    globalConfig.router = router;
});
