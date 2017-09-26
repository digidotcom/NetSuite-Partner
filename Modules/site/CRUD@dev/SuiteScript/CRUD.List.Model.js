define('CRUD.List.Model', [
    'underscore',
    'SC.Model',
    'SearchHelper.CRUD',
    'CRUD.Configuration'
], function CrudRecordModel(
    _,
    SCModel,
    SearchHelper,
    CrudConfiguration
) {
    'use strict';

    return SCModel.extend({
        name: 'CRUD.List',

        list: function list(crudId) {
            var config = CrudConfiguration.getForRecord(crudId);

            var search = new SearchHelper()
                .setRecord(config.record)
                .setFilters(config.filters)
                .setColumns(config.columns)
                .setFieldset(config.fieldsets.list);

            return search.search().getResults();
        }
    });
});
