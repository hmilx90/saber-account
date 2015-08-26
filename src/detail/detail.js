/**
 * @file 
 * @author ()
 */

define(function (require) {

    var bind = require('saber-lang/bind');
    var changeData = require('common/js/change-date');
    var dom = require('saber-dom');
    var extend = require('saber-lang/extend');

    var config = {};

    config.view = require('./detailView');

    config.model = require('./detailModel');

    config.datas = {
        month: new Date(Date.now()).getMonth() + 1,
        year: +new Date(Date.now()).getFullYear(),
    };

    config.events = {
        'ready': function () {
            var me = this;

            extend(me.datas, me.model.getFilterFromURL());
            extend(me.datas, {node: dom.g('time-line')});

            changeData.showTime(me.datas);

            me.model.getData(me.datas.month, me.datas.year).then(function (data) {
                refresh(data);
            });
        },
        'view:lastmonth': function () {
            var me = this;
            changeData.beforeMonth(me.datas.month, me.datas.year, me.datas.node, function (month, year) {
                me.model.getData(month, year).then(function (data) {
                    extend(me.datas, {month: month, year: year});
                    refresh(data);
                });
            });
        },
        'view:nextmonth': function () {
            var me = this;
            changeData.nextMonth(me.datas.month, me.datas.year, me.datas.node, function (month, year) {
                me.model.getData(month, year).then(function (data) {
                    extend(me.datas, {month: month, year: year});
                    refresh(data);
                });
            });
        }
    };

    function refresh (data) {
        var me = config;
        bind(me.model.initDatas(data), me.model);
        me.view.detail_Data = me.model.detail_Data;
        console.log(me.model.detail_Data);
        bind(me.view.renderCharts(), me.view);
    }

    return config;

});
