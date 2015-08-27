/**
* @file 切换时间;
* @author linjing03@
*/

define(function (require) {
    var exports = {};

    exports.nextMonth = function (month, year, node, callback) {

        // 最后一个月
        if (month === 12) {
            year += 1;
            month = 1;
        }
        else {
            month += 1;
        }

        if (node) {
            this.showTime({
                node: node,
                year: year,
                month: month
            });
        }

        if (callback) {
            callback(month, year);
        }
    };

    exports.beforeMonth = function (month, year, node, callback) {

        // 第一个月
        if (month === 1) {
            year -= 1;
            month = 12;
        }
        else {
            month -= 1;
        }

        if (node) {
            this.showTime({
                node: node,
                year: year,
                month: month
            });
        }

        if (callback) {
            callback(month, year);
        }
    };

    exports.showTime = function (options) {
        options.node.innerHTML = options.year + '年' + options.month + '月';
    };

    return exports;

});
