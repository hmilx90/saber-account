/**
 * @file 
 * @author wangshuo16
 */

define(function (require) {

    var Resolver = require('saber-promise');

    var config = {};

    config.fetch = function () {
        var me = this;
        return Resolver.resolved(me.calcDate());

    };

    return config;

});
