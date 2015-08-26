/**
 * @file 取数据，对数据进行处理
 * @author wangshuo16
 */

define(function (require) {



    var config = {};
    var type = require('saber-lang/type');
    // 同href中?的功能一样，后面用于添加参数;
    var startFlag = '~';

    localforage.config({
        name: 'myApp',
        version: 1.0,
        storeName: 'db_account', // Should be alphanumeric, with underscores.
        description: 'this is a db for account'
    });

    /**
     * 取指定月份的数据
     * @param {number} month 月
     * @param {number} year 年
     * @return {Promise} 返回数据
     */

    config.getDataByMonth = function (month, year) {
        // 无指定年月时，默认当前月
        year = year || + new Date().getFullYear();
        month = month || new Date().getMonth() + 1;

        var start_date = Date.parse(new Date(year, month - 1, 1, 0, 0, 0).toISOString());
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
     * @param {obj} list obj
     * @return {Object} 返回收入总计和支出总计
     */

    config.calcDate = function (data) {

        var result = {
            icm_total: 0,
            exp_total: 0
        };

        for (var key in data) {
            var item = data[key];
            if (item.type === 'income') {
                result.icm_total += Number(item.number);
            }
            else if (item.type === 'expense') {
                result.exp_total += Number(item.number);
            }
            else {
                console.warn('type中存储内容有误');
            }
        }
        return result;
    };

    /**
     * 计算某个月份的收入总计和支出总计
     * @param {number} 月
     * @param {number} 年
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

            return localforage.setItem('total',  me.calcDate(list));

        });
    };

    /**
     * 获取收入和支出总计（从total表）
     * @return {promise} 返回收入总计和支出总计
     */
    config.getAllTotal = function () {
        return localforage.getItem('total').then(function (data) {
            if (!data || type.isEmptyObject(data)) {
                return localforage.setItem('total', {icm_total: 0, exp_total: 0});
            }
            return data;
        });
    };

    /**
     * 计算一个月的天数
     * @param {number} 月
     * @param {number} 年
     * @return {number} 天数
     */
    config.monthDays = function (month, year) {
        var days = 30;
        if (month === 2) {
            if (year % 4 === 0) {
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

    /*
    * 获取地址栏的id;
    */

    config.getId = function () {
        var href = location.hash.substr(1);
        var start = href.indexOf(startFlag);
        href = href.substr(start + 1);
        if (href.indexOf('id') > -1) {
            var id = this.getQuery(href, 'id');
            return id;
        }
        return false;
    };

    /*
    * 获取query中的特定参数
    * @param {string} query字符串
    * @param {string} key
    */
    config.getQuery = function (str, key) {
        var arr1 = [];
        arr1 = str.split('&');
        for (var i = 0, len = arr1.length; i < len; i++) {
            if (arr1[i].indexOf('=') > -1) {
                var arr2 = arr1[i].split('=');
                return arr2[1];
            }
        }
    };

    return config;

});
