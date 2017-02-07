/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// GoogleMap.js
// --------
//@module Spatial @class GoogleMap
define(
	'GoogleMap'
,	[
		'Backbone'
	,   'jQuery'
	,   'underscore'
	,   'ReferenceMap'
	,   'StoreLocator.Tooltip.View'
	,	'ReferenceMap.Promise.Handler'

]
,   function (
		Backbone
	,   jQuery
	,   _
	,   ReferenceMap
	,   StoreLocatorTooltip
	,	PromiseHandler
   )
{
   'use strict';

	ReferenceMap.prototype.isInitialized = function()
	{
		return typeof google === 'object' && typeof google.maps === 'object';
	};

	ReferenceMap.prototype.load = function () 
	{
		var url = this.configuration.getUrl()
		,	handler = PromiseHandler;

		if (!handler.getPromise() && !this.isInitialized())
		{
			var promise = jQuery.getScript(url).done(function () {
				ReferenceMap.prototype.initialized = true;
			});
			this.load_promise = promise;
			handler.setPromise(promise);
		}

		return handler.getPromise();
	};

	ReferenceMap.prototype.showMap = function (container) 
	{
		var map_configuration = this.configuration.mapOptions()
		,   map_options = {
				center: new google.maps.LatLng(map_configuration.centerPosition.latitude, map_configuration.centerPosition.longitude)
			,   zoom: map_configuration.zoom
			,   mapTypeControl: map_configuration.mapTypeControl
			,   streetViewControl: map_configuration.streetViewControl
			,   mapTypeId: google.maps.MapTypeId[map_configuration.mapTypeId]
			,	disableDefaultUI: true
			};

		this.map = new google.maps.Map(container, map_options);
		var self = this;

		google.maps.event.addListener(this.map, 'tilt_changed', _.bind(function() {
			google.maps.event.trigger(this.map, 'resize');
			if (!!this.points.length)
			{
				this.fitBounds();
			}
			else if (this.detail_point)
			{
				this.fitBounds();
				this.map.setCenter(this.map.getCenter())
				this.map.setZoom(this.configuration.zoomInDetails());
			}
			else
			{
				this.centerMapToDefault();
			}

		},this));
	};

	ReferenceMap.prototype.centerMapToDefault = function ()
	{
		var map_options = this.configuration.mapOptions();
		this.map.setZoom(map_options.zoom);
		this.map.setCenter(new google.maps.LatLng(map_options.centerPosition.latitude, map_options.centerPosition.longitude));
	};

	ReferenceMap.prototype.getInfoWindow = function() 
	{
		if (!this.infowindow)
		{
			this.infowindow = new google.maps.InfoWindow();
		}

		return this.infowindow;
	};

	ReferenceMap.prototype.getTooltip = function (model, index) 
	{
		if (!this.tooltip)
		{
			this.tooltip = new StoreLocatorTooltip({
				model: model
			,   index: index
			});
		}
		else
		{
			this.tooltip.index = index;
			this.tooltip.model = model;
		}
		return this.tooltip
	};

	ReferenceMap.prototype.showPoint = function (point) {
		var location = point.get('location')
		,   marker = new google.maps.Marker({
				store_id: point.get('internalid')
			,   position: new google.maps.LatLng(location.latitude, location.longitude)
			,   icon: this.configuration.iconOptions('stores')
			,   map: this.map
			});

		marker.addListener('click', _.bind(function() {
			this.showInfoWindowOnClick(marker);
		}, this));
		return marker;
	};

	ReferenceMap.prototype.showPointWithoutInfoWindow = function (point) {
		var location = point.get('location')
		,   marker = new google.maps.Marker({
				store_id: point.get('internalid')
			,   icon: this.configuration.iconOptions('stores')
			,   map: this.map
			});
		marker.setPosition(new google.maps.LatLng(location.latitude, location.longitude));
		marker.setVisible(true);
		return marker;
	};

	ReferenceMap.prototype.showInfoWindowOnClick = function (marker) {
		var point = this.collection.find({'id': marker.store_id})
		,   index = this.collection.indexOf(point) +1;
		this.showInfoWindow(marker, point, index);
	};

	ReferenceMap.prototype.showInfoWindow = function (marker, model, index) {
		var tooltip = this.getTooltip(model, index)
		,   infowindow = this.getInfoWindow();

		infowindow.setContent(tooltip.template(tooltip.getContext()));
		infowindow.open(this.map, marker)
	};

	ReferenceMap.prototype.showMyPosition = function (position)
	{
		var myposition = position || this.myposition;
		this.marker = this.marker || new google.maps.Marker({
			icon: this.configuration.iconOptions('position')
		,   map: this.map
		});

		this.marker.setPosition(new google.maps.LatLng(myposition.latitude, myposition.longitude));
		this.marker.setVisible(true);
		return this.marker;
	};

	ReferenceMap.prototype.removePoint = function (point) {
		point.setMap(null);
	};

	ReferenceMap.prototype.showAutoCompleteInput = function (input) {
		var self = this;
		if (input)
		{
			this.autocomplete = new google.maps.places.SearchBox(input);
			google.maps.event.addListener(this.autocomplete, 'places_changed', function() {
				var place = self.autocompleteChange()
				,	isDevice = !! _.isPhoneDevice() || _.isTabletDevice();

				if (isDevice && self.configuration.showLocalizationMap())
				{
					if (place.geometry.viewport)
					{
						self.map.fitBounds(place.geometry.viewport);
					}
					else
					{
						self.map.setCenter(place.geometry.location);
						self.map.setZoom(17);
					}
				}
				else if (!isDevice)
				{
					if (place.geometry.viewport)
					{
						self.map.fitBounds(place.geometry.viewport);
					}
					else
					{
						self.map.setCenter(place.geometry.location);
						self.map.setZoom(17);
					}
				}
			});
		}


		return this.autocomplete;
	};

	ReferenceMap.prototype.autocompleteChange = function ()
	{
		this.clearPointList();
		var	place = this.autocomplete.getPlaces()[0]
		,   address = '';

		if (place.length === 0)
		{
			console.warn('Autocomplete returned place contains no geometry');
			return;
		}

		if (!place.geometry)
		{
			console.warn('Autocomplete returned place contains no geometry');
			return;
		}
		//set autocomplete coordinates
		if (place.geometry.location)
		{
			this.autocomplete_location = {
				latitude: place.geometry.location.lat()
			,	longitude: place.geometry.location.lng()
			,	address: place.formatted_address
			}
			this.showMyPosition(this.autocomplete_location);
		}

		if (place.address_components)
		{
			address = [
				(place.address_components[0] && place.address_components[0].short_name || ''),
				(place.address_components[1] && place.address_components[1].short_name || ''),
				(place.address_components[2] && place.address_components[2].short_name || '')
			].join(' ');
		}

		return place;
	};

	ReferenceMap.prototype.fitBounds = function() 
	{
		var bounds = new google.maps.LatLngBounds();

		_.each(this.points, function(point) {
			var location = point.getPosition();
			bounds.extend(new google.maps.LatLng(location.lat(), location.lng()));
		});

		if (!!this.myposition)
		{
			bounds.extend(new google.maps.LatLng(this.myposition.latitude, this.myposition.longitude))
		}

		if (!!this.detail_point)
		{
			bounds.extend(new google.maps.LatLng(this.detail_point.position.lat(), this.detail_point.position.lng()));
		}

		this.map.fitBounds(bounds);

	};

	ReferenceMap.prototype.getCityGeoCode = function() 
	{
		var load_promise = $.Deferred()
		,	geoCoder = new google.maps.Geocoder
		,   position = this.myposition
		,   latlng = {lat: parseFloat(position.latitude), lng: parseFloat(position.longitude)}
		,   self = this;

		geoCoder.geocode({'location': latlng}, function(results, status) {
			if (status === google.maps.GeocoderStatus.OK)
			{
				if (results[1])
				{
					self.myposition.address = results[1].formatted_address;
				}
				else
				{
					self.myposition.address = '';
				}
				load_promise.resolve();
			}
			else
			{
				load_promise.always();
				console.warn('Geocoder failed due to: ' + status);
			}
		});

		return load_promise;
	};

	ReferenceMap.prototype.zoomToPoint = function (marker) {
		this.map.setZoom(this.configuration.zoomInDetails());
		this.map.panTo(marker.position);
	};
});