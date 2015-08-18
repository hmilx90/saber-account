/**
 * @file View 基类
 * @author cuiyongjian(cuiyongjian@outlook.com)
 */

define(function (require) {
    var Base = require('saber-mm').View;
    var inherits = require('saber-lang').inherits;
    var dom = require('saber-dom');

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

        // 初始化侧边导航
        var navbtn = this.query('.nav-btn');
        if (navbtn) {
            nav = widget.navigation({
                main: this.main,
                btn: navbtn,
                content: this.template.render('nav-sidebar', {})
            });
            nav.on('share', function () {
                shareDialog.show();
            });
        }

        // 触发欢迎页
        var isShowWelcome = getCookie('isShowWelcome');
        if (isShowWelcome !== 'yes') {
            this.redirect('welcome');
            setCookie('isShowWelcome', 'yes', '100');
        }

        Base.prototype.ready.call(this);
    };



    /**
     * 拿cookie
     *
     * private
     * @param {string} key cookie键
    */
    function getCookie(key) {
        if (document.cookie.length>0) { 
            c_start=document.cookie.indexOf(key + "=")
            if (c_start!=-1) {
            c_start=c_start + key.length+1 
            c_end=document.cookie.indexOf(";",c_start)
            if (c_end==-1) c_end=document.cookie.length
                return unescape(document.cookie.substring(c_start,c_end))
            } 
        }
        return ""
    }

    /**
     * set cookie
     *
     * private
     * @param {string} key cookie键
     * @param {string} value cookie值
     * @param {number} expiredays 过期天数
    */
    function setCookie(key, value, expiredays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate + expiredays);
        document.cookie = key + '=' + escape(value)
        + ((expiredays==null) ? "" : ";expires="+exdate.toGMTString());

    }

    return View;
});

