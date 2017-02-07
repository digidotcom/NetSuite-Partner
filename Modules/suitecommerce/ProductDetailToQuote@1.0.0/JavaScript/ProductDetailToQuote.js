/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module ProductDetailToQuote
define(
	'ProductDetailToQuote'
,   [
		'ItemDetails.View'
	,	'ItemDetails.Model'
	,	'ProductDetailToQuote.View'
	]
,   function (
		ItemDetailsView
	,	ItemDetailsModel
	,	ProductDetailToQuoteView
	)
{
	'use strict';

	//@class ProductDetailToQuote @extend ApplicationModule
	return  {
		//@method mountToApp
		//@param {ApplicationSkeleton} application
		//@return {Void}
		mountToApp: function mountToApp (application)
		{
			// We show the ProductDetailToQuote only if is not the SEO
			if (!SC.isPageGenerator())
			{
				//Set the extra children of the ItemDetails.View
				ItemDetailsView.addExtraChildrenViews && ItemDetailsView.addExtraChildrenViews({
					'ItemDetails.AddToQuote': function wrapperFunction (model)
					{
						return function ()
						{
							return new ProductDetailToQuoteView(
							{
								'model': model
							,	'application': application
							});
						};
					}
				});
			}
		}
	};
});
