define('Documents.View', [
    'underscore',
    'Backbone',
    'Utils',
    'SC.Configuration',
    'documents.tpl'
], function DocumentsView(
    _,
    Backbone,
    Utils,
    Configuration,
    documentsTpl
) {
    'use strict';

    return Backbone.View.extend({

        template: documentsTpl,

        initialize: function initialize(options) {
            this.application = options.application;
        },

        getSelectedMenu: function getSelectedMenu() {
            return 'documents';
        },
        getTitle: function getTitle() {
            return Utils.translate('Documents');
        },
        getBreadcrumbPages: function getBreadcrumbPages() {
            return [
                {
                    text: Utils.translate('Documents'),
                    href: 'documents'
                }
            ];
        },

        getContext: function getContext() {
            return {
                iframeUrl: Configuration.get('documents.iframeUrl')
            };
        }
    });
});
