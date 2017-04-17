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

    var defaults = {
        target: null,
        noPrototype: false,
        mixinOptions: {}
    };

    function Mixin() {
        this.defaults = defaults;
        this.mixins = arguments.length ? _.toArray(arguments) : [];
    }

    /* Instance methods */
    _(Mixin.prototype).extend({

        methods: ['options', 'extend', 'merge', 'wrap', 'plugins'],

        setMixins: function setMixins(mixins) {
            this.mixins = mixins;
        },

        compose: function compose() {
            var self = this;
            var composed = _.toArray(arguments);
            _(composed).each(function eachComposed(mixin) {
                self.mixins = _(self.mixins).union(mixin.mixins);
            });
        },

        add: function add(optionsArg) {
            var self = this;
            var options = _.defaults(optionsArg || {}, this.defaults);
            var target = options.noPrototype ? options.target : options.target.prototype;
            _(self.mixins).each(function eachMixin(mixin) {
                _(self.methods).each(function eachMethod(method) {
                    self[method](mixin, target, options.mixinOptions);
                });
            });
        },

        options: function optionsFn(mixin, Target, options) {
            Target.mixinOptions = _(Target.mixinOptions || {}).extend(options || {});
        },
        extend: function extend(mixin, Target) {
            _.extend(Target, mixin.extend || {});
        },
        merge: function merge(mixin, Target) {
            _(mixin.merge || {}).each(function eachMerge(obj, name) {
                Target[name] = _(Target[name] || {}).extend(obj);
            });
        },
        wrap: function wrap(mixin, Target) {
            _(mixin.wrap || {}).each(function eachWrap(wrapper, name) {
                Target[name] = _(Target[name] || function noop() {}).wrap(wrapper);
            });
        },
        plugins: function extend(mixin, Target) {
            // only allow this if plugin installer exists (Backbone classes)
            if (Target.installPlugin) {
                _(mixin.plugins || {}).each(function eachPlugin(plugin, name) {
                    Target.installPlugin(name, plugin);
                });
            }
        }

    });

    /* Class methods */
    _(Mixin).extend({

        implement: function use(Target, options, noPrototype) {
            var mixins = _.toArray(arguments.slice(1));
            var mixin = new Mixin();
            mixin.setMixins(mixins);
            mixin.add(Target, options, noPrototype);
            return mixin;
        }

    });

    return Mixin;
});
