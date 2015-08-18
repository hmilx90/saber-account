/**
 * @file 移动记账本编辑页面 
 * @author linjing03@
 */

define(function (require) {

    var Resolver = require('saber-promise');

    var config = {};
    var local = localStorage;

    config.fetch = function (query) {
        //var data = this.getItemInfo(id);

        return Resolver.resolved();
    };

    /*
    * 从明细页面跳过来的时候，将数据回填；
    * @param {string} 每条数据的id;
    */
    config.getItemInfo = function (id) {
        var data = {};
        var list = JSON.parse(local.get('list'));
        if (id && list[id]) {
            data = list[id];
        }
        return data;

    }


    return config;

});
