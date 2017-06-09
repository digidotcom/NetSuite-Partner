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
            if (list) {
                if (_.isArray(list)) {
                    return _(list).map(function mapListValues(value) {
                        return _.extend({}, value, {
                            value: value.internalid,
                            name: value.name
                        });
                    });
                } else if (_.isFunction(list)) {
                    return list;
                } else if (_.isObject(list)) {
                    return _.values(list);
                }
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
