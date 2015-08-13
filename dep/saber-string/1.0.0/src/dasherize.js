/**
 * @file dasherize
 * @author Firede[firede@firede.us]
 */

define(function () {
    /**
     * 转换为中线链接命名
     * 将JavaScript变量转为CSS习惯命名
     *
     * @param {string} target 目标字符串
     * @return {string}
     */
    function dasherize(target) {
        return target.trim()
            .replace(/([A-Z])/g, '-$1')
            .replace(/[-_\s]+/g, '-')
            .toLowerCase();
    }

    return dasherize;

});
