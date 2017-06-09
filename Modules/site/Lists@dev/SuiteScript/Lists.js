define('Lists', [
    'underscore',
    'CRUD'
], function Lists(
    _,
    Crud
) {
    'use strict';

    var lists = {
        'product_interest': {
            id: 'customlist_productinterest'
        },
        'vertical': {
            id: 'customlist_vertical'
        },
        'yes_no': {
            id: 'customlist_nsts_rm_yesno'
        }
    };

    _(lists).each(function eachList(listConfig, listId) {
        Crud.addList(listId, listConfig);
    });
});
