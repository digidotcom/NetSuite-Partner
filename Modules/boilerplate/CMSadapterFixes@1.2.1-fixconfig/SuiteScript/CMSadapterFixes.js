define('CMSadapterFixes', [
    'CMSadapter.Model',
    'Configuration',
    'Models.Init',
    'Application',
    'underscore'
], function CMSSandboxFix(
    CMSAdapterModel,
    Configuration,
    CommerceAPI,
    Application,
    _
) {
    'use strict';

    _.extend(Application, {
        /**
         * Wrap environment to allow CMS even on secure domain
         * @wraps Application.getEnvironment
         */
        getEnvironment: _.wrap(Application.getEnvironment, function getEnvironmentCMSFixes(fn) {
            var useCms = Configuration.cms.useCMS && CommerceAPI.context.getSetting('FEATURE', 'ADVANCEDSITEMANAGEMENT') === 'T';
            var result = fn.apply(this, Array.prototype.slice.call(arguments, 1));
            Configuration.cms.useCMS = useCms;
            result.useCMS = useCms;
            return result;
        })
    });

    _.extend(CMSAdapterModel, {
        /**
         * Function to get pages overriden to understand molecules and datacenters.
         * Also added try/catch to response json.
         * @overrides
         * @overrideFn CMSAdapter.Model.getPages
         */
        getPages: function getPages() {
            var cmsRequestT0 = new Date().getTime();
            var cmsPagesHeader = { 'Accept': 'application/json' };
            var isSecure = request.getURL().indexOf('https:') === 0;
            var currentDomainMatch = request.getURL().match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i); // eslint-disable-line no-useless-escape
            var currentDomain = currentDomainMatch && currentDomainMatch[0];

            var environmentSubDomain;
            var cmsPagesUrl;
            var cmsPagesResponse;
            var cmsPagesResponseBody;
            var data;
            var errorFlag = false;

            switch (nlapiGetContext().getEnvironment().toString()) {
            case 'INTERNAL':
                // Internal domains usually don't have a proper domain configured
                environmentSubDomain = '.f';
                cmsPagesUrl = 'https://system' + environmentSubDomain +
                    '.netsuite.com/';
                break;
            default:
                // SANDBOX/BETA/PRODUCTION
                cmsPagesUrl = currentDomain;
            }

            // Avoid landing pages on secure domain.
            if (!isSecure) {
                cmsPagesUrl += 'api/cms/pages?site_id=' + CommerceAPI.session.getSiteSettings(['siteid']).siteid +
                    '&c=' + nlapiGetContext().getCompany() + '&{}';
                try {
                    cmsPagesResponse = nlapiRequestURL(cmsPagesUrl, null, cmsPagesHeader);
                    cmsPagesResponseBody = JSON.parse(cmsPagesResponse.getBody());
                } catch (e) {
                    errorFlag = true;
                    cmsPagesResponseBody = [];
                }
            } else {
                cmsPagesResponseBody = [];
            }

            data = {
                _debug_requestTime: (new Date().getTime()) - cmsRequestT0,
                _request_done: !isSecure,
                _error: errorFlag,
                pages: cmsPagesResponseBody
            };

            return data;
        }
    });
});
