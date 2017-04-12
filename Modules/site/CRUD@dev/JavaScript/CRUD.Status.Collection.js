define('CRUD.Status.Collection', [
    'Backbone',
    'CRUD.Helper',
    'CRUD.Status.Model'
], function CrudStatusCollection(
    Backbone,
    CrudHelper,
    CrudStatusModel
) {
    'use strict';

    return Backbone.CachedCollection.extend({

        model: CrudStatusModel,

        initialize: function initialize(elements, options) {
            this.crudId = options.crudId;
            this.setUrl();
        },

        setUrl: function setUrl() {
            this.url = CrudHelper.getStatusServiceUrl(this.crudId, true);
        }

    });
});
