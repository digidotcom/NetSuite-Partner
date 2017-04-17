define('CRUD.List.View', [
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
    'ListHeader.View',
    'RecordViews.Actionable.View',
    'CRUD.Helper',
    'CRUD.AbstractView',
    'CRUD.List.Actions.View',
    'CRUD.Status.View',
    'crud_list.tpl'
], function CrudListView(
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
    ListHeaderView,
    RecordViewsActionableView,
    CrudHelper,
    CrudAbstractView,
    CrudListActionsView,
    CrudStatusView,
    crudListTpl
) {
    'use strict';

    var isoDate = Utils.dateToString(new Date());

    return CrudAbstractView.extend({

        template: crudListTpl,

        pageHeader: '',
        titleSuffix: '',
        breadcrumbPart: [],

        events: {
            'click [data-action="navigate"]': 'navigateToEntry'
        },

        rangeFilterOptions: {
            fromMin: '1800-01-02',
            fromMax: isoDate,
            toMin: '1800-01-02',
            toMax: isoDate
        },

        sortOptions: [
            {
                value: 'date',
                name: Utils.translate('Sort By Date'),
                selected: true
            }
        ],

        initialize: function initialize(options) {
            this.application = options.application;
            this.crudId = options.crudId;
            this.collection = options.collection;
            this.statusCollection = options.statusCollection;
            this.hasStatus = !!this.statusCollection;
            this.pageHeader = CrudHelper.getNames(this.crudId).singular;

            this.listenCollection();

            this.initializeChildViews(options);

            this.prepareListColumns();

            BackboneCompositeView.add(this);
        },

        initializeChildViews: function initializeChildViews(options) {
            // in initialize to avoid render loop
            this.listHeader = new ListHeaderView({
                view: this,
                application: this.application,
                collection: this.collection,
                sorts: this.sortOptions,
                rangeFilter: 'date',
                rangeFilterLabel: Utils.translate('From'),
                hidePagination: true
            });
            if (this.hasStatus) {
                this.statusesView = new CrudStatusView({
                    collection: this.statusCollection,
                    crudId: this.crudId,
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
            var permissions = CrudHelper.getPermissions(crudId);
            var href;
            var id;
            // ignore clicks on anchors and buttons
            if (Utils.isTargetActionable(e)) {
                return;
            }
            if (permissions.read) {
                id = jQuery(e.target).closest('[data-id]').data('id');
                href = CrudHelper.getViewUrl(crudId, id);
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
                var permissions = CrudHelper.getPermissions(crudId);
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
                        detailsURL: permissions.read ? CrudHelper.getViewUrl(crudId, internalid) : '',
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
                        actionView: CrudListActionsView,
                        actionOptions: {
                            crudId: crudId
                        }
                    }
                });
            }
        },

        getContext: function getContext() {
            var crudId = this.crudId;
            var permissions = CrudHelper.getPermissions(crudId);
            return {
                crudId: crudId,
                pageHeader: this.pageHeader,
                collectionLengthGreaterThan0: this.collection.length > 0,
                isLoading: this.isLoading,
                listColumns: this.listColumns,
                showPagination: !!(this.collection.totalRecordsFound && this.collection.recordsPerPage),
                showCurrentPage: this.options.showCurrentPage,
                showBackToAccount: true,
                showNewButton: permissions.create,
                newUrl: CrudHelper.getNewUrl(crudId),
                rowsAreClickable: permissions.read,
                showActionsHeader: permissions.update
            };
        }
    });
});
