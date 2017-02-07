/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module StoreLocatorGoogleMapsImplementation
// Specific configuration redefinition for Google Maps implementation
define(
	'GoogleMap.Configuration'
,	[
		'ReferenceMap.Configuration'
	,	'SC.Configuration'
	,	'underscore'
	,	'Utils'
	]
,	function (
		ReferenceMapConfiguration
	,	Configuration
	,	_
	)
{
	'use strict';

	ReferenceMapConfiguration.mapOptions = function() 
	{
		return Configuration.get('storeLocator.mapOptions');
	};

	ReferenceMapConfiguration.iconOptions = function(attr) 
	{
		if (attr)
		{
			return Configuration.get('storeLocator.icons')[attr];
		}
		else
		{
			return Configuration.get('storeLocator.icons');
		}
	};

	ReferenceMapConfiguration.zoomInDetails = function() 
	{
		return Configuration.get('storeLocator.zoomInDetails');
	};

	ReferenceMapConfiguration.title = function() 
	{
		return Configuration.get('storeLocator.title');
	};

	ReferenceMapConfiguration.isEnabled = function() 
	{
		return Configuration.get('storeLocator.isEnabled');
	};

	ReferenceMapConfiguration.getUrl = function() 
	{
		return 'https://maps.googleapis.com/maps/api/js?v=3.21&key=' + Configuration.get('storeLocator.apiKey') + '&signed_in=false&libraries=places';
	};

	ReferenceMapConfiguration.getApiKey = function() 
	{
		return Configuration.get('storeLocator.apiKey');
	}

	ReferenceMapConfiguration.getExtraData = function () 
	{
		return Configuration.get('storeLocator.additionalStoresData');
	};

	ReferenceMapConfiguration.getRadius = function () 
	{
		return Configuration.get('storeLocator.radius');
	};

	ReferenceMapConfiguration.openPopupOnMouseOver = function () 
	{
		return Configuration.get('storeLocator.openPopupOnMouseOver');
	};

	ReferenceMapConfiguration.showLocalizationMap = function () 
	{
		return Configuration.get('storeLocator.showLocalizationMap');
	};

	ReferenceMapConfiguration.showAllStoresRecordsPerPage = function () 
	{
		return Configuration.get('storeLocator.showAllStoresRecordsPerPage');
	}

	return ReferenceMapConfiguration;
});
