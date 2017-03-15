define('Form', [
    'underscore',
    'jQuery',
    'Backbone.CompositeView',
    'Backbone.FormView',
    'Mixin',
    'Form.Config',
    'Form.View'
], function Form(
    _,
    jQuery,
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

                this.parseFormConfig();

                if (!this.renderChilds) {
                    BackboneCompositeView.add(this);
                }
                if (!this.formViewFocusHandler) {
                    BackboneFormView.add(this);
                }

                return result;
            }
        },
        merge: {
            formData: {},
            events: {
                'submit form': 'saveForm'
            },
            childViews: {
                'Form': function FormChildView() {
                    return new FormView({
                        config: this.formConfig
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
                return jQuery.extend(true, {}, _.result(this, 'formData'));
            },
            getFormConfig: function getFormConfig() {
                return new FormConfig({
                    application: this.application || this.options.application,
                    info: this.getFormInfo(),
                    data: this.getFormData(),
                    action: this.getAction()
                });
            },
            parseFormConfig: function parseFormConfig() {
                this.formConfig = this.getFormConfig();
                this.defineBindings();
            },
            defineBindings: function defineBindings() {
                var self = this;
                var data = self.formConfig.getDataJSON();
                self.bindings = self.bindings || {};
                _(data.fields).each(function eachField(field) {
                    var attribute = field.attribute;
                    self.bindings['[name="' + attribute + '"]'] = attribute;
                });
            },

            isView: function isView() {
                return !this.isNew() && !this.isEdit();
            },
            /* ABSTRACT */
            getFormInfo: function getFormInfo() {
                throw new Error('Abstract method Form.getTitle needs overriding.');
            },
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
