/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module StoreLocator
define('StoreLocator.Details.View'
    , [
        'StoreLocator.Map.View'
    ,   'ReferenceMap'
    ,   'store_locator_details.tpl'
    ,   'underscore'
    ,   'Backbone.CompositeView'
    ,   'Backbone'
    ,   'Profile.Model'
]
,   function (

        StoreLocatorMapView
    ,   ReferenceMap
    ,   Template
    ,   _
    ,   BackboneCompositeView
    ,   Backbone
    ,   ProfileModel
    )
{
    'use strict';

    return Backbone.View.extend({
        template: Template

        //@method initialize
        //@params {Object} options
    ,   initialize: function (options) {
            this.reference_map =  options.reference_map;
            this.model = options.model;
            this.reference_map.model = this.model;
            this.profile_model = ProfileModel.getInstance();

            //@property {String} title
            this.title = this.reference_map.configuration.title();
            BackboneCompositeView.add(this);
        }

        //@property {Object} childViews
    ,   childViews: {
            'LocatorMap': function ()
            {
                return new StoreLocatorMapView({
                    application: this.application
                ,   reference_map: this.reference_map
                ,   model: this.model
                });
            }
        }

        //@method getContext @returns StoreLocator.Details.View.Context
    ,   getContext: function()
        {
            var model = this.model
            ,   location = this.model.get('location').latitude + ',' + this.model.get('location').longitude
            ,   last_search =  this.profile_model ? this.profile_model.get('storeLocator_last_search') : this.profile_model
            ,   position = last_search ? last_search.latitude + ',' + last_search.longitude : 'Current+Location'
            ,   direction_url =  'https://maps.google.com?saddr=' + position + '&daddr=' + location
            ,   last_navigation = this.profile_model.get('storeLocator_last_navigation');

            return {
                storeName: model.get('name')
            ,   showStoreDistance: !!model.get('distance')
            ,   storeDistance: model.get('distance')
            ,   showStoreAddress: model.get('address1')
            ,   storeAddress: model.get('address1')
            ,   showStoreCity: !!model.get('city')
            ,   showStoreZipCode: !!model.get('zip')
            ,   storeZipCode: model.get('zip')
            ,   showStoreState: !!model.get('state')
            ,   storeState: model.get('state')
            ,   showStorePhone: !!model.get('phone')
            ,   storePhone: model.get('phone')
            ,   storeCity: model.get('city')
            ,   showServiceHours: !!model.get('servicehours')
            ,   serviceHours: model.get('servicehours')
            ,   title: this.reference_map.configuration.title
            ,   directionUrl: direction_url
            ,   redirectUrl: !!last_navigation ? 'stores' : 'stores/all'

            };
        }

    });
});