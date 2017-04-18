define('CRUD.Settings', [
    'CRUD.Bootstrapping',
    'CRUD.Configuration'
], function Crud(
    CrudBootstrapping,
    CrudConfiguration
) {
    'use strict';

    CrudBootstrapping.run();

    return {
        add: function add(id, config) {
            CrudConfiguration.add(id, config);
        }
    };
});
