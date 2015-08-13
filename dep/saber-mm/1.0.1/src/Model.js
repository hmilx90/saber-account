define(function (require, exports, module) {
    /**
     * @file Model
     * @author treelite(c.xinle@gmail.com)
     */

    var inherits = require('saber-lang').inherits;
    var extend = require('saber-lang').extend;
    var Resolver = require('saber-promise');
    var Abstract = require('./Abstract');

    /**
     * Model
     *
     * @constructor
     * @param {Object} options 参数
     */
    function Model(options) {
        Abstract.call(this, options);
        this.init();
    }

    inherits(Model, Abstract);

    /**
     * 初始化
     *
     * @public
     */
    Model.prototype.init = function () {
        // 实例化store
        // **浅拷贝**
        this.store = extend({}, this.store);

        Abstract.prototype.init.call(this);
    };

    /**
     * 设置数据
     *
     * @public
     * @param {string} name 名称
     * @param {*} value 值
     */
    Model.prototype.set = function (name, value) {
        this.store[name] = value;
    };

    /**
     * 获取数据
     *
     * @public
     * @param {string} name 数据名称
     * @return {*}
     */
    Model.prototype.get = function (name) {
        return this.store[name];
    };

    /**
     * 填充数据
     *
     * @public
     * @param {Object} data 数据
     */
    Model.prototype.fill = function (data) {
        this.store = extend(this.store, data);
    };

    /**
     * 删除数据
     *
     * @public
     * @param {string} name 数据名称
     * @return {*} 被删除的数据
     */
    Model.prototype.del = function (name) {
        var data = this.store[name];
        delete this.store[name];
        return data;
    };

    /**
     * 获取数据
     *
     * @public
     * @return {Promise}
     */
    Model.prototype.fetch = function () {
        return Resolver.resolved(this.query);
    };

    module.exports = Model;
});
