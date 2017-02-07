/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module StoreLocatorAccessPoints
define('StoreLocatorAccessPoints.HeaderLink.View'
,	[
		'ReferenceMap.Configuration'
	,	'storelocator_accesspoints_headerlink.tpl'

	,	'Backbone'
	]
,	function (
		ReferenceConfiguration
	,	storelocator_accesspoints_headerlink_tpl

	,	Backbone
	)
{
	'use strict';

	//@class StoreLocatorAccessPoints.HeaderLink.View @extend Backbone.View
	return Backbone.View.extend({

		//@property {Function} template
		template: storelocator_accesspoints_headerlink_tpl


		//@method getContext
		//@return {StoreLocatorAccessPoints.HeaderLink.View.Context}
	, 	getContext: function ()
		{
			//@class StoreLocatorAccessPoints.HeaderLink.View.Context
			return {
				//@Property {String} title
				title: ReferenceConfiguration.title()
				//@property {Boolean} hasClass
			,	hasClass: !!this.options.className
				//@property {String} className
			,	className: this.options.className

			};
			//@class StoreLocatorAccessPoints.HeaderLink.View
		}
	});
});