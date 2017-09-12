// @module CaseImageUpload
define('Case.FileUpload.View', [
    'case_fileupload.tpl',
    'case_fileupload_item_cell.tpl',
    'case_fileupload_item_row.tpl',

    'Backbone',
    'Backbone.CompositeView',
    'Backbone.CollectionView',
    'GlobalViews.Message.View',

    'Case.File.Model',
    'Case.File.Collection',
    'Case.FileUpload.Thumbnail.View',

    'underscore',
    'jQuery'
], function CaseFileUploadView(
    caseFileUploadTpl,
    imgThumbnailCellTpl,
    imgThumbnailRowTpl,

    Backbone,
    BackboneCompositeView,
    BackboneCollectionView,
    GlobalViewsMessageView,

    CaseFileModel,
    CaseFileCollection,
    ImageThumbnailView,

    _,
    jQuery
) {
    'use strict';

    return Backbone.View.extend({
        template: caseFileUploadTpl,

        events: {
            'change [name="case-fileupload-uploader"]': 'uploadFile'
        },

        initialize: function init() {
            var self = this;
            this.collection = new CaseFileCollection();
            this.caseModel = this.options.caseModel;
            this.uploadCtr = 0;

            BackboneCompositeView.add(this);

            this.collection.on('add sync remove', function reRender() {
                self.render();
                self.caseModel.set('uploadedFile', self.collection.map(function setAttr(model) {
                    return model.attributes;
                }));
            });
        },

        childViews: {
            'CaseFileUpload.ImageThumbnail': function CaseFileUploadImageThumbnail() {
                return new BackboneCollectionView({
                    collection: this.collection,
                    childView: ImageThumbnailView,
                    viewsPerRow: 5,
                    rowTemplate: imgThumbnailRowTpl,
                    cellTemplate: imgThumbnailCellTpl,
                    childViewOptions: {
                        application: this.options.application,
                        isNew: true
                    }
                });
            }
        },

        uploadLog: function uploadLog(status) {
            var msgContainerParent;
            var globalViewMessage;

            globalViewMessage = new GlobalViewsMessageView({
                message: _.translate(status.text),
                type: status.type,
                closable: true
            });
            msgContainerParent = jQuery('.case-fileupload-message-holder');
            msgContainerParent.html(globalViewMessage.render().$el.html());
        },

        uploadFile: function selectFile(e) {
            var files = e.currentTarget.files;
            var caseFile;
            var formData;
            var self = this;
            var validate;
            var maxUploadNum = SC.ENVIRONMENT.published.CaseFileUpload_config.maximumFileUpload;

            if (this.uploadCtr === 0) {
                if ( (self.collection.length + files.length) > maxUploadNum) {
                    self.uploadLog({ status: false, type: 'error', text: 'Maximum number of upload is ' + maxUploadNum });
                }else {
                    this.uploadCtr = files.length;
                    _.each(files, function eachFile(file) {
                        caseFile = new CaseFileModel(file);
                        validate = caseFile.validateFile();
                        if ( validate.status ) {
                            formData = new FormData();
                            formData.append('file', file);

                            caseFile.save(file, {
                                processData: false,
                                contentType: false,
                                cache: false,
                                data: formData,
                                beforeSend: function beforeSend() {}
                            }).done(function caseFileSaveDone(data) {
                                self.collection.add(new CaseFileModel(_.extend(data, {internalid: data.fileID})));
                            }).complete(function caseAjaxComplete(data) {
                                self.uploadCtr--;
                            });
                        }else {
                            self.uploadLog(validate);
                            self.uploadCtr--;
                        }
                    });
                }
            }else {
                self.uploadLog({ status: false, type: 'info', text: 'Please wait to finish all upload to continue' });
            }
        }
    });
});