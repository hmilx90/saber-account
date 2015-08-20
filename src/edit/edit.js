/**
 * @file 
 * @author ()
 */

define(function (require) {

    var config = {};

    config.view = require('./editView');

    config.model = require('./editModel');

    var bind = require('saber-lang/bind');


    config.events = {
        ready: function () {
            var _this = this;
            this.model.getData().then(function(data){
                bind(_this.view.renderPage(data),_this.view);
            })
        }
    }


    return config;

});
