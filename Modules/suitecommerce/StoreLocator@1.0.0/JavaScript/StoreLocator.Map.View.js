/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module StoreLocator
define('StoreLocator.Map.View'
,   [
        'underscore'
    ,   'Backbone'
    ,   'store_locator_map.tpl'
    ,   'ReferenceMap.Promise.Handler'

    ]
,   function (
        _
    ,   Backbone
    ,   Template
    ,   PromiseHandler
    )
{
    'use strict';

    return Backbone.View.extend({
        template: Template

        //@method initialize
    ,   initialize: function (options) {
            this.application = options.application;
            this.reference_map = options.reference_map;
            this.model = options.model;
            this.collection = options.collection;
            this.triggerLocation = options.triggerLocation;

            if (this.collection)
            {
                this.collection.on('reset', this.updateMap, this);
            }

        }

        //@method updateMap
        //@return {Void}
    ,   updateMap: function ()
        {
            if (!!PromiseHandler.getPromise())
            {
                var self = this;
                PromiseHandler.getPromise().done(function(){
                    self.reference_map.clearPointList();

                    if (self.reference_map.myposition)
                    {
                        self.reference_map.showMyPosition();
                    }

                    if (self.collection.length)
                    {
                        self.reference_map.showPointList(self.collection);
                        self.reference_map.fitBounds();
                    }
                });
            }
            else
            {
                this.reference_map.clearPointList();

                if (this.reference_map.myposition)
                {
                    this.reference_map.showMyPosition();
                }

                if (this.collection.length)
                {
                    this.reference_map.showPointList(this.collection);
                    this.reference_map.fitBounds();
                }
            }
        }
        //@method updateMapDetails
        //@return {Void}
    ,   updateMapDetails: function ()
        {
            var marker = this.reference_map.showPointWithoutInfoWindow(this.model);
            this.reference_map.detail_point = marker;
        }

        //@method render
    ,   render: function()
        {
            this._render();
            var self = this
            ,   handler = PromiseHandler;


            if (!this.reference_map.isInitialized())
            {
                this.reference_map.load().done(function() {
                    self.mapInit();
                });
            }
            else if(!handler.getPromise())
            {
                self.mapInit();
            }
            else
            {
                this.reference_map.load().done(function(){
                    self.mapInit();
                });
            }
        }

        //@method mapInit
    ,   mapInit: function ()
        {
            var container = this.$('#map').get(0);
            this.reference_map.showMap(container);

            if (this.model)
            {
                this.updateMapDetails();
            }

            if (this.triggerLocation)
            {
                this.reference_map.trigger('ask_for_location');
            }
        }

    });
});