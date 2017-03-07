define('Registration.Status.Collection', [
    'Backbone',
    'Utils',
    'Registration.Status.Model'
], function RegistrationStatusCollection(
    Backbone,
    Utils,
    RegistrationStatusModel
) {
    'use strict';

    return Backbone.CachedCollection.extend({

        url: Utils.getAbsoluteUrl('services/Registration.Status.Service.ss'),

        model: RegistrationStatusModel

    });
});
