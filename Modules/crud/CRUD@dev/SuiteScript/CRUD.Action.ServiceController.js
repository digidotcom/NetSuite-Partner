define('CRUD.Action.ServiceController', [
    'ServiceController',
    'CRUD.Utils',
    'CRUD.Action.Model'
], function CrudActionServiceController(
    ServiceController,
    CrudUtils,
    CrudActionModel
) {
    'use strict';

    return ServiceController.extend({
        name: 'CRUD.Action.ServiceController',

        options: {
            common: {
                requireSecure: true,
                requireLogin: true
            }
        },

        get: function get() {
            var crudId = this.request.getParameter('id');
            var id = this.request.getParameter('internalid');
            var action = this.request.getParameter('action');

            CrudUtils.validateCrudId(crudId);
            CrudUtils.validateId(id);

            return CrudActionModel.run(crudId, id, action);
        }
    });
});
