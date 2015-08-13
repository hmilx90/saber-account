/**
 * @file app main
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var er = require('er');
    var config = require('er/config');
    var viewport = require('saber-viewport/adapter/er');

    require('saber-viewport/transition/slide');
    require('../hospital/config');
    require('../disease/config');

    return {
        init: function (ele) {
            viewport(ele, {
                transition: 'slide'
            });
            config.indexURL = '/hospital/home';
            er.start();
        }
    };
});
