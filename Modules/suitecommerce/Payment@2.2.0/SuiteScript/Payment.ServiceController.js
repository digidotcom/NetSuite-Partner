/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// Payment.ServiceController.js
// ----------------
// Service to manage payment requests
define(
	'Payment.ServiceController'
,	[
		'ServiceController'
	,	'Payment.Model'
	]
,	function(
		ServiceController
	,	PaymentModel
	)
	{
		'use strict';

		// @class Payment.ServiceController Manage payment requests
		// @extend ServiceController
		return ServiceController.extend({

			// @property {String} name Mandatory for all ssp-libraries model
			name: 'Payment.ServiceController'

			// @property {Service.ValidationOptions} options. All the required validation, permissions, etc.
			// The values in this object are the validation needed for the current service.
			// Can have values for all the request methods ('common' values) and specific for each one.
		,	options: {
				common: {
					requireLogin: true
				,	requirePermissions: {
						list: [
							'transactions.tranCustPymt.1'
						]
					}
				}
			}

			// @method get The call to Payment.Service.ss with http method 'get' is managed by this function
			// @return {Payment.Model.Attributes}
		,	get: function()
			{
				var id = this.request.getParameter('internalid');
				return PaymentModel.get(id);
			}
		});
	}
);