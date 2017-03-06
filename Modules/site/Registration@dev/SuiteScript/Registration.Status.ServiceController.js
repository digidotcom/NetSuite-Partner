define('Registration.Status.ServiceController', [
    'ServiceController',
    'Registration.Status.Model'
], function RegistrationStatusServiceController(
    ServiceController,
    RegistrationStatusModel
) {
    'use strict';

    return ServiceController.extend({
        name: 'Registration.Status.ServiceController',

        options: {
            common: {
                requireLogin: true
            }
        },

        get: function get() {
            return RegistrationStatusModel.list();
        }
    });
});
