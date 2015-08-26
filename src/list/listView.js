/**
 * @file 
 * @author ()
 */

define(function (require) {

    var config = {};
    var dom = require('saber-dom');
    var router = require('saber-router');

    config.template = require('./list.tpl');

    config.domEvents = {
        'click: h4': function (ele, e) {
            dom.toggleClass(ele.parentNode, 'toggle');
        },
        'click: .delete-icon': function (ele, e) {
            var itemDom = dom.closest(ele, 'dd', dom.g('main'));
            this.emit('delete', dom.getData(itemDom, 'id'));
            itemDom.parentNode.removeChild(itemDom);
        },
        'click: .edit-icon': function (ele, e) {
            var itemDom = dom.closest(ele, 'dd', dom.g('main'));
            this.redirect('/edit', dom.getData(itemDom, 'id'));
        },
        'click:.direction-left': function () {
            this.emit('lastmonth');
        },
        'click:.direction-right': function () {
            this.emit('nextmonth');
        },
        'click:.icon-pie-chart': function () {
            this.emit('showcharts');
        }
    };

    // config.events = {
    //     ready: function () {
    //         var year = new Date().getFullYear();
    //         var month = new Date().getMonth() + 1;
    //         dom.query('.time').innerHTML = year + '年' + month + '月';
    //         var timeBar = dom.query('.time-line');
    //         dom.setStyle(timeBar, 'data-time', new Date().getTime());

    //     }
    // };


    return config;

});
