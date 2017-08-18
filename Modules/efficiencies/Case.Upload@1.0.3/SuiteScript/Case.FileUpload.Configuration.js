// @module Case.FileUpload
define('Case.FileUpload.Configuration', [
    'Configuration',
    'underscore'
], function CaseFileUploadConfiguration(
    Configuration,
    _
) {
    'use strict';

    var CaseFileUploadConfig;
    var context = nlapiGetContext();

    if (!Configuration.publish) {
        Configuration.publish = [];
    }

    Configuration.publish.push({
        key: 'SuiteletService',
        model: 'SuiteletService',
        call: 'resolve'
    });

    CaseFileUploadConfig = {
        suitelet: {
            scriptID: 'customscript_ef_sl_case_upload',
            deployedScript: 'customdeploy_ef_sl_case_upload'
        },

        folderID: context.getSetting('SCRIPT', 'custscript_ef_cu_folder_id'),

        temporaryFolderID: context.getSetting('SCRIPT', 'custscript_ef_cu_temporary_folder_id'),

        maximumFileUpload: 10,

        thumbnailImageResizeID: 'thumbnail',

        allowedTypes: [
            'PJPGIMAGE',
            'JPGIMAGE',
            'GIFIMAGE',
            'PNGIMAGE',
            'TIFFIMAGE',
            'BMPIMAGE',
            'PDF'
        ],

        allowedExtensions: [
            'tiff',
            'tif',
            'jpg',
            'jpeg',
            'gif',
            'bmp',
            'pjpeg',
            'png',
            'pdf'
        ],

        uploadType: 'files' // image_only, files,
    };

    _.extend(CaseFileUploadConfig, {
        get: function get() {
            return this;
        }
    });

    if (!Configuration.publish) {
        Configuration.publish = [];
    }
    Configuration.publish.push({
        key: 'CaseFileUpload_config',
        model: 'Case.FileUpload.Configuration',
        call: 'get'
    });
    return CaseFileUploadConfig;
});