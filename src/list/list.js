/**
 * @file 
 * @author ()
 */

define(function (require) {
    var dom = require('saber-dom');

    var config = {};

    config.view = require('./listView');

    config.model = require('./listModel');

    config.events = {
        // sleep: function () {
        //     this.scrollTop = document.body.scrollTop;
        //     this.activeDate = this.view.activeDate;
        // },
        // wakeup: function () {
        //     document.body.scrollTop = this.scrollTop;
        //     this.model.activeDate = this.activeDate;
        // },
        'view: delete': function (id) {
            this.model.deleteItem(id).then(function (deletedItem) {
                var typeDom = deletedItem.type === 'expense' ? dom.query('.expense-value') : dom.query('.income-value');
                typeDom.innerHTML -= deletedItem.number;
            });
            
        },
        wakeup: function () {
            var me = this;
            this.model.fetch().then(function (data) {
                me.view.render(data);
            });
        }
    }

    return config;

});
