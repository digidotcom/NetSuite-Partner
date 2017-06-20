define('CRUD.Record.List.View', [
    'underscore',
    'Backbone',
    'jQuery',
    'Handlebars',
    'Utils',
    'SC.Configuration',
    'Backbone.CompositeView',
    'Backbone.CollectionView',
    'GlobalViews.Pagination.View',
    'GlobalViews.ShowingCurrent.View',
    'RecordViews.Actionable.View',
    'CRUD.Helper',
    'CRUD.AbstractView',
    'CRUD.ListHeader.View',
    'CRUD.Record.List.Actions.View',
    'CRUD.Status.View',
    'crud_list.tpl'
], function CrudRecordListView(
    _,
    Backbone,
    jQuery,
    Handlebars,
    Utils,
    Configuration,
    BackboneCompositeView,
    BackboneCollectionView,
    GlobalViewsPaginationView,
    GlobalViewsShowingCurrentView,
    RecordViewsActionableView,
    CrudHelper,
    CrudAbstractView,
    CrudListHeaderView,
    CrudRecordListActionsView,
    CrudStatusView,
    crudListTpl
) {
    'use strict';

    return CrudAbstractView.extend({

        template: crudListTpl,

        pageHeader: '',
        titleSuffix: '',
        breadcrumbPart: [],

        events: {
            'click [data-action="navigate"]': 'navigateToEntry'
        },

        rangeFilterOptions: null,

        sortOptions: null,

        initialize: function initialize(options) {
            this.application = this.application || options.application;
            this.crudId = this.crudId || options.crudId;
            this.collection = this.collection || options.collection;
            this.statusCollection = this.statusCollection || options.statusCollection;
            this.hasStatus = !!this.statusCollection;
            this.parent = this.collection.parent;
            this.parentModel = this.parentModel || options.parentModel;

            this.listenCollection();

            this.initializeChildViews(options);

            this.prepareListColumns();

            BackboneCompositeView.add(this);
        },

        hasListHeader: function hasListHeader() {
            return !this.sortOptions && !this.rangeFilterOptions && !this.hidePagination;
        },

        initializeChildViews: function initializeChildViews(options) {
            // in initialize to avoid render loop
            this.listHeader = new CrudListHeaderView({
                view: this,
                application: this.application,
                collection: this.collection,
                sorts: this.sortOptions,
                rangeFilter: this.rangeFilterOptions ? 'date' : null,
                rangeFilterLabel: Utils.translate('From'),
                hidePagination: true
            });
            if (this.hasStatus) {
                this.statusesView = new CrudStatusView({
                    collection: this.statusCollection,
                    crudId: this.crudId,
                    parent: this.parent,
                    active: options.status
                });
            }
        },

        prepareListColumns: function prepareListColumns() {
            var crudId = this.crudId;
            var listColumns = CrudHelper.getListColumnFields(crudId);
            var columns = [];
            _(listColumns).each(function eachListColumn(field) {
                var attribute = field.attribute;
                var isDate = _.indexOf(['datetime', 'date'], field.type) >= 0;
                var type = isDate ? 'date' : 'text';
                var label = field.labelShort ? field.labelShort : field.label;
                columns.push({
                    field: field,
                    title: label,
                    label: Utils.translate('$(0):', label),
                    type: type,
                    attribute: attribute
                });
            });
            this.listColumns = columns;
        },

        navigateToEntry: function navigateToEntry(e) {
            var crudId = this.crudId;
            var parentId = this.parent;
            var parentModel = this.parentModel;
            var href;
            var id;
            // ignore clicks on anchors and buttons
            if (Utils.isTargetActionable(e)) {
                return;
            }
            if (CrudHelper.allowNavigateToView(crudId, parentModel)) {
                id = jQuery(e.target).closest('[data-id]').data('id');
                href = CrudHelper.getViewUrl(crudId, id, parentId);
                Backbone.history.navigate(href, { trigger: true });
            }
        },

        listenCollection: function listenCollection() {
            var self = this;
            this.setLoading(true);
            this.collection.on({
                request: function onRequest() {
                    self.setLoading(true);
                },
                reset: function onReset() {
                    self.setLoading(false);
                }
            });
        },

        setLoading: function setLoading(value) {
            this.isLoading = value;
        },

        refreshStatuses: function refreshStatuses() {
            this.statusesView.render();
        },

        getPageHeader: function getPageHeader() {
            return CrudHelper.getNames(this.crudId).plural;
        },

        childViews: {
            'ListHeader': function ListHeader() {
                return this.listHeader;
            },

            'CRUD.Statuses': function CrudStatuses() {
                return this.statusesView;
            },

            'GlobalViews.Pagination': function GlobalViewsPagination() {
                return new GlobalViewsPaginationView(_.extend({
                    totalPages: Math.ceil(this.collection.totalRecordsFound / this.collection.recordsPerPage)
                }, Configuration.defaultPaginationSettings));
            },

            'GlobalViews.ShowCurrentPage': function GlobalViewsShowCurrentPage() {
                return new GlobalViewsShowingCurrentView({
                    items_per_page: this.collection.recordsPerPage,
                    total_items: this.collection.totalRecordsFound,
                    total_pages: Math.ceil(this.collection.totalRecordsFound / this.collection.recordsPerPage)
                });
            },

            'ListResults': function ListResults() {
                var crudId = this.crudId;
                var parentId = this.parent;
                var parentModel = this.parentModel;
                var listColumns = this.listColumns;
                var recordsCollection = new Backbone.Collection(this.collection.map(function map(model) {
                    var internalid = model.get('internalid');
                    var columns = [];
                    _(listColumns).each(function eachListColumn(column) {
                        var attribute = column.attribute;
                        var value = model.get(attribute);
                        var isComplex = _.isObject(value);
                        columns.push({
                            label: column.label,
                            type: column.type,
                            name: attribute,
                            value: isComplex ? value.name : value
                        });
                    });

                    return new Backbone.Model({
                        title: new Handlebars.SafeString(Utils.translate('<span class="tranid">$(0)</span>', internalid)),
                        record: model,
                        touchpoint: 'customercenter',
                        detailsURL: CrudHelper.allowNavigateToView(crudId, parentModel) ? CrudHelper.getViewUrl(crudId, internalid, parentId) : '',
                        id: internalid,
                        internalid: internalid,
                        columns: columns
                    });
                }));

                return new BackboneCollectionView({
                    childView: RecordViewsActionableView,
                    collection: recordsCollection,
                    viewsPerRow: 1,
                    childViewOptions: {
                        actionView: CrudRecordListActionsView,
                        actionOptions: {
                            crudId: crudId,
                            parent: parentId,
                            parentModel: parentModel
                        }
                    }
                });
            }
        },

        getContext: function getContext() {
            var crudId = this.crudId;
            var parentModel = this.parentModel;
            var permissions = CrudHelper.getPermissions(crudId, parentModel);
            var parentId = this.parent;
            return {
                crudId: crudId,
                pageHeader: this.getPageHeader(),
                collectionLengthGreaterThan0: this.collection.length > 0,
                isLoading: this.isLoading,
                showListHeader: this.hasListHeader(),
                showStatuses: this.hasStatus,
                listColumns: this.listColumns,
                showPagination: !!(this.collection.totalRecordsFound && this.collection.recordsPerPage),
                showCurrentPage: this.options.showCurrentPage,
                showBackToAccount: true,
                showNewButton: permissions.create,
                newUrl: CrudHelper.getNewUrl(crudId, parentId),
                rowsAreClickable: permissions.read,
                showActionsHeader: permissions.update
            };
        }
    });
});
