/**
 * @file view
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {
    var dom = require('saber-dom');

    var config = {};

    config.templateMainTarget = 'main';

    config.template = dom.g('template').innerHTML;

    config.domEvents = {
        'keypress: #new-todo': function (ele, e) {
            if (e.keyCode == 13) {
                var value = ele.value.trim();
                this.emit('add', value);
                ele.value = '';
            }
        },
        'click: .toggle': function (ele, e) {
            this.emit('complete', ele.getAttribute('data-id'), ele.checked);
        },
        'click: #clear-completed': function () {
            this.emit('clear');
        },
        'click: #toggle-all': function (ele) {
            this.emit('completeAll', ele.checked);
        },
        'click: .destroy': function (ele) {
            this.emit('remove', ele.getAttribute('data-id'));
        }
    };

    return config;
});
