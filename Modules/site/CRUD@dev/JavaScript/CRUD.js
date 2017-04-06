define('CRUD', [
    'CRUD.Configuration',
    'CRUD.Router'
], function Registration(
    CrudConfiguration,
    CrudRouter
) {
    'use strict';

    return {
        add: function add(crudId, settings) {
            CrudConfiguration.addSettings(crudId, settings);
        },

        mountToApp: function mountToApp(application) {
            return new CrudRouter(application);
        }
    };
});
