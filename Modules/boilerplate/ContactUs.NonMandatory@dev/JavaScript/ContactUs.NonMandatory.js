define('ContactUs.NonMandatory', [
    'underscore',
    'SC.Configuration',
    'ContactUs'
], function ContactUsNonMandatory(
    _,
    Configuration,
    ContactUs
) {
    'use strict';

    _(ContactUs).extend({
        mountToApp: _(ContactUs.mountToApp).wrap(function mountToAppWrap(fn) {
            var config = Configuration.get('commerceSuiteSolution.contactUs', {});
            if (config.enabled) {
                return fn.apply(this, Array.prototype.slice.call(arguments, 1));
            }
            return null;
        })
    });
});
