define('Form.Actions.View', [
    'underscore',
    'Backbone',
    'jQuery',
    'Utils',
    'Form.Action',
    'form_actions.tpl'
], function FormActionsView(
    _,
    Backbone,
    jQuery,
    Utils,
    FormAction,
    formActionsTpl
) {
    'use strict';

    return Backbone.View.extend({

        template: formActionsTpl,

        events: {
            'click [data-add-and-new]': 'clickAddAndNew',
            'click [data-action]': 'clickCustomAction'
        },

        initialize: function initialize(options) {
            this.config = options.config;
        },

        clickAddAndNew: function clickAddAndNew() {
            this.config.model.setAddAndNew(true);
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
        getDefaultActionsLabels: function getDefaultActionsLabels() {
            return {
                edit: Utils.translate('Edit'),
                viewAll: Utils.translate('View All'),
                addAndNew: Utils.translate('Add & New'),
                add: Utils.translate('Add'),
                save: Utils.translate('Save'),
                cancel: Utils.translate('Cancel')
            };
        },
        getActionsLabels: function getActionsLabels() {
            var defaultLabels = this.getDefaultActionsLabels();
            var info = this.config.getInfo();
            var labels = _({}).extend(info.actionLabels || {});
            _.defaults(labels, defaultLabels);
            return labels;
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
            var showAddButton = (isNew && canCreate);
            return {
                showContent: config.canAccess(),
                inHeader: this.options.inHeader,
                newUrl: info.newUrl,
                editUrl: info.editUrl,
                viewUrl: info.viewUrl,
                viewAllUrl: info.goBackUrl,
                actionsLabels: this.getActionsLabels(),
                customActions: info.customActions,
                showEditLink: (isView && canEdit),
                showViewAllLink: (isView && canList),
                showAddButton: showAddButton,
                showAddAndNewButton: showAddButton,
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
