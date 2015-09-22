/**
 * @file 
 * @author fengchuyan
 */

define(function (require) {

    var Resolver = require('saber-promise');
    var DataManage = require('../common/js/Data-manage');
    var sortMap = require('../common/js/config-sort');

    var config = {};


    function formatTime(timeStamp) {
        var date = new Date(timeStamp);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        return year + '年' + month + '月' + day + '日';
    }

    function formatRenderData(data) {
        var sortedList = {};

        for (var timeStamp in data) {
            var item = data[timeStamp];
            var sortKey = item.sort;
            item.sort = sortMap[sortKey];
            item.id = timeStamp;
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


    config.fetch = function (query) {
        var year = query.year;
        var month = query.month;
        var totalResult = {};

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
