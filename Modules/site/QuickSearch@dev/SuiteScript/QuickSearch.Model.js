define('QuickSearch.Model', [
    'underscore',
    'SC.Model'
], function QuickSearchModel(
    _,
    SCModel
) {
    'use strict';

    return SCModel.extend({
        name: 'CRUD.Record',

        get: function get(query) {
            if (query) {
                return { q: query };
            }
            return [];
        }
    });
});
