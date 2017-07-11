define('Documents.Marketing.View', [
    'underscore',
    'Backbone',
    'Utils',
    'SC.Configuration',
    'documents_marketing.tpl'
], function DocumentsMarketingView(
    _,
    Backbone,
    Utils,
    Configuration,
    documentsMarketingTpl
) {
    'use strict';

    return Backbone.View.extend({

        template: documentsMarketingTpl,

        initialize: function initialize(options) {
            this.application = options.application;
        },

        getSelectedMenu: function getSelectedMenu() {
            return 'documents';
        },
        getTitle: function getTitle() {
            return Utils.translate('Marketing Documents');
        },
        getBreadcrumbPages: function getBreadcrumbPages() {
            return [
                {
                    text: Utils.translate('Marketing Documents'),
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
