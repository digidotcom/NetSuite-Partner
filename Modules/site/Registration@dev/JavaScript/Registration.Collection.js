define('Registration.Collection', [
    'Backbone',
    'Utils',
    'Registration.Model'
], function RegistrationCollection(
    Backbone,
    Utils,
    RegistrationModel
) {
    'use strict';

    return Backbone.Collection.extend({

        url: Utils.getAbsoluteUrl('services/Registration.Service.ss'),

        model: RegistrationModel,

        initialize: function initialize(options) {
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
            var data = {
                results_per_page: options.recordsPerPage || this.recordsPerPage,
                sort: options.sort.value,
                order: options.order,
                status: options.status || this.status,
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
