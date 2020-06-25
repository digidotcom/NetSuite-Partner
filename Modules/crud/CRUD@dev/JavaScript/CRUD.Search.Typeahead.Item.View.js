define('CRUD.Search.Typeahead.Item.View', [
    'underscore',
    'ItemsSearcher.Item.View',
    'crud_search_typeahead_item.tpl'
], function CrudSearchTypeaheadItemView(
    _,
    ItemsSearcherItemView,
    crudSearchTypeaheadItemTpl
) {
    'use strict';

    return ItemsSearcherItemView.extend({

        defaultOptions: _({}).extend(ItemsSearcherItemView.prototype.defaultOptions, {
            template: crudSearchTypeaheadItemTpl
        })

    });
});
