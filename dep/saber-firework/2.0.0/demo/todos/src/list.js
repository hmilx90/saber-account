/**
 * @file list
 * @author treelite(c.xinle@gmail.com)
 */
define(function (require) {

    var bind = require('saber-lang/bind');

    var config = {};

    config.view = require('./listView');

    config.model = require('./listModel');

    config.refresh = function (query) {
        return this.model.fetch(query).then(
            bind(this.view.render, this.view)
        );
    };

    config.events = {
        'view:add': function (title) {
            this.model.add(title).then(
                bind(this.refresh, this)
            );
        },

        'view:remove': function (id) {
            this.model.remove(id).then(
                bind(this.refresh, this)
            );
        },

        'view:complete': function (id, completed) {
            this.model.complete(id, completed).then(
                bind(this.refresh, this)
            );
        },

        'view:clear': function () {
            this.model.clear().then(
                bind(this.refresh, this)
            );
        },

        'view:completeAll': function (completed) {
            this.model.completeAll(completed).then(
                bind(this.refresh, this)
            );
        }
    };

    return config;
});
