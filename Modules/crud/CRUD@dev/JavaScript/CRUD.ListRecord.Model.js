define('CRUD.ListRecord.Model', [
    'Backbone',
    'CRUD.Helper'
], function CrudListRecordModel(
    Backbone,
    CrudHelper
) {
    'use strict';

    return Backbone.CachedModel.extend({

        initialize: function initialize(attributes) {
            this.crudId = attributes.crudId;
            this.listIds = attributes.listIds;
            this.setUrlRoot();
        },

        setUrlRoot: function setUrlRoot() {
            this.urlRoot = CrudHelper.getListServiceUrl(this.crudId || this.get('crudId'), this.listIds || this.get('listIds'));
        }

    });
});
