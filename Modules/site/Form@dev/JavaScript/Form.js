define('Form', [
    'Backbone.CompositeView',
    'Backbone.FormView',
    'Mixin',
    'Form.View'
], function Form(
    BackboneCompositeView,
    BackboneFormView,
    Mixin,
    FormView
) {
    'use strict';

    return new Mixin({

        wrap: {
            initialize: function initialize(fn) {
                var result = fn.apply(this, Array.prototype.slice.call(arguments, 1));

                if (!this.renderChilds) {
                    BackboneCompositeView.add(this);
                }
                if (!this.saveForm) {
                    BackboneFormView.add(this);
                }

                return result;
            }
        },
        merge: {
            childViews: {
                'Form': function FormChildView() {
                    return new FormView({
                        foo: 'bar'
                    });
                }
            }
        },
        extend: {
            isNew: function isNew() {
                throw new Error('Abstract method Form.isNew needs overriding.');
            },
            isEdit: function isEdit() {
                throw new Error('Abstract method Form.isEdit needs overriding.');
            },
            isView: function isView() {
                throw new Error('Abstract method Form.isView needs overriding.');
            }
        },
        plugins: {
            postContext: {
                name: 'FormPostContext',
                priority: 10,
                execute: function execute(/* context, view */) {
                }
            }
        }
    });
});
