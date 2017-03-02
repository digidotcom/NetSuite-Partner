// jQuery.ajaxSetup.js
// -------------------

define('jQuery.ajaxSetup', [
    'NProgress',
    'SC.Configuration',
    'underscore',
    'jQuery',
    'Utils'
],
function jQueryAjaxSetup(
    NProgress,
    Configuration,
    _,
    jQuery
) {
    'use strict';

    var $document;
    // example of NProgress setup
    NProgress.configure({
        minimum: Configuration.themes.nprogress.minimumProgress,
        ease: Configuration.themes.nprogress.ease,
        speed: Configuration.themes.nprogress.speed,
        showSpinner: Configuration.themes.nprogress.showSpinner,
        trickleRate: Configuration.themes.nprogress.trickleRate,
        trickleSpeed: Configuration.themes.nprogress.trickleSpeed
    });

    // This registers an event listener to any ajax call
    if (typeof nsglobal === 'undefined') {
        $document = jQuery(document)
        // http://api.jquery.com/ajaxStart/
            .ajaxStart(NProgress.start)
            // http://api.jquery.com/ajaxStop/
            .ajaxStop(NProgress.done);
    }

    // fix to solve APM issue (timebrowser timing):
    // https://confluence.corp.netsuite.com/display/SCRUMPSGSVCS/RUM+API+Issues+and+Enhancements
    if (_.result(SC.ENVIRONMENT, 'SENSORS_ENABLED')) {
        $document.ajaxStop(function documentAjaxStop() {
            if (typeof window.NLRUM !== 'undefined') {
                window.NLRUM.mark('done');
            }
        });
    }

    // http://api.jquery.com/jQuery.ajaxSetup/
    jQuery.ajaxSetup({
        beforeSend: function beforeSend(jqXhr, options) {
            if (options.contentType.indexOf('charset') === -1) {
                // If there's no charset, we set it to UTF-8
                jqXhr.setRequestHeader('Content-Type', options.contentType + '; charset=UTF-8');
            }
        }
    });
});
