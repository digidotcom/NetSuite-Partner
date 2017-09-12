define('EF CU SL - Move Case File Upload', [
    'underscore',
    'Case.FileUpload.Configuration'
], function EFCUMoveFile(
    _,
    Configuration
) {
    'use strict';

    var main = function main() {
        var record = nlapiGetNewRecord();
        var fileId = record.getFieldValue('custrecord_ef_cu_cmf_file_id');
        var file;

        var executionContext = nlapiGetContext().getExecutionContext();
        if (executionContext.toString() !== 'webstore') {
            return true;
        }

        if (fileId) {
            try {
                file = nlapiLoadFile(fileId);
                file.setFolder(Configuration.folderID);
                nlapiSubmitFile(file);
            } catch (e) {
                nlapiLogExecution('ERROR', 'Error Moving File', e);
            }
        }
    };

    return {
        main: main
    };
});