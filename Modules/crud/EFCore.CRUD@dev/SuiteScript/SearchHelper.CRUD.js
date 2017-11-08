define('SearchHelper.CRUD', [
    'underscore',
    'SearchHelper'
], function SearchHelperDefine(
    _,
    SearchHelper
) {
    'use strict';

    function SearchHelperCrud() {
        SearchHelper.apply(this, _(arguments).toArray());
    }

    /* extend from RecordHelper */
    SearchHelperCrud.prototype = Object.create(SearchHelper.prototype);

    _(SearchHelperCrud.prototype).extend({

        getFilters: function getFilters() {
            return _.map(this._filters || [], function mapFilters(f) {
                var filter = new nlobjSearchFilter(
                    f.fieldName,
                    f.joinKey ? f.joinKey : null,
                    f.operator,
                    f.value1 ? f.value1 : null,
                    f.value2 ? f.value2 : null
                );

                if (f.summary) {
                    filter.setSummaryType(f.summary);
                }

                if (f.formula) {
                    filter.setFormula(f.formula);
                }

                if ('or' in f) {
                    filter.setOr(!!f.or);
                }

                if (f.leftParens) {
                    filter.setLeftParens(f.leftParens);
                }

                if (f.rightParens) {
                    filter.setRightParens(f.rightParens);
                }

                return filter;
            }) || [];
        }

    });

    return SearchHelperCrud;
});
