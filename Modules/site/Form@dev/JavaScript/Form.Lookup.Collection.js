define('Form.Lookup.Collection', [
    'Backbone',
    'Form.Lookup.Model'
], function FormLookupCollection(
    Backbone,
    FormLookupModel
) {
    'use strict';

    return Backbone.CachedCollection.extend({

        model: FormLookupModel,

        initialize: function initialize(data, options) {
            this.config = options.config;
            this.setUrl();
        },

        setUrl: function setUrl() {
            this.url = this.config.getData().lookupServiceUrl;
        }

    });
});
