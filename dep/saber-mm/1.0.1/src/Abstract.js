define(function (require, exports, module) {
    /**
     * @file Abstract
     * @author treelite(c.xinle@gmail.com)
     */

    var Emitter = require('saber-emitter');
    var extend = require('saber-lang').extend;
    var bind = require('saber-lang').bind;
    var inherits = require('saber-lang').inherits;

    /**
     * 绑定事件
     *
     * @inner
     * @param {Object} abs 对象
     */
    function bindEvents(abs) {
        var events = abs.events || {};

        var fn;
        Object.keys(events).forEach(function (name) {
            fn = events[name];
            // 没有':'表示abs事件
            if (name.indexOf(':') < 0) {
                abs.on(name, fn);
            }
            // 有':'表示绑定组件事件(view或者model的事件)
            // e.g: view:add
            else {
                var items = name.split(':');
                var item = items[0].trim();

                name = items[1] && items[1].trim();
                if (item && abs[item] && name) {
                    abs[item].on(name, bind(fn, abs));
                }
            }
        });
    }

    /**
     * Abstract
     *
     * @constructor
     * @param {Object} options 配置参数
     * @param {Object} options.events 事件配置
     */
    function Abstract(options) {
        options = options || {};
        extend(this, options);
    }

    // 使用继承而非mixin能提升性能
    inherits(Abstract, Emitter);

    /**
     * 初始化
     *
     * @public
     */
    Abstract.prototype.init = function () {
        bindEvents(this);
        this.emit('init');
    };

    /**
     * 销毁
     *
     * @public
     */
    Abstract.prototype.dispose = function () {
        // 注销所有事件
        this.off();
    };

    module.exports = Abstract;
});
