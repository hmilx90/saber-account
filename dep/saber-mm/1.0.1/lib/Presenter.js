/**
 * @file Presenter
 * @author treelite(c.xinle@gmail.com)
 */

var inherits = require('saber-lang').inherits;
var extend = require('saber-lang').extend;
var Abstract = require('./Abstract');
var Resolver = require('saber-promise');

var View = require('./View');
var Model = require('./Model');

/**
 * Presenter
 *
 * @constructor
 * @param {Object} options 配置参数
 * @param {Object} options.view view配置项
 * @param {Object} options.model model配置项
 * @param {Object=} options.events 事件
 */
function Presenter(options) {
    Abstract.call(this, options);
    this.init();
}

inherits(Presenter, Abstract);

/**
 * 初始化
 *
 * @public
 */
Presenter.prototype.init = function () {
    var Constructor;
    if (this.view
        && this.view.constructor !== Object
    ) {
        Constructor = this.view.constructor;
    }
    else {
        Constructor = View;
    }
    this.view = new Constructor(this.view);

    if (this.model
        && this.model.constructor !== Object
    ) {
        Constructor = this.model.constructor;
    }
    else {
        Constructor = Model;
    }
    this.model = new Constructor(this.model);

    Abstract.prototype.init.call(this);
};

/**
 * 数据设置
 *
 * @public
 * @param {string} path 当前的路径
 */
Presenter.prototype.set = function (path) {
    this.path = path;
};

/**
 * 页面跳转
 *
 * @public
 * @param {string} url 跳转地址
 * @param {Object=} query 查询条件
 * @param {Object=} options 跳转参数
 */
Presenter.prototype.redirect = function (url, query, options) {
    this.router.redirect(url, query, options);
};

/**
 * 加载页面
 *
 * 页面入口
 * 完成数据请求，页面渲染
 *
 * @public
 * @param {HTMLElement} main 视图容器
 * @param {string} path 当前的访问路径
 * @param {Object} query 查询条件
 * @param {Object=} options 附加数据
 * @return {Promise}
 */
Presenter.prototype.enter = function (main, path, query, options) {
    this.path = path;

    this.options = extend({}, options);
    this.view.set(main);

    this.emit('enter');

    var me = this;

    return this.model.fetch(query).then(function (data) {
        me.view.render(data);
    });
};

/**
 * 唤醒页面
 *
 * @public
 * @param {string} path 当前的访问地址
 * @param {Object} query 查询条件
 * @param {Object} options 附加数据
 * @return {Promise}
 */
Presenter.prototype.wakeup = function (path, query, options) {
    this.path = path;

    this.options = extend({}, options);

    this.emit('wakeup');

    return Resolver.resolved();
};

/**
 * 页面就绪
 * 进行DOM事件注册
 *
 * @public
 */
Presenter.prototype.ready = function () {
    this.emit('ready');
    this.view.ready();
};

/**
 * 页面苏醒
 *
 * @public
 */
Presenter.prototype.revived = function () {
    this.emit('revived');
    this.view.revived();
};

/**
 * 页面呈现完成
 * 业务逻辑处理的主要入口
 *
 * @public
 */
Presenter.prototype.complete = function () {
    this.emit('complete');
};

/**
 * 页面离开
 *
 * @public
 */
Presenter.prototype.leave = function () {
    this.emit('leave');
    this.view.leave();
    this.dispose();
};

/**
 * 页面休眠
 *
 * @public
 */
Presenter.prototype.sleep = function () {
    this.emit('sleep');
    this.view.sleep();
};

/**
 * 页面卸载
 *
 * @public
 */
Presenter.prototype.dispose = function () {
    this.view.dispose();
    this.model.dispose();
    Abstract.prototype.dispose.call(this);
};

module.exports = Presenter;
