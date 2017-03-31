define('CRUD', [
    'Configuration',
    'CRUD.Configuration',
    'CRUD.Record.ServiceController'
], function Crud(
    Configuration,
    CrudConfiguration
) {
    'use strict';

    Configuration.publish.push({
        key: 'CrudConfiguration',
        model: 'CRUD.Configuration',
        call: 'getForBootstrapping'
    });

    return {
        add: function add(id, config) {
            CrudConfiguration.add(id, config);
        }
    };
});
