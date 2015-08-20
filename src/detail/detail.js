/**
 * @file 
 * @author ()
 */

define(function (require) {

    var config = {};

    config.view = require('./detailView');

    config.model = require('./detailModel');

    config.events = {
        'ready': function () {

        }
    };

    return config;

});
