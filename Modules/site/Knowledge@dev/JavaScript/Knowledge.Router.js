define('Knowledge.Router', [
    'underscore',
    'Backbone',
    'Utils',
    'Knowledge.View'
], function KnowledgeRouter(
    _,
    Backbone,
    Utils,
    KnowledgeView
) {
    'use strict';

    return Backbone.Router.extend({

        routes: {
            'knowledge': 'showKnowledge'
        },

        initialize: function initialize(application) {
            this.application = application;
        },

        showKnowledge: function showKnowledgePage() {
            var view = new KnowledgeView({
                application: this.application
            });
            view.showContent();
        }

    });
});
