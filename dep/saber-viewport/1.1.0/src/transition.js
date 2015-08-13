/**
 * @file 转场效果
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var Resolver = require('saber-promise');
    var config = require('./config');

    /**
     * 转场处理器
     *
     * @type {Object}
     */
    var handlers = {};

    /**
     * 页面转场
     *
     * @public
     * @param {string|boolean=} type 转场类型
     * @param {Object} options 转场参数
     */
    function transition(type, options) {
        var resolver = new Resolver();

        // 不进行转场动画
        if (config.transition === false
            || type === false
            || !options.frontPage // 没有前景页
            // 前景页与后景页容器元素相同
            // 被缓存的page同时加载两次时出现
            || options.frontPage.main === options.backPage.main
        ) {
            config.viewport.appendChild(options.backPage.main);
            resolver.fulfill();
        }
        else {
            var handler = handlers[type || config.transition];

            if (!handler) {
                throw new Error('can not find transition');
            }
            handler(resolver, options);
        }

        return resolver.promise();
    }

    /**
     * 注册转场处理器
     *
     * @public
     * @param {string} type 转场类型
     * @param {Function} handler 处理函数
     */
    transition.register = function (type, handler) {
        handlers[type] = handler;
    };

    return transition;
});
