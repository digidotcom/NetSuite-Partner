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

    var CrudHelperBase = {};

    return _({}).extend(
        CrudHelperBase,
        CrudHelperMenus,
        CrudHelperRecord,
        CrudHelperStatus,
        CrudHelperSubrecord,
        CrudHelperUrls
    );
});
