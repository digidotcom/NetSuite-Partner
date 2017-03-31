define('Form.Configuration', [], function FormConfiguration() {
    'use strict';

    return {
        configuration: {},

        add: function add(id, configuration) {
            this.configuration[id] = configuration;
        },

        getForBootstrapping: function getForBootstrapping() {
            return this.configuration;
        }
    };
});
