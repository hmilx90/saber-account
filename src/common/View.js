/**
 * @file View 基类
 * @author cuiyongjian(cuiyongjian@outlook.com)
 */

define(function (require) {
    var Base = require('saber-mm').View;
    var inherits = require('saber-lang').inherits;
    var dom = require('saber-dom');
    var utilsCookie = require('./js/utils-cookie');

    function View(options) {
        Base.call(this, options);
    }

    inherits(View, Base);

    /**
     * 页面就绪状态
     *
     * @public
     */
    View.prototype.ready = function () {
        var widget = require('saber-widget');
        require('./widget/Navigation');
        require('./widget/Share');
        require('./widget/Confirm');

        // 初始化侧边导航
        var navbtn = this.query('.nav-btn');
        if (navbtn) {
            if (!this.constructor.prototype.navTplContent) {
                // 将模板挂在原型上，避免重复初始化
                View.prototype.navTplContent = this.template.render('nav-sidebar', {});
            }
            widget.navigation({
                main: this.main,
                btn: navbtn,
                content: View.prototype.navTplContent
            });
        }

        // 触发欢迎页
        var isShowWelcome = utilsCookie.getCookie('isShowWelcome');
        if (isShowWelcome !== 'yes') {
            this.redirect('welcome');
            utilsCookie.setCookie('isShowWelcome', 'yes', '100');
        }

        // 分享组件初始化
        this.confirmDialog = widget.confirm({wrapper: this.main});
        var shareBtn = dom.query('.icon-share2');
        if (shareBtn) {
            var shareDialog = this.shareDialog = widget.share(
                {
                    content: this.template.render('shareDialog', {}),
                    wrapper: this.main,
                    confirm: this.confirmDialog,
                    shareBtn: shareBtn
                }
            );
        }

        Base.prototype.ready.call(this);
    };

    /**
     * 弹气泡API，用于页面调用
     *
     * @param {string} text 气泡文本
     * @public
    */
    View.prototype.balloon = function (text) {
        var balloon = require('./widget/balloon');
        balloon(text);
    };


    return View;
});

