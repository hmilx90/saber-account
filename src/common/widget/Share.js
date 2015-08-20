/**
 * @file 第三方分享
 * @author cxl(chenxinle@baidu.com)
 */

define(function (require) {
    var Widget = require('saber-widget/Widget');
    var inherits = require('saber-lang/inherits');
    var dom = require('saber-dom');

    var isAndroid = /(Android);?[\s\/]+([\d.]+)?/.test(navigator.userAgent);

    /**
     * 格式化字符串
     *
     * @param {string} str 待格式化的字符串
     * @param {Object} data 数据
     * @return {string}
     */
    function format(str, data) {
        data = data || {};
        return str.replace(/\${([^}]+)}/g, function ($0, $1) {
            var name = $1;
            if (data.hasOwnProperty(name)) {
                return data[name];
            }
            return '';
        });
    }

    /**
     * 分享页面类型
     *
     * @const
     * @type {Object}
     */
    var SHARE_TYPES = {
        NORMAL: 0,
        MALL: 1,
        PRODUCT: 2
    };

    /**
     * 默认的分享页面类型
     *
     * @const
     * @type {*}
     */
    var DEF_SHARE_TYPE = SHARE_TYPES.NORMAL;

    /**
     * 分享文本
     *
     * @const
     * @type {Array}
     */
    var TEXT_TPL = [
        '享特权，收好礼，我正在 百度VIP “赚”钱，你也来壕一次吧！',
        '通过百度权益中心在${name}购物有最高${num}%的返利，小伙伴快去看看吧',
        '通过百度权益中心在${mall}购买“${name}”只需${price}，而且还有最高${num}元的返利，小伙伴快去看看吧'
    ];

    /**
     * 分享链接
     *
     * @const
     * @type {Object}
     */
    var SHARE_URLS = {
        QQ: 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey'
            + '?url=${url}&title=%E7%99%BE%E5%BA%A6VIP%2C%E7%9C%81%E9%92%B1%E7%9C%81%E4%BA%8B%E7%9C%81%E6%97%B6'
            + '&desc=${content}&summary=&site=',
        WEIBO: 'http://service.weibo.com/share/share.php?title=${content}&url=${url}',
        DOUBAN: 'http://www.douban.com/share/service?href=${url}&text=${content}'
    };

    /**
     * 不支持分享的提示文本
     *
     * @const
     * @type {string}
     */
    var TIP_NORMAL = '暂不支持该分享，请长按上述内容进行“复制”，然后再分享';

    /**
     * 微信的特殊提示文本
     *
     * @const
     * @type {string}
     */
    var TIP_WECHAT = '由于微信暂不支持直接分享，请长按上述内容进行“复制”，然后到微信中发送给你的朋友，或者在朋友圈中分享';

    /**
     * Share
     *
     * @class
     * @param {Object} options 配置项
     * @param {string} options.content 菜单内容
     */
    function Share(options) {
        this.attrs = {
            text: {value: TEXT_TPL[DEF_SHARE_TYPE]},
            content: {value: ''},
            wrapper: {value: document.body},
            confirm: {value: null}
        };
        Widget.apply(this, arguments);
    }

    inherits(Share, Widget);

    Share.prototype.type = 'Share';

    /**
     * 设置分享的内容
     *
     * @param {string} type 分享的类型
     * @param {Object} data 分享数据
     */
    Share.prototype.setText = function (type, data) {
        var tpl = TEXT_TPL[SHARE_TYPES[type.toUpperCase()] || DEF_SHARE_TYPE];
        this.set('text', format(tpl, data));
    };

    /**
     * 初始化 DOM 节点
     *
     * @public
     */
    Share.prototype.initDom = function () {
        var runtime = this.runtime;
        var main = this.main = document.createElement('div');
        main.className = 'ui-share ui-share-hidden';
        main.innerHTML = this.get('content');

        // 在 android 上禁用 weibo 分享
        // 目前调用的 weibo 分享接口打开微博登录页面后
        // 页面会不停的尝试唤起weibo客户端，然后就无限循环了 ...
        // 等 webio 修复吧
        if (isAndroid) {
            var ele = main.querySelector('[data-action="weibo"]');
            if (ele) {
                ele.style.display = 'none';
            }
        }

        var mask = runtime.mask = document.createElement('div');
        mask.className = 'ui-mask';
        dom.hide(mask);

        var wrapper = this.get('wrapper');

        wrapper.appendChild(mask);
        wrapper.appendChild(main);
    };

    /**
     * 初始化事件
     *
     * @public
     */
    Share.prototype.initEvent = function () {
        var me = this;
        var runtime = me.runtime;

        function share(ele) {
            return function () {
                var target = ele.getAttribute('data-action');
                me.hide();
                me._share(target);
            };
        }
        // 绑定页面上的分享按钮事件
        if (this.get('shareBtn')) {
            this.addEvent(this.get('shareBtn'), 'click', this.show);
        }
        // 绑定 mask 的点击关闭事件
        this.addEvent(runtime.mask, 'click', this.hide);

        // 绑定分享按钮事件
        var eles = this.main.querySelectorAll('span[data-action]');
        eles = Array.prototype.slice.call(eles);
        eles.forEach(function (ele) {
            me.addEvent(ele, 'click', share(ele));
        });

        // 绑定取消事件
        var ele = this.main.querySelector('.btn-close');
        if (ele) {
            this.addEvent(ele, 'click', this.hide);
        }
    };

    /**
     * 分享
     *
     * @private
     * @param {string} target 分享目标
     */
    Share.prototype._share = function (target) {
        var url = SHARE_URLS[target.toUpperCase()];
        var content = this.get('text');

        if (url) {
            url = format(
                url,
                {
                    content: encodeURIComponent(content),
                    url: encodeURIComponent(location.href)
                }
            );
            window.open(url);
        }
        else {
            content = '<p class="share">' + content + ' http://vip.baidu.com </p><p class="tip">';
            if (target === 'wechat') {
                content += TIP_WECHAT;
            }
            else {
                content += TIP_NORMAL;
            }
            content += '</p>';
            var confirmDialog = this.get('confirm');
            if (confirmDialog) {
                confirmDialog.show(content);
            }
        }
    };

    /**
     * 显示分享浮层
     *
     * @publci
     */
    Share.prototype.show = function () {
        var runtime = this.runtime;
        dom.show(runtime.mask);
        dom.removeClass(this.main, 'ui-share-hidden');
    };

    /**
     * 隐藏分享浮层
     *
     * @publci
     */
    Share.prototype.hide = function () {
        var runtime = this.runtime;
        dom.hide(runtime.mask);
        dom.addClass(this.main, 'ui-share-hidden');
    };

    require('saber-widget').register(Share);

    return Share;
});
