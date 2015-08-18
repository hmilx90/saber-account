/**
 * @file 
 * @author wangshuo16
 */

define(function (require) {

    var Resolver = require('saber-promise');
    var db = openDatabase('accountdb', '', 'account database', 2 * 1024 * 1024);


    var config = {};


    config.fetch = function () {
        //var me = this;
        //return Resolver.resolved(me.calcDate());
        return Resolver.resolved();

    };

    function getData(year, month) {
        year = year || + new Date().getFullYear();
        month = month || new Date().getMonth() + 1;

        var start_date = Date.parse(new Date(year, month-1, 1, 0, 0, 0).toISOString());
        var end_date = Date.parse(new Date(year, month, 1, 0, 0, 0).toISOString());
        db.transaction(function (tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS AccountList(' +
                'time INTEGER, type TEXT, sort TEXT, number FLOAT, msg TEXT)', []);
            tx.executeSql('SELECT * FROM AccountList WHERE time BETWEEN ? AND ?', [start_date, end_date], function (tx, rs) {
                return rs.rows;
            });
        });
    }

    config.calcDate = function () {
        var result = {icm_total:0, exp_total:0};
        var date = getData();
        for(var i = 0, len; i < (len = date.length); i++){
            var item = date.item(i);
            if(item.type = 'income'){
                result.icm_total += item.number;
            }
            else if(item.type = 'expense'){
                result.exp_total += item.number;
            }
            else{}
        }
        return result;
    };

    return config;

});
