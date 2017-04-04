define('CRUD.Configuration', [
    'underscore'
], function CrudConfiguration(
    _
) {
    'use strict';

    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    return {
        cacheRecord: {},
        configuration: {},

        add: function add(id, configuration) {
            this.configuration[id] = configuration;
        },

        get: function get(id) {
            return this.configuration[id] || {};
        },

        isValid: function isValid(id) {
            return (id in this.configuration);
        },

        getFieldRecord: function getFieldRecord(config, fieldId) {
            var fieldConfig = config.fields[fieldId];
            if (fieldConfig && fieldConfig.record) {
                return fieldConfig.record;
            }
            return null;
        },
        getFieldNameForField: function getFieldNameForField(field) {
            if (field.joint) {
                return field.internalid.fieldName;
            }
            return field.fieldName;
        },
        getJointFieldId: function getJointFieldId(fieldId, jointKey) {
            return fieldId + capitalizeFirstLetter(jointKey);
        },
        getJointKeys: function getJointKeys(fieldConfig) {
            return _.without(_.keys(fieldConfig), 'joint');
        },

        getForRecord: function getForRecord(id) {
            var self = this;
            var config;
            var result;
            if (!this.cacheRecord[id]) {
                config = this.get(id);
                result = {
                    noListHeader: !!config.noListHeader,
                    record: config.record,
                    fieldsets: {},
                    filters: [],
                    filtersDynamic: [],
                    sort: [],
                    joinFields: {},
                    columns: {}
                };
                _(config.fieldsets).each(function eachFieldset(fieldset, name) {
                    var fieldsetFields = [];
                    _(fieldset).each(function eachFieldsetField(fieldId) {
                        var fieldInfo = self.getFieldRecord(config, fieldId);
                        if (fieldInfo) {
                            if (fieldInfo.joint) {
                                _(self.getJointKeys(fieldInfo)).each(function eachData(jointKey) {
                                    fieldsetFields.push(self.getJointFieldId(fieldId, jointKey));
                                });
                            } else {
                                fieldsetFields.push(fieldId);
                            }
                        }
                    });
                    result.fieldsets[name] = fieldsetFields;
                });
                _(config.filters).each(function eachFilter(filter, fieldId) {
                    var fieldInfo = self.getFieldRecord(config, fieldId);
                    var filterData = filter;
                    if (fieldInfo) {
                        filterData.fieldName = self.getFieldNameForField(fieldInfo);
                        result.filters.push(filterData);
                    }
                });
                _(config.filtersDynamic).each(function eachFilter(filter, fieldId) {
                    var fieldInfo = self.getFieldRecord(config, fieldId);
                    var filterData = filter;
                    if (fieldInfo) {
                        filterData.fieldName = self.getFieldNameForField(fieldInfo);
                        result.filtersDynamic.push(filterData);
                    }
                });
                _(config.sort).each(function eachSort(order, fieldId) {
                    var fieldInfo = self.getFieldRecord(config, fieldId);
                    var fieldName;
                    if (fieldInfo) {
                        fieldName = self.getFieldNameForField(fieldInfo);
                        result.sort.push({
                            fieldName: fieldName,
                            order: order
                        });
                    }
                });
                _(config.fields).each(function eachField(field, fieldId) {
                    var fieldInfo = field.record;
                    var jointKeys = {};
                    if (fieldInfo) {
                        if (fieldInfo.joint) {
                            _(self.getJointKeys(fieldInfo)).each(function eachData(jointKey) {
                                var jointFieldId = self.getJointFieldId(fieldId, jointKey);
                                jointKeys[jointKey] = jointFieldId;
                                result.columns[jointFieldId] = fieldInfo[jointKey];
                            });
                            result.joinFields[fieldId] = jointKeys;
                        } else {
                            result.columns[fieldId] = fieldInfo;
                        }
                    }
                });
                this.cacheRecord[id] = result;
            }
            return this.cacheRecord[id];
        },
        getForBootstrapping: function getForBootstrapping() {
            var result = {};
            _(this.configuration).each(function eachConfiguration(config, index) {
                var fields = [];
                _(config.fields).each(function mapField(fieldInfo, fieldId) {
                    var field;
                    if (fieldInfo.form) {
                        field = _.extend({}, fieldInfo.form);
                        field.attribute = fieldId;
                        fields.push(field);
                    }
                });
                result[index] = {};
                if (fields.length) {
                    result[index].groups = config.groups;
                    result[index].fields = fields;
                }
            });
            return result;
        }
    };
});
