define('Documents.PriceList.ServiceController', [
    'underscore',
    'ServiceController',
    'Documents.PriceList.Model'
], function DocumentsPriceListServiceController(
    _,
    ServiceController,
    DocumentsPriceListModel
) {
    'use strict';

    return ServiceController.extend({
        name: 'Documents.PriceList.ServiceController',

        options: {
            common: {
                requireSecure: true,
                requireLogin: true
            }
        },

        getAllParameters: function getAllParameters() {
            var parameters = this.request.getAllParameters();
            var index;
            var result = {};
            for (index in parameters) { // eslint-disable-line
                if (Object.prototype.hasOwnProperty.call(parameters, index)) {
                    result[index] = parameters[index];
                }
            }
            return result;
        },

        getListParameters: function getListParameters() {
            var parameters = this.getAllParameters();
            var keys = {
                order: 'order',
                sort: 'sort',
                from: 'from',
                to: 'to',
                page: 'page',
                results_per_page: 'resultsPerPage'
            };
            var filters = {};
            var result = {};
            _(parameters).each(function eachParameter(value, key) {
                if (key in keys) {
                    result[keys[key]] = value;
                } else {
                    filters[key] = value;
                }
            });
            result.filters = filters;
            return result;
        },

        get: function get() {
            return DocumentsPriceListModel.list(this.getListParameters());
        }
    });
});
