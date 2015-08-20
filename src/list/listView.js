/**
 * @file 
 * @author ()
 */

define(function (require) {

    var config = {};
    var dom = require('saber-dom');
    var router = require('saber-router');

    config.template = require('./list.tpl');
    config.domEvents = {
        'click: h4': function (ele, e) {
            dom.toggleClass(ele.parentNode, 'toggle');

        }
    };

    return config;

});
