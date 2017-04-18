define('CRUD.Bootstrapping', [
    'Models.Init',
    'Configuration'
], function CrudBootstrapping(
    ModelsInit,
    Configuration
) {
    'use strict';

    return {
        run: function runBootstrapping() {
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
        }
    };
});
