/**
 * @file 
 * @author wangshuo16
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
        year: +new Date(Date.now()).getFullYear()
    };

    config.events = {
        'ready': function () {
            var me = this;

            extend(me.datas, me.model.getFilterFromURL());
            extend(me.datas, {node: dom.g('time-line')});

            changeData.showTime(me.datas);

            refresh();
        },
        'view:lastmonth': function () {
            var me = this;
            changeData.beforeMonth(me.datas.month, me.datas.year, me.datas.node, function (month, year) {
                extend(me.datas, {month: month, year: year});
                refresh();
            });
        },
        'view:nextmonth': function () {
            var me = this;
            changeData.nextMonth(me.datas.month, me.datas.year, me.datas.node, function (month, year) {
                extend(me.datas, {month: month, year: year});
                refresh();
            });
        }
    };

    function refresh () {
        var me = config;
        me.model.fetch(me.datas).then(function (data) {
            me.view.renderTotal(data);
            me.view.detail_Data = me.model.detail_Data;
            bind(me.view.renderCharts(), me.view);
        });
    }

    return config;

});
