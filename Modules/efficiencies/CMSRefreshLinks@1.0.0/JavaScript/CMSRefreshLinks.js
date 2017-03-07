// Add "data-cms-refresh" attribute to the desired DOM elements
define('CMSRefreshLinks', [
    'jQuery'
], function CMSRefreshLinks(
    jQuery
) {
    'use strict';

    var Module = {

        refreshAttr: 'data-cms-refresh',

        refreshCmsAreas: function refreshLinks() {
            /* jshint -W117 */
            /* eslint-disable no-undef */
            if (typeof CMS !== 'undefined') {
                CMS.trigger('adapter:page:changed');
            }
            /* eslint-enable no-undef */
            /* jshint +W117 */
        },

        mountToApp: function mountToApp(application) {
            var layout = application.getLayout();

            layout.mouseUp.install({
                name: 'mouseUpRefreshCmsAreas',
                priority: 30,
                execute: function execute(e) {
                    setTimeout(function timeout() {
                        if (jQuery('html').hasClass('ns_is-admin') &&
                            jQuery(e.currentTarget).is('[' + Module.refreshAttr + ']')) {
                            Module.refreshCmsAreas();
                        }
                    }, 0);
                }
            });
        }
    };

    return Module;
});