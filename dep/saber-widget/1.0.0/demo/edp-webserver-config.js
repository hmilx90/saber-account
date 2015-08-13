var epr = require( 'edp-provider-rider' );
var riderUI = require( 'rider-ui' );

exports.stylus = epr.stylus;

function stylusConfig( style ) {
    style.use( epr.plugin() );
    style.use( riderUI() );
}

exports.port = 8848;
exports.directoryIndexes = true;
exports.documentRoot = __dirname + '/../';
exports.getLocations = function () {
    return [
        {
            location: /\/$/,
            handler: [
                home( 'index.html' ),
                livereload()
            ]
        },
        {
            location: /\.html($|\?)/,
            handler: [
                file(),
                livereload()
            ]
        },
        {
            location: /\.css($|\?)/,
            handler: [
                autocss({
                    stylus: {
                        use: stylusConfig
                    }
                })
            ]
        },
        {
            location: /\.less($|\?)/,
            handler: [
                file(),
                less()
            ]
        },
        {
            location: /\.styl($|\?)/,
            handler: [
                file(),
                stylus()
            ]
        },
        {
            location: /^.*$/,
            handler: [
                file(),
                proxyNoneExists()
            ]
        }
    ];
};

exports.injectResource = function ( res ) {
    for ( var key in res ) {
        global[ key ] = res[ key ];
    }
};
