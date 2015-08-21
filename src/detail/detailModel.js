/**
 * @file 
 * @author wangshuo16
 */

define(function (require) {

    var Resolver = require('saber-promise');
    var dataManager = require('common/js/Data-manage');

    var config = {};

    config.detail_Data = {
        icn_count: [],
        exp_count: [],
        days_array: []
    };

    config.fetch = function () {
        //return this.getTotal();
        return Resolver.resolved({});
    };

    config.getData = function () {
        return dataManager.getDataByMonth();
    };

    config.getTotal = function () {
        dataManager.getDataByMonth().then(function (data) {
            return dataManager.calcDate(data);
        });
    };

    /**
     * 统计每日的收入和支出总额
     * @param data 数据
     * @param month 月份
     * @param year 年份
     */
    config.countDataPerDay = function (data, month, year) {

        year = year || + new Date().getFullYear();
        month = month || new Date().getMonth() + 1;

        var days = dataManager.monthDays(month, year);

        //存储每天的收入和支出
        var icn_count = new Array(days);
        var exp_count = new Array(days);
        var days_array = new Array(days);

        for (var i = 0; i<days; i++) {
            days_array[i] = i+1;
            icn_count[i] = 0;
            exp_count[i] = 0;
        }

        for (var k in data) {
            var day = new Date(data[k].time).getDate();
            if (data[k].type === 'income') {
                icn_count[day-1] += data[k].number;
            }
            else if(data[k].type === 'expense') {
                exp_count[day-1] += data[k].number;
            }
        }

        this.detail_Data.icn_count = icn_count;
        this.detail_Data.exp_count = exp_count;
        this.detail_Data.days_array = days_array;
    };

    return config;

});
