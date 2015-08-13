/**
 * @file camelize
 * @author Firede[firede@firede.us]
 */

define(function () {
    /**
     * 将CSS属性驼峰化
     *
     * @param {string} target 目标字符串
     * @return {string}
     */
    function camelize(target) {
        return target.trim().replace(/-+(.)?/g, function (match, chr) {
            return chr ? chr.toUpperCase() : '';
        });
    }

    return camelize;

});
