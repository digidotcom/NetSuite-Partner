define('Case.Model.AttachMessageFile', [
    'Case.Model',
    'underscore'
], function CaseModelAttachMessageFile(
    CaseModel,
    _
) {
    'use strict';

    _.extend(CaseModel, {
        getLastMessageID: function getLastMessageID(caseID) {
            var filters = [
                new nlobjSearchFilter('internalid', null, 'is', caseID),
                new nlobjSearchFilter('internalonly', 'messages', 'is', 'F')
            ];

            var columns = [
                new nlobjSearchColumn('messagedate', 'messages').setSort(true),
                new nlobjSearchColumn('message', 'messages'),
                new nlobjSearchColumn('internalid', 'messages')
            ];

            var newSearch = nlapiCreateSearch('supportcase', filters, columns);
            var searchResultSet = newSearch.runSearch();

            var rs = searchResultSet.getResults(0, 1);
            var r = rs[0];

            return r.getValue('internalid', 'messages');
        },

        attachFileMessage: function attachFileMessage(data, caseID) {
            var messageID = this.getLastMessageID(caseID);
            var messageCaseRecord;

            try {
                if (data.uploadedFile && data.uploadedFile.length > 0) {
                    _.each(data.uploadedFile, function saveMessagesCaseRecord(fileAttr) {
                        messageCaseRecord = nlapiCreateRecord('customrecord_ef_cu_case_messages_file');
                        messageCaseRecord.setFieldValue('custrecord_ef_cu_cmf_case', caseID);
                        messageCaseRecord.setFieldValue('custrecord_ef_cu_cmf_file', fileAttr.fileID);
                        messageCaseRecord.setFieldValue('custrecord_ef_cu_cmf_file_id', fileAttr.fileID);
                        messageCaseRecord.setFieldValue('custrecord_ef_cu_cmf_message_id', messageID);

                        nlapiSubmitRecord(messageCaseRecord);
                    });
                }
            }catch (e) {
                 console.log(e.getCode(), e.getDetails());
            }
        }
    });
});