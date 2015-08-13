/**
 * saber-lang
 *
 * @file debounce
 * @author zfkun(zfkun@msn.com)
 */

define(function () {

    /**
     * 函数防抖
     * 指定间隔内的调用被延迟到下个间隔执行
     *
     * @param {Function} fn 执行函数
     * @param {number} wait 需要延迟等待的间隔(毫秒)
     * @param {boolean=} immediate 是否延迟启动前先立即调用执行`fn`
     * @return {Function} 包装过的新执行函数
     */
    function debounce(fn, wait, immediate) {

        var context;
        var args;
        var timer;
        var last;

        var task = function () {
            var diff = Date.now() - last;
            if (diff < wait && diff > 0) {
                timer = setTimeout(task, wait - diff);
            }
            else {
                timer = null;

                if (!immediate) {
                    fn.apply(context, args);
                    context = args = null;
                }
            }
        };

        return function () {
            context = this;
            args = arguments;
            last = Date.now();

            var isCallImmediate = wait <= 0 || immediate && !timer;

            if (wait > 0 && !timer) {
                timer = setTimeout(task, wait);
            }

            if (isCallImmediate) {
                fn.apply(context, args);
                context = args = null;
            }
        };
    }

    return debounce;

});
