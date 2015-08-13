/**
 * @file extend
 * @author treelite(c.xinle@gmail.com)
 */

function cpy(target, source) {
    for (var key in source) {
        if (source.hasOwnProperty(key)) {
            target[key] = source[key];
        }
    }
}

/**
 * 对象属性拷贝
 *
 * @param {Object} target 目标对象
 * @param {...Object} source 源对象
 * @return {Object}
 */
module.exports = function (target) {
    var source;
    for (var i = 1; i < arguments.length; i++) {
        source = arguments[i];

        if (!source) {
            continue;
        }

        cpy(target, source);
    }

    return target;
};
