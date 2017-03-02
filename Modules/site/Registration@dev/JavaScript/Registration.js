define('Registration', [
    'Registration.Router'
], function Registration(
    RegistrationRouter
) {
    'use strict';

    return {
        mountToApp: function mountToApp(application) {
            return new RegistrationRouter(application)
        }
    };
});