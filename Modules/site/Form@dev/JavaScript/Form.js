define('Form', [
    'underscore',
    'Backbone.CompositeView',
    'Backbone.FormView',
    'Mixin',
    'Form.View'
], function Form(
    _,
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
                        config: this.getFormConfig(),
                        action: this.getAction()
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
                return !this.isNew() && !this.isEdit();
            },
            getAction: function getAction() {
                if (this.isNew()) {
                    return 'new';
                } else if (this.isEdit()) {
                    return 'edit';
                }
                return 'view';
            },
            getFormConfig: function getFormConfig() {
                // run this.form if function, or get it if object
                var config = _.result(this, 'formConfig');

                return config;
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
