define('Registration', [
    'Utils',
    'CRUD',
    'Registration.Configuration'
], function Registration(
    Utils,
    Crud,
    RegistrationConfiguration
) {
    'use strict';

    Crud.add(RegistrationConfiguration.crudId, RegistrationConfiguration);
});
