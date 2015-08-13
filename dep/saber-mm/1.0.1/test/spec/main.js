/**
 * @file Main test spec
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var mm = require('saber-mm');
    var Presenter = mm.Presenter;
    var Model = mm.Model;
    var View = mm.View;

    describe('Main', function () {

        describe('create', function () {

            it('presenter with empty config', function (done) {

                mm.create().then(function (presenter) {
                    expect(presenter instanceof Presenter).toBeTruthy();
                    expect(presenter.view instanceof View).toBeTruthy();
                    expect(presenter.model instanceof Model).toBeTruthy();
                    done();
                });

            });

            it('async presenter', function (done) {
                var config = require('./mock/foo');
                mm.create('spec/mock/foo').then(function (presenter) {
                    expect(presenter instanceof config.constructor).toBeTruthy();
                    done();
                });
            });
        });

        describe('configure', function () {

            afterEach(function () {
                // reset
                mm.config({
                    template: [],
                    templateConfig: {},
                    templateData: {},
                    router: null,
                    Presenter: null,
                    Model: null,
                    View: null
                });
            });

            it('constructor', function (done) {
                var View = require('./mock/View');
                var config = {
                    Presenter: require('./mock/Presenter')
                };

                mm.config(config);

                mm.create({view: {constructor: View}}).then(function (presenter) {
                    expect(presenter instanceof config.Presenter).toBeTruthy();
                    expect(presenter.model instanceof Model).toBeTruthy();
                    expect(presenter.view instanceof View).toBeTruthy();
                    done();
                });
            });

            it('router', function (done) {
                var router1 = {name: 'router1'};
                var router2 = {name: 'router2'};

                mm.config({
                    router: router1
                });

                mm.create({router: router2}).then(function (presenter) {
                    expect(presenter.router).toBe(router2);
                    expect(presenter.view.router).toBe(router1);
                    done();
                });
            });

            it('template', function (done) {
                mm.config({
                    template: ' ${common}'
                });

                mm.create({
                    view: {
                        template: 'hello'
                    }
                }).then(function (presenter) {
                    var view = presenter.view;
                    var str = view.template.render({common: 'saber'});
                    expect(str).toEqual('hello saber');
                    done();
                });
            });

            it('templateData', function (done) {
                var target = {author: 'saber', name: 'index'};
                var commonData = {author: 'saber'};
                var config = {
                    view: {
                        templateData: {name: 'index'}
                    }
                };

                mm.config({
                    templateData: commonData
                });

                mm.create(config).then(function () {
                    expect(config.view.templateData).toEqual(target);
                    done();
                });

            });

            it('templateConfig', function (done) {
                var target = {variableOpen: '<%', variableClose: '%>'};
                var commonConfig = {variableOpen: '#{'};
                var config = {
                    view: {
                        templateConfig: target
                    }
                };

                mm.config({
                    templateConfig: commonConfig
                });

                mm.create(config).then(function () {
                    expect(config.view.templateConfig).toEqual(target);
                    done();
                });

            });

        });

    });
});
