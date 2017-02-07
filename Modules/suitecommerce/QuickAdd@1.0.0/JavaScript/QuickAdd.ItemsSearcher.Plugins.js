/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module QuickAdd
define('QuickAdd.ItemsSearcher.Plugins'
,	[
		'ItemDetails.Model'

	,	'underscore'
	]
,	function (
		ItemDetailsModel

	,	_
	)
{
	'use strict';

	//@class QuickAdd.ItemsSearcher.Plugins
	return {
		//@property {QuickAdd.ItemsSearcher.Pluguns.flatItemsMatrixResult} flatItemsMatrixResult
		//@class QuickAdd.ItemsSearcher.Pluguns.flatItemsMatrixResult @extend Plugin
		flatItemsMatrixResult: {
			name: 'flatItemsMatrixResult'
		,	priotity: 10
			//@method execute
			//@param {ItemsSearcher.Collection} collection
			//@param {ItemsSearcher.View.Options} configuration
			//@return {ItemsSearcher.Collection}
		,	execute: function (collection, configuration)
			{
				//Current item that is begin processed
				var items = []
				//array used to emulate line options in the item
				,	fake_line_options = []
				//Variable that contains the new item created from all parent matrix items to generated one items per child
				//We do this to flat the list of items in the collection
				,	cloned_item
				//List of option for the current child item
				,	item_options;

				collection.each(function (item)
				{
					if (item.get('_matrixChilds') && item.get('_matrixChilds').length)
					{
						item_options = _.where(item.getPosibleOptions(), {isMatrixDimension: true});

						item.get('_matrixChilds').each(function (child_item)
						{
							//This is made to emulate the selected options.
							//Each time the item's selected options are displayed the information shown is extracted from a line
							//(an OrderLine.Model to be precise) that is returned from the back-end (Commerce API).
							//This info is the used by ItemViews.SlectedOption.View to show each option
							fake_line_options = [];

							cloned_item = new ItemDetailsModel(_.extend({}, item.attributes, child_item.attributes));

							_.each(item_options, function (option)
							{
								var selected_child_item_option_label = child_item.get(option.itemOptionId)
								,	selected_option_value_object = _.findWhere(option.values, {label: selected_child_item_option_label});

								cloned_item.setOption(option.cartOptionId, selected_option_value_object.internalid);

								//Here we create a fake line option based on the set item option in the line above
								fake_line_options.push(
									{
										displayvalue: selected_option_value_object.label
									,	id: option.cartOptionId.toUpperCase()
									,	originalInternalId: option.cartOptionId
									,	name: option.label
									,	value: selected_option_value_object.internalid
									}
								);
							});
							cloned_item.set('selected_line_options', fake_line_options);
							cloned_item.set('isfulfillable', item.get('isfulfillable'));

							items.push(cloned_item);
						});
					}
					else
					{
						items.push(item);
					}
				});

				items = _.filter(items, function (item)
				{
					var query_on_sku = (item.get('_sku') ? item.get('_sku').toUpperCase() : '').indexOf(configuration.query.toUpperCase()) >= 0
					,	query_on_name = (item.get('_name') ? item.get('_name').toUpperCase() : '').indexOf(configuration.query.toUpperCase()) >= 0
					,	item_not_gift_certificate = item.get('itemtype') !== 'GiftCert';

					return item_not_gift_certificate && (query_on_name || query_on_sku);
				});

				collection.reset(_.first(items, configuration.limit), {silent: true});

				return collection;
			}
		}
		//@class QuickAdd.ItemsSearcher.Plugins
	};
});