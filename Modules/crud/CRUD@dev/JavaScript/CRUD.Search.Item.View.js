define('CRUD.Search.Item.View', [
    'underscore',
    'ItemsSearcher.Item.View',
    'crud_search_item.tpl'
], function CrudSearchModel(
    _,
    ItemsSearcherItemView,
    crudSearchItemTpl
) {
    'use strict';

    return ItemsSearcherItemView.extend({

        defaultOptions: _({}).extend(ItemsSearcherItemView.prototype.defaultOptions, {
            template: crudSearchItemTpl
        })

    });
});
