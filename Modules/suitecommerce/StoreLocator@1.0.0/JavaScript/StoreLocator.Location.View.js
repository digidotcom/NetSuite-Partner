/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module StoreLocator
define('StoreLocator.Location.View', [

	   'store_locator_location.tpl'

	,   'StoreLocator.List.View'
	,	'StoreLocator.Map.View'
	,   'AjaxRequestsKiller'
	,   'underscore'
	,   'Backbone'
	,   'Backbone.CompositeView'
	,   'Backbone.CollectionView'
	,	'jQuery'
	,	'ReferenceMap'
]
,   function (

	   Template

	,   StoreLocatorListView
	,	StoreLocatorMapView
	,   AjaxRequestsKiller
	,   _
	,   Backbone
	,   BackboneCompositeView
	,   BackboneCollectionView
	,	jQuery
	,	ReferenceMap
	)
{
	'use strict';

	return Backbone.View.extend({
		template: Template

	,   events: {
			'click [data-action="show-geolocation"]': 'toggleLocationView'
		,   'click [data-action="find-stores"]': 'findStores'
		}

		//@method initialize
		//@param {Object} options
	,   initialize: function (options) {
			this.application = options.application;
			this.reference_map = options.reference_map;

			this.collection = options.collection;
			this.profileModel = options.profileModel;
			this.isDevice = !! _.isPhoneDevice() || _.isTabletDevice();

			BackboneCompositeView.add(this);

			this.collection.on('reset', this.render, this);
			this.reference_map.on('ask_for_location', this.getLocation, this);
			this.profileModel.set('storeLocator_last_navigation', 'location');
		}

		//@method render
	,	render: function ()
		{
			this._render();
			var self = this
			,	input = self.$('#autocomplete').get(0);

			if (!this.collection.length)
			{
				if (this.isDevice)
				{
					this.localization_map = new ReferenceMap();
					this.localization_map.load().done(function ()
					{
						self.localization_map.showAutoCompleteInput(input);
						self.setInputValue();
					});
				}
				else
				{
					this.reference_map.load().done(function ()
					{
						self.reference_map.showAutoCompleteInput(input);
						self.setInputValue();
					});
				}
			}

			self.$('#site-footer').show();
		}

		//@method setInputValue
		//@return {void}
	,	setInputValue: function() {
			var last_search = this.profileModel.get('storeLocator_last_search')
			,	input = this.$('#autocomplete').get(0);

			if (last_search)
			{
				var map = this.localization_map ? this.localization_map : this.reference_map;
				if (map.autocomplete_location)
				{
					this.autocomplete_location = {
						latitude: last_search.latitude
					,	longitude: last_search.longitude
					};
					map.zoomToPoint(map.showMyPosition(this.autocomplete_location));
				}
				jQuery(input).val(last_search.address);
			}
		}

        //@property {Object} childViews
	,   childViews: {
		   'LocatorList': function ()
			{
				return new BackboneCollectionView({
					collection: this.collection
				,   childView: StoreLocatorListView
				,   childViewOptions: {
						reference_map: this.reference_map
					,	isDevice : this.isDevice
					}
				});
			}
		,	'LocalizationMap': function ()
			{
				return new StoreLocatorMapView({
					collection : this.collection
				,   application: this.application
				,   reference_map: this.localization_map
				});
			}
		}

		//@method toggleLocationView
		//@param {Object} e
	,   toggleLocationView: function (e)
		{

			this.reference_map.clearPointList();
			this.button_clicked = true;

			if (this.$(e.target).data('action') === 'show-geolocation')
			{
				var map = this.localization_map ? this.localization_map : this.reference_map;
				map.autocomplete_location = null;
				this.profileModel.unset('storeLocator_last_search');
				this.getLocation();
				this.$('[data-action="message-warning"]').hide();
			}
		}

		//@method getLocation
		//@return {Object}
	,   getLocation: function ()
		{
			if (navigator.geolocation)
			{
				navigator.geolocation.getCurrentPosition(_.bind(this.showPosition, this), _.bind(this.blockPosition, this));
			}
			else
			{
				console.warn('Geolocation is not supported by this browser.');
			}
		}

		//@method showPosition
		//@params {Position} position
	,   showPosition: function (position) {

			this.reference_map.myposition = {
				latitude: position.coords.latitude
			,   longitude: position.coords.longitude
			,   address: ''
			};

			this.reference_map.getCityGeoCode().done(_.bind(function(){
				this.collection.update({
						//@property {String} latitude
						latitude: this.reference_map.myposition.latitude
						//@property {String} longitude
					,	longitude: this.reference_map.myposition.longitude
						//@property {String} radius
					,   radius: this.reference_map.configuration.getRadius()
						//@property {String} sort
					,   sort: 'distance'
						//@property {String} page
					,	page: 'all'
						//@property {Number} killerId
					,   killerId: AjaxRequestsKiller.getKillerId()
						//@property {Boolean} reset
					,   reset: true
				});
			},this));

			this.button_clicked = false;
		}

		//@method errorPosition
		//@param {PositionError} error
	,   blockPosition: function(error) {
			  switch(error.code) {
		        case error.PERMISSION_DENIED:
			            this.$('[data-action="message-warning"]').show();
		            break;
		        case error.POSITION_UNAVAILABLE:
		            this.$('[data-action="message-warning"]').html('Location information is unavailable.').show();
		            break;
		        case error.TIMEOUT:
		            this.$('[data-action="message-warning"]').html('The request to get user location timed out.').show();
		            break;
		        case error.UNKNOWN_ERROR:
		            this.$('[data-action="message-warning"]').html('An unknown error occurred.').show();
		            break;
		    }
		}

		//@method findStores
		//@return {void}
	,   findStores: function ()
		{
			//If is mobile use localization_map
			var point = this.localization_map ? this.localization_map.autocomplete_location : this.reference_map.autocomplete_location
			,	radius = this.reference_map.configuration.getRadius();

			if (point)
			{
				this.reference_map.clearPointList();
				this.reference_map.myposition = point;

				this.collection.update({
					//@property {String} latitude
					latitude: point.latitude
					//@property {String} longitude
				,   longitude: point.longitude
					//@property {String} radius
				,   radius: this.reference_map.configuration.getRadius()
					//@property {String} sort
				,   sort: 'distance'
					//@property {String} page
				,	page: 'all'
					//@property {Number} killerId
				,   killerId: AjaxRequestsKiller.getKillerId()
					//@property {Boolean} reset
				,   reset: true
				});

				this.profileModel.set({
					'storeLocator_last_search': {
						latitude: point.latitude
					,   longitude: point.longitude
					,   address: point.address
					,   radius: radius
					,	url: Backbone.history.fragment
					}
				});
			}
			else
			{
				this.$('[data-action="message-error"]').show();
			}
		}

		//@method getContext
		//@return StoreLocator.Location.View.Context
	,   getContext: function ()
		{
			return {
				showList: !!this.collection.length
			,	myposition: this.reference_map.myposition && this.reference_map.myposition.address ? this.reference_map.myposition.address : ''
			,	totalStores: this.collection.length
			,	showLocalizationMap: this.isDevice && this.reference_map.configuration.showLocalizationMap()
			};
		}
	});
});