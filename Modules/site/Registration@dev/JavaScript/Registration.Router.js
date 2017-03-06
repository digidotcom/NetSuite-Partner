define('Registration.Router', [
    'underscore',
    'Backbone',
    'AjaxRequestsKiller',
    'Registration.Collection',
    'Registration.Status.Collection',
    'Registration.List.View'
], function RegistrationRouter(
    _,
    Backbone,
    AjaxRequestsKiller,
    RegistrationCollection,
    RegistrationStatusCollection,
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

        parseDefaultOptions: function parseDefaultOptions(optionsArg) {
            var defaults = {
                page: 1, // default to 1
                show: 10, // default to 10
                status: 3 // default to Open
            };
            var options = defaults;
            if (optionsArg) {
                options = SC.Utils.parseUrlOptions(optionsArg);
                options.page = parseInt(options.page, 10) || defaults.page;
                options.show = parseInt(options.show, 10) || defaults.show;
                options.status = parseInt(options.status, 10) || defaults.status;
            }
            return options;
        },

        list: function list(optionsArg) {
            var collection;
            var statusCollection;
            var view;
            var options = this.parseDefaultOptions(optionsArg);

            collection = new RegistrationCollection({
                recordsPerPage: options.show,
                status: options.status
            });
            statusCollection = new RegistrationStatusCollection();
            view = new RegistrationListView(_.extend(options, {
                application: this.application,
                collection: collection,
                statusCollection: statusCollection
            }));

            collection.on('reset', view.showContent, view);
            statusCollection.on('reset', view.refreshStatuses, view);

            statusCollection.fetch({
                reset: true,
                killerId: AjaxRequestsKiller.getKillerId()
            });

            view.showContent();
        }
    });
});
