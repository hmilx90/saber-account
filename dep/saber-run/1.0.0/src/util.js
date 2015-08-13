/**
 * @file animation
 * @author treelite(c.xinle@gmail.com)
 */

define(function () {

    var exports = {};

    var rAF = window.requestAnimationFrame
        || window.webkitRequestAnimationFrame
        || window.mozRequestAnimationFrame
        || window.oRequestAnimationFrame
        || window.msRequestAnimationFrame
        || function (callback) {
            return setTimeout(callback, 1000 / 60);
        };

    var cRAF = window.cancelAnimationFrame
        || window.webkitCancelAnimationFrame
        || window.mozCancelAnimationFrame
        || window.oCancelAnimationFrame
        || window.msCancelAnimationFrame
        || function (idenity) {
            clearTimeout(idenity);
        };

    /**
     * 添加动画帧
     *
     * @public
     * @param {Function} callback 动画函数
     * @return {string} 动画帧Id 用于取消已添加的动画帧
     */
    exports.requestAnimationFrame = function (callback) {
        return rAF.call(window, callback);
    };

    /**
     * 取消已添加的动画帧
     *
     * @public
     * @param {string} idenity 动画帧Id
     */
    exports.cancelAnimationFrame = function (idenity) {
        cRAF.call(window, idenity);
    };

    return exports;
});
