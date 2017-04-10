define('CRUD.Category.View', [
    'underscore',
    'Backbone',
    'Utils',
    'CRUD.Helper',
    'crud_category.tpl'
], function CrudCategoryView(
    _,
    Backbone,
    Utils,
    CrudHelper,
    crudCategoryTpl
) {
    'use strict';

    return Backbone.View.extend({

        template: crudCategoryTpl,

        initialize: function initialize(options) {
            this.collection = options.collection;
            this.crudId = options.crudId;
            this.active = parseInt(options.active, 10) || null;
        },

        getCategoryContext: function getCategoryContext(model, active) {
            var crudId = this.crudId;
            var params = {};
            var id = null;
            var name = CrudHelper.getCategoryAllLabel();
            var isActive = !active;
            if (model) {
                id = parseInt(model.get('internalid'), 10);
                name = model.get('name');
                params[CrudHelper.getCategoryFilterName(crudId)] = id;
                isActive = id === active;
            }
            return {
                name: name,
                value: id,
                url: Utils.addParamsToUrl(CrudHelper.getListUrl(crudId), params),
                isActive: isActive
            };
        },

        getContext: function getContext() {
            var self = this;
            var collection = this.collection;
            var active = this.active;
            var categories = [
                self.getCategoryContext(null, active)
            ];
            if (collection.length) {
                collection.each(function eachCollection(category) {
                    categories.push(self.getCategoryContext(category, active));
                });
            }
            return {
                categories: categories
            };
        }
    });
});
