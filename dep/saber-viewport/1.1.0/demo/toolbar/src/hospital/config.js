/**
 * @file action config
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var actionsConfig = [
            {
                type: 'hospital/home',
                path: '/hospital/home'
            },
            {
                type: 'hospital/detail',
                path: '/hospital/detail'
            }
        ];

    var controller = require('er/controller');

    actionsConfig.forEach(function (item) {
        controller.registerAction(item);
    });

    var config = {};

    return config;

});
