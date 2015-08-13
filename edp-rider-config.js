/**
 * @file rider/stylus 配置
 * @author edpx-mobile
 */

// 引入 rider 支持
var epr = require('edp-provider-rider');

// 初始化 stylus 插件
epr.stylusPlugin = epr.plugin({

    // 隐式引入 rider
    implicit: true,

    // 是否解析 url 中的路径
    resolveUrl: true,

    // 追加 stylus 配置，可在此处引入 stylus 插件
    // @see: http://stylus-lang.com/docs/js.html#usefn
    use: function (style) {
        // 若引入 CSS 文件，內联文件内容
        style.set('include css', true);
    },

    // husl 插件，需要时启用
    // @see: http://www.boronine.com/husl/
    // husl: true,

    // autoprefixer 配置
    // @see: https://github.com/postcss/autoprefixer-core#usage
    autoprefixer: [
        'Android >= 2.3',
        'iOS >= 6',
        'ExplorerMobile >= 10'
    ]
});

module.exports = epr;
