define('Form.View', [
    'underscore',
    'Backbone',
    'Backbone.CompositeView',
    'Form.Info.View',
    'Form.Body.View',
    'Form.Actions.View',
    'form.tpl'
], function FormView(
    _,
    Backbone,
    BackboneCompositeView,
    FormInfoView,
    FormBodyView,
    FormActionsView,
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
            'Form.Info': function FormFields() {
                return new FormInfoView({
                    config: this.config
                });
            },
            'Form.Body': function FormFields() {
                return new FormBodyView({
                    config: this.config
                });
            },
            'Form.Actions': function FormFields() {
                return new FormActionsView({
                    config: this.config
                });
            }
        },

        getContext: function getContext() {
            return {
                showContent: this.config.canAccess()
            };
        }

    });
});
