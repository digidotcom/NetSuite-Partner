/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module Invoice
define('Invoice.Model'
,	[	'OrderLine.Collection'
	,	'OrderShipmethod.Collection'
	,	'Address.Collection'
	,	'CreditCard.Collection'
	,	'OrderPaymentmethod.Collection'
	,	'Transaction.Collection'
	,	'underscore'
	,	'Backbone'
	,	'Utils'
	]
,	function (
		OrderLinesCollection
	,	ShipmethodsCollection
	,	AddressesCollection
	,	CreditCardsCollection
	,	OrderPaymentmethodCollection
	,	TransactionCollection
	,	_
	,	Backbone
	)
{
	'use strict';

	function validatePayment(value)
	{
		if (isNaN(parseFloat(value)))
		{
			return _('The amount to pay is not a valid number').translate();
		}
		if (value <= 0)
		{
			return _('The amount to apply has to be positive').translate();
		}
		/*jshint validthis:true */
		if (value > this.get('due'))
		{
			return _('The amount to pay cannot exceed the remaining').translate();
		}
	}
	//@class Invoice.Model @extends Backbone.Model
	return Backbone.Model.extend({
		//@property {String} urlRoot
		urlRoot: 'services/Invoice.Service.ss'
		//@property {Object} validation
	,	validation : {
			amount: { fn: validatePayment }
		}
		//@method initialize
	,	initialize: function (attributes)
		{
			this.on('change:lines', function (model, lines)
			{
				model.set('lines', new OrderLinesCollection(lines), {silent: true});
			});

			this.trigger('change:lines', this, attributes && attributes.lines || []);

			this.on('change:shipmethods', function (model, shipmethods)
			{
				model.set('shipmethods', new ShipmethodsCollection(shipmethods), {silent: true});
			});
			this.trigger('change:shipmethods', this, attributes && attributes.shipmethods || []);

			this.on('change:addresses', function (model, addresses)
			{
				model.set('addresses', new AddressesCollection(addresses), {silent: true});
			});
			this.trigger('change:addresses', this, attributes && attributes.addresses || []);

			this.on('change:paymentmethods', function (model, paymentmethods)
			{
				model.set('paymentmethods', new OrderPaymentmethodCollection(paymentmethods), {silent: true});
			});
			this.trigger('change:paymentmethods', this, attributes && attributes.paymentmethod || []);

			this.on('change:adjustments', function (model, adjustments)
			{
				model.set('adjustments', new TransactionCollection(adjustments), {silent: true});
			});
			this.trigger('change:adjustments', this, attributes && attributes.adjustments || []);

		}
		//@method isPayFull
	,	isPayFull : function()
		{
			if (this.get('discountapplies'))
			{
				return this.get('amount') === this.get('duewithdiscount');
			}
			else
			{
				return this.get('amount') === this.get('due');
			}
		}
	});
});
