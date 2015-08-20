/**
 * @file 汽泡提示浮层
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var dom = require('saber-dom');

    var TIME = 2 * 1000;
    var HIDDEN_CLASS = 'ui-balloon-hidden';

    var main;
    var timer;

    function createElement() {
        var ele = document.createElement('div');
        ele.className = 'ui-balloon ' + HIDDEN_CLASS;
        document.body.appendChild(ele);
        return ele;
    }

    return function (text) {
        if (!main) {
            main = createElement();
        }

        main.innerHTML = text;

        if (timer) {
            clearTimeout(timer);
        }
        else {
            dom.removeClass(main, HIDDEN_CLASS);
        }

        timer = setTimeout(
            function () {
                dom.addClass(main, HIDDEN_CLASS);
                timer = null;
            },
            TIME
        );
    };

});
