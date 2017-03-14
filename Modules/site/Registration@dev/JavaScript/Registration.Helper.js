define('Registration.Helper', [], function RegistrationHelper() {
    'use strict';

    return {
        moduleName: 'Registration',
        recordType: 'registration',
        getNewUrl: function getViewUrl() {
            return '/registrations/new';
        },
        getViewUrl: function getViewUrl(id) {
            return '/registrations/view/' + id;
        },
        getEditUrl: function getEditUrl(id) {
            return '/registrations/edit/' + id;
        }
    };
});
