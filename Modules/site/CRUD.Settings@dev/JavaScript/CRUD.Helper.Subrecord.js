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
        getSubrecords: function hasSubrecords(crudId) {
            var subrecords = CrudConfiguration.get(crudId).subrecords;
            return _(subrecords).filter(function filterSubrecord(subrecord) {
                return !!subrecord.crudId;
            });
        },
        /* page can be 'view' or 'edit' */
        getSubrecordsInPage: function hasSubrecordsInPage(crudId, page) {
            var subrecords = this.getSubrecords(crudId) || [];
            return _(subrecords).filter(function filterSubrecord(subrecord) {
                if (page) {
                    return subrecord.pages && _(subrecord.pages).indexOf(page) >= 0;
                }
                return true;
            });
        }
    };
});
