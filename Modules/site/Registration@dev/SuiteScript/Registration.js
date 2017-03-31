define('Registration', [
    'CRUD',
    'Registration.Configuration',
    'Registration.Status.Configuration',
    'Registration.Status.ServiceController'
], function Registration(
    Crud,
    RegistrationConfiguration,
    RegistrationStatusConfiguration
) {
    'use strict';

    Crud.add(RegistrationConfiguration.crudId, RegistrationConfiguration.getForCrud());
    Crud.add(RegistrationStatusConfiguration.crudId, RegistrationStatusConfiguration.getForCrud());
});
