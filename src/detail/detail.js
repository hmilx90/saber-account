/**
 * @file 
 * @author ()
 */

define(function (require) {

    var bind = require('saber-lang/bind');

    var config = {};

    config.view = require('./detailView');

    config.model = require('./detailModel');

    config.events = {
        'ready': function () {
            this.model.getData().then(bind(this.view.render(), this.view));
        }
    };

    return config;

});
