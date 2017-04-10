define('CRUD.List.Actions.View', [
    'underscore',
    'Backbone',
    'CRUD.Helper',
    'crud_list_actions.tpl'
], function CrudListActionsView(
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
        },

        getContext: function getContext() {
            var crudId = this.crudId;
            var permissions = CrudHelper.getPermissions(crudId);
            var record = this.model.get('record');
            if (record && record.get('internalid')) {
                return {
                    isEditEnabled: permissions.update && record.get('statusAllowsEdit'),
                    editUrl: CrudHelper.getEditUrl(crudId, record.get('internalid'))
                };
            }
            return {};
        }
    });
});
