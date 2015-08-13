/**
 * @file  数据
 * @author  Firede[firede@firede.us]
 */

define(function () {

    var exports = {};

    var attrPrefix = 'data-';

    /**
     * 设置data的值
     *
     * @param {HTMLElement} element 目标元素
     * @param {string} key data名
     * @param {string} value data值
     */
    exports.setData = function (element, key, value) {
        element.setAttribute(attrPrefix + key, value);
    };


    /**
     * 获取data的值
     *
     * @param {HTMLElement} element 目标元素
     * @param {string} key data名
     * @return {string|null} data值
     */
    exports.getData = function (element, key) {
        return element.getAttribute(attrPrefix + key);
    };

    /**
     * 删除指定的data项
     *
     * @param {HTMLElement} element 目标元素
     * @param {string} key data名
     */
    exports.removeData = function (element, key) {
        element.removeAttribute(attrPrefix + key);
    };

    return exports;

});
