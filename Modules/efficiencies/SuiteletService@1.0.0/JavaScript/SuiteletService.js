define('SuiteletService', [
    'Backbone',
    'underscore',
    'jQuery',
    'Utils'
], function SuiteletService(
    Backbone,
    _,
    jQuery,
    Utils
) {

    resolveSuiteletURL: function resolveSuiteletURL(script, deploy) {

        var url;
        var base;
        var svcs;
        var key;

        url = '';
        base = '';
        svcs = SC.ENVIRONMENT.published.SuiteletService.resolvedServices;
        key = script + ',' + deploy;

        if (svcs && svcs[key]) {
            base = svcs[script + ',' + deploy];
        } else {
            console.error('Misconfigured Suitelet');
        }

        url = base + (~base.indexOf('?') ? '&' : '?') + jQuery.param({
            // Account Number
            c: SC.ENVIRONMENT.companyId,
            // Site Number
            n: SC.ENVIRONMENT.siteSettings.siteid
        });

        return url;
    }
    _.extend(SC.Utils, {resolveSuiteletURL: resolveSuiteletURL });
    _.mixin({resolveSuiteletURL: resolveSuiteletURL });
});