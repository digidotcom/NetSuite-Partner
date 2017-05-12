define('CRUD.Helper.Form', [
    'underscore',
    'Utils',
    'CRUD.Configuration'
], function CrudHelperForm(
    _,
    Utils,
    CrudConfiguration
) {
    'use strict';

    return {
        getConfigForForm: function getForForm(crudId) {
            return CrudConfiguration.get(crudId);
        },
        isFormAsync: function isFormAsync(crudId, page) {
            return this.hasSubrecordsInPage(crudId, page);
        },
        getListForForm: function getListForForm(name) {
            var list = this.getList(name);
            var values;
            if (list) {
                values = list.get('values');
                return _(values).map(function mapListValues(value) {
                    return {
                        value: value.internalid,
                        name: value.name
                    };
                });
            }
            return [];
        },
        getListsForForm: function getListForForm(crudId) {
            var self = this;
            var lists = {};
            var names = this.getFieldListNames(crudId);
            _(names).each(function eachListName(name) {
                lists[name] = self.getListForForm(name);
            });
            return lists;
        }
    };
});
