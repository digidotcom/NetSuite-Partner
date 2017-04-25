define('CRUD.Helper.Subrecord', [
    'underscore',
    'Utils',
    'CRUD.Configuration'
], function CrudHelper(
    _,
    Utils,
    CrudConfiguration
) {
    'use strict';

    return {
        getParent: function getBaseKey(crudId) {
            var config = CrudConfiguration.get(crudId);
            return config.parent;
        },
        getParentCrudId: function getBaseKey(crudId) {
            var parent = this.getParent(crudId);
            return parent && parent.crudId;
        },
        getParentFieldName: function getBaseKey(crudId) {
            var parent = this.getParent(crudId);
            return parent && parent.filterName;
        },
        getSubrecords: function hasSubrecords(crudId) {
            var subrecords = CrudConfiguration.get(crudId).subrecords;
            return _(subrecords).filter(function filterSubrecord(subrecord) {
                return !!subrecord.crudId;
            });
        },
        /* page can be 'view', 'edit' or 'new' */
        getSubrecordsInPage: function hasSubrecordsInPage(crudId, page) {
            var subrecords = this.getSubrecords(crudId) || [];
            return _(subrecords).filter(function filterSubrecord(subrecord) {
                if (page) {
                    return subrecord.pages && _(subrecord.pages).indexOf(page) >= 0;
                }
                return true;
            });
        },
        getParentPageWithSubrecord: function getParentPageWithSubrecord(crudId) {
            var parentCrudId = this.getParentCrudId(crudId);
            var subrecords = this.getSubrecords(parentCrudId) || [];
            var page = 'view';
            _(subrecords).find(function findSubrecord(subrecord) {
                if (subrecord.crudId === crudId) {
                    if (subrecord.pages && subrecord.pages.length) {
                        page = subrecord.pages[0];
                    }
                    return true;
                }
                return false;
            });
            return page;
        },
        getParentUrlWithSubrecord: function getParentUrlWithSubrecord(crudId, parentId) {
            var parentCrudId = this.getParentCrudId(crudId);
            var page = this.getParentPageWithSubrecord(crudId);
            return this.getUrlForPage(page, parentCrudId, parentId);
        }
    };
});
