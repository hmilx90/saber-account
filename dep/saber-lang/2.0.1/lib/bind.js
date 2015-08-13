/**
 * @file bind
 * @author treelite(c.xinle@gmail.com)
 */

/**
 * 为函数绑定this与前置参数
 *
 * @param {Function} fn 需要操作的函数
 * @param {Object} thisArg 需要绑定的this
 * @param {...*} args 函数执行时附加的前置绑定参数
 * @return {Function}
 */
module.exports = function (fn) {
    var args = [];
    for (var i = 1; i < arguments.length; i++) {
        args.push(arguments[i]);
    }
    return fn.bind.apply(fn, args);
};
