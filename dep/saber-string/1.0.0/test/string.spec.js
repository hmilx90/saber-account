define(function() {
    var string = require('saber-string');

    describe('String', function() {

        // use `underscore.string` - `escapeHTML`/`unescapeHTML` test case:
        // https://github.com/epeli/underscore.string/blob/master/test/strings.js
        it('encodeHTML', function() {
            var encodeHTML = string.encodeHTML;

            expect(encodeHTML('<div>Blah & "blah" & \'blah\'</div>'))
                .toBe('&lt;div&gt;Blah &amp; &quot;blah&quot; &amp; &#39;blah&#39;&lt;/div&gt;');
            expect(encodeHTML('&lt;')).toBe('&amp;lt;');
            expect(encodeHTML(5)).toBe('5');
            expect(encodeHTML('')).toBe('');
            expect(encodeHTML(null)).toBe('');
            expect(encodeHTML(undefined)).toBe('');
        });

        it('decodeHTML', function() {
            var decodeHTML = string.decodeHTML;

            expect(decodeHTML('&lt;div&gt;Blah &amp; &quot;blah&quot; &amp; &apos;blah&#39;&lt;/div&gt;'))
                .toBe('<div>Blah & "blah" & \'blah\'</div>');
            expect(decodeHTML('&amp;lt;')).toBe('&lt;');
            expect(decodeHTML('&apos;')).toBe('\'');
            expect(decodeHTML('&#39;')).toBe('\'');
            expect(decodeHTML('&#0039;')).toBe('\'');
            expect(decodeHTML('&#x4a;')).toBe('J');
            expect(decodeHTML('&#x04A;')).toBe('J');
            expect(decodeHTML('&#X4A;')).toBe('&#X4A;');
            expect(decodeHTML('&_#39;')).toBe('&_#39;');
            expect(decodeHTML('&#39_;')).toBe('&#39_;');
            expect(decodeHTML('&amp;#38;')).toBe('&#38;');
            expect(decodeHTML('&#38;amp;')).toBe('&amp;');
            expect(decodeHTML('')).toBe('');
            expect(decodeHTML(null)).toBe('');
            expect(decodeHTML(undefined)).toBe('');
            expect(decodeHTML(5)).toBe('5');
        });

        it('format', function() {
            var format = string.format;
            expect(format('Hello,${name}!', {name: 'Saber'})).toBe('Hello,Saber!');
            expect(format('a${1}c${0}', ['d', 'b'])).toBe('abcd');
            expect(format('a${1}c${0}')).toBe('a${1}c${0}');
            expect(format('empty')).toBe('empty');
            expect(format(null)).toBe('');
            expect(format(undefined)).toBe('');
            expect(format(12)).toBe(12);
        });

        it('camelize', function () {
            var camelize = string.camelize;

            expect(camelize('ui-button')).toBe('uiButton');
            expect(camelize('-button')).toBe('Button');
            expect(camelize('button-')).toBe('button');
            expect(camelize(' button ')).toBe('button');
        });

        it('dasherize', function () {
            var dasherize = string.dasherize;

            expect(dasherize('dialog')).toBe('dialog');
            expect(dasherize('Moz')).toBe('-moz');
            expect(dasherize('WebkitTransform')).toBe('-webkit-transform');
            expect(dasherize('good boy')).toBe('good-boy');
            expect(dasherize(' bad boy ')).toBe('bad-boy');
        });
    });
});
