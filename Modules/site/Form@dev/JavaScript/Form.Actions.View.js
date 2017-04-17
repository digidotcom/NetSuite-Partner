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
