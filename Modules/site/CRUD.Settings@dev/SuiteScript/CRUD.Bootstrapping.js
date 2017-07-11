define('CRUD.Bootstrapping', [
    'Models.Init',
    'Configuration',
    'Publish'
], function CrudBootstrapping(
    ModelsInit,
    Configuration,
    Publish
) {
    'use strict';

    return {
        run: function runBootstrapping() {
            Publish.sessionPublish({
                key: 'CrudConfigurationPublic',
                model: 'CRUD.Configuration',
                call: 'getForBootstrappingPublic'
            });

            if ((request.getURL().indexOf('https') >= 0) && ModelsInit.session.isLoggedIn2()) {
                Publish.sessionPublish({
                    key: 'CrudConfiguration',
                    model: 'CRUD.Configuration',
                    call: 'getForBootstrappingPrivate'
                });
            }
        }
    };
});
