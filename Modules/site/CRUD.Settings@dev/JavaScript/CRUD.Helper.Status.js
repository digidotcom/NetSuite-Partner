define('CRUD.Helper.Status', [
    'underscore',
    'Utils',
    'CRUD.Configuration'
], function CrudHelperStatus(
    _,
    Utils,
    CrudConfiguration
) {
    'use strict';

    return {
        getStatus: function getStatus(crudId) {
            return CrudConfiguration.get(crudId).status;
        },
        hasStatus: function hasStatus(crudId) {
            return !!this.getStatus(crudId);
        },
        getStatusId: function getStatusId(crudId) {
            var status = this.getStatus(crudId);
            return status && status.crudId;
        },
        getStatusFilterName: function getStatusId(crudId) {
            var status = this.getStatus(crudId);
            return status && status.filterName;
        },
        getStatusAllLabel: function getStatusAllLabel() {
            return Utils.translate('All');
        },
        getAllowEditControlField: function statusAllowsEdit(crudId) {
            var status = this.getStatus(crudId);
            return status && status.allowEditControlField;
        },
        isEditEnabledForModel: function isEditEnabledForModel(crudId, model) {
            var allowEditControlField = this.getAllowEditControlField(crudId);
            console.log(model.get(allowEditControlField));
            return !allowEditControlField || !!model.get(allowEditControlField);
        },
        isEditEnabledForSubrecord: function isEditEnabledForSubrecord(crudId/* , parentModel */) {
            // var parentCrudId = this.getParentCrudId(crudId);
            return this.isParentAllowsEditSync(crudId)/* &&
                   this.isEditEnabledForModel(parentCrudId, parentModel)*/;
        },
        getStatusServiceUrl: function getStatusServiceUrl(crudId, absolute) {
            var statusId = this.getStatusId(crudId);
            if (statusId) {
                return this.getRecordServiceUrl(statusId, absolute);
            }
            return null;
        }
    };
});
