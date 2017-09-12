define('QuickSearch.ServiceController', [
    'underscore',
    'ServiceController'
], function QuickSearchServiceController(
    _,
    ServiceController
) {
    'use strict';

    return ServiceController.extend({
        name: 'QuickSearch.ServiceController',

        options: {
            common: {
                requireSecure: true,
                requireLogin: true
            }
        },

        get: function get() {
            return {};
        }
    });
});
