/**
 * @file transition测试用例
 * @author treelite(c.xinle@gmail.com);
 */

define(function (require) {
    var runner = require('saber-run/transition');

    describe('transition', function () {

        var ele; 

        beforeEach(function () {
            ele = document.createElement('div');
            ele.style.width = '100px';
            ele.style.height = '100px';
            document.body.appendChild(ele);
            // 强制刷新
            !!ele.offsetHeight;
        });

        afterEach(function () {
            if (ele) {
                ele.parentNode.removeChild(ele);
            }
        });


        describe('.transition', function () {

            it('should set one property', function (done) {
                var promise = runner.transition(
                        ele, 
                        { width: '200px' },
                        { duration: 0.5 }
                    );

                promise.then(function () {
                    expect(ele.style.width).toBe('200px');
                    done();
                });

            });

            it('should set multi properties', function (done) {
                var promise = runner.transition(
                        ele, 
                        {
                            width: '200px',
                            height: '200px',
                        },
                        { duration: 0.5 }
                    );

                promise.then(function () {
                    expect(ele.style.width).toBe('200px');
                    expect(ele.style.height).toBe('200px');
                    done();
                });
            });

            it('should return resolved promise when noting happened', function (done) {
                var promise = runner.transition();
                promise.then(function () {
                    expect(true).toBeTruthy();
                    done();
                });
            });

            it('should return resolved promise without duration', function (done) {
                var promise = runner.transition(ele, {width: '200px'});
                promise.then(function () {
                    expect(ele.style.width).toEqual('200px');
                    done();
                });
            });

            it('should return resolved promise when property not change', function (done) {
                var promise = runner.transition(
                        ele,
                        {
                            width: '100px'
                        },
                        { duration: 0.5 }
                    );

                promise.then(function () {
                    expect(ele.style.width).toEqual('100px');
                    done();
                });
            });

            it('should return resolved promise fulfilled by element when property not change', function (done) {
                var promise = runner.transition(
                    ele,
                    {
                        width: '100px'
                    },
                    {
                        duration: 0.5
                    }
                );

                promise.then(function (e) {
                    expect(e).toBe(ele);
                    done();
                });
            });

            it('should return resolved promise fulfilled by element after property changed', function (done) {
                var promise = runner.transition(
                    ele,
                    {
                        width: '200px'
                    },
                    {
                        duration: 0.5
                    }
                );

                promise.then(function (e) {
                    expect(e).toBe(ele);
                    done();
                });
            });

        });

        describe('.stopTransition', function () {

            it('should stop transition and fire end event', function (done) {
                var promise = runner.transition(
                        ele,
                        {
                            width: '200px'
                        },
                        { duration: 5 }
                    );

                var before = Date.now();
                promise.then(function () {
                    var now = Date.now();
                    expect(ele.style.width).toEqual('200px');
                    expect(now - before).toBeLessThan(1000);
                    expect(now - before >= 300).toBeTruthy();
                    done();
                });

                setTimeout(function () {
                    runner.stopTransition(ele);
                }, 300);
            });

        });

        describe('.onTransitionEnd', function () {

            it('should attach end event', function (done) {
                function callback() {
                    expect(ele.style.width).toEqual('200px');
                    done();
                }

                runner.onTransitionEnd(ele, callback);

                runner.transition(ele, {width: '200px'}, {duration: 0.3});
            });

            it('attach event should fired after stop transition', function (done) {
                function callback() {
                    expect(ele.style.width).toEqual('200px');
                    done();
                }

                runner.onTransitionEnd(ele, callback);

                runner.transition(ele, {width: '200px'}, {duration: 5});

                setTimeout(function () {
                    runner.stopTransition(ele);
                }, 300);
            });

        });

        describe('.unTransitionEnd', function () {

            it('should detach end event', function (done) {

                var count = 0;
                function callback() {
                    count++; 
                }

                runner.onTransitionEnd(ele, callback);

                runner.transition(ele, {width: '200px'}, {duration: 0.1})
                    .then(function () {
                        runner.unTransitionEnd(ele, callback);
                        runner.transition(ele, {width: '250px'}, {duration: 0.1})
                            .then(function () {
                                expect(count).toBe(1);
                                done();
                            });
                    });

            });

            it('detach end event should not fire after stop transition', function (done) {

                var count = 0;
                function callback() {
                    count++; 
                }

                runner.onTransitionEnd(ele, callback);

                runner.transition(ele, {width: '200px'}, {duration: 0.1})
                    .then(function () {
                        runner.unTransitionEnd(ele, callback);
                        runner.transition(ele, {width: '250px'}, {duration: 5});
                        setTimeout(function () {
                            runner.stopTransition(ele);
                            expect(count).toBe(1);
                            done();
                        }, 300);
                    });

            });
        });

        describe('.oneTransitionEnd', function () {

            it('should attach event and detach event after fire', function (done) {

                var count = 0;
                function callback() {
                    count++; 
                }

                runner.oneTransitionEnd(ele, callback);

                runner.transition(ele, {width: '200px'}, {duration: 0.1})
                    .then(function () {
                        runner.transition(ele, {width: '250px'}, {duration: 0.1})
                            .then(function () {
                                expect(count).toBe(1);
                                done();
                            });
                        });

            });

            it('should attach event and detach event after stop', function (done) {

                var count = 0;
                function callback() {
                    count++; 
                }

                runner.oneTransitionEnd(ele, callback);

                runner.transition(ele, {width: '200px'}, {duration: 5});

                setTimeout(function () {
                    runner.stopTransition(ele);
                    runner.transition(ele, {width: '250px'}, {duration: 0.1})
                        .then(function () {
                            expect(count).toBe(1);
                            done();
                        });
                }, 300);

            });

        });

    });

});
