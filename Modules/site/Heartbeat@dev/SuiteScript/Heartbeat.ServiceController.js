define('Heartbeat.ServiceController', [
    'Application',
    'ServiceController'
], function HeartbeatServiceController(
    Application,
    ServiceController
) {
    'use strict';

    return ServiceController.extend({
        name: 'Heartbeat.ServiceController',

        get: function get() {
            var beatsParam = this.request.getParameter('beat');
            var beats = null;

            if (beatsParam) {
                beats = parseInt(beatsParam, 10);
            }

            return {
                acknowledged: true,
                beats: beats
            };
        }
    });
});
