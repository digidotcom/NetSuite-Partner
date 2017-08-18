// @module CaseFileUpload
define('Case.File.Collection', [
    'Backbone',
    'Case.File.Model',

    'underscore',
    'Utils'
], function CaseFileCollection(
    Backbone,
    CaseFileModel,
    _,
    Utils
) {
    'use strict';

    return Backbone.Collection.extend({
        url: function getURLRoot() {
            return this.getSuiteletUrl();
        },

        model: CaseFileModel,

        getSuiteletUrl: function getSuiteletUrl() {
            return _.resolveSuiteletURL(
                'customscript_ef_sl_case_upload',
                'customdeploy_ef_sl_case_upload'
            );
        }
    });
});