define('CRUD', [
    'CRUD.Configuration',
    'CRUD.Helper',
    'CRUD.Router'
], function Crud(
    CrudConfiguration,
    CrudHelper,
    CrudRouter
) {
    'use strict';

    return {
        MenuItems: CrudHelper.getMenuItemsAll(),

        add: function add(crudId, settings) {
            CrudConfiguration.addSettings(crudId, settings);
        },

        mountToApp: function mountToApp(application) {
            return new CrudRouter(application);
        }
    };
});
