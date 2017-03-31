define('CRUD.Configuration', [
    'underscore'
], function CrudConfiguration(
    _
) {
    'use strict';

    return {
        configuration: {},

        add: function add(id, configuration) {
            this.configuration[id] = configuration;
        },

        get: function get(id) {
            return this.configuration[id] || {};
        },

        isValid: function isValid(id) {
            return (id in this.configuration);
        },

        getForBootstrapping: function getForBootstrapping() {
            var result = {};
            _(this.configuration).each(function eachConfiguration(config, index) {
                result[index] = _(config).pick(['fields', 'groups']);
            });
            return result;
        }
    };
});
