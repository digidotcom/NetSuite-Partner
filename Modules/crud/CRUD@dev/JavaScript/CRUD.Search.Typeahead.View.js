define('CRUD.Search.Typeahead.View', [
    'underscore',
    'ItemsSearcher.View',
    'CRUD.Search.Collection',
    'CRUD.Search.Typeahead.Item.View',
    'crud_search_typeahead.tpl'
], function CrudSearchTypeaheadModel(
    _,
    ItemsSearcherView,
    CrudSearchCollection,
    CrudSearchTypeaheadItemView,
    crudSearchTypeaheadTpl
) {
    'use strict';

    return ItemsSearcherView.extend({

        defaultOptions: _({}).extend(ItemsSearcherView.prototype.defaultOptions, {
            collection: CrudSearchCollection,
            itemView: CrudSearchTypeaheadItemView,
            template: crudSearchTypeaheadTpl,
            getItemDisplayName: function getItemDisplayName(item, query) {
                return item ? item.get('label') : query;
            },
            showSeeAll: true
        }),

        childViews: {}

    });
});
