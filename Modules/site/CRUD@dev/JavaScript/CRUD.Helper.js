define('CRUD.Helper', [
    'underscore',
    'Utils',
    'CRUD.Configuration'
], function CrudHelper(
    _,
    Utils,
    CrudConfiguration
) {
    'use strict';

    return {
        getRecordServiceUrl: function getServiceUrl(crudId, absolute) {
            var url = CrudConfiguration.get(crudId).recordServiceUrl;
            return absolute ? Utils.getAbsoluteUrl(url) : url;
        },
        getCategoryServiceUrl: function getCategoryServiceUrl(crudId, absolute) {
            var categoryId = this.getCategoryId(crudId);
            if (categoryId) {
                return this.getRecordServiceUrl(categoryId, absolute);
            }
            return null;
        },
        hasCategory: function hasCategory(crudId) {
            return !!this.getCategory(crudId);
        },
        getCategory: function getCategory(crudId) {
            return CrudConfiguration.get(crudId).category;
        },
        getCategoryId: function getCategoryId(crudId) {
            var category = this.getCategory(crudId);
            return category && category.crudId;
        },
        getCategoryFilterName: function getCategoryId(crudId) {
            var category = this.getCategory(crudId);
            return category && category.filterName;
        },
        getCategoryAllLabel: function getCategoryAllLabel() {
            return Utils.translate('All');
        },
        getPermissions: function getPermissions(crudId) {
            return CrudConfiguration.get(crudId).permissions || {};
        },
        isCrudType: function isCrudType(type) {
            return type === 'crud';
        },
        getIdFromBaseUrl: function getIdFromBaseUrl(baseUrl) {
            var configs = CrudConfiguration.getAll();
            var crudId = null;
            _(configs).find(function eachConfig(config, id) {
                if (config.frontend.baseKey === baseUrl) {
                    crudId = id;
                    return true;
                }
                return false;
            });
            return crudId;
        },

        getBaseUrl: function getBaseUrl(crudId) {
            var config = CrudConfiguration.get(crudId);
            if (this.isCrudType(config.type)) {
                return config.frontend.baseKey;
            }
            return null;
        },
        getBaseUrls: function getUrlRegex(permission) {
            var self = this;
            var urls = [];
            var crudIds = CrudConfiguration.getCrudIds();
            _(crudIds).each(function eachConfig(crudId) {
                var permissions = self.getPermissions(crudId);
                var baseUrl;
                if (permissions[permission]) {
                    baseUrl = self.getBaseUrl(crudId);
                    if (baseUrl) {
                        urls.push(baseUrl);
                    }
                }
            });
            return urls;
        },

        getUrlsRegex: function getUrlsRegex(permission, urlComponent) {
            var urls = this.getBaseUrls(permission);
            return new RegExp('^(' + urls.join('|') + ')' + (urlComponent || '') + '\\??(.*)$');
        },
        getListUrlRegex: function getListUrlRegex(permission) {
            return this.getUrlsRegex(permission);
        },
        getNewUrlRegex: function getNewUrlRegex(permission) {
            return this.getUrlsRegex(permission, '/new');
        },
        getViewUrlRegex: function getViewUrlRegex(permission) {
            return this.getUrlsRegex(permission, '/view/(\\d+)');
        },
        getEditUrlRegex: function getEditUrlRegex(permission) {
            return this.getUrlsRegex(permission, '/edit/(\\d+)');
        },

        getUrl: function getUrl(crudId, urlComponent) {
            return this.getBaseUrl(crudId) + (urlComponent || '');
        },
        getListUrl: function getListUrl(crudId) {
            return this.getUrl(crudId);
        },
        getNewUrl: function getNewUrl(crudId) {
            return this.getUrl(crudId, '/new');
        },
        getViewUrl: function getViewUrl(crudId, id) {
            return this.getUrl(crudId, '/view/' + id);
        },
        getEditUrl: function getEditUrl(crudId, id) {
            return this.getUrl(crudId, '/edit/' + id);
        }
    };
});
