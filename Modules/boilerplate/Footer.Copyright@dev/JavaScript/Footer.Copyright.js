define('Footer.Copyright', [
    'underscore'
], function FooterCopyright(
    _
) {
    'use strict';

    return {
        getModuleConfig: function getModuleConfig(application) {
            var configuration = application.getConfig('footer.copyright');
            // override config via code here if needed (preferred through SC Configuration record though)
            var defaults = {
                // hide: false,
                // name: "Company Name",
                // initialYear: new Date().getFullYear(),
            };
            return _.defaults(
                configuration || {},
                defaults
            );
        },
        contextExecute: function contextExecute(application, context) {
            var moduleConfig = this.getModuleConfig(application);
            var hide = !!moduleConfig.hide;
            var companyName = moduleConfig.companyName;
            var initialYear = moduleConfig.initialYear ? parseInt(moduleConfig.initialYear, 10) : new Date().getFullYear();
            var currentYear = new Date().getFullYear();
            _.extend(context, {
                copyright: {
                    hide: hide,
                    companyName: companyName,
                    initialYear: initialYear,
                    currentYear: currentYear,
                    showRange: initialYear < currentYear
                }
            });
        }
    };
});
