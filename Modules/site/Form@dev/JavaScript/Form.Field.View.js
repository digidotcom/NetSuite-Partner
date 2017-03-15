define('Form.Field.View', [
    'Backbone',
    'form_field.tpl'
], function FormFieldView(
    Backbone,
    formFieldTpl
) {
    'use strict';

    return Backbone.View.extend({

        template: formFieldTpl,

        initialize: function initialize(options) {
            this.config = options.config;
        },

        getContext: function getContext() {
            var model = this.model;
            return {
                model: model,
                type: model.get('type'),
                attribute: model.get('attribute'),
                label: model.get('label'),
                isRequired: !!model.get('required'),
                tooltip: model.get('tooltip'),
                help: model.get('help')
            };
        }

    });
});
