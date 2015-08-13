/**
 * @file 单选组控件
 * @author Firede(firede@firede.us)
 */

define(function (require) {

    var lang = require('saber-lang');
    var dom = require('saber-dom');
    var format = require('saber-string/format');
    var Widget = require('./Widget');

    /**
     * 选项默认模板
     *
     * @const
     * @type {string}
     */
    var ITEM_TPL = '<div data-role="radio" data-value="${value}"${checked}>${name}</div>';

    /**
     * 代表选项的 Selector
     *
     * @const
     * @type {string}
     */
    var ITEM_ROLE_SELECTOR = getDataSelector('role', 'radio');

    /**
     * 单选组控件
     *
     * @constructor
     * @param {Object} options 初始化配置参数
     * @param {HTMLElement} options.main 主元素
     * @param {Array.<Object>} options.datasource 数据源
     * @param {string=} options.value 选中的默认值
     */
    function RadioGroup(options) {

        this.attrs = {

            // 数据源
            datasource: {
                value: [],
                repaint: true
            },

            // 值
            value: {
                value: null,
                setter: this.syncValue
            }

        };

        Widget.call(this, options);
    }

    /**
     * 类型
     *
     * @type {string}
     */
    RadioGroup.prototype.type = 'RadioGroup';

    /**
     * 初始化控件选项
     *
     * @param {Object} options 选项
     */
    RadioGroup.prototype.initOptions = function (options) {

        Widget.prototype.initOptions.call(this, options);

        // 提取 datasource
        if (!this.get('datasource').length && !this.get('value')) {
            this.addState('prerender');
            this.extractData();
        }
    };

    /**
     * 初始化事件
     *
     * @override
     */
    RadioGroup.prototype.initEvent = function () {
        this.addEvent(
            this.get('main'),
            'click',
            this.clickHandler
        );

        this.on('propertychange', this.propertyChangeHandler);
    };

    /**
     * 属性变化处理函数
     *
     * @param {Object} ev 事件参数对象
     * @param {string} key 属性名
     * @param {*} oldValue 变更前的属性值
     * @param {*} newValue 变更后的属性值
     */
    RadioGroup.prototype.propertyChangeHandler = function (ev, key, oldValue, newValue) {
        if (key === 'value') {
            // valuechange 事件
            this.emit('valuechange', oldValue, newValue);
        }
    };

    /**
     * 设置选中项
     */
    RadioGroup.prototype.syncValue = function (value) {
        if (this.is('prerender')) {
            return;
        }

        var newItem = this.getItemByValue(value);

        var oldValue = this.get('value');
        var oldItem = this.getItemByValue(oldValue);

        // 值发生变化时更新状态
        if (value !== oldValue) {
            if (oldItem) {
                dom.removeData(oldItem, 'checked');
            }

            if (newItem) {
                dom.setData(newItem, 'checked', true);
            }
        }
    };

    /**
     * 根据值获取选项元素
     *
     * @param {string} value 值
     * @return {?HTMLElement}
     */
    RadioGroup.prototype.getItemByValue = function (value) {

        if (!value) {
            return null;
        }

        return dom.query(
            getDataSelector('value', value),
            this.get('main')
        );
    };

    /**
     * 点击事件处理
     *
     * @param {Event} ev 事件对象
     */
    RadioGroup.prototype.clickHandler = function (ev) {
        var item = dom.closest(
            ev.target,
            ITEM_ROLE_SELECTOR,
            this.get('main')
        );

        // 没选中任何一项
        if (!item) {
            return;
        }

        var oldValue = this.get('value');
        var newValue = dom.getData(item, 'value');

        this.set('value', newValue);

        // 发射 click 事件
        this.emit('click', oldValue, newValue);
    };

    /**
     * 分析DOM结构中的数据
     * 初始化 datasource 和 value
     */
    RadioGroup.prototype.extractData = function () {
        var radios = dom.queryAll(ITEM_ROLE_SELECTOR, this.get('main'));
        var datasource = [];
        var value = null;

        radios.forEach(function (item) {
            var itemValue = dom.getData(item, 'value');

            datasource.push({
                value: itemValue,
                name: item.innerHTML
            });

            if (item.getAttribute('data-checked') !== null) {
                value = itemValue;
            }
        });

        this.set('datasource', datasource);
        this.set('value', value);
    };

    /**
     * 获取HTML
     *
     * @return {string}
     */
    RadioGroup.prototype.getHtml = function () {
        var ds = this.get('datasource') || [];
        var html = [];
        var me = this;

        ds.forEach(function (data) {
            html.push(me.getItemHtml(data));
        });

        return html.join('');
    };

    /**
     * 获取单个选项的HTML
     *
     * @public
     * @param {Object} data 单个选项的数据
     * @return {string}
     */
    RadioGroup.prototype.getItemHtml = function (data) {
        var checkedValue = this.get('value');

        if (data.value === checkedValue) {
            data.checked = ' data-checked';
        }
        return format(ITEM_TPL, data);
    };

    /**
     * 重绘控件
     *
     * @param {Object=} changes 属性变化集
     */
    RadioGroup.prototype.repaint = function (changes) {
        if (this.is('prerender')) {
            this.removeState('prerender');
            return;
        }
        var value = this.get('value');

        this.get('main').innerHTML = this.getHtml();
        this.set('value', value);
    };

    /**
     * 获取 data 对应的选择器
     *
     * @param {string} data data名
     * @return {string}
     */
    function getDataSelector(data, value) {
        return '[data-'
            + data
            + (value ? '="' + value + '"' : '')
            + ']';
    }

    lang.inherits(RadioGroup, Widget);

    require('./main').register(RadioGroup);

    return RadioGroup;

});
