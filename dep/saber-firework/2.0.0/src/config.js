/**
 * @file 全局配置
 * @author treelite(c.xinle@gmail.com)
 */

define({
    /**
     * index文件名
     *
     * @type {string}
     */
    index: '',

    /**
     * 默认路径
     *
     * @type {string}
     */
    path: '/',

    /**
     * 默认根路径
     *
     * @type {string}
     */
    root: '',

    /**
     * 预加载的模版
     *
     * @type {Array.<string>}
     */
    template: [],

    /**
     * 模版引擎配置信息
     *
     * @type {Object}
     */
    templateConfig: {},

    /**
     * 通用模版数据
     *
     * @type {Object}
     */
    templateData: {},

    /**
     * 是否启用同构模式
     *
     * @type {boolean}
     */
    isomorphic: false,

    /**
     * 数据同步的key
     *
     * @type {string}
     */
    syncDataKey: '__rebas__',

    /**
     * 视图配置
     * 参见`saber-viewport`的全局配置参数
     * https://github.com/ecomfe/saber-viewport
     *
     * @type {Object}
     */
    viewport: {

        /**
         * 默认关闭转场效果
         *
         * @type {boolean}
         */
        transition: false

    },

    /**
     * 附加处理器
     * 默认都是禁用处理器
     *
     * @type {Object}
     */
    processor: {

        /**
         * 转场参数处理
         *
         * @type {function|boolean}
         */
        transition: false
    },

    /**
     * 加载Action超时时间（毫秒）
     * 超过此时间可以切换Action
     *
     * @type {number}
     */
    timeout: 1000
});
