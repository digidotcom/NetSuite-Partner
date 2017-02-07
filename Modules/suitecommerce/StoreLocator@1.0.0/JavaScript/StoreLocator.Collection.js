/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module StoreLocator
define('StoreLocator.Collection'
,	[
		'Backbone.CachedCollection'
	,	'StoreLocator.Model'
	,	'underscore'
	]
,	function (
		BackboneCachedCollection
	,	StoreLocatorModel
	,	_
	)
{
	'use strict';

	//@class StoreLocator.Collection @extend Backbone.Collection
	return BackboneCachedCollection.extend({

		//@property {StoreLocator.Model} model
		model: StoreLocatorModel

		//@property {String} url
	,	url: _.getAbsoluteUrl('services/StoreLocator.Service.ss')

		//@method parse Transforms the JSON response to extract  the array of models from the correct
		//response as to know what page is loaded
	,	parse: function (response)
		{
			if (!_.isUndefined(response.totalRecordsFound))
			{
				this.totalRecordsFound = response.totalRecordsFound;
				this.recordsPerPage = response.recordsPerPage;
				return response.records;
			}
			else
			{
				return response;
			}
		}

		//@method update
		//@param {Object} options
		//@return {Void}
	,	update: function (options)
		{
			this.fetch({
			    data: {
	          		//@property {String} latitude
	                latitude: options.latitude
	                //@property {String} longitude
	            ,   longitude: options.longitude
	                //@property {String} radius
	            ,   radius: options.radius
	                //@property {String} sort
	            ,   sort: options.sort
	                //@property {String} page
                ,   page: options.page

                ,	results_per_page: options.results_per_page
				}
			,	reset: !!options.reset
			,	killerId: options.killerId
			});
		}

	});
});