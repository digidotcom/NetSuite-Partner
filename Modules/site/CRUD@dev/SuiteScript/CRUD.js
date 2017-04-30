define('CRUD', [
    'CRUD.Settings',
    'CRUD.Record.ServiceController',
    'CRUD.Lookup.ServiceController',
    'CRUD.List.ServiceController'
], function Crud(
    CrudSettings
) {
    'use strict';

    return {
        add: function add(id, config) {
            CrudSettings.add(id, config);
        },
        addList: function addList(id, config) {
            CrudSettings.addList(id, config);
        }
    };
});
