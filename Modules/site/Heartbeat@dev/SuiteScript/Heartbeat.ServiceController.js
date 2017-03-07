define('Heartbeat.ServiceController', [
    'ServiceController'
], function HeartbeatServiceController(
    ServiceController
) {
    'use strict';

    return ServiceController.extend({
        name: 'Heartbeat.ServiceController',

        get: function get() {
            var beatsParam = this.request.getParameter('beats');
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
