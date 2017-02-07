/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

// @module QuickAdd
define(
	'QuickAdd.View',
	[
		'SC.Configuration'
	,	'ItemsSearcher.View'
	,	'QuickAdd.Model'
	,	'Backbone.FormView'
	,	'Backbone.CompositeView'
	,	'Backbone.CollectionView'
	,	'ItemViews.SelectedOption.View'
	,	'ItemViews.Price.View'
	,	'ItemViews.Stock.View'
	,	'QuickAdd.ItemsSearcher.Plugins'
	,	'Transaction.Line.Model'

	,	'quick_add.tpl'
	,	'quick_add_item.tpl'

	,	'Backbone'
	,	'underscore'
	]
,	function (
		Configuration
	,	ItemsSearcherView
	,	QuickAddModel
	,	BackboneFormView
	,	BackboneCompositeView
	,	BackboneCollectionView
	,	ItemViewsSelectedOptionView
	,	ItemViewsPriceView
	,	ItemViewsStockView
	,	QuickAddItemsSearcherPlugins
	,	TransactionLineModel

	,	quick_add_tpl
	,	quick_add_item_tpl

	,	Backbone
	,	_
	)
{
	'use strict';

	// @class QuickAdd.View @extends Backbone.View
	return Backbone.View.extend({

		//@property {Function} template
		template: quick_add_tpl

		//@property {Object} events
	,	events: {
			'click [data-type="quick-add-reset"]': 'resetHandle'
		,	'submit form': 'saveForm'

		,	'click [data-action="plus"]': 'addQuantity'
		,	'click [data-action="minus"]': 'subQuantity'
		,	'change [data-type="quantity-input"]': 'setQuantity'
		,	'click [data-type="quantity-input"]': 'selectAll'
		,	'keypress [name="quantity"]': 'submitOnEnter'
		,	'keydown [name="quantity"]': 'onKeyDown'
		}

		//@method initialize Override default initialization method to configure inner itemsSearcher component
		//@param {QuickAdd.View.Initialize.Options?} options
		//@return {Void}
	,	initialize: function ()
		{
			this.itemsSearcherComponent = new ItemsSearcherView({
				minLength: Configuration.get('typeahead.minLength', 3)
			,	maxLength: Configuration.get('searchPrefs.maxLength', 0)
			,	limit: Configuration.get('typeahead.maxResults', 10)
			,	sort: Configuration.get('typeahead.sort','relevance:asc')
			,	highlight: Configuration.get('typeahead.highlight', true)
			,	componentId: 'quickaddSearch'
			,	componentName: 'quickaddSearch'
			,	showMenuOnClick: true
			,	showSeeAll: false
			,	collectionOptions:
				{
					searcherAPIConfiguration: 'searchApiMasterOptions.itemsSearcher'
				}
			,	itemViewOptions:
				{
					template: quick_add_item_tpl
				,	extraChildViews: {
						'Item.Options': function (model)
						{
							return function ()
							{
								var fake_linen = new Backbone.Model();
								fake_linen.set('options', model.get('selected_line_options'));

								return new BackboneCollectionView({
									collection: new Backbone.Collection(model.getPosibleOptions())
								,	childView: ItemViewsSelectedOptionView
								,	viewsPerRow: 1
								,	childViewOptions: {
										cartLine: fake_linen
									}
								});
							};
						}
					,	'Item.Price': function (model)
						{
							return function ()
							{
								return new ItemViewsPriceView({
									model: model
								});
							};
						}
					,	'Item.Stock': function (model)
						{
							return function ()
							{
								return new ItemViewsStockView({
									model: model
								});
							};
						}
					}
				}
			,	getItemDisplayName: function (item, query)
				{
					return item ? item.get('_sku') : query;
				}
			});

			this.itemsSearcherComponent.postItemsSuggestionObtained.install(QuickAddItemsSearcherPlugins.flatItemsMatrixResult);

			this.model = new QuickAddModel();
			this.model.setItemQuantityGetter(this.options.getItemQuantitySet);

			this.itemsSearcherComponent.on('itemSelected', this.onItemSelected, this);
			this.itemsSearcherComponent.on('keyUp', this.showReset, this);
			this.itemsSearcherComponent.on('keyDown', this.cleanSearchOnEnter, this);

			var original_save_form = this.saveForm;
			BackboneCompositeView.add(this);
			BackboneFormView.add(this);
			this.saveForm = original_save_form;
		}

		//@method saveForm Handle the current form validation and triggers the event selectedLien
		//@param {jQueryEvent} e
		//@return {Void}
	,	saveForm: function (e)
		{
			e.preventDefault();

			Backbone.Validation.bind(this);

			this.model.set(this.$('form').serializeObject());

			if (this.model.isValid(true) && this.model.get('selectedItem'))
			{
				var selected_line = new TransactionLineModel(this.model.attributes);
				selected_line.set('item', this.model.get('selectedItem').attributes);

				var line_options = this.model.get('selectedItem').get('selected_line_options');
				_.each(line_options, function (option)
				{
					selected_line.get('item').setOption(option.originalInternalId, option.value);
				});

				selected_line.set('quantity', parseInt(selected_line.get('quantity'), 10));
				selected_line.set('options', this.model.get('selectedItem').get('selected_line_options'));
				selected_line.set('internalid', _.uniqueId('item_line'));
				selected_line.unset('selectedItem');
				selected_line.unset('quickaddSearch');

				//@event {QuickAdd.View.SelectedLine.Properties} selectedLine
				this.trigger('selectedLine'
					//@class QuickAdd.View.SelectedLine.Properties
				,	{
						//@property {Transaction.Line.Model} selectedLine
						selectedLine: selected_line
					});
				//@class QuickAdd.View

				this.$('[name="quantity"]').val('');
				this.$('[name="quantity"]').attr({'min':1});
				this.$('[data-type="quick-add-reset"]').hide();
				this.itemsSearcherComponent.cleanSearch();
				this.itemsSearcherComponent.setFocus();
			}
		}

		//@method setQuantity Update by removing 1 to the current quantity of the current line
		//@param {jQuery.Event} e
		//@return {Void}
	,	setQuantity: function (e)
		{
			var str_quantity = this.$(e.target).val()
			,	quantity = parseInt(str_quantity, 10)
			,	minimum_quantity = this.model.get('selectedItem').get('_minimumQuantity', true)
			,	quantity_already_set = 0;

			if (_.isFunction(this.options.getItemQuantitySet))
			{
				quantity_already_set = this.options.getItemQuantitySet(this.model.get('selectedItem').id) || 0;
			}

			if (!_.isNaN(quantity) && _.isNumber(quantity))
			{
				if (quantity_already_set + quantity < minimum_quantity)
				{
					this.$('[data-type="quantity-input"]').val(minimum_quantity);
				}
			}
		}

		// @method addQuantity Increase the product's Quantity by 1
		// @param {jQuery.Event} e
		// @return {Void}
	,	addQuantity: function (e)
		{
			e.preventDefault();

			var $element = this.$(e.target)
			,	quantity_input = $element.parent().find('input')
			,	old_value = quantity_input.val()
			,	new_val = parseFloat(old_value) + 1;

			quantity_input.val(new_val);
			quantity_input.change();
		}

		// @method subQuantity Decreases the product's Quantity by 1
		// @param {jQuery.Event} e
		// @return {Void}
	,	subQuantity: function (e)
		{
			e.preventDefault();

			var $element = this.$(e.target)
			,	quantity_input = $element.parent().find('input')
			,	old_value = quantity_input.val()
			,	new_val = parseFloat(old_value) - 1;

			new_val = Math.max(this.model.get('item').get('_minimumQuantity', true), new_val);

			quantity_input.val(new_val);
			quantity_input.change();
		}

		//@method showReset Handle when to show or hide the reset button
		//@param {ItemsSearcher.View.KeyDown.Properties} event_properties
		//@return {Void}
	,	showReset: function (event_properties)
		{
			if (event_properties.currentQuery)
			{
				this.$('[data-type="quick-add-reset"]').show();
			}
			else
			{
				this.$('[data-type="quick-add-reset"]').hide();
			}
		}

		//@method cleanSearchOnEnter Cleans the current search status
		//@param {ItemsSearcher.View.KeyDown.Properties} event_properties
		//@return {Void}
	,	cleanSearchOnEnter: function (event_properties)
		{
			if (event_properties.eventObject.keyCode === 27)
			{
				this.$('[data-type="quick-add-reset"]').hide();
				this.itemsSearcherComponent.cleanSearch();
			}
		}

		//@method onKeyDown Prevent letter e & other characters in "type=number" and allow arrows
		//@param {jQueryEvent} e
		//@return {Void}
	,	onKeyDown: function (e)
		{
			var key_code = (e.which) ? e.which : event.keyCode;

	        if (key_code > 31 && (key_code < 48 || key_code > 57) && !(key_code >= 37 || key_code <= 40)) {
	            e.preventDefault();
	        }
		}

		// @method submitOnEnter Submit the form when user presses enter in the quantity input text
		// @param {jQuery.Event} e
		//@return {Void}
	,	submitOnEnter: function (e)
		{
			if (e.keyCode === 13)
			{
				this.itemsSearcherComponent.setFocus();
			}
		}

		//@method resetHandle Handle the reset action by hiding it and cleaning the current search status
		//@return {Void}
	,	resetHandle: function ()
		{
			this.$('[data-type="quick-add-reset"]').hide();
			this.itemsSearcherComponent.cleanSearch();
			this.$('[name="quantity"]').val('');
		}

		//@method selectAll on focus select all input value
		//@return {Void}
	,	selectAll: function ()
		{
			this.$('[name="quantity"]').select();
		}

		//@method onItemSelected Handle the selection of an item of the type-ahead result
		//@param {ItemsSearcher.View.itemSelected.Properties} result
		//@return {Void}
	,	onItemSelected: function (result)
		{
			var item = result.selectedItem;

			if (item)
			{
				this.model.set('quickaddSearch', item.get('_name'));
				this.model.set('selectedItem', item);

				this.setDefaultQuantity(item.get('_minimumQuantity', true), item.get('internalid'));
				this.$('[name="quantity"]').focus();
				this.selectAll();


				var selectedItem = this.model.get('selectedItem')
				,	minimum_quantity = selectedItem.get('_minimumQuantity', true);

				if (minimum_quantity > 1)
				{
					this.$('.quick-add-box-minimum').html(_('Minimum of $(0) required').translate(minimum_quantity));
				}

				this.$('[data-validation-error="block"]').remove();
			}
			else
			{
				this.model.unset('selectedItem');
				this.$('.quick-add-box-minimum').empty();
			}
		}

		//@method setDefaultQuantity Set the default quantity based on the minimum quantity for the selected item and
		//also validate the other items into the "cart" or cart-like
		//@param {Number} minimum_quantity
		//@param {Number} item_id
		//@return {Void}
	,	setDefaultQuantity: function (minimum_quantity, item_id)
		{
			var current_quantity = parseInt(this.$('[name="quantity"]').val(), 10);

			this.$('[name="quantity"]').select();

			if (_.isFunction(this.options.getItemQuantitySet))
			{
				minimum_quantity -= this.options.getItemQuantitySet(item_id) || 0;
			}

			minimum_quantity  = minimum_quantity <= 0 ? 1 : minimum_quantity;

			if ((!_.isNumber(current_quantity) || _.isNaN(current_quantity)) || current_quantity < minimum_quantity)
			{
				this.model.set('quantity', minimum_quantity);
				this.$('[name="quantity"]').val(minimum_quantity);
				this.$('[name="quantity"]').attr('min', minimum_quantity);
			}
		}

		//@property {ChildViews} childViews
	,	childViews: {
			'ItemsSeacher': function ()
			{
				return this.itemsSearcherComponent;
			}
		}

		//@method getContext
		//@return {QuickAdd.View.Context}
	,	getContext: function ()
		{
			//@class QuickAdd.View.Context
			return {
				// @property {String} itemTitle
				itemTitle: this.options.itemTitle || _('Which item(s) would you like to add?').translate()
				// @property {String} quantityTitle
			,	quantityTitle: this.options.quantityTitle || _('Quantity').translate()
			};
			//@class QuickAdd.View
		}
	});
});

//@class QuickAdd.View.Initialize.Options
//@property {String?} itemTitle Allows to specify the title used for the items sub-component
//@property {String?} quantityTitle Allows to specify the title used for the quantity input
//@property {Function<Number,Number>} getItemQuantitySet Function that given an item id returns how many item already are present in the cart-like.
//This work to decouple this component of any other concrete implementation.
//IMPORTANT: If the passed in item id is not in the cart-like this function must return 0 (the number zero).
