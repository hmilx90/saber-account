/**
 * saber-lang
 *
 * @file  curry
 * @author  firede[firede@firede.us]
 */

define(function () {

    /**
     * 为函数提前绑定前置参数（柯里化）
     *
     * @see http://en.wikipedia.org/wiki/Currying
     * @param {Function} fn 要绑定的函数
     * @param {...*} args 函数执行时附加到执行时函数前面的参数
     * @return {Function}
     */
    function curry(fn) {
        var xargs = [].slice.call(arguments, 1);
        return function () {
            var args = xargs.concat([].slice.call(arguments));
            return fn.apply(this, args);
        };
    }

    return curry;

});
