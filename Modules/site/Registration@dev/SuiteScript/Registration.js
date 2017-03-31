define('Registration', [
    'Form',
    'Registration.Configuration',
    'Registration.ServiceController',
    'Registration.Status.ServiceController'
], function Registration(
    Form,
    RegistrationConfiguration
) {
    'use strict';

    Form.add('registration', RegistrationConfiguration.getForForm());
});
