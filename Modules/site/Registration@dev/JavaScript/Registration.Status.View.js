define('Registration.Status.View', [
    'underscore',
    'Backbone',
    'Utils',
    'Registration.Helper',
    'registration_status.tpl'
], function RegistrationStatusView(
    _,
    Backbone,
    Utils,
    RegistrationHelper,
    registrationStatusTpl
) {
    'use strict';

    return Backbone.View.extend({

        template: registrationStatusTpl,

        initialize: function initialize(options) {
            this.collection = options.collection;
            this.active = options.active;
        },

        getStatusContext: function getStatusContext(model, active) {
            var params = {};
            var id = null;
            var name = RegistrationHelper.statusAllName;
            var isActive = !active;
            if (model) {
                id = parseInt(model.get('internalid'), 10);
                name = model.get('name');
                params[RegistrationHelper.statusParamKey] = id;
                isActive = id === active;
            }
            return {
                name: name,
                value: id,
                url: Utils.addParamsToUrl(RegistrationHelper.getListUrl(), params),
                isActive: isActive
            };
        },

        getContext: function getContext() {
            var self = this;
            var collection = this.collection;
            var active = this.active;
            var statuses = [
                self.getStatusContext(null, active)
            ];
            if (collection.length) {
                collection.each(function eachCollection(status) {
                    statuses.push(self.getStatusContext(status, active));
                });
            }
            return {
                statuses: statuses
            };
        }
    });
});
