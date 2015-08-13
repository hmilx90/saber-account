/**
 * Saber Widget
 * Copyright 2013 Baidu Inc. All rights reserved.
 *
 * @file state
 * @author zfkun(zfkun@msn.com)
 */

define(function (require) {

    /**
     * 状态管理
     *
     * @exports state
     * @requires saber-lang
     * @type {Object}
     */
    var exports = {};


    /**
     * 控件是否处于指定状态
     *
     * @param {string} state 状态名
     * @return {boolean} 包含指定状态返回`true`
     */
    exports.is = function (state) {
        return !!this.states[ state ];
    };

    /**
     * 添加控件状态
     *
     * @public
     * @param {string} state 状态名
     */
    exports.addState = function (state) {
        this.states[ state ] = !0;
    };

    /**
     * 移除控件状态
     *
     * @public
     * @param {string} state 状态名
     */
    exports.removeState = function (state) {
        delete this.states[ state ];
    };

    /**
     * 反转控件状态
     *
     * @public
     * @param {string} state 状态名
     * @param {boolean=} isForce 强制指定添加或删除, 传入`true`则添加, 反之则删除
     */
    exports.toggleState = function (state, isForce) {
        isForce = 'boolean' === typeof isForce ? isForce : !this.is(state);
        this[ isForce ? 'addState' : 'removeState' ](state);
    };


    return exports;

});
