define('CRUD.Helper.Prefill', [
    'underscore',
    'jQuery',
    'Utils',
    'Form.Config',
    'CRUD.Configuration'
], function CrudHelperPrefill(
    _,
    jQuery,
    Utils,
    FormConfig,
    CrudConfiguration
) {
    'use strict';

    return {
        getPrefillUrlParams: function getPrefillParameters(crudId, id) {
            return {
                source: crudId,
                source_id: id
            };
        },
        getPrefillUrl: function getActionServiceUrl(crudId, sourceCrudId, id) {
            var newUrl = this.getNewUrl(crudId);
            var prefillParams = this.getPrefillUrlParams(sourceCrudId, id);
            return Utils.addParamsToUrl(newUrl, prefillParams);
        },
        getPrefillCrudId: function getPrefillCrudId(options) {
            return options && options.source;
        },
        getPrefillRecordId: function getPrefillCrudId(options) {
            return options && options.source_id;
        },
        getPrefillOptions: function getPrefillOptions(options) {
            return {
                crudId: this.getPrefillCrudId(options),
                recordId: this.getPrefillRecordId(options)
            };
        },
        isPrefill: function isPrefill(options) {
            var prefill = this.getPrefillOptions(options);
            if (!prefill.crudId || !CrudConfiguration.get(prefill.crudId)) {
                return false;
            }
            if (!prefill.recordId || !(parseInt(prefill.recordId, 10) > 0)) {
                return false;
            }
            return true;
        },
        getPrefillConfig: function getPrefillConfig(crudId) {
            return CrudConfiguration.get(crudId).prefill || [];
        },
        getPrefillConfigForCrud: function getPrefillConfigForCrud(crudId, prefillCrudId) {
            return _(this.getPrefillConfig(crudId)).findWhere({
                crudId: prefillCrudId
            });
        },
        getPrefillFieldMapping: function getPrefillFieldMapping(config) {
            return config.fieldMapping || {};
        },
        getPrefillFieldValues: function getPrefillFieldMapping(config) {
            return config.fieldValues || {};
        },
        executePrefillField: function prefillField(model, field, value) {
            if (_.isObject(value)) {
                model.set(field, value.internalid);
                model.set(field + FormConfig.prototype.getFieldDisplaySuffix(), value.name);
            } else {
                model.set(field, value);
            }
        },
        executePrefillMapping: function executePrefillMapping(config, model, prefillModel) {
            var self = this;
            _(this.getPrefillFieldMapping(config)).each(function eachFieldMapping(mappedField, field) {
                self.executePrefillField(model, field, prefillModel.get(mappedField));
            });
        },
        executePrefillValues: function executePrefillValues(config, model) {
            var self = this;
            _(this.getPrefillFieldValues(config)).each(function eachFieldMapping(value, field) {
                self.executePrefillField(model, field, value);
            });
        },
        executePrefillModel: function executePrefillModel(model, prefillModel) {
            var config = this.getPrefillConfigForCrud(model.crudId, prefillModel.crudId);
            this.executePrefillMapping(config, model, prefillModel);
            this.executePrefillValues(config, model);
        }
    };
});
