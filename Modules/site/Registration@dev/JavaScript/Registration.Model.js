define('Registration.Model', [
    'Backbone',
    'Registration.Helper'
], function RegistrationModel(
    Backbone,
    RegistrationHelper
) {
    'use strict';

    return Backbone.Model.extend({

        urlRoot: RegistrationHelper.getServiceUrl()

    });
});
