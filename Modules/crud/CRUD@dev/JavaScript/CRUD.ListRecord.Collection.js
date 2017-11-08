define('CRUD.ListRecord.Collection', [
    'Backbone',
    'CRUD.Helper',
    'CRUD.ListRecord.Model'
], function CrudListRecordCollection(
    Backbone,
    CrudHelper,
    CrudListRecordModel
) {
    'use strict';

    return Backbone.CachedCollection.extend({

        model: CrudListRecordModel,

        initialize: function initialize(elements, options) {
            this.crudId = options.crudId;
            this.listIds = options.listIds;
            this.setUrl();
        },

        setUrl: function setUrl() {
            this.url = CrudHelper.getListServiceUrl(this.crudId, this.listIds, true);
        }

    });
});
