/**
 * saber-lang test case
 *
 * @author firede[firede@firede.us]
 */

define(function(require) {
    var lang = require('saber-lang');

    describe('lang', function() {

        it('.curry(fn, ...args)', function() {
            function sum(a, b) {
                return a + b;
            }
            var sumCurry = lang.curry(sum, 1);

            expect(sum(1, 2)).toBe(sumCurry(2));
        });

        it('.extend(target, source)', function() {
            var a = { x: 1, y: 2 };
            var b = { y: 3, z: 4 };
            var c = lang.extend(a, b);

            expect(a).toBe(c);
            expect(a).toEqual({ x: 1, y: 3, z: 4 });
        });

        it('.extend(target, ...source)', function() {
            var obj1 = { a: 1, b: 2 };
            var obj2 = { b: 3, c: 4 };
            var obj3 = { c: 4, d: 5 };
            var obj = lang.extend(obj1, obj2, obj3);

            expect(obj1).toBe(obj);
            expect(obj1).toEqual({ a: 1, b: 3, c: 4, d: 5 });
        });

        it('.inherits(subClass, superClass)', function() {
            function Func1(name) {
                this.name = name;
            }
            Func1.prototype.say = function() {
                return 'hi, ' + this.name;
            };
            function Func2(name) {
                this.name = name + '!';
            }
            lang.inherits(Func2, Func1);

            var instance1 = new Func1('saber');
            var instance2 = new Func2('baidu');

            expect(instance1.say()).toBe('hi, saber');
            expect(instance2.say()).toBe('hi, baidu!');
        });

        it('.bind(fn, thisArg, ...args)', function () {
            function foo(age, type) {
                return this.n + ' ' + age + ' ' + type;
            }

            expect(foo(200, 'unknow')).toBe('undefined 200 unknow');

            var fn = lang.bind(foo, {n: 'saber'}, 18);
            expect(fn('queen')).toBe('saber 18 queen');
        });
    });

});
