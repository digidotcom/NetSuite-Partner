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
            return {
                type: this.model.get('type'),
                attribute: this.model.get('attribute'),
                label: this.model.get('label')
            };
        }

    });
});
