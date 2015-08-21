/**
 * @file 页面菜单
 * @author cuiyongjian(cuiyongjian@outlook.com)
 */

define(function (require) {

    var Widget = require('saber-widget/Widget');
    var inherits = require('saber-lang/inherits');
    var bind = require('saber-lang/bind');
    var dom = require('saber-dom');

    /**
     * Navigation构造器
     *
     * @class
     * @param {Object} options 配置项
     * @param {string} options.content 侧边栏模板片段
     */
    function Navigation(options) {
        this.attrs = {
            content: {value: ''}
        };
        Widget.apply(this, arguments);
    }

    inherits(Navigation, Widget);

    Navigation.prototype.type = 'Navigation';

    /**
     * 初始化 DOM 元素
     */
    Navigation.prototype.initDom = function () {
        var runtime = this.runtime;
        runtime.wrapper = dom.query('.nav-sidebar');
        if (!runtime.wrapper) {
            var wrapper = runtime.wrapper = document.createElement('section');    
            wrapper.className = 'nav-sidebar';
            wrapper.innerHTML = this.get('content');
            document.body.appendChild(wrapper);
        }
        
        
        // 这里将wrapper添加到body下面，而不是this.main
        // 这是因为不在div.viewport节点下的元素，当页面切换不会释放该节点。可重用。
        runtime.mask = dom.query('.ui-mask');
        if (!(mask)) {
            var mask = runtime.mask = document.createElement('div');
            mask.className = 'ui-mask';
            dom.hide(mask);
            this.main.appendChild(mask);
        }
    };

    /**
     * 显示导航侧边栏
     *
     * @public
     */ 
    Navigation.prototype.show = function () {
        var runtime = this.runtime;

        dom.show(runtime.mask);
        dom.addClass(runtime.wrapper, 'showNav');
    };

    /**
     * 隐藏菜单浮层
     *
     * @public
     */
    Navigation.prototype.hide = function () {
        var runtime = this.runtime;

        dom.hide(runtime.mask);
        dom.removeClass(runtime.wrapper, 'showNav');
        this.removeEvent(this.main, 'touchmove', this.stopTouch);
    };

    /**
     * 初始化事件
     *
     * @public
     */
    Navigation.prototype.initEvent = function () {
        var me = this;
        var main = me.main;
        var btn = me.get('btn');
        var runtime = me.runtime;
        var wrapper = runtime.wrapper;
        var mask = runtime.mask;

        this.addEvent(btn, 'click', function (e) {
            if (e.target === btn) {
                me.show();
                e.stopPropagation();
                e.preventDefault();
            }
            me.addEvent(main, 'touchmove', me.stopTouch);
        });

        this.addEvent(mask, 'click', bind(this.hide, this));

        this.addEvent(dom.query('ul', wrapper), 'click', function (e) {
            var target = e.target;
            if (target.tagName === 'A' && target.href.match(/#.*/g)[0].substring(1) === location.hash.substring(2)) {
                me.hide();
            }
            // 上面这个判断多此一举，其实任何是A标签的点击，都得隐藏侧边栏
            if (target.tagName === 'A') {
                me.hide();
            }
        });
    };

    Navigation.prototype.stopTouch = function (e) {
        e.stopPropagation();
        e.preventDefault();
    }

    require('saber-widget').register(Navigation);

    return Navigation;

});
