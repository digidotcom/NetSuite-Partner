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
        getSearchConfig: function getSearchConfig(crudId) {
            return CrudConfiguration.get(crudId).search || {};
        },
        isSearchable: function isSearchable(crudId) {
            return !!this.getSearchConfig(crudId);
        },
        getSearchableIds: function getSearchableIds() {
            var self = this;
            var crudIds = CrudConfiguration.getCrudIds();
            return _(crudIds).filter(function eachCrudConfig(crudId) {
                return self.isSearchable(crudId);
            });
        },
        getSearchServiceUrl: function getSearchServiceUrl(crudIds, absolute) {
            var crudIdSingle = (crudIds && crudIds[0]) || '';
            var url = CrudConfiguration.getStatic(crudIdSingle).searchServiceUrl;
            url += (url.indexOf('?') >= 0) ? '&' : '?';
            url += 'ids=' + crudIds.join(',');
            return absolute ? Utils.getAbsoluteUrl(url) : url;
        }
    };
});