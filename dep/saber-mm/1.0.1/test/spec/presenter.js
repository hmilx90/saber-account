/**
 * @file Presenter spec
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var Abstract = require('saber-mm').Abstract;
    var Presenter = require('saber-mm').Presenter;

    describe('Presenter', function () {

        it('should inherited abstract', function () {
            var presenter = new Presenter();

            expect(presenter instanceof Abstract).toBeTruthy();
        });

        it('create new instance should bind events', function () {
            var fn = jasmine.createSpy('fn');
            var presenter = new Presenter({
                    events: {
                        'view:add': fn,
                        'model:update': fn
                    }
                });

            presenter.view.emit('add');
            presenter.model.emit('update');

            expect(fn.calls.count()).toBe(2);
        });

        it('create new instance should emit `init`', function () {
            var fn = jasmine.createSpy('fn');
            var tmp = new Presenter({
                events: {
                    init: fn
                }
            });

            expect(fn.calls.count()).toBe(1);
        });

        it('.enter() should set path and finish render', function (done) {
            var path = '/index';
            var query = {filter: 'www'};
            var options = {noCache: true};
            var ele = {className: '', innerHTML: ''};
            var fn = jasmine.createSpy('fn');
            var presenter = new Presenter({
                    events: {
                        enter: fn
                    }
                });

            spyOn(presenter.model, 'fetch').and.callThrough();
            spyOn(presenter.view, 'set').and.callThrough();
            spyOn(presenter.view, 'render').and.callThrough();

            presenter.enter(ele, path, query, options).then(function () {
                expect(presenter.path).toEqual(path);
                expect(presenter.options).toEqual(options);
                expect(presenter.options).not.toBe(options);
                expect(fn.calls.count()).toBe(1);
                expect(presenter.view.set).toHaveBeenCalledWith(ele);
                expect(presenter.model.fetch).toHaveBeenCalledWith(query);
                expect(presenter.view.render).toHaveBeenCalled();
                done();
            });
        });

        it('.wakeup() should fire event and return a resolved promise', function (done) {
            var fn = jasmine.createSpy('fn');
            var presenter = new Presenter({
                events: {
                    wakeup: fn
                }
            });

            presenter.wakeup().then(function () {
                expect(fn).toHaveBeenCalled();
                done();
            });
        });

        it('.ready() should fire event and call view\'s ready function', function () {
            var fn = jasmine.createSpy('fn');
            var presenter = new Presenter({
                events: {
                    ready: fn
                }
            });

            spyOn(presenter.view, 'ready');

            presenter.ready();
            expect(fn).toHaveBeenCalled();
            expect(presenter.view.ready).toHaveBeenCalled();
        });

        it('.revived() should fire event and call view\'s ready function', function () {
            var fn = jasmine.createSpy('fn');
            var presenter = new Presenter({
                events: {
                    revived: fn
                }
            });

            spyOn(presenter.view, 'revived');

            presenter.revived();
            expect(fn).toHaveBeenCalled();
            expect(presenter.view.revived).toHaveBeenCalled();
        });

        it('.complete() should fire event', function () {
            var fn = jasmine.createSpy('fn');
            var presenter = new Presenter({
                events: {
                    complete: fn
                }
            });

            presenter.complete();
            expect(fn).toHaveBeenCalled();
        });

        it('.sleep() should fire event and call view\'s sleep', function () {
            var fn = jasmine.createSpy('fn');
            var presenter = new Presenter({
                events: {
                    sleep: fn
                }
            });

            spyOn(presenter.view, 'sleep');

            presenter.sleep();
            expect(fn).toHaveBeenCalled();
            expect(presenter.view.sleep).toHaveBeenCalled();
        });

        it('.leave() should fire event and call dispose', function () {
            var fn = jasmine.createSpy('fn');
            var presenter = new Presenter({
                events: {
                    leave: fn
                }
            });

            spyOn(presenter, 'dispose');
            spyOn(presenter.view, 'leave');
            presenter.leave();

            expect(presenter.dispose).toHaveBeenCalled();
            expect(fn).toHaveBeenCalled();
            expect(presenter.view.leave).toHaveBeenCalled();
        });

        it('.dispose() should call view\'s dispose and model\'s dispose', function () {
            var presenter = new Presenter();

            spyOn(presenter.view, 'dispose');
            spyOn(presenter.model, 'dispose');
            presenter.dispose();

            expect(presenter.view.dispose).toHaveBeenCalled();
            expect(presenter.model.dispose).toHaveBeenCalled();
        });

    });

});
