/**
 * @file editview
 * @author linjing03@
 */

define(function (require) {
    var config = {};
    var local = localStorage;
    var nodes = [];
    var dom = require('saber-dom');

    config.template = require('./edit.tpl');


    config.events = {
        ready: function () {
            node = document.getElementById('edit');
            nodes['remark'] = $('#edit [name="remark"]')[0];
            nodes['num'] = $('#edit [node-type="num"]')[0];
        }
    };

    /**
    * 保存时默认的存储数据
    * 默认为支出餐饮类型；
    */
    config.accountInfo = {
        type: 'expense',
        sort: 'food',
        number: '',
        msg: '',
        time: ''
    };

    config.domEvents = {
        /**+
        * 计算器的一些方法
        * @param {DOM element} 显示的钱数的节点
        */
        'click:.keyboard p': function (ele) {
            if (nodes.num.innerHTML === '0.0'){
                nodes.num.innerHTML = '';
            }
            var num = ele.getAttribute('num');
            nodes.num.innerHTML += num;
        },

        'click:.back': function () {
            var str = nodes.num.innerHTML;
            if (str) {
                var len = str.length;
                str = str.substr(0, len-1);
            }
            nodes.num.innerHTML = str;
        },

        'click:.clear': function () {
            nodes.num.innerHTML = '0.0';
        },
        /*
        * 保存记账数据
        */
        'click:.save': function () {
            var _this = this;
            var time = new Date().getTime();
            var id = 't' + time;
            var data = {};
            var number = Number(nodes.num.innerHTML);
            number = Math.round(number);

            _this.accountInfo.msg = nodes.remark.value;
            _this.accountInfo.number = number;
            _this.accountInfo.time = time;

            data[id] = _this.accountInfo;

            var list = local.getItem('list');
            if (!list) {
                list = [];
            }
            else {
                list = JSON.parse(list);
            }

            list.push(data);
            list = JSON.stringify(list);
            local.setItem('list', list);
        },

        /**
        * 分类操作
        */
        'click:.classify li': function (ele) {
            var sort = ele.getAttribute('sort');
            this.accountInfo.sort = sort;

            $('.classify li').removeClass('active');
            dom.addClass(ele,'active');
        },

        'click:.tab-line span': function (ele) {
            var type = ele.getAttribute('type');
            this.accountInfo.type = type;

            $('.tab-line span').removeClass('active');
            dom.addClass(ele,'active');

            var other = ele.getAttribute('other');

            dom.g(other + 'Btn').style.display = 'none';
            dom.g(type + 'Btn').style.display = '';

        }

    }

    return config;

});
