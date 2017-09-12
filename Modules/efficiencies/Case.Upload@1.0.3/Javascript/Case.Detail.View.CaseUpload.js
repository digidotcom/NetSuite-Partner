define('Case.Detail.View.CaseUpload', [
    'Backbone',
    'Backbone.CompositeView',
    'Backbone.CollectionView',

    'Case.File.Collection',

    'Case.Detail.View',
    'Case.FileUpload.View',
    'Case.FileUpload.Thumbnail.View',

    'case_fileupload_item_cell.tpl',
    'case_fileupload_item_row.tpl',

    'underscore'
], function CaseDetailViewCaseUpload(
    Backbone,
    BackboneCompositeView,
    BackboneCollectionView,

    CaseFileCollection,

    View,
    CaseFileUploadView,
    ImageThumbnailView,

    imgThumbnailCellTpl,
    imgThumbnailRowTpl,

    _
) {
    'use strict';

    _.extend(View.prototype, {
        initialize: _.wrap(View.prototype.initialize, function wrapInitialize(fn) {
            var messageFileUploads;
            var caseID;
            var self = this;

            fn.apply(this, _.toArray(arguments).slice(1));

            if (! View.prototype.childViews) {
                View.prototype.childViews = {};
            }

            _.extend(View.prototype.childViews, {
                'Case.FileUpload': function childViewImageUpload() {
                    return new CaseFileUploadView({
                        application: this.application,
                        caseModel: this.model
                    });
                }
            });

            BackboneCompositeView.add(this);

            this.on('afterViewRender', function afterViewRender() {
                messageFileUploads = new CaseFileCollection();
                caseID = this.model.get('internalid');

                messageFileUploads.fetch({data: {caseid: caseID}}).done(function done() {
                    messageFileUploads.each(function each(messages) {
                        _.each(messages.attributes, function eachMessage(messageFiles, messageID) {
                            var thumbnailPlaceholderView = new BackboneCollectionView({
                                collection: new Backbone.Collection(messageFiles),
                                childView: ImageThumbnailView,
                                viewsPerRow: 5,
                                rowTemplate: imgThumbnailRowTpl,
                                cellTemplate: imgThumbnailCellTpl,
                                childViewOptions: {
                                    application: self.application,
                                    isNew: false
                                }
                            });

                            thumbnailPlaceholderView.setElement('*[data-view="Case.FileImage' + messageID + '"]')
                            .render();
                        });
                    });
                });

                this.$el.find('#reply').parent().parent()
                        .after('<div data-view="Case.FileUpload"' +
                                 'class="case-new-form-controls-group"' +
                                 'data-validation="control-group"></div>');
            });
        })
    });
});