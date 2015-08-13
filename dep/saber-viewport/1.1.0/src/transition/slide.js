/**
 * @file 滑动转场
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var Resolver = require('saber-promise');
    var dom = require('saber-dom');
    var curry = require('saber-lang/curry');
    var extend = require('saber-lang/extend');
    var runner = require('saber-run');
    var util = require('../util');
    var config = require('../config');

    var DIRECTION = {
            LEFT: 'left',
            RIGHT: 'right'
        };

    /**
     * 附加处理器
     *
     * @type {Object}
     */
    var processor = {};

    /**
     * 内建的处理器
     *
     * @type {Object}
     */
    var buildinProcessor = {};

    /**
     * fixed定位处理器
     */
    buildinProcessor.fixed = {
        /**
         * transition前处理
         */
        before: function (front, back) {
            var eles = front.getFixed();
            var frontFixedNum = eles.length;
            eles = eles.concat(back.getFixed());

            // 添加不配对的fixed bar
            var frontBar = front.getBar();
            var backBar = back.getBar();
            var commonKeys = getCommonKey(frontBar, backBar);
            var bar = extend(frontBar, backBar);
            Object.keys(bar).forEach(function (key) {
                if (commonKeys.indexOf(key) < 0
                    && dom.getStyle(bar[key], 'position') === 'fixed'
                ) {
                    eles.push(bar[key]);
                }
            });

            this.fixedEles = eles;
            var attrData = this.data = [];

            var attrs = ['top', 'left', 'right', 'bottom', 'width', 'height', 'position'];
            var data;
            var value;
            var pos;
            var parent = front.main;
            eles.forEach(function (ele, index) {
                if (index >= frontFixedNum) {
                    parent = back.main;
                }
                // 保存原始样式信息
                data = {};
                attrs.forEach(function (key) {
                    data[key] = ele.style[key] || null;
                });
                attrData.push(data);

                // 当前位置计算
                pos = dom.position(ele);
                // 计算margin-top, margin-left
                for (var i = 0, max = 2; i < max; i++) {
                    value = parseInt(dom.getStyle(ele, 'margin-' + attrs[i]), 10);
                    if (!isNaN(value)) {
                        pos[attrs[i]] -= value;
                    }

                    // 修正offsetParent的margin影响
                    value = parseInt(dom.getStyle(parent, 'margin-' + attrs[i]), 10);
                    if (!isNaN(value)) {
                        pos[attrs[i]] -= value;
                    }
                }

                // 改变position
                util.setStyles(ele, {
                    position: 'absolute',
                    top: pos.top + 'px',
                    left: pos.left + 'px',
                    width: dom.getStyle(ele, 'width') + 'px',
                    height: dom.getStyle(ele, 'height') + 'px',
                    bottom: 'auto',
                    right: 'atuo'
                });
            });
        },

        /**
         * transition完成处理
         */
        after: function () {
            var data;
            var attrData = this.data;
            this.fixedEles.forEach(function (ele, index) {
                data = attrData[index];
                Object.keys(data).forEach(function (key) {
                    ele.style[key] = data[key];
                });
            });
        }
    };

    /**
     * 按任务运行所有处理器
     *
     * @inner
     * @param {string} name 任务名称
     * @param {Page} front 前景页
     * @param {Page} back 后景页
     * @param {Object} options
     */
    function runProcessor(name, front, back, options) {
        var item;
        Object.keys(processor).forEach(function (key) {
            item = processor[key];
            if (item[name]) {
                item[name](front, back, options);
            }
        });
    }

    /**
     * 转场前准备
     * 添加包含元素，添加浮动等
     *
     * @inner
     */
    function prepare(frontPage, backPage, options) {
        var viewport = config.viewport;
        var frontEle = frontPage.main;
        var backEle = backPage.main;

        // 添加父容器，使前后页面能水平排布
        var container = document.createElement('div');
        var width = frontEle.offsetWidth;

        var styles = {
                width: width * 2 + 'px'
            };

        util.setStyles(container, styles);

        container.appendChild(frontEle);
        if (options.direction === DIRECTION.LEFT) {
            container.insertBefore(backEle, frontEle);
        }
        else {
            container.appendChild(backEle);
        }

        // 设置浮动
        // 添加position:relative 使视图容器成为可定位元素
        // 使内部的absolute元素能参与转场效果
        // 如果内部元素起初不相当于参考视图容器定位则需要在转场前后(利用事件)进行位置调整
        util.setStyles(frontEle, {
            'float': 'left',
            width: width + 'px',
            position: 'relative'
        });
        util.setStyles(backEle, {
            'float': 'left',
            width: width + 'px',
            position: 'relative'
        });

        // 设置container的负magrinLeft
        // 用于左滑入
        // 强制应用 不然后续再设置动画没有效果
        // 强制刷新得先将节点加入DOM树中
        viewport.appendChild(container);

        // 在设置'translate3d'之前调用before处理器
        // translate3d + fixed 悲剧妥妥的...
        runProcessor('before', frontPage, backPage, options);

        // 设置初始容器位置
        if (options.direction === DIRECTION.LEFT) {
            styles = options.transform
                ? {transform: 'translate3d(-' + frontPage.main.offsetWidth + 'px, 0, 0)'}
                : {marginLeft: -frontPage.main.offsetWidth + 'px'};
        }
        else if (options.transform) {
            // 设置默认的起始状态
            // 防止转场过程中产生莫名其妙的渲染问题
            styles.transform = 'translate3d(0, 0, 0)';
        }
        util.setStyles(
            container,
            styles,
            true
        );

        return container;
    }

    /**
     * 获取两个对象相同的属性
     *
     * @inner
     * @param {Object} obj1
     * @param {Object} obj2
     * @return {Array.<string>}
     */
    function getCommonKey(obj1, obj2) {
        var res = [];
        Object.keys(obj1).forEach(function (key) {
            if (key in obj2) {
                res.push(key);
            }
        });

        return res;
    }

    /**
     * 准备bar元素
     * 相同类型的bar 如果name相同不需要换场效果
     * 如果name不同需要滑入渐变转场效果
     *
     * @inner
     */
    function prepareBars(frontPage, backPage, options) {
        var frontBars = frontPage.getBar();
        var backBars = backPage.getBar();

        // 获取相同的类型的bar
        var keys = getCommonKey(
                frontBars || {},
                backBars || {}
            );

        var res = [];
        keys.forEach(function (key) {
            var item = {
                    front: frontBars[key],
                    back: backBars[key]
                };

            // name相同表示bar不需要转场效果
            // name不同表示bar要进行滑入渐变转场
            item.change = item.front.getAttribute('data-name')
                            !== item.back.getAttribute('data-name');

            var front = item.front;
            var pos = util.getPosition(front);
            var position = dom.getStyle(front, 'position');

            // 创建一个替代元素进行占位
            var ele;
            if (position !== 'fixed' && position !== 'position') {
                // static 与 relative 的bar 需要具有样式的占位元素
                ele = document.createElement(front.tagName);
                ele.className = front.className;
                ele.style.cssText += ';'
                                    + front.style.cssText
                                    + ';padding:0;border:0'
                                    + ';width:' + front.offsetWidth + 'px'
                                    + ';height:' + front.offsetHeight + 'px';
            }
            else {
                // absolute 与 fixed 的bar 不需要占位
                // 只需要一个回归的基准节点
                ele = document.createElement('ins');
                ele.style.display = 'none';
            }
            item.frontBlock = ele;
            front.parentNode.insertBefore(ele, front);

            // fixed定位的bar需要移动到body下
            // transform时fixed定位是相对与transform的父容器
            // 而非body
            if (options.transform
                && dom.getStyle(item.back, 'position') === 'fixed'
            ) {
                var block = item.backBlock = document.createElement('ins');
                block.style.display = 'none';
                item.back.parentNode.insertBefore(block, item.back);
                document.body.appendChild(item.back);
            }

            // 将前页中的bar放置到body中并进行绝对定位
            // 遮挡住后页相同位置的待转入bar
            ele = front;
            item.frontCSSBack = ele.style.cssText;
            if (position !== 'fixed') {
                var size = util.getSize(ele);
                ele.style.width = size.width + 'px';
                ele.style.height = size.height + 'px';
                ele.style.position = 'absolute';
                ele.style.top = pos.top + 'px';
                ele.style.left = pos.left + 'px';
            }

            document.body.appendChild(ele);
            // 强制刷新
            !!ele.offsetWidth;

            res.push(item);
        });

        return res;
    }

    /**
     * 转场结束
     * 恢复设置的样式属性
     *
     * @inner
     */
    function finish(frontPage, backPage, bars, resolver) {
        var viewport = config.viewport;
        var backEle = backPage.main;
        var container = backEle.parentNode;

        bars.forEach(function (item) {
            // 恢复前页的bar
            // 删除占位用的bar
            var frontBar = item.front;
            var frontBarBlock = item.frontBlock;
            var parentNode = frontBarBlock.parentNode;
            frontBar.style.cssText += ';'
                                    + item.frontCSSBack
                                    + ';opacity:1';
            parentNode.insertBefore(frontBar, frontBarBlock);
            parentNode.removeChild(frontBarBlock);
        });

        // 还原设置的样式
        util.setStyles(backEle, {
            'float': 'none',
            width: 'auto',
            position: 'static'
        });

        // 调整DOM结构
        viewport.appendChild(backEle);
        // frontpage已经从DOM树中移除 transitionend事件无法执行
        // 需要手动清楚动画效果
        util.setStyles(frontPage.main, {'transition': ''});
        // 删除container
        viewport.removeChild(container);

        // 后页的bar复位需要在container移除后
        // 不然transform会影响fixed的定位（表现在宽度上被拉伸）
        bars.forEach(function (item) {
            if (item.backBlock) {
                var ele = item.backBlock;
                ele.parentNode.insertBefore(item.back, ele);
                ele.parentNode.removeChild(ele);
            }
        });

        runProcessor('after', frontPage, backPage);

        resolver.fulfill();
    }

    /**
     * 滑动转场
     *
     * @public
     * @param {Resolver} resolver Resolver对象
     * @param {Object} options 转场参数
     * @param {Page} options.frontPage 转场前页（转出页）
     * @param {Page} options.backPage 转场后页（转入页）
     * @param {number} options.duration 动画时间 秒为单位
     * @param {string} options.timing 过渡速度曲线
     * @param {string} options.direction 转场方向 默认是右转入
     * @param {boolean} options.transform 是否启用transform
     */
    function slide(resolver, options) {
        var duration = options.duration || config.duration;
        var timing = options.timing || config.timing;
        var frontPage = options.frontPage;
        var backPage = options.backPage;

        options.transform = options.transform !== undefined
                                ? options.transform
                                : config.transform;

        // 转场方向设置
        options.direction = options.direction
            || (backPage.hasVisited ? DIRECTION.LEFT : DIRECTION.RIGHT);

        // 设置处理器
        processor = extend(options.processor || {}, buildinProcessor);

        // TODO
        // PROFORMANCE
        var container = prepare(frontPage, backPage, options);

        var bars = prepareBars(frontPage, backPage, options);

        var transitions = [];
        // bar处理
        bars.forEach(function (item) {
            // 设置前页bar的转化效果
            transitions.push(
                runner.transition(
                    item.front,
                    {opacity: 0},
                    {
                        // 如果不需要转场效果则设置成突变转化
                        // android 2.3 不支持 steps
                        // 改用delay模拟
                        duration: item.change ? duration : 0.1,
                        timing: timing,
                        delay: item.change ? 0 : duration
                    }
                )
            );
        });

        var value = options.direction === DIRECTION.LEFT
                        ? 0
                        : -frontPage.main.offsetWidth;
        var styles = options.transform
                        ? {transform: 'translate3d(' + value + 'px, 0, 0)'}
                        : {marginLeft: value + 'px'};

        var promise = runner.transition(
                container,
                styles,
                {
                    duration: duration,
                    timing: timing
                }
            );

        transitions.push(promise);

        // 动画完成后执行finish收尾工作
        Resolver.all(transitions).then(curry(finish, frontPage, backPage, bars, resolver));
    }

    require('../transition').register('slide', slide);

    // direction const
    slide.RIGHT = DIRECTION.RIGHT;
    slide.LEFT = DIRECTION.LEFT;

    return slide;

});
