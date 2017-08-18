define('EF CU SS - Remove Temp File', [
    'Case.FileUpload.Configuration',
    'SearchHelper'
], function EFCFUUserEventMoveFiles(
    Configuration,
    SearchHelper
) {
    'use strict';
    var GOVERNANCE_THRESHOLD = 30;

    var checkGovernance = function checkGovernance() {
        var state;
        var context = nlapiGetContext();

        if (context.getRemainingUsage() < GOVERNANCE_THRESHOLD) {
            state = nlapiYieldScript();
            if (state.status && state.status.toString() === 'FAILURE') {
                nlapiLogExecution('ERROR',
                    'Failed to yield script, exiting: Reason = ' + state.reason + ' / Size = ' + state.size
                );

                throw nlapiCreateError('FAILED_YIELD', 'Failed to yield script');
            } else if (state.status && state.status.toString() === 'RESUME') {
                nlapiLogExecution('AUDIT', 'Resuming script because of ' + state.reason + '.  Size = ' + state.size);
            } else {
                nlapiLogExecution('AUDIT', 'STATE' + JSON.stringify(state) + '.  Size = ' + state.size);
            }
        }
    };

    var main = function main() {
        /* DELETE ALL FILES CREATED MORE THAN A DAY AGO THAT ARE ORPHAN */
        var filters = [ {
            fieldName: 'created',
            operator: 'before',
            value1: 'previousoneday'
        }, {
            fieldName: 'folder',
            operator: 'is',
            value1: Configuration.temporaryFolderID
        } ];

        var columns = {
            internalid: { fieldName: 'internalid' }
        };

        var Search = new SearchHelper('file', filters, columns).search();

        var results = Search.getResults();
        var i;

        for (i = 0; i < results.length; i++) {
            checkGovernance();
            nlapiDeleteFile(results[i].internalid);
        }
    };

    return {
        main: main
    };
});