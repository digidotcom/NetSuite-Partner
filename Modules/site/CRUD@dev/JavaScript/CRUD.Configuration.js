define('CRUD.Configuration', [
], function CrudConfiguration(
) {
    'use strict';

    return {
        getForForm: function getForForm(crudId) {
            var crudConfigurationPublished = SC.getPublishedObject('CrudConfiguration') || {};
            return crudConfigurationPublished[crudId] || {};
        }
    };
});
