define(function (require) {

    var runner = require('saber-run');

    var view = {};

    function parseNumber(args, parser) {

        args.forEach(function (item, index) {
            if (parser) {
                item = parser(item);
            }
            else {
                item = parseInt(item, 10);
            }
            if (isNaN(item)) {
                args[index] = null;
            }
            else {
                args[index] = item;
            }
        });

        return args;
    }

    var argumentParser = {
            move: parseNumber,
            moveTo: parseNumber,
            rotate: parseNumber,
            skew: parseNumber,
            scale: function (args) {
                return parseNumber(args, parseFloat);
            },
            scaleTo: function (args) {
                return parseNumber(args, parseFloat);
            },
            duration: function (args) {
                return parseNumber(args, parseFloat);
            },
            delay: function (args) {
                return parseNumber(args, parseFloat);
            }
        };

    function initView() {
        view.panel = document.getElementById('panel');
        view.animation = runner.animation(document.getElementById('box'));
        view.btnRun = document.getElementById('btnRun');
        view.btnEnd = document.getElementById('btnEnd');
    }

    function methodItemClick(ele) {
        if (ele.className.indexOf('item-active') >= 0) {
            ele.className = ele.className.replace(/\s*item-active/g, '');
        }
        else {
            ele.className += ' item-active';
        }
    }

    function resetMethodItems() {
        var items = document.querySelectorAll('p.item-active', view.panel);

        for (var i = 0, item; item = items[i]; i++) {
            item.className = item.className.replace(/\s*item-active/g, '');
        }
    }

    function bindEvents() {
        view.panel.onclick = function (e) {
            e = e || window.event;
            var target = e.target || e.srcElement;

            if (target.tagName.toLowerCase() == 'strong') {
                target = target.parentNode;
            }

            if (target.tagName.toLowerCase() == 'p'
                && target.className.indexOf('item') >= 0
            ) {
                methodItemClick(target);
            }
        };

        view.btnRun.onclick = function () {
            var items = view.panel.querySelectorAll('p.item-active');

            if (items.length <= 0) {
                alert('Please select methods')
                return;
            }
            
            var method;
            var args;
            var parser;
            for (var i = 0, item; item = items[i]; i++) {
                method = item.getAttribute('data-method');
                args = item.querySelector('input[type=text]')
                        .value.trim().split(/\s*,\s*/);
                parser = argumentParser[method];
                if (parser) {
                    args = parser(args);
                }
                view.animation[method].apply(view.animation, args);
            }
            
            view.btnRun.disabled = true;
            view.btnEnd.disabled = false;
            view.animation.run().finish(function () {
                view.btnRun.disabled = false;
                view.btnEnd.disabled = true;
            });
        };

        view.btnEnd.onclick = function () {
            view.animation.end();
        };
    }
    
    return {
        enter: function () {
            initView();
            bindEvents();
        }
    };
});
