define('CRUD.Configuration', [
    'underscore',
    'jQuery'
], function CrudConfiguration(
    _,
    jQuery
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
        getPublishedAll: function getPublished() {
            var publishedPublic;
            var published;
            if (!this.published) {
                publishedPublic = SC.getPublishedObject('CrudConfigurationPublic') || {};
                published = SC.getPublishedObject('CrudConfiguration') || {};
                this.published = jQuery.extend(true, {}, publishedPublic, published);
            }
            return this.published;
        },
        getPublished: function getPublished(crudId) {
            var published = this.getPublishedAll();
            return published[crudId] || {};
        },
        getCrudIds: function getCrudIds() {
            if (!this.crudIds) {
                this.crudIds = _.keys(this.getPublishedAll());
            }
            return this.crudIds;
        },
        get: function get(crudId) {
            var published;
            var configuration;
            if (!this.config[crudId]) {
                published = this.getPublished(crudId);
                configuration = this.getStatic(crudId);
                this.config[crudId] = jQuery.extend(true, {}, published, configuration);
            }
            return this.config[crudId];
        },
        getAll: function getAll() {
            var self = this;
            _(this.getCrudIds()).each(function eachConfig(crudId) {
                self.get(crudId);
            });
            return this.config;
        },
        getForForm: function getForForm(crudId) {
            return this.get(crudId);
        }
    };
});
