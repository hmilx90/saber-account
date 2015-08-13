/**
 * @file main
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var Resolver = require('saber-promise');
    var configMgr = require('./config');

    function isString(value) {
        return Object.prototype.toString.call(value)
            === '[object String]';
    }

    /**
     * 异步创建Presenter
     *
     * @inner
     * @param {string} moduleId 模块ID
     * @return {Promise}
     */
    function createAsync(moduleId) {
        var resolver = new Resolver();

        window.require([moduleId], function (config) {
            create(config).then(function (action) {
                resolver.resolve(action);
            });
        });

        return resolver.promise();
    }

    /**
     * 创建Presenter
     *
     * @inner
     * @param {Object|string} config 配置信息
     * @return {Promise}
     */
    function create(config) {
        if (isString(config)) {
            return createAsync(config);
        }

        var Constructor;
        config = configMgr.normal(config);

        if (config.constructor !== Object) {
            Constructor = config.constructor;
        }
        else {
            Constructor = require('./Presenter');
        }

        return Resolver.resolved(new Constructor(config));
    }

    var exports = {};

    /**
     * 配置
     *
     * @param {Object} options 配置信息
     * @param {string|Array.<string>=} options.template 公共模版
     * @param {Object=} options.templateConfig 模版配置信息
     * @param {Object=} options.router 路由器
     */
    exports.config = function (options) {
        configMgr.set(options);
    };

    /**
     * 创建Presenter
     *
     * @public
     * @param {Object|string} config
     * @return {Promise}
     */
    exports.create = create;

    exports.Abstract = require('./Abstract');

    exports.Presenter = require('./Presenter');

    exports.Model = require('./Model');

    exports.View = require('./View');

    return exports;
});
