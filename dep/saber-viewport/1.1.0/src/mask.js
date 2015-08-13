/**
 * @file mask
 * @author treelite(c.xinle@gmail.com)
 */

define(function () {

    var mask;
    var exports = {};

    /**
     * 阻止事件传播与默认行为
     *
     * @inner
     */
    function stopEvent(e) {
        e.stopPropagation();
        e.preventDefault();
    }

    /**
     * 创建DOM元素
     *
     * @inner
     */
    function create() {
        mask = document.createElement('div');
        mask.className = exports.className;
        mask.style.cssText += ';display:none;position:fixed;top:0;right:0;bottom:0;left:0;z-index:100';

        // 阻止touch事件
        // 防止页面滚动
        var events = ['touchstart', 'touchmove', 'touchend'];
        events.forEach(function (name) {
            mask.addEventListener(name, stopEvent, false);
        });
        document.body.appendChild(mask);

    }

    /**
     * mask样式名
     *
     * @type {string}
     */
    exports.className = 'saber-viewport-mask';

    /**
     * 显示mask
     *
     * @public
     */
    exports.show = function () {
        if (!mask) {
            create();
        }
        mask.style.display = '';
    };

    /**
     * 隐藏mask
     *
     * @public
     */
    exports.hide = function () {
        if (!mask) {
            create();
        }
        mask.style.display = 'none';
    };

    return exports;
});
