/**
 * @file 
 * @author ()
 */

define(function (require) {

    var Resolver = require('saber-promise');
    var DataManage = require('../common/js/Data-manage');

    var sortMap = {
        'food': '餐饮',
        'shopping': '购物'
    }

    function formatTime(timeStamp) {
        var year = timeStamp.getFullYear();
        var month = timeStamp.getMonth() + 1;
        var day = timeStamp.getDate();
        return year + '年' + month + '月' + day + '日';
    }

    function formatRenderData(data) {
        var sortedList = {};

        for (var timeStamp in data) {
            var item = data[timeStamp];
            var sortKey = item.sort;
            item.sort = sortMap[sortKey];
            item.time = formatTime(item.time);
            // 将同一天的收支放在同一个数组里
            var dayKey = item.time;
            if(!sortedList[dayKey]) {
                sortedList[dayKey] = [];
            }
            sortedList[dayKey].push(item);
        }
        console.log('22');
        return sortedList;
    }

    var config = {};

    config.fetch = function () {
        var activeDate = this.activeDate || new Date();
        var year = activeDate.getFullYear();
        var month = activeDate.getMonth() + 1;
        DataManage.test();

        return DataManage.getDataByMonth(month, year).then(function (data) {
            console.log('22');
            var totalResult = DataManage.calcDate(data);
            console.log('11');

            return {
                year: year,
                month: month,
                totalIncome: totalResult.inc_total,
                totalExpense: totalResult.exp_total,
                listData: formatRenderData(data)
            }
        }).fail(function (){console.log('error');});
    };

    return config;

});
