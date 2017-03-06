define('Registration.Status.View', [
    'underscore',
    'Backbone',
    'registration_status.tpl'
], function RegistrationStatusView(
    _,
    Backbone,
    registrationStatusTpl
) {
    'use strict';

    return Backbone.View.extend({

        template: registrationStatusTpl,

        initialize: function initialize(options) {
            this.collection = options.collection;
            this.active = options.active;
        },

        getContext: function getContext() {
            var collection = this.collection;
            var active = this.active;
            var statuses = [];
            if (collection.length) {
                collection.each(function eachCollection(status) {
                    var id = parseInt(status.get('internalid'), 10);
                    statuses.push({
                        name: status.get('name'),
                        value: id,
                        isActive: id === active
                    });
                });
            }
            return {
                statuses: statuses
            };
        }
    });
});
