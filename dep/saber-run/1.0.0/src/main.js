/**
 * @file saber-run
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var extend = require('saber-lang/extend');
    var Animation = require('./Animation');

    var exports = {};

    extend(exports, require('./transition'));
    extend(exports, require('./util'));

    exports.animation = function (ele, options) {
        return new Animation(ele, options);
    };

    return exports;
});
