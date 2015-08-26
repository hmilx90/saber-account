/**
 * @file dit action
 * @author linjing03
 */

define(function (require) {

    var config = {};

    config.view = require('./editView');

    config.model = require('./editModel');

    var bind = require('saber-lang/bind');


    config.events = {
        ready: function () {
            var me = this;
            this.model.getData().then(function (data) {
                bind(me.view.renderPage(data), me.view);
            });
        }
    };


    return config;

});
