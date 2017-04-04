define('CRUD.Record.Model', [
    'underscore',
    'SC.Model',
    'SearchHelper',
    'CRUD.Utils',
    'CRUD.Configuration'
], function CrudRecordModel(
    _,
    SCModel,
    SearchHelper,
    CrudUtils,
    CrudConfiguration
) {
    'use strict';

    return SCModel.extend({
        name: 'CRUD.Record',

        list: function list(crudId, data) {
            var config = CrudConfiguration.getForRecord(crudId);
            var listHeader = !config.noListHeader;
            var search;
            var results;
            var fieldset = config.fieldsets.list;

            if (listHeader) {
                CrudUtils.parseListParameters(config, data);
            }

            search = new SearchHelper()
                .setRecord(config.record)
                .setFilters(config.filters)
                .setColumns(config.columns)
                .setFieldset(fieldset);

            if (listHeader) {
                if (config.page) {
                    search.setPage(config.page);
                }
                if (config.resultsPerPage) {
                    search.setResultsPerPage(config.resultsPerPage);
                }
            }
            if (config.sort) {
                search
                    .setSort(config.sort.fieldName)
                    .setSortOrder(config.sort.order);
            }

            search.search();

            if (listHeader) {
                results = search.getResultsForListHeader();
                CrudUtils.mapResults(config, results.records, fieldset);
            } else {
                results = search.getResults();
            }

            return results;
        },

        get: function get(crudId, id) {
            var config = CrudConfiguration.getForRecord(crudId);
            var search;
            var result;
            var fieldset = config.fieldsets.details;

            config.filters.push({ fieldName: 'internalid', operator: 'is', value1: id });

            search = new SearchHelper()
                .setRecord(config.record)
                .setFilters(config.filters)
                .setColumns(config.columns)
                .setFieldset(fieldset);

            result = search.search().getResult();
            CrudUtils.mapResult(config, result, fieldset);
            return result;
        },

        create: function create(/* crudId, data */) {
            // console.log('create', JSON.stringify(data));
            return 1;
        },

        update: function update(/* crudId, id, data */) {
            // console.log('update id: ' + id, JSON.stringify(data));
        }
    });
});
