/**
 * @file app
 */

define(function (require) {
    var Resolver = require('saber-promise');
    var firework = require('saber-firework');

    Resolver.disableExceptionCapture();

    firework.load({path: '/', action: require('./index')});
    firework.load({path: '/detail', action: require('./detail')});

    firework.start('viewport');
});
