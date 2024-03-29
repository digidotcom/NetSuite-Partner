define('CRUD.Record.Collection', [
    'Backbone',
    'CRUD.Helper',
    'CRUD.Record.Model'
], function CrudRecordCollection(
    Backbone,
    CrudHelper,
    CrudRecordModel
) {
    'use strict';

    return Backbone.Collection.extend({

        model: CrudRecordModel,

        initialize: function initialize(elements, options) {
            this.crudId = options.crudId;
            this.customFilters = options && options.filters;
            this.recordsPerPage = options && options.recordsPerPage;
            this.status = options && options.status;
            this.parent = options && options.parent;
            this.setUrl();
        },

        setUrl: function setUrl() {
            this.url = CrudHelper.getRecordServiceUrl(this.crudId, true);
        },

        parse: function parse(response) {
            this.totalRecordsFound = response.totalRecordsFound;
            this.recordsPerPage = response.recordsPerPage;

            return response.records;
        },

        update: function update(options) {
            var range = options.range || {};
            var status = options.status || this.status;
            var parent = options.parent || this.parent;
            var data = {
                results_per_page: options.recordsPerPage || this.recordsPerPage,
                sort: options.sort && options.sort.value,
                order: options.order,
                from: range.from ? new Date(range.from.replace(/-/g, '/')).getTime() : null,
                to: range.to ? new Date(range.to.replace(/-/g, '/')).getTime() : null,
                page: options.page
            };
            if (status) {
                data.status = status;
            }
            if (parent) {
                data.parent = parent;
            }

            this.fetch({
                data: data,
                reset: true,
                killerId: options.killerId
            });
        }
    });
});
