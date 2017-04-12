define('CRUD.Utils', [
    'underscore',
    'CRUD.Configuration'
], function CrudUtils(
    _,
    CrudConfiguration
) {
    'use strict';

    return {

        mapResult: function mapResult(config, result, fieldset) {
            this.parseJoinObject(config, result, fieldset);
        },

        mapResults: function mapResults(config, results, fieldset) {
            var self = this;
            _(results).each(function reachResult(result) {
                self.mapResult(config, result, fieldset);
            });
        },

        parseJoinObject: function parseJoinObject(config, result, fieldset) {
            _(config.joinFields).each(function eachJoinObject(joinField, key) {
                var fields = _.values(joinField);
                var joined;
                // if all joinedFields are in fieldset, join them
                if (_.intersection(fieldset, fields).length === fields.length) {
                    joined = {};
                    _(joinField).each(function eachJoinField(joinFieldId, joinKey) {
                        joined[joinKey] = result[joinFieldId];
                        delete result[joinFieldId];
                    });
                    result[key] = joined;
                }
            });
        },

        parseListParameters: function parseListParameters(config, data) {
            var offset;

            // page number
            config.page = data.page || 1;

            // page size
            if (data.resultsPerPage) {
                config.resultsPerPage = data.resultsPerPage;
            }

            // to-from filter
            if (data.from && data.to) {
                offset = new Date().getTimezoneOffset() * 60 * 1000;
                config.filters.push({
                    fieldName: 'created',
                    operator: 'within',
                    value1: new Date(parseInt(data.from, 10) + offset),
                    value2: new Date(parseInt(data.to, 10) + offset)
                });
            }

            // filters
            if (data.filters) {
                _(config.filtersDynamic).each(function eachFilterWhitelist(filter, paramName) {
                    var filterObject;
                    var value;
                    if (paramName in data.filters) {
                        value = data.filters[paramName];
                        filterObject = {
                            fieldName: filter.fieldName || paramName,
                            operator: filter.operator || 'is'
                        };
                        if (filter.numberOfValues && filter.numberOfValues === 2) {
                            value = value.split(',');
                            filterObject.value1 = value[0];
                            filterObject.value2 = value[1];
                        } else {
                            filterObject.value1 = value;
                        }
                        config.filters.push(filterObject);
                    }
                });
            }

            // sort
            if (data.sort) {
                config.sort = {
                    fieldName: data.sort,
                    order: data.order >= 0 ? 'asc' : 'desc'
                };
            }
        },


        validateCrudId: function validateCrudId(crudId) {
            if (!crudId || !CrudConfiguration.isValid(crudId)) {
                throw badRequestError;
            }
        },
        validateId: function validateId(id) {
            if (!id) {
                throw badRequestError;
            }
        },
        isAllowed: function isAllowed(crudId, permission) {
            var config = CrudConfiguration.get(crudId);
            var permissions = config && config.permissions;
            if (permissions && !permissions[permission]) {
                throw methodNotAllowedError;
            }
            return true;
        },

        getCategoryFieldName: function getCategoryFieldName(id) {
            var config = CrudConfiguration.get(id);
            return config && config.category && config.category.filterName;
        },

        getAllParameters: function getAllParameters(request) {
            var parameters = request.getAllParameters();
            var index;
            var result = {};
            for (index in parameters) { // eslint-disable-line
                if (Object.prototype.hasOwnProperty.call(parameters, index)) {
                    result[index] = parameters[index];
                }
            }
            return result;
        },

        getListParameters: function getListParameters(crudId, request) {
            var parameters = this.getAllParameters(request);
            var categoryName;
            var keys = {
                order: 'order',
                sort: 'sort',
                from: 'from',
                to: 'to',
                page: 'page',
                results_per_page: 'resultsPerPage'
            };
            var filters = {};
            var result = {};
            if (parameters.category) {
                categoryName = this.getCategoryFieldName(crudId);
                if (categoryName) {
                    filters[categoryName] = parameters.category;
                    delete parameters.category;
                }
            }
            _(parameters).each(function eachParameter(value, key) {
                if (key in keys) {
                    result[keys[key]] = value;
                } else {
                    filters[key] = value;
                }
            });
            result.filters = filters;
            return result;
        },

        parseCrudData: function parseCrudData(config, dataArg) {
            var data = {};
            _(dataArg).each(function eachDataArg(value, key) {
                var fieldInfo = config.fields[key];
                if (!/_display$/.test(key)) {
                    if (fieldInfo && fieldInfo.record) {
                        if (fieldInfo.record.joint && fieldInfo.record.internalid) {
                            data[key + 'Internalid'] = value;
                        } else {
                            data[key] = value;
                        }
                    }
                }
            });
            if (config.loggedInFilterField) {
                data[config.loggedInFilterField] = nlapiGetUser(); // eslint-disable-line
                _(config.fieldsets).each(function eachFieldset(fieldset) {
                    fieldset.push(config.loggedInFilterField);
                });
            }
            return data;
        }
    };
});
