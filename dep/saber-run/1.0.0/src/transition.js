/**
 * @file transition
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var dom = require('saber-dom');
    var Resolver = require('saber-promise');

    var exports = {};

    var transitionEndEvents = [
            'transitionend', 'webkitTransitionEnd',
            'oTransitionEnd', 'MSTransitionEnd',
            'otransitionend' // Opera某些犯2的版本...
        ];

    var detectEle = document.createElement('div');
    var prefixes = ['webkit', 'ms', 'o'];

    /**
     * 事件列表
     * 用于额外保存`transitionend`事件
     *
     * @type {Array}
     */
    var eventList = [];

    /**
     * DOM自定义属性名称
     * 用于保存`transitionend`事件序列号
     *
     * @const
     * @type {string}
     */
    var EVENT_INDEX = 'data-transition-event';

    /**
     * 保存事件
     *
     * @inner
     * @param {HTMLElement} ele
     * @param {Function} callback
     */
    function attachEndEvent(ele, callback) {
        var items;
        var index = ele.getAttribute(EVENT_INDEX);
        if (index) {
            index = parseInt(index, 10);
            items = eventList[index];
        }
        else {
            index = eventList.length;
            ele.setAttribute(EVENT_INDEX, index);
        }
        items = items || [];
        items.push(callback);
        eventList[index] = items;
    }

    /**
     * 删除事件
     *
     * @inner
     * @param {HTMLElement} ele
     * @param {Function} callback
     */
    function detachEndEvent(ele, callback) {
        var index = ele.getAttribute(EVENT_INDEX);

        if (!index) {
            return;
        }

        index = parseInt(index, 10);
        var items = eventList[index] || [];
        items.some(function (item, index, items) {
            return item === callback
                    && items.splice(index, 1);
        });
    }

    /**
     * 触发保存的事件
     *
     * @inner
     * @param {HTMLElement} ele
     */
    function fireEndEvent(ele) {
        var index = ele.getAttribute(EVENT_INDEX);

        if (!index) {
            return;
        }

        index = parseInt(index, 10);
        var items = eventList[index] || [];

        items.forEach(function (item) {
            item.call(ele, true);
        });
    }

    /**
     * 将CSS属性驼峰化
     *
     * @param {string} target 目标字符串
     * @return {string}
     */
    function camelize(target) {
        return target.replace(/-+(.)?/g, function (match, chr) {
            return chr ? chr.toUpperCase() : '';
        });
    }

    /**
     * 检测支持的CSS属性名称
     * 如果没有找到支持的属性名称返回原有值
     *
     * @inner
     * @param {string} property CSS属性名
     * @return {string}
     */
    function detectProperty(property) {
        if (property.charAt(0) !== '-') {
            var style = detectEle.style;
            var name = camelize(property);

            if (!(name in style)) {
                name = property.charAt(0).toUpperCase()
                            + property.substring(1);
                for (var i = 0, prefix; prefix = prefixes[i]; i++) {
                    if (prefix + name in style) {
                        property = '-' + prefix + '-' + property;
                        break;
                    }
                }
            }
        }
        return property;
    }

    /**
     * 监听transition完成事件
     * 注册所有可能的transitionend
     * 不会有重入
     *
     * @public
     * @param {HTMLElement} ele
     * @param {Function} callback
     * @param {boolean} useCapture
     */
    exports.onTransitionEnd = function (ele, callback, useCapture) {
        transitionEndEvents.forEach(function (eventName) {
            ele.addEventListener(eventName, callback, useCapture || false);
        });
        // 额外保存完成回调
        // 供`stop`时手动调用回调
        attachEndEvent(ele, callback);
    };

    /**
     * 取消transition完成事件的监听
     *
     * @public
     * @param {HTMLElement} ele
     * @param {Function} callback
     * @param {boolean} useCapture
     */
    exports.unTransitionEnd = function (ele, callback, useCapture) {
        transitionEndEvents.forEach(function (name) {
            ele.removeEventListener(name, callback, useCapture || false);
        });
        // 删除之前额外保存的回调
        detachEndEvent(ele, callback);
    };

    /**
     * 只监听一次transition完成事件
     *
     * @public
     * @param {HTMLElement} ele
     * @param {Function} callback
     * @param {boolean} useCapture
     */
    exports.oneTransitionEnd = function (ele, callback, useCapture) {
        var handler = function (e) {
            if (callback.call(ele, e) !== false) {
                exports.unTransitionEnd(ele, handler, useCapture);
            }
        };

        exports.onTransitionEnd(ele, handler, useCapture);
    };

    /**
     * 设置transition
     *
     * @public
     * @param {HTMLElement} ele DOM元素
     * @param {Object} properties 要改变的属性
     * @param {number=} options.duration 持续时间 单位秒
     * @param {string=} options.ease 缓动效果
     * @param {string=} options.timing 缓动效果(!已抛弃)
     * @param {number=} options.delay 延时 单位秒
     * @return {Promise}
     */
    exports.transition = function (ele, properties, options) {

        if (!ele || !properties) {
            return Resolver.resolved(ele);
        }

        options = options || {};
        options.ease = options.ease || options.timing || 'ease';
        options.delay = options.delay || 0;
        options.duration = options.duration || 0;

        var propertyNames = [];
        var oldStyles = {};

        // 防止样式刷新
        // get 与 set 不能在一起...(>_<)...
        Object.keys(properties).forEach(function (name) {
            oldStyles[name] = dom.getStyle(ele, name);
        });

        Object.keys(properties).forEach(function (name) {
            if (oldStyles[name] !== properties[name]) {
                propertyNames.push(name);
                dom.setStyle(ele, name, properties[name]);
            }
        });

        var resolver = new Resolver();

        var callback = function (e) {
            // transitionend会根据设置的transition-property依次触发
            // 所以将最后一个transitionend作为整体的结束
            var res = true;
            if (e === true || propertyNames.length <= 1) {
                resolver.fulfill(ele);
                // 恢复默认设置
                dom.setStyle(ele, 'transition', '');
            }
            else {
                propertyNames.pop();
                res = false;
            }
            return res;
        };

        if (propertyNames.length > 0 && options.duration) {
            exports.oneTransitionEnd(ele, callback);

            propertyNames.forEach(function (property, index) {
                propertyNames[index] = detectProperty(property);
            });

            dom.setStyle(ele, 'transition-property', propertyNames.join(','));
            dom.setStyle(ele, 'transition-duration', options.duration + 's');
            dom.setStyle(ele, 'transition-timing-function', options.ease);
            dom.setStyle(ele, 'transition-delay', options.delay + 's');
        }
        else {
            resolver.fulfill(ele);
        }

        return resolver.promise();
    };

    /**
     * 停止transition
     *
     * @public
     * @param {HTMLElement} ele
     */
    exports.stopTransition = function (ele) {
        dom.setStyle(ele, 'transition-property', 'none');
        // 通过修改`transition-property`
        // 停止动画不会触发`transitionend`事件
        // 手动触发下
        fireEndEvent(ele);
    };

    return exports;
});
