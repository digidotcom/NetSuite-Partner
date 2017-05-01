define('Form.Actions.View', [
    'underscore',
    'Backbone',
    'jQuery',
    'Form.Action',
    'form_actions.tpl'
], function FormActionsView(
    _,
    Backbone,
    jQuery,
    FormAction,
    formActionsTpl
) {
    'use strict';

    return Backbone.View.extend({

        template: formActionsTpl,

        events: {
            'click [data-action]': 'clickCustomAction'
        },

        initialize: function initialize(options) {
            this.config = options.config;
        },

        clickCustomAction: function clickCustomAction(e) {
            var action = jQuery(e.currentTarget).data('action');
            if (action) {
                this.runCustomAction(action);
            }
        },
        runCustomAction: function runAction(actionName) {
            var action = new FormAction({
                view: this,
                action: actionName,
                application: this.config.application,
                config: this.config
            });
            action.run();
        },

        getContext: function getContext() {
            var config = this.config;
            var info = config.getInfo();
            var isNew = config.isNew();
            var isEdit = config.isEdit();
            var isView = config.isView();
            var canList = config.canList();
            var canCreate = config.canCreate();
            var canView = config.canView();
            var canEdit = config.canEdit();
            return {
                showContent: config.canAccess(),
                inHeader: this.options.inHeader,
                newUrl: info.newUrl,
                editUrl: info.editUrl,
                viewUrl: info.viewUrl,
                viewAllUrl: info.goBackUrl,
                customActions: info.customActions,
                showEditLink: (isView && canEdit),
                showViewAllLink: (isView && canList),
                showAddButton: (isNew && canCreate),
                showSaveButton: (isEdit && canEdit),
                showCancelLink: (isNew && canList) || (isEdit && canView),
                cancelUrl: isNew || isView ? info.goBackUrl : info.viewUrl,
                isNew: isNew,
                isEdit: isEdit,
                isView: isView,
                canList: canList,
                canCreate: canCreate,
                canView: canView,
                canEdit: canEdit
            };
        }

    });
});
