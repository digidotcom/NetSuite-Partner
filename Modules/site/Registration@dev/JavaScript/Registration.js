define('Registration', [
    'Utils',
    'Registration.Router'
], function Registration(
    Utils,
    RegistrationRouter
) {
    'use strict';

    return {
        MenuItems: {
            id: 'registrations',
            name: Utils.translate('Registrations'),
            url: 'registrations',
            index: 0,
            children: [
                {
                    parent: 'registrations',
                    id: 'registrations_all',
                    name: Utils.translate('Registrations'),
                    url: 'registrations',
                    index: 1
                },
                {
                    parent: 'registrations',
                    id: 'registrations_new',
                    name: Utils.translate('New Registration'),
                    url: 'registrations/new',
                    qindex: 2
                }
            ]
        },

        mountToApp: function mountToApp(application) {
            return new RegistrationRouter(application);
        }
    };
});
