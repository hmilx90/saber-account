/**
 * @file 联动菜单
 * @author hushicai(bluthcy@gmail.com)
 */

define(
    function (require) {
        var lang = require('saber-lang');
        var string = require('saber-string');
        var Widget = require('./Widget');
        var dom = require('saber-dom');

        /**
         * 确保数据类型
         *
         * @inner
         * @return {number|string}
         */
        function ensureValueType(value) {
            if (value === undefined) {
                return null;
            }

            if (/^\d+$/.test(value)) {
                value = parseInt(value, 10);
            }

            return value;
        }

        /**
         * 简易多叉树
         *
         * @param {Object} source 数据源
         *
         *  ```
         *  [
         *      {
         *          name: '北京',
         *          value: 1,
         *          children:  [
         *              {
         *                  name: '',
         *                  value: ''
         *              },
         *              // ...
         *          ]
         *      },
         *      // ...
         *  ]
         *  ```
         * @constructor
         */
        function Tree(source) {
            this._root = {
                name: 'root',
                value: 'root',
                level: 0,
                children: source
            };

            this._depth = 0;

            // 预处理数据
            this._preprocess();
        }

        Tree.prototype = {
            constructor: Tree,

            /**
             * 广度优先搜索，获取指定value的节点，有坑：
             *
             * 1. 不同层级的value有可能相同，怎么处理？用uniqueValue？
             *
             * @public
             * @param {string|number} value
             * @return {Object}
             */
            getNode: function (value) {
                var current = {};
                var root = this._root;

                if (value === undefined || value === 'root') {
                    return root;
                }

                // 遍历队列
                var queue = [];

                // 从根节点开始
                queue.push(root);

                while (queue.length > 0) {
                    current = queue.shift();

                    // 用uniqueValue来比较
                    var valueSource = ensureValueType(current.uniqueValue);

                    if (valueSource === value) {
                        break;
                    }

                    var children = current.children || [];
                    for (var i = 0, len = children.length; i < len; i++) {
                        queue.push(children[i]);
                    }
                }

                queue = null;

                return current;
            },

            /**
             * 获取树的深度
             *
             * @public
             * @return {number}
             */
            getDepth: function () {
                return this._depth;
            },

            // TODO: 更新数据源
            update: function (source) {
            },

            /**
             * 预处理数据，添加level、uniqueValue等属性；计算深度...
             *
             * @private
             */
            _preprocess: function () {
                var depth = -1;

                // 深度优先搜索
                var tag = [];

                function dfs(node, deep) {
                    tag.push(node.value);
                    // 添加level
                    node.level = node.level || deep;
                    // 添加uniqueValue
                    node.uniqueValue = tag.join('-');
                    if (!node.children || node.children.length === 0) {
                        depth = Math.max(depth, deep);
                        return;
                    }
                    else {
                        for (var i = 0, len = node.children.length; i < len; i++) {
                            dfs(node.children[i], deep + 1);
                            tag.pop();
                        }
                    }
                }

                // 咱这里把根节点的深度当成0，
                // 当然也可以当做1，不过如果当作1的话，就得修改用它这棵树的地方
                dfs(this._root, 0);

                this._depth = depth;
            }
        };


        // 局部滚动
        var scroll = require('saber-scroll');

        require('saber-scroll/plugin/scrollbar');

        /**
         * 单级菜单项
         *
         * @constructor
         */
        function LinkageItem(options) {
            // 链表
            this.next = null;
            // 值
            this.value = ensureValueType(options.value);
            // 唯一值
            this.uniqueValue = ensureValueType(options.uniqueValue);
            // 数据
            this.data = null;

            this.main = document.createElement('div');
            this.main.className = 'linkage-item';
            this.ul = document.createElement('ul');
            this.main.appendChild(this.ul);

            // 渲染
            this.render(options.data);

            this._changeHandler = lang.bind(this._changeHandler, this);
            // 绑定事件
            this.main.addEventListener('click', this._changeHandler, false);
        }

        LinkageItem.prototype = {
            constructor: LinkageItem,

            /**
             * 渲染菜单
             *
             * @public
             */
            render: function (data) {
                data = data || [];

                if (!data.length) {
                    return;
                }

                // 暂存数据
                this.data = data;

                if (this.next && !this.exist('uniqueValue')) {
                    // 不是最后一级
                    this.uniqueValue = data[0].uniqueValue;
                    this.value = data[0].value;
                }

                var html = [];
                var tpl = ''
                    + '<li class="${className}" data-value="${value}" data-unique-value="${uniqueValue}">'
                    + '<span>${name}</span>'
                    + '</li>';

                for (var i = 0, len = data.length; i < len; i++) {
                    var temp = lang.extend({}, data[i]);
                    var className = '';
                    var uniqueValue = ensureValueType(temp.uniqueValue);
                    // 通过uniqueValue来选中
                    if (uniqueValue === this.uniqueValue) {
                        className += 'linkage-item-cur';
                    }
                    if (temp.disable) {
                        className += 'linkage-item-disabled';
                    }
                    temp.className = className;
                    html.push(
                        string.format(tpl, temp)
                    );
                }

                this.ul.innerHTML = html.join('');

                // 局部滚动
                if (!this._scroller) {
                    this._scroller = scroll(
                        this.main,
                        {
                            scrollbar: true,
                            horizontal: false
                        }
                    );
                }
                else {
                    this._scroller.repaint();
                }

                return this;
            },

            /**
             * 判断value/uniqueValue是否在data中
             *
             * @public
             * @return {boolean}
             */
            exist: function (key) {
                var v = this[key];

                if (v === null) {
                    return false;
                }

                var data = this.data;
                for (var i = 0, len = data.length; i < len; i++) {
                    var value = (data[i][key]);
                    if (v === value) {
                        return true;
                    }
                }

                return false;
            },

            /**
             * 滚动到当前选中元素上
             *
             * @public
             */
            scrollToCurrent: function () {
                var cur = dom.query('.linkage-item-cur', this.ul);

                if (cur) {
                    this._scroller.scrollToElement(cur);
                }
            },

            _changeHandler: function (e) {
                var el = e.target;
                // 设置一个标志吧
                var founded = false;
                // 找到最外层main元素为止
                while (el && el !== this.main) {
                    if (el.tagName === 'LI') {
                        founded = true;
                        break;
                    }
                    el = el.parentNode;
                }
                // 如果没有找到li元素或者li元素置灰，则不处理
                if (!founded || dom.hasClass(el, 'linkage-disabled')) {
                    return false;
                }
                // 删除选中项
                var cur = dom.query('.linkage-item-cur', this.main);

                cur && dom.removeClass(cur, 'linkage-item-cur');
                dom.addClass(el, 'linkage-item-cur');

                // 更新数据
                var value = el.getAttribute('data-value');
                this.value = ensureValueType(value);

                this.uniqueValue = el.getAttribute('data-unique-value');
                this.emit(
                    'change',
                    {
                        target: this,
                        type: 'change'
                    },
                    {
                        value: value
                    }
                );
            },

            dispose: function () {
                this.main.removeEventListener('click', this._changeHandler);
                this.main = null;
                this.ul = null;
            }
        };

        require('saber-emitter').mixin(LinkageItem.prototype);


        /**
         * 联动菜单
         *
         * @constructor
         */
        function LinkageMenu(options) {
            this.attrs = {
                datasource: {
                    value: []
                },

                values: {
                    value: [],
                    setter: function (values) {
                        // 计算uniqueValues
                        var uniqueValues = [];
                        var values = values.slice(0);
                        for (var i = 0, len = values.length; i < len; i++) {
                            var temp = ['root'].concat(values.slice(0, i + 1));
                            uniqueValues.push(temp.join('-'));
                        }
                        this.set('uniqueValues', uniqueValues);
                    }
                },

                uniqueValues: {
                    value: []
                }
            };

            this.states = {};

            // **MUST**最后调用父类的构造函数
            // 由于子类的`attrs`、`states`等需要与父类的对应默认值进行`mixin`
            Widget.apply(this, arguments);
        }

        LinkageMenu.prototype.type = 'LinkageMenu';

        /**
         * 初始化dom结构
         *
         * @public
         */
        LinkageMenu.prototype.initDom = function () {
            this.main.className = 'linkage-menu';

            var datasource = this.get('datasource');
            // 多叉树
            this.runtime.tree = new Tree(datasource);
            // 单向链表
            this.runtime.linkedList = null;

            this._linkageItemChangeHandler = lang.bind(this._linkageItemChangeHandler, this);

            var values = this.get('values');
            var uniqueValues = this.get('uniqueValues');
            var tree = this.runtime.tree;
            // 获取树的高度
            var depth = tree.getDepth();
            var fragment = document.createDocumentFragment();
            var p;
            var prevValue;
            // 生成`树的深度`个数Menu
            for (var i = 0; i < depth; i++) {
                var node = tree.getNode(prevValue);
                var children = node.children || [];
                var value = values[i];
                var uniqueValue = uniqueValues[i];

                var linkageItem = new LinkageItem({
                    data: children,
                    value: value,
                    uniqueValue: uniqueValue
                });

                // 插入链表
                if (!this.runtime.linkedList) {
                    this.runtime.linkedList = linkageItem;
                }
                else {
                    p.next = linkageItem;
                }
                p = linkageItem;

                linkageItem.on('change', this._linkageItemChangeHandler);
                fragment.appendChild(linkageItem.main);
                prevValue = uniqueValue;
            }

            p = null;
            prevValue = null;

            this.main.appendChild(fragment);
        };

        LinkageMenu.prototype.initEvent = function () {
        };

        /**
         * 处理单个菜单
         *
         * @private
         */
        LinkageMenu.prototype._linkageItemChangeHandler = function (e, data) {
            var linkageItem = e.target;
            if (linkageItem.next === null) {
                var values = [];
                var head = this.runtime.linkedList;
                while (head) {
                    values.push(head.value);
                    head = head.next;
                }
                this.set('values', values);
                this.emit('select', values);
            }
            else {
                this._linkage(linkageItem);
                this.emit('linkage', data);
            }
        };

        /**
         * 联动
         *
         * @private
         */
        LinkageMenu.prototype._linkage = function (linkageItem) {
            while (linkageItem && linkageItem.next) {
                var node = this.runtime.tree.getNode(linkageItem.uniqueValue);
                var nextLinkage = linkageItem.next;
                nextLinkage.render(node.children);
                linkageItem = nextLinkage;
            }
        };

        lang.inherits(LinkageMenu, Widget);

        require('./main').register(LinkageMenu);
    }
);
