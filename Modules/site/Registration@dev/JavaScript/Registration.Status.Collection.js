define('Registration.Status.Collection', [
    'Backbone',
    'Utils',
    'Registration.Helper',
    'Registration.Status.Model'
], function RegistrationStatusCollection(
    Backbone,
    Utils,
    RegistrationHelper,
    RegistrationStatusModel
) {
    'use strict';

    return Backbone.CachedCollection.extend({

        url: RegistrationHelper.statusServiceUrl,

        model: RegistrationStatusModel

    });
});
