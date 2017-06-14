define('Documents.Router', [
    'underscore',
    'Backbone',
    'Documents.View'
], function DocumentsRouter(
    _,
    Backbone,
    DocumentsView
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
            var view = new DocumentsView({
                application: this.application
            });
            view.showContent();
        }

    });
});
