/**
 * @file 
 * @author cuiyongjian(cuiyongjian@outlook.com)
 */

define(function (require) {

    var config = {};

    config.template = require('./index.tpl');
    config.className = 'welcome';
    config.domEvents = {
        'click: .welcome-btn button': function (ele, e) {
            this.redirect('/index');
        }
    };
    return config;

});
