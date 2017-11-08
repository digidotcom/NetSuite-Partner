define('CRUD.List.View', [
    'Utils',
    'CRUD.Record.List.View'
], function CrudListView(
    Utils,
    CrudRecordListView
) {
    'use strict';

    var isoDate = Utils.dateToString(new Date());

    return CrudRecordListView.extend({

        pageHeader: '',
        titleSuffix: '',
        breadcrumbPart: [],

        rangeFilterOptions: {
            fromMin: '1800-01-02',
            fromMax: isoDate,
            toMin: '1800-01-02',
            toMax: isoDate
        },

        sortOptions: [
            {
                value: 'date',
                name: Utils.translate('Sort By Created Date'),
                selected: true
            }
        ]
    });
});
