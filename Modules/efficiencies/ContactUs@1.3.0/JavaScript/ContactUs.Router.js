define('ContactUs.Router', [
    'ContactUs.Model',
    'ContactUs.View',
    'Backbone',
    'underscore',
    'Utils'
], function ContactUsRouter(
    Model,
    View,
    Backbone,
    _
) {
    'use strict';

    return Backbone.Router.extend({
        routes: {
            'contact-us': 'contactUs'
        },
        initialize: function initialize(application) {
            this.application = application;
        },

        contactUs: function contactUs(options) {
            var view = new View({
                application: this.application,
                params: _.parseUrlOptions(options),
                model: new Model()
            });

            view.showContent();
        }
    });
});
