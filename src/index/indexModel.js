/**
 * @file 
 * @author linjing03@
 */

define(function (require) {

    var Resolver = require('saber-promise');
    var extend = require('saber-lang').extend;
    var config = {};

    // var local = localforage;

    config.fetch = function () {
        // var sum = 0;
        // var income = 0;
        // var expense = 0;

        // var totalIncome = local.getItem('totalIncome');
        // var totalExpense = local.getItem('totalExpense');

        // var item = {
        //     income: income,
        //     expense: expense,
        //     sum: sum
        // };

        // return Resolver.all(totalIncome, totalExpense).then(function (data) {
        //     var item = {};
        //     if (data[0]) {
        //         item.income = data[0];
        //     }
        //     if (data[1]) {
        //         item.expense = data[1]
        //     }
        //     item.sum = item.income - item.expense;
        //     return item;
        // });
        


        /*
         * 从total表拿出收入和支出总计
         * @author: cuiyongjian
        */
        var dataHelp = require('../common/js/Data-manage');
        return dataHelp.getAllTotal().then(function (data) {
            extend(data, {
                my_total: data.icm_total - data.exp_total
            });
            return data;
        }, function (err) {
            return {};
        });

    };


    return config;

});
