/**
 * @file Home
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var Action = require('er/Action');

    function Home() {
        Action.apply(this, arguments);
    }

    Home.prototype = {
        viewType: require('./HomeView')
    };

    require('er/util').inherits(Home, Action);

    return Home;
});
