define('CRUD.Configuration.Main', [
    'underscore'
], function CrudConfigurationMain(
    _
) {
    'use strict';

    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    return {
        cacheRecord: {},

        getForRecord: function getForRecord(id) {
            var self = this;
            var config;
            var result;
            var existingKeys;
            if (!this.cacheRecord[id]) {
                config = this.getWithKeySet(id, 'record');
                result = {
                    noListHeader: config.listHeaderDisabled,
                    record: config.record,
                    fieldsets: {},
                    filters: [],
                    filtersDynamic: {},
                    sort: [],
                    joinFields: {},
                    columns: {},
                    lookup: {}
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
                if (config.loggedIn && config.loggedIn.customer) {
                    result.filters.push({
                        fieldName: self.getFieldNameForField(self.getFieldRecord(config, config.loggedIn.customer)),
                        operator: 'is',
                        value1: nlapiGetUser()
                    });
                }
                if (config.parent && config.parent.filterName) {
                    result.filtersDynamic[config.parent.filterName] = {
                        fieldName: self.getFieldNameForField(self.getFieldRecord(config, config.parent.filterName)),
                        operator: 'is',
                        numberOfValues: 1
                    };
                }
                if (config.status && config.status.filterName) {
                    result.filtersDynamic[config.status.filterName] = {
                        fieldName: self.getFieldNameForField(self.getFieldRecord(config, config.status.filterName)),
                        operator: 'is',
                        numberOfValues: 1
                    };
                }
                _(config.filtersDynamic).each(function eachFilterDynamic(filter, fieldId) {
                    var fieldInfo = self.getFieldRecord(config, fieldId);
                    var filterData = filter;
                    if (fieldInfo) {
                        filterData.fieldName = self.getFieldNameForField(fieldInfo);
                        result.filtersDynamic[fieldId] = filterData;
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
                // add remaining keys as they are
                existingKeys = _.keys(result);
                _(config).each(function eachConfig(value, key) {
                    if (_.indexOf(existingKeys, key) < 0) {
                        result[key] = value;
                    }
                });
                this.cacheRecord[id] = result;
            }
            return this.cacheRecord[id];
        },
        getForBootstrapping: function getForBootstrapping(keySet, excludeShared) {
            var result = {};
            _(this.getWithKeySetAll(keySet, excludeShared)).each(function eachConfiguration(configuration, index) {
                var configEntry = {};
                _(configuration).each(function eachConfig(config, key) {
                    if (key === 'fields') {
                        configEntry[key] = [];
                        _(config).each(function mapField(fieldInfo, fieldId) {
                            var field;
                            if (fieldInfo.form) {
                                field = _.extend({}, fieldInfo.form);
                                field.attribute = fieldId;
                                if (_.isFunction(field.defaultValue)) {
                                    field.defaultValue = field.defaultValue();
                                }
                                configEntry[key].push(field);
                            }
                        });
                    } else {
                        configEntry[key] = config;
                    }
                });
                result[index] = configEntry;
            });
            return result;
        },
        getForBootstrappingPublic: function getForBootstrappingPublic() {
            return this.getForBootstrapping('guest', true);
        },
        getForBootstrappingPrivate: function getForBootstrappingPrivate() {
            return this.getForBootstrapping('bootstrapping', false);
        },

        getFieldConfigForRecord: function getFieldConfigForRecord(config, fieldId) {
            var fieldConfig = config.fields[fieldId];
            if (fieldConfig && fieldConfig.record) {
                return fieldConfig.record.joint ? fieldConfig.record.internalid : fieldConfig.record;
            }
            return null;
        },
        getFieldRecord: function getFieldRecord(config, fieldId) {
            var fieldConfig = config.fields[fieldId];
            if (fieldConfig && fieldConfig.record) {
                return fieldConfig.record;
            }
            return null;
        },
        getFieldLookup: function getFieldLookup(config, fieldId) {
            var fieldConfig = config.fields[fieldId];
            if (fieldConfig && fieldConfig.lookup) {
                return fieldConfig.lookup;
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
        }
    };
});
