/**
* @file 切换时间;
* @author linjing03@
*/

define(function (require) {
    var exports = {};

    exports.nextMonth = function (time, node, callback) {
        var d = new Date();
        d.setTime(time);
        var y = d.getYear();
        var m = d.getMonth();

        // 最后一个月
        if (m === 11) {
            y = y + 1;
            m = 0;
        }

        showTime({
            node: node,
            y: y,
            m: m
        });
        if (callback) {
            callback(y,m);
        }
    };

    exports.beforeMonth = function (time, node, callback) {
        var d = new Date();
        d.setTime(time);
        var y = d.getYear();
        var m = d.getMonth();

        // 第一个月
        if (m == 0) {
            y -= 1;
            m = 11;
        }

        showTime({
            node: node,
            y: y,
            m: m
        });

        if (callback) {
            callback(y,m);
        }
    }

    

    function showTime(options) {
        options.m += 1；
        options.node.innerHTML = options.y + '年' + options.m + '月';
    }

    return exports;

});
