define('Registration.Router', [
    'underscore',
    'Backbone',
    'Utils',
    'AjaxRequestsKiller',
    'ErrorManagement.ForbiddenError.View',
    'Registration.Helper',
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
    ErrorManagementForbiddenErrorView,
    RegistrationHelper,
    RegistrationCollection,
    RegistrationModel,
    RegistrationStatusCollection,
    RegistrationListView,
    RegistrationDetailsView
) {
    'use strict';


    return Backbone.Router.extend({

        routes: function routesFn() {
            var self = this;
            var routes = {};
            var permissions = {
                list: 'list',
                'new': 'create',
                view: 'read',
                edit: 'update'
            };
            var urls = {
                list: RegistrationHelper.getListUrl(true),
                'new': RegistrationHelper.getNewUrl(true),
                view: RegistrationHelper.getViewUrl(':id', true),
                edit: RegistrationHelper.getEditUrl(':id', true)
            };
            _(urls).each(function eachUrl(url, method) {
                if (self.allowRoute(method, permissions)) {
                    routes[url] = method;
                    routes[url + '?:options'] = method;
                }
            });
            return routes;
        },

        initialize: function initialize(application) {
            this.application = application;
        },

        parseListOptions: function parseListOptions(optionsArg) {
            var defaults = {
                page: 1, // default to 1
                show: 10, // default to 10
                status: null // default to All
            };
            var options = defaults;
            if (optionsArg) {
                options = Utils.parseUrlOptions(optionsArg);
                options.page = parseInt(options.page, 10) || defaults.page;
                options.show = parseInt(options.show, 10) || defaults.show;
                if (options.status) {
                    options.status = parseInt(options.status, 10);
                } else if (defaults.status) {
                    options.status = defaults.status;
                }
            }
            return options;
        },

        allowRoute: function allowRoute(method, permissions) {
            var crudPermissions = RegistrationHelper.getCrudPermissions();
            return crudPermissions[permissions[method]];
        },

        allowPage: function allowPage(permission) {
            var permissions = RegistrationHelper.getCrudPermissions();
            var view;
            if (!permissions[permission]) {
                view = new ErrorManagementForbiddenErrorView();
                view.options = view.options || {};
                view.options.application = this.application;
                view.showContent();
                return false;
            }
            return true;
        },

        list: function list(optionsArg) {
            var collection;
            var statusCollection;
            var view;
            var options = this.parseListOptions(optionsArg);

            if (this.allowPage('list')) {
                collection = new RegistrationCollection(null, {
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
        },

        parseDetailsOptions: function parseDetailsOptions(optionsArg) {
            return Utils.parseUrlOptions(optionsArg);
        },

        'new': function newFn(optionsArg) {
            var options = this.parseDetailsOptions(optionsArg);
            options.edit = false;

            if (this.allowPage('create')) {
                this.details(null, options);
            }
        },

        view: function view(id, optionsArg) {
            var options = this.parseDetailsOptions(optionsArg);
            options.edit = false;

            if (this.allowPage('read')) {
                this.details(id, options);
            }
        },

        edit: function edit(id, optionsArg) {
            var options = this.parseDetailsOptions(optionsArg);
            options.edit = true;

            if (this.allowPage('update')) {
                this.details(id, options);
            }
        },

        details: function details(id, options) {
            var model = new RegistrationModel({ internalid: id });
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
