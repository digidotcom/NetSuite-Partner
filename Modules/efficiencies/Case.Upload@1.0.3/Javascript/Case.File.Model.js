// @module CaseFileUpload
define('Case.File.Model', [
    'Backbone',
    'underscore',
    'Utils'
], function CaseFileModel(
    Backbone,
    _,
    Utils
) {
    'use strict';

    return Backbone.Model.extend({
        urlRoot: function getURLRoot() {
            return this.getSuiteletUrl();
        },

        validateFile: function validateFile() {
            var status = { status: true, type: 'success', text: '' };
            var allowedExtensions = SC.ENVIRONMENT.published.CaseFileUpload_config.allowedExtensions;
            var fileType = this.get('type').split('/');
            var fileExtension = this.get('name').split('.').pop();

            if ( fileType[0] !== 'image' ) {
                status = { status: false, type: 'error', text: 'File type not allowed' };
            }

            if ( allowedExtensions &&
               (_.isArray(allowedExtensions) && allowedExtensions.length > 0)) {
                if ((!_.contains(allowedExtensions, fileExtension.toLowerCase())) ||
                    (!_.contains(allowedExtensions, fileType[1].toLowerCase()))) {
                    status = { status: false, type: 'error', text: 'File type not allowed' };
                }
            }

            return status;
        },

        getSuiteletUrl: function getSuiteletUrl() {

            return _.resolveSuiteletURL(
                'customscript_ef_sl_case_upload',
                'customdeploy_ef_sl_case_upload'
            );
        }
    });
});