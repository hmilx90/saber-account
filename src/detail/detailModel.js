/**
 * @file 
 * @author wangshuo16
 */

define(function (require) {

    var Resolver = require('saber-promise');
    var dataManager = require('common/js/Data-manage');

    var config = {};

    config.fetch = function () {
        return this.getTotal();
    };

    config.getData = function () {
        return dataManager.getDataByMonth();
    };

    config.getTotal = function () {
        dataManager.getDataByMonth().then(function (data) {
            return dataManager.calcDate(data);
        });
    };

    return config;

});
