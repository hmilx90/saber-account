/**
 * @file Abstract View
 * @author treelite(c.xinle@gmail.com)
 */

var inherits = require('saber-lang').inherits;
var extend = require('saber-lang').extend;
var etpl = require('etpl');

var Abstract = require('./Abstract');

/**
 * 编译模版
 *
 * @public
 * @param {View} view 视图对象
 * @param {string|Array.<string>} str 模版
 */
function compileTemplate(view, str) {
    if (Array.isArray(str)) {
        str = str.join('');
    }

    var config = extend({}, view.templateConfig || {});
    var filters = {};
    if (config.filters) {
        filters = config.filters;
        delete config.filters;
    }

    // 新建模版引擎
    var tplEngine = new etpl.Engine(config);
    Object.keys(filters).forEach(function (key) {
        tplEngine.addFilter(key, filters[key]);
    });

    // 保存默认render
    var defaultRender = tplEngine.compile(str);

    // 如果没有默认render就是模版编译失败了
    if (!defaultRender) {
        throw new Error('compile template fail');
    }

    // 保存原始的render
    var orgRender = tplEngine.render;

    view.template = tplEngine;
    // 重载render以支持无target的情况
    view.template.render = function (name, data) {
        // 扩展通用模版数据
        data = extend({}, view.templateData, data);

        var res = '';
        // 如果只有一个参数 或者target为null
        // 则使用默认render
        if (arguments.length < 2 || !name) {
            res = defaultRender(name || data);
        }
        else {
            res = orgRender.call(this, name, data);
        }

        return res;
    };
}

/**
 * View
 *
 * @constructor
 * @param {Object} options 配置信息
 * @param {string|Array.<string>} options.template 模版字符串
 * @param {string=} options.templateMainTarget 模版主target 用于初始化视图
 * @param {string=} options.className 容器元素附加className
 * @param {Object=} events view事件
 * @param {Object=} domEvents DOM事件
 */
function View(options) {

    options = options || {};

    Abstract.call(this, options);

    this.init();

    // 修改原始配置项
    // 只在第一次加载view的时候才编译模版
    options.template = this.template;
}

inherits(View, Abstract);

/**
 * 初始化
 *
 * @public
 */
View.prototype.init = function () {
    this.template = this.template || '';
    // 如果是字符串或者数组
    // 则表示模版还未编译
    if (Array.isArray(this.template)
        || typeof this.template === 'string'
    ) {
        compileTemplate(this, this.template);
    }

    // 绑定了事件的DOM元素集合
    // 用于View销毁时卸载事件绑定
    this.bindElements = [];

    Abstract.prototype.init.call(this);
};

/**
 * 设置容器元素
 *
 * @public
 * @param {HTMLElement} ele 视图容器元素
 */
View.prototype.set = function (ele) {
    this.main = ele;
};

/**
 * 渲染视图
 *
 * @public
 * @param {Object} data 模版数据
 *
 * @fires View#beforerender
 *        View#afterrender
 */
View.prototype.render = function (data) {
    if (!this.main) {
        return;
    }

    // 设置className，避免重复
    var classes = this.main.className.split(/\s+/);
    if (this.className && classes.indexOf(this.className) < 0) {
        this.main.className += ' ' + this.className;
    }

    /**
     * 渲染前事件
     *
     * @event
     * @param {Object} 渲染数据
     */
    this.emit('beforerender', data);

    this.main.innerHTML = this.template.render(this.templateMainTarget, data);

    /**
     * 渲染后事件
     *
     * @event
     * @param {Object} 渲染数据
     */
    this.emit('afterrender', data);
};

/**
 * 视图就绪
 * 主要进行事件绑定
 *
 * @public
 * @fires View#ready
 */
View.prototype.ready = function () {
    /**
     * 视图就绪事件
     *
     * @event
     */
    this.emit('ready');
};

/**
 * 视图苏醒
 *
 * @public
 * @fires View#revived
 */
View.prototype.revived = function () {
    /**
     * 视图苏醒事件
     *
     * @event
     */
    this.emit('revived');
};

/**
 * 视图离开
 *
 * @public
 * @fires View#leave
 */
View.prototype.leave = function () {
    /**
     * 视图离开事件
     *
     * @event
     */
    this.emit('leave');
};

/**
 * 视图休眠
 *
 * @public
 * @fires View#sleep
 */
View.prototype.sleep = function () {
    /**
     * 视图休眠事件
     *
     * @event
     */
    this.emit('sleep');
};

module.exports = View;
