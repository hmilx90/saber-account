/**
 * @file query spec
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var Query = require('saber-uri/component/Query');

    var KEY_DECODE = '中文';
    var KEY_ENCODE = encodeURIComponent(KEY_DECODE);

    describe('Query', function () {

        describe('set', function () {

            it('should accept undfined', function () {
                var query = new Query();
                expect(Object.keys(query.data).length).toBe(0);
            });

            it('should accept two arguments to set parts', function () {
                var query = new Query();
                query.set('name', 'treelite');
                expect(Object.keys(query.data).length).toBe(1);
                expect(query.data.name).toEqual('treelite');
            });

            it('should accept one string argument', function () {
                var query = new Query();
                query.set('name=treelite&age=10');
                expect(Object.keys(query.data).length).toBe(2);
                expect(query.data.name).toEqual('treelite');
                expect(query.data.age).toEqual('10');
            });

            it('should accept one object argument', function () {
                var query = new Query();
                query.set({
                    name: 'treelite',
                    age: '10'
                });
                expect(Object.keys(query.data).length).toBe(2);
                expect(query.data.name).toEqual('treelite');
                expect(query.data.age).toEqual('10');
            });

            it('should accept decode string', function () {
                var query = new Query();

                query.set('name', KEY_DECODE);
                expect(query.data.name).toEqual(KEY_DECODE);
            });

            it('should accept encode string', function () {
                var query = new Query();

                query.set('name', KEY_ENCODE);
                expect(query.data.name).toEqual(KEY_DECODE);
            });

            it('should accept object within decode string', function () {
                var query = new Query();

                query.set({
                    n: KEY_DECODE,
                    b: [KEY_DECODE, KEY_DECODE]
                });
                expect(query.data.n).toEqual(KEY_DECODE);
                expect(query.data.b[0]).toEqual(KEY_DECODE);
                expect(query.data.b[1]).toEqual(KEY_DECODE);
            });

            it('should accept object within encode string', function () {
                var query = new Query();

                query.set({
                    n: KEY_ENCODE,
                    b: [KEY_ENCODE, KEY_ENCODE]
                });
                expect(query.data.n).toEqual(KEY_DECODE);
                expect(query.data.b[0]).toEqual(KEY_DECODE);
                expect(query.data.b[1]).toEqual(KEY_DECODE);
            });

            it('should accept undefined/null value', function () {
                var query = new Query();

                query.set('name');
                expect(query.data.name).toBeNull();

                query.set('age', null);
                expect(query.data.age).toBeNull();

                query.set('sex', '');
                expect(query.data.sex).toEqual('');
            });

        });

        describe('get', function () {

            it('should return object when had no arguments', function () {
                var query = new Query('name=treelite&age=10');
                expect(query.get()).toEqual({name: 'treelite', age: '10'});
            });

            it('should return part when had one argument', function () {
                var query = new Query('name=treelite&age=10');
                expect(query.get('name')).toEqual('treelite');
            });

            it('should return decode query', function () {
                var query = new Query('name=' + KEY_DECODE + '&age=10');
                expect(query.get('name')).toEqual(KEY_DECODE);

                query = new Query('name=' + KEY_ENCODE + '&age=10');
                expect(query.get('name')).toEqual(KEY_DECODE);
            });

        });

        describe('toString', function () {

            it('should return empty string when had no data', function () {
                var query = new Query();
                expect(query.toString()).toEqual('');
            });

            it('should return right string which contain undefined/null', function () {
                var query = new Query({name: null, age: undefined, sex: '', normal: 10});
                expect(query.toString()).toEqual('?name&age&sex=&normal=10');
            });

            it('should add defualt prefix when had data', function () {
                var query = new Query('name=treelite&age=10');
                expect(query.toString()).toEqual('?name=treelite&age=10');
            });

            it('should add custom prefix when had data', function () {
                var query = new Query('name=treelite&age=10');
                expect(query.toString('~')).toEqual('~name=treelite&age=10');
            });

            it('should return encode string', function () {
                var query = new Query('name=' + KEY_DECODE + '&age=10');
                expect(query.toString()).toEqual('?name=' + KEY_ENCODE + '&age=10');

                query = new Query('name=' + KEY_ENCODE + '&age=10');
                expect(query.toString()).toEqual('?name=' + KEY_ENCODE + '&age=10');
            });
        });

        describe('add', function () {

            it('should add to single item', function () {
                var query = new Query();
                query.add('name', 'treelite');
                expect(Object.keys(query.data).length).toBe(1);
                expect(query.data.name).toEqual('treelite');
            });

            it('should add to mutli items', function () {
                var query = new Query('company=baidu');
                query.add('company', 'taobao');
                expect(Object.keys(query.data).length).toBe(1);
                expect(Array.isArray(query.data.company)).toBeTruthy();
                expect(query.data.company.length).toBe(2);
                expect(query.data.company[0]).toEqual('baidu');
                expect(query.data.company[1]).toEqual('taobao');
            });

            it('should add object', function () {
                var query = new Query('company=baidu&t=10&t=20');

                query.add({
                    company: 'taobao',
                    t: ['30', '40'],
                    name: 'treelite',
                    n: ['1', '2']
                });

                expect(Object.keys(query.data).length).toBe(4);
                expect(query.data.company).toEqual(['baidu', 'taobao']);
                expect(query.data.t).toEqual(['10', '20', '30', '40']);
                expect(query.data.n).toEqual(['1', '2']);
                expect(query.data.name).toEqual('treelite');
            })

            it('should add object widthin decode string', function () {
                var query = new Query();

                query.add({
                    n: KEY_DECODE,
                    b: [KEY_DECODE, KEY_DECODE]
                });

                expect(Object.keys(query.data).length).toBe(2);
                expect(query.data.n).toEqual(KEY_DECODE);
                expect(query.data.b[0]).toEqual(KEY_DECODE);
                expect(query.data.b[1]).toEqual(KEY_DECODE);
            });

            it('should add object widthin encode string', function () {
                var query = new Query();

                query.add({
                    n: KEY_ENCODE,
                    b: [KEY_ENCODE, KEY_ENCODE]
                });

                expect(Object.keys(query.data).length).toBe(2);
                expect(query.data.n).toEqual(KEY_DECODE);
                expect(query.data.b[0]).toEqual(KEY_DECODE);
                expect(query.data.b[1]).toEqual(KEY_DECODE);
            });

            it('should add decode string argument', function () {
                var query = new Query();

                query.add('name', KEY_DECODE);
                expect(query.data.name).toEqual(KEY_DECODE);
            });

            it('should add encode string argument', function () {
                var query = new Query();

                query.add('name', KEY_ENCODE);
                expect(query.data.name).toEqual(KEY_DECODE);
            });

            it('should add undefined/null value', function () {
                var query = new Query();

                query.add('name');
                expect(query.data.name).toBeNull();

                query.add('age', null);
                expect(query.data.age).toBeNull();

                query.add('sex', '');
                expect(query.data.sex).toEqual('');
            });

        });

        describe('equal', function () {

            it('should compare with string', function () {
                var query = new Query('company=baidu&company=taobao&age=10');
                expect(query.equal('company=baidu&company=taobao&age=10')).toBeTruthy();
                expect(query.equal('company=baidu&age=10')).toBeFalsy();
            });

            it('should compare with object', function () {
                var query = new Query('company=baidu&company=taobao&age=10');
                expect(query.equal({company: ['baidu', 'taobao'], age: 10})).toBeTruthy();
                expect(query.equal({company: ['baidu'], age: 10})).toBeFalsy();
            });

            it('should sort array before compare', function () {
                var query = new Query('company=baidu&company=taobao&age=10');
                expect(query.equal({company: ['taobao', 'baidu'], age: 10})).toBeTruthy();
            });

            it('should compare width Query Object', function () {
                var queryStr = 'company=baidu&company=taobao&age=10';
                var q1 = new Query(queryStr);
                var q2 = new Query(queryStr);
                var q3 = new Query();

                expect(q1.equal(q2)).toBeTruthy();
                expect(q2.equal(q1)).toBeTruthy();
                expect(q1.equal(q3)).toBeFalsy();
                expect(q3.equal(q1)).toBeFalsy();
            });

            it('should compare with decode or encode params', function () {
                var q1 = new Query('company=' + KEY_DECODE + '&company=taobao&age=10');
                var q2 = new Query('company=' + KEY_DECODE + '&company=taobao&age=10');

                expect(q1.equal(q2)).toBeTruthy();
            });

        });

        describe('remove', function () {

            it('should delete item by key', function () {
                var query = new Query('company=baidu&company=taobao&age=10');
                query.remove('company');
                expect(Object.keys(query.data).length).toBe(1);
                expect(query.data.age).toEqual('10');
            });

            it('should delete all items without arguments', function () {
                var query = new Query('company=baidu&company=taobao&age=10');
                query.remove();
                expect(query.data).toEqual({});
            });

        });

    });

});
