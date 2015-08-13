/**
 * @file action config
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var actionsConfig = [
            {
                type: 'disease/home',
                path: '/disease/home'
            }
        ];

    var controller = require('er/controller');

    actionsConfig.forEach(function (item) {
        controller.registerAction(item);
    });

    var config = {};

    return config;

});
