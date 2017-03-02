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

        initialize: function initialize(models, options) {
            this.customFilters = options && options.filters;
        },

        parse: function parse(response) {
            this.totalRecordsFound = response.totalRecordsFound;
            this.recordsPerPage = response.recordsPerPage;

            return response.records;
        },

        update: function update(options) {
            var range = options.range || {};
            var data = {
                filter: this.customFilters || (options.filter && options.filter.value),
                sort: options.sort.value,
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
