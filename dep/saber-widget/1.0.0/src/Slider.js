/**
 * Saber Widget
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file 轮播图控件
 * @author zfkun(zfkun@msn.com)
 */

define(function (require, exports, module) {

    var lang = require('saber-lang');
    var dom = require('saber-dom');
    var Hammer = require('hammer');
    var Widget = require('./Widget');


    /**
     * 轮播图控件
     *
     * @class
     * @constructor
     * @exports Slider
     * @extends Widget
     * @requires saber-lang
     * @requires saber-dom
     * @requires hammer
     * @fires Slider#resize
     * @fires Slider#change
     * @param {Object=} options 初始化配置参数
     * @param {string=} options.id 控件标识
     * @param {HTMLElement=} options.main 控件主元素
     * @param {number=} options.length 图片总数
     * @param {number=} options.index 初始位置
     * @param {boolean=} options.animate 是否启用切换动画
     * @param {boolean=} options.auto 是否自动循环切换
     * @param {boolean=} options.interval 自动循环切换间隔，单位毫秒
     * @param {boolean=} options.flex 是否自适应屏幕旋转
     * @param {boolean=} options.speed 回弹动画时长，单位毫秒
     * @param {boolean=} options.switchAt 切换阀值，单位像素
     */
    function Slider(options) {


        this.attrs = {

            /**
             * 是否启用切换动画
             *
             * @type {boolean}
             */
            animate: {value: true},

            /**
             * 是否自动循环切换
             *
             * @type {boolean}
             */
            auto: {value: true, repaint: true},

            /**
             * 自动循环切换间隔，单位毫秒
             *
             * @type {number}
             */
            interval: {value: 4000},

            /**
             * 是否自适应屏幕旋转
             * 此配置在插件`SliderFlex`引入后才起作用
             *
             * @type {boolean}
             */
            flex: {value: false, repaint: true},

            /**
             * 初始位置
             *
             * @type {number}
             */
            index: {value: 0},

            /**
             * 回弹动画时长，单位毫秒
             *
             * @type {number}
             */
            speed: {value: 300},

            /**
             * 切换阀值，有效值为`0 ~ 1`的比例系数
             * 当`移动距离`超过此阀值时才进行`切换`，否则进行`回弹`
             *
             * @type {number}
             */
            switchAt: {value: 0.5},

            /**
             * 轮播项总数
             *
             * @type {Object}
             */
            length: {

                readOnly: true,

                getter: function () {
                    return this.runtime.length || 0;
                }

            }

        };

        /**
         * 控件状态集
         *
         * @private
         * @type {Object}
         */
        this.states = {

            // 默认停止自动切换状态
            stop: true

        };

        // **MUST**最后调用父类的构造函数
        // 由于子类的`attrs`、`states`等需要与父类的对应默认值进行`mixin`
        Widget.apply(this, arguments);
    }


    Slider.prototype = {

        /**
         * 控件类型标识
         *
         * @readonly
         * @type {string}
         */
        type: 'Slider',

        /**
         * 初始化DOM
         *
         * @override
         */
        initDom: function () {
            var main = this.get('main');
            var wrapper = dom.query('[data-role=wrapper]', main) || dom.children(main)[ 0 ];

            // 确保 `data-role` 设置正确
            if (wrapper) {
                dom.setData(wrapper, 'role', 'wrapper');
                dom.children(wrapper).forEach(
                    function (item) {
                        dom.setData(item, 'role', 'item');
                    }
                );
            }

            this.runtime.wrapper = wrapper;
        },

        /**
         * 初始化事件
         *
         * @override
         */
        initEvent: function () {
            var events = 'release touch dragleft dragright swipeleft swiperight';
            var runtime = this.runtime;

            runtime.hammer = new Hammer(runtime.wrapper, {dragLockToAxis: true})
                .on(
                events,
                runtime.handler = lang.bind(this._handleHammer, this)
            );

            this.on('beforedispose', function () {
                runtime.hammer.off(events, runtime.handler);
            });
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
                this._resize(true).enable();
                return;
            }

            // 启动切换属性变更
            if (changes.hasOwnProperty('auto')) {
                // 因属性`auto`值已发生变化, 这里调用需要带上`true`参数强制执行
                this[ changes.auto[ 1 ] ? 'start' : 'stop' ](true);
            }

            // `SliderFlex` 插件更新
            if (changes.hasOwnProperty('flex')) {
                this[ changes.flex[ 1 ] ? 'enablePlugin' : 'disablePlugin' ]('SliderFlex', 'flex');
            }

        },

        /**
         * 激活控件
         *
         * @override
         * @fires Slider#enable
         * @return {Slider} 当前实例
         */
        enable: function () {
            // 先启动自动切换
            if (this.is('disable') && this.is('render')) {
                this.start();

                // 禁用hammer
                var hammer = this.runtime.hammer;
                if (hammer) {
                    hammer.enable(true);
                }

                // 屏幕旋转自适应插件
                if (this.get('flex')) {
                    this.enablePlugin('SliderFlex', 'flex');
                }
            }

            // 回归父类继续后续处理
            Widget.prototype.enable.call(this);

            return this;
        },

        /**
         * 禁用控件
         *
         * @override
         * @fires Slider#disable
         * @return {Slider} 当前实例
         */
        disable: function () {
            // 先停止自动切换
            if (!this.is('disable') && this.is('render')) {
                this.stop();

                // 禁用hammer
                var hammer = this.runtime.hammer;
                if (hammer) {
                    hammer.enable(false);
                }

                // 屏幕旋转自适应插件
                if (this.get('flex')) {
                    this.disablePlugin('SliderFlex');
                }
            }

            // 回归父类继续后续处理
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
            var type = ev.type;

            // 禁用滚动(因`Slider`仅横向移动,这里需排除垂直方向从而提高体验)
            if ('touch' !== type) {
                gesture.preventDefault();
            }


            var runtime = this.runtime;
            var width = runtime.width;
            var index = this.get('index');
            var length = this.get('length');

            switch (type) {
                case 'touch':
                    // 每次点击开始时，需先`临时`保存当前轮播状态并暂停, 以备结束后的恢复
                    runtime.needResume = !this.is('pause') && !this.is('stop');
                    if (runtime.needResume) {
                        this.pause();
                    }

                    break;

                case 'dragright':
                case 'dragleft':
                    // stick to the finger
                    var paneOffset = this._percent(index);
                    var dragOffset = ((100 / width) * gesture.deltaX) / length;

                    // slow down at the first and last pane
                    if ((index === 0 && gesture.direction === 'right') ||
                        (index === length - 1 && gesture.direction === 'left')) {
                        dragOffset *= 0.4;
                    }

                    // switch without animate
                    this._move(dragOffset + paneOffset);
                    break;

                case 'swipeleft':
                    gesture.stopDetect();

                    this.next();

                    if (runtime.needResume) {
                        this.resume();
                    }

                    break;

                case 'swiperight':
                    gesture.stopDetect();

                    this.prev();

                    if (runtime.needResume) {
                        this.resume();
                    }

                    break;

                case 'release':
                    // 达到切换阀值，则根据滑动方向切换
                    if (Math.abs(gesture.deltaX) > width * this.get('switchAt')) {
                        this[ gesture.direction === 'right' ? 'prev' : 'next' ]();
                    }
                    // 未达到, 则回弹
                    else {
                        this.to(index);
                    }

                    if (runtime.needResume) {
                        this.resume();
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
         * @fires Slider#resize
         * @return {Slider} 当前实例
         */
        _resize: function (isForce) {
            var runtime = this.runtime;

            var oldWidth = runtime.width;
            var width = styleNumber(this.get('main'));

            if (!isForce && width === oldWidth) {
                return this;
            }

            // 先更新
            runtime.width = width;


            // 重绘计算
            var items = dom.children(runtime.wrapper);
            var length = runtime.length = items.length;

            for (var i = 0; i < length; i++) {
                styleNumber(items[ i ], 'width', width);
            }

            styleNumber(runtime.wrapper, 'width', width * length);


            /**
             * @event Slider#resize
             * @param {number} from 上一次的切换项宽度,单位像素
             * @param {number} to 当前的切换项宽度,单位像素
             */
            this.emit('resize', oldWidth, width);

            return this;
        },

        /**
         * 轮播切换处理
         *
         * @private
         * @param {boolean=} isStop 是否停止
         */
        _loop: function (isStop) {
            var runtime = this.runtime;
            var delay = this.get('interval');

            runtime.timer = clearTimeout(runtime.timer);

            // 已停止 或 间隔时长异常 则终止切换
            if (isStop || !delay || delay < 0) {
                return;
            }

            // 切换项不足时, 恢复到第一项目并暂停切换
            if (this.get('length') < 2) {
                this.to(0).pause();
                return;
            }

            // 切换
            runtime.timer = setTimeout(
                lang.bind(
                    function () {
                        var next = this.get('index') + 1;
                        this.to(next < this.get('length') ? next : 0);
                        this._loop();
                    },

                    this
                ),

                delay
            );
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


        /**
         * 数据同步
         * 此方法供用户在对`切换项`做了`添加`或`删除`后同步修改使用
         *
         * @public
         * @return {Slider} 当前实例
         */
        sync: function () {
            // 未渲染控件无需同步
            if (this.is('render')) {

                // 1. 暂停轮播(如果正在轮播的话)
                this.pause()

                    // 2. 重绘计算
                    ._resize(true)

                    // 3. 修正当前项的偏移比例
                    ._move(this._percent(this.get('index')))

                    // 4. 恢复轮播(如果刚才正在轮播的话)
                    .resume();
            }

            return this;
        },


        /**
         * 启动自动切换
         *
         * @public
         * @param {boolean} isForce 是否强制启动
         * @return {Slider} 当前实例
         */
        start: function (isForce) {
            if (this.is('stop') && (isForce || this.get('auto'))) {
                this.removeState('stop');
                this._loop();
            }

            return this;
        },

        /**
         * 停止自动切换
         *
         * @public
         * @param {boolean} isForce 是否强制停止
         * @return {Slider} 当前实例
         */
        stop: function (isForce) {
            if (!this.is('stop') && (isForce || this.get('auto'))) {
                this.addState('stop');
                this._loop(true);
            }

            return this;
        },

        /**
         * 暂停自动切换
         *
         * @public
         * @return {Slider} 当前实例
         */
        pause: function () {
            if (!this.is('pause') && !this.is('stop')) {
                this.addState('pause');
                this._loop(true);
            }

            return this;
        },

        /**
         * 恢复自动切换
         * 仅对**暂停**状态有效，若处于**停止**状态，则无效
         *
         * @public
         * @return {Slider} 当前实例
         */
        resume: function (holdOriginState) {
            if (this.is('pause')) {
                this.removeState('pause');
                this._loop();
            }

            return this;
        },


        /**
         * 切换到指定项
         *
         * @public
         * @param {number} index 目标项的位置
         * @fires Slider#change
         * @return {Slider} 当前实例
         */
        to: function (index) {
            if (this.is('disable')) {
                return this;
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
                 * @event Slider#change
                 * @param {number} from 原来显示项的位置
                 * @param {number} to 当前显示项的位置
                 */
                this.emit('change', current, index);
            }

            return this;
        },

        /**
         * 切换到上一项
         *
         * @public
         * @return {Slider} 当前实例
         */
        prev: function () {
            return this.to(this.get('index') - 1);
        },

        /**
         * 切换到下一项
         *
         * @public
         * @return {Slider} 当前实例
         */
        next: function () {
            return this.to(this.get('index') + 1);
        }

    };

    lang.inherits(Slider, Widget);

    require('./main').register(Slider);


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


    return Slider;

});
