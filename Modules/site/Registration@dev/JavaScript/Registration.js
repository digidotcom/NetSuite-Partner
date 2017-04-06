define('Registration', [
    'Utils',
    'CRUD',
    'Registration.Configuration',
    'Registration.Helper'
], function Registration(
    Utils,
    Crud,
    RegistrationConfiguration,
    RegistrationHelper
) {
    'use strict';

    Crud.add(RegistrationConfiguration.crudId, RegistrationConfiguration);

    return {
        MenuItems: RegistrationHelper.getMenuItems()
    };
});
