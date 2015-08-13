/**
 * @file  样式
 * @author  Firede[firede@firede.us],
 *          treelite[c.xinle@gmail.com],
 *          zfkun[zfkun@msn.com]
 */

define(function () {

    var exports = {};

    var getComputedStyle = document.defaultView.getComputedStyle;

    /**
     * 将CSS属性驼峰化
     *
     * @param {string} target 目标字符串
     * @return {string}
     */
    function camelize(target) {
        return target.replace(/-+(.)?/g, function (match, chr) {
            return chr ? chr.toUpperCase() : '';
        });
    }

    var detectEle = document.createElement('div');
    var prefixes = ['webkit', 'ms', 'o'];
    /**
     * 检测支持的CSS属性名称
     * 如果没有找到支持的属性名称返回原有值
     *
     * @inner
     * @param {string} property CSS属性名
     * @return {string}
     */
    function detectProperty(property) {
        if (property.charAt(0) !== '-') {
            var style = detectEle.style;
            var name = camelize(property);

            if (!(name in style)) {
                name = name.charAt(0).toUpperCase() + name.substring(1);

                for (var i = 0, prefix; prefix = prefixes[i]; i++) { // jshint ignore:line
                    if (prefix + name in style) {
                        property = '-' + prefix + '-' + property;
                        break;
                    }
                }
            }
        }
        return property;
    }

    /**
     * 获取样式
     *
     * @param {HTMLElement} element 目标元素
     * @param {string} property 属性
     * @return {string|null}
     */
    exports.getStyle = function (element, property) {
        property = detectProperty(property);
        return element.style[camelize(property)]
            || getComputedStyle(element).getPropertyValue(property);
    };

    /**
     * 设置样式
     *
     * @param {HTMLElement} element 目标元素
     * @param {string} property 属性
     * @param {string} value 值
     */
    exports.setStyle = function (element, property, value) {
        property = detectProperty(property);
        element.style[camelize(property)] = value;
    };

    /**
     * 显示DOM元素
     *
     * @param {HTMLElement} element 目标元素
     */
    exports.show = function (element) {
        if (exports.getStyle(element, 'display') === 'none') {
            element.style.display = null;
        }
    };

    /**
     * 隐藏DOM元素
     *
     * @param {HTMLElement} element 目标元素
     */
    exports.hide = function (element) {
        element.style.display = 'none';
    };

    /**
     * 为目标元素添加className
     *
     * @public
     * @param {HTMLElement} element 目标元素
     * @param {string} className 要添加的className
     *
     * @return {HTMLElement} 目标元素
     */
    exports.addClass = function (element, className) {
        // 优先使用classList. 在iOS 5, Android 3 之后开始支持
        if (element.classList) {
            element.classList.add(className);
        }
        else {
            var classes = element.className
                ? element.className.split(/\s+/) : [];

            for (var i = 0, n = classes.length; i < n; i++) {
                if (classes[i] === className) {
                    return element;
                }
            }

            classes.push(className);
            element.className = classes.join(' ');
        }

        return element;
    };

    /**
     * 移除目标元素的className
     *
     * @public
     * @param {HTMLElement} element 目标元素
     * @param {string} className 要移除的className
     *
     * @return {HTMLElement} 目标元素
     */
    exports.removeClass = function (element, className) {
        if (element.classList) {
            element.classList.remove(className);
        }
        else {
            var classes = element.className
                ? element.className.split(/\s+/) : [];

            for (var i = 0, n = classes.length; i < n; i++) {
                if (classes[i] === className) {
                    classes.splice(i, 1);
                    i--;
                }
            }
            element.className = classes.join(' ');
        }

        return element;
    };

    /**
     * 反转目标元素的className
     *
     * @public
     * @param {HTMLElement} element 目标元素
     * @param {string} className 要反转的className
     * @param {boolean=} isForce 强制指定添加或移除, 传入`true`则添加, 反之则移除
     *
     * @return {HTMLElement} 目标元素
     */
    exports.toggleClass = function (element, className, isForce) {
        isForce = 'boolean' === typeof isForce
            ? isForce
            : !exports.hasClass(element, className);

        exports[isForce ? 'addClass' : 'removeClass'](element, className);

        return element;
    };

    /**
     * 判断元素是否拥有指定的className
     *
     * @public
     * @param {HTMLElement} element 目标元素
     * @param {string} className 要判断的className
     *
     * @return {boolean} 是否拥有指定的className
     */
    exports.hasClass = function (element, className) {
        // 方法名用 hasClass，是因为 contains 在 dom 模块中可能引起歧义
        if (element.classList) {
            return element.classList.contains(className);
        }

        var classes = element.className.split(/\s+/);
        for (var i = 0, n = classes.length; i < n; i++) {
            if (classes[i] === className) {
                return true;
            }
        }

        return false;
    };

    /**
     * 获取元素的相对位置
     *
     * @public
     * @param {HTMLELement} element 目标元素
     * @param {HTMLELement=} offsetEle 相对元素
     * @return {Object}
     */
    exports.position = function (element, offsetEle) {
        var res = {};
        var pos = element.getBoundingClientRect();

        if (offsetEle) {
            var fixPos = offsetEle.getBoundingClientRect();
            res.left = pos.left - fixPos.left;
            res.top = pos.top - fixPos.top;
        }
        else {
            res.left = pos.left + Math.max(
                document.documentElement.scrollLeft,
                document.body.scrollLeft
           );
            res.top = pos.top + Math.max(
                document.documentElement.scrollTop,
                document.body.scrollTop
           );
        }

        return res;
    };


    return exports;
});
