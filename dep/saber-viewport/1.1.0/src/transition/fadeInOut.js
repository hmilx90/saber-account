/**
 * @file 淡入淡出
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var util = require('../util');
    var config = require('../config');
    var runner = require('saber-run');

    function fadeInOut(resolver, options) {
        var duration = options.duration || config.duration;
        var timing = options.timing || config.timing;
        var backPage = options.backPage;
        var frontPage = options.frontPage;
        var backEle = backPage.main;
        var frontEle = frontPage.main;

        config.viewport.insertBefore(backEle, frontEle);
        var frontSize = util.getSize(frontEle);
        util.setStyles(backEle, {opacity: 0});
        util.setStyles(
            frontEle,
            {
                position: 'absolute',
                top: 0,
                left: 0,
                opacity: 1,
                width: frontSize.width + 'px'
            },
            true
        );

        runner.transition(
            frontEle,
            {opacity: 0},
            {
                duration: duration,
                timing: timing
            }
        );

        var promise = runner.transition(
            backEle,
            {opacity: 1},
            {
                duration: duration,
                timing: timing
            }
        );

        promise.then(function () {
            resolver.fulfill();
        });

    }

    require('../transition').register('fadeInOut', fadeInOut);

    return fadeInOut;
});
