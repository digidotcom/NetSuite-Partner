define('Publish', [
    'Configuration'
], function Publish(
    Configuration
) {
    'use strict';

    return {
        publish: function publish(config) {
            Configuration.publish.push(config);
        },
        sessionPublish: function publish(config) {
            Configuration.sessionPublish = Configuration.sessionPublish || [];
            Configuration.sessionPublish.push(config);
        }
    };
});
