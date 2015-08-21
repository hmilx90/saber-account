/**
 * @file 
 * @author linjing03@
 */

define(function (require) {

    var config = {};

    config.view = require('./indexView');

    config.model = require('./indexModel');

    var bind = require('saber-lang/bind');


    return config;

});
