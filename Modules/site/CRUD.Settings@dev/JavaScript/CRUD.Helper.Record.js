define('CRUD.Helper.Record', [
    'underscore',
    'Utils',
    'CRUD.Configuration'
], function CrudHelperRecord(
    _,
    Utils,
    CrudConfiguration
) {
    'use strict';

    return {
        getPermissions: function getPermissions(crudId, parentModel) {
            var permissions = CrudConfiguration.get(crudId).permissions || {};
            if (parentModel && !this.isEditEnabledForSubrecord(crudId, parentModel)) {
                return _.extend({}, permissions, {
                    create: false,
                    update: false,
                    'delete': false
                });
            }
            return permissions;
        },
        isPermissionAllowed: function isPermissionAllowed(crudId, permission) {
            var permissions = this.getPermissions(crudId);
            return !!permissions[permission];
        },
        getNames: function getNames(crudId) {
            var config = CrudConfiguration.get(crudId);
            return config.frontend && config.frontend.names;
        },
        getBaseKey: function getBaseKey(crudId) {
            var config = CrudConfiguration.get(crudId);
            return config.frontend && config.frontend.baseKey;
        },
        isInlineEdit: function isInlineEdit(crudId) {
            var config = CrudConfiguration.get(crudId);
            return config.frontend && !!config.frontend.inlineEdit;
        },
        allowNavigateToView: function allowNavigateToView(crudId, parentModel) {
            var permissions = this.getPermissions(crudId, parentModel);
            return permissions.read && !this.isInlineEdit(crudId);
        },
        getFields: function getFields(crudId) {
            var config = CrudConfiguration.get(crudId);
            return (config && config.fields) || [];
        },
        getType: function getType(crudId) {
            var config = CrudConfiguration.get(crudId);
            return config && config.type;
        },
        isCrudType: function isCrudType(crudId) {
            return this.getType(crudId) === 'crud';
        },
        isSubrecordType: function isCrudType(crudId) {
            return this.getType(crudId) === 'subrecord';
        },
        getRecordServiceUrl: function getServiceUrl(crudId, absolute) {
            var url = CrudConfiguration.get(crudId).recordServiceUrl;
            return absolute ? Utils.getAbsoluteUrl(url) : url;
        },
        getListColumns: function getListColumns(crudId) {
            var config = CrudConfiguration.get(crudId);
            return config && config.listColumns;
        },
        getListColumnFields: function getListColumnsParsed(crudId) {
            var listColumnFields = this.getListColumns(crudId);
            var fields = this.getFields(crudId);
            var listColumns = [];
            _(listColumnFields).each(function eachListColumn(fieldName) {
                var field = _(fields).findWhere({ attribute: fieldName });
                if (field) {
                    listColumns.push(field);
                }
            });
            return listColumns;
        }
    };
});
