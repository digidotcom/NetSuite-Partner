define('Form.Field.Type', [
    'underscore',
    'form_field.tpl',
    'form_field_text.tpl',
    'form_field_longtext.tpl',
    'form_field_list.tpl',
    'form_field_lookup.tpl'
], function FormFieldTypeModule(
    _,
    formFieldTpl,
    formFieldTextTpl,
    formFieldLongTextTpl,
    formFieldListTpl,
    formFieldLookupTpl
) {
    'use strict';

    function FormFieldType(options) {
        this.model = options.model;
        this.config = options.config;
        this.initialize();
    }

    _(FormFieldType.prototype).extend({

        initialize: function initialize() {
            this.type = this.model.get('type');
            this.template = this.getTemplate();
        },

        getTemplate: function parseType() {
            switch (this.type) {
            case 'text':
            case 'email':
            case 'phone':
            case 'number':
            case 'url':
            case 'date':
                return formFieldTextTpl;
            case 'longtext':
                return formFieldLongTextTpl;
            case 'list':
                return formFieldListTpl;
            case 'lookup':
                return formFieldLookupTpl;
            default:
                return formFieldTpl;
            }
        },

        getInputType: function getInputType() {
            switch (this.type) {
            case 'phone':
            case 'email':
                return 'text';
            default:
                return this.type;
            }
        },

        getContextAdditions: function getContextAdditions() {
            var modelForm = this.config.model;
            var modelField = this.model;
            var fieldValue = modelForm.get(modelField.get('attribute'));
            var context = {
                inputType: this.getInputType()
            };
            if (fieldValue) {
                switch (this.type) {
                case 'list':
                case 'lookup':
                    context.nameFieldSuffix = this.config.getFieldDisplaySuffix();
                    context.selectedValue = fieldValue.internalid;
                    context.selectedName = fieldValue.name;
                    break;
                default:
                    context.value = fieldValue;
                }
            }
            return context;
        }

    });

    FormFieldType.isComplexType = function isComplexType(type) {
        switch (type) {
        case 'list':
        case 'lookup':
            return true;
        default:
            return false;
        }
    };

    return FormFieldType;
});
