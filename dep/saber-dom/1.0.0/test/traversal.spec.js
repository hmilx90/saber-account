/**
 * traversal test case
 *
 * @author firede[firede@firede.us]
 */

define(function() {
    var dom = require('saber-dom');

    describe('Traversal', function() {
        describe('.children(element)', function() {
            it('should work', function() {
                var ct = dom.query('.list');
                var ctChilds = dom.children(ct);
                var items = dom.queryAll('.list li');

                expect(ctChilds).toEqual(items);
            });
        });

        describe('.closest(element, selector, context)', function() {
            var el = dom.g('closest-test');

            it('should work', function() {
                var res = dom.closest(el, 'div');
                var resOk = dom.query('.c3');

                expect(res).toBe(resOk);
            });

            it('element is not exist', function() {
                var res = dom.closest(el, 'article');
                expect(res).toBe(null);
            });

            it('element with context', function() {
                var context = dom.g('test-container');
                var res = dom.closest(el, 'div', context);

                expect(res).toBe(dom.query('.c3'));
            });

            it('element is not exist with context', function() {
                var context = dom.query('.c2');
                var res = dom.closest(el, 'div', context);

                expect(res).toBe(null);
            });

            it('begins with current element', function() {
                var res = dom.closest(el, 'span');
                expect(res).toBe(res);
            });

            it('traversal until document.body', function() {
                var res = dom.closest(el, 'body');
                expect(res).toBe(document.body);
            });
        });
    });

});
