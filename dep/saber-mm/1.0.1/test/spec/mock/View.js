define(function (require) {

    var inherits = require('saber-lang').inherits;
    var Base = require('saber-mm').View;

    function View(options) {
        Base.call(this, options);
    }

    inherits(View, Base);

    return View;

});
