define('ContactUs.Model', [
    'Backbone',
    'underscore',
    'Utils'
], function ContactUsModel(
    Backbone,
    _,
    Utils
) {
    'use strict';

    return Backbone.Model.extend({
        urlRoot: Utils.getAbsoluteUrl('services/ContactUs.Service.ss'),
        validation: {
            firstname: {
                required: true,
                msg: _('First name is required').translate()
            },
            lastname: {
                required: true,
                msg: _('Last name is required').translate()
            },
            email: {
                required: true,
                pattern: 'email',
                msg: _('Please provide a valid email').translate()
            },
            title: {
                required: true,
                msg: _('Title name is required').translate()
            },
            incomingmessage: {
                required: true,
                msg: _('A message is required').translate()
            }
        }
    });
});