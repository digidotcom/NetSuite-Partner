define('CRUD.Helper.Search', [
    'underscore',
    'Utils',
    'CRUD.Configuration'
], function CrudHelperSearch(
    _,
    Utils,
    CrudConfiguration
) {
    'use strict';

    return {
        getSearchResultsUrl: function getSearchResultsUrl() {
            return 'crud/search';
        },
        getSearchQueryKey: function getSearchQueryKey() {
            return 'q';
        },
        getSearchConfig: function getSearchConfig(crudId) {
            return CrudConfiguration.get(crudId).search || {};
        },
        isSearchable: function isSearchable(crudId) {
            return _(this.getSearchConfig(crudId)).size() > 0;
        },
        getSearchableIds: function getSearchableIds() {
            var self = this;
            var crudIds = CrudConfiguration.getCrudIds();
            return _(crudIds).filter(function eachCrudConfig(crudId) {
                return self.isSearchable(crudId);
            });
        },
        getSearchServiceUrl: function getSearchServiceUrl(crudIds, query, absolute) {
            var crudIdSingle = (crudIds && crudIds[0]) || '';
            var url = CrudConfiguration.getStatic(crudIdSingle).searchServiceUrl;
            var queryKey = this.getSearchQueryKey();
            url += (url.indexOf('?') >= 0) ? '&' : '?';
            url += 'ids=' + crudIds.join(',');
            if (query) {
                url += '&';
                url += queryKey + '=' + query;
            }
            return absolute ? Utils.getAbsoluteUrl(url) : url;
        }
    };
});
