define('Form.Lookup.Collection', [
    'Backbone',
    'Form.Lookup.Model'
], function FormLookupCollection(
    Backbone,
    FormLookupModel
) {
    'use strict';

    return Backbone.Collection.extend({

        model: FormLookupModel,

        initialize: function initialize(data, options) {
            this.config = options.config;
            this.query = options.query;
            this.setUrl();
        },

        setUrl: function setUrl() {
            var url = this.config.getData().lookupServiceUrl;
            url += (url.indexOf('?') >= 0) ? '&' : '?';
            url += 'q=' + encodeURIComponent(this.query);
            this.url = url;
        }

    });
});
