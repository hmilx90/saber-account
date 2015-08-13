/**
 * @file app
 * @author ()
 */

define(function (require) {

    var Resolver = require('saber-promise');
    var firework = require('saber-firework');

    // FIXME
    // Only For Debug
    // 关闭Promise的异常捕获，方便调试
    Resolver.disableExceptionCapture();

    // saber-firework全局配置信息
    var config = {
            // 配置index文件名称
            index: 'index'
        };

    // 加载路由配置
    firework.load(require('./config'));

    return {
        init: function () {
            // 启动应用
            firework.start('viewport', config);
        }
    };

});
