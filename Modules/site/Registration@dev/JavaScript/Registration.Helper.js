define('Registration.Helper', [
    'Utils'
], function RegistrationHelper(
    Utils
) {
    'use strict';

    function slash(noSlash) {
        return noSlash ? '' : '/';
    }

    return {
        baseUrl: 'registrations',
        moduleName: 'Registration',
        serviceUrl: 'services/Registration.Service.ss',
        statusParamKey: 'status',
        statusAllName: 'All',
        statusServiceUrl: Utils.getAbsoluteUrl('services/Registration.Status.Service.ss'),
        getServiceUrl: function getServiceUrl(absolute) {
            var url = this.serviceUrl;
            return absolute ? Utils.getAbsoluteUrl(url) : url;
        },
        getListUrl: function getListUrl(noSlash) {
            return slash(noSlash) + this.baseUrl;
        },
        getNewUrl: function getNewUrl(noSlash) {
            return slash(noSlash) + this.baseUrl + '/new';
        },
        getViewUrl: function getViewUrl(id, noSlash) {
            return slash(noSlash) + this.baseUrl + '/view/' + id;
        },
        getEditUrl: function getEditUrl(id, noSlash) {
            return slash(noSlash) + this.baseUrl + '/edit/' + id;
        }
    };
});
