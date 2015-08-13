/**
 * @file index
 */

 define(function (require) {

    var config = {};

    // 配置model
    config.model = require('./indexModel');
    // 配置view
    config.view = require('./indexView');

    return config;

 });
