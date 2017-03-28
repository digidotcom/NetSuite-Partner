define('Registration.ServiceController', [
    'underscore',
    'ServiceController',
    'Registration.Model'
], function RegistrationServiceController(
    _,
    ServiceController,
    RegistrationModel
) {
    'use strict';

    return ServiceController.extend({
        name: 'Registration.ServiceController',

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
            var id = this.request.getParameter('internalid');
            if (id) {
                return RegistrationModel.get(id);
            }
            return RegistrationModel.list(this.getListParameters());
        },

        post: function post() {
            var id = RegistrationModel.create(this.data);
            this.sendContent(RegistrationModel.get(id), { status: 201 });
        },

        put: function put() {
            var id = this.request.getParameter('internalid');
            RegistrationModel.update(id, this.data);
            return RegistrationModel.get(id);
        }
    });
});
