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
            var me = this;
            me.model.getData().then(function (data) {
                me.model.countDataPerDay(data);
                bind(me.view.renderCharts(), me.view);
            });
        }
    };

    return config;

});
