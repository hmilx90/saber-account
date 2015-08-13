/**
 * @file curry
 * @author treelite(c.xinle@gmail.com)
 */

/**
 * 为函数提前绑定前置参数（柯里化）
 *
 * @see http://en.wikipedia.org/wiki/Currying
 * @param {Function} fn 要绑定的函数
 * @param {...*} args 函数执行时附加到执行时函数前面的参数
 * @return {Function}
 */
module.exports = function (fn) {
    var args = [];
    for (var i = 1; i < arguments.length; i++) {
        args.push(arguments[i]);
    }

    return function () {
        var xargs = args.slice(0);
        for (var i = 0; i < arguments.length; i++) {
            xargs.push(arguments[i]);
        }
        return fn.apply(this, xargs);
    };
};
