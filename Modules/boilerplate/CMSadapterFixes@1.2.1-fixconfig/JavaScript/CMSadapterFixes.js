define('CMSadapterFixes', [
    'jQuery',
    'underscore',
    'Backbone',
    'Utils'
], function CMSadapterFixes(
    jQuery,
    _,
    Backbone,
    Utils
) {
    'use strict';

    return {
        mountToApp: function mountToApp() {
            /**
             * This CMS fix is for when templates change according to device type
             * and CMS zones appear/desappear accordingly
             * Otherwise, zones get empty on resize
             */
            var previousDevice = Utils.getDeviceType();
            jQuery(window).on('resize', _.throttle(function adapterTrigger() {
                var newDevice = Utils.getDeviceType();
                if (newDevice !== previousDevice) {
                    previousDevice = newDevice;
                    Backbone.Events.trigger('adapter:page:changed');
                }
            }, 300));
        }
    };
});
