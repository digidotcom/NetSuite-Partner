define('CRUD.List.ServiceController', [
    'underscore',
    'ServiceController',
    'CRUD.Utils',
    'CRUD.List.Model'
], function CrudListServiceController(
    _,
    ServiceController,
    CrudUtils,
    CrudListModel
) {
    'use strict';

    return ServiceController.extend({
        name: 'CRUD.List.ServiceController',

        options: {
            common: {
                requireSecure: true,
                requireLogin: true
            }
        },

        get: function get() {
            var crudIdsStr = this.request.getParameter('ids');
            var crudIds = (crudIdsStr && crudIdsStr.split(',')) || [];
            var lists = [];

            CrudUtils.validateCrudIds(crudIds);

            _(crudIds).each(function eachCrudId(crudId) {
                var values;
                if (CrudUtils.isAllowed(crudId, 'list')) {
                    values = CrudListModel.list(crudId);
                    lists.push({
                        name: crudId,
                        values: values
                    });
                }
            });

            return lists;
        }
    });
});
