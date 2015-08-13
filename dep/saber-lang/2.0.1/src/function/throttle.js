/**
 * saber-lang
 *
 * @file throttle
 * @author zfkun(zfkun@msn.com)
 */

define(function () {

    /**
     * 函数节流
     * 忽略指定间隔内的函数调用
     *
     * @param {Function} fn 执行函数
     * @param {number} wait 下次执行前需等待的毫秒数(即节流阀值)
     * @param {Object=} options 配置项
     * @param {boolean=} optinos.leading 是否首次立即执行一次`fn`, 默认`true`
     * @param {boolean=} options.trailing 是否停止后延迟执行一次`fn`, 默认`true`
     * @param {*=} options.context `fn`执行时的上下文环境, 默认`this`
     * @return {Function} 包装过的新执行函数
     */
    function throttle(fn, wait, options) {
        options = options || {};

        var context;
        var args;
        var timer;
        var last = 0;

        var task = function () {
            last = options.leading === false ? 0 : Date.now();
            fn.apply(options.context || context, args);
            timer = null;
        };

        return function () {
            context = this;
            args = arguments;

            var now = Date.now();

            if (!last && options.leading === false) {
                last = now;
            }

            var remaining = wait - (now - last);
            if (remaining <= 0 || remaining > wait) {
                timer = clearTimeout(timer);
                last = now;
                fn.apply(options.context || context, args);
            }
            else if (!timer && options.trailing !== false) {
                timer = setTimeout(task, remaining);
            }
        };
    }

    return throttle;

});
