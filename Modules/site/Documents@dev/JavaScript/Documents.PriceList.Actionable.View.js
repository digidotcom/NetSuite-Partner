define('Documents.PriceList.Actionable.View', [
    'RecordViews.Actionable.View',
    'documents_pricelists_actionable.tpl'
], function DocumentsPriceListActionableView(
    RecordViewsActionableView,
    documentsPriceListsActionableTpl
) {
    'use strict';

    return RecordViewsActionableView.extend({

        template: documentsPriceListsActionableTpl

    });
});
