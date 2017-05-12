define('CRUD.Helper', [
    'underscore',
    'CRUD.Helper.Action',
    'CRUD.Helper.Form',
    'CRUD.Helper.List',
    'CRUD.Helper.Menus',
    'CRUD.Helper.Record',
    'CRUD.Helper.Status',
    'CRUD.Helper.Subrecord',
    'CRUD.Helper.Urls'
], function CrudHelper(
    _,
    CrudHelperAction,
    CrudHelperForm,
    CrudHelperList,
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
        CrudHelperAction,
        CrudHelperForm,
        CrudHelperList,
        CrudHelperMenus,
        CrudHelperRecord,
        CrudHelperStatus,
        CrudHelperSubrecord,
        CrudHelperUrls
    );
});
