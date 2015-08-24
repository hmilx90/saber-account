/**
 * @file 
 * @author ()
 */

define(function (require) {

    var bind = require('saber-lang/bind');

    var config = {};

    config.view = require('./detailView');

    config.model = require('./detailModel');

    config.events = {
        'ready': function () {
            var me = this;

            me.model.getData().then(function (data) {

                bind(me.model.initDatas(data), me.model);

                //me.model.countDataPerDay(data);
                //
                //var sorts_exp = ['餐饮','购物','酒店','交通','娱乐','通讯','医疗','投资理财'];
                //this.view.sortscount_exp = me.model.countDataBySorts(data, sorts_exp);
                //
                //var sorts_exp = ['工资','投资收入','红包','其它'];
                //this.view.sortscount_inc = me.model.countDataBySorts(data, sorts_exp);

                me.view.detail_Data = me.model.detail_Data;

                bind(me.view.renderCharts(), me.view);
            });
        }
    };

    return config;

});
