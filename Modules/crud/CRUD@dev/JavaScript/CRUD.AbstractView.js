define('CRUD.AbstractView', [
    'underscore',
    'Backbone',
    'Utils',
    'CRUD.Helper'
], function CrudAbstractView(
    _,
    Backbone,
    Utils,
    CrudHelper
) {
    'use strict';

    return Backbone.View.extend({

        getSelectedMenu: function getSelectedMenu() {
            var crudId = this.crudId;
            var parentCrudId = CrudHelper.getParentCrudId(crudId);
            var baseKey;
            var selected;
            if (parentCrudId) {
                baseKey = CrudHelper.getBaseKey(parentCrudId);
                selected = baseKey + '_all';
            } else {
                baseKey = CrudHelper.getBaseKey(crudId);
                selected = (this.isNew && this.isNew()) ? baseKey + '_new' : baseKey + '_all';
            }
            return selected;
        },
        getTitle: function getTitle() {
            var names = CrudHelper.getNames(this.crudId);
            return Utils.translate(names.plural) + this.getTitleSuffix();
        },
        getBreadcrumbPages: function getBreadcrumbPages() {
            var crudId = this.crudId;
            var parentId = this.parent;
            var id = this.model && this.model.get('internalid');
            return _.union(CrudHelper.getBreadcrumbBase(crudId, id, parentId), this.getBreadcrumbPart());
        },

        /* Abstract methods or attributes to be implemented by children */
        titleSuffix: '',
        breadcrumbPart: [],
        getTitleSuffix: function getTitleSuffix() {
            return this.titleSuffix || '';
        },
        getBreadcrumbPart: function getBreadcrumbPart() {
            return this.breadcrumbPart || [];
        }
    });
});
