/**
 * @file index model
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var Resolver = require('saber-promise');

    var config = {};

    config.fetch = function () {
        return Resolver.resolved({name: 'Home'});
    };

    return config;

});
