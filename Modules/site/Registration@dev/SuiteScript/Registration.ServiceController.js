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
            return RegistrationModel.list();
        }
    });
});
