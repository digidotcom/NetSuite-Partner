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
        },
        getMenuItems: function getMenuItems() {
            return {
                id: 'registrations',
                name: Utils.translate('Registrations'),
                url: this.getListUrl(true),
                index: 0,
                children: [
                    {
                        parent: 'registrations',
                        id: 'registrations_all',
                        name: Utils.translate('Registrations'),
                        url: this.getListUrl(true),
                        index: 1
                    },
                    {
                        parent: 'registrations',
                        id: 'registrations_new',
                        name: Utils.translate('New Registration'),
                        url: this.getNewUrl(true),
                        qindex: 2
                    }
                ]
            };
        }
    };
});
