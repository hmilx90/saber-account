/**
 * @file utils-cookie
 * @author cuiyongjian(cuiyongjian@outlook.com)
*/


define(function (require) {

    /**
     * 拿cookie
     *
     * private
     * @param {string} key cookie键
    */
    function getCookie(key) {
        if (document.cookie.length>0) { 
            c_start=document.cookie.indexOf(key + "=")
            if (c_start!=-1) {
            c_start=c_start + key.length+1 
            c_end=document.cookie.indexOf(";",c_start)
            if (c_end==-1) c_end=document.cookie.length
                return unescape(document.cookie.substring(c_start,c_end))
            } 
        }
        return ""
    }

    /**
     * set cookie
     *
     * private
     * @param {string} key cookie键
     * @param {string} value cookie值
     * @param {number} expiredays 过期天数
    */
    function setCookie(key, value, expiredays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate + expiredays);
        document.cookie = key + '=' + escape(value)
        + ((expiredays==null) ? "" : ";expires="+exdate.toGMTString());

    }

    var exports = {};
    exports.setCookie = setCookie;
    exports.getCookie = getCookie;
    return exports;
});