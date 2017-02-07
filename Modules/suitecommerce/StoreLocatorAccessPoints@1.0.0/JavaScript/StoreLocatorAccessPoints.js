/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module StoreLocatorAccessPoints
define(
	'StoreLocatorAccessPoints'
,   [
		'ReferenceMap.Configuration'
	,	'StoreLocatorAccessPoints.HeaderLink.View'
	,   'Header.View'
	,   'Header.Menu.View'
	]
,   function (
		ReferenceConfiguration
	,	StoreLocatorWizardHeaderLinkView
	,   HeaderView
	,   HeaderMenuView
	)
{
	'use strict';

	//@class StoreLocatorAccessPoints @extend ApplicationModule
	return  {

		//@method mountToApp
		//@param {ApplicationSkeleton} application
		//@return {Void}
		mountToApp: function ()
		{
			if (!ReferenceConfiguration.isEnabled())
			{
				return;
			}

			HeaderView.addExtraChildrenViews && HeaderView.addExtraChildrenViews({
				'StoreLocatorHeaderLink': function wrapperFunction ()
				{
					return function ()
					{
						return new StoreLocatorWizardHeaderLinkView({});
					};
				}
			});

			HeaderMenuView.addExtraChildrenViews && HeaderMenuView.addExtraChildrenViews({
				'StoreLocatorHeaderLink': function wrapperFunction ()
				{
					return function ()
					{
						return new StoreLocatorWizardHeaderLinkView({
							className: ' '
						});
					};
				}
			});
		}
	};
  }
);