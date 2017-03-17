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
                requireSecure: true,
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
        },

        post: function post() {
            var id = RegistrationModel.create(this.data);
            this.sendContent(RegistrationModel.get(id), { status: 201 });
        },

        put: function put() {
            var id = this.request.getParameter('internalid');
            RegistrationModel.update(id, this.data);
            return RegistrationModel.get(id);
        }
    });
});
