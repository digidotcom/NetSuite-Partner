define('PartnerQuote', [
    'underscore',
    'CRUD',
    'PartnerQuote.Configuration',
    'PartnerQuote.Status.Configuration',
    'PartnerQuote.Product.Configuration'
], function PartnerQuote(
    _,
    Crud,
    PartnerQuoteConfiguration,
    PartnerQuoteStatusConfiguration,
    PartnerQuoteProductConfiguration
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
});
