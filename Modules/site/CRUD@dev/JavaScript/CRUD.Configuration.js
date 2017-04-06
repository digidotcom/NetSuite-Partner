define('CRUD.Configuration', [
    'underscore'
], function CrudConfiguration(
    _
) {
    'use strict';

    return {
        config: {},
        addSettings: function add(crudId, settings) {
            this.get(crudId).settings = settings;
        },
        getStatic: function configuration(crudId) {
            return {
                recordServiceUrl: 'services/CRUD.Record.Service.ss?id=' + crudId,
                lookupServiceUrl: 'services/CRUD.Lookup.Service.ss?id=' + crudId
            };
        },
        getCrudIds: function getCrudIds() {
            if (!this.crudIds) {
                this.crudIds = _.keys(SC.getPublishedObject('CrudConfiguration') || {});
            }
            return this.crudIds;
        },
        getAll: function getAll() {
            var self = this;
            var configurationPublished = SC.getPublishedObject('CrudConfiguration') || {};
            _(configurationPublished).each(function eachConfig(config, crudId) {
                self.get(crudId);
            });
            return this.config;
        },
        get: function get(crudId) {
            var configurationPublished;
            var configuration;
            if (!this.config[crudId]) {
                configurationPublished = SC.getPublishedObject('CrudConfiguration') || {};
                configuration = this.getStatic(crudId);
                this.config[crudId] = _.extend({}, configurationPublished[crudId] || {}, configuration);
            }
            return this.config[crudId];
        },
        getForForm: function getForForm(crudId) {
            return this.get(crudId);
        }
    };
});
