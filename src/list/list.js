/**
 * @file 数据列表;
 */

define(function (require) {
    var dom = require('saber-dom');
    var changeData = require('common/js/change-date');
    var extend = require('saber-lang/extend');


    var config = {};

    config.view = require('./listView');

    config.model = require('./listModel');

    /*
    * 初始化list数据
    */
    config.cur_datas = {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1
    };

    /*
    * 获取数据
    */
    config.requestData = function () {
        var me = this;
        me.model.fetch(me.cur_datas).then(function (data) {
            me.view.renderList(data);
        });
    }

    config.events = {
        // 每次都要重新读取数据;
        'wakeup': function () {
            this.requestData();
        },

        'view: delete': function (id) {
            this.model.deleteItem(id).then(function (deletedItem) {
                var typeDom = deletedItem.type === 'expense' ? dom.query('.expense-value') 
                                                             : dom.query('.income-value');
                typeDom.innerHTML -= deletedItem.number;
            }); 
        },


        'view:lastmonth': function () {
            var me = this;
            var month = me.cur_datas.month;
            var year = me.cur_datas.year;
            var node = me.cur_datas.node;

            changeData.beforeMonth(month, year, node, function (month, year) {
                extend(me.cur_datas, {month:month, year: year});
                this.requestData();
            });
        },

        'view:nextmonth': function () {
            var me = this;
            var month = me.cur_datas.month;
            var year = me.cur_datas.year;
            var node = me.cur_datas.node;

            changeData.nextMonth(month, year, node, function (month, year) {
                extend(me.cur_datas, {month:month, year: year});
                this.requestData();
            });
        },

        'view:showcharts': function () {
            var me = this;
            this.redirect('/detail', me.cur_datas);
        }
    };

    return config;

});
