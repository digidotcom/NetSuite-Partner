define('Form.Field.View', [
    'underscore',
    'Backbone',
    'Form.Field.Type',
    'form_field.tpl',
    'form_field_text.tpl',
    'form_field_longtext.tpl',
    'form_field_list.tpl',
    'form_field_lookup.tpl'
], function FormFieldView(
    _,
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
            var type = new FormFieldType({
                model: this.model,
                config: this.config
            });
            this.type = type;
            this.template = type.getTemplate();
        },

        getContext: function getContext() {
            var model = this.model;
            var config = this.config;
            var type = this.type;
            var formModel = config.model;
            var attribute = model.get('attribute');
            var isInline = !!model.get('inline');
            var isNew = config.isNew();
            var isEdit = config.isEdit();
            var isView = config.isView();
            var context = {
                model: model,
                type: model.get('type'),
                attribute: model.get('attribute'),
                label: model.get('label'),
                isInline: isInline,
                isRequired: !!model.get('required'),
                tooltip: model.get('tooltip'),
                help: model.get('help'),
                isNew: isNew,
                isEdit: isEdit,
                isView: isView,
                showInline: isInline || isView,
                isInlineEmpty: isInline && isNew,
                value: isNew ? null : formModel.get(attribute)
            };
            return _.extend(context, type.getContextAdditions());
        }

    });
});
