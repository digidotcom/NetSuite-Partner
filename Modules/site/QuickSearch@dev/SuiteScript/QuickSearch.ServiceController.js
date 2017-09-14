define('QuickSearch.ServiceController', [
    'underscore',
    'ServiceController',
    'QuickSearch.Model'
], function QuickSearchServiceController(
    _,
    ServiceController,
    QuickSearchModel
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
            var query = this.request.getParameter('q');
            return QuickSearchModel.get(query);
        }
    });
});
