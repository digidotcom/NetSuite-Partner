define('Registration.Status.Model', [
    'underscore',
    'SC.Model'
], function RegistratioStatusModel(
    _,
    SCModel
) {
    'use strict';

    return SCModel.extend({
        name: 'Registration.Status',

        list: function list() {
            return [
                {
                    internalid: 1,
                    name: 'Approved'
                },
                {
                    internalid: 2,
                    name: 'Expired'
                },
                {
                    internalid: 3,
                    name: 'Open'
                },
                {
                    internalid: 4,
                    name: 'Not Submitted'
                },
                {
                    internalid: 5,
                    name: 'Pending'
                },
                {
                    internalid: 6,
                    name: 'Rejected'
                }
            ];
        }
    });
});
