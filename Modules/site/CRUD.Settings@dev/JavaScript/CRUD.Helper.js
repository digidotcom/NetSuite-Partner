define('CRUD.Helper', [
    'underscore',
    'CRUD.Helper.Menus',
    'CRUD.Helper.Record',
    'CRUD.Helper.Status',
    'CRUD.Helper.Subrecord',
    'CRUD.Helper.Urls'
], function CrudHelper(
    _,
    CrudHelperMenus,
    CrudHelperRecord,
    CrudHelperStatus,
    CrudHelperSubrecord,
    CrudHelperUrls
) {
    'use strict';

    var CrudHelperBase = {
        isFormAsync: function isFormAsync(crudId, page) {
            return this.getSubrecordsInPage(crudId, page).length > 0;
        }
    };

    return _({}).extend(
        CrudHelperBase,
        CrudHelperMenus,
        CrudHelperRecord,
        CrudHelperStatus,
        CrudHelperSubrecord,
        CrudHelperUrls
    );
});
