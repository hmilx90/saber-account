/**
 * @file 
 * @author wangshuo16
 */

define(function (require) {
    
    var Resolver = require('saber-promise');

    var config = {};

    config.fetch = function () {
        var dbHelper = require('../common/js/Data-manage');
        // 获取当前月份的收入和支出总额。 当前月份只需要传入null即可。
        return dbHelper.calcDataByMonth(null, null);
    };

    return config;
    

});
