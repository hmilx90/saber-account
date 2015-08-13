/**
 * @file View
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var inherits = require('saber-lang/inherits');
    var dom = require('saber-dom');
    var eventHelper = require('./event');

    var Abstract = require('./AbstractView');

    /**
     * 代理DOM事件KEY
     *
     * @const
     * @type{string}
     */
    var KEY_DELEGATE = '__delegate__';

    /*
     * 代理DOM事件
     * 调整this指针
     *
     * @inner
     * @param {View} view
     * @param {function} fn
     * @return {function}
     */
    function delegateDomEvent(view, fn) {
        return fn[KEY_DELEGATE] = function (e) {
            return fn.call(view, this, e);
        };
    }

    /**
     * 绑定DOM事件
     *
     * @inner
     * @param {View} view 视图对象
     */
    function bindDomEvents(view) {
        var type;
        var selector;
        var fn;
        var events = view.domEvents || {};
        Object.keys(events).forEach(function (name) {
            fn = events[name];
            name = name.split(':');
            type = name[0].trim();
            selector = name[1] ? name[1].trim() : undefined;
            view.addDomEvent(view.main, type, selector, fn);
        });
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
        Abstract.call(this, options);
    }

    inherits(View, Abstract);

    /**
     * 视图就绪
     * 主要进行事件绑定
     *
     * @override
     */
    View.prototype.ready = function () {
        bindDomEvents(this);

        Abstract.prototype.ready.call(this);
    };

    /**
     * 选取视图中的DOM元素
     *
     * @public
     * @param {string} selector 选择器
     * @param {HTMLElement=} context 上下文
     * @return {?HTMLElement}
     */
    View.prototype.query = function (selector, context) {
        context = context || this.main;
        if (!context) {
            return null;
        }
        return dom.query(selector, context);
    };

    /**
     * 选取视图中的DOM元素
     *
     * @public
     * @param {string} selector 选择器
     * @param {HTMLElement=} context 上下文
     * @return {Array.<HTMLElement>}
     */
    View.prototype.queryAll = function (selector, context) {
        context = context || this.main;
        if (!context) {
            return [];
        }
        return dom.queryAll(selector, context);
    };

    /**
     * 页面跳转
     *
     * @public
     * @param {string} url 跳转地址
     * @param {Object=} query 查询条件
     * @param {Object=} options 跳转参数
     */
    View.prototype.redirect = function (url, query, options) {
        this.router.redirect(url, query, options);
    };

    /*
     * 绑定DOM事件
     * 会对进行绑定的DOM元素进行管理，方便自动卸载
     *
     * @public
     * @param {HTMLElement} ele
     * @param {string} type 事件类型
     * @param {string=} selector 子元素选择器
     * @param {function(element,event)} fn 事件处理函数，this指针为View对象
     */
    View.prototype.addDomEvent = function (ele, type, selector, fn) {
        if (this.bindElements.indexOf(ele) < 0) {
            this.bindElements.push(ele);
        }
        if (!fn) {
            fn = selector;
            selector = undefined;
        }
        eventHelper.on(ele, type, selector, delegateDomEvent(this, fn));
    };

    /*
     * 卸载DOM事件
     *
     * @public
     * @param {HTMLElement} ele
     * @param {string} type 事件类型
     * @param {string=} selector 子元素选择器
     * @param {function} fn 事件处理函数
     */
    View.prototype.removeDomEvent = function (ele, type, selector, fn) {
        if (!fn) {
            fn = selector;
            selector = undefined;
        }
        if (fn[KEY_DELEGATE]) {
            eventHelper.off(ele, type, selector, fn[KEY_DELEGATE]);
        }
    };

    /**
     * 视图销毁
     *
     * @public
     * @fires View#dispose
     */
    View.prototype.dispose = function () {
        /**
         * 视图销毁事件
         *
         * @event
         */
        this.emit('dispose');

        // 解除事件绑定
        this.bindElements.forEach(function (ele) {
            eventHelper.clear(ele);
        });
        this.bindElements = [];

        // 销毁页面的widget
        require('saber-widget').dispose(this.main);

        // 解除元素引用
        this.main = null;

        Abstract.prototype.dispose.call(this);
    };

    return View;
});
