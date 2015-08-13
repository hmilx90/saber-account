if (navigator.userAgent.indexOf("PhantomJS") > 0) {
    var consoleReporter = new jasmineRequire.ConsoleReporter()({
        showColors: true,
        timer: new jasmine.Timer,
        print: function(msg) {
            console.log('[JASMINE]' + msg);
        }
    });

    jasmine.getEnv().addReporter(consoleReporter);
}
