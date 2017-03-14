define('Registration.List.Actions.View', [
    'underscore',
    'Backbone',
    'Registration.Helper',
    'registration_list_actions.tpl'
], function RegistrationListActionsView(
    _,
    Backbone,
    RegistrationHelper,
    registrationListActionsTpl
) {
    'use strict';

    return Backbone.View.extend({

        template: registrationListActionsTpl,

        events: {},

        getContext: function getContext() {
            var record = this.model.get('record');
            if (record && record.get('internalid')) {
                return {
                    editUrl: RegistrationHelper.getEditUrl(record.get('internalid'))
                };
            }
            return {};
        }
    });
});
