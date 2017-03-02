define('Registration.List.View', [
    'Backbone',
    'registration_list.tpl'
], function RegistrationListView(
    Backbone,
    registrationListTpl
) {
    'use strict';

    return Backbone.View.extend({

        template: registrationListTpl,

        initialize: function initialize(options) {
            this.application = options.application;
        },

        getContext: function getContext() {
        }
    });
});
