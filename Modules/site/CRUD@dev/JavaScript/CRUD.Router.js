define('CRUD.Router', [
    'underscore',
    'Backbone',
    'Utils',
    'AjaxRequestsKiller',
    'ErrorManagement.ForbiddenError.View',
    'CRUD.Helper',
    'CRUD.Record.Collection',
    'CRUD.Record.Model',
    'CRUD.Status.Collection',
    'CRUD.List.View',
    'CRUD.Details.View'
], function CrudRouter(
    _,
    Backbone,
    Utils,
    AjaxRequestsKiller,
    ErrorManagementForbiddenErrorView,
    CrudHelper,
    CrudRecordCollection,
    CrudRecordModel,
    CrudStatusCollection,
    CrudListView,
    CrudDetailsView
) {
    'use strict';


    return Backbone.Router.extend({

        initialize: function initialize(application) {
            this.application = application;
            this.addRoutes();
        },

        addRoutes: function addRoutes() {
            var self = this;
            var regexes = {
                list: CrudHelper.getListUrlRegex('list'),
                'new': CrudHelper.getNewUrlRegex('create'),
                view: CrudHelper.getViewUrlRegex('read'),
                edit: CrudHelper.getEditUrlRegex('update')
            };
            _(regexes).each(function eachUrl(regex, method) {
                self.route(regex, method);
            });
        },

        list: function list(crudUrl, optionsArg) {
            var crudId = CrudHelper.getIdFromBaseUrl(crudUrl);
            var hasStatus = CrudHelper.hasStatus(crudId);
            var statusFilterName = CrudHelper.getStatusFilterName(crudId);
            var collection;
            var statusCollection;
            var view;
            var options = this.parseListOptions(optionsArg);
            var status = hasStatus ? options[statusFilterName] : null;

            if (this.allowPage(crudId, 'list')) {
                collection = new CrudRecordCollection(null, {
                    crudId: crudId,
                    recordsPerPage: options.show,
                    status: status
                });

                if (hasStatus) {
                    statusCollection = new CrudStatusCollection(null, {
                        crudId: crudId
                    });
                }

                view = new CrudListView(_.extend(options, {
                    application: this.application,
                    crudId: crudId,
                    collection: collection,
                    status: status,
                    statusCollection: hasStatus ? statusCollection : null
                }));

                collection.on('reset', view.showContent, view);

                if (hasStatus) {
                    statusCollection.on('reset', view.refreshStatuses, view);
                    statusCollection.fetch({
                        reset: true,
                        killerId: AjaxRequestsKiller.getKillerId()
                    });
                }

                view.showContent();
            }
        },

        'new': function newFn(crudUrl, optionsArg) {
            var crudId = CrudHelper.getIdFromBaseUrl(crudUrl);
            var options = this.parseDetailsOptions(optionsArg);
            options.edit = false;

            if (this.allowPage(crudId, 'create')) {
                this.details(crudId, null, options);
            }
        },

        view: function view(crudUrl, id, optionsArg) {
            var crudId = CrudHelper.getIdFromBaseUrl(crudUrl);
            var options = this.parseDetailsOptions(optionsArg);
            options.edit = false;

            if (this.allowPage(crudId, 'read')) {
                this.details(crudId, id, options);
            }
        },

        edit: function edit(crudUrl, id, optionsArg) {
            var crudId = CrudHelper.getIdFromBaseUrl(crudUrl);
            var options = this.parseDetailsOptions(optionsArg);
            options.edit = true;

            if (this.allowPage(crudId, 'update')) {
                this.details(crudId, id, options);
            }
        },

        details: function details(crudId, id, options) {
            var model = new CrudRecordModel({
                internalid: id,
                crudId: crudId
            });
            var view = new CrudDetailsView(_.extend(options, {
                application: this.application,
                crudId: crudId,
                model: model
            }));
            if (!id) {
                view.showContent();
            } else {
                model.fetch().done(function done() {
                    view.showContent();
                });
            }
        },

        allowPage: function allowPage(crudId, permission) {
            var permissions = CrudHelper.getPermissions(crudId);
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
        parseDetailsOptions: function parseDetailsOptions(optionsArg) {
            return Utils.parseUrlOptions(optionsArg);
        }
    });
});
