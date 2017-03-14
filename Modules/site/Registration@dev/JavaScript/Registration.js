define('Registration', [
    'Utils',
    'Registration.Helper',
    'Registration.Router'
], function Registration(
    Utils,
    RegistrationHelper,
    RegistrationRouter
) {
    'use strict';

    return {
        MenuItems: {
            id: 'registrations',
            name: Utils.translate('Registrations'),
            url: RegistrationHelper.getListUrl(true),
            index: 0,
            children: [
                {
                    parent: 'registrations',
                    id: 'registrations_all',
                    name: Utils.translate('Registrations'),
                    url: RegistrationHelper.getListUrl(true),
                    index: 1
                },
                {
                    parent: 'registrations',
                    id: 'registrations_new',
                    name: Utils.translate('New Registration'),
                    url: RegistrationHelper.getNewUrl(true),
                    qindex: 2
                }
            ]
        },

        mountToApp: function mountToApp(application) {
            return new RegistrationRouter(application);
        }
    };
});
