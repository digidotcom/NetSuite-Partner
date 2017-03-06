define('Registration.Router', [
    'Backbone',
    'Registration.Collection',
    'Registration.List.View'
], function RegistrationRouter(
    Backbone,
    RegistrationCollection,
    RegistrationListView
) {
    'use strict';

    return Backbone.Router.extend({

        routes: {
            'registrations': 'list',
            'registrations?:options': 'list'
        },

        initialize: function initialize(application) {
            this.application = application;
        },

        list: function list(optionsArg) {
            var collection;
            var view;
            var options = (optionsArg) ? SC.Utils.parseUrlOptions(optionsArg) : { page: 1 };
            options.page = (options.page && parseInt(options.page, 10)) || 1;
            options.show = (options.show && parseInt(options.show, 10)) || 10;

            collection = new RegistrationCollection();
            view = new RegistrationListView({
                application: this.application,
                page: options.page,
                recordsPerPage: options.show,
                collection: collection,
                activeTab: 'all'
            });

            collection.on('reset', view.showContent, view);

            view.showContent();
        }
    });
});
