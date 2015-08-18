/**
 * @file app
 * @author cuiyongjian(cuiyongjian@outlook.com)
 */

define(function (require) {

    var Resolver = require('saber-promise');
    var firework = require('saber-firework');
    var config = require('../config/app');
    
    // FIXME
    // Only For Debug
    // 关闭Promise的异常捕获，方便调试
    Resolver.disableExceptionCapture();

    // saber-firework全局配置信息
    var config = {
            // 配置index文件名称
            index: 'index',

            // 加载全局模板
            template: require('./common/common.tpl'),

            // 设置 View 基类
            View: require('./common/View'),

            templateData: {
                config: {
                    version: config.version
                }
            }

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
