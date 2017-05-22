define('Form.Mixin.Model', [
    'underscore',
    'Utils',
    'Mixin',
    'Form.Field.Type'
], function FormMixinModel(
    _,
    Utils,
    Mixin,
    FormFieldType
) {
    'use strict';

    return new Mixin({

        extend: {
            prepareForForm: function prepareForForm(formConfig) {
                this.formConfig = formConfig;
                this.parseMixinOptions();
                this.mapListRecordFields();
                this.defineValidation();
            },
            parseMixinOptions: function parseMixinOptions() {
                _(this).extend(this.mixinOptions);
            },
            mapListRecordFields: function mapListRecordFields() {
                var self = this;
                var config = this.formConfig;
                var data = config.getDataJSON();
                var suffix = config.getFieldDisplaySuffix();
                if (!self.isParseWrapped) {
                    self.isParseWrapped = true;
                    self.parse = _(self.parse).wrap(function modelParseWrap(fn, dataModel) {
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
                var data = self.formConfig.getDataJSON();
                self.validation = self.validation || {};
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
                        self.validation[attribute] = _(self.validation[attribute] || {}).extend(validations);
                        if (type === 'lookup') {
                            self.validation[attribute + suffix] = _(self.validation[attribute + suffix] || {}).extend(validations);
                        }
                    }
                });
            },
            setAddAndNew: function setAddAndNew(value) {
                this.addAndNew = value;
            },
            isAddAndNew: function isAddAndNew() {
                return !!this.addAndNew;
            }
        }
    });
});
