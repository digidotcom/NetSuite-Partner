define('PartnerQuote', [
    'underscore',
    'CRUD',
    'PartnerQuote.Configuration',
    'PartnerQuote.Status.Configuration',
    'PartnerQuote.Product.Configuration',
    'PartnerQuote.Lists.Configuration'
], function PartnerQuote(
    _,
    Crud,
    PartnerQuoteConfiguration,
    PartnerQuoteStatusConfiguration,
    PartnerQuoteProductConfiguration,
    PartnerQuoteListsConfiguration
) {
    'use strict';

    var cruds = [
        PartnerQuoteConfiguration,
        PartnerQuoteStatusConfiguration,
        PartnerQuoteProductConfiguration
    ];

    _(cruds).each(function eachCrud(crud) {
        Crud.add(crud.id, crud);
    });

    _(PartnerQuoteListsConfiguration).each(function eachList(listConfig, listId) {
        Crud.addList(listId, listConfig);
    });
});
