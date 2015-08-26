/**
 * @file 
 * @author wangshuo16
 */

define(function (require) {

    var Resolver = require('saber-promise');
    var dataManager = require('common/js/Data-manage');
    var uri = require('saber-uri');

    var sortMap = {
        'food': '餐饮',
        'shopping': '购物',
        'hospital': '医疗',
        'hotel': '酒店',
        'transtation': '交通',
        'enternment': '娱乐',
        'phoneFee': '通讯',
        'investion': '投资理财',
        'salary': '工资',
        'investIncome': '投资收入',
        'extraSalary': '兼职收入',
        'bonus': '红包',
        'others': '其它'
    };

    var config = {};

    //绘图所用的数据
    config.detail_Data = {
        icn_count: [],
        exp_count: [],
        days_array: [],
        sorts_exp: ['餐饮','购物','酒店','交通','娱乐','通讯','医疗','投资理财'],
        sorts_inc: ['工资','投资收入', '兼职收入', '红包','其它'],
        sorts_count_exp: [],
        sorts_count_inc: []
    };

    config.fetch = function () {
        return dataManager.getDataByMonth().then(function (data) {
            console.log(data);
            return dataManager.calcDate(data);
        });
    };

    config.getData = function (month, year) {
        return dataManager.getDataByMonth(month, year);
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
                icn_count[day-1] += Number(data[k].number);
            }
            else if(data[k].type === 'expense') {
                exp_count[day-1] += Number(data[k].number);
            }
        }

        this.detail_Data.icn_count = icn_count;
        this.detail_Data.exp_count = exp_count;
        this.detail_Data.days_array = days_array;
    };

    /**
     * 对指定分类进行金额统计
     * @param data 账单数据
     * @param sorts 要统计的分类数组，例：['餐饮', '酒店']
     * @return {Object} 统计结果
     */
    config.countDataBySorts = function (data, sorts) {
        var sort_count = {};
        var len = sorts.length;
        for (var i = 0; i<len; i++) {
            sort_count[sorts[i]] = 0;
            //sort_count.push({name: sorts[i], value: 0});
        }

        for (var k in data) {
            if (data.hasOwnProperty(k)) {
                var sortName = sortMap[data[k].sort];
                sort_count[sortName] += Number(data[k].number);
            }
        }

        var result = [];

        for (var key in sort_count) {
            if (sort_count.hasOwnProperty(key)) {
                result.push({name: key, value: sort_count[key]});
            }
        }

        return result;
    };

    //更新绘图数据
    config.initDatas = function (data) {
        var me = this;

        me.countDataPerDay(data);

        me.detail_Data.sorts_count_exp = me.countDataBySorts(data, me.detail_Data.sorts_exp);

        me.detail_Data.sorts_count_inc = me.countDataBySorts(data, me.detail_Data.sorts_inc);
    };

    /**
     * 从URL中读取filter数据
     * @return {Object} changes 筛选后的参数
     */
    config.getFilterFromURL = function () {
        var urlParams = {};
        var query = uri.parse(window.location.href).fragment.split('~')[1];
        if (query) {
            query.split('&').forEach(function (item) {
                var result = item.split('=');
                urlParams[result[0]] = result[1];
            });
        }
        return urlParams;
    };


    return config;

});
