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
            return CrudHelper.getBaseKey(this.crudId) + '_all';
        },
        getTitle: function getTitle() {
            var names = CrudHelper.getNames(this.crudId);
            return Utils.translate(names.plural) + this.getTitleSuffix();
        },
        getBreadcrumbPages: function getBreadcrumbPages() {
            var crudId = this.crudId;
            var names = CrudHelper.getNames(crudId);
            return _.union([
                {
                    text: Utils.translate(names.plural),
                    href: CrudHelper.getListUrl(crudId)
                }
            ], this.getBreadcrumbPart());
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
