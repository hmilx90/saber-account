/**
 * @file 
 * @author cuiyongjian(cuiyongjian@outlook.com)
 */

define(function (require) {

    var Resolver = require('saber-promise');
    var config = {};

    config.fetch = function () {
        return Resolver.resolved();
    };

    return config;

});
