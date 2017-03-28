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
        MenuItems: RegistrationHelper.getMenuItems(),

        mountToApp: function mountToApp(application) {
            return new RegistrationRouter(application);
        }
    };
});
