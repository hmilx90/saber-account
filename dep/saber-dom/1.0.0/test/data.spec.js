/**
 * css test case
 *
 * @author  firede[firede@firede.us],
 *          treelite[c.xinle@gmail.com]
 */

define(function() {
    var dom = require('saber-dom');

    describe('Data', function () {

        describe('.getData(element, key)', function () {

            it('value is not empty', function () {
                var el = dom.query('.data-one');
                var val = dom.getData(el, 'id');

                expect(val).toEqual('hello world');
            });

            it('value is empty', function () {
                var el = dom.query('.data-two');
                var val = dom.getData(el, 'id');

                expect(val).toEqual('');
            });

            it('key is not exist', function () {
                var el = dom.query('.data-three');
                var val = dom.getData(el, 'id');

                expect(val).toEqual(null);
            });

        });

        describe('.setData(element, key, value)', function () {

            it('set value when it is not empty', function () {
                var el = dom.query('.data-one');
                dom.setData(el, 'id', 'saber');

                expect(dom.getData(el, 'id')).toEqual('saber');
            });

            it('set value when it is empty', function () {
                var el = dom.query('.data-two');
                dom.setData(el, 'id', 'rider');

                expect(dom.getData(el, 'id')).toEqual('rider');
            });

            it('set value when key is not exist', function () {
                var el = dom.query('.data-one');
                dom.setData(el, 'ui', 'large');

                expect(dom.getData(el, 'ui')).toEqual('large');
            });

            it('should get string when set a number', function () {
                var el = dom.query('.data-three');
                dom.setData(el, 'num', 99);

                expect(dom.getData(el, 'num')).toEqual('99');
            });

        });

        describe('.removeData(element, key)', function () {

            it('remove data when it is not empty', function () {
                var el = dom.query('.data-one');
                dom.removeData(el, 'ui');

                expect(dom.getData(el, 'ui')).toEqual(null);
            });

            it('remove data when it is empty', function () {
                var el = dom.query('.data-two');
                dom.removeData(el, 'ui');

                expect(dom.getData(el, 'ui')).toEqual(null);
            });

            it('remove data when key is not exist', function () {
                var el = dom.query('.data-one');
                dom.removeData(el, 'wow');

                expect(dom.getData(el, 'wow')).toEqual(null);
            });

        });

    });
});
