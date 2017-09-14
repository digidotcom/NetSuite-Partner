define('CRUD.Search.ServiceController', [
    'underscore',
    'ServiceController',
    'CRUD.Utils',
    'CRUD.Search.Model'
], function CrudSearchServiceController(
    _,
    ServiceController,
    CrudUtils,
    CrudSearchModel
) {
    'use strict';

    return ServiceController.extend({
        name: 'CRUD.Search.ServiceController',

        options: {
            common: {
                requireSecure: true,
                requireLogin: true
            }
        },

        get: function get() {
            var query = this.request.getParameter('q');
            return CrudSearchModel.search(query);
        }
    });
});
