/**
 * Saber Widget
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file 主模块
 * @author zfkun(zfkun@msn.com)
 */

define(function (require) {

    /**
     * 主模块
     * 提供组件全局配置、注册、管理等
     *
     * @exports widget
     * @singleton
     * @requires saber-lang
     */
    var main = {};


    /**
     * 控件库默认配置
     *
     * @inner
     * @type {Object}
     */
    var config = {

        // 控件配置信息所在的DOM属性名
        configAttr: 's-ui',

        // 控件实例的标识属性
        instanceAttr: 's-id'

    };

    /**
     * 配置控件库全局配置
     *
     * @public
     * @param {Object} info 控件库配置信息对象
     */
    main.config = function (info) {
        require('saber-lang').extend(config, info);
    };

    /**
     * 获取配置项
     *
     * @public
     * @param {string} name 配置项名称
     * @return {string} 配置项值
     */
    main.getConfig = function (name) {
        return config[ name ];
    };


    /**
     * GUID生成基数
     *
     * @inner
     * @type {number}
     */
    var guid = 0x840704;

    /**
     * 生成全局唯一id
     *
     * @param {string=} prefix 前缀
     * @return {string} 新唯一id字符串
     */
    main.getGUID = function (prefix) {
        prefix = prefix || 's';
        return prefix + guid++;
    };


    /**
     * 清理已初始化的控件实例
     *
     * @param {(string= | Widget= | HTMLElement=)} widget 控件实例或控件实例id或DOM元素，不传则销毁全部
     * - 传入`控件id`时,销毁`id`对应的控件
     * - 传入`控件实例`时,销毁之
     * - 传入`DOM元素`时,销毁`DOM元素`内的所有控件
     */
    main.dispose = function (widget) {
        // 不传时，清理释放所有控件实例
        if (!widget) {
            for (var w in widgets) {
                widgets[ w ].dispose();
            }
        }
        // 传入字符串时，清理释放控件id与之匹配的实例
        else if ('string' === typeof widget) {
            widget = this.get(widget);
            if (widget) {
                widget.dispose();
            }
        }
        // 传入控件实例时，直接清理释放
        else if ('function' === typeof widget.dispose) {
            widget.dispose();
        }
        // 传入DOM元素时，清理释放DOM元素范围的实例
        else if (/^\[object\sHTML/.test(Object.prototype.toString.call(widget))) {
            this.find(widget).forEach(function (w) {
                w.dispose();
            });
        }
    };

    /**
     * 获取指定DOM元素内的所有控件实例
     *
     * @param {HTMLElement} element 被检索的DOM元素
     * @return {Array.<Widget>} 查找到的控件实例
     */
    main.find = function (element) {
        var attr = this.getConfig('instanceAttr');
        return [].map.call(
            element.querySelectorAll('[' + attr + ']'),
            function (node) {
                return main.get(node.getAttribute(attr));
            }
        );
    };


    /**
     * 控件实例集合
     * 以实例id为键值存储映射关系
     *
     * @inner
     * @type {Object}
     */
    var widgets = {};

    /**
     * 存储控件实例
     *
     * @public
     * @param {Widget} widget 待加控件实例
     */
    main.add = function (widget) {
        var exists = widgets[ widget.id ];

        // 根据传入实例的id检索当前存储:
        // 若 不存在，直接加入存储
        // 若 存在, 但不是同一实例，则替换更新
        if (!exists || exists !== widget) {
            // 存储(或更新)实例
            widgets[ widget.id ] = widget;
        }
    };

    /**
     * 移除控件实例
     *
     * @public
     * @param {Widget} widget 待移除控件实例
     */
    main.remove = function (widget) {
        delete widgets[ widget.id ];
    };

    /**
     * 通过id获取控件实例
     *
     * @public
     * @param {string} id 控件id
     * @return {Widget} 根据id获取的控件实例
     */
    main.get = function (id) {
        return widgets[ id ];
    };


    /**
     * 已注册控件类集合
     *
     * @inner
     * @type {Object}
     */
    var components = {};

    /**
     * 注册控件类
     * 通过类的`prototype.type`识别控件类型信息
     *
     * @public
     * @param {Function} component 控件类
     */
    main.register = function (component) {
        if ('function' === typeof component) {
            var type = component.prototype.type;
            if (type in components) {
                throw new Error(type + ' is exists!');
            }

            components[ type ] = component;

            // 增加注册控件快捷初始化方式(自动渲染)
            // 生成规则: 以控件类型名**首字母小写**为方法名
            // 如: `ImageView`控件对应生成 `.imageView( main, options )`
            main[ type.charAt(0).toLowerCase() + type.slice(1) ] = function (element, options) {
                if (require('saber-lang/type').isPlainObject(element)) {
                    options = element || {};
                }
                else {
                    options = options || {};
                    options.main = element;
                }

                // 这里未使用 new component( options )
                // 主要考虑闭包内肯定要有个上层内部变量的引用
                // `String`类型的`type` 总比`Function`类型的`component`要好一点
                // 退十万八千里讲, 未来也许控件类的构造函数不是注册时的`component`，而是经过包装的也说不好
                return new components[ type ](options).render();
            };
        }
    };


    /**
     * 已注册插件类集合
     *
     * @inner
     * @type {Object}
     */
    var plugins = {};

    /**
     * 注册插件类
     * 通过类的`prototype.type`识别插件类型信息
     *
     * @public
     * @param {Function} plugin 插件类
     */
    main.registerPlugin = function (plugin) {
        if ('function' === typeof plugin) {
            var type = plugin.prototype.type;
            if (type in plugins) {
                throw new Error('plugin ' + type + ' is exists!');
            }

            plugins[ type ] = plugin;
        }
    };

    /**
     * 启用插件
     *
     * @public
     * @param {Widget} widget 目标控件实例
     * @param {String} pluginName 待激活插件名
     * @param {Object=} options 插件配置项
     */
    main.enablePlugin = function (widget, pluginName, options) {
        var enabledPlugins = widget.plugins || (widget.plugins = {});
        var plugin = enabledPlugins[ pluginName ];

        /*jslint newcap:true */
        if (!plugin && (plugin = plugins[ pluginName ])) {
            plugin = widget.plugins[ pluginName ] = new plugin(widget, options);
        }

        if (plugin) {
            plugin.enable();
        }
    };

    /**
     * 禁用插件
     *
     * @public
     * @param {Widget} widget 目标控件实例
     * @param {(String= | Array=)} pluginName 待禁用插件名
     * 单个禁用传入插件名, 批量禁用传入数组, 全部禁用不传入
     */
    main.disablePlugin = function (widget, pluginName) {
        var enabledPlugins = widget.plugins;

        if (!enabledPlugins) {
            return;
        }

        var names;

        if (Array.isArray(pluginName)) {
            names = pluginName;
        }
        else if (!pluginName) {
            names = Object.keys(enabledPlugins);
        }
        else if ('string' === typeof pluginName) {
            names = [pluginName];
        }

        names.forEach(function (name) {
            if (name && enabledPlugins[ name ]) {
                enabledPlugins[ name ].disable();
            }
        });
    };

    /**
     * 销毁插件
     *
     * @public
     * @param {Widget} widget 目标控件实例
     * @param {(String= | Array=)} pluginName 待销毁插件名
     * 单个删除传入插件名, 批量删除传入数组, 全部删除不传入
     */
    main.disposePlugin = function (widget, pluginName) {
        var enabledPlugins = widget.plugins;

        if (!enabledPlugins) {
            return;
        }


        var names;

        if (Array.isArray(pluginName)) {
            names = pluginName;
        }
        else if (!pluginName) {
            names = Object.keys(enabledPlugins);
        }
        else if ('string' === typeof pluginName) {
            names = [pluginName];
        }

        names.forEach(function (name) {
            if (name && enabledPlugins[ name ]) {
                enabledPlugins[ name ].dispose();
                delete enabledPlugins[ name ];
            }
        });
    };


    return main;

});
