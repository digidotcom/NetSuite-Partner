define('ServiceController.Validations.RequireLoginFix', [
    'underscore',
    'ServiceController.Validations'
], function ServiceControllerValidationsRequireLoginFix(
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
