define('CRUD.Record.List.Actions.View', [
    'underscore',
    'Backbone',
    'CRUD.Helper',
    'crud_list_actions.tpl'
], function CrudRecordListActionsView(
    _,
    Backbone,
    CrudHelper,
    crudListActionsTpl
) {
    'use strict';

    return Backbone.View.extend({

        template: crudListActionsTpl,

        events: {},

        initialize: function initialize(options) {
            this.crudId = options.crudId;
            this.parent = options.parent;
            this.parentModel = options.parentModel;
        },

        getContext: function getContext() {
            var crudId = this.crudId;
            var permissions = CrudHelper.getPermissions(crudId, this.parentModel);
            var record = this.model.get('record');
            var parentId = this.parent;
            if (record && record.get('internalid')) {
                return {
                    isEditEnabled: permissions.update && CrudHelper.isEditEnabledForModel(crudId, record),
                    editUrl: CrudHelper.getEditUrl(crudId, record.get('internalid'), parentId)
                };
            }
            return {};
        }
    });
});
