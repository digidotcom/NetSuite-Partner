/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module ProductDetailToQuote
define('ProductDetailToQuote.View'
,	[
		'SC.Configuration'
	,	'Utils'
	,	'GlobalViews.Message.View'
	,	'ProductList.Model'
	,	'ProductList.Item.Model'
	,	'Profile.Model'
	,	'Session'

	,	'product_detail_to_quote.tpl'

	,	'Backbone'
	,	'underscore'
	]
,	function (
		Configuration
	,	Utils
	,	GlobalViewsMessageView
	,	ProductListModel
	,	ProductListItemModel
	,	ProfileModel
	,	Session

	,	productDetailToQuote_tpl

	,	Backbone
	,	_
	)
{
	'use strict';

	// @class Newsletter.View @extend Backbone.View
	return Backbone.View.extend({

		// @property {Function} template
		template: productDetailToQuote_tpl

		// @property {Object} events
	,	events: {
			'click [data-type="add-to-quote"]': 'itemToQuote'
		}

		// @method initialize
		// @param {ProductDetailToQuote.View.initialize.Options} options
		// @return {Void}
	,	initialize: function initialize (options)
		{
			this.application = options.application;
			this.layout = options.application.getLayout();

			var self = this;
			this.profile_promise = ProfileModel.getPromise();
			this.profile_promise.done(function ()
			{
				self.profile_model = ProfileModel.getInstance();
				self.quote_permissions = SC.ENVIRONMENT.permissions.transactions.tranEstimate >= 2;
				self.render();
			});
		}

		// @method itemToQuote Add/update an item from the pdp to current user quote
		// If the quote doesn't exist, we create one
		// If the quote exist but the item is not present, we put it there
		// If the quote exist and has the item, we update the quantity
		// @param {HTMLEvent} e
		// @return {Void}
	,	itemToQuote: function itemToQuote (e)
		{
			var self = this;

			e.preventDefault();

			this.clearFeedbackElement();

			//if user is logged in but isn't allowed to quote, we warn him.
			if (this.profile_model.get('isLoggedIn') === 'T' && !this.quote_permissions)
			{
				this.showPermissionsWarning();
				return;
			}

			if (this.model.isSelectionComplete() && this.isQuotable() && this.validateLogin())
			{
				this.application.ProductListModule.Utils.getRequestAQuoteProductList().done(function(product_list_json)
				{
					if (!product_list_json.internalid)
					{
						var product_list_model = new ProductListModel(product_list_json);

						product_list_model.save().done(function (product_list_json)
						{
							self.addItemToQuote(product_list_json, self.model);
						});
					}
					else
					{
						var item_options = self.getItemOptions(self.model.itemOptions)
						,	item_present_in_list = _.find(product_list_json.items, function (item_list)
							{
								return parseInt(item_list.item.internalid) === parseInt(self.application.ProductListModule.Utils.internalGetProductId(self.model)) &&
									_.isEqual(item_options, item_list.options);
							});

						if (item_present_in_list)
						{
							self.updateItemInQuote(item_present_in_list);
						}
						else
						{
							self.addItemToQuote(product_list_json, self.model);
						}
					}
				});
			}
		}

		// @method addItemToQuote Add a new item to the quote collection
		// @param {JSON} product_list (Please note that it is not a Backbone collection, but a JSON object).
		// @param {ItemDetail.Model} product
		// @return {Void}
	,	addItemToQuote: function (product_list, product)
		{

			var quantity_to_add, message;

			if (product.get('quantity') < product.get('_minimumQuantity'))
			{
				quantity_to_add = product.get('_minimumQuantity');
				message = true;
			}
			else
			{
				quantity_to_add = product.get('quantity');
			}

			var self = this
			,	product_list_item = {
					description: ''
				,	options: this.getItemOptions(product.itemOptions)
				,	quantity: quantity_to_add
				,	productList: {
						id: product_list.internalid
					}
				,	item: {
						internalid: this.application.ProductListModule.Utils.internalGetProductId(product)
					}
			}
			,	product_list_item_model = new ProductListItemModel(product_list_item);

			product_list_item_model.save().done(function ()
			{
				self.showConfirmation(quantity_to_add, message);
			});
		}

		// @method updateItemInQuote Update the item in the quote collection
		// @param {Object} item_in_list Object with item list model data. (Please note that it is not a Backbone Model).
		// @return {Void}
	,	updateItemInQuote: function (item_in_list)
		{
			var self = this
			,	quantity_to_add = this.model.get('quantity')
			,	new_quantity = parseInt(item_in_list.quantity, 10) + parseInt(quantity_to_add, 10)
			,	product_list_item_model = new ProductListItemModel({'internalid': item_in_list.internalid});

			product_list_item_model.set('quantity', new_quantity);

			product_list_item_model.save().done(function ()
			{
				self.showConfirmation(quantity_to_add);
			});
		}

		// @method getItemOptions Extract the options of the item
		// @return {ItemOptionsObject} Item options
	,	getItemOptions: function (itemOptions)
		{
			var result = {};

			_.each(itemOptions, function (value, name)
			{
				result[name] = { value: value.internalid, displayvalue: value.label };
			});

			return result;
		}

		//@method isQuotable Check if this item is able to be quoted
		//@return {Boolean} True if item is OK to be quoted
	,	isQuotable: function ()
		{
			if (this.model.get('_itemType') === 'GiftCert' ||  this.model.get('_itemType') === 'Discount')
			{
				return false;
			}

			return true;
		}

		// @method showConfirmation Shows the confirmation of the operation
		// @param {Integer} quantity
		// @param {Boolean} minimum_quantity_message Flag about enforcement of minimum quantity
		// @return {Void}
	,	showConfirmation: function (quantity, minimum_quantity_message)
		{
			var message
			,	global_view_message
			,	element = this.getFeedbackElement();

			if (minimum_quantity_message)
			{
				message = _('$(0) has been added to your <a href="#" data-hashtag="#request-a-quote" data-touchpoint="customercenter" data-trigger="go-to-quote">Quote Request</a><br>Quantity: $(1). (Enforced minimum quantity)').translate(this.model.get('itemid'), quantity);
			}
			else
			{
				message = _('$(0) has been added to your <a href="#" data-hashtag="#request-a-quote" data-touchpoint="customercenter" data-trigger="go-to-quote">Quote Request</a><br>Quantity: $(1)').translate(this.model.get('itemid'), quantity);
			}

			global_view_message = new GlobalViewsMessageView({
					message: message
				,	type: 'success'
				,	closable: true
			});

			element && element.append(global_view_message.render().$el.html());
		}

		// @method showPermissionsWarning Show message if user is not allowed to quote
		// @return {Void}
	,	showPermissionsWarning: function ()
		{
			var element = this.getFeedbackElement()
			,	phone = Configuration.get('quote.defaultPhone')
			,	email = Configuration.get('quote.defaultEmail')
			,	message = _('Sorry, you don\'t have sufficient permissions to request a quote online. <br/> For immediate assistance <strong>call us at $(0)</strong> or email us to <strong>$(1)</strong>').translate(phone, email)
			,	global_view_message = new GlobalViewsMessageView({
					message: message
				,	type: 'warning'
				,	closable: true
			});

			element && element.append(global_view_message.render().$el.html());
		}

		// @method getFeedbackElement Determine which kind of pdp is being displayed and return the proper alert-placeholder DOM element
		// @return {jQuery | Boolean} It returns the feedback placeholder element, as a jQuery array of DOM elements. If it isn't there, returns 'false'
	,	getFeedbackElement: function ()
		{
			var element = false;

			if (!!this.layout.currentView.$el.find('[data-role="pdp-feedback"]').length)
			{
				element = this.layout.currentView.$el.find('[data-role="pdp-feedback"]');
			}
			else if (!!this.layout.$containerModal.length)
			{
				element = this.layout.$containerModal.find('[data-role="pdp-feedback"]');
			}
			return element;
		}

		// @method clearFeedbackElement Clean up feedback message
		// @return {Void}
	,	clearFeedbackElement: function ()
		{
			var element = this.getFeedbackElement();
			element && element.empty();
		}

		// @method validateLogin Check if user is logged in. Else he is redirected to do so
		// @return {Boolean}
	,	validateLogin: function ()
		{
			if (this.profile_model.get('isLoggedIn') === 'T')
			{
				return true;
			}

			var params = {
					'origin': this.application.getConfig('currentTouchpoint')
				,	'origin_hash': encodeURIComponent(Backbone.history.fragment)
				};

			//if we are in the quick view
			if (this.$el.closest('.modal-product-detail').size() > 0)
			{
				var hashtag = this.$el.closest('.modal-product-detail').find('[data-name="view-full-details"]').data('hashtag');
				params.origin_hash = encodeURIComponent(hashtag.replace('#/', ''));
			}

			var login = Utils.addParamsToUrl(Session.get('touchpoints.login'), params);

			window.location.href = login;

			return false;
		}

		// @method getContext
		// @return {ProductDetailToQuote.View.Context}
	,	getContext: function getContext ()
		{
			// @class ProductDetailToQuote.View.Context
			return {
				// @property {Boolean} isQuotable
				isQuotable: this.isQuotable()
				// @property {Boolean} isLoading
			,	isLoading: this.profile_promise.state() === 'pending'
				// @property {Boolean} isReadyForQuote
			,	isReadyForQuote: this.model.isSelectionComplete()
			};
		}
	});
});
