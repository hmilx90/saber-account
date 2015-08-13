/**
 * Saber Widget
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file 图片预览控件
 * @author zfkun(zfkun@msn.com)
 */

define(function (require) {

    var lang = require('saber-lang');
    var dom = require('saber-dom');
    var Hammer = require('hammer');
    var Widget = require('./Widget');


    /**
     * 图片预览
     *
     * @class
     * @constructor
     * @exports ImageView
     * @extends Widget
     * @requires saber-lang
     * @requires saber-dom
     * @requires hammer
     * @fires ImageView#resize
     * @fires ImageView#change
     * @fires ImageView#zoom
     * @fires ImageView#reset
     * @fires ImageView#beforeload
     * @fires ImageView#afterload
     * @param {Object=} options 初始化配置参数
     * @param {string=} options.id 控件标识
     * @param {HTMLElement=} options.main 控件主元素
     * @param {number=} options.zoomScale 图片附加缩放比例
     * @param {number=} options.length 图片总数
     * @param {number=} options.index 初始位置
     * @param {boolean=} options.animate 是否启用切换动画
     * @param {boolean=} options.flex 是否自适应屏幕旋转
     * @param {boolean=} options.full 是否全屏模式
     * @param {boolean=} options.toolbar 是否显示工具条
     * @param {boolean=} options.speed 回弹动画时长，单位毫秒
     * @param {boolean=} options.switchAt 切换阀值，单位像素
     */
    function ImageView(options) {

        this.attrs = {

            /**
             * 是否启用切换动画
             *
             * @type {boolean}
             */
            animate: {value: true},

            /**
             * 回弹动画时长，单位毫秒
             *
             * @type {number}
             */
            speed: {value: 200},

            /**
             * 图片附加缩放比例
             *
             * @type {Object}
             */
            zoomScale: {value: 0.88},

            /**
             * 切换阀值，有效值为`0 ~ 1`的比例系数
             * 当`移动距离`超过此阀值时才进行`切换`，否则进行`回弹`
             *
             * @type {number}
             */
            switchAt: {value: 0.5},

            /**
             * 图片列表
             *
             * @type {Array<string>}
             */
            datasource: {value: [], repaint: true},

            /**
             * 初始位置
             *
             * @type {number}
             */
            index: {value: 0},

            /**
             * 是否显示工具栏
             *
             * @type {boolean}
             */
            toolbar: {value: true, repaint: true},

            /**
             * 是否自适应屏幕旋转
             * 此配置在插件`ImageViewFlex`引入后才起作用
             *
             * @type {boolean}
             */
            flex: {value: false, repaint: true},

            /**
             * 是否全屏模式
             *
             * @type {boolean}
             */
            full: {

                value: false,

                setter: function (isFull) {
                    this.toggleState('full', isFull);
                    dom.toggleClass(this.main, 'full', isFull);
                }

            },

            /**
             * 图片总数
             *
             * @type {Object}
             */
            length: {

                readOnly: true,

                getter: function () {
                    return this.get('datasource').length;
                }

            }

        };


        // **MUST**最后调用父类的构造函数
        // 由于子类的`attrs`、`states`等需要与父类的对应默认值进行`mixin`
        Widget.apply(this, arguments);
    }


    ImageView.prototype = {

        /**
         * 控件类型标识
         *
         * @readonly
         * @type {string}
         */
        type: 'ImageView',

        /**
         * 初始化DOM
         *
         * @override
         */
        initDom: function () {
            var runtime = this.runtime;

            // 可视窗口尺寸
            runtime.viewport = {width: window.innerWidth, height: window.innerHeight};

            // 指定了主元素, 则认为是 `setup` 模式, 忽略 `datasource` 属性并扫描主元素内图片源生成 `datasource` 属性
            if (this.main) {
                // 因 `setup` 模式下，`this.main` 稍后会被覆盖掉
                // 这里存到运行时, 方便在 `initEvent` 时初始化点击事件
                runtime.setup = this.main;

                // 扫描 `main` 元素内需加入的图片
                this.set(
                    'datasource',
                    dom.queryAll('[data-role=image]', this.main).map(
                        function (image, index) {
                            // 顺便加个标志属性, 为点击交互使用
                            dom.setData(image, 'imageview', index);

                            return dom.getData(image, 'src') || image.getAttribute('src');
                        }
                    )
                );
            }

            // 主元素
            var main = this.main = document.createElement('div');
            main.className = 'ui-imageview';
            dom.hide(main);

            // 检测下是否需要立即全屏 (可能初始化配置设置了`full`: true)
            // XXX: 虽然 `full` 的 `setter` 内有此逻辑，但是考虑 `init` 阶段 DOM构建还未完成，这里需要单独处理
            if (this.is('full')) {
                dom.addClass(main, 'full');
            }

            // 工具栏
            var toolbar = runtime.toolbar = document.createElement('div');
            dom.setData(toolbar, 'role', 'toolbar');
            toolbar.innerHTML = this.makeToolbar();
            main.appendChild(toolbar);

            // 容器
            var wrapper = runtime.wrapper = document.createElement('div');
            dom.setData(wrapper, 'role', 'wrapper');
            main.appendChild(wrapper);

            // 初始化图片列表
            this.get('datasource').forEach(this._append, this);

            // 挂载到DOM流
            document.body.appendChild(main);
        },

        /**
         * 初始化事件
         *
         * @override
         */
        initEvent: function () {
            var runtime = this.runtime;

            runtime.scale = 1;

            // hammer
            var events = 'release pinchin pinchout drag swipeleft swiperight tap doubletap';
            runtime.hammer = new Hammer(runtime.wrapper, {dragLockToAxis: true})
                .on(
                events,
                runtime.handler = lang.bind(this._handleHammer, this)
            );
            this.on('beforedispose', function () {
                runtime.hammer.off(events, runtime.handler);
            });


            // `setup` 模式构建， 则需增加点击交互
            if (runtime.setup) {
                this.addEvent(runtime.setup, 'click', function (ev) {
                    if (dom.matches(ev.target, '[data-imageview]')) {
                        var index = dom.getData(ev.target, 'imageview');
                        if (index) {
                            this.enable().to(index | 0);
                        }
                    }
                });
            }

            // 工具栏
            if (this.get('toolbar')) {
                // 点击交互
                this.addEvent(runtime.toolbar, 'touchstart', function (ev) {
                    ev.preventDefault();

                    if (dom.matches(ev.target, '[data-role=close]')) {
                        this.disable();
                    }
                });

                // 内容同步
                this.on('change', function (ev, from, to) {
                    this.runtime.toolbar.innerHTML = this.makeToolbar();
                });
            }

        },

        /**
         * 重新渲染视图
         * 首次渲染时, 不传入 changes 参数
         *
         * @override
         * @param {Object=} changes 变更过的属性的集合
         * 每个**属性变更对象**结构如下
         * `属性名`：[ `变更前的值`, `变更后的值` ]
         */
        repaint: function (changes) {
            // 先处理父类的重绘
            Widget.prototype.repaint.call(this, changes);

            // `render` 阶段调用时,不传入 `changes`
            if (!changes) {
                this._resize(true).to(this.get('index'), true);
                return;
            }

            // 数据源变更
            if (changes.hasOwnProperty('datasource')) {
                var isEnabled = !this.is('disable');

                if (isEnabled) {
                    this.disable();
                }

                this.runtime.wrapper.innerHTML = '';

                changes.datasource[ 1 ].forEach(this._append, this);

                if (isEnabled) {
                    this.enable().to(0);
                }
            }

            // `ImageViewFlex` 插件更新
            if (changes.hasOwnProperty('flex')) {
                this[ changes.flex[ 1 ] ? 'enablePlugin' : 'disablePlugin' ]('ImageViewFlex', 'flex');
            }
        },

        /**
         * 激活控件
         *
         * @override
         * @fires ImageView#enable
         * @return {ImageView} 当前实例
         */
        enable: function () {
            if (this.is('render')) {
                // 启用插件 遮罩 & 缩放
                this.enablePlugin('Masker').enablePlugin('Zoom');

                // 屏幕旋转自适应插件
                if (this.get('flex')) {
                    this.enablePlugin('ImageViewFlex', 'flex');
                }

                // 显示主元素
                dom.show(this.main);
            }

            Widget.prototype.enable.call(this);

            return this;
        },

        /**
         * 禁用控件
         *
         * @override
         * @fires ImageView#disable
         * @return {ImageView} 当前实例
         */
        disable: function () {
            if (this.is('render')) {
                // 启用插件 遮罩 & 缩放
                this.disablePlugin('Masker').disablePlugin('Zoom');

                // 屏幕旋转自适应插件
                if (this.get('flex')) {
                    this.disablePlugin('ImageViewFlex');
                }

                // 隐藏主元素
                dom.hide(this.main);
            }

            Widget.prototype.disable.call(this);

            return this;
        },


        /**
         * hammer事件处理函数
         *
         * @private
         * @param {Object} ev `hammer`的`event`对象
         */
        _handleHammer: function (ev) {
            var gesture = ev.gesture;

            // disable browser scrolling
            gesture.preventDefault();


            var isZoom = this.is('zoom');
            var runtime = this.runtime;
            var viewportWidth = runtime.viewport.width;
            var index = this.get('index');

            switch (ev.type) {
                case 'drag':
                    var direction = gesture.direction;

                    if (isZoom) {
                        this._drag(gesture.deltaX, gesture.deltaY);
                    }
                    else if ('left' === direction || 'right' === direction) {
                        var length = this.get('length');

                        // stick to the finger
                        var dragOffset = ((100 / viewportWidth) * gesture.deltaX) / length;

                        // slow down at the first and last pane
                        if ((index === 0 && direction === 'right') ||
                            (index === length - 1 && direction === 'left')) {
                            dragOffset *= 0.4;
                        }

                        // switch without animate
                        this._move(this._percent(index) + dragOffset);
                    }

                    break;

                case 'swipeleft':
                    gesture.stopDetect();

                    if (!isZoom) {
                        this.next();
                    }

                    break;

                case 'swiperight':
                    gesture.stopDetect();

                    if (!isZoom) {
                        this.prev();
                    }

                    break;

                case 'tap':
                    this.set('full', !this.is('full'));
                    break;

                case 'doubletap':
                    gesture.preventDefault();
                    this[ isZoom ? 'reset' : 'zoom' ]();
                    break;

                case 'pinchin':
                    this.zoom(runtime.scale - gesture.scale * 0.2);
                    // gesture.stopDetect();
                    gesture.stopPropagation();
                    break;

                case 'pinchout':
                    this.zoom(runtime.scale + gesture.scale * 0.2);
                    // gesture.stopDetect();
                    gesture.stopPropagation();
                    break;

                case 'release':
                    if (isZoom) {
                        // 只关注单点触摸
                        if (gesture.touches.length > 1) {
                            // 如果刚才是多点，这里需要停止继续检测
                            // 以免因还有触摸点未释放而触发 `drag`
                            gesture.stopDetect();
                        }
                        else {
                            // TODO 处理图片回弹
                            runtime.dragX += gesture.deltaX;
                            runtime.dragY += gesture.deltaY;
                        }
                    }
                    else {
                        // 达到切换阀值，则根据滑动方向切换
                        if (Math.abs(gesture.deltaX) > viewportWidth * this.get('switchAt')) {
                            this[ gesture.direction === 'right' ? 'prev' : 'next' ]();
                        }
                        // 未达到, 则回弹
                        else {
                            this.to(index);
                        }
                    }

                    break;
            }
        },

        /**
         * 计算指定位置的偏移百分比
         *
         * @private
         * @param {number} index 位置索引
         * @return {number} 偏移百分比
         */
        _percent: function (index) {
            var length = this.get('length');

            // 防越界修正
            index = Math.max(0, Math.min(length - 1, index));

            return -(100 / length) * index;
        },

        /**
         * 调整控件宽度
         *
         * @private
         * @param {boolean=} isForce 是否强制重绘计算
         * @fires ImageView#resize
         * @return {ImageView} 当前实例
         */
        _resize: function (isForce) {
            var runtime = this.runtime;
            var oldViewport = runtime.viewport;
            var viewport = {width: window.innerWidth, height: window.innerHeight};

            if (!isForce && viewport.width === oldViewport.width && viewport.height === oldViewport.height) {
                return this;
            }

            // 先更新
            runtime.viewport = viewport;


            // 重绘计算
            var zoomScale = this.get('zoomScale');
            dom.children(runtime.wrapper).forEach(
                function (node) {
                    styleNumber(node, 'width', viewport.width);

                    // 修正图片缩放
                    var img = dom.query('img', node);
                    if (img) {
                        imageResizeToCenter(img, viewport, zoomScale);
                    }
                }
            );

            styleNumber(runtime.wrapper, 'width', viewport.width * this.get('length'));


            /**
             * @event ImageView#resize
             * @param {Object} from 容器旧尺寸信息
             * @param {Object} to 容器新尺寸信息
             */
            this.emit('resize', oldViewport, viewport);

            return this;
        },

        /**
         * 添加图片
         *
         * @public
         * @param {string} image 图片绝对地址
         */
        _append: function (image) {
            var item = document.createElement('div');
            dom.setData(item, 'role', 'item');
            this.runtime.wrapper.appendChild(item);
        },

        /**
         * 加载指定位置的图片
         *
         * @private
         * @fires ImageView#beforeload
         * @fires ImageView#afterload
         * @param {number} index 图片所在位置索引
         */
        _load: function (index) {
            var node = dom.queryAll('[data-role=item]', this.runtime.wrapper)[ index ];

            if (!node || !dom.query('img', node)) {
                var self = this;

                /**
                 * @event ImageView#beforeload
                 * @param {number} index 图片位置索引
                 */
                self.emit('beforeload', index);

                var img = document.createElement('img');
                dom.hide(img);

                img.src = self.get('datasource')[ index ];

                img.onload = function () {
                    this.onload = null;
                    imageResizeToCenter(this, self.runtime.viewport, self.get('zoomScale'));
                    dom.show(this);

                    /**
                     * @event ImageView#afterload
                     * @param {number} index 图片位置索引
                     */
                    self.emit('afterload', index);
                };

                node.appendChild(img);
            }
        },

        /**
         * 切换移动
         *
         * @private
         * @param {number} percent X轴偏移百分比
         * @param {number=} speed 移动速度,单位毫秒
         */
        _move: function (percent, speed) {
            var wrapper = this.runtime.wrapper;

            if (this.get('animate')) {
                dom.setStyle(wrapper, 'transition', 'all ' + (speed || 0) + 'ms');
            }

            dom.setStyle(wrapper, 'transform', 'translate3d(' + percent + '%, 0, 0) scale3d(1, 1, 1)');

            return this;
        },

        _drag: function (x, y, speed) {
            var runtime = this.runtime;
            var scale = runtime.scale;
            var img = this._image(this.get('index'));

            speed = speed || 0;
            x = runtime.dragX + x;
            y = runtime.dragY + y;

            if (this.get('animate')) {
                dom.setStyle(img, 'transition', 'all ' + speed + 'ms');
            }

            dom.setStyle(
                img,
                'transform',
                    'translate3d(' + x + 'px, ' + y + 'px, 0) scale3d(' + scale + ', ' + scale + ', 1)'
            );
        },

        /**
         * 获取指定位置的图片元素
         *
         * @private
         * @param {number} index 图片所在位置索引
         * @return {?HTMLElement} 获取到的图片元素, 失败返回`null`
         */
        _image: function (index) {
            return dom.query(
                    '[data-role=item]:nth-child(' + (index + 1) + ') img',
                this.runtime.wrapper
            );
        },


        /**
         * 更新数据源为目标元素内的图片
         * 注, 有效的图片需附带 `data-role=image` 属性
         *
         * @param {HTMLElement} main 目标容器元素
         */
        setup: function (main) {
            if (main && main !== this.runtime.setup) {
                // 更新关联构建区域
                this.runtime.setup = main;

                // 扫描 `main` 元素内需加入的图片
                this.set(
                    'datasource',
                    dom.queryAll('[data-role=image]', main).map(
                        function (image, index) {
                            dom.setData(image, 'imageview', index);
                            return dom.getData(image, 'src') || image.getAttribute('src');
                        }
                    )
                );

                // DOM结构可能被覆盖了，这里强制重绘一次以防万一
                this._resize(true);
            }
        },

        /**
         * 工具栏内容生成器
         *
         * @public
         * @return {string} 标题内容
         */
        makeToolbar: function () {
            return [
                '<span data-role="close">关闭</span>',
                    '<h1>' + (this.get('index') + 1) + ' of ' + this.get('length') + '</h1>'
            ].join('');
        },

        /**
         * 切换到指定项
         *
         * @public
         * @param {number|HTMLImageElement} index 目标项的位置或目标图片元素
         * @param {boolean=} isForce 是否强制切换
         * @fires ImageView#change
         * @return {ImageView} 当前实例
         */
        to: function (index, isForce) {
            if (!isForce && this.is('disable')) {
                return this;
            }

            // XXX: 节省点, 这里不严格判断是否`图片元素`了
            if ('number' !== typeof index) {
                index = dom.getData(index, 'imageview');

                if (!index) {
                    return this;
                }

                index = index | 0;
            }

            // 若当前缩放状态，需先还原
            if (this.is('zoom')) {
                this.reset();
            }


            var current = this.get('index');

            // 边界修复
            index = Math.max(0, Math.min(index, this.get('length') - 1));

            // 切换
            this._move(this._percent(index), this.get('speed'));

            // 回弹不触发事件
            if (current !== index) {
                // 更新
                this.set('index', index);

                /**
                 * @event ImageView#change
                 * @param {number} from 原来显示项的位置
                 * @param {number} to 当前显示项的位置
                 */
                this.emit('change', current, index);
            }


            // 加载当前项的图片
            this._load(index);

            return this;
        },

        /**
         * 切换到上一项
         *
         * @public
         * @return {ImageView} 当前实例
         */
        prev: function () {
            return this.to(this.get('index') - 1);
        },

        /**
         * 切换到下一项
         *
         * @public
         * @return {ImageView} 当前实例
         */
        next: function () {
            return this.to(this.get('index') + 1);
        },

        /**
         * 缩放指定位置的图片
         *
         * @public
         * @fires ImageView#zoom
         */
        zoom: function (scale) {
            if (!scale && this.is('zoom')) {
                return this;
            }

            if (scale && (scale < 0.7 || scale > 3)) {
                return this;
            }

            this.addState('zoom');

            var runtime = this.runtime;
            runtime.scale = scale || 2;
            runtime.dragX = runtime.dragX || 0;
            runtime.dragY = runtime.dragY || 0;

            this._drag(0, 0, this.get('speed'));


            /**
             * @event ImageView#zoom
             * @param {number} scale 当前的缩放比例
             */
            this.emit('zoom', runtime.scale);
        },

        /**
         * 还原缩放
         *
         * @public
         * @fires ImageView#reset
         */
        reset: function () {
            if (!this.is('zoom')) {
                return this;
            }

            this.removeState('zoom');


            var runtime = this.runtime;
            runtime.scale = 1;
            runtime.dragX = 0;
            runtime.dragY = 0;

            this._drag(0, 0, this.get('speed'));


            /**
             * @event ImageView#reset
             */
            this.emit('reset');
        }

    };

    lang.inherits(ImageView, Widget);

    require('./main').register(ImageView);


    /**
     * 根据参考宽高等比缩放图片
     * 缩放后若高度不足,会自动垂直居中
     *
     * @inner
     * @param {HTMLElement} img 图片元素
     * @param {Object} size 参考尺寸, 包括 `width` 和 `height`
     * @param {number} scale 附加缩放比例
     */
    function imageResizeToCenter(img, size, scale) {
        var w = img.naturalWidth || img.width;
        var h = img.naturalHeight || img.height;
        var sw = size.width;
        var sh = size.height;

        // 先以宽为基准缩放
        if (w > sw) {
            h *= sw / w;
            w = sw;
        }

        // 再以高为基准缩放
        if (h > sh) {
            w *= sh / h;
            h = sh;
        }

        // 考虑美观，再稍微缩放一点，让图片四周多点间距
        w *= scale;
        h *= scale;


        styleNumber(img, 'width', w);
        styleNumber(img, 'height', h);


        // 高度不足, 需垂直居中（水平居中CSS已处理了）
        if (h < sh) {
            styleNumber(img, 'margin-top', Math.round(Math.max((sh - h) / 2, 0)));
        }
    }


    /**
     * 设置/获取 元素的数字值类型的样式
     * 为了方便处理数字值类型的样式
     *
     * @inner
     * @param {HTMLElement} node 元素
     * @param {string} name 样式名,如`width`,`height`,`margin-left`等数字类型的样式
     * @param {number=} val 样式值(不含单位),传入时则为设置样式
     * @return {number=} 没有传入`val`参数时返回获取到的值，否则返回`undefined`
     */
    function styleNumber(node, name, val) {
        name = name || 'width';

        if (arguments.length > 2) {
            return dom.setStyle(node, name, (parseInt(val, 10) || 0) + 'px');
        }

        return parseInt(dom.getStyle(node, name), 10) || 0;
    }


    return ImageView;

});
