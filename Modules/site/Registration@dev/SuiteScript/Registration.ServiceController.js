define('Registration.ServiceController', [
    'ServiceController',
    'Registration.Model'
], function RegistrationServiceController(
    ServiceController,
    RegistrationModel
) {
    'use strict';

    return ServiceController.extend({
        name: 'Registration.ServiceController',

        options: {
            common: {
                requireLogin: true
            }
        },

        get: function get() {
            var id = this.request.getParameter('internalid');
            if (id) {
                return RegistrationModel.get(id);
            }
            return RegistrationModel.list({
                order: this.request.getParameter('order'),
                sort: this.request.getParameter('sort'),
                from: this.request.getParameter('from'),
                to: this.request.getParameter('to'),
                page: this.request.getParameter('page') || 1,
                resultsPerPage: this.request.getParameter('results_per_page')
            });
        }
    });
});
