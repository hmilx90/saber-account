/**
 * @file 确认提示框
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var dom = require('saber-dom');
    var Resolver = require('saber-promise');
    var Widget = require('saber-widget/Widget');
    var inherits = require('saber-lang/inherits');

    /**
     * 使浮层居中
     *
     * @param {HTMLElement} ele 浮层主元素
     */
    function center(ele) {
        var height = ele.offsetHeight;
        ele.style.marginTop = (-1 * height / 2) + 'px';
    }

    /**
     * 二次确认浮层
     *
     * @class
     * @param {Object=} options 配置参数
     * @param {boolean|string} options.cancel 取消按钮的文案，默认为'取消'，如果为 `false` 则不显示取消按钮
     * @param {boolean|string} options.ok 确定按钮的文案，默认为'确定'，如果为 `false` 则不显示确定按钮
     * @param {HTMLElement=} options.wrapper 容器元素
     */
    function Confirm(options) {
        this.attrs = {
            cancel: {value: '取消'},
            ok: {value: '确定'},
            wrapper: {value: document.body}
        };

        Widget.apply(this, arguments);
    }

    inherits(Confirm, Widget);

    Confirm.prototype.type = 'Confirm';

    /**
     * 初始化DOM
     *
     * @public
     */
    Confirm.prototype.initDom = function () {
        var runtime = this.runtime;
        var main = this.main  = document.createElement('div');
        main.className = 'ui-confirm';

        var content = runtime.content = document.createElement('div');
        dom.setData(content, 'role', 'content');
        main.appendChild(content);

        var btnAreas = document.createElement('div');
        dom.setData(btnAreas, 'role', 'bar');
        main.appendChild(btnAreas);

        var btnCancel = runtime.btnCancel = document.createElement('span');
        var cancel = this.get('cancel');
        if (cancel !== false) {
            btnCancel.innerHTML = cancel;
        }
        else {
            btnCancel.style.display = 'none';
        }
        dom.setData(btnCancel, 'role', 'btn-cancel');
        btnAreas.appendChild(btnCancel);

        var btnOK = runtime.btnOK = document.createElement('span');
        var ok = this.get('ok');
        if (ok !== false) {
            btnOK.innerHTML = ok;
        }
        else {
            btnOK.style.display = 'none';
        }
        dom.setData(btnOK, 'role', 'btn-ok');
        btnAreas.appendChild(btnOK);
        runtime.mask = dom.query('.ui-mask');
        if (!(runtime.mask)) {
            var mask = runtime.mask = document.createElement('div');
            mask.className = 'ui-mask';            
        }

        dom.hide(this.main);
        dom.hide(runtime.mask);

        var wrapper = this.get('wrapper');
        wrapper.appendChild(runtime.mask);
        wrapper.appendChild(this.main);
    };

    /**
     * 显示浮层
     *
     * @public
     * @param {string} text 提示文本
     * @return {Promise}
     */
    Confirm.prototype.show = function (text) {
        var main = this.main;
        var runtime = this.runtime;
        var mask = runtime.mask;
        var content = runtime.content;

        content.innerHTML = text;
        dom.show(mask);
        dom.show(main);
        center(main);

        var me = this;
        var btnCancel = runtime.btnCancel;
        var btnOK = runtime.btnOK;
        var resolver = new Resolver();

        /**
         * 关闭浮层
         */
        function close() {
            me.removeEvent(btnCancel, 'click', cancel);
            me.removeEvent(btnOK, 'click', ok);
            content.innerHTML = '';
            dom.hide(main);
            dom.hide(mask);
        }

        /**
         * 取消处理
         */
        function cancel() {
            close();
            resolver.reject();
        }

        /**
         * 确定处理
         */
        function ok() {
            close();
            resolver.resolve();
        }

        this.addEvent(btnCancel, 'click', cancel);
        this.addEvent(btnOK, 'click', ok);

        return resolver.promise();
    };

    require('saber-widget').register(Confirm);

    return Confirm;
});
