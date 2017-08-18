define('Case.FileUpload.Model', [
    'Case.File.Model',
    'underscore'
], function (
    CaseFileModel,
    _) {
    _.extend(CaseFileModel.prototype, {
        validateFile: function validateFile() {
            var status = { status: true, type: 'success', text: '' };
            var allowedExtensions = SC.ENVIRONMENT.published.CaseFileUpload_config.allowedExtensions;
            var fileType = this.get('type').split('/');
            var fileExtension = this.get('name').split('.').pop();

            if (allowedExtensions &&
                (_.isArray(allowedExtensions) && allowedExtensions.length > 0)) {
                if ((!_.contains(allowedExtensions, fileExtension.toLowerCase())) ||
                    (!_.contains(allowedExtensions, fileType[1].toLowerCase()))) {
                    status = { status: false, type: 'error', text: 'File type not allowed' };
                }
            }

            return status;
        }
    });
});
