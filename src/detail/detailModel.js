/**
 * @file 
 * @author ()
 */

define(function (require) {

    var Resolver = require('saber-promise');

    var config = {};

    config.fetch = function (query) {
        return Resolver.resolved(query);
    };

    return config;

});
