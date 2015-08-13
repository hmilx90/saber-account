/**
 * @file app
 */

define(function (require) {
    var Resolver = require('saber-promise');
    var firework = require('saber-firework');
    var router = require('saber-router');
    router.controller(require('saber-router/controller/popstate'));

    Resolver.disableExceptionCapture();

    firework.load({path: '/demo/router/index.html', action: require('./index')});
    firework.load({path: '/demo/router/detail.html', action: require('./detail')});

    // 使用自定义的router
    firework.start('viewport', {router: router});
});
