define('CRUD.Lookup.Collection', [
    'Backbone',
    'CRUD.Configuration',
    'CRUD.Lookup.Model'
], function CrudLookupCollection(
    Backbone,
    CrudConfiguration,
    CrudLookupModel
) {
    'use strict';

    return Backbone.Collection.extend({

        model: CrudLookupModel,

        initialize: function initialize(data, options) {
            this.configuration = CrudConfiguration.get(options.crudId);
            this.setUrl();
        },

        setUrl: function setUrl() {
            this.url = this.configuration.lookupServiceUrl;
        }

    });
});
