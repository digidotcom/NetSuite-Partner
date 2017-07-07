define('Documents.Router', [
    'underscore',
    'Backbone',
    'Utils',
    'Documents.Marketing.View',
    'Documents.PriceList.View',
    'Documents.PriceList.Collection'
], function DocumentsRouter(
    _,
    Backbone,
    Utils,
    DocumentsMarketingView,
    DocumentsPriceListView,
    DocumentsMarketingCollection
) {
    'use strict';

    return Backbone.Router.extend({

        routes: {
            'documents': 'showDocumentsPage',
            'pricelists': 'showPriceListsPage',
            'pricelists?:options': 'showPriceListsPage'
        },

        initialize: function initialize(application) {
            this.application = application;
        },

        showDocumentsPage: function showDocumentsPage() {
            var view = new DocumentsMarketingView({
                application: this.application
            });
            view.showContent();
        },

        showPriceListsPage: function showPriceListsPage(optionsArg) {
            var options = this.parseListOptions(optionsArg);
            var collection = new DocumentsMarketingCollection(null, {
                recordsPerPage: options.show
            });

            var view = new DocumentsPriceListView({
                application: this.application,
                collection: collection
            });

            collection.on('reset', view.showContent, view);

            view.showContent();
        },

        parseListOptions: function parseListOptions(optionsArg) {
            var defaults = {
                page: 1, // default to 1
                show: 10 // default to 10
            };
            var options = defaults;
            if (optionsArg) {
                options = Utils.parseUrlOptions(optionsArg);
                options.page = parseInt(options.page, 10) || defaults.page;
                options.show = parseInt(options.show, 10) || defaults.show;
            }
            return options;
        }

    });
});
