/**
 * @file view spec
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var dom = require('saber-dom');
    var Abstract = require('saber-mm/AbstractView');
    var View = require('saber-mm/View');

    var widget = require('saber-widget');
    var Widget = require('saber-widget/Widget');

    function Slider() {
        Widget.apply(this, arguments);
    }

    Slider.prototype.type = 'Slider';

    require('saber-lang/inherits')(Slider, Widget);

    widget.register(Slider);

    function fireEvent(ele, type, proto) {
        var e = document.createEvent('Event');
        e.initEvent(type, true, true);
        if (proto) {
            extend(e, proto);
        }
        ele.dispatchEvent(e);
    }

    describe('View', function () {

        var main;

        beforeEach(function () {
            main = document.createElement('div');
            main.style.cssText += ';position:absolute;top:-1000px;left:-1000px';
            document.body.appendChild(main);
        });

        afterEach(function () {
            document.body.removeChild(main);
            main = null;
        });

        it('should inherited abstract', function () {
            var view = new View();
            expect(view instanceof Abstract).toBeTruthy();
        });

        it('.ready() should bind dom events', function (done) {
            var tpl = '<!-- target:readyMain --><div class="box"><div class="inner"></div></div>';
            var fn = jasmine.createSpy('fn');
            var view = new View({
                    main: main,
                    template: tpl,
                    templateMainTarget: 'readyMain',
                    domEvents: {
                        'click:.box': fn
                    }
                });

            view.render();
            view.ready();

            var ele = dom.query('.box', main);
            fireEvent(dom.query('.inner', main), 'click');

            setTimeout(function () {
                expect(fn.calls.any()).toBeTruthy();
                expect(fn.calls.argsFor(0)[0]).toBe(ele);
                done();
            }, 0);
        });

        it('.addDomEvent() should bind dom events', function (done) {
            var view = new View({
                    main: main,
                    template: '<div class="box"><div class="inner"></div></div>'
                });

            view.render();

            var thisObj;
            var element = dom.query('.box', main);
            view.addDomEvent(element, 'click', function (ele) {
                expect(ele).toBe(element);
                thisObj = this;
            });

            fireEvent(dom.query('.inner', main), 'click');

            setTimeout(function () {
                expect(thisObj).toBe(view);
                done();
            }, 0);
        });

        it('.removeDomEvent() should unbind dom events', function (done) {
            var fn = jasmine.createSpy('fn');
            var view = new View({
                    main: main,
                    template: '<div class="box"><div class="inner"></div></div>'
                });

            view.render();

            var element = dom.query('.box', main);
            view.addDomEvent(element, 'click', fn);

            view.removeDomEvent(element, 'click', fn);

            fireEvent(dom.query('.inner', main), 'click');

            setTimeout(function () {
                expect(fn.calls.any()).toBeFalsy();
                done();
            }, 0);
        });


        it('.dipose() should detach all dom events', function (done) {
            var tpl = '<!-- target:disposeMain --><div class="box"><div class="inner"></div></div>';
            var fn = jasmine.createSpy('fn');
            var view = new View({
                    main: main,
                    template: tpl,
                    templateMainTarget: 'disposeMain',
                    domEvents: {
                        'click:.box': fn,
                        'click': fn
                    }
                });

            view.render();
            view.ready();
            view.dispose();

            fireEvent(dom.query('.inner', main), 'click');

            setTimeout(function () {
                expect(fn.calls.count()).toBe(0);
                done();
            }, 0);

        });

        it('.dipose() should dipose all widget', function () {
                var tpl = '<div class="slider"><div></div></div>';
                var view = new View({
                        main: main,
                        template: tpl
                    });

                view.render();
                var ele = view.query('.slider');
                var widget = require('saber-widget');
                var slider = widget.slider(ele, {id: 'slider'});

                expect(widget.get('slider')).toBe(slider);

                view.dispose();

                expect(widget.get('slider')).toBeUndefined();
                expect(slider.main).toBeNull();
            });

    });

});
