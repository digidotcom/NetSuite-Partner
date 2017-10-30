define('CRUD.Record.Model', [
    'Backbone',
    'CRUD.Helper'
], function CrudRecordModel(
    Backbone,
    CrudHelper
) {
    'use strict';

    return Backbone.Model.extend({

        initialize: function initialize(attributes) {
            this.crudId = attributes.crudId;
            this.setUrlRoot();
        },

        setUrlRoot: function setUrlRoot() {
            this.urlRoot = CrudHelper.getRecordServiceUrl(this.crudId || this.get('crudId'));
        }

    });
});
