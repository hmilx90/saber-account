/**
 * @file abstract view spec
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var View = require('saber-mm').View;

    describe('AbstractView', function () {

        var main;

        beforeEach(function () {
            if (typeof window !== 'undefined') {
                main = document.createElement('div');
            }
            else {
                main = {
                    className: '',
                    innerHTML: ''
                };
            }
        });

        it('should compile template only once', function () {
            var config = {
                templateMainTarget: 'targetMain',
                template: '<!-- target:targetMain -->hello'
            };

            var pass = true;
            try {
                var view = new View(config);
                view = new View(config);
            }
            catch (e) {
                pass = false;
            }
            expect(pass).toBeTruthy();
        });

        it('should support templateConfig', function () {
            var view = new View({
                template: 'hello #{content}',
                templateConfig: {
                    variableOpen: '#{',
                    variableClose: '}'
                }
            });

            var str = view.template.render({content: 'tpl'});
            expect(str).toEqual('hello tpl');
        });

        it('.set(ele) should set main element', function () {
            var view = new View();

            view.set(main);

            expect(view.main).toBe(main);
        });

        it('.render() should render view', function () {
            var data = {name: 'treelite'};
            var tpl = '${name}';
            var view = new View({
                    template: tpl,
                    main: main,
                });

            view.render(data);

            expect(main.innerHTML).toEqual(data.name);
        });

        it('template support templateData', function () {
            var config = {
                template: 'hello ${content}',
                templateData: {
                    content: 'static'
                },
                main: main
            };
            var view = new View(config);
            expect(view.template.render()).toEqual('hello static');
        });

        it('.render() support templateData', function () {
            var config = {
                template: 'hello ${content}',
                templateData: {
                    content: 'static'
                },
                main: main
            };

            var view = new View(config);
            view.render();
            expect(main.innerHTML).toEqual('hello static');
        });

        it('.render() supoort targets', function () {
            var data = {name: 'treelite'};
            var tpl = '<!-- target:main -->${name}<!-- target:test -->test${name}';
            var view = new View({
                    template: tpl,
                    templateMainTarget: 'main',
                    main: main,
                });

            view.render(data);
            expect(main.innerHTML).toEqual(data.name);

            expect(view.template.render('test', data)).toEqual('test' + data.name);
        });

        it('.render() should set className', function () {
            var config = {
                template: 'hello ${content}',
                className: 'hello',
                main: main
            };

            var view = new View(config);
            view.render();

            expect(main.className.trim()).toEqual(config.className);
        });

        it('.render() do not repeat setting className', function () {
            var clsName = main.className = 'hello world'
            var config = {
                template: 'hello ${content}',
                className: 'hello',
                main: main
            };

            var view = new View(config);
            view.render();

            expect(main.className).toEqual(clsName);
        });
    });
});
