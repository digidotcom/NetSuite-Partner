define('CRUD.Helper.Urls', [
    'underscore',
    'CRUD.Configuration'
], function CrudHelperUrls(
    _,
    CrudConfiguration
) {
    'use strict';

    return {
        getIdFromBaseUrl: function getIdFromBaseUrl(baseUrl) {
            var configs = CrudConfiguration.getAll();
            var crudId = null;
            _(configs).find(function eachConfig(config, id) {
                if (config && config.frontend && config.frontend.baseKey === baseUrl) {
                    crudId = id;
                    return true;
                }
                return false;
            });
            return crudId;
        },
        getParentBaseUrl: function getParentBaseUrl(crudId) {
            var parentCrudId = this.getParentCrudId(crudId);
            return parentCrudId && this.getBaseUrl(parentCrudId);
        },
        getBaseUrl: function getBaseUrl(crudId) {
            return this.getBaseKey(crudId);
        },
        getUrlsRegex: function getUrlsRegex(permission, urlComponent) {
            var self = this;
            var urls = [];
            var crudIds = CrudConfiguration.getCrudIds();
            _(crudIds).each(function eachConfig(crudId) {
                var permissions = self.getPermissions(crudId);
                var baseUrl = '';
                var parentBaseUrl;
                var regex;
                if (permissions[permission]) {
                    parentBaseUrl = self.getParentBaseUrl(crudId);
                    if (parentBaseUrl) {
                        baseUrl += '(' + parentBaseUrl + ')/(\\d+)/';
                    } else {
                        baseUrl += '()?()?'; // dummy groups to ease router matching
                    }
                    baseUrl += '(' + self.getBaseUrl(crudId) + ')';
                    if (baseUrl) {
                        regex = new RegExp('^' + baseUrl + (urlComponent || '') + '\\??(.*)$');
                        urls.push(regex);
                    }
                }
            });
            return urls;
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
        getParentUrl: function getParentUrl(crudId, parentId) {
            return this.getParentBaseUrl(crudId) + '/' + parentId;
        },
        getUrl: function getUrl(crudId, urlComponent, parentId) {
            var parentUrl = '';
            if (parentId) {
                parentUrl = this.getParentUrl(crudId, parentId) + '/';
            }
            return parentUrl + this.getBaseUrl(crudId) + (urlComponent || '');
        },
        getListUrl: function getListUrl(crudId, parentId) {
            return this.getUrl(crudId, null, parentId);
        },
        getNewUrl: function getNewUrl(crudId, parentId) {
            return this.getUrl(crudId, '/new', parentId);
        },
        getViewUrl: function getViewUrl(crudId, id, parentId) {
            return this.getUrl(crudId, '/view/' + id, parentId);
        },
        getEditUrl: function getEditUrl(crudId, id, parentId) {
            return this.getUrl(crudId, '/edit/' + id, parentId);
        },

        getUrlForPage: function getUrlForPage(page, crudId, id, parentId) {
            switch (page) {
            case 'list':
                return this.getListUrl(crudId, parentId);
            case 'new':
                return this.getNewUrl(crudId, parentId);
            case 'view':
                return this.getViewUrl(crudId, id, parentId);
            case 'edit':
                return this.getEditUrl(crudId, id, parentId);
            default:
                return null;
            }
        }
    };
});
