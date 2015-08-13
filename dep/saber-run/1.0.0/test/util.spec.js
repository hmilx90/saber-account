/**
 * @file animation测试用例
 * @author treelite(c.xinle@gmail.com);
 */

define(function (require) {
    var util = require('saber-run/util');

    describe('util', function () {

        it('.requestAnimationFrame should fire animation callback', function (done) {
            util.requestAnimationFrame(function () {
                expect(true).toBeTruthy();
                done();
            });
        });

        it('.cancelAnimationFrame should cancel animation', function (done) {
            var id = util.requestAnimationFrame(function () {
                expect(true).toBeFalsy();
                done();
            });

            util.cancelAnimationFrame(id);

            setTimeout(function () {
                expect(false).toBeFalsy();
                done();
            }, 0);
        });

    });

});
