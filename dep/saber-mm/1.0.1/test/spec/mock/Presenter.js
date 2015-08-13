define(function (require) {

    var inherits = require('saber-lang').inherits;
    var Base = require('saber-mm').Presenter;

    function Presenter(options) {
        Base.call(this, options);
    }

    inherits(Presenter, Base);

    return Presenter;

});
