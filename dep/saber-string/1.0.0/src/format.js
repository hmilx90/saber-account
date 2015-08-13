/**
 * @file format string
 * @author treelite(c.xinle@gmail.com)
 *         firede(firede@firede.us)
 */

define(function () {
    /**
     * 字符串格式化
     * 替换字符串中的${xx}字符
     * 将xx作为data的字段名或者参数
     * 用返回的结果加以替换
     *
     * @public
     * @param {string} template 字符串模板
     * @param {Object|Array|Function} data 数据
     * @return {string}
     */
    function format(template, data) {
        if (!template) {
            return '';
        }

        if (data == null) {
            return template;
        }

        var replacer = typeof data === 'function'
                ? data
                : function (key) {
                    var res = data[key];
                    return res == null ? '' : res;
                };

        return (template + '').replace(/\$\{(.+?)\}/g, function (match, key) {
            return replacer(key);
        });
    }

    return format;
});
