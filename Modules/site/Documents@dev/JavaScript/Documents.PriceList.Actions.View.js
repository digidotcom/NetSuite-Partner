define('Documents.PriceList.Actions.View', [
    'underscore',
    'Backbone',
    'documents_pricelists_actions.tpl'
], function DocumentsPriceListActionsView(
    _,
    Backbone,
    documentsPriceListsActionsTpl
) {
    'use strict';

    return Backbone.View.extend({

        template: documentsPriceListsActionsTpl,

        events: {},

        initialize: function initialize() {},

        getContext: function getContext() {
            var record = this.model.get('record');
            if (record && record.get('internalid')) {
                return {
                    showDownloadLink: true,
                    downloadUrl: record.getDownloadUrl()
                };
            }
            return {
                showDownloadLink: false
            };
        }
    });
});
