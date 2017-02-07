/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module StoreLocator
define('StoreLocator.List.All.Store.View', [
        'Backbone.CompositeView'
    ,   'Backbone.CollectionView'
    ,   'store_locator_list_all_store.tpl'

    ,   'Backbone'
    ]
,   function (
        BackboneCompositeView
    ,   BackboneCollectionView
    ,   Template

    ,   Backbone
    )
{
    'use strict';

    return Backbone.View.extend({

        template: Template

        //@method initialize
        //@param {Object} options
    ,   initialize: function (options) {
            this.index = options.index;
            BackboneCompositeView.add(this);
        }

        //@method getContext
        //@return StoreLocator.ListAll.Store.View.Context
    ,   getContext: function()
        {
            return {
                name: this.model.get('name')
            ,   storeId: this.model.get('internalid')
            };
        }

    });
});