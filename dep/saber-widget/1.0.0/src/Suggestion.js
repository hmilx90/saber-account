/**
 * Saber Widget
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file Suggestion
 * @author junmer(junemr@foxmail.com)
 */

define(function (require) {

    var lang = require('saber-lang');
    var dom = require('saber-dom');
    var ajax = require('saber-ajax');
    var Resolver = require('saber-promise');
    var Widget = require('./Widget');

    /**
     * 搜索建议控件
     *
     * @class
     * @constructor
     *
     * ```html
     * <form action="http://www.baidu.com/s" method="get">
     *     <div class="ui-suggestion">
     *         <div>
     *             <input data-role="input" type="text" id="input" name="wd">
     *             <input data-role="search" type="submit" value="百度一下">
     *         </div>
     *     </div>
     * </form>
     * ```
     *
     * @exports Suggestion
     * @extends Widget
     * @requires saber-lang
     * @requires saber-dom
     * @requires saber-ajax
     * @fires Suggestion#request
     * @fires Suggestion#show
     * @fires Suggestion#hide
     * @param {Object=} options 初始化配置参数
     */
    function Suggestion(options) {

        this.attrs = {

            /**
             * 数据源地址
             *
             *
             * @type {string}
             */
            source: {
                value: 'http://suggestion.baidu.com/su?json=1'
            },

            /**
             * query 参数
             *
             * @type {string}
             */
            param: {
                value: 'wd'
            },

            /**
             * 是否开启jsonp
             *
             * @type {string|boolean}
             */
            jsonp: {
                value: 'cb'
            },

            /**
             * 是否启用 历史记录
             * 使用 localStorage 存储输入历史
             *
             * @type {boolean}
             */
            history: {
                value: false
            },

            /**
             * 清除 历史记录 是否需要confirm
             *
             * @type {boolean}
             */
            confirmClearHistory: {
                value: false
            },

            /**
             * 点击 suggestion 区域外，自动关闭
             *
             * @type {boolean}
             */
            autoClose: {
                value: true
            }

        };

        /**
         * 控件状态集
         *
         * @private
         * @type {Object}
         */
        this.states = {

            // 已显示
            show: false

        };

        // **MUST**最后调用父类的构造函数
        // 由于子类的`attrs`、`states`等需要与父类的对应默认值进行`mixin`
        Widget.apply(this, arguments);
    }


    Suggestion.prototype = {

        /**
         * 控件类型标识
         *
         * @readonly
         * @type {string}
         */
        type: 'Suggestion',

        /**
         * 初始化DOM
         *
         * @override
         */
        initDom: function () {

            var me = this;

            var main = me.get('main');

            // init sug
            if (!me.get('sug')) {

                var sugEle = document.createElement('div');

                dom.setData(sugEle, 'role', 'sug');

                main.appendChild(sugEle);

                me.set('sug', sugEle);

            }

            // init input
            me.get('input') || me.set('input', dom.query('[data-role=input]', main));

            // 关闭 autocomplete
            var inputEle = me.get('input');
            if (inputEle) {
                inputEle.setAttribute('autocomplete', 'off');
            }

            // init button
            me.get('search') || me.set('search', dom.query('[data-role=search]', main));

            // init reset
            me.get('reset') || me.set('reset', dom.query('[data-role=reset]', main));


        },

        /**
         * 初始化事件
         *
         * @override
         */
        initEvent: function () {
            var me = this;

            var input = me.get('input');

            me.addEvent(input, 'input', lang.bind(me.getSug, this));

            me.get('sugRenderer') || me.set('sugRenderer', me._getSugRenderer());

            var reset = me.get('reset');

            if (reset) {
                me.addEvent(reset, 'click', function () {
                    input.value = '';
                    me.hide();
                });
            }

            me.addEvent(me.get('sug'), 'click', function (ev) {
                me.emit('select', ev);
            });

        },

        getSug: function () {

            var me = this;

            var req = me._getReqHandler();

            req.then(function (data) {

                /**
                 * 获取数据
                 *
                 * @event
                 */
                me.emit('request', data);

                me.renderSug(data);

            });

        },

        _getSugRenderer: function () {

            var tplWrapper = '<ul data-role="ul">{#list}</ul>';

            function highlight(target, query) {
                return target.replace(query, '<em>' + query + '</em>');
            }

            return function (data) {

                var ret = [];
                var query = data.q;
                var rows = data.s;

                for (var key in rows) {
                    ret.push(''
                            + '<li data-key="' + rows[key] + '" >'
                            + highlight(rows[key], query)
                            + '</li>'
                    );
                }

                return tplWrapper.replace('{#list}', ret.join(''));
            };

        },

        renderSug: function (data) {

            var me = this;

            var renderer = me.get('sugRenderer');

            me.get('sug').innerHTML = renderer(data);

            me.show();

        },

        /**
         * 获取 数据请求 操作
         *
         * @private
         * @return {function} 数据请求操作
         */
        _getReqHandler: function () {

            var me = this;

            var url = me.get('source');
            var param = me.get('param');
            var value = me.get('input').value;

            url += (url.indexOf('?') > -1 ? '&' : '?') + param + '=' + value;


            var handler = me.get('request');

            // 传入 request
            if (handler) {
                return handler(url);
            }
            // jsonp
            else if (me.get('jsonp')) {
                handler = jsonp(url, {
                    key: me.get('jsonp')
                });
            }
            // ajax
            else {
                handler = ajax.get(url);
            }

            return handler;

        },


        // 历史记录 相关方法
        // todo 抽成plugin

        initHistory: function () {
        },
        getHistory: function () {
        },
        setHistory: function () {
        },
        clearHistory: function () {
        },

        /**
         * 显示 推荐列表
         *
         * @public
         */
        show: function () {

            var me = this;

            if (!me.is('show')) {

                dom.show(me.get('sug'));

                me.addState('show');

                me.emit('show');

            }

            return me;

        },

        /**
         * 隐藏 推荐列表
         *
         * @public
         */
        hide: function () {

            var me = this;

            if (me.is('show')) {

                dom.hide(me.get('sug'));

                me.removeState('show');

                me.emit('hide');

            }

            return me;

        }

    };

    /**
     * JSONP 非常简单版
     *
     * @param  {string} url     url
     * @param  {Object} options JSONP配置
     * @param  {Object} options.key JSONP 回调参数
     * @param  {Object} options.data 请求数据 只支持一层级的Object
     * @return {Promise}
     */
    function jsonp(url, options) {

        // init options
        options = options || {};
        // options.data            = options.data || {};
        options.key = options.key || 'callback';

        // init var
        var resolver = new Resolver();
        var callbackName = 'S_CB_' + Math.random().toString(12).substr(2);
        var script = document.createElement('script');
        // var data                = options.data;
        // data[options.key]       = callbackName;

        url = url + '&' + options.key + '=' + callbackName;

        // // set url
        // var params = [];
        // Object.keys(data).forEach(function (key) {
        //     params.push(key + '=' + encodeURIComponent(data[key]));
        // });
        // url += (url.indexOf('?') < 0 ? '?' : '&') + params.join('&');

        // create callback
        window[callbackName] = (function () {
            return function (res) {
                try {
                    resolver.resolve(res);
                }
                catch (e) {
                    resolver.reject(e);
                }
                finally {
                    window[callbackName] = null;
                    delete window[callbackName];
                    if (script) {
                        script.parentNode.removeChild(script);
                    }
                }

            };
        }());

        // send
        script.src = url;
        script.async = true;
        var parent = document.getElementsByTagName('head')[ 0 ] || document.body;
        parent.appendChild(script);
        parent = null;

        // return promise
        return resolver.promise();

    }

    lang.inherits(Suggestion, Widget);

    require('./main').register(Suggestion);


    return Suggestion;

});
