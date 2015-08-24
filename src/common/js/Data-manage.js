/**
 * 取数据，对数据进行处理
 * @author wangshuo16
 */

define(function (require) {

    var Resolver = require('saber-promise');

    var config = {};
    var type = require('saber-lang/type');

    localforage.config({
        name        : 'myApp',
        version     : 1.0,
        storeName   : 'db_account', // Should be alphanumeric, with underscores.
        description : 'this is a db for account'
    });

    /**
     * 取指定月份的数据
     * @param month 月
     * @param year 年
     * @return {Promise} 返回数据
     */
    config.getDataByMonth = function (month, year) {
        //无指定年月时，默认当前月
        year = year || + new Date().getFullYear();
        month = month || new Date().getMonth() + 1;

        var start_date = Date.parse(new Date(year, month-1, 1, 0, 0, 0).toISOString());
        var end_date = Date.parse(new Date(year, month, 1, 0, 0, 0).toISOString());

        var selectedData = {};

        return localforage.getItem('list').then(function (value) {
            for (var k in value) {
                var time = value[k].time;
                if (time && start_date <= time && end_date > time) {
                    selectedData[k] = value[k];
                }
            }
            return selectedData;
        });

    };

    /**
     * 计算数据的收入总计和支出总计
     * @return {Object} 返回收入总计和支出总计
     */
    config.calcDate = function (data) {

        var result = {
            icm_total: 0,
            exp_total: 0
        };

        for(var key in data ){
            var item = data[key];
            if(item.type === 'income'){
                result.icm_total += item.number;
            }
            else if(item.type === 'expense'){
                result.exp_total += item.number;
            }
            else {
                console.warn('type中存储内容有误');
            }
        }
        return result;
    };

    /**
     * 计算某个月份的收入总计和支出总计
     * @return {promise} 返回收入总计和支出总计
     */
    config.calcDataByMonth = function (month, year) {
        var me = this;
        return this.getDataByMonth(month, year).then(function (curMonthData) {
            return me.calcDate(curMonthData);
        });
    };


    /**
     * 计算所有的收入支出总计，并写入total表
     * @return {promise} 返回收入总计和支出总计
     */
    config.caclAllTotal = function (data) {
        var me = this;
        return localforage.getItem('list').then(function (list) {
            me.calcDate(list).then(function (data) {
                return localforage.setItem('total', data);
            });
        });
    };

    /**
     * 获取收入和支出总计（从total表）
     * @return {promise} 返回收入总计和支出总计
     */
    config.getAllTotal = function () {
        var me = this;
        return localforage.getItem('total').then(function (data) {
            if (!data || type.isEmptyObject(data)) {
                return localforage.setItem('total', {icm_total: 0, exp_total: 0});
            }
            return data;
        });
    };

    /**
     * 计算一个月的天数
     * @param month 月份
     * @param year 年
     * @returns {number} 天数
     */
    config.monthDays = function (month, year) {
        var days = 30;
        if (month === 2) {
            if (year%4 === 0) {
                days = 29;
            }
            else {
                days = 28;
            }
        }
        else {
            month = month + '';
            var reg = /^(1|3|5|7|8|10|12){1}$/;
            if (reg.test(month)) {
                days = 31;
            }
        }
        return days;
    };

    return config;

});
