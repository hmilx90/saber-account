/**
 * @file main
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var Emitter = require('saber-emitter');
    var Resolver = require('saber-promise');
    var FastClick = require('fastclick');
    var extend = require('saber-lang/extend');
    var bind = require('saber-lang/bind');
    var curry = require('saber-lang/curry');
    var viewport = require('saber-viewport');
    var mm = require('saber-mm');

    var globalConfig = require('./config');


    var filters = [];
    var cachedAction = {};
    var cur = {};

    var exports = {};
    Emitter.mixin(exports);

    /**
     * 获取全局配置的附加处理器
     *
     * @inner
     * @param {string} name 处理器名称
     * @return {function|undefined}
     */
    function getProcessor(name) {
        var processor = globalConfig.processor || {};
        return processor[name];
    }

    /**
     * action加载完成
     *
     * @inner
     * @param {Object} route 路由信息
     */
    function finishLoad(route) {
        route.done();
    }

    /**
     * 清除所有的缓存action
     *
     * @inner
     */
    function clearCache() {
        var action;
        Object.keys(cachedAction).forEach(function (path) {
            action = cachedAction[path];
            if (cur.action !== action) {
                action.dispose();
            }
        });
        cachedAction = {};
        viewport.delCache();
    }

    /**
     * 删除缓存的action
     *
     * @inner
     * @param {string} path 路由
     */
    function delCache(path) {
        var action = cachedAction[path];
        if (!action) {
            return;
        }
        // 如果不是当前显示的action则进行dispose
        // 如果是当前显示的action，后续leave会处理
        if (cur.action !== action) {
            action.dispose();
        }
        delete cachedAction[path];
        viewport.delCache(path);
    }

    /**
     * 保存当前Action相关信息
     *
     * @inner
     * @param {Action} action action对象
     * @param {Object} route 路由信息
     * @param {Page} page 页面对象
     */
    function dumpInfo(action, route, page) {
        if (action) {
            cur.action = action;
            if (route.cached) {
                cachedAction[route.path] = action;
            }
        }
        else {
            cur.action = null;
        }

        cur.route = route;
        cur.page = page;
        cur.path = route.path;
    }

    /**
     * 启动Action
     *
     * @inner
     * @param {Object} route 路由信息
     * @param {string} route.path 请求路径
     * @param {Object} route.action action配置
     * @param {Object} route.query 查询条件
     * @param {boolean=} route.cached 是否缓存action
     * @param {Object=} route.transition 转场配置
     * @param {Object} route.options 跳转参数
     * @param {boolean} route.options.force 强制跳转
     * @param {boolean=} route.options.noCache 不使用缓存action
     * @param {Object} action Action对象
     */
    function enterAction(route, action) {
        var options = route.options || {};

        // 获取页面转场配置参数
        var transition = route.transition || {};
        // 调用全局配置中的处理函数进行转场参数处理
        var processor = getProcessor('transition');
        if (processor) {
            extend(transition, processor(route, cur.route) || {});
        }

        // 如果请求路径没有变化
        // 取消转场效果
        if (route.path === cur.path) {
            transition.type = false;
        }

        var page = viewport.load(
            route.path,
            {
                cached: route.cached,
                noCache: options.noCache
            }
        );

        /**
         * 触发全局事件
         *
         * @inner
         * @type {string} eventName 事件名称
         */
        var fireEvent = (
            function (eventArgBack, eventArgFront) {
                return function (eventName) {
                    exports.emit(eventName, eventArgBack, eventArgFront);
                };
            }
        )(
            {
                route: extend({}, route),
                action: action,
                page: page
            },
            {
                route: extend({}, cur.route),
                action: cur.action,
                page: cur.page
            }
        );

        // 在转场结束时触发afterlaod事件
        page.on('afterenter', curry(fireEvent, 'afterload'));
        // 触发beforeload事件
        fireEvent('beforeload');

        // 加载计时器
        // 防止加载时间过长
        var timer;

        /**
         * 开始转场动画
         *
         * @inner
         * @param {boolean} error 是否发生了加载错误
         * @return {Promise}
         */
        function startTransition(error) {
            // 清除状态重置定时器，防止干扰转场动画
            clearTimeout(timer);
            // 触发`beforetransition`
            fireEvent('beforetransition');

            dumpInfo(!error && action, route, page);

            if (error) {
                return page
                        .enter(transition.type, transition)
                        .then(bind(Resolver.rejected, Resolver));
            }
            return page.enter(transition.type, transition);
        }

        var method;
        var delayMethods = ['complete'];
        var args = [route.path, route.query, options];

        /**
         * action加载失败处理
         *
         * @inner
         * @return {Promise}
         */
        function enterFail() {
            fireEvent('error');
            return startTransition(true);
        }

        /**
         * 转场正常完成处理
         *
         * @inner
         */
        function finishTransition() {
            delayMethods.forEach(function (name) {
                action[name]();
            });
            finishLoad(route);
        }

        // 如果没有缓存则使用enter
        // 否则使用wakeup
        if (!cachedAction[route.path]) {
            method = 'enter';
            // 补充enter参数
            args.unshift(page.main);
            // 没有缓存时还需要ready调用
            delayMethods.unshift('ready');
        }
        else {
            method = 'wakeup';
            // 已缓存时需要调用revived
            delayMethods.unshift('revived');
        }

        // 设置加载超时计时器
        timer = setTimeout(curry(finishLoad, route), globalConfig.timeout);

        // 开始加载action
        action[method]
            .apply(action, args)
            // 开始转场操作
            .then(startTransition, enterFail)
            // 转场完成处理
            .then(finishTransition, curry(finishLoad, route));
    }

    /**
     * 加载Action
     *
     * @inner
     * @param {Object} route 路由信息
     * @param {string} route.path 请求路径
     * @param {Object} route.action action配置
     * @param {Object} route.query 查询条件
     * @param {boolean=} route.cached 是否缓存action
     * @param {Object=} route.transition 转场配置
     * @param {Object} route.options 跳转参数
     * @param {boolean} route.options.force 强制跳转
     * @param {boolean=} route.options.noCache 不使用缓存action
     */
    function loadAction(route) {
        var options = route.options || {};

        // 如果路径未发生变化
        // 只需要刷新当前action
        if (route.path === cur.path
            && !options.force
            && cur.action // 会有存在cur.path但不存在cur.action的情况，比如action加载失败
            && cur.action.refresh
        ) {
            var ret = cur.action.refresh(route.query, route.options);
            // 兼容refresh同步的情况
            if (!ret || typeof ret.then !== 'function') {
                finishLoad(route);
            }
            else {
                ret.then(curry(finishLoad, route));
            }
            return;
        }

        if (options.noCache) {
            delCache(route.path);
        }

        // 处理当前正在工作的action
        if (cur.action) {
            cur.action[cachedAction[cur.path] ? 'sleep' : 'leave']();
        }

        // 首先尝试从cache中取action
        var action = cachedAction[route.path];

        // 没有从cache中获取到action就创建
        if (!action) {
            mm.create(route.action).then(curry(enterAction, route));
        }
        else {
            enterAction(route, action);
        }
    }

    /**
     * 执行filter
     *
     * @inner
     * @param {Object} route 路由信息
     * @return {Promise}
     */
    function executeFilter(route) {
        var resolver = new Resolver();
        var index = 0;

        /**
         * 跳过后续的filter
         * 如果不带参数则跳过剩余所有的filter
         *
         * @inner
         * @param {number} num 跳过后续filter的数量
         */
        function jump(num) {
            index += num || filters.length;
            next();
        }

        /**
         * 执行下一个filter
         *
         * @inner
         */
        function next() {
            var item = filters[index++];

            if (!item) {
                resolver.resolve(route);
            }
            else if (!item.url
                || (item.url instanceof RegExp && item.url.test(route.path))
                || item.url === route.path
            ) {
                item.filter(route, next, jump);
            }
            else {
                next();
            }
        }

        next();

        return resolver.promise();
    }

    /**
     * 获取前后端同步的数据
     *
     * @inner
     * @param {string=} name 数据名称
     * @return {*}
     */
    function getSyncData(name) {
        var store = extend({}, window[globalConfig.syncDataKey]);
        return name ? store[name] : store;
    }

    /**
     * 首屏渲染
     *
     * @inner
     * @param {Object} route 路由信息
     * @param {Page} page 页面对象
     * @param {Object} action Action对象
     */
    function loadFirstScreen(route, page, action) {

        function fireEvent(eventName) {
            exports.emit(
                eventName,
                {
                    route: null,
                    action: null,
                    page: null
                },
                {
                    route: route,
                    action: action,
                    page: page
                }
            );
        }

        fireEvent('beforeload');

        action.set(route.path);
        // 视图与数据已经ready了
        // 跳过enter
        action.view.set(page.main);
        // 使用同步数据填充首屏model
        action.model.fill(getSyncData('model'));

        fireEvent('beforetransition');

        action.ready(true);
        action.complete();

        fireEvent('afterload');

        dumpInfo(action, route, page);

        finishLoad(route);
    }

    /**
     * 尝试加载Action
     *
     * @inner
     * @param {Object} route 路由信息
     */
    function tryLoadAction(route) {
        var rawRoute = route;
        var path = route.path;

        // 首屏渲染逻辑
        // 第一次加载action且能获取到起始页面
        var page;
        if (globalConfig.isomorphic && !cur.action
            && (page = viewport.front(path, {cached: route.cached}))
        ) {
            mm.create(route.action).then(curry(loadFirstScreen, route, page));
            return;
        }

        // 处理filter的执行结果
        function beforeLoad(route) {
            // 如果改变了path则以静默形式重新加载
            if (path !== route.path) {
                globalConfig.router.redirect(route.path, route.query, route.options);
                finishLoad(rawRoute);
            }
            else {
                loadAction(route);
            }
        }

        // 执行filter
        executeFilter(route).then(beforeLoad);
    }

    /**
     * 路由导向
     *
     * @inner
     * @param {option} config 路由配置
     * @return {Function}
     */
    function routeTo(config) {
        return function (path, query, params, url, options, done) {
            // 设置当前的路由信息
            var route = extend({}, config);
            route.path = path;
            // 考虑再三，还是将query与params合并吧
            // 同构、同构，前后端思路要统一嘛
            route.query = extend(params, query);
            route.options = options;
            route.url = url;
            route.done = done;

            // 尝试加载Action
            tryLoadAction(route);
        };
    }

    /**
     * 扩展全局配置项
     *
     * @inner
     * @param {Object} options 配置项
     * @return {Object}
     */
    function extendGlobalConfig(options) {
        var config = extend(globalConfig, options);

        // 扩展templateData
        config.templateData = extend({}, getSyncData('templateData'), config.templateData);

        if (!Array.isArray(config.template)) {
            config.template = [config.template];
        }

        // 如果没有指定路由器则使用默认的hash路由
        if (!config.router) {
            config.router = require('saber-router');
            config.router.controller(require('saber-router/controller/hash'));
        }

        return config;
    }

    /**
     * 获取saber-mm的配置信息
     *
     * @inner
     * @param {Object} options 配置项
     * @return {Object}
     */
    function getConfig4mm(options) {
        var res = {};
        var names = [
            'template', 'templateConfig', 'templateData',
            'router', 'Presenter', 'View', 'Model'
        ];

        names.forEach(function (name) {
            if (name in options) {
                res[name] = options[name];
            }
        });

        return res;
    }

    var routes = [];

    /**
     * 加载路由配置信息
     *
     * @public
     * @param {Object} paths 路由配置
     */
    exports.load = function (paths) {
        if (!Array.isArray(paths)) {
            paths = [paths];
        }

        // 如果还没有制定router
        // 则先缓存路由信息
        // 否则直接添加路由
        if (!globalConfig.router) {
            routes = routes.concat(paths);
        }
        else {
            paths.forEach(function (item) {
                globalConfig.router.add(item.path, routeTo(item));
            });
        }
    };

    /**
     * 启动框架
     *
     * @public
     * @param {HTMLElement} main 主元素
     * @param {Object} options 全局配置信息 完整配置参考`./config.js`
     */
    exports.start = function (main, options) {
        // 扩展全局配置信息
        var config = extendGlobalConfig(options);

        var router = config.router;

        mm.config(getConfig4mm(config));

        // 初始化viewport
        viewport.init(main, config.viewport);

        // 启用无延迟点击
        FastClick.attach(document.body);

        // 添加路由
        routes.forEach(function (item) {
            router.add(item.path, routeTo(item));
        });

        router.config({
            path: config.path,
            index: config.index,
            root: config.root
        });

        // 启动路由
        router.start();
    };

    /**
     * 添加filter
     *
     * @public
     * @param {string|RegExp=} url url
     * @param {Function} filter 过滤器
     */
    exports.addFilter = function (url, filter) {
        if (arguments.length === 1) {
            filter = url;
            url = null;
        }

        filters.push({
            url: url,
            filter: filter
        });
    };

    /**
     * 删除filter
     *
     * @public
     * @param {string|RegExp=} url url
     */
    exports.removeFilter = function (url) {
        if (!url) {
            filters = [];
        }
        else {
            var index;
            var res = filters.some(function (item, i) {
                index = i;
                return item.url.toString() === url.toString();
            });
            if (res) {
                filters.splice(index, 1);
            }
        }
    };

    /**
     * 删除缓存的action
     *
     * @public
     * @param {string} path 路径
     */
    exports.delCachedAction = function (path) {
        if (path) {
            delCache(path);
        }
        else {
            clearCache();
        }
    };

    /**
     * 停止App
     * For Test
     *
     * @public
     */
    exports.stop = function () {
        var router = globalConfig.router;

        router.stop();
        router.clear();
        routes = [];

        filters = [];
        cur = {};

        exports.delCachedAction();
    };

    /**
     * 获取同步的数据
     *
     * @public
     * @param {name=} 数据名称
     * @return {*}
     */
    exports.getSyncData = getSyncData;

    return exports;

});
