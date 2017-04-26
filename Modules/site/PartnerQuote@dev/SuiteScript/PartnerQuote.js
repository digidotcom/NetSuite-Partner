define('PartnerQuote', [
    'underscore',
    'CRUD',
    'PartnerQuote.Configuration',
    'PartnerQuote.Product.Configuration'
], function PartnerQuote(
    _,
    Crud,
    PartnerQuoteConfiguration,
    PartnerQuoteProductConfiguration
) {
    'use strict';

    var cruds = [
        PartnerQuoteConfiguration,
        PartnerQuoteProductConfiguration
    ];

    _(cruds).each(function eachCrud(crud) {
        Crud.add(crud.id, crud);
    });
});
