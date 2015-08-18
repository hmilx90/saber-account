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

        // 初始化菜单
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

        Base.prototype.ready.call(this);
    };

    return View;
});

