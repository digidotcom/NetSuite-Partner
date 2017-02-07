/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module Location
define('Location.Collection'
,	[	'Location.Model'
	,	'underscore'
	,	'Backbone'
	]
,	function (
		LocationModel
	,	_
	,	Backbone)
{
	'use strict';

	//@class Location.Collection @extend Backbone.Collection
	return Backbone.Collection.extend({

		//@property {Location.Model} model
		model: LocationModel

		//@property {String} url
	,	url: _.getAbsoluteUrl('services/Location.Service.ss')

		//@method parse Transform the JSON response to extract away the array of model from the correct
		//response as to know what page is loaded
	,	parse: function (response)
		{
			if (response.totalRecordsFound)
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
				}
			,	reset: !!options.reset
			,	killerId: options.killerId
			});
		}

	});
});