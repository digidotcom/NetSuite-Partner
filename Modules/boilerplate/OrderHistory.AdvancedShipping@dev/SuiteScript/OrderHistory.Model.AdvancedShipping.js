/* eslint-disable */
define('OrderHistory.Model.AdvancedShipping', [
    'underscore',
    'Application',
    'Utils',
    'OrderHistory.Model'
], function OrderHistoryAdditionalFields(
    _,
    Application,
    Utils,
    OrderHistoryModel
) {
    'use strict';

    _(OrderHistoryModel).extend({
        getFulfillments: function ()
        {
            this.result.fulfillments = {};

            var self = this
                , isAdvancedShippingEnabled = Utils.isFeatureEnabled('PICKPACKSHIP')
                ,	filters = [
                new nlobjSearchFilter('internalid', null, 'is', this.result.internalid)
                ,	new nlobjSearchFilter('mainline', null, 'is', 'F')
                ,	new nlobjSearchFilter('shipping', null, 'is', 'F')
                ,	new nlobjSearchFilter('taxline', null, 'is', 'F')
            ]
                ,	columns = [
                    new nlobjSearchColumn('line')
                ,   new nlobjSearchColumn('fulfillingtransaction')
                ,	new nlobjSearchColumn('actualshipdate')
                ,	new nlobjSearchColumn('quantity','fulfillingtransaction')
                ,	new nlobjSearchColumn('item','fulfillingtransaction')
                ,	new nlobjSearchColumn('shipmethod','fulfillingtransaction')
                ,	new nlobjSearchColumn('shipto','fulfillingtransaction')
                ,	new nlobjSearchColumn('trackingnumbers','fulfillingtransaction')
                ,	new nlobjSearchColumn('trandate','fulfillingtransaction')
                ,	new nlobjSearchColumn('status','fulfillingtransaction')

                // Ship Address
                ,	new nlobjSearchColumn('shipaddress','fulfillingtransaction')
                ,	new nlobjSearchColumn('shipaddress1','fulfillingtransaction')
                ,	new nlobjSearchColumn('shipaddress2','fulfillingtransaction')
                ,	new nlobjSearchColumn('shipaddressee','fulfillingtransaction')
                ,	new nlobjSearchColumn('shipattention','fulfillingtransaction')
                ,	new nlobjSearchColumn('shipcity','fulfillingtransaction')
                ,	new nlobjSearchColumn('shipcountry','fulfillingtransaction')
                ,	new nlobjSearchColumn('shipstate','fulfillingtransaction')
                ,	new nlobjSearchColumn('shipzip','fulfillingtransaction')
            ];

            if(isAdvancedShippingEnabled)
            {
                columns.push(new nlobjSearchColumn('quantitypicked'));
                columns.push(new nlobjSearchColumn('quantitypacked'));
                columns.push(new nlobjSearchColumn('quantityshiprecv'));
            }

            Application.getAllSearchResults('salesorder', filters, columns).forEach(function (ffline)
            {
                var fulfillment_id = ffline.getValue('fulfillingtransaction')
                    ,	line_internalid = self.result.internalid + '_' + ffline.getValue('line')
                    ,	line = _.findWhere(self.result.lines, {internalid: line_internalid});

                if (fulfillment_id)
                {
                    var shipaddress = self.addAddress({
                        internalid: ffline.getValue('shipaddress', 'fulfillingtransaction')
                        ,	country: ffline.getValue('shipcountry', 'fulfillingtransaction')
                        ,	state: ffline.getValue('shipstate', 'fulfillingtransaction')
                        ,	city: ffline.getValue('shipcity', 'fulfillingtransaction')
                        ,	zip: ffline.getValue('shipzip', 'fulfillingtransaction')
                        ,	addr1: ffline.getValue('shipaddress1', 'fulfillingtransaction')
                        ,	addr2: ffline.getValue('shipaddress2', 'fulfillingtransaction')
                        ,	attention: ffline.getValue('shipattention', 'fulfillingtransaction')
                        ,	addressee: ffline.getValue('shipaddressee', 'fulfillingtransaction')
                    }, self.result);

                    self.result.fulfillments[fulfillment_id] = self.result.fulfillments[fulfillment_id] || {
                            internalid: fulfillment_id
                            ,	shipaddress: shipaddress
                            ,	shipmethod: self.addShippingMethod({
                                internalid : ffline.getValue('shipmethod','fulfillingtransaction')
                                ,	name : ffline.getText('shipmethod','fulfillingtransaction')
                            })
                            ,	date: ffline.getValue('actualshipdate')
                            ,	trackingnumbers: ffline.getValue('trackingnumbers','fulfillingtransaction') ? ffline.getValue('trackingnumbers','fulfillingtransaction').split('<BR>') : null
                            ,	lines: []
                            ,	status: {
                                internalid: ffline.getValue('status','fulfillingtransaction')
                                ,	name: ffline.getText('status','fulfillingtransaction')
                            }
                            ,
                        };

                    self.result.fulfillments[fulfillment_id].lines.push({
                        internalid: line_internalid
                        ,	quantity: parseInt(ffline.getValue('quantity','fulfillingtransaction'), 10)
                    });
                }

                if (line && isAdvancedShippingEnabled)
                {
                    line.quantityfulfilled = parseInt(ffline.getValue('quantityshiprecv') || 0, 10);
                    line.quantitypacked = parseInt(ffline.getValue('quantitypacked') || 0, 10) - line.quantityfulfilled;
                    line.quantitypicked = parseInt(ffline.getValue('quantitypicked') || 0, 10) - line.quantitypacked - line.quantityfulfilled;
                    line.quantitybackordered = line.quantity - line.quantityfulfilled - line.quantitypacked - line.quantitypicked;
                }

            });

            this.result.fulfillments = _.values(this.result.fulfillments);
        }

    });

});
