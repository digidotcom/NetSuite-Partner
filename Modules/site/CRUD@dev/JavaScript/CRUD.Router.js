define('CRUD.Router', [
    'underscore',
    'Backbone',
    'jQuery',
    'Utils',
    'AjaxRequestsKiller',
    'ErrorManagement.ForbiddenError.View',
    'CRUD.Helper',
    'CRUD.Record.Collection',
    'CRUD.Record.Model',
    'CRUD.Record.List.Collection',
    'CRUD.Status.Collection',
    'CRUD.List.View',
    'CRUD.Details.View'
], function CrudRouter(
    _,
    Backbone,
    jQuery,
    Utils,
    AjaxRequestsKiller,
    ErrorManagementForbiddenErrorView,
    CrudHelper,
    CrudRecordCollection,
    CrudRecordModel,
    CrudRecordListCollection,
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
            _(regexes).each(function eachRegexes(regexGroup, method) {
                _(regexGroup).each(function eachRegexGroup(regex) {
                    self.route(regex, method);
                });
            });
        },

        list: function list(parentUrl, parentId, crudUrl, optionsArg) {
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
                    parent: parentId,
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
                    parent: parentId,
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

        'new': function newFn(parentUrl, parentId, crudUrl, optionsArg) {
            var crudId = CrudHelper.getIdFromBaseUrl(crudUrl);
            var options = this.parseDetailsOptions(optionsArg);
            options.edit = false;

            if (this.allowPage(crudId, 'create')) {
                this.details(crudId, parentId, null, options);
            }
        },

        view: function view(parentUrl, parentId, crudUrl, id, optionsArg) {
            var crudId = CrudHelper.getIdFromBaseUrl(crudUrl);
            var options = this.parseDetailsOptions(optionsArg);
            options.edit = false;

            if (this.allowPage(crudId, 'read')) {
                this.details(crudId, parentId, id, options);
            }
        },

        edit: function edit(parentUrl, parentId, crudUrl, id, optionsArg) {
            var crudId = CrudHelper.getIdFromBaseUrl(crudUrl);
            var options = this.parseDetailsOptions(optionsArg);
            options.edit = true;

            if (this.allowPage(crudId, 'update')) {
                this.details(crudId, parentId, id, options);
            }
        },

        getListsPromise: function getListsPromise(crudId) {
            var fieldLists = CrudHelper.getFieldListNames(crudId);
            var deferred = jQuery.Deferred();
            var collection;
            var fetchPromise;
            if (fieldLists.length > 0) {
                collection = new CrudRecordListCollection(null, {
                    crudId: crudId,
                    listIds: fieldLists
                });
                fetchPromise = collection.fetch();
                fetchPromise.done(function doneFn() {
                    CrudHelper.addLists(collection);
                    deferred.resolveWith(fetchPromise, arguments);
                }).fail(function failFn() {
                    deferred.rejectWith(fetchPromise, arguments);
                });
            } else {
                deferred.resolve();
            }
            return deferred.promise();
        },

        details: function details(crudId, parentId, id, options) {
            var promises = [
                this.getListsPromise(crudId)
            ];
            var model = new CrudRecordModel({
                internalid: id,
                parent: parentId,
                crudId: crudId
            });
            var view = new CrudDetailsView(_.extend(options, {
                application: this.application,
                crudId: crudId,
                parent: parentId,
                model: model
            }));
            view.showContentBefore();
            if (id) {
                promises.push(model.fetch());
            }
            jQuery.when.apply(jQuery, promises).done(function done() {
                view.showContentAfter();
            });
        },

        allowPage: function allowPage(crudId, permission) {
            var view;
            if (!CrudHelper.isPermissionAllowed(crudId, permission)) {
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
