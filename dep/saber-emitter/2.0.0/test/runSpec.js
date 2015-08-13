/**
 * @file Run test for Node
 * @author treelite(c.xinle@gmail.com)
 */

var loader = require('amder');

loader.config({
    packages: [
        {
            name: 'saber-emitter',
            location: require.resolve('../')
        }
    ]
});

require('./spec/emitter');
