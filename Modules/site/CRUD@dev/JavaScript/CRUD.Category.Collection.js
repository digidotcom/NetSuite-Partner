define('CRUD.Category.Collection', [
    'Backbone',
    'CRUD.Helper',
    'CRUD.Category.Model'
], function CrudCategoryCollection(
    Backbone,
    CrudHelper,
    CrudCategoryModel
) {
    'use strict';

    return Backbone.CachedCollection.extend({

        model: CrudCategoryModel,

        initialize: function initialize(elements, options) {
            this.crudId = options.crudId;
            this.setUrl();
        },

        setUrl: function setUrl() {
            this.url = CrudHelper.getCategoryServiceUrl(this.crudId, true);
        }

    });
});
