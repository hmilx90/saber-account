/**
 * Saber Widget
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file 插件基类
 * @author zfkun(zfkun@msn.com)
 */

define(function (require) {

    var bind = require('saber-lang/bind');
    var extend = require('saber-lang/extend');


    /**
     * 插件基类
     *
     * @constructor
     * @exports Plugin
     * @class
     * @mixes event
     * @mixes state
     * @requires saber-lang
     * @requires saber-emitter
     * @fires Plugin#init
     * @fires Plugin#beforerender
     * @fires Plugin#afterrender
     * @fires Plugin#beforedispose
     * @fires Plugin#afterdispose
     * @fires Plugin#enable
     * @fires Plugin#disable
     * @param {Widget} widget 控件实例
     * @param {Object=} options 插件配置项
     */
    var Plugin = function (widget, options) {
        /**
         * 插件状态集
         *
         * @private
         * @type {Object}
         */
        this.states = extend(
            // `基类`默认属性集
            // 使用`extend`确保正确`mixin`子类构造函数中定义的默认状态
            {

                // 默认为禁用状态
                disable: true

            },

            // `子类`默认属性集
            this.states
        );

        /**
         * 控件实例
         *
         * @public
         * @type {Widget}
         */
        this.target = widget;

        // 初始化配置
        this.initOptions(options);

        // 更新状态
        this.addState('init');

        /**
         * @event Widget#init
         * @param {Object} ev 事件参数对象
         * @param {string} ev.type 事件类型
         * @param {Widget} ev.target 触发事件的插件对象
         */
        this.emit('init');
    };

    Plugin.prototype = {

        /**
         * 插件类型标识
         *
         * @private
         * @type {string}
         */
        type: 'Plugin',

        /**
         * 插件初始化
         *
         * @protected
         * @param {Object=} options 构造函数传入的配置参数
         */
        initOptions: function (options) {
            this.options = extend({}, this.options, options);

            if (this.target.is('render')) {
                this.render();
            }
            else {
                this.target.once('afterrender', bind(this.render, this));
            }
        },

        /**
         * 初始化DOM结构，仅在第一次渲染时调用
         *
         * @protected
         */
        initDom: function () {
        },

        /**
         * 初始化所有事件监听
         *
         * @protected
         */
        initEvent: function () {
        },

        /**
         * 清理所有事件监听
         *
         * @protected
         */
        clearEvent: function () {
        },

        /**
         * 销毁插件
         *
         * @public
         * @fires Plugin#beforedispose
         * @fires Plugin#afterdispose
         */
        dispose: function () {
            if (!this.is('dispose')) {
                /**
                 * @event Plugin#beforedispose
                 * @param {Object} ev 事件参数对象
                 * @param {string} ev.type 事件类型
                 * @param {Plugin} ev.target 触发事件的插件对象
                 */
                this.emit('beforedispose');

                // 清理相关事件
                this.clearEvent();

                // 释放控件引用
                this.target = null;

                /**
                 * @event Plugin#afterdispose
                 * @param {Object} ev 事件参数对象
                 * @param {string} ev.type 事件类型
                 * @param {Plugin} ev.target 触发事件的插件对象
                 */
                this.emit('afterdispose');

                // 清理自定义事件
                this.off();

                // 更新状态
                this.addState('dispose');
            }
        },

        /**
         * 启用插件
         *
         * @public
         * @fires Plugin#enable
         */
        enable: function () {
            if (this.is('disable')) {
                this.removeState('disable');

                /**
                 * @event Plugin#enable
                 * @param {Object} ev 事件参数对象
                 * @param {string} ev.type 事件类型
                 * @param {Plugin} ev.target 触发事件的插件对象
                 */
                this.emit('enable');
            }

            return this;
        },

        /**
         * 禁用插件
         *
         * @public
         * @fires Plugin#disable
         */
        disable: function () {
            if (!this.is('disable')) {
                this.addState('disable');

                /**
                 * @event Plugin#disable
                 * @param {Object} ev 事件参数对象
                 * @param {string} ev.type 事件类型
                 * @param {Plugin} ev.target 触发事件的插件对象
                 */
                this.emit('disable');
            }

            return this;
        },

        /**
         * 重绘插件
         *
         * @protected
         */
        repaint: function () {
        },

        /**
         * 渲染控件
         *
         * @protected
         * @fires Plugin#beforerender
         * @fires Plugin#afterrender
         */
        render: function () {
            var rendered = this.is('render');

            if (!rendered) {
                this.addState('render');

                /**
                 * @event Plugin#beforerender
                 * @param {Object} ev 事件参数对象
                 * @param {string} ev.type 事件类型
                 * @param {Plugin} ev.target 触发事件的插件对象
                 */
                this.emit('beforerender');

                // DOM初始化
                this.initDom();

                // 事件初始化
                this.initEvent();
            }

            // DOM重绘
            this.repaint();

            if (!rendered) {
                /**
                 * @event Plugin#afterrender
                 * @param {Object} ev 事件参数对象
                 * @param {string} ev.type 事件类型
                 * @param {Plugin} ev.target 触发事件的插件对象
                 */
                this.emit('afterrender');
            }

            return this;
        }

    };


    // 混入 `定义事件`、`状态管理` 支持
    extend(
        Plugin.prototype,
        require('../base/event'),
        require('../base/state')
    );


    return Plugin;

});
