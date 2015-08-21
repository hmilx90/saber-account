/**
 * @file 数据库基本的CRUD
 * @author cyj(cuiyongjian@outlook.com)
*/

define(function (require) {
    var exports = {};
    localforage.config({
        name        : 'myApp',
        version     : 1.0,
        storeName   : 'db_account', // Should be alphanumeric, with underscores.
        description : 'this is a db for account'
    });

    /**
     * 添加纪录
     *
     * @param {string} key 待添加的键
     * @param {Object} obj 待添加的值
    */
    exports.create = function (key, obj) {
        return localforage.setItem(key, obj);
    }


    /**
     * 删除纪录
     *
     * @param {string} key 待删除的键
    */
    exports.delete = function (key) {
        return localforage.removeItem(key);
    }

    /**
     * 修改纪录
     *
     * @param {string} key 待修改的键
    */
    exports.update = function (key, obj) {
        return localforage.setItem(key, obj);
    }

    /**
     * 查询纪录
     *
     * @param {string} key 待查询的键
    */
    exports.get = function (key) {
        return localforage.getItem(key);
    }

    return exports;
});