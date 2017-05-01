define('CRUD', [
    'CRUD.Settings',
    'CRUD.Record.ServiceController',
    'CRUD.Lookup.ServiceController',
    'CRUD.Action.ServiceController'
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
