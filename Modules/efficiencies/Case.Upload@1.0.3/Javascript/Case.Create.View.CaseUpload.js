define('Case.Create.View.CaseUpload', [
    'Backbone.CompositeView',
    'Case.FileUpload.View',
    'Case.Create.View',
    'underscore'
], function CaseCreateViewCaseUpload(
    BackboneCompositeView,
    CaseFileUploadView,
    View,
    _
) {
    'use strict';

    _.extend(View.prototype, {
        initialize: _.wrap(View.prototype.initialize, function wrapInitialize(fn) {
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
                this.$el
                    .find('#message').parent().parent()
                    .after('<div data-view="Case.FileUpload"' +
                                 'class="case-new-form-controls-group"' +
                                 'data-validation="control-group"></div>');
            });
        })
    });
});