/**
 * @file 记账数据展示;
 * @author linjing03@
 */

define(function (require) {

    var config = {};
    var dom = require('saber-dom');
    var router = require('saber-router');

    config.template = require('./list.tpl');

    config.domEvents = {

        // 每条记录的展开和收起操作;
        'click: .time-line': function (ele, e) {
            dom.toggleClass(ele.parentNode, 'toggle');
        },

        /** 
        * 删除记录
        * @param {element} target 
        */
        'click: .delete-icon': function (ele) {
            var itemDom = dom.closest(ele, 'dd', dom.g('main'));
            this.emit('delete', dom.getData(itemDom, 'id'));
            itemDom.parentNode.removeChild(itemDom);
        },

        /** 
        * 编辑记录
        * @param {element} target 
        */
        'click: .edit-icon': function (ele) {
            var itemDom = dom.closest(ele, 'dd', dom.g('main'));
            this.redirect('/edit', {id: dom.getData(itemDom, 'id')});
        },

        //下个月的数据展示;
        'click:.direction-left': function () {
            this.emit('lastmonth');
        },

        //上个月的数据展示;
        'click:.direction-right': function () {
            this.emit('nextmonth');
        },

        //去详情页面;
        'click:.icon-pie-chart': function () {
            this.emit('showcharts');
        }
    };

    config.renderList = function (data) {
        var html = this.template.render('listBody', data);
        dom.g('main').innerHTML = html;
    }

    return config;

});
