/**
 * @file Run test for Node
 * @author treelite(c.xinle@gmail.com)
 */

var loader = require('amder');

loader.config({
    packages: [
        {
            name: 'saber-lang',
            location: require.resolve('../')
        }
    ]
});

require('./spec/lang');
