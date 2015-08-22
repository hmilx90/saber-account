/**
 * @file 
 * @author ()
 */

define(function (require) {

    var config = {};

    config.view = require('./listView');

    config.model = require('./listModel');

    config.events = {
        sleep: function () {
            this.scrollTop = document.body.scrollTop;
            this.activeDate = this.view.activeDate;
        },
        wakeup: function () {
            document.body.scrollTop = this.scrollTop;
            this.model.activeDate = this.activeDate;
        }
    }

    return config;

});
