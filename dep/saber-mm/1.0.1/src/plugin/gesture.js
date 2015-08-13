/**
 * @file 手势插件 借助Hammer提供手势事件注册
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var hammer = require('hammer');
    var eventHelper = require('../event');

    var plugin = {};

    /**
     * 空函数
     *
     * @inner
     */
    function blank() {}

    /**
     * 插件初始化
     *
     * @public
     */
    plugin.init = function () {
        // 使用全局代理的方式
        // 不单独处理事件注册
        hammer(document.body);
    };

    /**
     * 事件检测
     * 判断是否由该插件来处理事件
     *
     * @public
     * @return {boolean}
     */
    plugin.detect = function () {
        // 已经使用全局代理
        // 不再需要使用由插件来完成事件绑定
        return false;
    };

    /**
     * 事件绑定
     *
     * @public
     * @param {HTMLElement} ele DOM元素
     * @param {string} type 事件类型
     * @param {Function} fn 事件处理函
     */
    plugin.on = blank;

    /**
     * 事件卸载
     *
     * @public
     * @param {HTMLElement} ele DOM元素
     * @param {string} type 事件类型
     * @param {Function} fn 事件处理函
     */
    plugin.off = blank;

    // 注册插件
    eventHelper.register(plugin);
});
