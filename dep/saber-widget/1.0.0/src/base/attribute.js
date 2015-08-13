/**
 * Saber Widget
 * Copyright 2013 Baidu Inc. All rights reserved.
 *
 * @file attribute
 * @author zfkun(zfkun@msn.com)
 */

define(function (require) {

    var extend = require('saber-lang/extend');
    var Type = require('saber-lang/type');


    /**
     * 属性管理
     *
     * @exports attribute
     * @requires saber-lang
     * @type {Object}
     */
    var exports = {};


    /**
     * 获取属性
     *
     * @public
     * @param {string} name 属性名
     * @return {*} 返回目标属性的值
     */
    exports.get = function (name) {
        var attr = this.attrs[ name ] || {};
        return attr.getter ? attr.getter.call(this, attr.value, name) : attr.value;
    };

    /**
     * 设置属性
     *
     * @public
     * @param {string | Object} name 属性名
     * - 当为`string`类型时, 为属性名
     * - 当为`Object`类型时, 为包含`属性名:属性值`的对象
     * @param {*=} value 属性值
     * - 当`name`为`string`类型时, 为对应属性值
     * - 当`name`为`Object`类型时, 为配置对象`options`
     * @param {Object=} options 配置对象
     * @param {boolean} options.silent 是否静默模式, 默认`false`
     * 此配置为`true`时，属性的变化不会触发`propertychange`事件
     * @param {boolean} options.override 是否覆盖模式, 默认`false`
     * 当属性值是`简单对象`类型时,默认以`mixin`方式合并,此配置为`true`时，则直接覆盖
     * @throws 对**只读**属性赋值时会抛出异常
     * @fires Widget#propertychange
     */
    exports.set = function (name, value, options) {
        // 当前的属性集合
        var currentAttrs = this.attrs;


        // 待设置的属性集合: { 'key1': value1, 'key2': value2 ... }
        var newAttrs = {};

        // 参数多态处理
        if ('string' === typeof name) {
            newAttrs[ name ] = value;
        }
        else if ('object' === typeof name) {
            newAttrs = name;
            options = value;
        }


        options = options || {};

        var isInited = this.is('init');
        var repaintChanges = {};

        // 循环处理每个属性
        for (var key in newAttrs) {

            if (!newAttrs.hasOwnProperty(key)) {
                continue;
            }

            // 属性`key`的新值
            var newVal = newAttrs[ key ];

            // 属性`key`的当前状态
            var attr = currentAttrs[ key ] || (currentAttrs[ key ] = {});

            // 属性`key`只读时，立即抛出异常
            if (attr.readOnly || attr.readonly) {
                throw new Error('attribute is readOnly: ' + key);
            }

            // 属性`key`有`setter`方法，优先使用
            if (attr.setter) {
                attr.setter.call(this, newVal, key);
            }

            // 属性`key`的值若是`Object`
            // 且新值也是`Object`时,
            // 非覆盖模式需要`merge`防止丢失属性
            var oldValue = attr.value;
            if (!options.override && Type.isPlainObject(oldValue) && Type.isPlainObject(newVal)) {
                newVal = extend({}, oldValue, newVal);
            }

            // 更新属性`key`的值
            currentAttrs[ key ].value = newVal;

            // 忽略重复赋值
            if (isEqual(newVal, oldValue)) {
                continue;
            }

            // TODO: 是否有必要按属性触发? 或许集中在一起一次性通知更好? 暂时先这样吧
            // 未指定静默 或 非初始化阶段 才触发事件
            if (!options.silent && isInited) {
                /**
                 * @event Widget#propertychange
                 * @param {Object} ev 事件参数对象
                 * @param {string} ev.type 事件类型
                 * @param {Widget} ev.target 触发事件的控件对象
                 * @param {string} key 属性名
                 * @param {*} oldValue 变更前的属性值
                 * @param {*} newVal 变更后的属性值
                 */
                this.emit('propertychange', key, oldValue, newVal);
            }

            // 属性`key`的变化影响重绘，则加入重绘通知对象列表
            if (currentAttrs[ key ].repaint) {
                repaintChanges[ key ] = [oldValue, newVal];
            }
        }

        // 存在影响重绘的属性变更时执行一次重绘
        if (this.is('render') && Object.keys(repaintChanges).length > 0) {
            this.repaint(repaintChanges);
        }

    };


    /**
     * 判断变量是否相同
     *
     * @innder
     * @param {*} x 目标变量
     * @param {*} y 对比变量
     * @return {boolean}
     */
    function isEqual(x, y) {
        // 简单常规的
        if (x === y) {
            return true;
        }

        // 复杂非常规: 先对比类型, 不同直接返回
        var xType = Type.type(x);
        var yType = Type.type(y);
        if (xType !== yType) {
            return false;
        }

        // 简单原始类型: String, Number, Boolean
        var primitiveTypes = {

            // 'a', new String( 'a' ), new String( true ), new String( window ) ..
            'string': String,

            // 1, new Number( 1 ), new Number( '1' ) ..
            'number': Number,

            // true, new Boolean( true ), new Boolean( 'true' ), new Boolean( 'a' ) ..
            'boolean': Boolean

        };
        for (var type in primitiveTypes) {
            if (type === xType) {
                return x === primitiveTypes[ type ](y);
            }
        }

        // 数组类型: 数组中含有非原始类型值时暂时认为不相等
        if ('array' === xType) {
            var xyString = [x.toString(), y.toString()];
            return !/\[object\s/.test(xyString[ 0 ])
                && !/\[object\s/.test(xyString[ 1 ])
                && xyString[ 0 ] === xyString[ 1 ];
        }


        // 日期类型
        if ('date' === xType) {
            return +x === +y;
        }

        // 正则类型
        if ('regexp' === xType) {
            return xType.source === yType.source
                && xType.global === yType.global
                && xType.ignoreCase === yType.ignoreCase
                && xType.multiline === yType.multiline;
        }

        // 空值类型: null, undefined, '', [], {}
        if (Type.isEmpty(x) && Type.isEmpty(y)) {
            return true;
        }

        // 至此，非对象类型时，也直接 false
        if ('object' !== typeof x || 'object' !== typeof y) {
            return false;
        }

        // 普通对象类型时，浅对比(因要递归)
        if (Type.isPlainObject(x) && Type.isPlainObject(y)) {
            // 先对比`键`
            if (Object.keys(x).toString() !== Object.keys(y).toString()) {
                return false;
            }

            // 再对比`值`
            for (var k in x) {
                if (x[ k ] !== y[ k ]) {
                    return false;
                }
            }

            return true;
        }

        // 到此也够了 ~
        return false;

    }


    return exports;

});
