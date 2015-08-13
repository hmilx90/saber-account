/**
 * @file event spec
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var dom = require('saber-dom');
    var extend = require('saber-lang/extend');
    var eventHelper = require('saber-mm/event');

    var WAIT = 600;

    function fireEvent(ele, type, proto) {
        var e = document.createEvent('Event');
        e.initEvent(type, true, true);
        if (proto) {
            extend(e, proto);
        }
        ele.dispatchEvent(e);
    }

    describe('event', function () {

        var ele;

        beforeEach(function () {
            ele = document.createElement('div');
            ele.style.cssText += ';position:absolute;left:-1000px;top:-1000px;width:100px;height:100px;'
            ele.innerHTML = '<div class="container"><div class="inner"></div></div>'
            document.body.appendChild(ele);
        });

        afterEach(function () {
            document.body.removeChild(ele);
            ele = null;
        });
        
        describe('.on(ele, selector, fn)', function () {

            it('should bind normal event widthout selector', function (done) {
                var index = 0;
                eventHelper.on(ele, 'click', function (e) {
                    expect(e.type).toEqual('click');
                    expect(this).toBe(ele);
                    if (index >= 1) {
                        done();
                    }
                    index++;
                });

                fireEvent(ele, 'click', {touches: [{}]});
                setTimeout(function () {
                    fireEvent(ele, 'click', {touches: [{}]});
                }, 0)
            });

            it('should bind normal event with selector', function (done) {
                var inner = dom.query('.inner', ele);

                eventHelper.on(ele, 'click', '.container', function (e) {
                    expect(e.type).toEqual('click');
                    expect(this).toBe(inner.parentNode);
                    done();
                });

                fireEvent(inner, 'click');
            });

            it('should fire selector\'s callback first', function (done) {
                var inner = dom.query('.inner', ele);
                var index = 0;

                eventHelper.on(ele, 'click', function (e) {
                    expect(e.type).toEqual('click');
                    expect(this).toBe(ele);
                    expect(index).toBe(1);
                    done();
                });

                eventHelper.on(ele, 'click', '.container', function (e) {
                    expect(e.type).toEqual('click');
                    expect(this).toBe(inner.parentNode);
                    expect(index++).toBe(0);
                });

                fireEvent(inner, 'click');
            });

            it('should stop bubble by e.stopPropagation', function (done) {
                var fn = jasmine.createSpy('fn');
                var inner = dom.query('.inner', ele);

                eventHelper.on(inner, 'click', function (e) {
                    e.stopPropagation();
                });

                eventHelper.on(ele, 'click', fn);

                fireEvent(inner, 'click');

                setTimeout(function () {
                    expect(fn.calls.count()).toBe(0);
                    done();
                }, WAIT);
            });

            it('should end delegate by e.stopPropagation', function (done) {
                var fn = jasmine.createSpy('fn');
                var inner = dom.query('.inner', ele);

                eventHelper.on(ele, 'click', '.container', function (e) {
                    e.stopPropagation();
                });

                eventHelper.on(ele, 'click', fn);

                fireEvent(inner, 'click');

                setTimeout(function () {
                    expect(fn.calls.count()).toBe(0);
                    done();
                }, WAIT);
            });

        });

        describe('.off(ele, selector, fn)', function () {

            it('should unbind event widthout selector', function (done) {
                var fn = jasmine.createSpy('fn');

                eventHelper.on(ele, 'click', fn);
                eventHelper.on(ele, 'click', function () {
                    eventHelper.off(ele, 'click', fn);
                });

                fireEvent(ele, 'click');
                setTimeout(function () {
                    fireEvent(ele, 'click');
                    setTimeout(function () {
                        expect(fn.calls.count()).toBe(1);
                        done();
                    }, WAIT);
                }, 0);
            });

            it('should unbind event with selector', function (done) {
                var inner = dom.query('.inner', ele);
                var fn = jasmine.createSpy('fn');

                eventHelper.on(ele, 'click', '.container', fn);
                eventHelper.on(ele, 'click', function () {
                    eventHelper.off(ele, 'click', '.container', fn);
                });

                fireEvent(inner, 'click');
                setTimeout(function () {
                    fireEvent(inner, 'click');
                    setTimeout(function () {
                        expect(fn.calls.count()).toBe(1);
                        done();
                    }, WAIT);
                }, 0);
            });

        });

        describe('.one(ele, selector, fn)', function () {

            it('should fire fn only once', function (done) {
                var fn = jasmine.createSpy('fn');

                eventHelper.one(ele, 'click', fn);

                fireEvent(ele, 'click');
                setTimeout(function () {
                    fireEvent(ele, 'click');
                    setTimeout(function () {
                        expect(fn.calls.count()).toBe(1);
                        done();
                    }, WAIT);
                }, 0);
            });

        });

        it('.clear(ele) should clear binded events', function (done) {
            var fn = jasmine.createSpy('fn');
            var inner = dom.query('.inner', ele);

            eventHelper.on(ele, 'click', fn);
            eventHelper.on(ele, 'click', '.containerl', fn);
            
            eventHelper.clear(ele);

            fireEvent(inner, 'click');

            setTimeout(function () {
                expect(fn.calls.count()).toBe(0);
                done();
            }, WAIT);
        });

    });

});
