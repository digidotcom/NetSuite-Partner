define('Case.FileUpload.Hooks', [
    'Application',
    'SuiteletService.Configuration',
    'Case.FileUpload.Configuration',
    'underscore'
], function CaseFileUploadHooks(
    Application,
    SuiteletServiceConfiguration,
    CaseFileUploadConfig,
    _
) {
    'use strict';

    SuiteletServiceConfiguration.services.push({
        script: CaseFileUploadConfig.suitelet.scriptID,
        deploy: CaseFileUploadConfig.suitelet.deployedScript
    });

    Application.on('after:Case.update', function attachFileMessage(Model, response, companyID, data) {
        Model.attachFileMessage(data, data.internalid);
    });
});
