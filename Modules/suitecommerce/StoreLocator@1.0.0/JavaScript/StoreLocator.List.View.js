/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module StoreLocator
define('StoreLocator.List.View', [
        'Backbone.CompositeView'
    ,   'Backbone.CollectionView'
    ,   'store_locator_list.tpl'

    ,   'Backbone'
    ,   'underscore'
    ]
,   function storeLocatorList(
        BackboneCompositeView
    ,   BackboneCollectionView
    ,   Template

    ,   Backbone
    ,   _
    )
{
    'use strict';

    return Backbone.View.extend({

        template: Template

        //@method initialize
    ,   initialize: function (options) {
            this.reference_map = options.reference_map;
            this.index = options.index + 1;
            this.isDevice = options.isDevice;

            this.events = this.events || {};

            if (this.reference_map.configuration.openPopupOnMouseOver() && !_.isPhoneDevice() && !_.isTabletDevice())
            {
                  var eventKey = 'mouseover ' + 'li';
                  this.events[eventKey] = 'openMapInfoWindow';
                  this.delegateEvents();
            }

            BackboneCompositeView.add(this);
        }

        ,   render : function() {
            
            var self = this;

            this._render();

            if(this.isDevice) {
                self.$('#site-footer').hide();
            }
        }

        //@method openMapInfoWindow
        //@return {void}
    ,   openMapInfoWindow: function()
        {
            var marker = _.findWhere(this.reference_map.points, {store_id: this.model.get('internalid')});
            this.reference_map.showInfoWindow(marker, this.model, this.index);
        }

        //@method getContext @returns StoreLocator.List.View.Context
    ,   getContext: function()
        {
            var model = this.model;
            return {
                storeName: model.get('name')
            ,   storeDistance: model.get('distance')
            ,   distanceUnit: model.get('distanceunit')
            ,   storeAddress: model.get('address1')
            ,   storeId: model.get('internalid')
            ,   index: this.index
            };
        }

    });
});