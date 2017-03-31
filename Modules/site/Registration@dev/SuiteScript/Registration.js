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

    Crud.add(RegistrationConfiguration.crudId, RegistrationConfiguration.getForCrud());
    Crud.add(RegistrationStatusConfiguration.crudId, RegistrationStatusConfiguration.getForCrud());
});
