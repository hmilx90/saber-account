/**
 * @file 
 * @author fengchuyan
 *         wangshuo16
 */

define(function (require) {
    var dom = require('saber-dom');
    var changeData = require('common/js/change-date');
    var extend = require('saber-lang/extend');


    var config = {};

    config.view = require('./listView');

    config.model = require('./listModel');

    config.cur_datas = {
        year: +new Date(Date.now()).getFullYear(),
        month: new Date(Date.now()).getMonth() + 1
    };

    config.events = {
        'ready': function () {
            var me = this;
            this.model.fetch(me.cur_datas).then(function (data) {
                me.view.renderList(data);
                
            });
        },
         //'sleep': function () {
         //    this.scrollTop = document.body.scrollTop;
         //},
        'view: delete': function (id) {
            this.model.deleteItem(id).then(function (deletedItem) {
                var typeDom = deletedItem.type === 'expense' ? dom.query('.expense-value') : dom.query('.income-value');
                typeDom.innerHTML -= deletedItem.number;
            });
            
        },
        'wakeup': function () {
            //document.body.scrollTop = this.scrollTop;
            var me = this;
            this.model.fetch(me.cur_datas).then(function (data) {
                me.view.renderList(data);
                
            });
        },
        'view:lastmonth': function () {
            var me = this;
            changeData.beforeMonth(me.cur_datas.month, me.cur_datas.year, me.cur_datas.node, function (month, year) {
                extend(me.cur_datas, {month:month, year: year});
                me.model.fetch(me.cur_datas).then(function (data) {
                    me.view.renderList(data);
                    
                });
            });
        },
        'view:nextmonth': function () {
            var me = this;
            changeData.nextMonth(me.cur_datas.month, me.cur_datas.year, me.cur_datas.node, function (month, year) {
                extend(me.cur_datas, {month:month, year: year});
                me.model.fetch(me.cur_datas).then(function (data) {
                    me.view.renderList(data);
                    
                });
            });
        },
        'view:showcharts': function () {
            var me = this;
            this.redirect('/detail', me.cur_datas);
        }
    };

    return config;

});
