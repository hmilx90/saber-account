/**
 * Saber Widget
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file 全屏遮罩插件
 * @author zfkun(zfkun@msn.com)
 */

define(function (require) {

    var dom = require('saber-dom');
    var Plugin = require('./Plugin');


    /**
     * 全屏遮罩插件
     *
     * @class
     * @constructor
     * @exports Masker
     * @extends Plugin
     * @requires saber-lang
     * @requires saber-dom
     * @param {Widget} widget 控件实例
     * @param {Object=} options 插件配置项
     */
    var Masker = function (widget, options) {
        Plugin.apply(this, arguments);
    };

    Masker.prototype = {

        /**
         * 插件类型标识
         *
         * @private
         * @type {string}
         */
        type: 'Masker',

        /**
         * 默认配置
         *
         * @type {Object}
         */
        options: {

            /**
             * 是否自动关闭
             * 遮罩区域被点击时自动关闭
             *
             * @type {boolean}
             */
            autoClose: false

        },


        /**
         * 渲染插件
         *
         * @override
         */
        initDom: function () {
            var main = this.main = document.createElement('div');
            main.className = 'ui-masker';
            main.innerHTML = '<div data-role="wrapper"></div>';
            dom.hide(main);

            // 为方便使用
            this.wrapper = main.firstChild;

            // 移动目标控件主元素到遮罩控件容器中
            this.wrapper.appendChild(this.target.get('main'));

            // 挂载到DOM树
            document.body.appendChild(main);
        },

        /**
         * 初始化所有事件监听
         *
         * @override
         */
        initEvent: function () {
            var self = this;

            if (self.options.autoClose) {
                this.target.addEvent(this.main, 'click', this.onClose = function (ev) {
                    self.disable();
                });
            }
        },

        /**
         * 清理所有事件监听
         *
         * @protected
         */
        clearEvent: function () {
            if (this.onClose) {
                this.target.removeEvent(this.main, 'click', this.onClose);
                this.onClose = null;
            }
        },


        /**
         * 启用插件
         *
         * @override
         */
        enable: function () {
            dom.show(this.main);

            Plugin.prototype.disable.call(this);

            return this;
        },

        /**
         * 禁用插件
         *
         * @override
         */
        disable: function () {
            dom.hide(this.main);

            Plugin.prototype.disable.call(this);

            return this;
        }

    };

    require('saber-lang').inherits(Masker, Plugin);

    require('../main').registerPlugin(Masker);

    return Masker;

});
