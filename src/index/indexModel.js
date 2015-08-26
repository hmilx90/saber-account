/**
 * @file
 * @author linjing03@
 */

define(function (require) {

    var extend = require('saber-lang').extend;
    var config = {};

    config.fetch = function () {
        var dataHelp = require('../common/js/Data-manage');
        return dataHelp.getAllTotal().then(function (data) {
            extend(data, {
                my_total: data.icm_total - data.exp_total
            });
            return data;
        }, function (err) {
            return {};
        });

    };


    return config;

});
