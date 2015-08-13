/**
 * @file Node env
 * @author treelite(c.xinle@gmail.com)
 */

var Resolver = require('saber-promise');
var configMgr = require('./lib/config');
var path = require('path');

var Presenter = require('./lib/Presenter');

/**
 * 字符串判断
 *
 * @inner
 * @param {*} value 变量
 * @return {boolean}
 */
function isString(value) {
    return Object.prototype.toString.call(value)
        === '[object String]';
}

/**
 * Presenter 配置文件缓存
 *
 * @type {Object}
 */
var configCaches = {};

/**
 * 加载 Presenter 配置文件
 *
 * @param {string} name 配置文件地址
 * @return {Object}
 */
function loadConfig(name) {
    var config = configCaches[name];

    if (!config) {
        var base = configMgr.get('basePath') || process.cwd();
        var file = path.resolve(base, name);
        config = require(file);
        configCaches[name] = config;
    }

    return config;
}

/**
 * 全局配置
 *
 * @param {Object} options 配置信息
 * @param {string|Array.<string>=} options.template 公共模版
 * @param {Object=} options.templateConfig 模版配置信息
 * @param {Object=} options.templateData 公共静态模版数据
 * @param {Object=} options.router 路由器
 * @param {string=} options.basePath 动态加载Presenter的根路径
 */
exports.config = function (options) {
    configMgr.set(options);
};

/**
 * 创建Presenter
 *
 * @inner
 * @param {Object|string} config 配置信息
 * @return {Promise}
 */
exports.create = function (config) {
    // 动态加载Presenter配置
    if (isString(config)) {
        return exports.create(loadConfig(config));
    }

    var Constructor;
    config = configMgr.normal(config);

    if (config.constructor !== Object) {
        Constructor = config.constructor;
    }
    else {
        Constructor = Presenter;
    }

    return Resolver.resolved(new Constructor(config));
};

exports.Abstract = require('./lib/Abstract');

exports.Presenter = require('./lib/Presenter');

exports.Model = require('./lib/Model');

exports.View = require('./lib/View');
