define('Documents.Router', [
    'underscore',
    'Backbone',
    'Documents.Marketing.View'
], function DocumentsRouter(
    _,
    Backbone,
    DocumentsMarketingView
) {
    'use strict';

    return Backbone.Router.extend({

        routes: {
            'documents': 'showDocumentsPage'
        },

        initialize: function initialize(application) {
            this.application = application;
        },

        showDocumentsPage: function showDocumentsPage() {
            var view = new DocumentsMarketingView({
                application: this.application
            });
            view.showContent();
        }

    });
});
