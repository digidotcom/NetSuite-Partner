define('CRUD.Lookup.ServiceController', [
    'ServiceController',
    'CRUD.Utils',
    'CRUD.Lookup.Model'
], function CrudLookupServiceController(
    ServiceController,
    CrudUtils,
    CrudLookupModel
) {
    'use strict';

    return ServiceController.extend({
        name: 'CRUD.Lookup.ServiceController',

        options: {
            common: {
                requireSecure: true,
                requireLogin: true
            }
        },

        get: function get() {
            var crudId = this.request.getParameter('id');
            var field = this.request.getParameter('field');
            var query = this.request.getParameter('q');

            var data = {
                field: field,
                query: query
            };

            CrudUtils.validateCrudId(crudId);

            return CrudLookupModel.get(crudId, data);
        }
    });
});
