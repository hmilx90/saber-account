/**
 * selector test case
 *
 * @author firede[firede@firede.us]
 */

define(function() {
    var dom = require('saber-dom/selector');

    describe('Selector', function() {
        describe('.g(id)', function() {
            it('should work', function() {
                var el = dom.g('li-item');
                expect(el).toBe(document.getElementById('li-item'));
            });

            it('DOMElement', function() {
                var el1 = document.getElementById('li-item');
                var el2 = dom.g(el1);

                expect(el2).toBe(el1);
            });

            it('element is not exist', function() {
                var el = dom.g('not-exist');
                expect(el).toBe(null);
            });
        });

        describe('.query(selector, context)', function() {
            it('id selector', function() {
                var el = dom.query('#li-item');
                expect(el).toBe(document.getElementById('li-item'));
            });

            it('class selector', function() {
                var el = dom.query('.list');
                expect(el)
                    .toBe(document.getElementsByClassName('list')[0]);
            });

            it('complex selector', function() {
                var el = dom.query('#test-container li:last-child');
                expect(el.innerHTML).toBe('4');
            });

            it('selector with context', function() {
                var listEl = dom.query('.list');
                var el = dom.query('.active', listEl);

                expect(el.innerHTML).toBe('1');
            });

            it('element is not exist', function() {
                var el = dom.query('.not-exist');
                expect(el).toBe(null);
            });
        });

        describe('.queryAll(selector, context)', function() {
            it('id selector', function() {
                var el = dom.queryAll('#li-item');
                expect(el).toEqual(
                    [ document.getElementById('li-item') ]
               );
            });

            it('class selector', function() {
                var el = dom.queryAll('.active');

                expect(el.length).toBe(2);
                expect(el[0].innerHTML).toBe('1');
                expect(el[1].innerHTML).toBe('panel 1');
            });

            it('complex selector', function() {
                var el = dom.queryAll('#test-container li:nth-child(2n)');

                expect(el.length).toBe(2);
                expect(el[0].innerHTML).toBe('2');
                expect(el[1].innerHTML).toBe('4');
            });

            it('selector with context', function() {
                var listEl = dom.query('.list');
                var el = dom.queryAll('.active', listEl);

                expect(el.length).toBe(1);
                expect(el[0].innerHTML).toBe('1');
            });

            it('element is not exist', function() {
                var el = dom.queryAll('.not-exist');
                expect(el).toEqual([]);
            });
        });

        describe('.matches(element, selector)', function() {
            it('should work', function() {
                var el = dom.g('li-item');
                var res = dom.matches(el, '.list li');

                expect(res).toBe(true);
            });
        });
    });

});
