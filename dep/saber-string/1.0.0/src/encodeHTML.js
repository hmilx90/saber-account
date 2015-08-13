/**
 * @file encodeHTML
 * @author treelite(c.xinle@gmail.com)
 *         firede(firede@firede.us)
 */

define(function () {
    /**
     * HTML编码
     *
     * @public
     * @param {string} str 待编码字符串
     * @return {string}
     */
    function encodeHTML(str) {
        if (!str) {
            return '';
        }

        // 只需将可能与HTML产生冲突的关键字符encode即可
        return String(str).replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
    }

    return encodeHTML;
});
