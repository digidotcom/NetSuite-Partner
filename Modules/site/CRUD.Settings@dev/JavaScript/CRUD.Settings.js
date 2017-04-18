define('CRUD.Settings', [
    'CRUD.Configuration',
    'CRUD.Helper'
], function CrudSettings(
    CrudConfiguration,
    CrudHelper
) {
    'use strict';

    return {
        Configuration: CrudConfiguration,
        Helper: CrudHelper,

        add: function add(crudId, settings) {
            CrudConfiguration.addSettings(crudId, settings || {});
        }
    };
});
