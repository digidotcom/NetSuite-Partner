define('Registration', [
    'CRUD',
    'Registration.Configuration',
    'Registration.Status.Configuration'
], function Registration(
    Crud,
    RegistrationConfiguration,
    RegistrationStatusConfiguration
) {
    'use strict';

    Crud.add(RegistrationConfiguration.id, RegistrationConfiguration);
    Crud.add(RegistrationStatusConfiguration.id, RegistrationStatusConfiguration);
});
