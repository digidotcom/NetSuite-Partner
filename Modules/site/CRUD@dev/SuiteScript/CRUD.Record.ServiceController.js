define('CRUD.Record.ServiceController', [
    'underscore',
    'ServiceController',
    'CRUD.Configuration',
    'CRUD.Record.Model'
], function CrudRecordServiceController(
    _,
    ServiceController,
    CrudConfiguration,
    CrudRecordModel
) {
    'use strict';

    return ServiceController.extend({
        name: 'CRUD.Record.ServiceController',

        options: {
            common: {
                requireSecure: true,
                requireLogin: true
            }
        },

        validateCrudId: function validateCrudId(crudId) {
            if (!crudId || !CrudConfiguration.isValid(crudId)) {
                throw badRequestError;
            }
        },
        validateId: function validateId(id) {
            if (!id) {
                throw badRequestError;
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
            var crudId = this.request.getParameter('id');
            var id = this.request.getParameter('internalid');

            this.validateCrudId(crudId);

            if (id) {
                return CrudRecordModel.get(crudId, id);
            }
            return CrudRecordModel.list(crudId, this.getListParameters());
        },

        post: function post() {
            var crudId = this.request.getParameter('id');
            var id;

            this.validateCrudId(crudId);

            id = CrudRecordModel.create(crudId, this.data);
            this.sendContent(CrudRecordModel.get(crudId, id), { status: 201 });
        },

        put: function put() {
            var crudId = this.request.getParameter('id');
            var id = this.request.getParameter('internalid');

            this.validateCrudId(crudId);
            this.validateId(id);

            CrudRecordModel.update(crudId, id, this.data);
            return CrudRecordModel.get(crudId, id);
        }
    });
});
