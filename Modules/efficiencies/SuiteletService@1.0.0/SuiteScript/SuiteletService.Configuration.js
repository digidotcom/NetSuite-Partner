define('SuiteletService.Configuration', [
    'Configuration',
    'underscore'
], function SuiteletServiceConfiguration(

) {
    'use strict';

    var ConfigurationPublished = {
        services: [
            {
                script: 'customscript_script_ef_cfu_upload_file',
                deploy: 'customdeploy_script_ef_cfu_upload_file'
            }
        ],
        resolvedServices: {}
    };

    return ConfigurationPublished;
});