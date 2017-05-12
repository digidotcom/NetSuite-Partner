define('CRUD.Record.List.Collection', [
    'Backbone',
    'CRUD.Helper',
    'CRUD.Record.List.Model'
], function CrudRecordListCollection(
    Backbone,
    CrudHelper,
    CrudRecordListModel
) {
    'use strict';

    return Backbone.Collection.extend({

        model: CrudRecordListModel,

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
