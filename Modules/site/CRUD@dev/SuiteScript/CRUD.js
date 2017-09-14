define('CRUD', [
    'CRUD.Settings',
    'CRUD.Action.ServiceController',
    'CRUD.List.ServiceController',
    'CRUD.Lookup.ServiceController',
    'CRUD.Record.ServiceController',
    'CRUD.Search.ServiceController'
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
