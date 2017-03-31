define('CRUD.Lookup.ServiceController', [
    'underscore',
    'ServiceController',
    'CRUD.Utils'
], function CrudLookupServiceController(
    _,
    ServiceController,
    CrudUtils
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
            var query = this.request.getParameter('q');

            CrudUtils.validateCrudId(crudId);

            return [
                {
                    query: query
                }
            ];
        }
    });
});
