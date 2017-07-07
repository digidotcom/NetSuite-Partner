define('Documents.PriceList.Model', [
    'underscore',
    'SC.Model',
    'SearchHelper'
], function CrudRecordModel(
    _,
    SCModel,
    SearchHelper
) {
    'use strict';

    return SCModel.extend({
        name: 'Documents.PriceList',

        record: 'customrecord_partnerpricelists',
        columns: {
            internalid: {
                fieldName: 'internalid'
            },
            name: {
                fieldName: 'name'
            },
            fileName: {
                fieldName: 'custrecord_plfilename'
            }
        },
        filters: [
            { fieldName: 'isinactive', operator: 'is', value1: 'F' },
            { fieldName: 'custrecord_partnername_pl', operator: 'is', value1: nlapiGetUser() + '' }
        ],
        fieldsets: {
            list: [
                'internalid',
                'name',
                'fileName'
            ]
        },

        list: function list(data) {
            var search = new SearchHelper()
                .setRecord(this.record)
                .setFilters(this.filters)
                .setColumns(this.columns)
                .setFieldset(this.fieldsets.list)
                .setPage(data.page || 1);

            if (data.resultsPerPage) {
                search.setResultsPerPage(data.resultsPerPage);
            }
            if (data.sort) {
                search
                    .setSort(data.sort)
                    .setSortOrder(data.order >= 0 ? 'asc' : 'desc');
            }

            search.search();

            return search.getResultsForListHeader();
        }
    });
});
