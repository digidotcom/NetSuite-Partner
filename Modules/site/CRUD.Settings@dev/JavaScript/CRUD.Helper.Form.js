define('CRUD.Helper.Form', [
    'underscore',
    'Utils',
    'Form.Config',
    'CRUD.Configuration'
], function CrudHelperForm(
    _,
    Utils,
    FormConfig,
    CrudConfiguration
) {
    'use strict';

    return {
        getFieldDisplaySuffix: function getFieldDisplaySuffix() {
            return FormConfig.prototype.getFieldDisplaySuffix();
        },
        filterFieldByVisibility: function filterFieldByVisibility(field, data) {
            if (field.visibility) {
                if (_.isArray(field.visibility)) {
                    return this.areConditionsMet(field.visibility, data);
                }
                return true;
            }
            return false;
        },
        filterFieldForForm: function filterFieldForForm(field, data) {
            if ('visibility' in field) {
                return this.filterFieldByVisibility(field, data);
            }
            return true;
        },
        filterFieldsForForm: function filterFieldsForForm(fields, data) {
            var self = this;
            return _(fields || []).filter(function fieldsEach(field) {
                return self.filterFieldForForm(field, data);
            });
        },
        getConfigForForm: function getForForm(crudId, data) {
            var config = _.clone(CrudConfiguration.get(crudId));
            config.fields = this.filterFieldsForForm(config.fields, data);
            return config;
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
