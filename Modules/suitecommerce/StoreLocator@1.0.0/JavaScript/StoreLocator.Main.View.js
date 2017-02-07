/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module StoreLocator
define('StoreLocator.Main.View',
    [
        'Profile.Model'
    ,   'StoreLocator.Map.View'

    ,   'StoreLocator.Location.View'

    ,   'store_locator_main.tpl'

    ,   'AjaxRequestsKiller'
    ,   'underscore'
    ,   'Backbone.CompositeView'
    ,   'Backbone'
    ]
,   function
    (
        ProfileModel
    ,   StoreLocatorMapView

    ,   StoreLocatorLocationView

    ,   store_locator_main_tpl

    ,   AjaxRequestsKiller
    ,   _
    ,   BackboneCompositeView
    ,   Backbone
    )
{
    'use strict';

    return Backbone.View.extend({
        template: store_locator_main_tpl

    ,   events: {
            'click [data-action="show-map"]': 'toggleView'
        ,   'click [data-action="show-list"]': 'toggleView'
        ,   'click [data-action="refine-search"]': 'refineSearch'
        }

        //@method initialize
        //@param options
    ,   initialize: function (options)
        {
            this.application = options.application;
            this.reference_map = options.reference_map;
            this.reference_map.collection = this.collection;
            this.isDevice = _.isPhoneDevice() || _.isTabletDevice();

            this.profileModel = ProfileModel.getInstance();

            //@property {String} title
            this.title = this.reference_map.configuration.title();

            BackboneCompositeView.add(this);
        }

        //@method destory
    ,   destroy: function ()
        {
            //clear profile model
            if (Backbone.history.getFragment().split('/')[1] !== 'details')
            {
                this.profileModel.unset('storeLocator_last_search');
                this.profileModel.unset('storeLocator_last_navigation');
            }
            this._destroy();
        }

        //@method toggleView
        //@param {Object} e
    ,   toggleView: function (e)
        {
            var list_view = this.$('[data-type="list-view"]'),
                map_view = this.$('[data-type="map-view"]');

            if (this.$(e.target).data('action') === 'show-map')
            {
                list_view.fadeOut();
                map_view.css('visibility','visible');
                this.reference_map.fitBounds();
                this.$('[data-action="show-map"]').addClass('active');
                map_view.addClass('map-view');
                this.$('[data-action="show-list"]').removeClass('active');
            }
            else
            {
                list_view.show();
                map_view.css('visibility','hidden');
                this.$('[data-action="show-map"]').removeClass('active');
                this.$('[data-action="show-list"]').addClass('active');
            }
        }

        //@method refineSearch
        //@param {Object} e
    ,   refineSearch: function (e)
        {
            var map_view =  this.$('[data-type="map-view"]');
            e.preventDefault();
            this.reference_map.myposition = null;
            this.reference_map.clearPointList();
            map_view.removeClass('map-view');
            if (this.isDevice)
            {
                map_view.css('visibility','hidden');
            }
            this.collection.reset();
        }

        //@property {Object} childViews
    ,   childViews: {
            'LocatorMap': function ()
            {
                return new StoreLocatorMapView({
                    collection : this.collection
                ,   application: this.application
                ,   reference_map: this.reference_map
                ,   triggerLocation: this.triggerLocation
                });
            }

        ,   'LocatorLocation': function ()
            {
                return new StoreLocatorLocationView({
                    collection : this.collection
                ,   application: this.application
                ,   reference_map: this.reference_map
                ,   profileModel: this.profileModel
                });
            }
        }
        //@method getContext
        //@returns StoreLocator.Main.View.Context
    ,   getContext: function()
        {
            var geolocation = this.reference_map.myposition;

            //@class StoreLocator.Main.View.Context
            return {
                title: this.reference_map.configuration.title
            ,   positionNotAllowed: !!this.collection.length
            ,   totalStores : this.collection.length
            ,   myposition: geolocation ? geolocation.address : ''
            };
        }
    });
});