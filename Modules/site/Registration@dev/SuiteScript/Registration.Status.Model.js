define('Registration.Status.Model', [
    'underscore',
    'SC.Model',
    'SearchHelper'
], function RegistratioStatusModel(
    _,
    SCModel,
    SearchHelper
) {
    'use strict';

    function booleanMap(line, v) {
        return line.getValue(v.fieldName) === 'T';
    }

    return SCModel.extend({
        name: 'Registration.Status',

        record: 'customrecord_registration_status',
        columns: {
            internalid: { fieldName: 'internalid' },
            name: { fieldName: 'custrecord_registration_status_public' },
            allowsEdit: { fieldName: 'custrecord_registration_status_edit', applyFunction: booleanMap }
        },
        filters: [
            { fieldName: 'isinactive', operator: 'is', value1: 'F' }
        ],
        sort: { fieldName: 'internalid', order: 'asc' },
        fieldsets: {
            list: [
                'internalid',
                'name',
                'allowsEdit'
            ]
        },

        list: function list() {
            var search = new SearchHelper()
                .setRecord(this.record)
                .setFilters(this.filters)
                .setColumns(this.columns)
                .setFieldset(this.fieldsets.list);

            if (this.sort) {
                search
                    .setSort(this.sort.fieldName)
                    .setSortOrder(this.sort.order);
            }

            return search.search().getResults();
        }
    });
});
