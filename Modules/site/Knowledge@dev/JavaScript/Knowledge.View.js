define('Knowledge.View', [
    'underscore',
    'Backbone',
    'Utils',
    'SC.Configuration',
    'knowledge.tpl'
], function KnowledgeView (
    _,
    Backbone,
    Utils,
    Configuration,
    knowledgeTpl
) {
    'use strict';

    return Backbone.View.extend({

        template: knowledgeTpl,

        initialize: function initialize(options) {
            this.application = options.application;
        },

        getSelectedMenu: function getSelectedMenu() {
            return 'knowledge';
        },
        getTitle: function getTitle() {
            return Utils.translate('Knowledge');
        },
        getBreadcrumbPages: function getBreadcrumbPages() {
            return [
                {
                    text: Utils.translate('Knowledge'),
                    href: 'knowledge'
                }
            ];
        },

        getContext: function getContext() {
            return {
                iframeUrl: Configuration.get('knowledge.iframeUrl')
            };
        }
    });
});
