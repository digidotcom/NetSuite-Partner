define('CRUD.Search.Results.View', [
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
    'ListHeader.View',
    'CRUD.Helper',
    'CRUD.AbstractView',
    'CRUD.ListHeader.View',
    'CRUD.Search.Results.Actionable.View',
    'CRUD.Search.Results.Actions.View',
    'CRUD.Search.Model',
    'crud_search_results.tpl'
], function DocumentsMarketingView(
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
    ListHeaderView,
    CrudHelper,
    CrudAbstractView,
    CrudListHeaderView,
    CrudSearchResultsActionableView,
    CrudSearchResultsActionsView,
    CrudSearchModel,
    crudSearchResultsTpl
) {
    'use strict';

    return CrudAbstractView.extend({

        template: crudSearchResultsTpl,

        events: {
            'click [data-action="navigate"]': 'navigateToEntry'
        },

        initialize: function initialize(options) {
            this.application = options.application;
            this.collection = this.collection || options.collection;

            this.setQuery(options.query);
            this.listenCollection();
            this.initializeChildViews();

            BackboneCompositeView.add(this);
        },

        getSelectedMenu: function getSelectedMenu() {
            return '';
        },
        getTitle: function getTitle() {
            if (this.hasQuery()) {
                return Utils.translate('Search Results for "$(0)"', this.query);
            }
            return Utils.translate('Search Results');
        },
        getBreadcrumbPages: function getBreadcrumbPages() {
            return [
                {
                    text: Utils.translate('Search Results'),
                    href: ''
                }
            ];
        },

        setQuery: function setQuery(query) {
            this.query = query || null;
        },
        getQuery: function getQuery() {
            return this.query;
        },
        hasQuery: function hasQuery() {
            return !!this.getQuery();
        },
        getViewUrl: function getDownloadUrl(id) {
            var model = this.collection.find(function findModel(collectionModel) {
                var modelId = parseInt(collectionModel.get('_id'), 10);
                return modelId === id;
            });
            if (model && (model instanceof CrudSearchModel)) {
                return model.get('_url');
            }
            return '';
        },
        navigateToEntry: function navigateToEntry(e) {
            var href;
            var id;
            // ignore clicks on anchors and buttons
            if (Utils.isTargetActionable(e)) {
                return;
            }
            id = parseInt(jQuery(e.target).closest('[data-id]').data('id'), 10);
            if (id && !isNaN(id)) {
                href = this.getViewUrl(id);
                if (href) {
                    Backbone.history.navigate(href, { trigger: true });
                }
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

        initializeChildViews: function initializeChildViews() {
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
        },

        hasListHeader: function hasListHeader() {
            return !this.sortOptions && !this.rangeFilterOptions && !this.hidePagination;
        },

        setLoading: function setLoading(value) {
            this.isLoading = value;
        },

        childViews: {
            'ListHeader': function ListHeader() {
                return this.listHeader;
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
                var recordsCollection = new Backbone.Collection(this.collection.map(function map(model) {
                    var internalid = model.get('_id');
                    var columns = [
                        {
                            label: Utils.translate('Type: '),
                            type: 'text',
                            name: 'type',
                            value: model.get('_record')
                        },
                        {
                            label: Utils.translate('Name: '),
                            type: 'text',
                            name: 'name',
                            value: model.get('_name')
                        }
                    ];

                    return new Backbone.Model({
                        title: new Handlebars.SafeString(Utils.translate('<span class="tranid">$(0)</span>', internalid)),
                        record: model,
                        detailsURL: model.get('_url'),
                        id: internalid,
                        internalid: internalid,
                        columns: columns
                    });
                }));

                return new BackboneCollectionView({
                    childView: CrudSearchResultsActionableView,
                    collection: recordsCollection,
                    viewsPerRow: 1,
                    childViewOptions: {
                        actionView: CrudSearchResultsActionsView,
                        actionOptions: {}
                    }
                });
            }
        },

        getContext: function getContext() {
            return {
                hasQuery: this.hasQuery(),
                query: this.getQuery(),
                pageHeader: this.getTitle(),
                collectionLengthGreaterThan0: this.collection.length > 0,
                isLoading: this.isLoading,
                showListHeader: this.hasListHeader(),
                listColumns: this.listColumns,
                showPagination: !!(this.collection.totalRecordsFound && this.collection.recordsPerPage),
                showCurrentPage: this.options.showCurrentPage,
                rowsAreClickable: true,
                showActionsHeader: true,
                showBackToAccount: true
            };
        }
    });
});
