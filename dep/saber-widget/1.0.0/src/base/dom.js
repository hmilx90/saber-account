/**
 * Saber Widget
 * Copyright 2013 Baidu Inc. All rights reserved.
 *
 * @file dom
 * @author zfkun(zfkun@msn.com)
 */

define(function (require) {

    var bind = require('saber-lang/bind');
    var debounce = require('saber-lang/function/debounce');
    var main = require('../main');


    /**
     * DOM事件存储器键值
     * 仅为控件管理的DOM元素使用，存储在控件实例上
     *
     * @const
     * @type {string}
     */
    var DOM_EVENTS_KEY = '_uiDOMEvent';


    /**
     * 全局DOM事件管理池
     *
     * @inner
     * @type {Object}
     */
    var globalEventPool = {win: {}, doc: {}, root: {}, body: {}};


    /**
     * DOM事件管理
     *
     * @exports dom
     * @requires saber-lang
     * @type {Object}
     */
    var exports = {};


    /**
     * 为控件管理的DOM元素添加DOM事件
     *
     * @public
     * @param {HTMLElement} element 需要添加事件的DOM元素
     * @param {string} type 事件的类型
     * @param {function} handler 事件处理函数
     * @return {Widget} 实例自身
     */
    exports.addEvent = function (element, type, handler) {
        if (!this.domEvents) {
            this.domEvents = {};
        }


        var guid = element[ DOM_EVENTS_KEY ];
        if (!guid) {
            guid = element[ DOM_EVENTS_KEY ] = main.getGUID();
        }


        var events = this.domEvents[ guid ];
        if (!events) {
            // `events`中的键都是事件的名称，仅`node`除外，
            // 因为DOM上没有`node`这个事件，所以这里占用一下没关系
            events = this.domEvents[ guid ] = {node: element};
        }


        // 同一元素的同一DOM事件, 仅用一个处理函数处理,存放在队列的`handler`上
        //
        // DOM事件类型分两类:
        //   * 全局DOM事件(window, document 等元素)
        //   * 非全局DOM事件(普通DOM元素)
        //
        // 下面的处理逻辑，会针对这两种类型分别处理:
        //   * 若是`全局DOM事件`，则由 `globalEventPool` 来管理，然后 控件自身 仅做一下 `handler` 的引用备份
        //   * 若是`非全局DOM事件`，则由 控件自身 独立管理，与 `globalEventPool` 无关


        // 1. 先检测是否属 `全局DOM事件`. 若是, 则由 `globalEventPool` 做对应处理
        var globalPool = getGlobalEventPool(element);

        if (globalPool) {
            // 全局DOM事件池
            var widgets = globalPool[ type ];

            // 监听器队列初始化
            if (!widgets) {
                widgets = globalPool[ type ] = [];

                // 生成主监听器
                widgets.handler = bind(triggerGlobalDOMEvent, null, element);

                // 需对 `resize` 和 `scroll` 事件增加`防抖`处理
                if ('resize' === type || 'scroll' === type) {
                    widgets.handler = debounce(widgets.handler, 150);
                }

                // 绑定主监听器到DOM
                element.addEventListener(type, widgets.handler, false);
            }

            // 滤重
            if (widgets.indexOf(this) < 0) {
                widgets.push(this);
            }
        }


        // 2. 接着, 由控件自身来处理. 若上面检测为 `全局DOM事件`，则仅对 `handler` 做下引用备份即可
        var handlers = events[ type ];

        // 监听器队列初始化
        if (!handlers) {
            handlers = events[ type ] = [];

            // 全局DOM事件，因在上面已经处理过了，这里就不需要处理
            if (!globalPool) {
                handlers.handler = bind(triggerDOMEvent, null, this, element);
                element.addEventListener(type, handlers.handler, false);
            }
        }

        // 滤重
        if (handlers.indexOf(handler) < 0) {
            handlers.push(handler);
        }

    };

    /**
     * 为控件管理的DOM元素移除DOM事件
     *
     * @public
     * @param {HTMLElement} element 需要删除事件的DOM元素
     * @param {string} type 事件的类型
     * @param {Function=} handler 事件处理函数
     * 如果没有此参数则移除该控件管理的元素的所有`type`DOM事件
     */
    exports.removeEvent = function (element, type, handler) {
        var events = this.domEvents;
        if (!events) {
            return;
        }

        events = events[ element[ DOM_EVENTS_KEY ] ];
        if (!events || !events[ type ]) {
            return;
        }


        // 控件上的监听器池
        var queue = events[ type ];
        var i;

        if (handler) {
            i = queue.indexOf(handler);
            if (i >= 0) {
                queue.splice(i, 1);
            }
        }
        else {
            queue.length = 0;
        }


        // 检测是否全局DOM事件 并 获取对应的队列池
        var globalPool = getGlobalEventPool(element);

        // 队列已空, 则需要清理相关队列
        if (!queue.length) {
            // 清理控件上的队列
            if (queue.handler) {
                element.removeEventListener(type, queue.handler, false);
            }
            queue.length = 0;
            delete events[ type ];

            // 检测元素`element`是否还有相关的队列。若没有，则直接清理掉在 `domEvents` 中的节点
            if ('node' === Object.keys(events).join('')) {
                events = null;
                delete this.domEvents[ element[ DOM_EVENTS_KEY ] ];
            }


            // 清理全局监听器池的队列
            if (globalPool && globalPool[ type ]) {
                i = globalPool[ type ].indexOf(this);
                if (i >= 0) {
                    globalPool[ type ].splice(i, 1);
                }
            }
        }


        // 若是`全局DOM事件`, 需检测全局池是否已空并清理.
        if (globalPool) {
            queue = globalPool[ type ];
            if (queue && !queue.length) {
                element.removeEventListener(type, queue.handler, false);
                queue.length = 0;
                delete globalPool[ type ];
            }
        }

        queue = null;
    };

    /**
     * 清除控件管理的DOM元素上的事件
     *
     * @public
     * @param {HTMLElement=} element 控件管理的DOM元素
     * 如果没有此参数则去除所有该控件管理的元素的DOM事件
     */
    exports.clearEvents = function (element) {
        var events = this.domEvents;
        if (!events) {
            return;
        }

        var guid;

        if (!element) {
            for (guid in events) {
                if (events.hasOwnProperty(guid)) {
                    this.clearEvents(events[ guid ].node);
                }
            }

            this.domEvents = null;

            return;
        }

        guid = element[ DOM_EVENTS_KEY ];
        events = events[ guid ];

        if (events) {
            // `events`是各种DOM事件的键值对容器
            // 但包含存在一个键值为`node`的DOM对象，需要先移除掉
            // 以避免影响后面的`for`循环处理
            delete events.node;

            // 清除已经注册的事件
            for (var type in events) {
                if (events.hasOwnProperty(type)) {
                    this.removeEvent(element, type);
                }
            }
        }

        if (guid) {
            delete this.domEvents[ guid ];
        }
    };


    /**
     * 触发DOM元素上的事件队列
     *
     * @inner
     * @param {Widget} widget 控件实例
     * @param {HTMLElement} element 触发事件的DOM元素
     * @param {Object} ev 事件信息对象
     */
    function triggerDOMEvent(widget, element, ev) {
        var queue = widget.domEvents[ element[ DOM_EVENTS_KEY ] ][ ev.type ];

        if (queue) {
            queue.forEach(
                function (fn) {
                    fn.call(this, ev);
                },
                widget
            );
        }
    }

    /**
     * 触发全局DOM元素上的事件队列
     *
     * @inner
     * @param {HTMLElement} element 触发事件的全局DOM元素
     * @param {Object} ev 事件信息对象
     */
    function triggerGlobalDOMEvent(element, ev) {
        var queue = getGlobalEventPool(element);

        queue = queue ? queue[ ev.type ] : [];

        queue.forEach(function (widget) {
            triggerDOMEvent(widget, element, ev);
        });
    }


    /**
     * 获取全局DOM事件池
     *
     * @inner
     * @param {HTMLElement} element 检测元素
     * @return {?Object} 若`element`是全局DOM元素，则返回对应的`监听器队列池`. 反之, 返回 `null`
     */
    function getGlobalEventPool(element) {
        if (window === element) {
            return globalEventPool.win;
        }

        if (document === element) {
            return globalEventPool.doc;
        }

        if (document.documentElement === element) {
            return globalEventPool.root;
        }

        if (document.body === element) {
            return globalEventPool.body;
        }

        return null;
    }


    return exports;

});
