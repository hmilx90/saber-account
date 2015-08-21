/**
 * @file 移动记账本编辑页面 
 * @author linjing03@
 */

define(function (require) {

    var Resolver = require('saber-promise');
    // 同href中?的功能一样，后面用于添加参数;
    var startFlag = '~';
    var config = {};
    var local = localforage;

    config.fetch = function () {
        return Resolver.resolved();
    };

    /*
    * 从明细页面跳过来的时候，将数据回填；
    */
    config.getData = function (callback) {
        var resolver = new Resolver();
        var id = this.getId();
        if (!id) {
            resolver.reject();
        }
        local.getItem('list', function (err, list) {
            if (id && list[id]) {
                data = list[id];
                resolver.resolve(data);
            }
        });
        return resolver.promise();
    }

    /*
    * 获取地址栏的id;
    */
    config.getId = function () {
        var href = location.hash.substr(1);
        var start = href.indexOf(startFlag);
        href = href.substr(start + 1);

        if (href.indexOf('id') > -1) {
            var id = getQuery(href, 'id');
            return id;
        }
        return false;
    }

    /*
    * 获取query中的特定参数
    * @param {string} query字符串
    * @param {string} key
    */
    function getQuery (str, key) {
        var arr1 = [];
        arr1 = str.split('&');
        for (var i = 0, len = arr1.length; i < len; i++) {
            if (arr1[i].indexOf('=') > -1) {
                var arr2 = arr1[i].split('=');
                return arr2[1];
            }
        }
    }



    return config;

});
