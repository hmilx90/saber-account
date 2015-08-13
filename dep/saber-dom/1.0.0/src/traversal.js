/**
 * @file 遍历
 * @author  treelite[c.xinle@gmail.com],
 *          firede[firede@firede.us]
 */

define(function (require) {

    var matches = require('./selector').matches;

    var exports = {};

    /**
     * 获取元素的子节点
     *
     * @public
     * @param {HTMLElement} element 目标元素
     * @return {Array.<HTMLElement>} 子节点
     */
    exports.children = function (element) {
        var res = [];

        var items = element.children;
        for (var i = 0, item; item = items[i]; i++) { // jshint ignore:line
            if (item.nodeType === 1) {
                res.push(item);
            }
        }

        return res;
    };

    /**
     * 查找第一个匹配条件的祖先元素
     *
     * @param {HTMLElement} element 目标元素
     * @param {string} selector 查询条件
     * @param {HTMLElement} context 遍历范围
     * @return {HTMLElement|null} 匹配到的节点，找不到时返回null
     */
    exports.closest = function (element, selector, context) {
        context = context || document;

        do {
            if (matches(element, selector)) {
                return element;
            }

            if (element === context) {
                return null;
            }
        }
        while ((element = element.parentNode) && element !== document);

        return null;
    };

    return exports;
});
