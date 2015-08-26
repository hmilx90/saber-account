/**
 * @file 
 * @author fengchuyan
 */

define(function (require) {

    var Resolver = require('saber-promise');
    var DataManage = require('../common/js/Data-manage');

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

    function formatTime(timeStamp) {
        var date = new Date();
        var year = date.getFullYear(timeStamp);
        var month = date.getMonth(timeStamp) + 1;
        var day = date.getDate(timeStamp);
        return year + '年' + month + '月' + day + '日';
    }

    function formatRenderData(data) {
        var sortedList = {};

        for (var timeStamp in data) {
            var item = data[timeStamp];
            var sortKey = item.sort;
            item.sort = sortMap[sortKey];
            item.id = 't' + item.time;
            item.time = formatTime(item.time);
            

            // 将同一天的收支放在同一个数组里
            var dayKey = item.time;
            if(!sortedList[dayKey]) {
                sortedList[dayKey] = [];
            }
            sortedList[dayKey].push(item);
        }
        return sortedList;
    }

    var config = {};

    config.fetch = function (query) {
        var year = query.year;
        var month = query.month;
        var totalResult = {};
        var monthData = DataManage.getDataByMonth(month, year);


        return DataManage.getDataByMonth(month, year).then(function (data) {

            var listRenderData = formatRenderData(data);
            totalResult = DataManage.calcDate(data);

            return {
                year: year,
                month: month,
                icm_total: totalResult.icm_total,
                exp_total: totalResult.exp_total,
                listData: listRenderData
            };
        });

    };

    config.getMonthTotal = function (data) {
        localforage.getItem('list');

    };

    config.deleteItem = function (id) {
        var total = DataManage.getAllTotal();
        var list = localforage.getItem('list');
        return Resolver.all(list, total).then(function (data) {
            
            var listData = data[0];
            var total = data[1];

            for(var key in listData) {
                if(id === key) {
                    var deletedItem = listData[key];

                    if(deletedItem.type === 'expense'){
                        total.exp_total -= deletedItem.number;
                    }
                    else {
                        total.icm_total -= deletedItem.number;
                    }
                    delete listData[key];
                }
            }
            localforage.setItem('total', total);
            localforage.setItem('list', listData);
            return deletedItem;
        });

    };

    return config;

});
