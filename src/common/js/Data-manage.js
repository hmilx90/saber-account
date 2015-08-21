/**
 * 取数据，对数据进行处理
 * @author wangshuo16
 */

define(function (require) {

    var Resolver = require('saber-promise');

    var config = {};

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
            for(var k in value) {
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
     * @return {promise} 返回收入总计和支出总计
     */
    config.calcDate = function (data) {

        var result = {
            icm_total: 0,
            exp_total: 0
        };
        var resolver = new Resolver();

        for(var key in data ){
            var item = data[key];
            if(item.type = 'income'){
                result.icm_total += item.number;
            }
            else if(item.type = 'expense'){
                result.exp_total += item.number;
            }
            else{
                console.warn('type中存储内容有误');
            }
        }

        return resolver.resolved(result);
    }

    return config;

});