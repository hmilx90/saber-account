/**
 * @file Model test spec
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var Model = require('saber-mm').Model;

    describe('Model', function () {

        it('independent store space', function () {
            var store = {name: 'saber'};
            var model = new Model({store: store});

            expect(model.store.name).toEqual(store.name);
            model.store.name = 'treelite';
            expect(model.store.name).not.toEqual(store.name);
        });

        it('set / get', function () {
            var model = new Model();
            var name = 'saber';

            model.set('name', name);
            expect(model.get('name')).toEqual(name);
        });

        it('del', function () {
            var name = 'saber';
            var model = new Model({store: {name: name}});
            expect(model.del('name')).toEqual(name);
            expect(model.store.hasOwnProperty('name')).toBeFalsy();
        });

    });

});
