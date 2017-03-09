define('Registration.Model', [
    'Backbone',
    'Utils'
], function RegistrationModel(
    Backbone,
    Utils
) {
    'use strict';

    return Backbone.Model.extend({

        url: Utils.getAbsoluteUrl('services/Registration.Service.ss')

    });
});
