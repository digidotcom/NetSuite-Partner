define('Registration.Router', [
    'Backbone',
    'Registration.List.View'
], function RegistrationRouter(
    Backbone,
    RegistrationListView
) {
    'use strict';

    return Backbone.Router.extend({

        routes: {
            'registrations': 'list'
        },

        initialize: function initialize(application) {
            this.application = application;
        },

        list: function list() {
            var view = new RegistrationListView({
                application: this.application
            });
            view.showContent();
        }
    });
});