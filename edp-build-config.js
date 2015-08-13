/**
 * @file build配置
 * @author edpx-mobile
 */

/* globals CssCompressor, ModuleCompiler, JsCompressor, PathMapper, Html2JsCompiler, StylusCompiler, OutputCleaner */

var cwd = process.cwd();
var path = require('path');

// 引入 rider 支持
var epr = require('./edp-rider-config');

/**
 * 指定匹配版本的 stylus
 */
exports.stylus = epr.stylus;

/**
 * 输入目录
 *
 * @type {string}
 */
exports.input = cwd;

/**
 * 输出目录
 *
 * @type {string}
 */
exports.output = path.resolve(cwd, 'output');

/**
 * 排除文件pattern列表
 *
 * @type {Array}
 */
exports.exclude = [
    'tool',
    'doc',
    'test',
    'module.conf',
    'dep/packages.manifest',
    'dep/*/*/test',
    'dep/*/*/doc',
    'dep/*/*/demo',
    'dep/*/*/tool',
    'dep/*/*/*.md',
    'dep/*/*/package.json',
    'edp-*',
    'node_modules',
    '.edpproj',
    '.svn',
    '.git',
    '.gitignore',
    '.idea',
    '.project',
    'Desktop.ini',
    'Thumbs.db',
    '.DS_Store',
    '*.tmp',
    '*.bak',
    '*.swp'
];

/**
 * 获取构建processors的方法
 *
 * @return {Array}
 */
exports.getProcessors = function () {
    var cssProcessor = new CssCompressor();
    var moduleProcessor = new ModuleCompiler();
    var jsProcessor = new JsCompressor();
    var pathMapperProcessor = new PathMapper();
    var html2jsPorcessor = new Html2JsCompiler({
        extnames: 'tpl'
    });
    var stylusProcessor = new StylusCompiler({
        stylus: epr.stylus,
        compileOptions: {
            use: epr.stylusPlugin
        }
    });
    var outputCleaner = new OutputCleaner();

    return [
        stylusProcessor,
        cssProcessor,
        html2jsPorcessor,
        moduleProcessor,
        jsProcessor,
        pathMapperProcessor,
        outputCleaner
    ];
};

exports.moduleEntries = 'html,htm,phtml,tpl,vm,js';
exports.pageEntries = 'html,htm,phtml,tpl,vm';

/* eslint-disable guard-for-in */
exports.injectProcessor = function (processors) {
    for (var key in processors) {
        global[ key ] = processors[ key ];
    }
};
