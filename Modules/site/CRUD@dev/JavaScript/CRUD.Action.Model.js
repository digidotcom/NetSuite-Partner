define('CRUD.Action.Model', [
    'Backbone',
    'CRUD.Helper'
], function CrudActionModel(
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
            this.urlRoot = CrudHelper.getActionServiceUrl(this.crudId || this.get('crudId'));
        }

    });
});
