// change to the site id and fields you want to use
var settings = {
    site_id: 9999,
    fieldsets: [
        {
            name: 'Search',
            id: 'search',
            fields: [
                'itemimages_detail',
                'onlinecustomerprice',
                'onlinecustomerprice_detail',
                'displayname',
                'internalid',
                'itemid',
                'outofstockbehavior',
                'outofstockmessage',
                'stockdescription',
                'storedescription',
                'storedisplayname2',
                'storedisplaythumbnail',
                'urlcomponent',
                'isbackorderable',
                'ispurchasable',
                'isinstock',
                'custitem_ns_pr_rating',
                'custitem_ns_pr_count'
            ]
        },
        {
            name: 'Typeahead',
            id: 'typeahead',
            fields: [
                'itemimages_detail',
                'onlinecustomerprice',
                'onlinecustomerprice_detail',
                'displayname',
                'internalid',
                'itemid',
                'storedisplayname2',
                'storedisplaythumbnail',
                'urlcomponent'
            ]
        },
        {
            name: 'Matrix Child Items',
            id: 'matrixchilditems',
            fields: [
                'onlinecustomerprice',
                'onlinecustomerprice_detail',
                'quantityavailable',
                'internalid',
                'outofstockbehavior',
                'outofstockmessage',
                'stockdescription',
                'isbackorderable',
                'ispurchasable',
                'isinstock'
            ]
        },
        {
            name: 'Details',
            id: 'details',
            fields: [
                'displayname',
                'description',
                'itemid',
                'outofstockmessage',
                'outofstockbehavior',
                'showoutofstockmessage',
                'storedisplayimage',
                'quantityavailable',
                'stockdescription',
                'itemimages_detail',
                'featureddescription',
                'storedetaileddescription',
                'itemoptions_detail',
                'matrixchilditems_detail',
                'onlinecustomerprice',
                'onlinecustomerprice_detail',
                'pagetitle2',
                'internalid',
                'isinactive',
                'isonline',
                'itemtype',
                'pagetitle',
                'storedescription2',
                'storedisplayname2',
                'urlcomponent',
                'isbackorderable',
                'ispurchasable',
                'isinstock',
                'custitem_ns_pr_attributes_rating',
                'custitem_ns_pr_item_attributes',
                'custitem_ns_pr_rating',
                'custitem_ns_pr_rating_by_rate',
                'custitem_ns_pr_count',
                'storedescription'
            ]
        },
        {
            name: 'Order',
            id: 'order',
            fields: [
                'displayname',
                'description',
                'itemid',
                'outofstockmessage',
                'outofstockbehavior',
                'showoutofstockmessage',
                'storedisplayimage',
                'quantityavailable',
                'stockdescription',
                'itemimages_detail',
                'featureddescription',
                'storedetaileddescription',
                'itemoptions_detail',
                'matrixchilditems_detail',
                'onlinecustomerprice',
                'onlinecustomerprice_detail',
                'pagetitle2',
                'internalid',
                'isinactive',
                'isonline',
                'itemtype',
                'pagetitle',
                'storedescription2',
                'storedisplayname2',
                'urlcomponent',
                'isbackorderable',
                'ispurchasable',
                'isinstock'
            ]
        },
        {
            name: 'Related Items',
            id: 'relateditems',
            fields: [
                'itemimages_detail',
                'itemoptions_detail',
                'onlinecustomerprice',
                'onlinecustomerprice_detail',
                'quantityavailable',
                'displayname',
                'internalid',
                'itemid',
                'outofstockbehavior',
                'outofstockmessage',
                'stockdescription',
                'storedescription',
                'storedisplayname2',
                'storedisplaythumbnail',
                'urlcomponent',
                'isbackorderable',
                'ispurchasable',
                'isinstock'
            ]
        },
        {
            name: 'Related Items Details',
            id: 'relateditems_details',
            fields: [
                'internalid',
                'relateditems_detail'
            ]
        },
        {
            name: 'Correlated Items',
            id: 'correlateditems',
            fields: [
                'itemimages_detail',
                'itemoptions_detail',
                'onlinecustomerprice',
                'onlinecustomerprice_detail',
                'quantityavailable',
                'displayname',
                'internalid',
                'outofstockbehavior',
                'outofstockmessage',
                'stockdescription',
                'storedescription',
                'storedisplayname2',
                'storedisplaythumbnail',
                'urlcomponent',
                'isbackorderable',
                'ispurchasable',
                'isinstock'
            ]
        },
        {
            name: 'Correlated Items Details',
            id: 'correlateditems_details',
            fields: [
                'internalid',
                'correlateditems_detail'
            ]
        }
    ]
};

var siteRecord = nlapiLoadRecord('website', settings.site_id);

for(var i = 0; i < settings.fieldsets.length; i++) {
    var fieldset = settings.fieldsets[i];
    siteRecord.selectNewLineItem('fieldset');
    siteRecord.setCurrentLineItemValue('fieldset', 'fieldsetname', fieldset.name);
    siteRecord.setCurrentLineItemValue('fieldset', 'fieldsetid', fieldset.id);
    siteRecord.setCurrentLineItemValue('fieldset', 'fieldsetrecordtype', 'ITEM');
    siteRecord.setCurrentLineItemValue('fieldset', 'fieldsetfields', fieldset.fields.join(','));
    siteRecord.commitLineItem('fieldset');
}

nlapiSubmitRecord(siteRecord);