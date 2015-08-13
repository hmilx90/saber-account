define(function (require) {

    var Resolver = require('saber-promise');

    var config = {};

    config.fetch = function () {
        return Resolver.rejected({name: 'error'});
    };

    return config;
});
