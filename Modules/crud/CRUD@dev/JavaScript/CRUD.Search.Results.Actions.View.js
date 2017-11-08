define('CRUD.Search.Results.Actions.View', [
    'underscore',
    'Backbone',
    'crud_search_results_actions.tpl'
], function CrudSearchResultsActionsView(
    _,
    Backbone,
    crudSearchResultsActionsTpl
) {
    'use strict';

    return Backbone.View.extend({

        template: crudSearchResultsActionsTpl,

        events: {},

        initialize: function initialize() {},

        getContext: function getContext() {
            var record = this.model.get('record');
            if (record && record.get('_id')) {
                return {
                    showViewLink: true,
                    viewUrl: record.get('_url')
                };
            }
            return {
                showViewLink: false
            };
        }
    });
});
