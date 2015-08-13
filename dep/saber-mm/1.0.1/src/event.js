/**
 * @file dom event
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var dom = require('saber-dom');
    var extend = require('saber-lang/extend');

    var KEY_UID = '_event_uid';
    var KEY_STOP = '_stopped';
    var UID = 0;

    /**
     * 插件
     *
     * @inner
     * @type {Array}
     */
    var plugins = [];

    /**
     * EventHost对象集合
     *
     * @inner
     * @type {Object}
     */
    var eventHosts = {};

    /**
     * 获取事件对应的插件
     *
     * @inner
     * @param {string} type 事件类型
     * @return {Object}
     */
    function getPlugin(type) {
        var res;

        plugins.some(function (plugin) {
            if (plugin.detect(type)) {
                res = plugin;
            }
            return !!res;
        });

        return res;
    }

    /**
     * 判断元素是否是选择器指定的元素
     *
     * @inner
     * @param {HTMLElement} target 目标元素
     * @param {string} selector css选择器
     * @param {HTMLElement} main 主元素
     * @return {boolean}
     */
    function matchElement(target, selector, main) {
        var res = false;
        var eles = dom.queryAll(selector, main);
        eles.some(function (ele) {
            return res = ele === target;
        });
        return res;
    }

    /**
     * 获取事件处理函数
     *
     * @inner
     * @param {EventHost} eventHost 事件宿主
     * @param {Event} e DOM事件参数
     * @return {Array}
     */
    function getHandlers(eventHost, e) {
        var target = e.target;
        var type = e.type;
        var res = [];
        var handlers = eventHost.handlers[type] || [];

        while (handlers.delegateCount && target && target !== eventHost.ele) {
            var handler;
            var max = handlers.delegateCount;
            for (var i = 0; i < max && (handler = handlers[i]); i++) {
                if (matchElement(target, handler.selector, eventHost.ele)) {
                    var item = extend({}, handler);
                    item.thisArg = target;
                    res.push(item);
                }
            }
            target = target.parentNode;
        }

        res = res.concat(handlers.slice(handlers.delegateCount || 0));

        return res;
    }

    /**
     * 生成统一的事件处理函数
     *
     * @inner
     * @param {EventHost} eventHost 事件宿主
     * @return {Function}
     */
    function createCommonEventHandler(eventHost) {
        return function (e) {

            var handlers = getHandlers(eventHost, e);

            e = mixinEvent(e);

            // fire event handler
            handlers.some(function (handler) {
                var thisArg = handler.thisArg || eventHost.ele;
                var res = handler.fn.call(thisArg, e);

                if (res === false) {
                    e.preventDefault();
                    e.stopPropagation();
                }

                return e.isPropagationStopped();
            });

        };
    }

    /**
     * 绑定事件
     * 先判断是否是手势
     * 然后再分别绑定事件
     *
     * @inner
     * @param {EventHost} eventHost 事件宿主
     * @param {string} type 事件类型
     */
    function addEvent(eventHost, type) {
        var fn = eventHost.commonEventHandler;
        var plugin = getPlugin(type);

        if (plugin) {
            plugin.on(eventHost.ele, type, fn);
        }
        else {
            eventHost.ele.addEventListener(type, fn, false);
        }
    }

    /**
     * 移除事件绑定
     *
     * @inner
     * @param {EventHost} eventHost 事件宿主
     * @param {string} type 事件类型
     */
    function removeEvent(eventHost, type) {
        var fn = eventHost.commonEventHandler;
        var plugin = getPlugin(type);

        if (plugin) {
            plugin.off(eventHost.ele, type, fn);
        }
        else {
            eventHost.ele.removeEventListener(type, fn, false);
        }
    }

    /**
     * 扩展事件参数
     *
     * @inner
     * @param {Event} e DOM事件参数
     * @return {Event}
     */
    function mixinEvent(e) {
        var fn = e.stopPropagation;

        e.stopPropagation = function () {
            fn.call(this);
            e[KEY_STOP] = true;
        };

        e.isPropagationStopped = function () {
            return !!e[KEY_STOP];
        };

        return e;
    }

    /**
     * 获取元素的uid
     *
     * @inner
     * @param {HTMLElement} ele DOM元素
     * @return {number}
     */
    function getUID(ele) {
        return ele[KEY_UID];
    }

    /**
     * 创建元素的uid
     *
     * @inner
     * @param {HTMLElement} ele DOM元素
     * @return {number}
     */
    function createUID(ele) {
        var id = ++UID;
        ele[KEY_UID] = id;
        return id;
    }

    /**
     * 移除元素的uid
     *
     * @inner
     * @param {HTMLElement} ele DOM元素
     */
    function removeUID(ele) {
        try {
            delete ele[KEY_UID];
        }
        catch (e) {}
    }

    /**
     * EventHost
     *
     * @constructor
     * @param {HTMLElement} ele DOM元素
     */
    function EventHost(ele) {
        this.uid = createUID(ele);
        this.ele = ele;
        this.handlers = {};
        this.commonEventHandler = createCommonEventHandler(this);
        eventHosts[this.uid] = this;
    }

    /**
     * 事件绑定
     *
     * @public
     * @param {string} type 事件类型
     * @param {string=} selector 子元素选择器
     * @param {Function} fn 事件处理函数
     */
    EventHost.prototype.on = function (type, selector, fn) {
        if (!fn) {
            fn = selector;
            selector = undefined;
        }

        var handlers = this.handlers[type];
        if (!handlers) {
            handlers = this.handlers[type] = [];
            handlers.delegateCount = 0;
            addEvent(this, type);
        }

        var handler = {
                fn: fn,
                selector: selector
            };

        if (selector) {
            handlers.delegateCount++;
            handlers.splice(handlers.delegateCount - 1, 0, handler);
        }
        else {
            handlers.push(handler);
        }
    };

    /**
     * 事件卸载
     *
     * @public
     * @param {string} type 事件类型
     * @param {string=} selector 子元素选择器
     * @param {Function} fn 事件处理函数
     */
    EventHost.prototype.off = function (type, selector, fn) {
        if (!fn) {
            fn = selector;
            selector = undefined;
        }

        var handlers = this.handlers[type] || [];

        handlers.some(function (item, index) {
            var res = false;
            if (item.fn === fn && item.selector === selector) {
                handlers.splice(index, 1);
                res = true;
            }
            return res;
        });

        if (handlers.length <= 0) {
            removeEvent(this, type);
        }
    };

    /**
     * dispose
     *
     * @public
     */
    EventHost.prototype.dispose = function () {
        var me = this;
        removeUID(me.ele);
        Object.keys(me.handlers).forEach(function (type) {
            removeEvent(me, type);
        });
        this.ele = null;
    };

    /**
     * 根据元素生成EventHost对象
     *
     * @inner
     * @param {HTMLElement} ele DOM元素
     * @return {EventHost}
     */
    function generateEventHost(ele) {
        var uid = getUID(ele);
        if (uid) {
            return eventHosts[uid];
        }
        return new EventHost(ele);
    }

    /**
     * 获取元素对应的EventHost对象
     *
     * @inner
     * @param {HTMLElement} ele DOM元素
     * @return {?EventHost}
     */
    function getEventHost(ele) {
        var host;
        var uid = getUID(ele);
        if (uid) {
            host = eventHosts[uid];
        }
        return host;
    }

    var exports = {};


    /**
     * 事件绑定
     *
     * @public
     * @param {HTMLElement} ele DOM元素
     * @param {string} type 事件类型
     * @param {string} selector 子元素选择器
     * @param {Function} fn 事件处理函数
     */
    exports.on = function (ele, type, selector, fn) {
        var host = generateEventHost(ele);
        host.on(type, selector, fn);
    };

    /**
     * 事件卸载
     *
     * @public
     * @param {HTMLElement} ele DOM元素
     * @param {string} type 事件类型
     * @param {string} selector 子元素选择器
     * @param {Function} fn 事件处理函数
     */
    exports.off = function (ele, type, selector, fn) {
        var host = getEventHost(ele);
        if (host) {
            host.off(type, selector, fn);
        }
    };

    /**
     * 绑定一次性事件
     *
     * @public
     * @param {HTMLElement} ele DOM元素
     * @param {string} type 事件类型
     * @param {string=} selector 子元素选择器
     * @param {Function} fn 事件处理函数
     */
    exports.one = function (ele, type, selector, fn) {
        if (!fn) {
            fn = selector;
            selector = undefined;
        }
        var handler = function () {
            var args = Array.prototype.slice.call(arguments);
            var res = fn.apply(this, args);
            exports.off(ele, type, selector, handler);
            return res;
        };

        exports.on(ele, type, selector, handler);
    };

    /**
     * 卸载所有事件绑定
     *
     * @public
     * @param {HTMLElement} ele DOM元素
     */
    exports.clear = function (ele) {
        var host = getEventHost(ele);
        if (host) {
            host.dispose();
        }
    };

    /**
     * 注册插件
     *
     * @public
     * @param {Object} plugin 插件
     */
    exports.register = function (plugin) {
        if (plugin.init) {
            plugin.init();
        }
        plugins.push(plugin);
    };

    return exports;
});
