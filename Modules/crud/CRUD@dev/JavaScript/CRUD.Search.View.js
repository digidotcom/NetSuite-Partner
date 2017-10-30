define('CRUD.Search.View', [
    'underscore',
    'ItemsSearcher.View',
    'CRUD.Search.Collection',
    'CRUD.Search.Item.View',
    'crud_search.tpl'
], function CrudSearchModel(
    _,
    ItemsSearcherView,
    CrudSearchCollection,
    CrudSearchItemView,
    crudSearchTpl
) {
    'use strict';

    return ItemsSearcherView.extend({

        defaultOptions: _({}).extend(ItemsSearcherView.prototype.defaultOptions, {
            collection: CrudSearchCollection,
            itemView: CrudSearchItemView,
            template: crudSearchTpl,
            getItemDisplayName: function getItemDisplayName(item, query) {
                return item ? item.get('label') : query;
            },
            showSeeAll: false
        }),

        /* eslint-disable */
        cleanSearch: function (stop_triggering_event)
        {
            this.$searchElement.data('ttTypeahead').close();
            // this.$searchElement.typeahead('val', '');

            this.options.query = '';
            this.options.selectedItem = null;

            if (!stop_triggering_event)
            {
                this.trigger('itemSelected'
                ,	{
                        selectedItem: null
                    ,	collection: this.collection.models
                    ,	currentQuery: this.options.query
                    });
            }
        },
        /* eslint-enable */

        childViews: {}

    });
});
