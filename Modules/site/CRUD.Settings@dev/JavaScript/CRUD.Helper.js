define('CRUD.Helper', [
    'underscore',
    'CRUD.Helper.Action',
    'CRUD.Helper.Condition',
    'CRUD.Helper.Form',
    'CRUD.Helper.ListRecord',
    'CRUD.Helper.Menus',
    'CRUD.Helper.Record',
    'CRUD.Helper.Status',
    'CRUD.Helper.Subrecord',
    'CRUD.Helper.Urls'
], function CrudHelper(
    _,
    CrudHelperAction,
    CrudHelperCondition,
    CrudHelperForm,
    CrudHelperListRecord,
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
        CrudHelperCondition,
        CrudHelperForm,
        CrudHelperListRecord,
        CrudHelperMenus,
        CrudHelperRecord,
        CrudHelperStatus,
        CrudHelperSubrecord,
        CrudHelperUrls
    );
});
