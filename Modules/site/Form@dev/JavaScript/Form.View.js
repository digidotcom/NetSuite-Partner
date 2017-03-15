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

        childViews: {
            'Form.Fieldset': function FormFields() {
                return new FormFieldsetView({
                    config: this.config
                });
            }
        },

        getContext: function getContext() {
            var config = this.config;
            return {
                isNew: config.isNew(),
                isEdit: config.isEdit(),
                isView: config.isView()
            };
        }

    });
});
