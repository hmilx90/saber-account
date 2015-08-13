/**
 * @file animation spec
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var Animation = require('saber-run/Animation');

    describe('Animation', function () {
        var element;
        var animation;

        beforeEach(function () {
            if (element) {
                element.parentNode.removeChild(element);
            }
            element = document.createElement('div');
            element.style.cssText += ';width:100px;height:100px;position:absolute;top:0;left:0;';
            document.body.appendChild(element);
            !!element.offsetHeight;

            animation = new Animation(element);
        });

        describe('.run', function () {

            it('should start animation', function (done) {
                animation
                    .set('width', '200px')
                    .run();

                setTimeout(
                    function () {
                        expect(element.style.width).toEqual('200px');
                        done();
                    }, 
                    Animation.DURATION * 1000 + 100
                );
            });

            it('should not start animation when had no action', function () {
                var oldPromise = animation.promise;
                animation.run();
                expect(animation.promise).toBe(oldPromise);
            });

            it('should start multi animations', function (done) {
                animation
                    .set('width', '200px')
                    .run()
                    .set('height', '200px')
                    .run();

                setTimeout(
                    function () {
                        expect(element.style.width).toEqual('200px');
                        expect(element.style.height).toEqual('200px');
                        done();
                    }, 
                    2 * Animation.DURATION * 1000 + 100
                );
            });

        });

        describe('.finish', function () {
            it('should callback when animation finished', function (done) {
                var res = false;
                animation
                    .set('width', '200px')
                    .run()
                    .finish(function () {
                        res = true;
                    });

                setTimeout(
                    function () {
                        expect(res).toBeTruthy();
                        done();
                    }, 
                    Animation.DURATION * 1000 + 100
                );
            });

            it('should be callled after each .run', function (done) {
                animation
                    .finish(function () {
                        expect(element.style.top).toEqual('0px');
                    })
                    .set('top', '100px')
                    .run()
                    .finish(function () {
                        expect(element.style.top).toEqual('100px');
                    })
                    .set('top', '200px')
                    .run()
                    .finish(function () {
                        expect(element.style.top).toEqual('200px');
                        done();
                    });
            });

            it('should be called with argument', function (done) {
                animation
                    .set('top', '100px')
                    .finish(function (ele) {
                        expect(ele).toBe(element);
                    })
                    .run()
                    .finish(function (ele) {
                        expect(ele).toBe(element);
                        done();
                    });
            });
        });

        it('.delay should set daly time', function (done) {
            var before = Date.now();
            animation
                .set('top', '100px')
                .delay(0.3)
                .run()
                .finish(function () {
                    var now = Date.now();
                    expect(element.style.top).toEqual('100px');
                    expect(now - before).toBeGreaterThan(Animation.DURATION * 1000 + 300);
                    done();
                });
        });

        it('.duration should set duration time', function (done) {
            var before = Date.now();
            animation
                .set('top', '100px')
                .duration(0.5)
                .run()
                .finish(function () {
                    var now = Date.now();
                    expect(element.style.top).toEqual('100px');
                    expect(now - before).toBeGreaterThan(500);
                    done();
                });
        });

        describe('.moveTo', function () {

            it('should move element to a position', function (done) {
                animation
                    .moveTo(100, 200)
                    .run()
                    .finish(function () {
                        expect(element.style.left).toEqual('100px');
                        expect(element.style.top).toEqual('200px');
                        done();
                    });
            });

            it('could only move X', function (done) {
                animation
                    .moveTo(100)
                    .run()
                    .finish(function () {
                        expect(element.style.left).toEqual('100px');
                        expect(element.style.top).toEqual('0px');
                        done();
                    });
            });

            it('could only move Y', function (done) {
                animation
                    .moveTo(null, 100)
                    .run()
                    .finish(function () {
                        expect(element.style.left).toEqual('0px');
                        expect(element.style.top).toEqual('100px');
                        done();
                    });
            });

        });

        describe('.move', function () {

            it('should move element by distance', function (done) {
                animation
                    .move(10, 10)
                    .run()
                    .finish(function () {
                        expect(element.style.left).toEqual('10px');
                        expect(element.style.top).toEqual('10px');
                    })
                    .move(10, 10)
                    .run()
                    .finish(function () {
                        expect(element.style.left).toEqual('20px');
                        expect(element.style.top).toEqual('20px');
                        done();
                    });
            });

            it('could only move x or y ', function (done) {
                animation
                    .move(10)
                    .run()
                    .finish(function () {
                        expect(element.style.left).toEqual('10px');
                        expect(element.style.top).toEqual('0px');
                    })
                    .move(null, 10)
                    .run()
                    .finish(function () {
                        expect(element.style.left).toEqual('10px');
                        expect(element.style.top).toEqual('10px');
                        done();
                    });
            });

        });

        describe('.dispose', function () {
            it('should unlink element', function () {
                expect(animation._main).toBe(element);
                animation.dispose();
                expect(animation._main).not.toBe(element);
            });
        });
    });
});
