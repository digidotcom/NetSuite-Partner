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

        getCrudConfig: function getCrudConfig(crudId) {
            return CrudConfiguration.getForRecord(crudId);
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

        getParentData: function getParentData(configTarget, parentIdTarget) {
            var data = {};
            if (parentIdTarget && configTarget.parent) {
                data[configTarget.parent.filterName] = parentIdTarget;
            }
            return data;
        },

        generateTargetData: function generateTargetData(recordOrigin, configTarget, convertConfig, parentIdTarget) {
            var data = {};
            _(data).extend(this.getMappedData(recordOrigin, convertConfig));
            _(data).extend(this.getValuesData(convertConfig));
            _(data).extend(this.getParentData(configTarget, parentIdTarget));
            return data;
        },

        getTargetData: function getTargetData(configOrigin, id, configTarget, parentIdTarget) {
            var crudIdOrigin = configOrigin.id;
            var recordOrigin = this.getRecord(crudIdOrigin, id);
            var convertConfig = this.getConvertConfig(crudIdOrigin, configTarget);
            return this.generateTargetData(recordOrigin, configTarget, convertConfig, parentIdTarget);
        },

        createRecord: function createRecord(crudId, data) {
            return CrudRecordModel.create(crudId, data);
        },

        getSubrecordCrudId: function getSubrecordCrudId(config, subrecord) {
            return _(config.subrecords).findWhere({ name: subrecord }).crudId;
        },

        convertSubrecord: function convertSubrecord(crudIdOrigin, crudIdTarget, parentIdOrigin, parentIdTarget) {
            var self = this;
            var configOrigin = this.getCrudConfig(crudIdOrigin);
            var results;
            var records;

            var listData = { filters: {} };
            listData.filters[configOrigin.parent.filterName] = parentIdOrigin;

            results = CrudRecordModel.list(crudIdOrigin, listData);
            records = configOrigin.noListHeader ? results : results.records;
            _(records).each(function eachRecord(record) {
                var action = {
                    type: 'convert',
                    crudId: crudIdTarget
                };
                self.run(configOrigin, record.internalid, action, parentIdTarget);
            });
        },

        convertSubrecords: function convertSubrecords(configOrigin, configTarget, parentIdOrigin, parentIdTarget) {
            var self = this;
            var convertConfigTarget = this.getConvertConfig(configOrigin.id, configTarget);
            var subrecords = convertConfigTarget.subrecords || [];
            _(subrecords).each(function eachSubrecord(subrecordOrigin, subrecordTarget) {
                var crudIdOrigin = self.getSubrecordCrudId(configOrigin, subrecordOrigin);
                var crudIdTarget = self.getSubrecordCrudId(configTarget, subrecordTarget);
                self.convertSubrecord(crudIdOrigin, crudIdTarget, parentIdOrigin, parentIdTarget);
            });
        },

        run: function run(configOrigin, id, action, parentIdTarget) {
            var configTarget;
            var mappedData;
            var newId;
            configTarget = this.getCrudConfig(action.crudId);
            mappedData = this.getTargetData(configOrigin, id, configTarget, parentIdTarget);
            newId = this.createRecord(action.crudId, mappedData);
            this.convertSubrecords(configOrigin, configTarget, id, newId);
            return {
                type: 'convert',
                crudId: action.crudId,
                id: newId
            };
        }
    });
});
