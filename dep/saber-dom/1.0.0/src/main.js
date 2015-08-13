/**
 * @file  DOM模块
 * @author  Firede[firede@firede.us]
 */

define(function (require) {

    var exports = {};

    function extend(target, source) {
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key];
            }
        }
        return target;
    }

    extend(exports, require('./selector'));
    extend(exports, require('./css'));
    extend(exports, require('./traversal'));
    extend(exports, require('./data'));

    return exports;
});
