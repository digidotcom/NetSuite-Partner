define('CRUD', [
    'Models.Init',
    'Configuration',
    'CRUD.Configuration',
    'CRUD.Record.ServiceController',
    'CRUD.Lookup.ServiceController'
], function Crud(
    ModelsInit,
    Configuration,
    CrudConfiguration
) {
    'use strict';

    Configuration.publish.push({
        key: 'CrudConfigurationPublic',
        model: 'CRUD.Configuration',
        call: 'getForBootstrappingPublic'
    });

    if ((request.getURL().indexOf('https') >= 0) && ModelsInit.session.isLoggedIn2()) {
        Configuration.publish.push({
            key: 'CrudConfiguration',
            model: 'CRUD.Configuration',
            call: 'getForBootstrappingPrivate'
        });
    }

    return {
        add: function add(id, config) {
            CrudConfiguration.add(id, config);
        }
    };
});
