/*
----- SAMPLE MIXIN DEFINITION -----

define('MyMixin', [
    'underscore',
    'Backbone.CompositeView',
    'Mixin',
    'MyChildView'
], function MyMixin(
    _,
    BackboneCompositeView,
    Mixin,
    MyChildView
) {
    'use strict';

    return new Mixin({
        wrap: {
            initialize: function initialize(fn) {
                var result = fn.apply(this, Array.prototype.slice.call(arguments, 1));

                // do something with: this.mixinOptions

                // make it Composite if it's not already
                if (!_.isFunction(this.renderChilds)) {
                    BackboneCompositeView.add(this);
                }
                return result;
            }
        },
        merge: {
            events: {
                'click .new-event': 'methodToAdd'
            },
            childViews: {
                'MyChildView': function MyChildViewFn() {
                    return new MyChildView({});
                }
            }
        },
        extend: {
            methodToAdd: function methodToAdd() {
                console.log('something');
            }
        },
        plugins: {
            postContext: {
                name: 'SamplePlugin',
                priority: 10,
                execute: function execute(context, view) {
                }
            }
        }
    });
});

----- SAMPLE MIXIN USAGE: -----

define('MyModule', [
    'Backbone',
    'MyMixin'
], function MyModule(
    Backbone,
    MyMixin
) {
    'use strict';

    var View = Backbone.View.extend({});
    MyMixin.add(View, {
        myOption: true
    });
    return View;
});

 */
define('Mixin', [
    'underscore'
], function MixinModule(
    _
) {
    'use strict';

    function Mixin() {
        this.mixins = arguments.length ? _.toArray(arguments) : [];
    }

    _(Mixin.prototype).extend({

        methods: ['options', 'extend', 'merge', 'wrap', 'plugins'],

        compose: function compose() {
            var self = this;
            var composed = _.toArray(arguments);
            _(composed).each(function eachComposed(mixin) {
                self.mixins = _(self.mixins).union(mixin.mixins);
            });
        },

        add: function add(Class, options) {
            var self = this;
            _(self.mixins).each(function eachMixin(mixin) {
                _(self.methods).each(function eachMethod(method) {
                    self[method](mixin, Class, options);
                });
            });
        },

        options: function optionsFn(mixin, Class, options) {
            Class.prototype.mixinOptions = _(Class.prototype.mixinOptions || {}).extend(options || {});
        },
        extend: function extend(mixin, Class) {
            Class.prototype = _.extend(Class.prototype, mixin.extend || {});
        },
        merge: function merge(mixin, Class) {
            _(mixin.merge || {}).each(function eachMerge(obj, name) {
                Class.prototype[name] = _(Class.prototype[name] || {}).extend(obj);
            });
        },
        wrap: function wrap(mixin, Class) {
            _(mixin.wrap || {}).each(function eachWrap(wrapper, name) {
                Class.prototype[name] = _(Class.prototype[name] || function noop() {}).wrap(wrapper);
            });
        },
        plugins: function extend(mixin, Class) {
            // only allow this if plugin installer exists (Backbone classes)
            if (Class.prototype.installPlugin) {
                _(mixin.plugins || {}).each(function eachPlugin(plugin, name) {
                    Class.prototype.installPlugin(name, plugin);
                });
            }
        }

    });

    return Mixin;
});
