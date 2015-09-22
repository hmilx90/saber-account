/**
 * @file 数据库基本的CRUD
 * @author linjing03@
*/

define(function (require) {
    var exports = {};
    localforage.config({
        name        : 'myApp',
        version     : 1.0,
        storeName   : 'db_account', // Should be alphanumeric, with underscores.
        description : 'this is a db for account'
    });

    exports.getTable = function (name) {
        return localforage.getItem(name).then(function (data) {
            if (!data) {
                data = {};
                return localforage.setItem(name, data).then(function (data) {
                    return data;
                });
            }
            return data;
        });
    }

    /**
     * 添加纪录
     *
     * @param {string} key 待添加的键
     * @param {Object} obj 待添加的值
    */
    exports.create = function (key, obj) {
        return this.getTable('list').then(function (list) {
            list[key] = obj;
            return localforage.setItem('list', list, function () {
                return obj;
            });
        });
    }


    /**
     * 删除纪录
     *
     * @param {string} key 待删除的键
    */
    exports.delete = function (key) {
        return this.getTable('list').then(function (list) {
            delete list[key];
            return localforage.setItem('list', list, function () {
                return key;
            });            
        });

    }

    /**
     * 修改纪录
     *
     * @param {string} key 待修改的键
    */
    exports.update = function (key, obj) {
        return this.getTable('list').then(function (list) {
            list[key] = obj;
            return localforage.setItem('list', list, function () {
                return obj;
            });
        });
    }

    /**
     * 查询纪录
     *
     * @param {string} key 待查询的键
    */
    exports.get = function (key) {
        return this.getTable('list').then(function (list) {
            return list[key];
        });
    }

    return exports;
});