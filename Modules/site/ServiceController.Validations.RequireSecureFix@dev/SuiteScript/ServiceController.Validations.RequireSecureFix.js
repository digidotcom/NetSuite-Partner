define('ServiceController.Validations.RequireSecureFix', [
    'underscore',
    'ServiceController.Validations'
], function ServiceControllerValidationsRequireSecureFix(
    _,
    ServiceControllerValidations
) {
    'use strict';

    _(ServiceControllerValidations).extend({

        /* eslint-disable */
        requireSecure: function ()
        {
            if (!~request.getURL().indexOf('https'))
            {
                throw methodNotAllowedError;
            }
        }
        /* eslint-enable */

    });
});
