define('Form', [
    'underscore',
    'jQuery',
    'Utils',
    'Backbone.CompositeView',
    'Backbone.FormView',
    'Mixin',
    'Form.Field.Type',
    'Form.Config',
    'Form.View'
], function Form(
    _,
    jQuery,
    Utils,
    BackboneCompositeView,
    BackboneFormView,
    Mixin,
    FormFieldType,
    FormConfig,
    FormView
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
            getFormId: function getFormId() {
                var formId = this.formId;
                if (!formId) {
                    throw new Error('Form id not found in property "formId".');
                }
                return formId;
            },
            getFormConfig: function getFormConfig() {
                return new FormConfig({
                    application: this.application || this.options.application,
                    model: this.model,
                    permissions: this.getFormPermissions(),
                    info: this.getFormInfo(),
                    id: this.getFormId(),
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
                this.mapListRecordFields();
                this.defineValidation();
                this.defineBindings();
            },
            mapListRecordFields: function mapListRecordFields() {
                var model = this.model;
                var config = this.formConfig;
                var data = config.getDataJSON();
                var suffix = config.getFieldDisplaySuffix();
                if (!model.isParseWrapped) {
                    model.isParseWrapped = true;
                    model.parse = _(model.parse).wrap(function modelParseWrap(fn, dataModel) {
                        _(data.fields).each(function eachField(field) {
                            var value;
                            if (FormFieldType.isComplexType(field.type)) {
                                value = dataModel[field.attribute];
                                if (value && _(value).isObject()) {
                                    dataModel[field.attribute] = value.internalid;
                                    dataModel[field.attribute + suffix] = value.name;
                                }
                            }
                        });
                        return fn.apply(fn, _.union([dataModel], Array.prototype.slice.call(arguments, 2)));
                    });
                }
            },
            defineValidation: function defineValidations() {
                var self = this;
                var model = this.model;
                var data = this.formConfig.getDataJSON();
                model.validation = model.validation || {};
                _(data.fields).each(function eachField(field) {
                    var suffix = self.formConfig.getFieldDisplaySuffix();
                    var attribute = field.attribute;
                    var required = field.required;
                    var inline = field.inline;
                    var type = field.type;
                    var validations = {};
                    if (!inline) {
                        if (required) {
                            _(validations).extend({
                                required: true,
                                msg: Utils.translate('$(0) is required.', field.label)
                            });
                        }
                        if (type === 'email') {
                            _(validations).extend({
                                pattern: 'email',
                                msg: Utils.translate('Valid email is required.')
                            });
                        } else if (type === 'phone') {
                            _(validations).extend({
                                fn: function validatePhone(phone) {
                                    if (!required && !phone) {
                                        return null;
                                    }
                                    return Utils.validatePhone(phone);
                                }
                            });
                        }
                    }
                    if (_(validations).size() > 0) {
                        model.validation[attribute] = _(model.validation[attribute] || {}).extend(validations);
                        if (type === 'lookup') {
                            model.validation[attribute + suffix] = _(model.validation[attribute + suffix] || {}).extend(validations);
                        }
                    }
                });
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
            },

            saveFormUnlessView: function saveFormUnlessView(e) {
                if (!this.isView()) {
                    this.saveForm(e);
                }
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
