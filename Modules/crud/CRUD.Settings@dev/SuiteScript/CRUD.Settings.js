define('CRUD.Settings', [
    'CRUD.Bootstrapping',
    'CRUD.Configuration'
], function CrudSettings(
    CrudBootstrapping,
    CrudConfiguration
) {
    'use strict';

    CrudBootstrapping.run();

    return {
        add: function add(id, config) {
            CrudConfiguration.add(id, config);
        },
        addList: function addList(id, config) {
            CrudConfiguration.addList(id, config);
        }
    };
});
