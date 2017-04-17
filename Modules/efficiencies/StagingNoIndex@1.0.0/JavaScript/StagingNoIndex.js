define('StagingNoIndex', [
    'jQuery'
], function StagingNoIndex(
    jQuery
) {
    'use strict';

    /**
     * Module to prevent any site with our netsuitestaging domains to be indexed by google
     * Without having to care on robots.txt
     * which are re-writed with sandbox refreshes
     */
    return {
        stagingDomain: '.netsuitestaging.com',

        isStagingDomain: function isStagingDomain() {
            return (location.hostname.indexOf(this.stagingDomain, location.hostname.length - this.stagingDomain.length) !== -1);
        },

        mountToApp: function mountToApp() {
            var $head;
            var $meta;
            if (this.isStagingDomain()) {
                $head = jQuery('head');
                $meta = $head.find('meta[name="robots"]');
                if ($meta.length > 0) {
                    $meta.attr('content', 'noindex, nofollow');
                } else {
                    $meta = jQuery('<meta name="robots" content="noindex, nofollow">');
                    $head.append($meta);
                }
            }
        }
    };
});