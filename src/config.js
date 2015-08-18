/**
 * @file 路由配置
 * @author ()
 */

define(function (require) {

    return [
        {path: '/index', action: require('./index/index')},
        {path: '/edit', action: require('./edit/edit')},
        {path: '/detail', action: require('./detail/detail')},
        {path: '/list', action: require('./list/list')},
        {path: '/welcome', action: require('./welcome/index')}
    ];

});
