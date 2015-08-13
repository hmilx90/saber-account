/**
 * @file ER适配器
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var curry = require('saber-lang/curry');
    var events = require('er/events');
    var viewport = require('../main');

    var curPage;

    var blank = function () {};

    /**
     * 延迟view的enterDocument方法
     *
     * @inner
     * @param {Action} action
     */
    function delayEnterDoc(action) {
        var fn = action.view.enterDocument;
        action.view.enterDocument = blank;
        return function () {
            fn.call(action.view);
        };
    }

    /**
     * 修正view的render
     *
     * @inner
     * @param {Page} page 待转场页面
     */
    function fixRender(page) {
        // 修改view的视图主区域
        // TODO 最好的方式还是使用离岸的main区域
        var ele = page.main;
        ele.id = '_ER_MAIN_' + (new Date()).getTime() + '_';
        ele.style.display = 'none';
        document.body.appendChild(ele);
        this.view.container = ele.id;

        // 如果有前页
        // 则将待转场action的enterDocument延后执行(放到page的afterleave事件中)
        // 在page的afterenter触发前 会同时存在两个页面 id、className神马的可能会冲突的...
        page.on('afterenter', delayEnterDoc(this));
    }

    /**
     * 初始化
     *
     * @inner
     */
    function init() {
        events.on('enteraction', function (context) {
            var page = viewport.load(context.url.getPath());

            // 重置action leave方法
            // 完成转场后再调用
            var leaveHandler = context.action.leave;
            context.action.leave = blank;
            page.on('afterleave', function () {
                leaveHandler.call(context.action);
            });

            // 修正render
            context.action.on(
                'beforerender',
                curry(fixRender, page)
            );

            curPage = page;
        });

        events.on('enteractioncomplete', function () {
            if (curPage) {
                curPage.main.style.display = '';
                curPage.enter();
            }
        });
    }

    return function (ele, options) {
        // 初始化viewport
        viewport.init(ele, options);

        init();
    };
});
