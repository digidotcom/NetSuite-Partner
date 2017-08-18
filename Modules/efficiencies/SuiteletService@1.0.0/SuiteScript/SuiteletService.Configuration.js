define('SuiteletService.Configuration', [
    'Configuration',
    'underscore'
], function SuiteletServiceConfiguration(
    Configuration
) {
    'use strict';

    var ConfigurationPublished = {
        services: [
            {
                script: 'customscript_ef_sl_case_upload',
                deploy: 'customdeploy_ef_sl_case_upload'
            }
        ],
        resolvedServices: {}
    };

    return ConfigurationPublished;
});