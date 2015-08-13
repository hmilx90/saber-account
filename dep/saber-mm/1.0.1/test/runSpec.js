/**
 * @file Run test spec for server
 * @author treelite(c.xinle@gmail.com)
 */

var loader = require('amder');
var path = require('path');
var mm = require('../main');

mm.config({
    basePath: __dirname
});

loader.config({
    packages: [
        {
            name: 'saber-mm',
            location: require.resolve('../')
        }
    ]
});

require('./spec/abstractView');

require('./spec/model');

require('./spec/presenter');

require('./spec/main');
