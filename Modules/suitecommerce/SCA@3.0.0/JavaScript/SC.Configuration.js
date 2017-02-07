/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module SC
// @class SC.Configuration
// This class is responsible of creating the front end SC.Configuration object from the properties bootstrapped in SC.CONFIGURATION from backend. Also it does some properties post processing.

define(
	'SC.Configuration'
,	[

		'item_views_option_tile.tpl'
	,	'item_views_option_text.tpl'
	,	'item_views_selected_option.tpl'

	,	'underscore'
	,	'jQuery'
	,	'Utils'
	]

,	function (

		item_views_option_tile_tpl
	,	item_views_option_text_tpl
	,	item_views_selected_option_tpl

	,	_
	,	jQuery
	,	Utils
	)
{

	'use strict';

	var baseConfiguration = SC.CONFIGURATION || {};

	var Configuration = {


		searchPrefs:
		{
			// Keyword formatter function will format the text entered by the user in the search box. This default implementation will remove invalid keyword characters like *()+-="
			keywordsFormatter: function (keywords)
			{
				if (keywords === '||')
				{
					return '';
				}

				var anyLocationRegex = /[\(\)\[\]\{\~\}\!\"\:\/]{1}/g // characters that cannot appear at any location
				,	beginingRegex = /^[\*\-\+]{1}/g // characters that cannot appear at the begining
				,	replaceWith = ''; // replacement for invalid chars

				return keywords.replace(anyLocationRegex, replaceWith).replace(beginingRegex, replaceWith);
			}
		}

	,	templates: {
			itemOptions: {
				// each apply to specific item option types
				selectorByType:	{
					select: item_views_option_tile_tpl
				,	'default': item_views_option_text_tpl
				}
				// for rendering selected options in the shopping cart
			,	selectedByType: {
					'default': item_views_selected_option_tpl
				}
			}
		}

	,	bxSliderDefaults: {
			minSlides: 2
		,	slideWidth: 228
		,	maxSlides: 5
		,	forceStart: true
		,	pager: false
		,	touchEnabled:true
		,	nextText: '<a class="item-details-carousel-next"><span class="control-text">' + _('next').translate() + '</span> <i class="carousel-next-arrow"></i></a>'
		,	prevText: '<a class="item-details-carousel-prev"><i class="carousel-prev-arrow"></i> <span class="control-text">' + _('prev').translate() + '</span></a>'
		,	controls: true
		,	preloadImages: 'all'
		}

	,	siteSettings: SC && SC.ENVIRONMENT && SC.ENVIRONMENT.siteSettings || {}

	,	get: function (path, defaultValue)
		{
			return _.getPathFromObject(this, path, defaultValue);
		}

		//TODO: move this method to another file
	,	getRegistrationType: function ()
		{
    		//registrationmandatory is 'T' when customer registration is disabled
			if (Configuration.get('siteSettings.registration.registrationmandatory') === 'T')
			{
				// no login, no register, checkout as guest only
				return 'disabled';
			}
			else
			{
				if (Configuration.get('siteSettings.registration.registrationoptional') === 'T')
				{
					// login, register, guest
					return 'optional';
				}
				else
				{
					if (Configuration.get('siteSettings.registration.registrationallowed') === 'T')
					{
						// login, register, no guest
						return 'required';
					}
					else
					{
						// login, no register, no guest
						return 'existing';
					}
				}
			}
		}
	};

	// Deep extend
	jQuery.extend(true, baseConfiguration, Configuration);



	//BACKWARDS COMPATIBILITY: all the following is a normalization to the object baseConfiguration to guarantee backguard compatibility with pre montblanc in the sense of configuration property names in application.getConfig('foo')

	//fixing some properties for backward compatibility w montblanc:
	var imageSizeMapping = {};

	_.each(baseConfiguration.imageSizeMapping, function(item)
	{
		imageSizeMapping[item.id] = item.value;
	});

	baseConfiguration.imageSizeMapping = imageSizeMapping;

	var searchApiMasterOptions = {};

	_.each(baseConfiguration.searchApiMasterOptions, function(item)
	{
		searchApiMasterOptions[item.id] = {
			fieldset: item.fieldset
		,	include: item.include
		};
	});

	baseConfiguration.searchApiMasterOptions = searchApiMasterOptions;
	//social sharing backward compatibility

	var addThisOptions = {};

	_.each(baseConfiguration.addThis && baseConfiguration.addThis.options, function(item)
	{
		addThisOptions[item.key] = item.value;
	});

	baseConfiguration.addThis && (baseConfiguration.addThis.options = addThisOptions);

	var addThisServicesToShow = {};

	_.each(baseConfiguration.addThis && baseConfiguration.addThis.servicesToShow, function(item)
	{
		addThisServicesToShow[item.key] = item.value;
	});

	baseConfiguration.addThis && (baseConfiguration.addThis.servicesToShow = addThisServicesToShow);

	_.each(baseConfiguration.paymentmethods, function (item)
	{
		try
		{
			if (item.regex)
			{
				item.regex = new RegExp(item.regex);
			}

		}
		catch (ex)
		{

		}
	});

	if (baseConfiguration.productReviews && baseConfiguration.productReviews.sortOptions)
	{
		_.each(baseConfiguration.productReviews.sortOptions, function (sortOptions)
		{
			try
			{
				sortOptions.params = JSON.parse(sortOptions.params || '{}') || {};
			}
			catch (ex)
			{

			}
		});
	}
	if (baseConfiguration.productReviews && baseConfiguration.productReviews.filterOptions)
	{
		_.each(baseConfiguration.productReviews.filterOptions, function (filterOptions)
		{
			try
			{
				filterOptions.params = JSON.parse(filterOptions.params || '{}') || {};
			}
			catch (ex)
			{

			}
		});
	}

	//ordering facets array according to priority property
	baseConfiguration.facets = baseConfiguration.facets || [];
	baseConfiguration.facets.sort(function (facet1, facet2)
	{
		return facet1.priority > facet2.priority ? 0 : 1;
	});
	//Make of facet color property a object with the color name as
	//the property and the color value as the value of the property.
	function getColorPalette(colorPaletteName)
	{
		var colors = {};
		//empty colorPaletteName is not allowed
		if (!colorPaletteName)
		{
			return colors;
		}
		_.each(baseConfiguration.facetsColorPalette, function(item)
		{
			if(item.paletteId === colorPaletteName)
			{
				colors[item.colorName] = item.colorValue;
			}
		});
		return colors;
	}
	_.each(baseConfiguration.facets, function(facet)
	{
		facet.colors = getColorPalette(facet.colors);
	});
	//Make of itemOptions color property a object with the color name as
	//the property and the color value as the value of the property.
	_.each(baseConfiguration.itemOptions, function(itemOption)
	{
		itemOption.colors = getColorPalette(itemOption.colors);
	});

	//extraTranslations
	var currentLocale = SC && SC.ENVIRONMENT && SC.ENVIRONMENT.currentLanguage && SC.ENVIRONMENT.currentLanguage.locale;
	_.each(baseConfiguration.extraTranslations, function (item)
	{
		if (item[currentLocale])
		{
			SC.Translations[item.key] = item[currentLocale];
		}
	});

	//navigation data
	baseConfiguration.navigationData = baseConfiguration.navigationData || [];

	// navigation hierarchy bindings.
	_.each(baseConfiguration.navigationData, function (entry)
	{
		if (!entry)
		{
			return;
		}
		else
		{
			if(entry.placeholder)
			{
				entry.text = '';
			}
			entry.class = 'header-menu-level' + entry.level + '-anchor';
		}
		if (entry.parentId)
		{
			var parent = _.find(baseConfiguration.navigationData, function (e)
			{
				return e.id===entry.parentId;
			});
			parent = parent || {};
			parent.categories = parent.categories || [];
			parent.categories.push(entry);
		}
		if (entry.classnames)
		{
			entry.class += ' ' + entry.classnames;
		}
	});
	// Now, remove  non top level nav entries from the array (root nodes)
	// heads up ! we have to re-iterate :( this is the correct way of deleting and iterating an array - not _.each()
	for (var i = 0; i < baseConfiguration.navigationData.length; i++)
	{
		var entry = baseConfiguration.navigationData[i];
		if (!entry || entry.level > 1)
		{
			baseConfiguration.navigationData.splice(i, 1);
			i--;
		}
	}

	Utils.setPathFromObject(baseConfiguration, 'forms.address.showAddressLine2', Utils.getPathFromObject(baseConfiguration, 'forms.address.showAddressLineTwo', true));

	return baseConfiguration;

});
