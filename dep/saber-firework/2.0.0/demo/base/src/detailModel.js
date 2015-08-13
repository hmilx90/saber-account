/**
 * @file detail model
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var Resolver = require('saber-promise');

    var config = {};

    config.fetch = function (query) {
        return Resolver.resolved({name: 'Detail', query: JSON.stringify(query)});
    };

    return config;

});
