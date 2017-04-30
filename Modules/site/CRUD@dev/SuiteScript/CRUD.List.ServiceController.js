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
            var crudId = this.request.getParameter('id');

            CrudUtils.validateCrudId(crudId);

            if (CrudUtils.isAllowed(crudId, 'list')) {
                return CrudListModel.list(crudId);
            }
            return null;
        }
    });
});
