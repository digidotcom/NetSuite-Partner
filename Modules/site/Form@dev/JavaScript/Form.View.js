define('Form.View', [
    'underscore',
    'Backbone',
    'Backbone.CompositeView',
    'Form.Body.View',
    'form.tpl'
], function FormView(
    _,
    Backbone,
    BackboneCompositeView,
    FormBodyView,
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
            'Form.Body': function FormFields() {
                return new FormBodyView({
                    config: this.config
                });
            }
        },

        getContext: function getContext() {
            var config = this.config;
            var info = config.getInfo();
            return {
                title: info.title,
                description: info.description,
                isNew: config.isNew(),
                isEdit: config.isEdit(),
                isView: config.isView()
            };
        }

    });
});
