define('Registration', [
    'underscore',
    'CRUD',
    'Registration.Configuration',
    'Registration.Status.Configuration',
    'Registration.Product.Configuration',
    'Registration.Lists.Configuration'
], function Registration(
    _,
    Crud,
    RegistrationConfiguration,
    RegistrationStatusConfiguration,
    RegistrationProductConfiguration,
    RegistrationListsConfiguration
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

    _(RegistrationListsConfiguration).each(function eachList(listConfig, listId) {
        Crud.addList(listId, listConfig);
    });
});
