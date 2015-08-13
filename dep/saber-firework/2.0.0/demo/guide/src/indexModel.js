/**
 * @file index model
 */

 define(function (require) {

    var Resolver = require('saber-promise');

    var config = {};

    config.fetch = function () {
        return Resolver.resolved({name: 'saber'});
    };

    return config;

 });
