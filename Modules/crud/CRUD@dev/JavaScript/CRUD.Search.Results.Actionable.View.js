define('CRUD.Search.Results.Actionable.View', [
    'RecordViews.Actionable.View',
    'crud_search_results_actionable.tpl'
], function CrudSearchResultsActionableView(
    RecordViewsActionableView,
    crudSearchResultsActionableTpl
) {
    'use strict';

    return RecordViewsActionableView.extend({

        template: crudSearchResultsActionableTpl

    });
});
