define('CRUD.Helper.Prefill', [
    'underscore',
    'jQuery',
    'Utils',
    'CRUD.Configuration'
], function CrudHelperPrefill(
    _,
    jQuery,
    Utils,
    CrudConfiguration
) {
    'use strict';

    return {
        getPrefillUrlParams: function getPrefillParameters(crudId, id) {
            return {
                source: crudId,
                source_id: id
            };
        },
        getPrefillUrl: function getActionServiceUrl(crudId, sourceCrudId, id) {
            var newUrl = this.getNewUrl(crudId);
            var prefillParams = this.getPrefillUrlParams(sourceCrudId, id);
            return Utils.addParamsToUrl(newUrl, prefillParams);
        }
    };
});
