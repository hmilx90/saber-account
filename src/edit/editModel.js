/**
 * @file 移动记账本编辑页面 
 * @author linjing03@
 */

define(function (require) {

    var Resolver = require('saber-promise');
    var query = require('../common/js/Data-manage');
    
    var config = {};
    var local = localforage;

    config.fetch = function () {
        return Resolver.resolved();
    };

    /*
    * 从明细页面跳过来的时候，将数据回填；
    */
    config.getData = function (callback) {
        var resolver = new Resolver();
        var id = query.getId();
        if (!id) {
            resolver.reject();
        }
        local.getItem('list', function (err, list) {
            if (id && list[id]) {
                data = list[id];
                resolver.resolve(data);
            }
        });
        return resolver.promise();
    }
    return config;

});
