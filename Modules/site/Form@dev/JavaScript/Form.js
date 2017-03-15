define('Form', [
    'underscore',
    'Backbone.CompositeView',
    'Backbone.FormView',
    'Mixin',
    'Form.Config',
    'Form.View'
], function Form(
    _,
    BackboneCompositeView,
    BackboneFormView,
    Mixin,
    FormConfig,
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
            formData: {},
            childViews: {
                'Form': function FormChildView() {
                    return new FormView({
                        config: this.getFormConfig()
                    });
                }
            }
        },
        extend: {
            getAction: function getAction() {
                if (this.isNew()) {
                    return 'new';
                } else if (this.isEdit()) {
                    return 'edit';
                }
                return 'view';
            },
            getFormData: function getConfig() {
                // run this.form if function, or get it if object
                return _.result(this, 'formData');
            },
            getFormConfig: function getFormConfig() {
                return new FormConfig({
                    application: this.application || this.options.application,
                    data: this.getFormData(),
                    action: this.getAction()
                });
            },

            isView: function isView() {
                return !this.isNew() && !this.isEdit();
            },
            /* ABSTRACT */
            isNew: function isNew() {
                throw new Error('Abstract method Form.isNew needs overriding.');
            },
            isEdit: function isEdit() {
                throw new Error('Abstract method Form.isEdit needs overriding.');
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
