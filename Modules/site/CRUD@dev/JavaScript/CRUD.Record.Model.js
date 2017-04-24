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
            this.parent = attributes.parent;
            this.setUrlRoot();
            this.parseAttributes();
        },

        setUrlRoot: function setUrlRoot() {
            this.urlRoot = CrudHelper.getRecordServiceUrl(this.crudId || this.get('crudId'));
        },

        parseAttributes: function parseAttributes() {
            var parentAttribute = CrudHelper.getParentFieldName();
            this.set(parentAttribute, this.parent);
        }

    });
});
