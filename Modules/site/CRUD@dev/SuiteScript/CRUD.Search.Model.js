define('CRUD.Search.Model', [
    'underscore',
    'SC.Model',
    'SearchHelper.CRUD',
    'CRUD.Utils',
    'CRUD.Configuration'
], function CrudSearchModel(
    _,
    SCModel,
    SearchHelper,
    CrudUtils,
    CrudConfiguration
) {
    'use strict';

    return SCModel.extend({
        name: 'CRUD.Record',

        addQueryToSearch: function addQueryToSearch(crudId, config, search, query) {
            var filters;
            if (config.search && config.search.fields) {
                filters = [];
                _(config.search.fields).each(function eachSearchField(filter, fieldId) {
                    var fieldInfo = CrudConfiguration.getFieldRecord(config, fieldId);
                    var filterData = filter;
                    if (fieldInfo) {
                        filterData.fieldName = CrudConfiguration.getFieldNameForField(fieldInfo);
                        filterData.value1 = query;
                        filterData.or = true;
                        filters.push(filterData);
                    }
                });
                if (filters.length > 0) {
                    filters[0].leftParens = 1;
                    filters[filters.length - 1].or = false;
                    filters[filters.length - 1].rightParens = 1;

                    _(filters).each(function eachFilter(filter) {
                        search.addFilter(filter);
                    });
                }
            }
        },

        formatResult: function formatResult(crudId, result) {
            return {
                crudId: crudId,
                data: result
            };
        },

        formatResults: function formatResults(crudId, results) {
            var self = this;
            return _(results).map(function mapResult(result) {
                return self.formatResult(crudId, result);
            });
        },

        searchSingle: function searchSingle(crudId, query) {
            var config = CrudConfiguration.getForRecord(crudId);
            var fieldset = config.fieldsets.search;
            var search;
            var results;

            if (config.search) {
                search = new SearchHelper()
                    .setRecord(config.record)
                    .setColumns(config.columns)
                    .setFilters(config.filters)
                    .setFieldset(fieldset);

                if (query) {
                    this.addQueryToSearch(crudId, config, search, query);
                }

                results = search.search().getResults();
                CrudUtils.mapResults(config, results, fieldset);
                results = this.formatResults(crudId, results);
                return results;
            }
            return [];
        },

        searchMultiple: function searchMultiple(crudIds, query) {
            var self = this;
            var results = {};
            _(crudIds).each(function eachCrudId(crudId) {
                results[crudId] = self.searchSingle(crudId, query);
            });
            return results;
        },

        mergeResults: function mergeResults(results) {
            var mergedResults = [];
            _(results).each(function eachResult(result) {
                mergedResults = _.union(mergedResults, result);
            });
            return mergedResults;
        },

        getCrudIds: function getCrudIds(crudIdsArg) {
            var crudIds = CrudConfiguration.getIds();
            if (crudIdsArg)
        },

        search: function search(crudIdsArg, query) {
            var crudIds = this.getCrudIds(crudIdsArg);
            var results = this.searchMultiple(crudIds, query);
            return this.mergeResults(results);
        }
    });
});
