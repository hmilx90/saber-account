/**
 * @file 配置信息处理
 * @author treelite(c.xinle@gmail.com)
 */

var extend = require('saber-lang').extend;

/**
 * 全局默认的配置信息
 *
 * @type {Object}
 */
var data = {
    /**
     * 预加载的模版
     *
     * @type {Array.<string>}
     */
    template: [],

    /**
     * 模版引擎配置信息
     *
     * @type {Object}
     */
    templateConfig: {},

    /**
     * 通用模版数据
     *
     * @type {Object}
     */
    templateData: {},

    /**
     * 路由器
     *
     * @type {Object}
     */
    router: null,

    /**
     * Presenter
     *
     * @type {Function}
     */
    Presenter: null,

    /**
     * Model
     *
     * @type {Function}
     */
    Model: null,

    /**
     * View
     *
     * @type {Function}
     */
    View: null
};

/**
 * 设置构造函数
 *
 * @inner
 * @param {string} name 名称
 * @param {Object} config 配置项
 */
function setConstructor(name, config) {
    var Constructor = data[name];
    if (Constructor && config.constructor === Object) {
        config.constructor = Constructor;
    }
}

/**
 * 规范View配置
 *
 * @inner
 * @param {Object} config 配置信息
 */
function normalView(config) {
    var view = config.view || {};

    // 设置构造函数
    setConstructor('View', view);

    // 添加默认的路由器
    view.router = view.router || data.router;

    // 添加通用模版数据
    view.templateData = extend({}, data.templateData, view.templateData);

    // 添加通用模版配置
    view.templateConfig = extend({}, data.templateConfig, view.templateConfig);

    // 模版设置
    var template = view.template || '';
    if (!template
        || Array.isArray(view.template)
        || typeof template === 'string'
    ) {
        if (!Array.isArray(template)) {
            template = [template];
        }
        view.template = template.concat(data.template);
    }

    config.view = view;
}

/**
 * 规范Model配置
 *
 * @inner
 * @param {Object} config 配置信息
 */
function normalModel(config) {
    var model = config.model || {};

    // 设置构造函数
    setConstructor('Model', model);

    config.model = model;
}

/**
 * 获取配置信息
 *
 * @public
 * @param {string} name name
 * @return {*}
 */
exports.get = function (name) {
    return data[name];
};

/**
 * 设置配置信息
 *
 * @public
 * @param {Object=} config 配置信息
 */
exports.set = function (config) {
    data = extend(data, config);
};

/**
 * 规范Presenter配置信息
 * 附加全局配置
 *
 * @public
 * @param {Object=} config presenter 配置信息
 * @return {Object}
 */
exports.normal = function (config) {
    config = config || {};

    // 规范presenter配置项
    // 添加默认的路由器
    config.router = config.router || data.router;
    // 设置构造函数
    setConstructor('Presenter', config);

    normalView(config);

    normalModel(config);

    return config;
};
