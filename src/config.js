/**
 * @file 路由配置
 * @author ()
 */

define(function (require) {

    return [
        {path: '/index', action: require('./index/index')},
        {path: '/edit', action: require('./edit/edit'), cached: false},
        {path: '/detail', action: require('./detail/detail'), cached: false},
        {path: '/list', action: require('./list/list'), cached: true},
        {path: '/welcome', action: require('./welcome/index'), cached: true}
    ];

});
