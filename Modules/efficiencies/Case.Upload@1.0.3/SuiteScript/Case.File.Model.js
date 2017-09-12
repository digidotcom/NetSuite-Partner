define('Case.File.Model', [
    'SC.Model',
    'SearchHelper',
    'underscore'
], function CaseFileModel(
    SCModel,
    SearchHelper,
    _
) {
    'use strict';

    return SCModel.extend({
        name: 'CaseFile',

        record: 'customrecord_ef_cu_case_messages_file',

        columns: {
            internalid: {fieldName: 'internalid'},
            caseID: {fieldName: 'custrecord_ef_cu_cmf_case'},
            messageID: {fieldName: 'custrecord_ef_cu_cmf_message_id'},
            fileID: {fieldName: 'custrecord_ef_cu_cmf_file_id'}
        },

        filters: [
            {fieldName: 'isinactive', operator: 'is', value1: 'F'}
        ],

        getMessageFiles: function getMessageFiles(caseID) {
            var filters = _.clone(this.filters);
            var data;
            var search;
            var results;

            filters.push({
                fieldName: this.columns.caseID.fieldName,
                operator: 'is',
                value1: caseID
            });

            search = new SearchHelper()
                .setRecord(this.record)
                .setFilters(filters)
                .setColumns(this.columns)
                .setSort('internalid')
                .setSortOrder('asc')
                .search();

            results = search.getResults();

            if ( results && results.length > 0 ) {
                data = _.map(results, function mapResult(result) {
                    var fileLink = nlapiLookupField('file', result.fileID, 'url');
                    return {
                        internalid: result.internalid,
                        msgid: result.messageID,
                        fileid: result.fileID,
                        link: fileLink.getURL()
                    };
                });
            }

            return _.groupBy(data, 'msgid');
        }
    });
});