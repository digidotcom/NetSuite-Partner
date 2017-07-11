define('Documents.PriceList.Collection', [
    'underscore',
    'Backbone',
    'Utils',
    'Documents.PriceList.Model'
], function DocumentsMarketingCollection(
    _,
    Backbone,
    Utils,
    DocumentsPriceListModel
) {
    'use strict';

    return Backbone.CachedCollection.extend({
        model: DocumentsPriceListModel,

        url: Utils.getAbsoluteUrl('services/Documents.PriceList.Service.ss'),

        initialize: function initialize(options) {
            this.customFilters = options && options.filters;
            this.recordsPerPage = options && options.recordsPerPage;
        },

        parse: function parse(response) {
            this.totalRecordsFound = response.totalRecordsFound;
            this.recordsPerPage = response.recordsPerPage;

            return response.records;
        },

        update: function update(options) {
            var range = options.range || {};
            var data = {
                results_per_page: options.recordsPerPage || this.recordsPerPage,
                sort: options.sort && options.sort.value,
                order: options.order,
                from: range.from ? new Date(range.from.replace(/-/g, '/')).getTime() : null,
                to: range.to ? new Date(range.to.replace(/-/g, '/')).getTime() : null,
                page: options.page
            };

            this.fetch({
                data: data,
                reset: true,
                killerId: options.killerId
            });
        }
    });
});
