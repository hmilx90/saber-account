/**
 * @file Detail
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var Action = require('er/Action');

    function Detail() {
        Action.apply(this, arguments);
    }

    Detail.prototype = {
        viewType: require('./DetailView')
    };

    require('er/util').inherits(Detail, Action);

    return Detail;
});
