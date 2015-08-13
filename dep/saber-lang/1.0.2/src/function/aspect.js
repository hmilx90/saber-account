/**
 * saber-lang
 *
 * @file aspect
 * @author zfkun(zfkun@msn.com)
 */

define(function () {

    /**
     * Aspect
     *
     * @inner
     * @type {Object}
     */
    var Aspect = {};

    /**
     * before AOP
     *
     * @private
     * @param {string} method 欲AOP的目标方法名
     * @param {Function} fn AOP处理函数
     * @param {*} context `fn`调用时的上下文
     * @return {Object} 目标对象
     */
    Aspect.before = function (method, fn, context) {
        return aspectTo(this, 'before', method, fn, context);
    };

    /**
     * after AOP
     *
     * @private
     * @param {string} method 欲AOP的目标方法名
     * @param {Function} fn AOP处理函数
     * @param {*} context `fn`调用时的上下文
     * @return {Object} 目标对象
     */
    Aspect.after = function (method, fn, context) {
        return aspectTo(this, 'after', method, fn, context);
    };


    /**
     * 对`目标对象`的`指定方法`进行`AOP`包装
     *
     * @inner
     * @param {Object} target 目标对象
     * @param {string} type AOP方式,可取值 `before` | `after`
     * @param {string} method 欲AOP的目标对象的方法名
     * @param {Function} fn AOP处理函数
     * @param {*} context `fn`调用时的上下文
     * @return {Object} 目标对象
     */
    function aspectTo(target, type, method, fn, context) {
        var oriMethod = target[method];

        if (oriMethod) {
            if (type === 'before') {
                target[method] = function () {
                    // abort support
                    if (fn.apply(context || fn, arguments) !== false) {
                        oriMethod.apply(this, arguments);
                    }
                };
            }
            else if (type === 'after') {
                target[method] = function () {
                    oriMethod.apply(this, arguments);
                    fn.apply(context || fn, arguments);
                };
            }
        }

        return target;
    }


    /**
     * Aspect
     *
     * @exports Aspect
     * @type {Object}
     */
    var exports = {};

    /**
     * 将 `Aspect` 混入到目标对象
     *
     * @public
     * @param {Object} obj 目标对象
     * @return {Object} 混入 `Aspect` 后的目标对象
     */
    exports.mixin = function (obj) {
        // 省略了 hasOwnProperty 校验
        /* eslint-disable guard-for-in */
        for (var method in Aspect) {
            obj[method] = Aspect[method];
        }
        /* eslint-enable guard-for-in */
        return obj;
    };

    return exports;

});
