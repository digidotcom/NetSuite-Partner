define('Form.Info.View', [
    'underscore',
    'Backbone',
    'Backbone.CompositeView',
    'Form.Actions.View',
    'form_info.tpl'
], function FormInfoView(
    _,
    Backbone,
    BackboneCompositeView,
    FormActionsView,
    formActionsTpl
) {
    'use strict';

    return Backbone.View.extend({

        template: formActionsTpl,

        initialize: function initialize(options) {
            this.config = options.config;
            BackboneCompositeView.add(this);
        },

        childViews: {
            'Form.Actions': function FormActions() {
                return new FormActionsView({
                    config: this.config,
                    inHeader: true
                });
            }
        },

        getContext: function getContext() {
            var config = this.config;
            var info = config.getInfo();
            return {
                showContent: this.config.canAccess(),
                isLoading: this.config.isLoading(),
                title: info.title,
                description: info.description
            };
        }

    });
});
