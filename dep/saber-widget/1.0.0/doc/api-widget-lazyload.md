LazyLoad
===

懒加载控件。

## Usage

``` javascript
var widget = require('saber-widget');
require('saber-widget/LazyLoad');

var lazyload = widget.lazyLoad();

lazyload.on('load', function (ev, node) {
    console.info('load', node);
});

lazyload.on('complete', function () {
    console.info('complete');
});
```

## API

### Methods

#### refresh()

强制重新获取懒加载元素
