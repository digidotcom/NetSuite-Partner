/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module StoreLocator
define('StoreLocator.Tooltip.View', [
        'ReferenceMap'

    ,   'store_locator_tooltip.tpl'

    ,   'underscore'
    ,   'Backbone.CollectionView'
    ,   'Backbone'
]
,   function (
        ReferenceMap

    ,   Template

    ,   _
    ,   BackboneCollectionView
    ,   Backbone
    )
{
    'use strict';

    return Backbone.View.extend({
        template: Template

        //@method initialize
        //@param {Object} options
    ,   initialize: function (options) {
            this.application = options.application;
            this.index = options.index;
        }

        //@method getContext
        //@return StoreLocator.Tooltip.View.Context
    ,   getContext: function()
        {
            var model = this.model;
            return {
                storeName: model.get('name')
            ,   showStoreDistance: !!model.get('distance')
            ,   distanceUnit: model.get('distanceunit')
            ,   storeDistance: model.get('distance')
            ,   showStoreAddress: !!model.get('address1')
            ,   storeAddress: model.get('address1')
            ,   storeId: model.get('internalid')
            ,   index: this.index
            };
        }
    });
});

