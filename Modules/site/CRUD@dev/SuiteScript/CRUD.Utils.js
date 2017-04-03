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
                var idField = joinField.idField;
                var nameField = joinField.nameField;
                var fields = [idField, nameField];
                var joined;
                // if all joinedFields are in fieldset, join them
                if (_.intersection(fieldset, fields).length === fields.length) {
                    joined = {
                        internalid: result[idField],
                        name: result[nameField]
                    };
                    delete result[idField];
                    delete result[nameField];
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

        getAllParameters: function getAllParameters() {
            var parameters = this.request.getAllParameters();
            var index;
            var result = {};
            for (index in parameters) { // eslint-disable-line
                if (Object.prototype.hasOwnProperty.call(parameters, index)) {
                    result[index] = parameters[index];
                }
            }
            return result;
        },

        getListParameters: function getListParameters() {
            var parameters = this.getAllParameters();
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
            _(parameters).each(function eachParameter(value, key) {
                if (key in keys) {
                    result[keys[key]] = value;
                } else {
                    filters[key] = value;
                }
            });
            result.filters = filters;
            return result;
        }
    };
});