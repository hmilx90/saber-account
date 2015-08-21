/**
 * @file 
 * @author linjing03@
 */

define(function (require) {

    var Resolver = require('saber-promise');

    var config = {};

    var local = localforage;

    config.fetch = function () {
        var sum = 0;
        var income = 0;
        var expense = 0;
        var item = {
            sum: sum,
            income: income,
            expense: expense
        };

        var totalIncome = local.getItem('totalIncome');
        var totalExpense = local.getItem('totalExpense');

        return Resolver.all(totalIncome, totalExpense).then(function (data) {
            if (data[0]) {
                item.income = data[0];
            }
            if (data[1]) {
                item.expense = data[1]
            }
            item.sum = item.income - item.expense;
            return item;
        });
    };


    return config;

});
