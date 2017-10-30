define('CRUD.Record.Model', [
    'underscore',
    'SC.Model',
    'SearchHelper.CRUD',
    'RecordHelper.CRUD',
    'CRUD.Utils',
    'CRUD.Configuration'
], function CrudRecordModel(
    _,
    SCModel,
    SearchHelper,
    RecordHelper,
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
            var fieldset = config.fieldsets.details;
            var search;
            var result;

            config.filters.push({ fieldName: 'internalid', operator: 'is', value1: id });

            search = new SearchHelper()
                .setRecord(config.record)
                .setFilters(config.filters)
                .setColumns(config.columns)
                .setFieldset(fieldset);

            result = search.search().getResult();
            if (result) {
                CrudUtils.mapResult(config, result, fieldset);
            } else {
                throw notFoundError;
            }
            return result;
        },

        create: function create(crudId, dataRaw) {
            var config = CrudConfiguration.getForRecord(crudId);
            var record;

            var data = CrudUtils.parseCrudCreateData(config, dataRaw);

            record = new RecordHelper()
                .setRecord(config.record)
                .setFields(config.columns)
                .setFieldset(config.fieldsets.save)
                .setData(data)
                .setFilters(config.filters);

            record.create();

            return record.getResult();
        },

        update: function update(crudId, id, dataRaw) {
            var config = CrudConfiguration.getForRecord(crudId);
            var record;

            var data = CrudUtils.parseCrudUpdateData(config, dataRaw);

            record = new RecordHelper()
                .setRecord(config.record)
                .setFields(config.columns)
                .setFieldset(config.fieldsets.save)
                .setData(data)
                .setFilters(config.filters);

            record.update(id);

            return record.getResult();
        },

        'delete': function deleteFn(crudId, id) {
            var config = CrudConfiguration.getForRecord(crudId);

            var record = new RecordHelper()
                .setRecord(config.record)
                .setFilters(config.filters);

            record.delete(id);

            return record.getResult();
        }
    });
});
