define('CRUD.Configuration', [
    'underscore'
], function CrudConfiguration(
    _
) {
    'use strict';

    return {
        config: {},
        configuration: function configuration(crudId) {
            return {
                recordServiceUrl: 'services/CRUD.Lookup.Service.ss?id=' + crudId,
                lookupServiceUrl: 'services/CRUD.Lookup.Service.ss?id=' + crudId
            };
        },
        get: function get(crudId) {
            var crudConfigurationPublished = SC.getPublishedObject('CrudConfiguration');
            var configuration = this.config[crudId];
            if (!configuration) {
                configuration = this.configuration(crudId);
                this.config[crudId] = configuration;
            }
            return _.extend({}, crudConfigurationPublished[crudId] || {}, configuration);
        },
        getForForm: function getForForm(crudId) {
            return this.get(crudId);
        }
    };
});
