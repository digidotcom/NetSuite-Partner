define('Registration.List.View', [
    'Utils',
    'Registration.AbstractView',
    'registration_list.tpl'
], function RegistrationListView(
    Utils,
    RegistrationAbstractView,
    registrationListTpl
) {
    'use strict';

    return RegistrationAbstractView.extend({

        template: registrationListTpl,

        titleSuffix: '',
        breadcrumbPart: [],

        events: {

        },

        initialize: function initialize(options) {
            this.application = options.application;
        },

        getContext: function getContext() {
        }
    });
});
