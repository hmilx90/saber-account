/**
 * saber-lang
 *
 * @file type
 * @author zfkun(zfkun@msn.com)
 */

define(function (require) {

    /**
     * type
     *
     * @exports type
     * @type {Object}
     */
    var exports = {};



    /**
     * 类型查询表
     *
     * @inner
     * @type {Object}
     */
    var class2type = {};

    // 填充初始化查询表
    'Boolean Number String Function Array Date RegExp Object Error'
    .split(' ')
    .forEach(
        function (name) {
            class2type['[object ' + name + ']'] = name.toLowerCase();
        }
   );



    /**
     * 获取变量类型
     *
     * @public
     * @param {*} obj 目标变量
     * @return {string} 类型名
     */
    exports.type = function (obj) {
        // 为节省对比次数这里使用 `==`, 比如 `undefined`, `null`
        return obj == null
            ? String(obj)
            : class2type[class2type.toString.call(obj)] || 'object';
    };

    /**
     * 检测变量是否为简单对象
     *
     * @public
     * @param {*} obj 目标变量
     * @return {boolean}
     */
    exports.isPlainObject = function (obj) {
        return 'object' === exports.type(obj) && Object.getPrototypeOf(obj) === Object.prototype;
    };

    /**
     * 检测变量是否为空的简单对象
     *
     * @public
     * @param {*} obj 目标变量
     * @return {boolean}
     */
    exports.isEmptyObject = function (obj) {
        if ('object' !== exports.type(obj)) {
            return false;
        }

        if (Object.keys(obj).length) {
            return false;
        }

        return true;
    };

    /**
     * 检测变量是否为空值类型
     * 目前 `[]`, `{}` 也算做空值
     *
     * @public
     * @param {*} obj 目标变量
     * @return {boolean}
     */
    exports.isEmpty = function (obj) {
        return null === obj
            || undefined === obj
            || '' === obj
            || (Array.isArray(obj) && 0 === obj.length)
            || exports.isEmptyObject(obj);
    };


    return exports;

});
