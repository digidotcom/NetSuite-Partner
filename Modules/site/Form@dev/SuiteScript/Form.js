define('Form', [
    'Configuration',
    'Form.Configuration'
], function Form(
    Configuration,
    FormConfiguration
) {
    'use strict';

    Configuration.publish.push({
        key: 'FormConfiguration',
        model: 'Form.Configuration',
        call: 'getForBootstrapping'
    });

    return {
        add: function add(id, config) {
            FormConfiguration.add(id, config);
        }
    };
});
