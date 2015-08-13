/**
 * @file string
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    return {
        encodeHTML: require('./encodeHTML'),
        decodeHTML: require('./decodeHTML'),
        format: require('./format'),
        camelize: require('./camelize'),
        dasherize: require('./dasherize')
    };

});
