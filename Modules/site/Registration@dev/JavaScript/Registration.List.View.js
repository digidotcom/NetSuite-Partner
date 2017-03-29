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
    'RecordViews.Actionable.View',
    'Registration.Helper',
    'Registration.AbstractView',
    'Registration.List.Actions.View',
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
    RecordViewsActionableView,
    RegistrationHelper,
    RegistrationAbstractView,
    RegistrationListActionsView,
    RegistrationStatusView,
    registrationListTpl
) {
    'use strict';

    var isoDate = Utils.dateToString(new Date());

    return RegistrationAbstractView.extend({

        template: registrationListTpl,

        pageHeader: Utils.translate(RegistrationHelper.moduleName),
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

            this.initializeChildViews(options);

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
            this.statusesView = new RegistrationStatusView({
                collection: this.statusCollection,
                active: options.status
            });
        },

        navigateToEntry: function navigateToEntry(e) {
            var permissions = RegistrationHelper.getCrudPermissions();
            var href;
            var id;
            // ignore clicks on anchors and buttons
            if (Utils.isTargetActionable(e)) {
                return;
            }
            if (permissions.read) {
                id = jQuery(e.target).closest('[data-id]').data('id');
                href = RegistrationHelper.getViewUrl(id);
                Backbone.history.navigate(href, {trigger: true});
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
                var permissions = RegistrationHelper.getCrudPermissions();
                var recordsCollection = new Backbone.Collection(this.collection.map(function map(model) {
                    var internalid = model.get('internalid');
                    var status = model.get('status');
                    var partnerName = model.get('partnerName');
                    var columns = [
                        {
                            label: Utils.translate('Name:'),
                            type: 'text',
                            name: 'name',
                            value: model.get('name')
                        },
                        {
                            label: Utils.translate('Status:'),
                            type: 'name',
                            name: 'status',
                            value: status && status.name
                        },
                        {
                            label: Utils.translate('Approval Date:'),
                            type: 'date',
                            name: 'approvalDate',
                            value: model.get('approvalDate')
                        },
                        {
                            label: Utils.translate('Expiry Date:'),
                            type: 'date',
                            name: 'expiryDate',
                            value: model.get('expiryDate')
                        },
                        {
                            label: Utils.translate('Company Name:'),
                            type: 'text',
                            name: 'companyName',
                            value: model.get('companyName')
                        },
                        {
                            label: Utils.translate('Partner Name:'),
                            type: 'text',
                            name: 'partnerName',
                            value: partnerName && partnerName.name
                        }
                    ];

                    return new Backbone.Model({
                        title: new Handlebars.SafeString(_('<span class="tranid">$(0)</span>').translate(internalid)),
                        record: model,
                        touchpoint: 'customercenter',
                        detailsURL: permissions.read ? RegistrationHelper.getViewUrl(internalid) : '',
                        id: model.get('internalid'),
                        internalid: model.get('internalid'),
                        columns: columns
                    });
                }));

                return new BackboneCollectionView({
                    childView: RecordViewsActionableView,
                    collection: recordsCollection,
                    viewsPerRow: 1,
                    childViewOptions: {
                        actionView: RegistrationListActionsView,
                        actionOptions: {}
                    }
                });
            }
        },

        getContext: function getContext() {
            var permissions = RegistrationHelper.getCrudPermissions();
            return {
                pageHeader: this.pageHeader,
                collectionLengthGreaterThan0: this.collection.length > 0,
                isLoading: this.isLoading,
                showPagination: !!(this.collection.totalRecordsFound && this.collection.recordsPerPage),
                showCurrentPage: this.options.showCurrentPage,
                showBackToAccount: true,
                showNewButton: permissions.create,
                newUrl: RegistrationHelper.getNewUrl(),
                rowsAreClickable: permissions.read,
                showActionsHeader: permissions.update
            };
        }
    });
});
