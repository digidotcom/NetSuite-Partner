// @module CaseImageUpload
define('Case.FilePreview.View', [
    'case_fileupload_preview.tpl',

    'Backbone',
    'GlobalViews.Confirmation.View',

    'underscore',
    'jQuery'
], function CaseFilePreviewView(
    caseFilePreviewTpl,

    Backbone,
    ConfirmationView,

    _,
    jQuery

) {
    'use strict';

    return Backbone.View.extend({
        template: caseFilePreviewTpl,

        events: {
            'click .case-fileupload-btn-remove': 'removeImageUpload'
        },

        initialize: function init(options) {
            var self = this;
            this.application = options.application;
            this.collection = options.collection;

            this.collection.on('reset sync add remove change destroy', function collectionCallback() {
                self.render();
            });
        },

        removeImageUpload: function removeImageUpload(e) {
            var view;
            e.preventDefault();
            view = new ConfirmationView({
                title: 'Remove Image Upload',
                body: 'Are you sure you want to remove this image?',
                callBack: this.removeModel,
                callBackParameters: {
                    context: this,
                    id: jQuery(e.target).data('id')
                },
                autohide: true
            });
            this.application.getLayout().showInModal(view);
        },

        removeModel: function removeModel() {
            this.model.destroy();
        }

    });
});