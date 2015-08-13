/**
 * @file 默认全局配置
 * @author treelite(c.xinle@gmail.com)
 */

define({
    /**
     * 默认转场效果
     *
     * @type {boolean|string}
     */
    transition: true,

    /**
     * 默认效果时长
     *
     * @type {number}
     */
    duration: 0.3,

    /**
     * 默认转场缓动效果
     * 取值请参考CSS:transition-timing-function
     *
     * @type {string}
     */
    timing: 'ease',

    /**
     * 是否启用transform转场效果
     *
     * @type {boolean}
     */
    transform: true,


    /**
     * 转场mask
     *
     * @type {boolean}
     */
    mask: true,

    /**
     * 转场滚动条修正
     *
     * @type {boolean}
     */
    resetScroll: true,

    /**
     * 滚动容器元素
     *
     * @type {HTMLElement}
     */
    scrollContainer: document.body
});
