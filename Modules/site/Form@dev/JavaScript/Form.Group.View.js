define('Form.Group.View', [
    'Backbone',
    'Backbone.CompositeView',
    'Form.Fields.View',
    'form_group.tpl'
], function FormGroupView(
    Backbone,
    BackboneCompositeView,
    FormFieldsView,
    formGroupTpl
) {
    'use strict';

    return Backbone.View.extend({

        template: formGroupTpl,

        initialize: function initialize(options) {
            this.config = options.config;
            this.fields = this.model.get('fields');
            BackboneCompositeView.add(this);
        },

        childViews: {
            'Form.Fields': function FormGroupFields() {
                return new FormFieldsView({
                    config: this.config,
                    fields: this.fields
                });
            }
        },

        getContext: function getContext() {
            return {
                id: this.model.get('id'),
                name: this.model.get('name')
            };
        }

    });
});
