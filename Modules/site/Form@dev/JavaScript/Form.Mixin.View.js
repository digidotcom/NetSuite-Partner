define('Form.Mixin.View', [
    'underscore',
    'jQuery',
    'Backbone.CompositeView',
    'Backbone.FormView',
    'Mixin',
    'Form.Field.Type',
    'Form.Config',
    'Form.View',
    'Form.Mixin.Model'
], function FormMixinView(
    _,
    jQuery,
    BackboneCompositeView,
    BackboneFormView,
    Mixin,
    FormFieldType,
    FormConfig,
    FormView,
    FormMixinModel
) {
    'use strict';

    return new Mixin({

        wrap: {
            initialize: function initialize(fn) {
                var result = fn.apply(this, Array.prototype.slice.call(arguments, 1));

                this.prepareForForm();

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
                'submit form': 'saveFormUnlessView'
            },
            childViews: {
                'Form': function FormChildView() {
                    this.refreshFormConfig();
                    return new FormView({
                        config: this.formConfig
                    });
                }
            }
        },
        extend: {
            getFormAction: function getFormAction() {
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
                    model: this.model,
                    permissions: this.getFormPermissions(),
                    info: this.getFormInfo(),
                    data: this.getFormData(),
                    action: this.getFormAction()
                });
            },
            refreshFormConfig: function refreshFormConfig() {
                this.formConfig.setPermissions(this.getFormPermissions());
                this.formConfig.setInfo(this.getFormInfo());
            },

            parseMixinOptions: function parseMixinOptions() {
                _(this).extend(this.mixinOptions);
            },
            prepareForForm: function prepareForForm() {
                this.parseMixinOptions();
                this.formConfig = this.getFormConfig();
                this.defineBindings();
                this.prepareModelForForm();
            },
            defineBindings: function defineBindings() {
                var self = this;
                var data = self.formConfig.getDataJSON();
                var suffix = self.formConfig.getFieldDisplaySuffix();
                self.bindings = self.bindings || {};
                _(data.fields).each(function eachField(field) {
                    var attribute = field.attribute;
                    var attributeDisplay = attribute + suffix;
                    self.bindings['[name="' + attribute + '"]'] = attribute;
                    if (FormFieldType.isComplexType(field.type)) {
                        self.bindings['[name="' + attributeDisplay + '"]'] = attributeDisplay;
                    }
                });
            },
            prepareModelForForm: function prepareModelForForm() {
                FormMixinModel.add({
                    target: this.model,
                    noPrototype: true,
                    mixinOptions: {
                        formConfig: this.formConfig
                    }
                });
                this.model.prepareForForm();
            },

            saveFormUnlessView: function saveFormUnlessView(e) {
                if (!this.isView()) {
                    this.saveForm(e);
                }
            },

            isView: function isView() {
                return !this.isNew() && !this.isEdit();
            },

            /* ABSTRACT */
            getFormPermissions: function getFormPermissions() {
                throw new Error('Abstract method Form.getFormPermissions needs overriding.');
            },
            getFormInfo: function getFormInfo() {
                throw new Error('Abstract method Form.getTitle needs overriding.');
            },
            isNew: function isNew() {
                throw new Error('Abstract method Form.isNew needs overriding.');
            },
            isEdit: function isEdit() {
                throw new Error('Abstract method Form.isEdit needs overriding.');
            }
        }
    });
});
