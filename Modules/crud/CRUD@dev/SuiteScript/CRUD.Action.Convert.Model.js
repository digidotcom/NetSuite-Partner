define('CRUD.Action.Convert.Model', [
    'underscore',
    'SC.Model',
    'Utils',
    'SearchHelper.CRUD',
    'RecordHelper.CRUD',
    'CRUD.Configuration',
    'CRUD.Record.Model'
], function CrudActionConvertModel(
    _,
    SCModel,
    Utils,
    SearchHelper,
    RecordHelper,
    CrudConfiguration,
    CrudRecordModel
) {
    'use strict';

    return SCModel.extend({
        name: 'CRUD.Action.Field',

        getTargetConfig: function getConvertConfig(action) {
            return CrudConfiguration.getForRecord(action.crudId);
        },

        getRecord: function getRecord(crudId, id) {
            return CrudRecordModel.get(crudId, id);
        },

        getConvertConfig: function getTargetConvertConfig(crudIdOrigin, configTarget) {
            return _(configTarget.convert || []).findWhere({ crudId: crudIdOrigin });
        },

        mapField: function mapField(recordOrigin, fieldOrigin) {
            return Utils.getPathFromObject(recordOrigin, fieldOrigin);
        },

        setMappedValue: function setMappedValue(data, field, value) {
            if (_(value).isObject()) {
                data[field] = value.internalid;
                data[field + '_display'] = value.name;
            } else {
                data[field] = value;
            }
        },

        getMappedData: function mapData(recordOrigin, convertConfig) {
            var self = this;
            var data = {};
            _(convertConfig.fieldMapping).each(function eachFieldMapping(fieldOrigin, fieldTarget) {
                var targetValue = self.mapField(recordOrigin, fieldOrigin);
                self.setMappedValue(data, fieldTarget, targetValue);
            });
            return data;
        },

        getValuesData: function getValuesData(convertConfig) {
            var self = this;
            var data = {};
            _(convertConfig.fieldValues).each(function eachFieldValues(value, field) {
                self.setMappedValue(data, field, value);
            });
            return data;
        },

        generateTargetData: function generateTargetData(recordOrigin, convertConfig) {
            var data = {};
            _(data).extend(this.getMappedData(recordOrigin, convertConfig));
            _(data).extend(this.getValuesData(convertConfig));
            return data;
        },

        getTargetData: function getTargetData(configOrigin, id, configTarget) {
            var crudIdOrigin = configOrigin.id;
            var recordOrigin = this.getRecord(crudIdOrigin, id);
            var convertConfig = this.getConvertConfig(crudIdOrigin, configTarget);
            return this.generateTargetData(recordOrigin, convertConfig);
        },

        createRecord: function createRecord(crudId, data) {
            return CrudRecordModel.create(crudId, data);
        },

        run: function runActionField(configOrigin, id, action) {
            var configTarget = this.getTargetConfig(action);
            var mappedData = this.getTargetData(configOrigin, id, configTarget);
            var newId = this.createRecord(action.crudId, mappedData);
            return {
                crudId: action.crudId,
                id: newId
            };
        }
    });
});
