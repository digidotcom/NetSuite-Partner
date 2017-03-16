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

    function FormFieldType(type) {
        this.type = type;
        this.initialize();
    }

    _(FormFieldType.prototype).extend({

        initialize: function initialize() {
            this.template = this.getTemplate();
        },

        getTemplate: function parseType() {
            switch (this.type) {
            case 'text':
            case 'email':
            case 'tel':
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
            case 'tel':
            case 'email':
                return 'text';
            default:
                return this.type;
            }
        }

    });

    return FormFieldType;
});
