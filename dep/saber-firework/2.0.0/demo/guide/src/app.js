/**
 * @file app
 */

define(function (require) {

    var firework = require('saber-firework');

    firework.load([
        // 配置首页
        {path: '/', action: require('./index')}
    ]);

	// Engine start ~
    firework.start('viewport');

});
