define('Registration.List.View', [
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
    'RecordViews.View',
    'Registration.AbstractView',
    'Registration.Status.View',
    'registration_list.tpl'
], function RegistrationListView(
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
    RecordViewsView,
    RegistrationAbstractView,
    RegistrationStatusView,
    registrationListTpl
) {
    'use strict';

    var isoDate = Utils.dateToString(new Date());

    return RegistrationAbstractView.extend({

        template: registrationListTpl,

        pageHeader: Utils.translate('Registrations'),
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
            this.collection = options.collection;
            this.statusCollection = options.statusCollection;

            this.listenCollection();

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
            this.statusesView = new RegistrationStatusView({
                collection: this.statusCollection,
                active: options.status
            });

            BackboneCompositeView.add(this);
        },

        navigateToEntry: function navigateToEntry(e) {
            var href;
            // ignore clicks on anchors and buttons
            if (Utils.isTargetActionable(e)) {
                return;
            }
            href = jQuery(e.target).closest('[data-navigation-hashtag]').data('navigation-hashtag');
            Backbone.history.navigate(href, { trigger: true });
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

            'Registration.Statuses': function RegistrationStatuses() {
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

            'ListResults': function RegistrationResults() {
                var recordsCollection = new Backbone.Collection(this.collection.map(function map(model) {
                    var columns = [
                        {
                            label: Utils.translate('Date:'),
                            type: 'date',
                            name: 'date',
                            value: model.get('date')
                        },
                        {
                            label: Utils.translate('Name:'),
                            type: 'name',
                            name: 'name',
                            value: model.get('name')
                        }
                    ];

                    return new Backbone.Model({
                        title: new Handlebars.SafeString(_('<span class="tranid">$(0)</span>').translate(model.get('internalid'))),
                        touchpoint: 'customercenter',
                        detailsURL: '/registrations/view/' + model.get('internalid'),
                        recordType: 'registration',
                        id: model.get('internalid'),
                        internalid: model.get('internalid'),
                        columns: columns
                    });
                }));

                return new BackboneCollectionView({
                    childView: RecordViewsView,
                    collection: recordsCollection,
                    viewsPerRow: 1
                });
            }
        },

        getContext: function getContext() {
            var statuses = [
                {
                    name: 'Approved',
                    value: 'approved',
                    isActive: false
                },
                {
                    name: 'Expired',
                    value: 'expired',
                    isActive: false
                },
                {
                    name: 'Open',
                    value: '',
                    isActive: true
                },
                {
                    name: 'Not Submitted',
                    value: 'notsubmitted',
                    isActive: false
                },
                {
                    name: 'Pending',
                    value: 'pending',
                    isActive: false
                },
                {
                    name: 'Rejected',
                    value: 'rejected',
                    isActive: false
                }
            ];
            return {
                pageHeader: this.pageHeader,
                statuses: statuses,
                collectionLengthGreaterThan0: this.collection.length > 0,
                isLoading: this.isLoading,
                showPagination: !!(this.collection.totalRecordsFound && this.collection.recordsPerPage),
                showCurrentPage: this.options.showCurrentPage,
                showBackToAccount: true,
                allIsActive: this.options.activeTab === 'all',
                openIsActive: this.options.activeTab === 'open'
            };
        }
    });
});
