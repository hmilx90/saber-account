/**
 * Saber Widget
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file 图片查看器翻转自适应插件
 * @author zfkun(zfkun@msn.com)
 */

define(function (require) {

    var Plugin = require('./Plugin');


    /**
     * 图片查看器翻转自适应插件
     *
     * @class
     * @constructor
     * @exports ImageViewFlex
     * @extends Plugin
     * @requires saber-lang
     * @param {ImageView} imageview 图片查看器控件实例
     * @param {Object=} options 插件配置项
     */
    var ImageViewFlex = function (imageview, options) {
        Plugin.apply(this, arguments);
    };

    ImageViewFlex.prototype = {

        /**
         * 插件类型标识
         *
         * @private
         * @type {string}
         */
        type: 'ImageViewFlex',

        /**
         * 初始化所有事件监听
         *
         * @override
         */
        initEvent: function () {
            var imageview = this.target;

            this.onRepaint = require('saber-lang').bind(this.repaint, this);

            // 添加屏幕旋转变化监听
            imageview.addEvent(window, 'resize', this.onRepaint);
            imageview.addEvent(window, 'orientationchange', this.onRepaint);
        },

        /**
         * 释放所有事件监听
         *
         * @override
         */
        clearEvent: function () {
            var imageview = this.target;

            // 移除屏幕旋转变化监听
            imageview.removeEvent(window, 'resize', this.onRepaint);
            imageview.removeEvent(window, 'orientationchange', this.onRepaint);

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

            var imageview = this.target;

            if (imageview.is('disable')) {
                return;
            }

            // 重绘尺寸 & 重新切换一下使新尺寸立即生效
            imageview._resize().to(imageview.get('index'));
        }

    };

    require('saber-lang').inherits(ImageViewFlex, Plugin);

    require('../main').registerPlugin(ImageViewFlex);

    return ImageViewFlex;

});
