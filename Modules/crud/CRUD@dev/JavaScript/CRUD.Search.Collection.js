define('CRUD.Search.Collection', [
    'underscore',
    'Backbone',
    'CRUD.Helper',
    'CRUD.Search.Model'
], function CrudSearchCollection(
    _,
    Backbone,
    CrudHelper,
    CrudSearchModel
) {
    'use strict';

    return Backbone.Collection.extend({

        model: CrudSearchModel,

        initialize: function initialize(elements, options) {
            this.crudIds = (options && options.crudIds && options.crudIds.length > 0) || CrudHelper.getSearchableIds();
            this.query = (options && options.query) || null;
            this.setUrl();
        },

        setUrl: function setUrl() {
            this.url = CrudHelper.getSearchServiceUrl(this.crudIds, this.query, true);
        },

        update: function update(options) {
            if (this.query) {
                this.fetch({
                    reset: true,
                    killerId: options.killerId
                });
            }
        }

    });
});
