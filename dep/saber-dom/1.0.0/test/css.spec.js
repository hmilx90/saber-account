/**
 * css test case
 *
 * @author  firede[firede@firede.us],
 *          treelite[c.xinle@gmail.com],
 *          zfkun[zfkun@msn.com]
 */

define(function() {
    var dom = require('saber-dom');

    describe('CSS', function() {
        describe('css classes', function() {
            var el = dom.g('test-container');

            it('.addClass(element, className)', function() {
                dom.addClass(el, 'container');
                expect(el.className).toBe('container');
            });

            it('.hasClass(element, className)', function() {
                var res = dom.hasClass(el, 'container');
                expect(res).toBe(true);

                res = dom.hasClass(el, 'unknown');
                expect(res).toBe(false);
            });

            it('.removeClass(element, className)', function() {
                dom.removeClass(el, 'container');
                expect(el.className).toBe('');
            });

            it('.toggleClass(element, className)', function() {
                dom.toggleClass(el, 'container');
                expect(el.className).toBe('container');
                dom.toggleClass(el, 'container');
                expect(el.className).toBe('');
            });

            it('.toggleClass(element, className, isForce)', function() {
                dom.toggleClass(el, 'container', false);
                expect(el.className).toBe('');
                dom.toggleClass(el, 'container', true);
                dom.toggleClass(el, 'container', true);
                expect(el.className).toBe('container');
            });
        });

        describe('css styles', function() {
            it('.setStyle(element, property, value)', function() {
                var el = dom.query('.list .active');
                dom.setStyle(el, 'color', 'green');
                dom.setStyle(el, 'font-size', '18px');

                expect(el.style.color).toBe('green');
                expect(el.style.fontSize).toBe('18px');

                dom.setStyle(el, 'transition', 'none 0s');
                var prefixes = ['t', 'webkitT', 'msT', 'oT'];
                var pass = 0;
                prefixes.forEach(function (prefix) {
                    if (el.style[prefix + 'ransition'] == 'none 0s') {
                        pass++;
                    }
                });
                expect(pass >= 1).toBeTruthy();

                dom.setStyle(el, 'margin-top-collapse', 'separate');
                expect(el.style.webkitMarginTopCollapse).toEqual('separate');
            });

            it('.getStyle(element, property)', function() {
                var el = dom.query('.list li:nth-child(2)');

                expect(dom.getStyle(el, 'font-size')).toBe('11px');
                expect(dom.getStyle(el, 'color'))
                    .toBe('rgb(255, 255, 170)');

                dom.setStyle(el, 'transition', 'none 0s');
                expect(dom.getStyle(el, 'transition')).toBe('none 0s');
            });
        });

        describe('css shortcut', function() {
            var el = dom.g('li-item');

            it('.hide()', function() {
                dom.hide(el);
                expect(el.style.display).toBe('none');
            });

            it('.show()', function() {
                dom.show(el);
                expect(el.style.display).toBe('');
            });
        });

        describe('.position(element, offsetEle)', function () {
            it('absolute element widthout offset element', function () {
                var el = dom.g('test-container');
                var pos = dom.position(el);

                expect(Object.keys(pos).length).toBe(2);
                expect(pos.left).toBe(-9999);
                expect(pos.top).toBe(-9999);
            });

            it('absolute element width offset element', function () {
                var el = dom.g('fly');
                var outer = dom.g('test-container');
                var pos = dom.position(el, outer);

                expect(pos.left).toBe(150);
                expect(pos.top).toBe(100);
            });

            it('static element widthout offset element', function () {
                var el = dom.g('title');
                var pos = dom.position(el);

                expect(pos.left).toBe(-9994);
                expect(pos.top).toBe(-9989);
            });

            it('static element width offset element', function () {
                var el = dom.g('title');
                var outer = dom.g('test-container');
                var pos = dom.position(el, outer);

                expect(pos.left).toBe(5);
                expect(pos.top).toBe(10);
            });
        });
    });

});
