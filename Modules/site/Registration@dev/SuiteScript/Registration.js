define('Registration', [
    'underscore',
    'CRUD',
    'Registration.Configuration',
    'Registration.Status.Configuration',
    'Registration.Product.Configuration'
], function Registration(
    _,
    Crud,
    RegistrationConfiguration,
    RegistrationStatusConfiguration,
    RegistrationProductConfiguration
) {
    'use strict';

    var cruds = [
        RegistrationConfiguration,
        RegistrationStatusConfiguration,
        RegistrationProductConfiguration
    ];

    _(cruds).each(function eachCrud(crud) {
        Crud.add(crud.id, crud);
    });
});
