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
            this.separateHiddenFields();
            BackboneCompositeView.add(this);
        },

        separateHiddenFields: function separateHiddenFields() {
            var isNew = this.config.isNew();
            this.fieldsHidden = this.fields.filter(function filterFields(field) {
                return field.isHiddenType();
            });
            this.fieldsVisible = this.fields.reject(function filterFields(field) {
                return field.isHiddenType() || (isNew && field.isInline());
            });
        },

        childViews: {
            'Form.Fields.Hidden': function FormGroupFields() {
                return new FormFieldsView({
                    config: this.config,
                    viewsPerRow: 0,
                    fields: this.fieldsHidden,
                    isHidden: true
                });
            },
            'Form.Fields': function FormGroupFields() {
                return new FormFieldsView({
                    config: this.config,
                    viewsPerRow: this.model.get('columns') || 2,
                    fields: this.fieldsVisible
                });
            }
        },

        getContext: function getContext() {
            var model = this.model;
            var isMainGroup = !model.get('name');
            var hasVisibleFields = this.fieldsVisible.length > 0;
            return {
                showContent: this.config.canAccess(),
                id: model.get('id'),
                name: model.get('name'),
                hideTitle: isMainGroup || !hasVisibleFields,
                hasHiddenFields: this.fieldsHidden.length > 0,
                hasVisibleFields: hasVisibleFields
            };
        }

    });
});
