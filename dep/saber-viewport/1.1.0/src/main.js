/**
 * @file 视口管理 页面换场、scroll等功能
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var dom = require('saber-dom');
    var extend = require('saber-lang/extend');
    var curry = require('saber-lang/curry');
    var Resolver = require('saber-promise');

    var config = require('./config');
    var Page = require('./Page');
    var transition = require('./transition');
    var mask = require('./mask');

    /**
     * 前景页面（当前呈现的页面）
     * @type {Page}
     */
    var frontPage;

    /**
     * 待转场页面
     * @type {Page}
     */
    var backPage;

    /**
     * 缓存的Page
     *
     * @type {Object}
     */
    var cachedPage = {};

    /**
     * URL访问记录
     *
     * @type {Array.<string>}
     */
    var visitHistory = [];

    /**
     * 转场页面滚动处理器
     *
     * @type {Object}
     */
    var scrollProcessor = {
        /**
         * 转场前处理
         *
         * @param {Page} front
         * @param {Page} back
         */
        before: function (front, back) {
            var container = config.scrollContainer;
            var height = front.data.scrollTop = container.scrollTop;
            var scrollHeight = back.data.scrollTop || 0;

            back.main.style.marginTop = height - scrollHeight + 'px';
        },
        /**
         * 转场后处理
         *
         * @param {Page} front
         * @param {Page} back
         */
        after: function (front, back) {
            var container = config.scrollContainer;
            back.main.style.marginTop = null;
            setTimeout(function () {
                container.scrollTop = back.data.scrollTop || 0;
            }, 10);
        }
    };

    /**
     * 初始化视口
     *
     * @inner
     */
    function initViewport() {
        var viewport = config.viewport;

        viewport.style.position = 'relative';
    }

    /**
     * 转场开始前处理
     *
     * @inner
     * @param {Page} front 前景页
     * @param {Page} back 后景页
     */
    function beforeTransition(front, back) {
        // 触发转场前事件
        if (front) {
            front.emit('beforeleave');
        }
        back.emit('beforeenter');

        if (config.mask) {
            mask.show();
        }
    }

    /**
     * 转场结束后处理
     *
     * @inner
     * @param {Page} front 前景页
     * @param {Page} back 后景页
     */
    function afterTransition(front, back) {
        if (config.mask) {
            mask.hide();
        }

        // 触发转场完成事件
        if (front) {
            front.emit('afterleave');
            // 如果前景页与后景页的容器元素相同
            // 则不再对前景页进行销毁操作
            if (front.main !== back.main) {
                front.remove();
            }
        }
        back.emit('afterenter');

        // 切换前后场景页
        backPage = null;
        frontPage = back;

        // 保存访问记录
        if (back.hasVisited) {
            visitHistory = visitHistory.slice(0, visitHistory.indexOf(back.url));
        }
        visitHistory.push(back.url);
    }

    /**
     * 视图控制器
     *
     * @type {Object}
     */
    var controller = {};

    /**
     * 页面转场
     *
     * @protected
     * @param {Page} page 将要进行转场操作的页面
     * @param {string|boolean=} type 转场类型
     * @param {object=} options 转场参数
     * @return {Promise}
     */
    controller.transition = function (page, type, options) {
        // 转场页面不是当前后景页面
        // 则放弃转场
        if (page !== backPage) {
            return Resolver.rejected();
        }

        options = options || {};
        options.frontPage = frontPage;
        options.backPage = page;
        options.processor = {};
        // 添加需要的处理器
        if (config.resetScroll) {
            options.processor.scroll = scrollProcessor;
        }

        beforeTransition(frontPage, page);

        return transition(type, options)
            .then(curry(afterTransition, frontPage, page));
    };

    /**
     * 初始化起始前景页面
     *
     * @inner
     * @param {string=} url
     * @param {Object=} options
     * @return {?Page}
     */
    function initFrontPgae(url, options) {
        var viewport = config.viewport;
        var children = dom.children(viewport);

        // 没有内容就不用创建Page了
        if (children.length <= 0) {
            return;
        }

        var page;
        if (arguments.length <= 0) {
            page = new Page('__blank__');
        }
        else {
            page = new Page(url, controller, options);
        }

        children.forEach(function (item) {
            page.main.appendChild(item);
        });
        viewport.appendChild(page.main);

        return page;
    }

    return {
        /**
         * 初始化
         * 返回当前的前景页
         *
         * @public
         * @param {HTMLElement|string} ele
         * @param {Object} options 全局配置参数 参考`./config.js`
         */
        init: function (ele, options) {
            if (typeof ele === 'string' || ele instanceof String) {
                ele = document.getElementById(ele);
            }
            config = extend(config, options);
            config.viewport = ele;

            initViewport();
        },

        /**
         * 设置初始页面
         *
         * @public
         * @param {string} url
         * @param {Object} options 配置参数
         * @param {boolean=} options.cached 是否缓存page
         * @param {boolean=} options.noCache 是否使用缓存
         * @return {?Page} 页面对象
         */
        front: function (url, options) {
            // 如果已经有前景页或者后景页
            // 不再能对初始页进行设置
            if (frontPage || backPage) {
                return;
            }

            options = options || {};
            page = initFrontPgae(url, options);
            if (page && options.cached) {
                cachedPage[url] = page;
            }

            return page;
        },

        /**
         * 加载url
         * 显示页面需要调用page.enter方法
         *
         * @public
         * @param {string} url
         * @param {Object} options 配置参数
         * @param {boolean=} options.cached 是否缓存page
         * @param {boolean=} options.noCache 是否使用缓存
         * @return {Page} 页面对象
         */
        load: function (url, options) {
            // 如果没有前景页
            // 尝试构造一个
            if (!frontPage) {
                frontPage = initFrontPgae();
            }

            options = options || {};

            // 创建新页面
            var page;
            if (!options.noCache) {
                page = cachedPage[url];
            }

            if (!page) {
                page = new Page(url, controller, options);
            }
            else {
                page = page.clone(options);
            }

            if (options.cached) {
                cachedPage[url] = page;
            }
            else if (cachedPage[url]) {
                delete cachedPage[url];
            }

            // 如果存在待转场页面则先移除
            if (backPage) {
                backPage.remove(true);
                if (cachedPage[backPage.url]) {
                    delete cachedPage[backPage.url];
                }
            }

            page.hasVisited = visitHistory.indexOf(url) >= 0;

            return backPage = page;
        },

        /**
         * 删除缓存
         *
         * @public
         * @param {string} url
         */
        delCache: function (url) {
            if (!url) {
                cachedPage = {};
            }
            else if (cachedPage[url]) {
                delete cachedPage[url];
            }
        }
    };
});
