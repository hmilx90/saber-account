/**
 * Saber Widget
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file 轮播图翻转自适应插件
 * @author zfkun(zfkun@msn.com)
 */

define(function (require) {

    var Plugin = require('./Plugin');


    /**
     * 轮播图翻转自适应插件
     *
     * @class
     * @constructor
     * @exports SliderFlex
     * @extends Plugin
     * @requires saber-lang
     * @param {Slider} slider 轮播图控件实例
     * @param {Object=} options 插件配置项
     */
    var SliderFlex = function (slider, options) {
        Plugin.apply(this, arguments);
    };

    SliderFlex.prototype = {

        /**
         * 插件类型标识
         *
         * @private
         * @type {string}
         */
        type: 'SliderFlex',

        /**
         * 初始化所有事件监听
         *
         * @override
         */
        initEvent: function () {
            var slider = this.target;

            this.onRepaint = require('saber-lang').bind(this.repaint, this);

            // 添加屏幕旋转变化监听
            slider.addEvent(window, 'resize', this.onRepaint);
            slider.addEvent(window, 'orientationchange', this.onRepaint);
        },

        /**
         * 释放所有事件监听
         *
         * @override
         */
        clearEvent: function () {
            var slider = this.target;

            // 移除屏幕旋转变化监听
            slider.removeEvent(window, 'resize', this.onRepaint);
            slider.removeEvent(window, 'orientationchange', this.onRepaint);

            this.onRepaint = null;
        },

        /**
         * 重置插件
         *
         * @public
         */
        repaint: function () {
            if (this.is('disable')) {
                return;
            }

            var slider = this.target;

            if (slider.is('disable')) {
                return;
            }

            // 若控件已处于暂停状态，则需要保持状态，防止重绘后产生意外恢复的问题
            var isSliderPaused = slider.is('pause');

            // 处理前，若控件是暂停状态，这里就不需要暂停了 (其实调了也会被忽略~)
            if (!isSliderPaused) {
                slider.pause();
            }

            // 重绘尺寸 & 重新切换一下使新尺寸立即生效
            slider._resize().to(slider.get('index'));

            // 处理前，若控件是暂停状态，这里就不需要恢复了
            if (!isSliderPaused) {
                slider.resume();
            }
        }

    };

    require('saber-lang').inherits(SliderFlex, Plugin);

    require('../main').registerPlugin(SliderFlex);

    return SliderFlex;

});
