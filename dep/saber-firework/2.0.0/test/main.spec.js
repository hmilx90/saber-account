/**
 * @file main spec
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var firework = require('saber-firework');
    var router = require('saber-router');
    var viewport = require('saber-viewport');
    var Resolver = require('saber-promise');
    var extend = require('saber-lang/extend');

    describe('main', function () {

        describe('app', function () {
            var main = document.querySelector('.viewport');
            // 等待Action加载的事件
            var WAITE_TIME = 30;

            firework.load({path: '/', action: require('mock/index')});
            firework.start(main);

            function finish(done) {
                firework.delCachedAction();
                router.clear();
                firework.load({path: '/', action: require('mock/index')});
                router.redirect('/', null, {force: true});
                // 等待一下，完成index页面的加载
                setTimeout(done, WAITE_TIME);
            }

            describe('load page', function () {

                it('success', function (done) {
                    var actionConfig = require('mock/foo');
                    firework.load({path: '/foo', action: actionConfig});
                    router.redirect('/foo');
                    setTimeout(
                        function () {
                            expect(main.innerHTML).toEqual('<div class=" foo">foo</div>');
                            finish(done);
                        },
                        WAITE_TIME
                    );
                });

                it('check action events', function (done) {
                    var events = [];
                    var actionConfig = {
                        model: require('mock/fooModel'),
                        view: require('mock/fooView'),
                        events: {
                            init: function () {
                                events.push('init');
                            },
                            enter: function () {
                                events.push('enter');
                            },
                            ready: function () {
                                events.push('ready');
                            },
                            complete: function () {
                                events.push('complete');
                            },
                            leave: function () {
                                events.push('leave');
                            }
                        }
                    };

                    firework.load({path: '/foo', action: actionConfig});

                    router.redirect('/foo');
                    setTimeout(function () {
                        router.redirect('/');
                        setTimeout(function () {
                            expect(events).toEqual(['init', 'enter', 'ready', 'complete', 'leave']);
                            finish(done);
                        }, WAITE_TIME);
                    }, WAITE_TIME);
                });

                it('check action events with cache', function (done) {
                    var events = [];
                    var actionConfig = extend({}, require('mock/foo'));
                    actionConfig.events = {
                        init: function () {
                            events.push('init');
                        },
                        enter: function () {
                            events.push('enter');
                        },
                        wakeup: function () {
                            events.push('wakeup');
                        },
                        revived: function () {
                            events.push('revived');
                        },
                        sleep: function () {
                            events.push('sleep');
                        },
                        ready: function () {
                            events.push('ready');
                        },
                        complete: function () {
                            events.push('complete');
                        },
                        leave: function () {
                            events.push('leave');
                        }
                    };

                    firework.load({path: '/foo', action: actionConfig, cached: true});

                    router.redirect('/foo');
                    setTimeout(function () {
                        router.redirect('/');
                        setTimeout(function () {
                            router.redirect('/foo');
                            setTimeout(function () {
                                router.redirect('/foo~name=saber', null, {noCache: true});
                                setTimeout(function () {
                                    expect(events).toEqual([
                                        'init', 'enter', 'ready', 'complete', 'sleep', 'wakeup', 'revived', 'complete',
                                        'leave', 'init', 'enter', 'ready', 'complete'
                                    ]);
                                    finish(done);
                                }, WAITE_TIME);
                            }, WAITE_TIME);
                        }, WAITE_TIME);
                    }, WAITE_TIME);
                });

                it('check action events with error & cache', function (done) {
                    var errorModel = extend({}, require('mock/errorModel'));
                    errorModel.fetch = function (query) {
                        if (!query.type) {
                            return Resolver.rejected();
                        }
                        else {
                            return Resolver.resolved();
                        }
                    };
                    var events = [];
                    var errorAction = extend({}, require('mock/error'));
                    errorAction.model = errorModel;
                    errorAction.events = {
                        init: function () {
                            events.push('init');
                        },
                        enter: function () {
                            events.push('enter');
                        },
                        ready: function () {
                            events.push('ready');
                        },
                        complete: function () {
                            events.push('complete');
                        },
                        sleep: function () {
                            events.push('sleep');
                        },
                        wakeup: function () {
                            events.push('wakeup');
                        },
                        leave: function () {
                            events.push('leave');
                        }
                    };

                    firework.load({path: '/error', action: errorAction});

                    router.redirect('/error~type=test');
                    setTimeout(function () {
                        router.redirect('/error');
                        setTimeout(function () {
                            expect(main.innerHTML).toEqual('<div></div>');
                            expect(events).toEqual(['init', 'enter', 'ready', 'complete', 'leave', 'init', 'enter']);
                            finish(done)
                        }, WAITE_TIME);
                    }, WAITE_TIME);
                });

                it('support async action', function (done) {
                    firework.load({path: '/foo', action: 'mock/foo'});
                    router.redirect('/foo');
                    setTimeout(function () {
                        expect(main.innerHTML).toEqual('<div class=" foo">foo</div>');
                        finish(done);
                    }, 100);
                });

                it('support refresh', function (done) {
                    var actionConfig = extend({}, require('mock/foo'));
                    var res = {};

                    actionConfig.refresh = function (query, options) {
                        res.query = query;
                        res.options = options;
                        return Resolver.resolved();
                    };
                    firework.load({path: '/foo', action: actionConfig});
                    router.redirect('/foo');

                    setTimeout(function () {
                        router.redirect('/foo~name=saber', null, {type: 'test'});
                        setTimeout(function () {
                            expect(res.query).toEqual({name: 'saber'});
                            expect(res.options).toEqual({type: 'test'});
                            finish(done);
                        }, WAITE_TIME);
                    }, WAITE_TIME);
                });

                it('with the same path', function (done) {
                    var config = extend({}, require('mock/foo'));
                    config.events = {
                        enter: jasmine.createSpy()
                    };
                    firework.load({path: '/foo', action: config});

                    router.redirect('/foo');

                    setTimeout(function () {
                        expect(config.events.enter.calls.count()).toBe(1);
                        router.redirect('/foo');
                        setTimeout(function () {
                            expect(config.events.enter.calls.count()).toBe(1);
                            router.redirect('/foo~type=test');
                            setTimeout(function () {
                                expect(config.events.enter.calls.count()).toBe(2);
                                router.redirect('/foo~type=test', null, {force: true});
                                setTimeout(function () {
                                    expect(config.events.enter.calls.count()).toBe(3);
                                    finish(done);
                                }, WAITE_TIME);
                            }, WAITE_TIME);
                        }, WAITE_TIME);
                    }, WAITE_TIME);
                });

                it('wait other action', function (done) {
                    var p1 = extend({}, require('mock/foo'));
                    var p2 = extend({}, require('mock/foo'));
                    p1.events = {
                        enter: jasmine.createSpy('p1')
                    };
                    p2.events = {
                        enter: jasmine.createSpy('p2')
                    };
                    firework.load({path: '/foo', action: p1});
                    firework.load({path: '/boo', action: p2});

                    router.redirect('/foo');
                    router.redirect('/boo');

                    expect(p1.events.enter).not.toHaveBeenCalled();
                    expect(p2.events.enter).not.toHaveBeenCalled();

                    setTimeout(function () {
                        expect(p1.events.enter).toHaveBeenCalled();
                        expect(p2.events.enter).toHaveBeenCalled();
                        finish(done);
                    }, WAITE_TIME);
                });

                it('only wait the last action', function (done) {
                    var p1 = extend({}, require('mock/foo'));
                    var p2 = extend({}, require('mock/foo'));
                    var p3 = extend({}, require('mock/foo'));
                    p1.events = {
                        enter: jasmine.createSpy('p1')
                    };
                    p2.events = {
                        enter: jasmine.createSpy('p2')
                    };
                    p3.events = {
                        enter: jasmine.createSpy('p3')
                    };
                    firework.load({path: '/foo', action: p1});
                    firework.load({path: '/boo', action: p2});
                    firework.load({path: '/new', action: p3});

                    router.redirect('/foo');
                    router.redirect('/boo');
                    router.redirect('/new');

                    expect(p1.events.enter).not.toHaveBeenCalled();
                    expect(p2.events.enter).not.toHaveBeenCalled();
                    expect(p3.events.enter).not.toHaveBeenCalled();

                    setTimeout(function () {
                        expect(p1.events.enter).toHaveBeenCalled();
                        expect(p2.events.enter).not.toHaveBeenCalled();
                        expect(p3.events.enter).toHaveBeenCalled();
                        finish(done);
                    }, WAITE_TIME);
                });

                it('timeout', function (done) {
                    var p1 = extend({}, require('mock/foo'));
                    p1.model = extend({}, require('mock/fooModel'));
                    p1.model.fetch = function () {
                        var resolver = new Resolver();
                        setTimeout(function () {
                            resolver.resolve();
                        }, 1300);
                        return resolver.promise();
                    };
                    var p2 = extend({}, require('mock/foo'));
                    p2.events = {
                        enter: jasmine.createSpy('p2')
                    };

                    firework.load({path: '/foo', action: p1});
                    firework.load({path: '/boo', action: p2});

                    router.redirect('/foo');

                    setTimeout(function () {
                        router.redirect('/boo');
                        setTimeout(function () {
                            expect(p2.events.enter).toHaveBeenCalled();
                            finish(done);
                        }, WAITE_TIME);
                    }, 1100);

                });

            });

            describe('global events', function () {

                it('beforeload -> beforetransition -> afterload', function (done) {

                    var events = [];
                    var backs = [];
                    var fronts = [];

                    firework.on('beforeload', function (back, front) {
                        events.push('beforeload');
                        backs.push(back);
                        fronts.push(front);
                    });

                    firework.on('beforetransition', function (back, front) {
                        events.push('beforetransition');
                        backs.push(back);
                        fronts.push(front);
                    });

                    firework.on('afterload', function (back, front) {
                        events.push('afterload');
                        backs.push(back);
                        fronts.push(front);
                    });

                    router.redirect('/~spec=events');

                    setTimeout(function () {
                        expect(events).toEqual(['beforeload', 'beforetransition', 'afterload']);
                        expect(fronts[0].route.url).toEqual('/');
                        expect(backs[0].route.url).toEqual('/~spec=events');
                        expect(backs[0].route.query).toEqual({spec: 'events'});
                        expect(fronts[0]).toBe(fronts[1]);
                        expect(fronts[0]).toBe(fronts[2]);
                        expect(backs[0]).toBe(backs[1]);
                        expect(backs[0]).toBe(backs[2]);
                        firework.off();
                        finish(done);
                    }, WAITE_TIME);

                });

                it('error should emit when load action fail', function (done) {
                    firework.on('error', function (back, front) {
                        expect(back.route.url).toEqual('/error');
                        expect(front.route.url).toEqual('/');
                        finish(done);
                    });
                    
                    firework.load({path: '/error', action: require('mock/error')});

                    router.redirect('/error');
                });

            });

            describe('filter', function () {

                afterEach(function () {
                    firework.removeFilter();
                });

                it('can added by string url', function (done) {
                    var called = false;
                    function filter(route, next) {
                        called = true;
                        next();
                    }

                    firework.addFilter('/foo', filter);
                    firework.load({path: '/foo', action: require('mock/foo')});

                    router.redirect('/foo');

                    setTimeout(function () {
                        expect(called).toBeTruthy();
                        finish(done);
                    }, WAITE_TIME);
                });

                it('can added by RegExp', function (done) {
                    var called = false;
                    function filter(route, next) {
                        called = true;
                        next();
                    }

                    firework.addFilter(/^\/foo/, filter);
                    firework.load({path: '/foo', action: require('mock/foo')});

                    router.redirect('/foo');

                    setTimeout(function () {
                        expect(called).toBeTruthy();
                        finish(done);
                    }, WAITE_TIME);
                });

                it('can remove', function (done) {
                    var count = 0;
                    function filter(route, next) {
                        count++;
                        next();
                    }

                    firework.addFilter('/', filter);
                    firework.addFilter('/foo', filter);
                    firework.removeFilter('/foo');

                    firework.load({path: '/foo', action: require('mock/foo')});

                    router.redirect('/foo');
                    
                    setTimeout(function () {
                        expect(count).toBe(0);
                        firework.removeFilter();
                        router.redirect('/');
                        setTimeout(function () {
                            expect(count).toBe(0);
                            finish(done);
                        }, WAITE_TIME);
                    }, WAITE_TIME);
                });

                it('argument contains route info', function (done) {
                    var res;
                    function filter(route, next) {
                        res = route; 
                        next();
                    }
                    firework.addFilter('/foo', filter);
                    firework.load({path: '/foo', action: require('mock/foo')});

                    router.redirect('/foo~name=hello', null, {type: 'test'});

                    setTimeout(function () {
                        expect(res.url).toEqual('/foo~name=hello');
                        expect(res.path).toEqual('/foo');
                        expect(res.query).toEqual({name: 'hello'});
                        expect(res.options).toEqual({type: 'test'});
                        finish(done);
                    }, WAITE_TIME);
                });
                
                it('can jump over the remainder filters', function (done) {
                    var call1 = false;
                    var call2 = false;
                    var call3 = false;
                    var call4 = false;

                    function filter1(route, next, jump) {
                        call1 = true;
                        jump(1);
                    }

                    function filter2(route, next, jump) {
                        call2 = true;
                        next();
                    }

                    function filter3(route, next, jump) {
                        call3 = true;
                        jump();
                    }

                    function filter4(route, next, jump) {
                        call4 = true;
                        next();
                    }

                    firework.addFilter('/foo', filter1);
                    firework.addFilter('/foo', filter2);
                    firework.addFilter('/foo', filter3);
                    firework.addFilter('/foo', filter4);

                    firework.load({path: '/foo', action: require('mock/foo')});

                    router.redirect('/foo');

                    setTimeout(function () {
                        expect(call1).toBeTruthy();
                        expect(call2).toBeFalsy();
                        expect(call3).toBeTruthy();
                        expect(call4).toBeFalsy();
                        finish(done);
                    }, WAITE_TIME);
                });

                it('support async', function (done) {
                    var call = false;
                    function filter(route, next) {
                        setTimeout(next, 0);
                        call = true;
                    }
                    firework.addFilter('/foo', filter);
                    firework.load({path: '/foo', action: require('mock/foo')});

                    router.redirect('/foo');

                    setTimeout(function () {
                        expect(call).toBeTruthy();
                        expect(main.innerHTML).toEqual('<div class=" foo">foo</div>');
                        finish(done);
                    }, 100);
                });

                it('support default filter', function (done) {
                    var count = 0;
                    function filter(route, next) {
                        count++;
                        next();
                    }
                    firework.addFilter(filter);

                    firework.load({path: '/foo', action: require('mock/foo')});

                    router.redirect('/foo');

                    setTimeout(function () {
                        expect(count).toBe(1);
                        router.redirect('/');
                        setTimeout(function () {
                            expect(count).toBe(2);
                            finish(done);
                        }, WAITE_TIME);
                    }, WAITE_TIME);
                });

            });

        });

    });
});
