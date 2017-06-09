define('CRUD', [
    'CRUD.Settings',
    'CRUD.Helper',
    'CRUD.Router'
], function Crud(
    CrudSettings,
    CrudHelper,
    CrudRouter
) {
    'use strict';

    return {
        MenuItems: CrudHelper.getMenuItemsAll(),

        add: function add(crudId, settings) {
            CrudSettings.add(crudId, settings || {});
        },

        mountToApp: function mountToApp(application) {
            return new CrudRouter(application);
        }
    };
});
