/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// Case.Fields.ServiceController.js
// ----------------
// Service to manage support case fields
define(
	'Case.Fields.ServiceController', [
		'ServiceController', 'Case.Model', 'underscore'
	],
	function(
		ServiceController, CaseModel, _
	) {
		'use strict';
		// @class Case.Fields.ServiceController Manage support case fields
		// @extend ServiceController
		return ServiceController.extend({

			// @property {String} name Mandatory for all ssp-libraries model
			name: 'Case.Fields.ServiceController'

			// @property {Service.ValidationOptions} options. All the required validation, permissions, etc.
			// The values in this object are the validation needed for the current service.
			// Can have values for all the request methods ('common' values) and specific for each one.
			,
			options: {
				common: {
					requireLogin: true,
					requirePermissions: {
						list: [
							'lists.listCase.1'
						]
					}
				}
			}

			// @method get The call to Case.Fields.Service.ss with http method 'get' is managed by this function
			// @return {Case.Model} New Case record
			,
			get: function() {
				// try {
				// 	//var search = Application.getAllSearchResults('customrecord_productdependency', null, [new nlobjSearchColumn('name'), new nlobjSearchColumn('custrecord_productcategory')]);
				// 	var search = nlapiSearchRecord('customrecord_productdependency', 'customsearch_bf_sca_prodcatdep')

				// 	var product_dependency_values = [];

				// 	_(search).each(function(rs) {
				// 		var pd_value = {
				// 			pid: rs.id,
				// 			pname: rs.getText('name'),
				// 			pparent: rs.getValue('custrecord_productcategory')
				// 		};

				// 		product_dependency_values.push(pd_value);

				// 	});
				// 	var cm = CaseModel.getNew();
				// 	cm.categorydependency = product_dependency_values;

				// 	return cm;
				// } catch (e) {
				// 	nlapiLogExecution('ERROR', 'fieldservice', "Error: " + e)
				// }
				return CaseModel.getNew();
			}
		});
	}
);