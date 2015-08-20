/**
 * @file 
 * @author linjing03@
 */

define(function (require) {

    var Resolver = require('saber-promise');

    var config = {};

    var local = localStorage;

    config.fetch = function () {
        var data = this.getCost();
        return Resolver.resolved(data);
    };

    /*
    * 获取消费情况
    */
    config.getCost = function () {
        var sum = 0;
        var income = 0;
        var expense = 0;

        var list = local.getItem('list');
        if (list) {
            for (var i = 0, len = list.length; i < len; i ++) {
                if (list[i].type === 'income') {
                    income += parseInt(list[i].income);
                }
                else if (list[i].type === 'expense') {
                    expense += parseInt(list[i].expense);
                }
            }
            sum = income - expense;
        }

        return {
            sum: sum,
            income: income,
            expense: expense
        }
    }

    return config;

});
