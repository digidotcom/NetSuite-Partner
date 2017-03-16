define('Form.Field.View', [
    'Backbone',
    'Form.Field.Type',
    'form_field.tpl',
    'form_field_text.tpl',
    'form_field_longtext.tpl',
    'form_field_list.tpl',
    'form_field_lookup.tpl'
], function FormFieldView(
    Backbone,
    FormFieldType,
    formFieldTpl
) {
    'use strict';

    return Backbone.View.extend({

        template: formFieldTpl,

        initialize: function initialize(options) {
            this.config = options.config;
            this.setupType();
        },

        setupType: function parseType() {
            var typeStr = this.model.get('type');
            var type = new FormFieldType(typeStr);
            this.type = type;
            this.template = type.getTemplate();
        },

        getContext: function getContext() {
            var model = this.model;
            var config = this.config;
            var type = this.type;
            var formModel = config.model;
            var attribute = model.get('attribute');
            var isNew = config.isNew();
            return {
                model: model,
                type: model.get('type'),
                inputType: type.getInputType(),
                attribute: model.get('attribute'),
                label: model.get('label'),
                isRequired: !!model.get('required'),
                tooltip: model.get('tooltip'),
                help: model.get('help'),
                isNew: config.isNew(),
                isEdit: config.isEdit(),
                isView: config.isView(),
                value: isNew ? null : formModel.get(attribute)
            };
        }

    });
});
