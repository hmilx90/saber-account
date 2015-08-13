/**
 * Saber Widget
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file lazy load
 * @author junmer(junemr@foxmail.com)
 */

define(function (require) {

    var lang = require('saber-lang');
    var dom = require('saber-dom');
    var Widget = require('./Widget');
    var debounce = require('saber-lang/function/debounce');

    /**
     * LazyLoad 控件
     *
     * @class
     * @constructor
     * @exports LazyLoad
     * @extends Widget
     * @requires saber-lang
     * @requires saber-dom
     * @fires LazyLoad#change
     * @fires LazyLoad#load
     * @fires LazyLoad#complete
     * @param {Object=} options 初始化配置参数
     */
    function LazyLoad(options) {

        this.attrs = {

            /**
             * 图片源地址
             *
             * @type {string}
             */
            attribute: {value: 'data-original'},

            /**
             * 触发事件
             * 默认 `scroll`, `touchmove`, `resize`, `orientationchange`
             *
             * @type {string}
             */
            events: {value: 'scroll touchmove resize orientationchange'},

            /**
             * 是否启用动画
             *
             * @type {boolean}
             */
            animate: {value: false},


            /**
             * 临界点偏移量
             *
             * @type {number}
             */
            range: {value: 100},


            /**
             * 占位图片
             *
             * @type {string}
             */
            placeholder: {
                value: [
                    'data:image/png;base64,',
                    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8',
                    'YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC'
                ].join('')
            }


        };

        /**
         * 控件状态集
         *
         * @private
         * @type {Object}
         */
        this.states = {

            // 加载完成
            complete: false

        };

        // **MUST**最后调用父类的构造函数
        // 由于子类的`attrs`、`states`等需要与父类的对应默认值进行`mixin`
        Widget.apply(this, arguments);
    }


    LazyLoad.prototype = {

        /**
         * 控件类型标识
         *
         * @readonly
         * @type {string}
         */
        type: 'LazyLoad',

        /**
         * 初始化DOM
         *
         * @override
         */
        initDom: function () {

            this.container = this.get('main');

            this.main = this.get('main') || document.body;

            this.elements = this._filterElements();

            // 初始化占位图片
            if (this.get('placeholder')) {
                this.elements.forEach(
                    function (el) {
                        el.src = this.get('placeholder');
                    },
                    this
                );
            }

        },

        /**
         * 初始化事件
         *
         * @override
         */
        initEvent: function () {

            var me = this;

            this.get('events')
                .split(' ')
                .forEach(
                function (evt) {
                    // 绑定事件
                    me.addEvent(me.container || window, evt, me._update);
                }
            );

            // 初始化, 先来一次
            this._update();

        },

        /**
         * 查找懒加载元素
         *
         * @private
         * @return {Array} 需要懒加载的元素
         */
        _filterElements: function () {

            return dom.queryAll('[' + this.get('attribute') + ']', this.main);

        },

        /**
         * 强制重新获取懒加载元素
         *
         * @public
         */
        refresh: function () {
            this.elements = this._filterElements();
            this.removeState('complete');
        },

        /**
         * 执行加载
         *
         * @private
         * @param  {HTMLElemnt} el 需要加载的元素
         */
        _loadElement: function (el) {

            // 动画
            if (this.get('animate')) {

                dom.setStyle(el, 'opacity', 0);

                dom.setStyle(el, 'transition', 'opacity .5s linear 0s');

                this.addEvent(el, 'load', function () {

                    dom.setStyle(el, 'opacity', 1);

                });

            }

            // 替换真实地址
            var original = el.getAttribute(this.get('attribute'));

            if (el.tagName.toUpperCase() === 'IMG') {
                el.src = original;
            }
            else {
                dom.setStyle(el, 'background-image', 'url(' + original + ')');
            }

            /**
             * 触发 真实图片加载完成事件
             *
             * @event LazyLoad#load
             * @param {HTMLElement} el 目标元素
             */
            this.emit('load', el);
        },

        /**
         * 加载 进入或即将进入可视区域的元素
         *
         * @private
         */
        _update: debounce(
            function () {
                var me = this;

                // 此处简单粗暴的 处理了 加载完成逻辑
                // 后期如果 有性能瓶颈 会考虑 维护一个状态队列
                this.elements = this.elements.filter(
                    function (el) {

                        if (el) {

                            if (!el.parentNode) {
                                return false;
                            }
                            else if (isElementInViewport(el, me.container, me.get('range'))) {
                                me._loadElement(el);
                                return false;
                            }


                        }

                        return true;

                    }
                );


                /**
                 * 触发 页面变化事件
                 *
                 * @event LazyLoad#change
                 */
                this.emit('change');

                // 队列空了
                if (!this.is('complete') && !this.elements.length) {

                    this.addState('complete');

                    /**
                     * 触发加载完毕事件
                     * ----------------
                     * 考虑到 有可能 图片是异步加载的
                     * 就不自动清除 事件了
                     *
                     * @event LazyLoad#complete
                     */
                    this.emit('complete');

                }

            },
            200
        )

    };


    /**
     * 判断元素是否在可视范围内
     *
     * @inner
     * @param  {HTMLElement}  ele       目标元素
     * @param  {HTMLElement}  container 容器
     * @param  {number}  range     值域
     * @return {Boolean}           结果
     */
    function isElementInViewport(ele, container, range) {

        range = range || 0;

        // 矩形相交
        // var rect1 = ele.getBoundingClientRect();
        // var rect2 = container
        //     ? container.getBoundingClientRect()
        //     : getViewRect();

        // console.log(rect1, rect2);

        // return (rect1.left + rect1.width > rect2.left )
        //     && (rect1.left < rect1.left + rect2.width + range)
        //     && (rect1.top + rect1.height > rect2.top)
        //     && (rect1.top < rect2.top + rect2.height + range);


        // 相对位置
        var pos;
        var cRect;

        if (container) {
            pos = dom.position(ele, container);
            cRect = container.getBoundingClientRect();
        }
        else {
            pos = ele.getBoundingClientRect();
            cRect = getViewRect();
        }

        // console.log{pos.top, range, cRect.height};

        return (pos.top > 0)
            ? (pos.top - range < cRect.height)      // 下
            : (pos.top + range > 0)                 // 上
                  && (pos.left > 0)
                   ? (pos.left - range < cRect.width)      // 右
                   : (pos.left + range > 0);               // 左

    }

    /**
     * 获取窗口大小
     *
     * @inner
     * @return {object} size object
     */
    function getViewRect() {

        var win = window;
        var doc = document;
        var client = doc.compatMode === 'BackCompat' ? doc.body : doc.documentElement;

        return {
            top: 0,
            left: 0,
            width: win.innerWidth || client.clientWidth,
            height: win.innerHeight || client.clientHeight
        };

    }

    /**
     * 静态API 判断元素是否在可视范围内
     *
     * @static
     * @public
     */
    LazyLoad.isElementInViewport = isElementInViewport;

    lang.inherits(LazyLoad, Widget);

    require('./main').register(LazyLoad);


    return LazyLoad;

});
