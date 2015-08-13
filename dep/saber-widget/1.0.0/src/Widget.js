/**
 * Saber Widget
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file 基类
 * @author zfkun(zfkun@msn.com)
 */

define(function (require) {

    var extend = require('saber-lang/extend');
    var main = require('./main');


    /**
     * 控件基类
     * 禁止实例化，只能继承
     *
     * @constructor
     * @exports Widget
     * @class
     * @mixes event
     * @mixes state
     * @mixes dom
     * @mixes attribute
     * @requires saber-lang
     * @requires saber-dom
     * @requires saber-emitter
     * @fires Widget#init
     * @fires Widget#beforerender
     * @fires Widget#afterrender
     * @fires Widget#beforedispose
     * @fires Widget#afterdispose
     * @fires Widget#enable
     * @fires Widget#disable
     * @fires Widget#propertychange
     * @param {Object=} options 初始化配置参数
     * @param {string=} options.id 控件标识
     * @param {HTMLElement=} options.main 控件主元素
     * @param {*=} options.* 其余初始化参数由各控件自身决定
     */
    var Widget = function (options) {
        options = options || {};

        /**
         * 控件属性集
         *
         * @private
         * @type {Object}
         */
        this.attrs = extend(
            // `基类`默认属性集
            {},

            // `子类`默认属性集
                this.attrs || {},

            // 公共属性集
            {
                /**
                 * 控件类型标识
                 *
                 * @type {string}
                 */
                type: {

                    readOnly: true,

                    value: this.type

                },

                /**
                 * 控件`id`
                 *
                 * @type {string}
                 */
                id: {

                    readOnly: true,

                    getter: function () {
                        return this.id;
                    }

                },

                /**
                 * 控件主元素
                 *
                 * @type {HTMLElement}
                 */
                main: {

                    readOnly: true,

                    getter: function () {
                        return this.main;
                    }

                }

            }
        );

        /**
         * 控件状态集
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
         * 运行时缓存区
         *
         * @private
         * @type {Object}
         */
        this.runtime = {};


        // **只读**的**核心**属性需提前处理
        this.id = options.id || main.getGUID();
        this.main = require('saber-dom').query(options.main);

        // 初始化后立即从`options`里移除，以免`initOptions`触发`set`操作并抛异常
        delete options.id;
        delete options.main;

        // 初始化配置
        this.initOptions(options);

        // 存储实例
        main.add(this);

        // 更新状态
        this.addState('init');

        /**
         * @event Widget#init
         * @param {Object} ev 事件参数对象
         * @param {string} ev.type 事件类型
         * @param {Widget} ev.target 触发事件的控件对象
         */
        this.emit('init');
    };

    Widget.prototype = {

        constructor: Widget,

        /**
         * 控件类型标识
         *
         * @readonly
         * @type {string}
         */
        type: 'Widget',

        /**
         * 初始化控件选项
         *
         * @protected
         * @param {Object} options 构造函数传入的选项
         * @param {string=} options.id 控件标识
         * @param {HTMLElement=} options.main 控件主元素
         * @param {*=} options.* 其余初始化参数由各控件自身决定
         */
        initOptions: function (options) {

            // 过滤 `onxxx` 形式参数并自动化绑定
            // 过滤 `public` 方法重载
            options = processEventHandlerAndOverrideMethod.call(this, options);

            // 这里做了下对象克隆，以防各种不可预知的覆盖错误
            this.options = extend({}, options);

            this.set(this.options);
        },

        /**
         * 初始化DOM结构，仅在第一次渲染时调用
         *
         * @protected
         */
        initDom: function () {
        },

        /**
         * 初始化DOM相关事件，仅在第一次渲染时调用
         *
         * @protected
         */
        initEvent: function () {
        },

        /**
         * 渲染控件
         *
         * @protected
         * @fires Widget#beforerender
         * @fires Widget#afterrender
         */
        render: function () {
            var rendered = this.is('render');

            if (!rendered) {
                /**
                 * @event Widget#beforerender
                 * @param {Object} ev 事件参数对象
                 * @param {string} ev.type 事件类型
                 * @param {Widget} ev.target 触发事件的控件对象
                 */
                this.emit('beforerender');

                // DOM初始化
                this.initDom();

                // 事件初始化
                this.initEvent();

                // 为控件主元素添加控件实例标识属性
                this.get('main').setAttribute(main.getConfig('instanceAttr'), this.get('id'));

                this.addState('render');
            }

            // DOM重绘
            this.repaint();

            if (!rendered) {
                /**
                 * @event Widget#afterrender
                 * @param {Object} ev 事件参数对象
                 * @param {string} ev.type 事件类型
                 * @param {Widget} ev.target 触发事件的控件对象
                 */
                this.emit('afterrender');
            }

            return this;
        },

        /**
         * 重新渲染视图
         * 首次渲染时, 不传入变更属性集合参数
         *
         * @protected
         * @param {Object=} changes 变更过的属性的集合
         * 每个**属性变更对象**结构如下
         * `属性名`：[ `变更前的值`, `变更后的值` ]
         */
        repaint: function () {
        },

        /**
         * 销毁控件
         *
         * @public
         * @fires Widget#beforedispose
         * @fires Widget#afterdispose
         */
        dispose: function () {
            if (!this.is('dispose')) {
                /**
                 * @event Widget#beforedispose
                 * @param {Object} ev 事件参数对象
                 * @param {string} ev.type 事件类型
                 * @param {Widget} ev.target 触发事件的控件对象
                 */
                this.emit('beforedispose');

                // 先禁用控件
                this.disable();

                // 清理运行时缓存区
                this.runtime = null;

                // 清理DOM事件
                this.clearEvents();

                // 清理实例存储
                main.remove(this);

                // 清除已激活插件
                main.disposePlugin(this);

                /**
                 * @event Widget#afterdispose
                 * @param {Object} ev 事件参数对象
                 * @param {string} ev.type 事件类型
                 * @param {Widget} ev.target 触发事件的控件对象
                 */
                this.emit('afterdispose');

                // 清理自定义事件
                this.off();

                // 更新状态
                this.addState('dispose');

                // 移除控件主元素实例标识属性
                this.main.removeAttribute(main.getConfig('instanceAttr'));

                // 释放主元素引用
                this.main = null;
            }
        },

        /**
         * 启用控件
         *
         * @public
         * @fires Widget#enable
         * @return {Widget} 当前实例
         */
        enable: function () {
            if (this.is('disable')) {
                this.removeState('disable');

                /**
                 * @event Widget#enable
                 * @param {Object} ev 事件参数对象
                 * @param {string} ev.type 事件类型
                 * @param {Widget} ev.target 触发事件的控件对象
                 */
                this.emit('enable');
            }

            return this;
        },

        /**
         * 禁用控件
         *
         * @public
         * @fires Widget#disable
         * @return {Widget} 当前实例
         */
        disable: function () {
            if (!this.is('disable')) {
                this.addState('disable');

                /**
                 * @event Widget#disable
                 * @param {Object} ev 事件参数对象
                 * @param {string} ev.type 事件类型
                 * @param {Widget} ev.target 触发事件的控件对象
                 */
                this.emit('disable');
            }

            return this;
        },


        /**
         * 获取控件激活的指定插件
         *
         * @param {string} pluginName 插件名称
         * @return {?Plugin} 插件实例
         */
        plugin: function (pluginName) {
            return (this.plugins || {})[ pluginName ];
        },

        /**
         * 激活插件
         *
         * @param {string} pluginName 插件名称
         * @param {string=} optionName 插件初始化配置名
         * @return {Widget} 当前控件实例
         */
        enablePlugin: function (pluginName, optionName) {
            main.enablePlugin(
                this,
                pluginName,
                (this.options.plugin || {})[ optionName || pluginName.toLowerCase() ]
            );
            return this;
        },

        /**
         * 禁用插件
         *
         * @param {string} pluginName 插件名称
         * @return {Widget} 当前控件实例
         */
        disablePlugin: function (pluginName) {
            main.disablePlugin(this, pluginName);
            return this;
        }

    };


    // 扩展 `自定义事件`、`状态`、`属性`、`DOM事件` 支持
    extend(
        Widget.prototype,
        require('./base/event'),
        require('./base/state'),
        require('./base/attribute'),
        require('./base/dom')
    );


    /**
     * 处理`onxxx`形式的自定义事件监听 和 `public`方法重载
     * 为节省一次遍历，特意融合2个任务在一起
     *
     * @inner
     * @param {Object} options 配置对象
     * @return {Object} 过滤掉`事件监听`和`重载方法`属性的配置对象
     */
    function processEventHandlerAndOverrideMethod(options) {
        var key, val;
        for (key in options) {
            if (!options.hasOwnProperty(key)) {
                continue;
            }

            val = options[ key ];

            // 自定义事件添加
            if (/^on[A-Z]/.test(key) && isFunction(val)) {
                // 移除on前缀，并转换第3个字符为小写，得到事件类型
                this.on(key.charAt(2).toLowerCase() + key.slice(3), val);
                delete options[ key ];
            }
            // `public`方法重载
            else if (isFunction(this[ key ]) && isFunction(val)) {
                this[ key ] = val;
                delete options[ key ];
            }
        }

        return options;
    }


    /**
     * 判断变量是否是函数
     *
     * @innder
     * @param {*} obj 目标变量
     * @return {boolean}
     */
    function isFunction(obj) {
        return 'function' === typeof obj;
    }


    return Widget;

});
