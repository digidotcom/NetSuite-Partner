define('CRUD', [
    'CRUD.Settings',
    'CRUD.Record.ServiceController',
    'CRUD.Lookup.ServiceController'
], function Crud(
    CrudSettings
) {
    'use strict';

    return {
        add: function add(id, config) {
            CrudSettings.add(id, config);
        }
    };
});
