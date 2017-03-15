define('Form.Actions.View', [
    'underscore',
    'Backbone',
    'form_actions.tpl'
], function FormActionsView(
    _,
    Backbone,
    formActionsTpl
) {
    'use strict';

    return Backbone.View.extend({

        template: formActionsTpl,

        initialize: function initialize(options) {
            this.config = options.config;
        },

        getContext: function getContext() {
            var config = this.config;
            var info = config.getInfo();
            var isNew = config.isNew();
            var isEdit = config.isEdit();
            var isView = config.isView();
            return {
                inHeader: this.options.inHeader,
                newUrl: info.newUrl,
                editUrl: info.editUrl,
                viewUrl: info.viewUrl,
                goBackUrl: info.goBackUrl,
                showCancelLink: isNew || isEdit,
                cancelUrl: isNew || isView ? info.goBackUrl : info.viewUrl,
                isNew: isNew,
                isEdit: isEdit,
                isView: isView
            };
        }

    });
});
