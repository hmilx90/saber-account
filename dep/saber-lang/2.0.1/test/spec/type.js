/**
 * saber-lang test case
 *
 * @file type
 * @author zfkun(zfkun@msn.com)
 */

define(function (require) {

    var type = require('saber-lang/type');

    describe('type', function() {

        describe('.type', function () {

            it('should exists', function () {
                expect(typeof type.type).toEqual('function');
            });

            it('should return type name of argument', function () {
                expect(type.type(false)).toEqual('boolean');
                expect(type.type(true)).toEqual('boolean');

                expect(type.type(1)).toEqual('number');
                expect(type.type(2014.614)).toEqual('number');

                expect(type.type('baidu')).toEqual('string');
                expect(type.type('')).toEqual('string');

                expect(type.type(function () {})).toEqual('function');
                expect(type.type(''.trim)).toEqual('function');

                expect(type.type(new Date())).toEqual('date');

                expect(type.type(/^abc/ig)).toEqual('regexp');
                expect(type.type(new RegExp('^abc', 'ig'))).toEqual('regexp');

                expect(type.type({})).toEqual('object');
                expect(type.type({ name: 'baidu' })).toEqual('object');

                expect(type.type(new Error('hello'))).toEqual('error');

            });

        });

        describe('.isPlainObject', function () {

            it('should exists', function () {
                expect(typeof type.isPlainObject).toEqual('function');
            });

            it('should return `true` if passed', function () {
                expect(type.isPlainObject({})).toBe(true);
                expect(type.isPlainObject(new Object())).toBe(true);
            });

            it('should return `false` if not passed', function () {
                expect(type.isPlainObject([])).toBe(false);
                expect(type.isPlainObject('')).toBe(false);
                expect(type.isPlainObject(null)).toBe(false);
                expect(type.isPlainObject(undefined)).toBe(false);
                expect(type.isPlainObject(window)).toBe(false);
                expect(type.isPlainObject(window.notfound)).toBe(false);
                expect(type.isPlainObject(window.navigator)).toBe(false);
            });

        });

        describe('.isEmptyObject', function () {

            it('should exists', function () {
                expect(typeof type.isEmptyObject).toEqual('function');
            });

            it('should return `true` if passed', function () {
                expect(type.isEmptyObject({})).toBe(true);
                expect(type.isEmptyObject(new Object())).toBe(true);
            });

            it('should return `false` if not passed', function () {
                expect(type.isEmptyObject([])).toBe(false);
                expect(type.isEmptyObject('')).toBe(false);
                expect(type.isEmptyObject(null)).toBe(false);
                expect(type.isEmptyObject(undefined)).toBe(false);
                expect(type.isEmptyObject(window)).toBe(false);
                expect(type.isEmptyObject(window.notfound)).toBe(false);
                expect(type.isEmptyObject(window.navigator)).toBe(false);
                expect(type.isEmptyObject({ a: 1 })).toBe(false);
            });

        });

        describe('.isEmpty', function () {

            it('should exists', function () {
                expect(typeof type.isEmpty).toEqual('function');
            });

            it('should return `true` if passed', function () {
                expect(type.isEmpty({})).toBe(true);
                expect(type.isEmpty([])).toBe(true);
                expect(type.isEmpty('')).toBe(true);
                expect(type.isEmpty(null)).toBe(true);
                expect(type.isEmpty(undefined)).toBe(true);
                expect(type.isEmpty(window.notfount)).toBe(true);
                expect(type.isEmpty(new Object())).toBe(true);
            });

            it('should return `false` if not passed', function () {
                expect(type.isEmpty({ a: 1 })).toBe(false);
                expect(type.isEmpty([ 1, 'hello' ])).toBe(false);
                expect(type.isEmpty(window)).toBe(false);
                expect(type.isEmpty(window.navigator)).toBe(false);
                expect(type.isEmpty({ a: 1 })).toBe(false);
            });

        });

    });

});
