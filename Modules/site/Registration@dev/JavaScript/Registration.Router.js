define('Registration.Router', [
    'underscore',
    'Backbone',
    'Utils',
    'AjaxRequestsKiller',
    'Registration.Collection',
    'Registration.Model',
    'Registration.Status.Collection',
    'Registration.List.View',
    'Registration.Details.View'
], function RegistrationRouter(
    _,
    Backbone,
    Utils,
    AjaxRequestsKiller,
    RegistrationCollection,
    RegistrationModel,
    RegistrationStatusCollection,
    RegistrationListView,
    RegistrationDetailsView
) {
    'use strict';

    return Backbone.Router.extend({

        routes: {
            'registrations': 'list',
            'registrations?:options': 'list',
            'registrations/new': 'new',
            'registrations/new?:options': 'new',
            'registrations/view/:id': 'view',
            'registrations/view/:id?:options': 'view',
            'registrations/edit/:id': 'edit',
            'registrations/edit/:id?:options': 'edit'
        },

        initialize: function initialize(application) {
            this.application = application;
        },

        parseListOptions: function parseListOptions(optionsArg) {
            var defaults = {
                page: 1, // default to 1
                show: 10, // default to 10
                status: 3 // default to Open
            };
            var options = defaults;
            if (optionsArg) {
                options = Utils.parseUrlOptions(optionsArg);
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
            var options = this.parseListOptions(optionsArg);

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
        },

        parseDetailsOptions: function parseDetailsOptions(optionsArg) {
            return Utils.parseUrlOptions(optionsArg);
        },

        'new': function newFn(optionsArg) {
            var options = this.parseDetailsOptions(optionsArg);
            options.edit = false;
            this.details(null, options);
        },

        view: function view(id, optionsArg) {
            var options = this.parseDetailsOptions(optionsArg);
            options.edit = false;
            this.details(id, options);
        },

        edit: function edit(id, optionsArg) {
            var options = this.parseDetailsOptions(optionsArg);
            options.edit = true;
            this.details(id, options);
        },

        details: function details(id, options) {
            var model = new RegistrationModel();
            var view = new RegistrationDetailsView(_.extend(options, {
                application: this.application,
                model: model
            }));
            if (!id) {
                view.showContent();
            } else {
                model.fetch({
                    data: {
                        internalid: id
                    }
                }).done(function done() {
                    view.showContent();
                });
            }
        }
    });
});
