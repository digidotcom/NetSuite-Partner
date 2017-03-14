define('Form.View', [
    'underscore',
    'Backbone',
    'Backbone.CompositeView',
    'Form.Fieldset.View',
    'form.tpl'
], function FormView(
    _,
    Backbone,
    BackboneCompositeView,
    FormFieldsetView,
    formTpl
) {
    'use strict';

    return Backbone.View.extend({

        template: formTpl,

        initialize: function initialize(options) {
            this.config = options.config;
            BackboneCompositeView.add(this);
        },

        getGroups: function getFields() {
            var config = this.config;
            var groups = config.groups;
            var fields = config.fields;
            _(groups).each(function eachFn(group) {
                group.fields = _(fields).where({
                    group: group.id
                });
            });
            return this.config.groups;
        },

        childViews: {
            'Form.Fieldset': function FormFields() {
                return new FormFieldsetView({
                    groups: this.getGroups()
                });
            }
        }

    });
});
