/* eslint-disable */
/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/
// @module OrderHistory
// Implements the experience of seeing all the customer Orders experience, this is the 'Order History' experience in MyAccount. Includes the Order module (Model, Collection, Views, Router)
define('OrderHistory'
,	[	
		'OrderHistory.Router'
	,	'SC.Configuration'
	,	'underscore'
	,	'Utils'
	]
,	function (
		Router
	,	Configuration
	,	_
	)
{
	'use strict';

	// @class OrderHistory @extends ApplicationModule
	return	{
		// @property {MenuItem} MenuItems
		MenuItems: {
			id: 'quotes'
		,	name: _('Completed Quotes').translate()
		,	url: 'quotes'
		,	index: 1
		,	permission: 'transactions.tranFind.1,transactions.tranEstimate.1'
		}

		// @method mountToApp
	,	mountToApp: function (application)
		{
			var router = new Router(application);

			if (Configuration.get('siteSettings.isSCISIntegrationEnabled', false))
			{
				router.route('instore-purchases', 'listInStorePurchases');
				router.route('instore-purchases?:options', 'listInStorePurchases');
			}
	
			return router;
		}
	};
});
/* eslint-enable */
