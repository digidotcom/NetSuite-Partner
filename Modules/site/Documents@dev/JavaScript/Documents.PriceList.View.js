define('Documents.PriceList.View', [
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
    'Documents.PriceList.Actionable.View',
    'Documents.PriceList.Actions.View',
    'Documents.PriceList.Model',
    'documents_pricelists.tpl'
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
    DocumentsPriceListActionableView,
    DocumentsPriceListActionsView,
    DocumentsPriceListModel,
    documentsPriceListsTpl
) {
    'use strict';

    return Backbone.View.extend({

        template: documentsPriceListsTpl,

        events: {
            'click [data-action="navigate"]': 'navigateToEntry'
        },

        initialize: function initialize(options) {
            this.application = options.application;
            this.collection = this.collection || options.collection;

            this.listenCollection();
            this.initializeChildViews();

            BackboneCompositeView.add(this);
        },

        getSelectedMenu: function getSelectedMenu() {
            return 'pricelists';
        },
        getTitle: function getTitle() {
            return Utils.translate('Price Lists');
        },
        getBreadcrumbPages: function getBreadcrumbPages() {
            return [
                {
                    text: Utils.translate('Price Lists'),
                    href: 'pricelists'
                }
            ];
        },

        getDownloadUrl: function getDownloadUrl(id) {
            var model = this.collection.find(function findModel(collectionModel) {
                var modelId = parseInt(collectionModel.get('internalid'), 10);
                return modelId === id;
            });
            if (model && (model instanceof DocumentsPriceListModel)) {
                return model.getDownloadUrl();
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
                href = this.getDownloadUrl(id);
                if (href) {
                    window.location.href = href;
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
            this.listHeader = new ListHeaderView({
                view: this,
                application: this.application,
                collection: this.collection,
                sorts: this.sortOptions,
                rangeFilter: null,
                rangeFilterLabel: null,
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
                    var internalid = model.get('internalid');
                    var columns = [
                        {
                            label: Utils.translate('Name: '),
                            type: 'text',
                            name: 'name',
                            value: model.get('name')
                        },
                        {
                            label: Utils.translate('File Name: '),
                            type: 'text',
                            name: 'filename',
                            value: model.get('fileName')
                        }
                    ];

                    return new Backbone.Model({
                        title: new Handlebars.SafeString(Utils.translate('<span class="tranid">$(0)</span>', internalid)),
                        record: model,
                        detailsURL: model.getDownloadUrl(),
                        id: internalid,
                        internalid: internalid,
                        columns: columns
                    });
                }));

                return new BackboneCollectionView({
                    childView: DocumentsPriceListActionableView,
                    collection: recordsCollection,
                    viewsPerRow: 1,
                    childViewOptions: {
                        actionView: DocumentsPriceListActionsView,
                        actionOptions: {}
                    }
                });
            }
        },

        getContext: function getContext() {
            return {
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
