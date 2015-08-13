/**
 * @file 工具
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var dom = require('saber-dom');

    var exports = {};

    /**
     * 设置元素样式
     *
     * @public
     * @param {HTMLElement} ele
     * @param {Object} propertys 样式
     * @param {boolean} forceRefresh 是否强制刷新
     */
    exports.setStyles = function (ele, propertys, forceRefresh) {
        Object.keys(propertys).forEach(function (name) {
            dom.setStyle(ele, name, propertys[name]);
        });
        forceRefresh && ele.offsetWidth;
    };

    /**
     * 获取元素的大小
     *
     * @public
     * @param {HTMLElement} ele
     * @return {Object}
     */
    exports.getSize = function (ele) {
        var items = ['top', 'right', 'bottom', 'left'];
        var res = {
                width: ele.clientWidth,
                height: ele.clientHeight
            };

        var value;
        items.forEach(function (name, index) {
            value = parseInt(dom.getStyle(ele, 'padding-' + name), 10);
            res[index % 2 ? 'width' : 'height'] -= value;
        });

        return res;
    };

    /**
     * 获取元素相对页面的位置
     *
     * @public
     * @param {HTMLElement} ele
     * @return {Object}
     */
    exports.getPosition = function (ele) {
        var pos = ele.getBoundingClientRect();

        var doc = document;

        pos.top += Math.max(
                        doc.documentElement.scrollTop,
                        doc.body.scrollTop
                    );

        pos.left += Math.max(
                        doc.documentElement.scrollLeft,
                        doc.body.scrollLeft
                    );

        return pos;
    };

    return exports;
});
