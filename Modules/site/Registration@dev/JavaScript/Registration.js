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
            index: 0
        },

        mountToApp: function mountToApp(application) {
            return new RegistrationRouter(application);
        }
    };
});
