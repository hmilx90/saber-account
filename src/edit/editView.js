/**
 * @file editview
 * @author linjing03@
 */

define(function (require) {
    var config = {};
    var local = localforage;
    var nodes = [];
    var dom = require('saber-dom');
    var router = require('saber-router');

    config.template = require('./edit.tpl');


    config.events = {
        ready: function () {
            this.getElements();
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


    /*
    * 从列表页跳过来的话，数据回填渲染页面
    */
    config.renderPage = function (data) {
        nodes.num.innerHTML = data.number;
        nodes.num.setAttribute('origin', data.number);

        if (data.msg) {
            nodes.remark.value = data.msg;
        }

        if(data.sort !== this.accountInfo.sort) {
            $('.sortlist .active').removeClass('active');
            $('#edit-wrap [sort=' + data.sort + ']').find('div').addClass('active');
        }

        if (data.type !== this.accountInfo.type) {
            $('#tab-bnt .active').removeClass('active');
            $('#tab-bnt [type=' + data.type + ']').addClass('active');
        }
    }

    /*
    * 获取页面中常操作的Dom元素;
    */
    config.getElements = function () {
        nodes['remark'] = $('#edit-wrap [name="remark"]')[0];
        nodes['num'] = $('#edit-wrap [node-type="num"]')[0];
    }


    config.domEvents = {
        /**+
        * 计算器的一些方法
        * @param {DOM element} 显示的钱数的节点
        */
        'click:.keyboard p': function (ele) {
            nodes.num.focus();
            if (nodes.num.innerHTML === '0.0'){
                nodes.num.innerHTML = '';
            }
            var num = ele.getAttribute('num');
            nodes.num.innerHTML += num;
        },

        'click:.back': function () {
            nodes.num.focus();
            var str = nodes.num.innerHTML;
            if (str) {
                var len = str.length;
                str = str.substr(0, len-1);
            }
            nodes.num.innerHTML = str;
        },

        'click:.clear': function () {
            nodes.num.innerHTML = '0.0';
            nodes.num.focus();
        },

        /*
        * 保存记账数据
        */
        'click:.save': function () {
            var _this = this;
            var time = new Date().getTime();
            var id = 't' + time;

            var number = nodes.num.innerHTML;
            // 没有输入花费金额，不跳转到列表页
            if (number === nodes.num.getAttribute('origin')) {
                return;
            }

            number = Number(number).toFixed(2);

            /*
            * 将总花销记录到localforage;
            */
            // var tag = 'totalExpense';
            // var type = 'expense';
            // if (_this.accountInfo.type == 'income') {
            //     tag = 'totalIncome';
            //     type = 'income';
            // }
            // saveTotal(tag, number, type);

            /*
             * 更新total表。重算当前的最大收入和支出字段。
             * author: cuiyongjian
             * 在新数据save之后，再去更新total表
            */

            _this.accountInfo.msg = nodes.remark.value;
            _this.accountInfo.number = number;
            _this.accountInfo.time = time;

            // local.getItem('list', function (err, list) {
            //     if (!list) {
            //         list = {};
            //     }
            //     list[id] = _this.accountInfo;

            //     local.setItem('list', list, function (err,value) {
            //         //router.redirect("/list");
            //     });
            // });



            /*
             * 借助curd进行插入新数据
             * @author: cuiyongjian
            */
            var curdHelp = require('../common/js/curd');
            curdHelp.create(id, _this.accountInfo).then(function () {
                // 插入成功后，更新total表
                var dbManager = require('../common/js/Data-manage');
                dbManager.caclAllTotal();
                // 去列表页
                router.redirect('/list');
            });
        },

        /**
        * 分类操作
        */
        'click:.classify li': function (ele) {
            var sort = ele.getAttribute('sort');
            this.accountInfo.sort = sort;

            $('.classify .active').removeClass('active');
            var item = ele.getElementsByTagName('div')[0];
            dom.addClass(item,'active');
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

    /*
    * 每次记账时算总账；
    * @param {string} totalIncome || totalExpense
    * @number {number} 具体的数额
    * @type {string} income || expense
    */
    function saveTotal(tag, number, type) {
        local.getItem(tag, function (err, value) {
            if (!value) {
                value = 0;
            }
            value = Number(value);
            value += number;
            local.setItem(tag, value);
        });
    }

    return config;

});
