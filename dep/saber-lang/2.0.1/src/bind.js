/**
 * @file bind
 * @author treelite(c.xinle@gmail.com)
 */

define(function () {

    /**
     * 为函数绑定this与前置参数
     *
     * @param {Function} fn 需要操作的函数
     * @param {Object} thisArg 需要绑定的this
     * @param {...*} as 函数执行时附加的前置绑定参数
     * @return {Function}
     */
    function bind(fn, thisArg) {
        var args = Array.prototype.slice.call(arguments, 2);
        return function () {
            return fn.apply(
                thisArg,
                // 绑定参数先于扩展参数
                // see http://es5.github.io/#x15.3.4.5.1
                args.concat(Array.prototype.slice.call(arguments))
            );
        };
    }

    return bind;
});
