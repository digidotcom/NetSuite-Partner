/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module Header
define(
	'Header.MiniCart.View'
,	[
		'LiveOrder.Model'
	,	'Header.MiniCartSummary.View'
	,	'Header.MiniCartItemCell.View'
	,	'Profile.Model'

	,	'SC.Configuration'

	,	'header_mini_cart.tpl'

	,	'underscore'
	,	'Backbone'
	,	'Backbone.CompositeView'
	,	'Backbone.CollectionView'
	,	'underscore'
	,	'Utils'
	]
,	function(
		LiveOrderModel
	,	HeaderMiniCartSummaryView
	,	HeaderMiniCartItemCellView
	,	ProfileModel
	,	Configuration

	,	header_mini_cart_tpl

	,	_
	,	Backbone
	,	BackboneCompositeView
	,	BackboneCollectionView
	)
{
	'use strict';

	// @class Header.MiniCart.View @extends Backbone.View
	return Backbone.View.extend({

		template: header_mini_cart_tpl

	,	initialize: function()
		{
			BackboneCompositeView.add(this);

			var self = this;

			this.isLoading = true;
			this.itemsInCart = 0;

			LiveOrderModel.loadCart().done(function ()
			{
				var cart = LiveOrderModel.getInstance();
			
				self.itemsInCart = cart.getTotalItemCount();
			
				self.isLoading = false;
				self.render();

				cart.on('change', function ()
				{
					self.itemsInCart = cart.getTotalItemCount();
					self.render();
				});
			});
		}

	,	render: function()
		{
			Backbone.View.prototype.render.apply(this, arguments);

			//on tablet or desktop make the minicart dropdown
			if ( _.isTabletDevice() || _.isDesktopDevice())
			{
				this.$('[data-type="mini-cart"]').attr('data-toggle', 'dropdown');
			}

		}

	,	childViews: {
			'Header.MiniCartSummary': function()
			{
				return new HeaderMiniCartSummaryView();
			}
		,	'Header.MiniCartItemCell': function()
			{
				return new BackboneCollectionView({
					collection: !this.isLoading ? LiveOrderModel.getInstance().get('lines') : new Backbone.Collection()
				,	childView: HeaderMiniCartItemCellView
				,	viewsPerRow: 1
				});
			}
		}

		// @method getContext @return {Header.MiniCart.View.Context}
	,	getContext: function()
		{
			var summary = LiveOrderModel.getInstance().get('summary');

			// @class Header.MiniCart.View.Context
			return {
				// @property {Number} itemsInCart
				itemsInCart: this.itemsInCart
				// @property {Boolean} showPluraLabel
			,	showPluraLabel: this.itemsInCart !== 1

				// @property {Boolean} showLines
			,	showLines: this.itemsInCart > 0
				// @property {Boolean} isLoading
			,	isLoading: this.isLoading

				// @property {Boolean} subTotal
			,	subTotal: false

				// @property {String} subtotalFormatted
			,	subtotalFormatted: !this.isLoading ? (summary && summary.subtotal_formatted) : ''
				// @property {OrderLine.Collection} lines
			,	lines: !this.isLoading ? LiveOrderModel.getInstance().get('lines') : new Backbone.Collection()

				// @property {String} cartTouchPoint
			,	cartTouchPoint: _.getPathFromObject(Configuration, 'modulesConfig.Cart.startRouter', false) ? Configuration.currentTouchpoint : 'viewcart'
				// @property {Boolean} isPriceEnabled
			,	isPriceEnabled: !ProfileModel.getInstance().hidePrices()
			};
		}
	});

});