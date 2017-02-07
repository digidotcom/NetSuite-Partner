/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module StoreLocatorReferenceMapsImplementation
// @class ReferenceMap 
// This class implemented a facade that is used to separate application and map engine and provide an easy way to implement any maps engine. 
// For changing current maps engine re-implement the operations below.
define(
    'ReferenceMap'
,   [
        'ReferenceMap.Configuration'
    ,   'underscore'
    ,   'Backbone'
    ,   'Utils'
    ]
,   function (
        ReferenceMapConfiguration
    ,   _
    ,   Backbone
    )
{
    'use strict';

    var ReferenceMap = function () {
        this.configuration = ReferenceMapConfiguration;
        //Stores instance of the map created in showMap method
        this.map = null;
        //Handles markers created in showPoint() method
        this.points = [];
        //{Object} containing latitude, longitude and address
        this.myposition = null;
    };

    //@method load
    //@return Promise object which observes maps library loading
    ReferenceMap.prototype.load = function () {};

    //@method isInitialized
    //@return {Boolean} If true, library has been initialized. Otherwise false.
    ReferenceMap.prototype.isInitialize = function() {};

    //@method showMap has the responsability of showing the map in a container and set an instance of map in this.map
    //@param {Object} element. HTML element that will be used for rendering the map
    //@return {Void}
    ReferenceMap.prototype.showMap = function () {};

    //@method centerMapToDefault
    ReferenceMap.prototype.centerMapToDefault = function () {};

    //@method showPoint creates a point for showing in the map
    //@return {Object} point
    ReferenceMap.prototype.showPoint = function () {};

    //@method removePoint removed a point from the map
    //@param {Object} point to remove
    //@return {Void}
    ReferenceMap.prototype.removePoint = function () {};

    //@method showAutoCompleteInput shows an initialize the automcomplete feature
    //@param {Object} input html input
    //@return {Object} autocomplete object
    ReferenceMap.prototype.showAutoCompleteInput = function () {};

    //@method autoCompleteChange executed when the autoComplete input value changes and sets {Object} this.autocomplete_location with latitude, longitude and address
    ReferenceMap.prototype.autoCompleteChange = function () {};

    //@method showMyPosition show current position in the map
    //@param {Object} position
    ReferenceMap.prototype.showPosition = function () {};

    //@method showPointList iterates on a list of Store.Locator.Model objects and shows the points in the map.
    ReferenceMap.prototype.showPointList = function (list) {
        var self = this;
        list.each(function(point)
        {
            self.points.push(self.showPoint(point));
        });
    };

    //@method showPointWithoutInfoWindow shows the point the map without rendering the Location details tooltip
    //@param {StoreLocator.Model}
    ReferenceMap.prototype.showPointWithoutInfoWindow = function () {};

    //@method getInfoWindow current instance of the view which shows the Location details tooltip
    //@return {Object}
    ReferenceMap.prototype.getInfoWindow = function () {};

    //@method getTooltip returns an instance of StoreLocator.Tooltip.View
    //@param {StoreLocator.Model} model
    //@param {Integer} index
    //@return {StoreLocator.Tooltip.View}
    ReferenceMap.prototype.getTooltip = function () {};

    //@method showInfoWindow renders StoreLocator.Tooltip.View into getInfoWindow for showing the information in the map
    //@param {Object} marker
    //@param {StoreLocator.Model} model
    //@param {Integer} index
    ReferenceMap.prototype.showInfoWindow = function () {};

    //@method showInfoWindowOnClick obtain the point of a collection and passing parameters to showInfoWindow
    //@param {Object} point
    ReferenceMap.prototype.showInfoWindowOnClick = function () {};

    //@method clearPointList remove all points from map and this.points
    ReferenceMap.prototype.clearPointList = function ()
    {
        var self = this;
        _.each(this.points, function(point)
        {
             self.removePoint(point);
        });

        this.points = [];
    };

    //@method fitBounds centers and zooms the map for making all the points fit.
    ReferenceMap.prototype.fitBounds = function () {};

    //@method getCityGeoCode retrieves an address from latitude and longitude and saves the result in this.myposition.address
    ReferenceMap.prototype.getCityGeoCode = function () {};

    //@method zoomToPoint centers the map in one specific point
    //@param {Object} point
    ReferenceMap.prototype.zoomToPoint = function () {};

    _.extend(ReferenceMap.prototype, Backbone.Events);

    return ReferenceMap;
});