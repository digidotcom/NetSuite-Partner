// @module CaseImageUpload
define('Case.FileUpload.Thumbnail.View', [
    'case_fileupload_image_thumbnail.tpl',

    'Backbone',
    'GlobalViews.Confirmation.View',

    'underscore',
    'Utils',
    'Utilities.ResizeImage'
], function CaseFileUploadThumbnailView(
    caseFileUploadImageThumbnailTpl,

    Backbone,
    ConfirmationView,

    _,
    Utils,
    resizeImage
) {
    'use strict';

    return Backbone.View.extend({
        template: caseFileUploadImageThumbnailTpl,

        events: {
            'click [data-action="case-fileupload-remove-file"]': 'removeImageUpload'
        },

        getContext: function getContext() {
            var baseUrl = window.location.origin;
            var imageLink = baseUrl + this.model.get('link');

            return {
                isNew: this.options.isNew ? this.options.isNew : false,
                imageLink: imageLink,
                imageThumbnail: resizeImage(this.model.get('link'),
                    SC.ENVIRONMENT.published.CaseFileUpload_config.thumbnailImageResizeID),
                fileID: this.model.get('fileID')
            };
        },

        removeImageUpload: function removeImageUpload(e) {
            var view;
            var model = this.model;

            e.preventDefault();
            view = new ConfirmationView({
                title: _.translate('Remove Image Upload'),
                body: _.translate('Are you sure you want to remove this image?'),
                callBack: this.removeFile,
                callBackParameters: {
                    context: this,
                    model: model
                },
                autohide: true
            });
            this.options.application.getLayout().showInModal(view);
        },

        removeFile: function removeFile(options) {
            options.model.destroy();
        }

    });
});