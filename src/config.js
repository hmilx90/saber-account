/**
 * @file 路由配置
 * @author ()
 */

define(function (require) {

    return [
        {path: '/index', action: require('./index/index'), cached: true},
        {path: '/edit', action: require('./edit/edit'), cached: true},
        {path: '/detail', action: require('./detail/detail'), cached: true},
        {path: '/list', action: require('./list/list'), cached: true},
        {path: '/welcome', action: require('./welcome/index'), cached: true}
    ];

});
