/**
 * @file Home View
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    require('er/tpl!./home.tpl.html');

    var View = require('er/View');
    var dom = require('saber-dom');

    function navClick(e) {
        var target = e.target;
        if (target.className.indexOf('button-nav') < 0
            || target.className.indexOf('cur') >= 0
        ) {
            return;
        }

        var cur = dom.query('.cur', target.parentNode);
        cur.className = cur.className.replace(/\s*cur/g, '');

        target.className += ' cur';
    }

    function HomeView() {
        View.apply(this, arguments);
    }

    HomeView.prototype.template = 'hospitalHome';

    HomeView.prototype.enterDocument = function () {
        var nav = dom.query('.nav');
        nav.addEventListener('click', navClick, false);
    };

    require('er/util').inherits(HomeView, View);

    return HomeView;
});
