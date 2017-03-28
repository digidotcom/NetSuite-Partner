define('Registration.Collection', [
    'Backbone',
    'Registration.Helper',
    'Registration.Model'
], function RegistrationCollection(
    Backbone,
    RegistrationHelper,
    RegistrationModel
) {
    'use strict';

    return Backbone.Collection.extend({

        url: RegistrationHelper.getServiceUrl(true),

        model: RegistrationModel,

        initialize: function initialize(elements, options) {
            this.customFilters = options && options.filters;
            this.recordsPerPage = options && options.recordsPerPage;
            this.status = options && options.status;
        },

        parse: function parse(response) {
            this.totalRecordsFound = response.totalRecordsFound;
            this.recordsPerPage = response.recordsPerPage;

            return response.records;
        },

        update: function update(options) {
            var range = options.range || {};
            var status = options.status || this.status;
            var data = {
                results_per_page: options.recordsPerPage || this.recordsPerPage,
                sort: options.sort.value,
                order: options.order,
                from: range.from ? new Date(range.from.replace(/-/g, '/')).getTime() : null,
                to: range.to ? new Date(range.to.replace(/-/g, '/')).getTime() : null,
                page: options.page
            };
            if (status) {
                data.status = status;
            }

            this.fetch({
                data: data,
                reset: true,
                killerId: options.killerId
            });
        }
    });
});
