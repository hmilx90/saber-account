/**
 * Saber Widget
 * Copyright 2013 Baidu Inc. All rights reserved.
 *
 * @file event
 * @author zfkun(zfkun@msn.com)
 */

define(function (require) {

    var Emitter = require('saber-emitter');


    /**
     * Emitter管理
     *
     * @exports event
     * @requires saber-lang
     * @type {Object}
     */
    var exports = {};


    // 混入 `Emitter` 支持
    Emitter.mixin(exports);

    /**
     * 触发自定义事件
     * 注: 监听器方法调用时第一个参数为如下的`Object`
     *    { `type`: 事件类型, `target`: 触发事件的控件对象 }
     *
     * @override
     * @param {string} type 事件名
     * @param {...args=} args 传递给监听器的参数，可以有多个
     * @example
     * // 很多类型事件监听的场景下，可共享同一个 handler 简化代码
     * var handler = function( ev ) {
     *     var args = [].slice.call( arguments, 1 );
     *     console.info( 'event[%s]: ', ev.type, args );
     * };
     * var b = new Button( { content: 'test', onInit: handler } );
     * b.on( 'propertychange', handler);
     * b.render();
     * b.set( 'content', 'foo' );
     * @return {Emitter}
     */
    exports.emit = function (type) {
        // 构造事件参数对象
        var ev = {type: type, target: this};

        // 构造新调用参数序列
        var args = [ev].concat(Array.prototype.slice.call(arguments, 1));

        // 先调用直接写在实例上的 "onxxx"
        var handler = this[ 'on' + type ];
        if ('function' === typeof handler) {
            handler.apply(this, args);
        }

        // 最终回到 `Emitter` 的 `emit` 方法
        // 使用调整后的新参数序列:
        // `type`, `ev`, `args`...
        Emitter.prototype.emit.apply(this, [type].concat(args));
    };


    return exports;

});
